package com.agroai.controller;

import com.agroai.dto.*;
import com.agroai.model.DiseaseDetection;
import com.agroai.model.MarketPrice;
import com.agroai.model.SoilData;
import com.agroai.repository.DiseaseDetectionRepository;
import com.agroai.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Section 19: one call the React dashboard can use to load everything it
 * needs, following the flow in section 32 (profile -> location -> weather ->
 * soil -> recommendation -> market).
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final FarmerService farmerService;
    private final WeatherService weatherService;
    private final SoilService soilService;
    private final MarketService marketService;
    private final RecommendationService recommendationService;
    private final DiseaseDetectionRepository diseaseDetectionRepository;

    public DashboardController(FarmerService farmerService, WeatherService weatherService,
                                SoilService soilService, MarketService marketService,
                                RecommendationService recommendationService,
                                DiseaseDetectionRepository diseaseDetectionRepository) {
        this.farmerService = farmerService;
        this.weatherService = weatherService;
        this.soilService = soilService;
        this.marketService = marketService;
        this.recommendationService = recommendationService;
        this.diseaseDetectionRepository = diseaseDetectionRepository;
    }

    @GetMapping("/{farmerId}")
    public DashboardResponse getDashboard(@PathVariable Long farmerId, @RequestParam(required = false) String location) {
        DashboardResponse dashboard = new DashboardResponse();

        FarmerResponse farmer = farmerService.getFarmer(farmerId);
        dashboard.setFarmer(farmer);

        String resolvedLocation = (location != null && !location.isBlank()) ? location : farmer.getLocation();
        if (resolvedLocation == null || resolvedLocation.isBlank()) {
            return dashboard; // farmer hasn't set a location yet - frontend prompts for one
        }

        WeatherResponse weather = weatherService.getWeatherForLocation(resolvedLocation, farmerId);
        dashboard.setWeather(weather);

        SoilData soil = soilService.getLatestOrNull(farmerId);
        dashboard.setSoil(soil);

        List<MarketPrice> market = marketService.getPricesForLocation(resolvedLocation);
        dashboard.setMarket(market);

        if (soil != null) {
            RecommendationRequest recRequest = new RecommendationRequest();
            recRequest.setFarmerId(farmerId);
            recRequest.setNitrogen(soil.getNitrogen());
            recRequest.setPhosphorus(soil.getPhosphorus());
            recRequest.setPotassium(soil.getPotassium());
            recRequest.setPh(soil.getPh());
            recRequest.setMoisture(soil.getMoisture());
            recRequest.setTemperature(weather.getTemperature());
            recRequest.setHumidity(weather.getHumidity());
            recRequest.setRainfall(weather.getRainfall());
            recRequest.setLocation(resolvedLocation);
            dashboard.setRecommendation(recommendationService.recommend(recRequest));
        }

        diseaseDetectionRepository.findFirstByFarmerIdOrderByDetectedAtDesc(farmerId).ifPresent(d ->
                dashboard.setDiseaseDetection(new DiseaseDetectionResponse(d.getDisease(), d.getConfidence(), d.getStatus(),
                        "Most recent upload for this farmer.")));

        return dashboard;
    }
}
