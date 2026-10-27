package com.agroai.service;

import com.agroai.config.DuplicateResourceException;
import com.agroai.config.UnauthorizedException;
import com.agroai.dto.FarmerResponse;
import com.agroai.dto.LoginRequest;
import com.agroai.dto.RegisterRequest;
import com.agroai.model.Farmer;
import com.agroai.repository.FarmerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Demo authentication: BCrypt-hashed passwords, no plain text stored, but no
 * session/JWT token issued yet - the frontend keeps the returned farmerId in
 * memory for this prototype. For production, add Spring Security + JWT
 * (see README "Moving to production auth").
 */
@Service
public class AuthService {

    private final FarmerRepository farmerRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public FarmerResponse register(RegisterRequest request) {
        if (farmerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }
        Farmer farmer = new Farmer();
        farmer.setName(request.getName());
        farmer.setEmail(request.getEmail());
        farmer.setPasswordHash(encoder.encode(request.getPassword()));
        farmer.setMobile(request.getMobile());
        farmer.setLocation(request.getLocation());
        farmer.setFarmArea(request.getFarmArea());
        Farmer saved = farmerRepository.save(farmer);
        return FarmerResponse.from(saved);
    }

    public FarmerResponse login(LoginRequest request) {
        Farmer farmer = farmerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!encoder.matches(request.getPassword(), farmer.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        return FarmerResponse.from(farmer);
    }
}
