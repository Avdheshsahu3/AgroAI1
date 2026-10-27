package com.agroai.repository;

import com.agroai.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    Optional<WeatherData> findFirstByFarmerIdOrderByRecordedAtDesc(Long farmerId);
}
