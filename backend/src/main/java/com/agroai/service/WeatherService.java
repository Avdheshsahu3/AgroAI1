package com.agroai.service;

import com.agroai.config.ExternalServiceException;
import com.agroai.config.NoSuchElementFoundException;
import com.agroai.dto.WeatherResponse;
import com.agroai.model.WeatherData;
import com.agroai.repository.WeatherDataRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Section 6 of the spec: location -> geocode -> weather, always dynamic
 * (never a hardcoded "if location == X" branch). Open-Meteo is used because
 * it needs no API key for the initial working version; OpenWeatherMap can be
 * swapped in later using the same WeatherResponse shape.
 */
@Service
public class WeatherService {

    private final RestTemplate restTemplate;
    private final WeatherDataRepository weatherDataRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${weather.geocode-url}")
    private String geocodeUrl;

    @Value("${weather.forecast-url}")
    private String forecastUrl;

    public WeatherService(RestTemplate restTemplate, WeatherDataRepository weatherDataRepository) {
        this.restTemplate = restTemplate;
        this.weatherDataRepository = weatherDataRepository;
    }

    public WeatherResponse getWeatherForLocation(String location, Long farmerId) {
        double[] latLng = geocode(location);
        WeatherResponse response = fetchForecast(location, latLng[0], latLng[1]);

        // Persist the latest snapshot (section 17: weather_data table).
        WeatherData record = new WeatherData();
        record.setFarmerId(farmerId);
        record.setLocation(location);
        record.setLatitude(latLng[0]);
        record.setLongitude(latLng[1]);
        record.setTemperature(response.getTemperature());
        record.setHumidity(response.getHumidity());
        record.setRainfall(response.getRainfall());
        try {
            record.setForecastJson(mapper.writeValueAsString(response.getForecast()));
        } catch (Exception ignored) { /* forecast persistence is best-effort */ }
        weatherDataRepository.save(record);

        return response;
    }

    public WeatherData getLatestSaved(Long farmerId) {
        return weatherDataRepository.findFirstByFarmerIdOrderByRecordedAtDesc(farmerId)
                .orElseThrow(() -> new NoSuchElementFoundException("No weather data recorded yet for this farmer"));
    }

    private double[] geocode(String location) {
        // Geocode using just the first comma-separated segment (e.g. "Jabalpur" from
        // "Jabalpur, Madhya Pradesh") - Open-Meteo's geocoder matches place names best this way.
        String query = location.split(",")[0].trim();
        String url = UriComponentsBuilder.fromHttpUrl(geocodeUrl)
                .queryParam("name", query)
                .queryParam("count", 1)
                .queryParam("language", "en")
                .queryParam("format", "json")
                .toUriString();
        try {
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            JsonNode results = root != null ? root.get("results") : null;
            if (results == null || !results.isArray() || results.isEmpty()) {
                throw new NoSuchElementFoundException("Location not found: " + location);
            }
            JsonNode first = results.get(0);
            return new double[]{first.get("latitude").asDouble(), first.get("longitude").asDouble()};
        } catch (RestClientException e) {
            throw new ExternalServiceException("Weather API unavailable while resolving location");
        }
    }

    private WeatherResponse fetchForecast(String location, double lat, double lng) {
        String url = UriComponentsBuilder.fromHttpUrl(forecastUrl)
                .queryParam("latitude", lat)
                .queryParam("longitude", lng)
                .queryParam("current", "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code")
                .queryParam("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum")
                .queryParam("timezone", "auto")
                .queryParam("forecast_days", 7)
                .toUriString();

        JsonNode root;
        try {
            root = restTemplate.getForObject(url, JsonNode.class);
        } catch (RestClientException e) {
            throw new ExternalServiceException("Weather API unavailable. Please try again shortly.");
        }
        if (root == null) {
            throw new ExternalServiceException("Weather API returned no data");
        }

        WeatherResponse response = new WeatherResponse();
        response.setLocation(location);
        response.setLatitude(lat);
        response.setLongitude(lng);

        JsonNode current = root.get("current");
        double currentHumidity = 0;
        if (current != null) {
            response.setTemperature(current.path("temperature_2m").asDouble());
            currentHumidity = current.path("relative_humidity_2m").asDouble();
            response.setHumidity(currentHumidity);
            response.setRainfall(current.path("precipitation").asDouble());
            response.setWindSpeed(current.path("wind_speed_10m").asDouble());
            response.setCondition(describeWeatherCode(current.path("weather_code").asInt(-1)));
        }

        List<WeatherResponse.DailyForecast> forecast = new ArrayList<>();
        JsonNode daily = root.get("daily");
        if (daily != null) {
            JsonNode times = daily.path("time");
            JsonNode tMax = daily.path("temperature_2m_max");
            JsonNode tMin = daily.path("temperature_2m_min");
            JsonNode precip = daily.path("precipitation_sum");
            JsonNode codes = daily.path("weather_code");
            for (int i = 0; i < times.size(); i++) {
                WeatherResponse.DailyForecast d = new WeatherResponse.DailyForecast();
                String dateStr = times.get(i).asText();
                LocalDate date = LocalDate.parse(dateStr);
                String dayLabel = i == 0 ? "Today" : i == 1 ? "Tomorrow"
                        : date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                d.setDay(dayLabel);
                d.setDate(dateStr);
                d.setTemperatureMax(tMax.get(i).asDouble());
                d.setTemperatureMin(tMin.get(i).asDouble());
                d.setRainfall(precip.get(i).asDouble());
                // Open-Meteo's free daily aggregate doesn't reliably expose mean RH across all
                // regions, so we approximate each day's humidity with the current reading.
                d.setHumidity(currentHumidity);
                d.setCondition(describeWeatherCode(codes.get(i).asInt(-1)));
                forecast.add(d);
            }
        }
        response.setForecast(forecast);
        if (response.getTemperature() == 0 && !forecast.isEmpty()) {
            // current block missing (rare) - fall back to today's forecast midpoint
            response.setTemperature((forecast.get(0).getTemperatureMax() + forecast.get(0).getTemperatureMin()) / 2);
        }
        response.setTemperatureMin(forecast.isEmpty() ? response.getTemperature() : forecast.get(0).getTemperatureMin());
        response.setTemperatureMax(forecast.isEmpty() ? response.getTemperature() : forecast.get(0).getTemperatureMax());
        return response;
    }

    private String describeWeatherCode(int code) {
        // WMO weather interpretation codes, as used by Open-Meteo.
        if (code == 0) return "Clear Sky";
        if (code >= 1 && code <= 3) return "Partly Cloudy";
        if (code == 45 || code == 48) return "Fog";
        if (code >= 51 && code <= 57) return "Drizzle";
        if (code >= 61 && code <= 67) return "Rain";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Rain Showers";
        if (code >= 85 && code <= 86) return "Snow Showers";
        if (code >= 95) return "Thunderstorm";
        return "Unknown";
    }
}
