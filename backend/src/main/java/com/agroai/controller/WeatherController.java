package com.agroai.controller;

import com.agroai.dto.WeatherResponse;
import com.agroai.service.WeatherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherResponse getWeather(@RequestParam String location,
                                       @RequestParam(required = false) Long farmerId) {
        return weatherService.getWeatherForLocation(location, farmerId);
    }
}
