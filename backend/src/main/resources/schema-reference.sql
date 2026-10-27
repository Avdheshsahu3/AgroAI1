-- =============================================================================
-- AgroAI - Reference SQL
-- =============================================================================
-- NOTE: The backend uses Hibernate with spring.jpa.hibernate.ddl-auto=update,
-- so these tables are created automatically from the JPA entities at startup -
-- you do NOT need to run this file for local dev (H2) or even for MySQL.
--
-- This file exists for two reasons:
--   1. A reviewable, explicit schema (useful before pointing ddl-auto at a
--      real production database like AWS RDS / Google Cloud SQL).
--   2. A reference for the actual SQL each API endpoint executes under the
--      hood, since Spring Data JPA generates these for you rather than you
--      writing them by hand.
--
-- To use this manually instead of ddl-auto:
--   mysql -u root -p agroai < schema-reference.sql
-- and then set spring.jpa.hibernate.ddl-auto=validate (or none) in
-- application.properties so Hibernate checks the schema instead of managing it.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS agroai;
USE agroai;

-- -----------------------------------------------------------------------------
-- farmers  (Farmer.java)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmers (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    mobile         VARCHAR(255),
    location       VARCHAR(255),
    farm_area      DOUBLE,
    created_at     DATETIME(6),
    CONSTRAINT uq_farmers_email UNIQUE (email)
);

-- -----------------------------------------------------------------------------
-- soil_data  (SoilData.java)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS soil_data (
    id                        BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id                 BIGINT NOT NULL,
    nitrogen                  DOUBLE,
    phosphorus                DOUBLE,
    potassium                 DOUBLE,
    ph                        DOUBLE,
    moisture                  DOUBLE,
    organic_carbon            DOUBLE,
    electrical_conductivity   DOUBLE,
    soil_type                 VARCHAR(255),
    recorded_at               DATETIME(6),
    CONSTRAINT fk_soil_data_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- -----------------------------------------------------------------------------
-- weather_data  (WeatherData.java)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weather_data (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id      BIGINT,
    location       VARCHAR(255) NOT NULL,
    latitude       DOUBLE,
    longitude      DOUBLE,
    temperature    DOUBLE,
    humidity       DOUBLE,
    rainfall       DOUBLE,
    forecast_json  TEXT,
    recorded_at    DATETIME(6),
    CONSTRAINT fk_weather_data_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- -----------------------------------------------------------------------------
-- crop_recommendations  (CropRecommendation.java)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crop_recommendations (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id    BIGINT,
    crop         VARCHAR(255) NOT NULL,
    confidence   DOUBLE,
    reason       TEXT,
    created_at   DATETIME(6),
    CONSTRAINT fk_crop_rec_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- -----------------------------------------------------------------------------
-- market_prices  (MarketPrice.java)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS market_prices (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    location         VARCHAR(255),
    crop             VARCHAR(255) NOT NULL,
    price            DOUBLE,
    unit             VARCHAR(255),
    change_percent   DOUBLE,
    updated_at       DATETIME(6)
);

-- -----------------------------------------------------------------------------
-- disease_detection_history  (DiseaseDetection.java)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disease_detection_history (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id    BIGINT,
    image_path   VARCHAR(255),
    disease      VARCHAR(255),
    confidence   DOUBLE,
    status       VARCHAR(255),
    detected_at  DATETIME(6),
    CONSTRAINT fk_disease_farmer FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- Helpful indexes for the lookups the app actually does (see queries below).
CREATE INDEX idx_soil_data_farmer_recorded ON soil_data (farmer_id, recorded_at);
CREATE INDEX idx_weather_data_farmer_recorded ON weather_data (farmer_id, recorded_at);
CREATE INDEX idx_crop_rec_farmer_created ON crop_recommendations (farmer_id, created_at);
CREATE INDEX idx_disease_farmer_detected ON disease_detection_history (farmer_id, detected_at);
CREATE INDEX idx_market_prices_location ON market_prices (location);


-- =============================================================================
-- Actual queries used by the app, by feature
-- (Spring Data JPA generates these from the repository method names / entity
-- saves - you never hand-write them, but this is exactly what runs.)
-- =============================================================================

-- Register (AuthService.register -> FarmerRepository.existsByEmail / save)
-- SELECT COUNT(*) > 0 FROM farmers WHERE email = ?;
-- INSERT INTO farmers (name, email, password_hash, mobile, location, farm_area, created_at)
--   VALUES (?, ?, ?, ?, ?, ?, ?);

-- Login (AuthService.login -> FarmerRepository.findByEmail)
-- SELECT * FROM farmers WHERE email = ?;

-- Farmer profile (FarmerService.getFarmer)
-- SELECT * FROM farmers WHERE id = ?;

-- Save soil reading (SoilService.save)
-- INSERT INTO soil_data
--   (farmer_id, nitrogen, phosphorus, potassium, ph, moisture,
--    organic_carbon, electrical_conductivity, soil_type, recorded_at)
--   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Latest soil reading (SoilService.getLatest / getLatestOrNull)
-- SELECT * FROM soil_data WHERE farmer_id = ? ORDER BY recorded_at DESC LIMIT 1;

-- Soil reading history (SoilService.history)
-- SELECT * FROM soil_data WHERE farmer_id = ? ORDER BY recorded_at DESC;

-- Weather lookup + persistence (WeatherService.getWeatherForLocation)
-- INSERT INTO weather_data
--   (farmer_id, location, latitude, longitude, temperature, humidity, rainfall,
--    forecast_json, recorded_at)
--   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Latest saved weather (WeatherService.getLatestSaved)
-- SELECT * FROM weather_data WHERE farmer_id = ? ORDER BY recorded_at DESC LIMIT 1;

-- Crop recommendation, save (RecommendationService.recommend)
-- INSERT INTO crop_recommendations (farmer_id, crop, confidence, reason, created_at)
--   VALUES (?, ?, ?, ?, ?);

-- Latest recommendation (CropRecommendationRepository.findFirstByFarmerIdOrderByCreatedAtDesc)
-- SELECT * FROM crop_recommendations WHERE farmer_id = ? ORDER BY created_at DESC LIMIT 1;

-- Market prices for a location (MarketPriceRepository.findByLocationIgnoreCase)
-- SELECT * FROM market_prices WHERE LOWER(location) = LOWER(?);

-- Disease detection, save (DiseaseService.detect)
-- INSERT INTO disease_detection_history (farmer_id, image_path, disease, confidence, status, detected_at)
--   VALUES (?, ?, ?, ?, ?, ?);

-- Most recent disease result for the dashboard (DiseaseDetectionRepository.findFirstByFarmerIdOrderByDetectedAtDesc)
-- SELECT * FROM disease_detection_history WHERE farmer_id = ? ORDER BY detected_at DESC LIMIT 1;

-- Full dashboard load (DashboardController.getDashboard) runs all of:
--   farmers SELECT, weather_data INSERT, soil_data SELECT (latest),
--   market_prices SELECT, crop_recommendations INSERT,
--   disease_detection_history SELECT (latest) - in that order, per request.
