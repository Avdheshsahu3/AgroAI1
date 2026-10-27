package com.agroai.repository;

import com.agroai.model.SoilData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SoilDataRepository extends JpaRepository<SoilData, Long> {
    List<SoilData> findByFarmerIdOrderByRecordedAtDesc(Long farmerId);
    Optional<SoilData> findFirstByFarmerIdOrderByRecordedAtDesc(Long farmerId);
}
