package com.agroai.controller;

import com.agroai.dto.SoilDataRequest;
import com.agroai.model.SoilData;
import com.agroai.service.SoilService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soil")
public class SoilController {

    private final SoilService soilService;

    public SoilController(SoilService soilService) {
        this.soilService = soilService;
    }

    @PostMapping("/{farmerId}")
    public ResponseEntity<SoilData> save(@PathVariable Long farmerId, @Valid @RequestBody SoilDataRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(soilService.save(farmerId, request));
    }

    @GetMapping("/{farmerId}")
    public ResponseEntity<SoilData> latest(@PathVariable Long farmerId) {
        return ResponseEntity.ok(soilService.getLatest(farmerId));
    }

    @GetMapping("/{farmerId}/history")
    public ResponseEntity<List<SoilData>> history(@PathVariable Long farmerId) {
        return ResponseEntity.ok(soilService.history(farmerId));
    }

    @DeleteMapping("/{farmerId}/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long farmerId, @PathVariable Long id) {
        soilService.delete(farmerId, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{farmerId}")
    public ResponseEntity<Void> deleteAll(@PathVariable Long farmerId) {
        soilService.deleteAll(farmerId);
        return ResponseEntity.noContent().build();
    }
}
