package com.agroai.controller;

import com.agroai.dto.RecommendationRequest;
import com.agroai.dto.RecommendationResponse;
import com.agroai.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public RecommendationResponse recommend(@Valid @RequestBody RecommendationRequest request) {
        return recommendationService.recommend(request);
    }

    @PostMapping("/chat")
    public com.agroai.dto.RecommendationChatResponse chat(@Valid @RequestBody com.agroai.dto.RecommendationChatRequest request) {
        return recommendationService.chat(request);
    }
}

