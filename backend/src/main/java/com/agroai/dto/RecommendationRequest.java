package com.agroai.dto;

import jakarta.validation.constraints.*;

public class RecommendationRequest {
    @NotNull @Min(0) private Double nitrogen;
    @NotNull @Min(0) private Double phosphorus;
    @NotNull @Min(0) private Double potassium;
    @NotNull @DecimalMin("0.0") @DecimalMax("14.0") private Double ph;
    @NotNull @DecimalMin("0.0") @DecimalMax("100.0") private Double moisture;
    private Double temperature;
    @DecimalMin("0.0") @DecimalMax("100.0") private Double humidity;
    @Min(0) private Double rainfall;
    private String previousCrop;
    @NotBlank private String location;
    private Long farmerId;

    public Double getNitrogen() { return nitrogen; }
    public void setNitrogen(Double nitrogen) { this.nitrogen = nitrogen; }
    public Double getPhosphorus() { return phosphorus; }
    public void setPhosphorus(Double phosphorus) { this.phosphorus = phosphorus; }
    public Double getPotassium() { return potassium; }
    public void setPotassium(Double potassium) { this.potassium = potassium; }
    public Double getPh() { return ph; }
    public void setPh(Double ph) { this.ph = ph; }
    public Double getMoisture() { return moisture; }
    public void setMoisture(Double moisture) { this.moisture = moisture; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }
    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }
    public String getPreviousCrop() { return previousCrop; }
    public void setPreviousCrop(String previousCrop) { this.previousCrop = previousCrop; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
}
