package com.agroai.dto;

import jakarta.validation.constraints.NotBlank;

public class RecommendationChatRequest {
    private Long farmerId;
    private String crop;

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private Double nitrogen;
    private Double phosphorus;
    private Double potassium;
    private Double ph;
    private Double moisture;
    private Double temperature;
    private Double humidity;
    private Double rainfall;
    private String location;
    private String previousCrop;

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

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

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPreviousCrop() { return previousCrop; }
    public void setPreviousCrop(String previousCrop) { this.previousCrop = previousCrop; }
}
