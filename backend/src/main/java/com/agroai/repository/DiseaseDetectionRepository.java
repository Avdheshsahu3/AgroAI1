package com.agroai.repository;

import com.agroai.model.DiseaseDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DiseaseDetectionRepository extends JpaRepository<DiseaseDetection, Long> {
    Optional<DiseaseDetection> findFirstByFarmerIdOrderByDetectedAtDesc(Long farmerId);
}
