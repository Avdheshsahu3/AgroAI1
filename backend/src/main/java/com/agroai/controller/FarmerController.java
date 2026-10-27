package com.agroai.controller;

import com.agroai.dto.FarmerResponse;
import com.agroai.service.FarmerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmerResponse> getFarmer(@PathVariable Long id) {
        return ResponseEntity.ok(farmerService.getFarmer(id));
    }
}
