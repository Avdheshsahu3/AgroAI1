package com.agroai.service;

import com.agroai.model.MarketPrice;
import com.agroai.repository.MarketPriceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * DEMO market data only (section 15). Prices are generated, not fetched from
 * a real mandi feed. To go live, replace generateDemoPrices() with a call to
 * an approved source (Agmarknet / eNAM) behind the same MarketPrice shape -
 * the controller and frontend don't need to change. Unauthorized scraping is
 * intentionally not implemented here.
 */
@Service
public class MarketService {

    private final MarketPriceRepository marketPriceRepository;

    private static final Map<String, Double> BASE_PRICES = new LinkedHashMap<>();
    static {
        BASE_PRICES.put("Rice", 2250.0);
        BASE_PRICES.put("Wheat", 2480.0);
        BASE_PRICES.put("Soybean", 4650.0);
        BASE_PRICES.put("Maize", 2180.0);
        BASE_PRICES.put("Cotton", 6900.0);
        BASE_PRICES.put("Groundnut", 5800.0);
        BASE_PRICES.put("Chickpea", 5250.0);
        BASE_PRICES.put("Tomato", 1800.0);
        BASE_PRICES.put("Potato", 1450.0);
        BASE_PRICES.put("Sugarcane", 340.0);
        BASE_PRICES.put("Mustard", 5450.0);
    }

    public MarketService(MarketPriceRepository marketPriceRepository) {
        this.marketPriceRepository = marketPriceRepository;
    }

    public List<MarketPrice> getPricesForLocation(String location) {
        String key = location == null ? "unknown" : location.trim().toLowerCase();
        // Seed by location + day so prices stay stable across the same day but vary by place.
        long seed = key.hashCode() + LocalDate.now().toEpochDay();
        Random random = new Random(seed);

        List<MarketPrice> prices = new ArrayList<>();
        for (Map.Entry<String, Double> entry : BASE_PRICES.entrySet()) {
            double drift = (random.nextDouble() - 0.5) * 0.08; // +/- 4%
            double price = Math.round(entry.getValue() * (1 + drift));
            double changePercent = Math.round(drift * 1000) / 10.0;
            prices.add(new MarketPrice(location, entry.getKey(), price, "quintal", changePercent));
        }
        return prices;
    }

    public List<MarketPrice> getAndPersist(String location) {
        List<MarketPrice> prices = getPricesForLocation(location);
        return marketPriceRepository.saveAll(prices);
    }
}
