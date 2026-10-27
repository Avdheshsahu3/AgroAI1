package com.agroai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "soil_data")
public class SoilData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmerId;

    private Double nitrogen;
    private Double phosphorus;
    private Double potassium;
    private Double ph;
    private Double moisture;

    // Optional fields (section 8)
    private Double organicCarbon;
    private Double electricalConductivity;
    private String soilType;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public SoilData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

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

    public Double getOrganicCarbon() { return organicCarbon; }
    public void setOrganicCarbon(Double organicCarbon) { this.organicCarbon = organicCarbon; }

    public Double getElectricalConductivity() { return electricalConductivity; }
    public void setElectricalConductivity(Double electricalConductivity) { this.electricalConductivity = electricalConductivity; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
