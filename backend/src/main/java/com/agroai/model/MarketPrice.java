package com.agroai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_prices")
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;

    @Column(nullable = false)
    private String crop;

    private Double price;

    private String unit;

    private Double changePercent;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public MarketPrice() {}

    public MarketPrice(String location, String crop, Double price, String unit, Double changePercent) {
        this.location = location;
        this.crop = crop;
        this.price = price;
        this.unit = unit;
        this.changePercent = changePercent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getChangePercent() { return changePercent; }
    public void setChangePercent(Double changePercent) { this.changePercent = changePercent; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
