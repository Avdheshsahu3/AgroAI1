package com.agroai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmerId;

    @Column(nullable = false)
    private String location;

    private Double latitude;
    private Double longitude;
    private Double temperature;
    private Double humidity;
    private Double rainfall;

    @Lob
    private String forecastJson;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public WeatherData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }

    public String getForecastJson() { return forecastJson; }
    public void setForecastJson(String forecastJson) { this.forecastJson = forecastJson; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
