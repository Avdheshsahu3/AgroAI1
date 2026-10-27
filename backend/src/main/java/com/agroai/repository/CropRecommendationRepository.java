package com.agroai.repository;

import com.agroai.model.CropRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CropRecommendationRepository extends JpaRepository<CropRecommendation, Long> {
    Optional<CropRecommendation> findFirstByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
