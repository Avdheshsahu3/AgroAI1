package com.agroai.service;

import com.agroai.config.NoSuchElementFoundException;
import com.agroai.dto.SoilDataRequest;
import com.agroai.model.SoilData;
import com.agroai.repository.SoilDataRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Soil values come from the farmer's manual entry today (Method 1 in the spec).
 * Method 2 (SoilGrids / Bhuvan / IoT sensors) can plug into save() later without
 * changing the controller or the recommendation flow - just populate a
 * SoilDataRequest from that source instead of a form submission.
 */
@Service
public class SoilService {

    private final SoilDataRepository soilDataRepository;

    public SoilService(SoilDataRepository soilDataRepository) {
        this.soilDataRepository = soilDataRepository;
    }

    public SoilData save(Long farmerId, SoilDataRequest request) {
        SoilData data = new SoilData();
        data.setFarmerId(farmerId);
        data.setNitrogen(request.getNitrogen());
        data.setPhosphorus(request.getPhosphorus());
        data.setPotassium(request.getPotassium());
        data.setPh(request.getPh());
        data.setMoisture(request.getMoisture());
        data.setOrganicCarbon(request.getOrganicCarbon());
        data.setElectricalConductivity(request.getElectricalConductivity());
        data.setSoilType(request.getSoilType());
        return soilDataRepository.save(data);
    }

    public SoilData getLatest(Long farmerId) {
        return soilDataRepository.findFirstByFarmerIdOrderByRecordedAtDesc(farmerId)
                .orElseThrow(() -> new NoSuchElementFoundException("No soil data recorded yet for this farmer"));
    }

    public SoilData getLatestOrNull(Long farmerId) {
        return soilDataRepository.findFirstByFarmerIdOrderByRecordedAtDesc(farmerId).orElse(null);
    }

    public List<SoilData> history(Long farmerId) {
        return soilDataRepository.findByFarmerIdOrderByRecordedAtDesc(farmerId);
    }

    public void delete(Long farmerId, Long id) {
        SoilData data = soilDataRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Soil data record not found with id: " + id));
        if (!data.getFarmerId().equals(farmerId)) {
            throw new IllegalArgumentException("Soil data record does not belong to this farmer");
        }
        soilDataRepository.delete(data);
    }

    public void deleteAll(Long farmerId) {
        List<SoilData> list = soilDataRepository.findByFarmerIdOrderByRecordedAtDesc(farmerId);
        soilDataRepository.deleteAll(list);
    }
}
