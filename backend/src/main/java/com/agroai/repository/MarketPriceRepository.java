package com.agroai.repository;

import com.agroai.model.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {
    List<MarketPrice> findByLocationIgnoreCase(String location);
}
