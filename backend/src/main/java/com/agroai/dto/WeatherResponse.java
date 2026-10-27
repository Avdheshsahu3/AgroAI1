package com.agroai.dto;

import java.util.List;

public class WeatherResponse {
    private String location;
    private double latitude;
    private double longitude;
    private double temperature;
    private double temperatureMin;
    private double temperatureMax;
    private double humidity;
    private double rainfall;
    private double windSpeed;
    private String condition;
    private List<DailyForecast> forecast;

    public static class DailyForecast {
        private String day;
        private String date;
        private double temperatureMax;
        private double temperatureMin;
        private double rainfall;
        private double humidity;
        private String condition;

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public double getTemperatureMax() { return temperatureMax; }
        public void setTemperatureMax(double temperatureMax) { this.temperatureMax = temperatureMax; }
        public double getTemperatureMin() { return temperatureMin; }
        public void setTemperatureMin(double temperatureMin) { this.temperatureMin = temperatureMin; }
        public double getRainfall() { return rainfall; }
        public void setRainfall(double rainfall) { this.rainfall = rainfall; }
        public double getHumidity() { return humidity; }
        public void setHumidity(double humidity) { this.humidity = humidity; }
        public String getCondition() { return condition; }
        public void setCondition(String condition) { this.condition = condition; }
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    public double getTemperatureMin() { return temperatureMin; }
    public void setTemperatureMin(double temperatureMin) { this.temperatureMin = temperatureMin; }
    public double getTemperatureMax() { return temperatureMax; }
    public void setTemperatureMax(double temperatureMax) { this.temperatureMax = temperatureMax; }
    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }
    public double getRainfall() { return rainfall; }
    public void setRainfall(double rainfall) { this.rainfall = rainfall; }
    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public List<DailyForecast> getForecast() { return forecast; }
    public void setForecast(List<DailyForecast> forecast) { this.forecast = forecast; }
}
