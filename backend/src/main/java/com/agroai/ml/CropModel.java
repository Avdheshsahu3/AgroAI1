package com.agroai.ml;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import smile.classification.RandomForest;
import smile.data.DataFrame;
import smile.data.Tuple;
import smile.data.formula.Formula;
import smile.data.type.StructType;
import smile.io.Read;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Crop recommendation model.
 *
 * The dataset in resources/data/crop_training.csv is a DEMO dataset only
 * (see section 10 of the spec) - illustrative agronomic ranges, not a
 * scientifically validated agricultural survey. Swap it for a validated
 * dataset (e.g. an ICAR / state agriculture department release) before
 * using this for real decisions; the training/inference code below does
 * not need to change, only the CSV.
 *
 * Primary path: Smile's RandomForest, trained on the CSV via Smile's
 * formula API (this is what section 10 of the spec asks for).
 *
 * Fallback path: if the Smile training call throws (e.g. because of an
 * API difference between Smile releases, which can't be verified without
 * compiling against the real dependency), we fall back to a dependency-free
 * weighted nearest-centroid classifier built from the same CSV, so the
 * feature still works end-to-end. Both paths are genuinely "trained" on the
 * CSV rather than hardcoded per-location rules.
 */
@Component
public class CropModel {

    private static final Logger log = LoggerFactory.getLogger(CropModel.class);

    public static final String[] FEATURE_NAMES = {
            "N", "P", "K", "temperature", "humidity", "rainfall", "ph", "moisture"
    };

    private RandomForest randomForest;
    private StructType schema;
    private boolean smileAvailable = false;

    // Fallback + explanation data, built from the CSV regardless of which model is used.
    private final List<double[]> rows = new ArrayList<>();
    private final List<String> labels = new ArrayList<>();
    private final List<String> previousCrops = new ArrayList<>();
    private String[] classNames;
    private double[] featureMin;
    private double[] featureMax;
    // per-class [feature][0]=min,[1]=max
    private final Map<String, double[][]> classRanges = new HashMap<>();
    private final Map<String, double[]> classCentroidNormalized = new HashMap<>();

    @PostConstruct
    public void init() {
        loadCsvAndComputeStatistics();
        trainSmileModel();
        if (!smileAvailable) {
            log.warn("Falling back to the built-in nearest-centroid crop classifier " +
                    "(Smile RandomForest training did not complete). Recommendations still work.");
        } else {
            log.info("Crop RandomForest trained on {} demo samples across {} crops.", rows.size(), classNames.length);
        }
    }

    private void loadCsvAndComputeStatistics() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("data/crop_training.csv").getInputStream(), StandardCharsets.UTF_8))) {
            String header = reader.readLine();
            String line;
            Set<String> classSet = new LinkedHashSet<>();
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) continue;
                String[] parts = line.split(",");
                double[] feat = new double[FEATURE_NAMES.length];
                feat[0] = Double.parseDouble(parts[0]); // N
                feat[1] = Double.parseDouble(parts[1]); // P
                feat[2] = Double.parseDouble(parts[2]); // K
                feat[3] = Double.parseDouble(parts[3]); // temperature
                feat[4] = Double.parseDouble(parts[4]); // humidity
                feat[5] = Double.parseDouble(parts[5]); // rainfall
                feat[6] = Double.parseDouble(parts[6]); // ph
                feat[7] = Double.parseDouble(parts[7]); // moisture
                String prevCrop = parts[8];
                String crop = parts[9];

                rows.add(feat);
                labels.add(crop);
                previousCrops.add(prevCrop);
                classSet.add(crop);
            }
            classNames = classSet.toArray(new String[0]);

            int nf = FEATURE_NAMES.length;
            featureMin = new double[nf];
            featureMax = new double[nf];
            Arrays.fill(featureMin, Double.POSITIVE_INFINITY);
            Arrays.fill(featureMax, Double.NEGATIVE_INFINITY);
            for (double[] r : rows) {
                for (int i = 0; i < nf; i++) {
                    featureMin[i] = Math.min(featureMin[i], r[i]);
                    featureMax[i] = Math.max(featureMax[i], r[i]);
                }
            }

            // Per-class min/max (for the "why" explanation) and centroid in normalized space.
            for (String crop : classNames) {
                double[][] range = new double[nf][2];
                for (int i = 0; i < nf; i++) {
                    range[i][0] = Double.POSITIVE_INFINITY;
                    range[i][1] = Double.NEGATIVE_INFINITY;
                }
                double[] centroid = new double[nf];
                int count = 0;
                for (int idx = 0; idx < rows.size(); idx++) {
                    if (!labels.get(idx).equals(crop)) continue;
                    double[] r = rows.get(idx);
                    count++;
                    for (int i = 0; i < nf; i++) {
                        range[i][0] = Math.min(range[i][0], r[i]);
                        range[i][1] = Math.max(range[i][1], r[i]);
                        centroid[i] += normalize(i, r[i]);
                    }
                }
                for (int i = 0; i < nf; i++) centroid[i] /= Math.max(count, 1);
                classRanges.put(crop, range);
                classCentroidNormalized.put(crop, centroid);
            }
        } catch (Exception e) {
            throw new IllegalStateException("Could not load crop_training.csv - the demo dataset is required at startup", e);
        }
    }

    private void trainSmileModel() {
        try {
            String csvPath = new ClassPathResource("data/crop_training.csv").getFile().getAbsolutePath();
            DataFrame df = Read.csv(csvPath);
            Formula formula = Formula.lhs("crop");
            this.randomForest = RandomForest.fit(formula, df);
            this.schema = df.schema();
            this.smileAvailable = true;
        } catch (Throwable t) {
            // Broad catch is intentional: this keeps the crop-recommendation feature
            // working even if the exact Smile method signature differs by version.
            log.warn("Smile RandomForest training failed ({}). Using fallback classifier.", t.toString());
            this.smileAvailable = false;
        }
    }

    private double normalize(int featureIndex, double value) {
        double range = featureMax[featureIndex] - featureMin[featureIndex];
        if (range <= 0) return 0.5;
        return (value - featureMin[featureIndex]) / range;
    }

    public static class Prediction {
        public String crop;
        public double confidence;
        public Map<String, Double> classProbabilities;
    }

    public Prediction predict(double n, double p, double k, double temperature,
                               double humidity, double rainfall, double ph, double moisture) {
        double[] features = {n, p, k, temperature, humidity, rainfall, ph, moisture};

        if (smileAvailable) {
            try {
                return predictWithSmile(features);
            } catch (Throwable t) {
                log.warn("Smile prediction failed at request time ({}); using fallback classifier for this request.", t.toString());
            }
        }
        return predictWithCentroid(features);
    }

    private Prediction predictWithSmile(double[] features) {
        Object[] values = new Object[]{
                features[0], features[1], features[2], features[3],
                features[4], features[5], features[6], features[7], "Unknown"
        };
        Tuple tuple = Tuple.of(values, schema);
        double[] posteriori = new double[classNames.length];
        int predictedIndex;
        try {
            predictedIndex = randomForest.predict(tuple, posteriori);
        } catch (UnsupportedOperationException uoe) {
            predictedIndex = randomForest.predict(tuple);
            Arrays.fill(posteriori, 1.0 / classNames.length);
        }
        String[] rfClasses = classNames; // assumes same ordering as training set's distinct labels
        Prediction pred = new Prediction();
        Map<String, Double> probs = new LinkedHashMap<>();
        for (int i = 0; i < Math.min(rfClasses.length, posteriori.length); i++) {
            probs.put(rfClasses[i], posteriori[i]);
        }
        pred.classProbabilities = probs;
        pred.crop = rfClasses[Math.min(predictedIndex, rfClasses.length - 1)];
        pred.confidence = probs.getOrDefault(pred.crop, 0.6);
        return pred;
    }

    private Prediction predictWithCentroid(double[] features) {
        double[] normalized = new double[features.length];
        for (int i = 0; i < features.length; i++) normalized[i] = normalize(i, features[i]);

        Map<String, Double> negDistances = new LinkedHashMap<>();
        for (String crop : classNames) {
            double[] centroid = classCentroidNormalized.get(crop);
            double distSq = 0;
            for (int i = 0; i < normalized.length; i++) {
                double d = normalized[i] - centroid[i];
                distSq += d * d;
            }
            negDistances.put(crop, -Math.sqrt(distSq));
        }

        // Softmax over negative distances -> a probability-like confidence per crop.
        double max = negDistances.values().stream().mapToDouble(Double::doubleValue).max().orElse(0);
        double sum = 0;
        Map<String, Double> probs = new LinkedHashMap<>();
        for (Map.Entry<String, Double> e : negDistances.entrySet()) {
            double v = Math.exp((e.getValue() - max) * 3.0); // temperature factor sharpens the distribution
            probs.put(e.getKey(), v);
            sum += v;
        }
        for (String k : probs.keySet()) probs.put(k, probs.get(k) / sum);

        String best = probs.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(classNames[0]);

        Prediction pred = new Prediction();
        pred.crop = best;
        pred.confidence = probs.get(best);
        pred.classProbabilities = probs;
        return pred;
    }

    /** Human-readable reasons: which of the query's features fall within the recommended crop's typical training range. */
    public List<String> explain(String crop, double n, double p, double k, double temperature,
                                 double humidity, double rainfall, double ph, double moisture) {
        double[] query = {n, p, k, temperature, humidity, rainfall, ph, moisture};
        String[] labels = {
                "Nitrogen (N) level", "Phosphorus (P) level", "Potassium (K) level",
                "Temperature", "Humidity", "Expected rainfall", "Soil pH", "Soil moisture"
        };
        double[][] range = classRanges.get(crop);
        List<String> reasons = new ArrayList<>();
        if (range == null) return reasons;
        for (int i = 0; i < query.length; i++) {
            double lo = range[i][0], hi = range[i][1];
            double buffer = (hi - lo) * 0.15; // small tolerance around the observed training range
            boolean withinRange = query[i] >= (lo - buffer) && query[i] <= (hi + buffer);
            if (withinRange) {
                reasons.add(labels[i] + " is in the suitable range for " + crop + ".");
            }
        }
        if (reasons.isEmpty()) {
            reasons.add("The overall combination of soil and weather conditions is closest to " + crop + " among the modeled crops.");
        }
        return reasons;
    }

    public boolean isUsingSmile() {
        return smileAvailable;
    }
}
