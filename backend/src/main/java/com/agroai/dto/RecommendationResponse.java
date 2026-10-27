package com.agroai.dto;

import java.util.List;

public class RecommendationResponse {
    private String crop;
    private double confidence;
    private String reason;
    private List<String> reasons;
    private Double temperature;
    private Double rainfall;
    private String location;

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
