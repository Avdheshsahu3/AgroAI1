package com.agroai.controller;

import com.agroai.model.MarketPrice;
import com.agroai.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final MarketService marketService;
    private final RestTemplate restTemplate;

    public MarketController(MarketService marketService, @Autowired(required = false) RestTemplate restTemplate) {
        this.marketService = marketService;
        this.restTemplate = restTemplate != null ? restTemplate : new RestTemplate();
    }

    @GetMapping
    public List<MarketPrice> getMarketPrices(@RequestParam String location) {
        return marketService.getPricesForLocation(location);
    }

    @GetMapping("/ogd-prices")
    public ResponseEntity<String> getGovMandiPrices(
            @RequestParam(required = false) String apiKey,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String commodity) {

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070")
                .queryParam("format", "json")
                .queryParam("limit", limit)
                .queryParam("offset", offset);

        if (apiKey != null && !apiKey.trim().isEmpty()) {
            builder.queryParam("api-key", apiKey.trim());
        }
        if (state != null && !state.trim().isEmpty()) {
            builder.queryParam("filters[state]", state.trim());
        }
        if (district != null && !district.trim().isEmpty()) {
            builder.queryParam("filters[district]", district.trim());
        }
        if (commodity != null && !commodity.trim().isEmpty()) {
            builder.queryParam("filters[commodity]", commodity.trim());
        }

        try {
            String response = restTemplate.getForObject(builder.build().toUri(), String.class);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response);
        } catch (HttpStatusCodeException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        } catch (Exception ex) {
            return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }
}
