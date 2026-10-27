package com.agroai.dto;

import com.agroai.model.Farmer;

public class FarmerResponse {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String location;
    private Double farmArea;

    public static FarmerResponse from(Farmer f) {
        FarmerResponse r = new FarmerResponse();
        r.id = f.getId();
        r.name = f.getName();
        r.email = f.getEmail();
        r.mobile = f.getMobile();
        r.location = f.getLocation();
        r.farmArea = f.getFarmArea();
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Double getFarmArea() { return farmArea; }
    public void setFarmArea(Double farmArea) { this.farmArea = farmArea; }
}
