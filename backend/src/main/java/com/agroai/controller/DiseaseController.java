package com.agroai.controller;

import com.agroai.dto.DiseaseDetectionResponse;
import com.agroai.service.DiseaseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/disease")
public class DiseaseController {

    private final DiseaseService diseaseService;

    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @PostMapping(value = "/detect", consumes = "multipart/form-data")
    public DiseaseDetectionResponse detect(@RequestParam Long farmerId, @RequestParam("image") MultipartFile image) {
        return diseaseService.detect(farmerId, image);
    }
}
