package com.agroai.service;

import com.agroai.dto.DiseaseDetectionResponse;
import com.agroai.model.DiseaseDetection;
import com.agroai.repository.DiseaseDetectionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * Section 16: a stub disease-detection service. It genuinely saves and
 * validates the uploaded image, but the "diagnosis" is a labeled placeholder,
 * not a trained model - this must not be presented to farmers as a working
 * diagnosis. Swap detectStub() for a real call to a CNN served via FastAPI,
 * ONNX Runtime, or DeepLearning4J once one is trained and validated.
 */
@Service
public class DiseaseService {

    private static final List<String> ACCEPTED_TYPES = List.of("image/jpeg", "image/png", "image/webp");
    private static final List<String> DEMO_LABELS = List.of("Leaf Spot", "Early Blight", "Powdery Mildew", "Healthy Leaf");

    private final DiseaseDetectionRepository diseaseDetectionRepository;
    private final String uploadDir;

    public DiseaseService(DiseaseDetectionRepository diseaseDetectionRepository,
                           @Value("${app.upload.dir}") String uploadDir) {
        this.diseaseDetectionRepository = diseaseDetectionRepository;
        this.uploadDir = uploadDir;
    }

    public DiseaseDetectionResponse detect(Long farmerId, MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Invalid image: no file received");
        }
        if (!ACCEPTED_TYPES.contains(image.getContentType())) {
            throw new IllegalArgumentException("Invalid image: only JPEG, PNG or WEBP files are supported");
        }

        String storedPath = storeImage(farmerId, image);

        // --- STUB DETECTION LOGIC (placeholder, not a real diagnosis) ---
        Random random = new Random(storedPath.hashCode());
        String disease = DEMO_LABELS.get(random.nextInt(DEMO_LABELS.size()));
        double confidence = 70 + random.nextInt(21); // 70-90%
        // ------------------------------------------------------------------

        DiseaseDetection record = new DiseaseDetection();
        record.setFarmerId(farmerId);
        record.setImagePath(storedPath);
        record.setDisease(disease);
        record.setConfidence(confidence);
        record.setStatus("demo");
        diseaseDetectionRepository.save(record);

        return new DiseaseDetectionResponse(
                disease,
                confidence,
                "demo",
                "CNN integration placeholder. Connect a validated plant-disease model for production use."
        );
    }

    private String storeImage(Long farmerId, MultipartFile image) {
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            String original = StringUtils.cleanPath(image.getOriginalFilename() != null ? image.getOriginalFilename() : "upload");
            String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
            String filename = "farmer" + farmerId + "_" + UUID.randomUUID() + extension;
            Path target = dir.resolve(filename);
            Files.copy(image.getInputStream(), target);
            return target.toString();
        } catch (IOException e) {
            throw new IllegalArgumentException("Invalid image: could not be saved");
        }
    }
}
