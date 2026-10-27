package com.agroai.dto;

import jakarta.validation.constraints.*;

public class SoilDataRequest {
    @NotNull @Min(0) private Double nitrogen;
    @NotNull @Min(0) private Double phosphorus;
    @NotNull @Min(0) private Double potassium;
    @NotNull @DecimalMin("0.0") @DecimalMax("14.0") private Double ph;
    @NotNull @DecimalMin("0.0") @DecimalMax("100.0") private Double moisture;

    private Double organicCarbon;
    private Double electricalConductivity;
    private String soilType;

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
}
