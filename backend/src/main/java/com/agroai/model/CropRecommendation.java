package com.agroai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_recommendations")
public class CropRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmerId;

    @Column(nullable = false)
    private String crop;

    private Double confidence;

    @Lob
    private String reason;

    private LocalDateTime createdAt = LocalDateTime.now();

    public CropRecommendation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
