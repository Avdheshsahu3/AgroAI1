package com.agroai.dto;

public class DiseaseDetectionResponse {
    private String disease;
    private double confidence;
    private String status;
    private String message;

    public DiseaseDetectionResponse() {}

    public DiseaseDetectionResponse(String disease, double confidence, String status, String message) {
        this.disease = disease;
        this.confidence = confidence;
        this.status = status;
        this.message = message;
    }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
