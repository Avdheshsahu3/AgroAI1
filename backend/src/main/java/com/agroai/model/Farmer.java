package com.agroai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmers")
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String mobile;

    private String location;

    private Double farmArea;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Farmer() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getFarmArea() { return farmArea; }
    public void setFarmArea(Double farmArea) { this.farmArea = farmArea; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
