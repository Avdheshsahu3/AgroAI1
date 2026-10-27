package com.agroai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disease_detection_history")
public class DiseaseDetection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmerId;

    private String imagePath;

    private String disease;

    private Double confidence;

    private String status;

    private LocalDateTime detectedAt = LocalDateTime.now();

    public DiseaseDetection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }
}
