package com.agroai.service;

import com.agroai.config.NoSuchElementFoundException;
import com.agroai.dto.FarmerResponse;
import com.agroai.model.Farmer;
import com.agroai.repository.FarmerRepository;
import org.springframework.stereotype.Service;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;

    public FarmerService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public FarmerResponse getFarmer(Long id) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Farmer not found: " + id));
        return FarmerResponse.from(farmer);
    }

    public Farmer getFarmerEntity(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Farmer not found: " + id));
    }
}
