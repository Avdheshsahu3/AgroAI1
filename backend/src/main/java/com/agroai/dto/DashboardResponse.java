package com.agroai.dto;

import com.agroai.model.MarketPrice;
import com.agroai.model.SoilData;

import java.util.List;

public class DashboardResponse {
    private FarmerResponse farmer;
    private WeatherResponse weather;
    private SoilData soil;
    private List<MarketPrice> market;
    private RecommendationResponse recommendation;
    private DiseaseDetectionResponse diseaseDetection;

    public FarmerResponse getFarmer() { return farmer; }
    public void setFarmer(FarmerResponse farmer) { this.farmer = farmer; }
    public WeatherResponse getWeather() { return weather; }
    public void setWeather(WeatherResponse weather) { this.weather = weather; }
    public SoilData getSoil() { return soil; }
    public void setSoil(SoilData soil) { this.soil = soil; }
    public List<MarketPrice> getMarket() { return market; }
    public void setMarket(List<MarketPrice> market) { this.market = market; }
    public RecommendationResponse getRecommendation() { return recommendation; }
    public void setRecommendation(RecommendationResponse recommendation) { this.recommendation = recommendation; }
    public DiseaseDetectionResponse getDiseaseDetection() { return diseaseDetection; }
    public void setDiseaseDetection(DiseaseDetectionResponse diseaseDetection) { this.diseaseDetection = diseaseDetection; }
}
