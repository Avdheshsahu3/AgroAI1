package com.agroai.service;

import com.agroai.dto.RecommendationRequest;
import com.agroai.dto.RecommendationResponse;
import com.agroai.ml.CropModel;
import com.agroai.model.CropRecommendation;
import com.agroai.repository.CropRecommendationRepository;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Section 12 of the spec: the recommendation must always be derived from the
 * actual input features (soil + weather), never from a location lookup
 * table. RecommendationRequest.location is stored for record-keeping only -
 * CropModel.predict() never receives or branches on it.
 */
@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final CropModel cropModel;
    private final CropRecommendationRepository recommendationRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final RestTemplate restTemplate;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-flash-lite-latest}")
    private String geminiModel;

    public RecommendationService(CropModel cropModel,
                                 CropRecommendationRepository recommendationRepository,
                                 @Autowired(required = false) RestTemplate restTemplate) {
        this.cropModel = cropModel;
        this.recommendationRepository = recommendationRepository;
        this.restTemplate = restTemplate != null ? restTemplate : new RestTemplate();
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        double temperature = request.getTemperature() != null ? request.getTemperature() : 25.0;
        double humidity = request.getHumidity() != null ? request.getHumidity() : 60.0;
        double rainfall = request.getRainfall() != null ? request.getRainfall() : 100.0;

        CropModel.Prediction prediction = cropModel.predict(
                request.getNitrogen(), request.getPhosphorus(), request.getPotassium(),
                temperature, humidity, rainfall, request.getPh(), request.getMoisture());

        List<String> reasons = cropModel.explain(prediction.crop,
                request.getNitrogen(), request.getPhosphorus(), request.getPotassium(),
                temperature, humidity, rainfall, request.getPh(), request.getMoisture());

        RecommendationResponse response = new RecommendationResponse();
        response.setCrop(prediction.crop);
        response.setConfidence(Math.round(prediction.confidence * 1000) / 10.0); // as a percentage, e.g. 87.3
        response.setReasons(reasons);
        response.setReason(String.join(" ", reasons) +
                " This is an AI/model-based suggestion from a demo dataset and should not replace local agricultural expert advice.");
        response.setTemperature(temperature);
        response.setRainfall(rainfall);
        response.setLocation(request.getLocation());

        CropRecommendation entity = new CropRecommendation();
        entity.setFarmerId(request.getFarmerId());
        entity.setCrop(response.getCrop());
        entity.setConfidence(response.getConfidence());
        entity.setReason(response.getReason());
        recommendationRepository.save(entity);

        return response;
    }

    public com.agroai.dto.RecommendationChatResponse chat(com.agroai.dto.RecommendationChatRequest request) {
        String msg = request.getMessage() != null ? request.getMessage().trim() : "";
        String lowerMsg = msg.toLowerCase();

        // 1. Detect crop from message if mentioned, otherwise from request or default
        String crop = detectCrop(lowerMsg, request.getCrop());

        Double n = request.getNitrogen();
        Double p = request.getPhosphorus();
        Double k = request.getPotassium();
        Double ph = request.getPh();
        Double moisture = request.getMoisture();
        Double temp = request.getTemperature();
        Double rain = request.getRainfall();
        String loc = request.getLocation();

        // 1. Try calling Google Gemini AI first using the configured key
        String geminiReply = callGemini(crop, msg, n, p, k, ph, moisture, temp, rain, loc);
        if (geminiReply != null && !geminiReply.isBlank()) {
            java.util.List<String> suggestions = generateContextSuggestions(crop, msg);
            return new com.agroai.dto.RecommendationChatResponse(geminiReply, suggestions);
        }

        StringBuilder sb = new StringBuilder();
        java.util.List<String> suggestions = new java.util.ArrayList<>();

        // Intent 1: Leaf symptoms, yellowing, curling, disease diagnostics
        if (lowerMsg.contains("yellow") || lowerMsg.contains("curl") || lowerMsg.contains("spot") ||
            lowerMsg.contains("wilt") || lowerMsg.contains("burn") || lowerMsg.contains("dying") ||
            lowerMsg.contains("brown") || lowerMsg.contains("rot") || lowerMsg.contains("deficien") ||
            lowerMsg.contains("pila") || lowerMsg.contains("peela") || lowerMsg.contains("khad")) {

            sb.append("### 🍃 Plant Health & Leaf Symptom Diagnosis for **").append(crop).append("**\n\n");
            if (lowerMsg.contains("yellow") || lowerMsg.contains("peela") || lowerMsg.contains("pila")) {
                sb.append("Yellowing leaves (**Chlorosis**) in **").append(crop).append("** typically point to one of these root causes:\n\n");
                sb.append("1. **Nitrogen (N) Deficiency (Most Common):** Older, lower leaves turn uniformly pale green then yellow, while upper leaves stay green.\n");
                if (n != null && n < 120) {
                    sb.append("   - *Your soil telemetry confirms low Nitrogen (").append(n).append(" kg/ha).* **Remedy:** Apply 2% Urea foliar spray (20g/L water) or top-dress with Neem-coated Urea.\n");
                } else {
                    sb.append("   - **Remedy:** Top-dress with 25-30 kg/acre Neem-coated Urea or foliar spray 2% Urea for rapid greening.\n");
                }
                sb.append("2. **Iron (Fe) / Sulphur (S) Deficiency:** New younger leaves turn yellow while veins remain dark green (interveinal chlorosis).\n");
                sb.append("   - **Remedy:** Foliar spray Ferrous Sulphate (0.5% + 0.1% Citric Acid) or apply Agricultural Sulphur (25 kg/ha).\n");
                sb.append("3. **Waterlogging & Root Suffocation:** Excess moisture suffocates root oxygen uptake, inducing sudden yellowing.\n");
                if (rain != null && rain > 50) {
                    sb.append("   - *Rainfall alert (").append(Math.round(rain)).append(" mm):* Clear field drainage furrows immediately.\n");
                }
            } else if (lowerMsg.contains("curl")) {
                sb.append("Leaf curling in **").append(crop).append("** is usually caused by:\n\n");
                sb.append("1. **Sucking Pests (Thrips, Aphids, Whiteflies):** Feeding on leaf undersides causes puckering and upward/downward cupping.\n");
                sb.append("   - **Remedy:** Spray 1500 ppm Neem Oil (3-5 ml/L water) or Acetamiprid / Thiamethoxam (0.5g/L) for severe infestations.\n");
                sb.append("2. **Viral Infection (e.g. Leaf Curl Virus):** Leaves become stunted, leathery, and severely curled.\n");
                sb.append("   - **Remedy:** Uproot and burn infected plants; install yellow sticky traps (6/acre) to control the whitefly vector.\n");
            } else {
                sb.append("Identified foliar distress in **").append(crop).append("**:\n\n");
                sb.append("- **Fungal Spots / Blight:** Spray Mancozeb 75% WP (2.5 g/L) or Azoxystrobin (1 ml/L).\n");
                sb.append("- **Bacterial Wilt / Root Rot:** Drench root zone with Copper Oxychloride (3 g/L) + Streptocycline (1 g/10 L water).\n");
                sb.append("- **Marginal Scorch / Burnt Edges:** Potassium deficiency or high salinity. Spray Potassium Nitrate (13-0-45) at 10g/L.\n");
            }
            suggestions.add("What fertilizer dosage should I apply for " + crop + "?");
            suggestions.add("How to prevent pests organically in " + crop + "?");
            suggestions.add("What is the irrigation schedule for " + crop + "?");

        // Intent 2: Cultivation & Sowing Guide ("how to grow X", "farming", "cultivation")
        } else if (lowerMsg.contains("how to grow") || lowerMsg.contains("cultivat") || lowerMsg.contains("kheti") ||
                   lowerMsg.contains("sow") || lowerMsg.contains("plant") || lowerMsg.contains("seed") ||
                   lowerMsg.contains("spacing") || lowerMsg.contains("variet") || lowerMsg.contains("season")) {

            sb.append("### 🌱 Complete Cultivation & Agronomy Guide for **").append(crop).append("**\n\n");
            appendCropSpecificGuide(sb, crop, ph, n);
            suggestions.add("What fertilizers does " + crop + " need?");
            suggestions.add("What are critical watering stages for " + crop + "?");
            suggestions.add("Expected yield and mandi price for " + crop + "?");

        // Intent 3: Fertilizer & NPK nutrition
        } else if (lowerMsg.contains("fertilizer") || lowerMsg.contains("npk") || lowerMsg.contains("urea") ||
                   lowerMsg.contains("dap") || lowerMsg.contains("potash") || lowerMsg.contains("mop") ||
                   lowerMsg.contains("nutrient") || lowerMsg.contains("zinc") || lowerMsg.contains("manure") ||
                   lowerMsg.contains("compost")) {

            sb.append("### 🌾 Fertilizer & Nutrient Management Plan for **").append(crop).append("**\n\n");
            sb.append("Balanced nutrition maximizes yield and prevents lodging:\n\n");
            if (n != null) {
                if (n < 120) {
                    sb.append("- ⚠️ **Nitrogen is low (").append(n).append(" kg/ha):** Split application is vital: 50% basal at sowing, 25% at active tillering, and 25% at flowering. Use Neem-coated Urea.\n");
                } else {
                    sb.append("- ✅ **Nitrogen reserve is adequate (").append(n).append(" kg/ha):** Avoid excessive urea to prevent lush vegetative growth vulnerable to pests.\n");
                }
            }
            if (p != null) {
                if (p < 35) {
                    sb.append("- ⚠️ **Phosphorus is low (").append(p).append(" kg/ha):** Apply Single Superphosphate (SSP) or DAP (50-60 kg/acre) as a basal dressing before sowing for strong root establishment.\n");
                } else {
                    sb.append("- ✅ **Phosphorus level (").append(p).append(" kg/ha):** Sufficient for healthy root system.\n");
                }
            }
            if (k != null) {
                if (k < 140) {
                    sb.append("- ⚠️ **Potassium is low (").append(k).append(" kg/ha):** Apply Muriate of Potash (MOP) (25-30 kg/acre) to build disease resistance and grain/fruit filling.\n");
                } else {
                    sb.append("- ✅ **Potassium level (").append(k).append(" kg/ha):** Good reserve for drought tolerance.\n");
                }
            }
            sb.append("\n**Micronutrient Recommendation:**\n");
            sb.append("- Apply **Zinc Sulphate (21%)** at 10-12 kg/acre during field preparation to prevent zinc deficiency.\n");
            sb.append("- For flowering and fruit set, a foliar spray of **Boron 20%** (1 g/L water) at pre-flowering stage significantly boosts yields.\n");
            suggestions.add("What is the irrigation schedule for " + crop + "?");
            suggestions.add("How to prevent pests in " + crop + "?");
            suggestions.add("What is the expected yield per acre?");

        // Intent 4: Water & Irrigation
        } else if (lowerMsg.contains("water") || lowerMsg.contains("irrigat") || lowerMsg.contains("moisture") ||
                   lowerMsg.contains("rain") || lowerMsg.contains("pani") || lowerMsg.contains("drip")) {

            sb.append("### 💧 Irrigation & Water Strategy for **").append(crop).append("**\n\n");
            if (rain != null && rain > 50) {
                sb.append("🌧️ **Recent/Forecasted Rainfall (").append(Math.round(rain)).append(" mm):** High rainfall detected. Ensure field drainage channels are clear to prevent waterlogging and root rot.\n\n");
            }
            if (moisture != null) {
                sb.append("Current soil moisture is **").append(Math.round(moisture)).append("%**.\n");
                if (moisture < 40) {
                    sb.append("- ⚠️ Moisture is low. A light irrigation is advised before seed germination or critical vegetative stage.\n");
                } else if (moisture > 75) {
                    sb.append("- ⚠️ Moisture is saturated. Hold off on additional watering until topsoil (2-3 inches) dries out.\n");
                } else {
                    sb.append("- ✅ Moisture is in an optimal zone for healthy root aeration.\n");
                }
            }
            sb.append("\n**Critical Irrigation Stages for ").append(crop).append(":**\n");
            sb.append("1. **Establishment / Crown Root Initiation:** (18-25 days after sowing) - crucial for root anchorage.\n");
            sb.append("2. **Vegetative Peak / Jointing:** (40-45 days after sowing) - rapid biomass accumulation.\n");
            sb.append("3. **Flowering / Anthesis Stage:** Moisture stress here causes up to 40% yield loss through flower drop.\n");
            sb.append("4. **Grain / Pod / Tuber Filling:** Light irrigation ensures uniform, plump produce.\n");
            suggestions.add("What fertilizer schedule is best for " + crop + "?");
            suggestions.add("How to protect " + crop + " from fungal diseases?");
            suggestions.add("When is the best harvesting time?");

        // Intent 5: Pests, insects, fungus & protection
        } else if (lowerMsg.contains("pest") || lowerMsg.contains("disease") || lowerMsg.contains("insect") ||
                   lowerMsg.contains("spray") || lowerMsg.contains("fungus") || lowerMsg.contains("keeda") ||
                   lowerMsg.contains("dawa") || lowerMsg.contains("aphid") || lowerMsg.contains("borer") ||
                   lowerMsg.contains("blight")) {

            sb.append("### 🛡️ Integrated Pest & Disease Protection for **").append(crop).append("**\n\n");
            sb.append("Proactive Integrated Pest Management (IPM) prevents 25-30% harvest loss:\n\n");
            sb.append("1. **Seed Treatment (Prevention First):** Treat seeds with *Trichoderma viride* (4g/kg seed) or Carbendazim (2g/kg) to eliminate seed-borne rots.\n");
            sb.append("2. **Sucking Pests (Aphids, Jassids, Whitefly, Thrips):** Spray Neem seed kernel extract (NSKE 5%) or 1500 ppm neem oil (3-5 ml/L water) at early infestation. For severe infestation, spray Imidacloprid (0.5 ml/L).\n");
            sb.append("3. **Borers & Caterpillars (Pod Borer, Armyworm, Bollworm):** Install 4-5 pheromone traps per acre. Spray *Bacillus thuringiensis* (Bt) or Chlorantraniliprole (0.3 ml/L).\n");
            sb.append("4. **Fungal Blights / Rust / Leaf Spots:** Ensure proper field spacing. Apply Mancozeb (2.5 g/L) or Azoxystrobin (1 ml/L) as soon as lesions appear.\n");
            sb.append("5. **Monitoring Traps:** Install 5 yellow sticky traps + 5 blue sticky traps per acre for continuous pest surveillance.\n");
            suggestions.add("What organic bio-pesticides work best for " + crop + "?");
            suggestions.add("What fertilizers does " + crop + " need?");
            suggestions.add("Expected yield and mandi price?");

        // Intent 6: Soil health & pH
        } else if (lowerMsg.contains("soil") || lowerMsg.contains("ph") || lowerMsg.contains("acid") ||
                   lowerMsg.contains("alkali") || lowerMsg.contains("mitti") || lowerMsg.contains("salin") ||
                   lowerMsg.contains("black soil")) {

            sb.append("### 🧪 Soil Health & Chemistry Analysis for **").append(crop).append("**\n\n");
            if (ph != null) {
                sb.append("Your soil pH is **").append(ph).append("**:\n");
                if (ph < 6.0) {
                    sb.append("- ⚠️ **Acidic Soil:** Phosphorus and micronutrient uptake is locked. Incorporate Agricultural Lime or Dolomite (200-300 kg/acre) during summer plowing.\n");
                } else if (ph > 8.0) {
                    sb.append("- ⚠️ **Alkaline / Sodic Soil:** Micronutrient availability (Fe, Zn) is restricted. Apply Agricultural Gypsum (300-400 kg/acre) + organic compost.\n");
                } else {
                    sb.append("- ✅ **Optimal Neutral Range (6.2 - 7.5):** Excellent nutrient bioavailability for ").append(crop).append(".\n");
                }
            }
            if (n != null && p != null && k != null) {
                sb.append("- **Current Nutrient Reserve:** N: ").append(n).append(" | P: ").append(p).append(" | K: ").append(k).append(" kg/ha.\n");
            }
            sb.append("\n**Soil Regeneration Tips:**\n");
            sb.append("- Add 4-5 tonnes/acre of well-rotted Farmyard Manure (FYM) or 2 tonnes of Vermicompost.\n");
            sb.append("- Incorporate green manuring crops like Dhaincha (*Sesbania*) or Sunnhemp prior to sowing to naturally build organic carbon.\n");
            suggestions.add("How to grow " + crop + " step by step?");
            suggestions.add("What fertilizers should I apply?");
            suggestions.add("Which crop should I rotate next?");

        // Intent 7: Harvest, yield & Mandi prices
        } else if (lowerMsg.contains("yield") || lowerMsg.contains("harvest") || lowerMsg.contains("market") ||
                   lowerMsg.contains("profit") || lowerMsg.contains("price") || lowerMsg.contains("mandi") ||
                   lowerMsg.contains("rate") || lowerMsg.contains("bhav") || lowerMsg.contains("quintal") ||
                   lowerMsg.contains("earn")) {

            sb.append("### 📈 Harvest, Yield Potential & Mandi Selling Strategy for **").append(crop).append("**\n\n");
            appendCropYieldGuide(sb, crop);
            sb.append("\n**Market Realization Tip:** Use AgroAI's live Mandi price comparison tab to monitor regional APMC price spikes and sell in tranches to capture peak prices.\n");
            suggestions.add("What is the fertilizer schedule for " + crop + "?");
            suggestions.add("How to store harvest safely without pests?");
            suggestions.add("What is the next best rotation crop?");

        // Intent 8: Crop rotation & intercropping
        } else if (lowerMsg.contains("rotation") || lowerMsg.contains("intercrop") || lowerMsg.contains("next crop") ||
                   lowerMsg.contains("after")) {

            sb.append("### 🔄 Crop Rotation & Companion Planting Guide\n\n");
            sb.append("For sustainable soil fertility following **").append(crop).append("**:\n\n");
            sb.append("1. **Legume Rotation:** Follow exhaustive cereals with nitrogen-fixing pulses (Chickpea, Moong, Urad, Lentil) to naturally replenish 30-40 kg N/ha into the soil.\n");
            sb.append("2. **Break Disease Cycles:** Never plant related botanical families back-to-back (e.g. avoid Tomato immediately after Potato or Chilli) to disrupt soil-borne pathogens.\n");
            sb.append("3. **Deep vs Shallow Root Alternation:** Alternate deep-rooted crops (Cotton, Pigeonpea) with shallow-rooted crops (Wheat, Onion) to utilize subsoil moisture and nutrients uniformly.\n");
            sb.append("4. **Green Manuring:** Grow Dhaincha (*Sesbania*) or Cowpea during Zaid season and plow into soil at 45 days.\n");
            suggestions.add("How does my soil look for " + crop + "?");
            suggestions.add("What fertilizers do I need?");
            suggestions.add("What is the irrigation schedule?");

        // Intent 9: Organic & Natural Farming
        } else if (lowerMsg.contains("organic") || lowerMsg.contains("natural") || lowerMsg.contains("jaivik") ||
                   lowerMsg.contains("jeevamrut") || lowerMsg.contains("panchagavya") || lowerMsg.contains("bio")) {

            sb.append("### 🌿 Zero-Budget Natural & Organic Farming for **").append(crop).append("**\n\n");
            sb.append("Proven organic protocols for high vigor without synthetic chemicals:\n\n");
            sb.append("1. **Jeevamrutha Microbial Booster:** Mix 10 kg native cow dung + 10 L cow urine + 2 kg jaggery + 2 kg gram flour + handful fertile soil in 200 L water. Ferment for 48 hours and apply 200 L/acre with irrigation.\n");
            sb.append("2. **Beejamrutha Seed Treatment:** Coat seeds with cow dung, cow urine, lime, and soil slurry to protect against damping-off and seed-borne wilt.\n");
            sb.append("3. **Neemastra Bio-Pesticide:** 5 kg neem leaves + 5 L cow urine + 2 kg cow dung fermented in 100 L water for 24 hours. Highly effective against chewing and sucking caterpillars.\n");
            sb.append("4. **Vermicompost:** Apply 2 tonnes/acre as basal organic matter to enhance moisture retention and soil microbes.\n");
            suggestions.add("How to manage pests organically in " + crop + "?");
            suggestions.add("What is the expected yield with organic methods?");
            suggestions.add("What is the irrigation schedule?");

        // Intent 10: Compost, Manure & Bio-fertilizer
        } else if (lowerMsg.contains("compost") || lowerMsg.contains("gobar") || lowerMsg.contains("fym") ||
                   lowerMsg.contains("manure") || lowerMsg.contains("jeevamrut") || lowerMsg.contains("vermi")) {
            sb.append("### 🍂 Organic Compost & Bio-Manure Preparation Guide\n\n");
            sb.append("1. **Farmyard Manure (FYM):** Fully decomposed cow dung applied at 4-5 tonnes/acre 3 weeks before sowing enhances soil water retention and microbial activity.\n");
            sb.append("2. **Vermicompost:** Apply 2 tonnes/acre as basal dressing. Contains rich humic acids and micronutrients that boost root cation exchange capacity.\n");
            sb.append("3. **Jeevamrutha Formulation:** Mix 10 kg fresh cow dung + 10 L cow urine + 2 kg jaggery + 2 kg pulse flour + handful fertile soil in 200 L water. Ferment for 48 hours and apply via irrigation.\n");
            sb.append("4. **Phosphate Rich Organic Manure (PROM):** High-grade alternative to chemical DAP; prevents soil phosphorus fixation in neutral to alkaline soils.\n");
            suggestions.add("How to make vermicompost at home?");
            suggestions.add("What is the fertilizer schedule for " + crop + "?");
            suggestions.add("How to prevent pests in " + crop + "?");

        // Intent 11: Government schemes, subsidies & Kisan support
        } else if (lowerMsg.contains("scheme") || lowerMsg.contains("subsidy") || lowerMsg.contains("kcc") ||
                   lowerMsg.contains("credit") || lowerMsg.contains("yojana") || lowerMsg.contains("pm-kisan") ||
                   lowerMsg.contains("bima") || lowerMsg.contains("insurance")) {
            sb.append("### 🏛️ Key Indian Government Agricultural Schemes & Farmer Benefits\n\n");
            sb.append("1. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi):** Direct income support of ₹6,000/year in three equal 4-monthly installments of ₹2,000.\n");
            sb.append("2. **Kisan Credit Card (KCC):** Institutional credit at a concessional interest rate of 4% per annum (with 3% prompt repayment incentive) up to ₹3 Lakh.\n");
            sb.append("3. **PM Fasal Bima Yojana (PMFBY):** Comprehensive crop loss insurance. Farmer premium: 1.5% for Rabi, 2% for Kharif, 5% for commercial/horticultural crops.\n");
            sb.append("4. **Subsidies on Drip & Sprinkler (PMKSY):** Up to 45–55% financial assistance for micro-irrigation installation through state agriculture departments.\n");
            suggestions.add("How to apply for Kisan Credit Card?");
            suggestions.add("What are best subsidies for drip irrigation?");
            suggestions.add("Market prices in nearby mandis");

        // Intent 12: General farming consultation & agronomy overview
        } else {
            sb.append("### 🌾 AgroAI Crop & Field Advisor\n\n");
            sb.append("Namaste Kisan! I am your AI Agronomist assisting with **").append(crop).append("**");
            if (loc != null && !loc.isBlank()) {
                sb.append(" in **").append(loc).append("**");
            }
            sb.append(".\n\n");
            sb.append("Here are practical recommendations for your field:\n");
            if (n != null && p != null && k != null) {
                sb.append("- **Soil Nutrients:** N: ").append(n).append(" | P: ").append(p).append(" | K: ").append(k).append(" kg/ha\n");
            }
            if (ph != null) {
                sb.append("- **Soil pH:** ").append(ph).append(" (").append(ph < 6.0 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Optimal Neutral").append(")\n");
            }
            if (temp != null) {
                sb.append("- **Temperature:** ").append(Math.round(temp)).append("°C\n");
            }
            if (rain != null) {
                sb.append("- **Forecasted Rainfall:** ").append(Math.round(rain)).append(" mm\n");
            }
            sb.append("\n**Ask me any farming question:**\n");
            sb.append("• Sowing guidelines, spacing, and certified seed varieties for **").append(crop).append("**\n");
            sb.append("• Basal and top-dressing fertilizer schedules (Urea, DAP, Potash, Zinc)\n");
            sb.append("• Organic remedies (Neem oil, Jeevamrutha, bio-fungicides)\n");
            sb.append("• Diagnosing leaf symptoms (yellowing, curling, fungal spots)\n");
            sb.append("• Irrigation scheduling and pest control\n");

            suggestions.add("How to grow " + crop + " step by step?");
            suggestions.add("Fertilizer dosage for " + crop);
            suggestions.add("Why are leaves turning yellow?");
            suggestions.add("Irrigation schedule for " + crop);
        }

        return new com.agroai.dto.RecommendationChatResponse(sb.toString(), suggestions);
    }

    private String detectCrop(String lowerMsg, String requestedCrop) {
        String[] cropNames = {
            "Wheat", "Rice", "Paddy", "Cotton", "Soybean", "Soyabean", "Mustard", "Sarson",
            "Chickpea", "Gram", "Chana", "Maize", "Corn", "Tomato", "Potato", "Onion",
            "Sugarcane", "Ganna", "Groundnut", "Peanut", "Mungfali", "Turmeric", "Haldi",
            "Banana", "Chilli", "Chili", "Mirch", "Brinjal", "Baingan", "Moong", "Urad",
            "Millet", "Bajra", "Jowar", "Barley", "Garlic", "Ginger"
        };
        for (String c : cropNames) {
            if (lowerMsg.contains(c.toLowerCase())) {
                if (c.equalsIgnoreCase("Paddy")) return "Rice";
                if (c.equalsIgnoreCase("Corn")) return "Maize";
                if (c.equalsIgnoreCase("Gram") || c.equalsIgnoreCase("Chana")) return "Chickpea";
                if (c.equalsIgnoreCase("Peanut") || c.equalsIgnoreCase("Mungfali")) return "Groundnut";
                if (c.equalsIgnoreCase("Chili") || c.equalsIgnoreCase("Mirch")) return "Chilli";
                if (c.equalsIgnoreCase("Baingan")) return "Brinjal";
                if (c.equalsIgnoreCase("Sarson")) return "Mustard";
                if (c.equalsIgnoreCase("Soyabean")) return "Soybean";
                if (c.equalsIgnoreCase("Ganna")) return "Sugarcane";
                if (c.equalsIgnoreCase("Haldi")) return "Turmeric";
                return c;
            }
        }
        if (requestedCrop != null && !requestedCrop.isBlank() &&
            !requestedCrop.equalsIgnoreCase("General Crop") &&
            !requestedCrop.equalsIgnoreCase("your crop")) {
            return requestedCrop.trim();
        }
        return "Wheat"; // Default reference crop
    }

    private void appendCropSpecificGuide(StringBuilder sb, String crop, Double ph, Double n) {
        String c = crop.toLowerCase();
        if (c.contains("wheat")) {
            sb.append("**Season & Sowing:** Rabi season (Optimal: Nov 1–15). Seed rate: 100 kg/ha for timely sown, 125 kg/ha for late sown.\n");
            sb.append("**Seed Treatment:** Treat with Carboxin + Thiram (2.5 g/kg) or *Trichoderma* (5 g/kg) to eliminate loose smut and bunts.\n");
            sb.append("**Spacing:** 20-22.5 cm row spacing, 4-5 cm depth into moist seedbed.\n");
            sb.append("**Key Varieties:** PBW 550, HD 2967, HD 3086, DBW 187 (Karan Vandana), Sharbati.\n");
            sb.append("**Watering:** 5-6 irrigations, most critically at Crown Root Initiation (21 days) and Flowering.\n");
        } else if (c.contains("rice") || c.contains("paddy")) {
            sb.append("**Season & Sowing:** Kharif season. Nursery sowing: May-June; transplanting at 21-25 days.\n");
            sb.append("**Field Prep:** 2 wet plowings followed by thorough puddling and planking for water retention.\n");
            sb.append("**Spacing:** 20x15 cm spacing with 2-3 seedlings per hill.\n");
            sb.append("**Key Varieties:** Basmati 1121, Pusa 1509, PR-126, MTU 1010, IR-64.\n");
            sb.append("**Watering:** Maintain 2-5 cm standing water until dough stage; drain 10-14 days before harvest.\n");
        } else if (c.contains("tomato")) {
            sb.append("**Season & Sowing:** Kharif (June-July), Rabi (Oct-Nov), or Summer (Jan-Feb). Raise nursery for 25-30 days.\n");
            sb.append("**Spacing:** Raised beds with drip irrigation. Spacing: 60x45 cm for determinate, 90x45 cm for indeterminate.\n");
            sb.append("**Staking:** Stake indeterminate varieties with bamboo poles or wire trellis for quality unblemished fruit.\n");
            sb.append("**Key Varieties:** Arka Rakshak (triple disease resistant), Pusa Ruby, US-440, Abhinav.\n");
            sb.append("**Nutrition:** Foliar spray Calcium Nitrate (1%) to prevent blossom end rot.\n");
        } else if (c.contains("potato")) {
            sb.append("**Season & Sowing:** Main winter crop planted in Oct-Nov when temperatures drop below 30°C.\n");
            sb.append("**Seed Tubers:** Use certified disease-free sprouted tubers (30-40g each) treated with Mancozeb.\n");
            sb.append("**Spacing & Ridging:** Ridge planting at 60x20 cm. Earthing up at 30 days is essential to prevent greening of tubers.\n");
            sb.append("**Key Varieties:** Kufri Jyoti, Kufri Pukhraj, Kufri Bahar, Kufri Chipsona (processing).\n");
            sb.append("**Protection:** Preventive Mancozeb spray (2.5 g/L) against Late Blight as soon as humidity rises.\n");
        } else if (c.contains("onion")) {
            sb.append("**Season & Sowing:** Rabi (nursery Oct-Nov, transplant Dec-Jan) or Kharif (nursery May-June).\n");
            sb.append("**Spacing:** Flat beds or broad bed furrows (BBF) at 15x10 cm spacing with 6-7 week old seedlings.\n");
            sb.append("**Key Varieties:** Bhima Super, Bhima Dark Red, Agri-Found Dark Red, N-53.\n");
            sb.append("**Watering:** Frequent light irrigations; stop watering 10-15 days before harvest for bulb curing.\n");
        } else if (c.contains("cotton")) {
            sb.append("**Season & Sowing:** Sown with the onset of monsoon (May-June) in deep black or loamy soils.\n");
            sb.append("**Spacing:** 90x60 cm or 120x45 cm for Bt Cotton hybrids.\n");
            sb.append("**Nutrition:** High potash requirement for boll retention and fiber strength.\n");
            sb.append("**Key Varieties:** RCH-2 Bt, Bollgard II hybrids, Suraj.\n");
            sb.append("**Pest Monitoring:** Install pheromone traps (5/acre) to monitor pink bollworm.\n");
        } else if (c.contains("mustard")) {
            sb.append("**Season & Sowing:** Sown in October when day temperatures moderate. Seed rate: 4-5 kg/ha.\n");
            sb.append("**Spacing:** 30x10 cm with 2-3 cm depth.\n");
            sb.append("**Key Varieties:** Pusa Bold, RH-749, Giriraj, Kranti.\n");
            sb.append("**Nutrition:** Apply Sulphur (25-30 kg/ha) at sowing to boost oil content above 40%.\n");
        } else if (c.contains("soybean")) {
            sb.append("**Season & Sowing:** Kharif sowing with 75-100 mm monsoon rain in June-July. Seed rate: 65-75 kg/ha.\n");
            sb.append("**Inoculation:** Inoculate seeds with *Bradyrhizobium japonicum* culture + *Trichoderma*.\n");
            sb.append("**Spacing:** Broad bed furrow (BBF) or ridge & furrow at 45x5 cm.\n");
            sb.append("**Key Varieties:** JS-335, JS-9560, NRC-37, KDS-726 (Phule Sangam).\n");
        } else {
            sb.append("**Agronomic Best Practices:**\n");
            sb.append("- **Land Prep:** 1 deep summer plowing followed by 2 cross-harrowings to create a weed-free tilth.\n");
            sb.append("- **Seed Treatment:** Bio-fungicide treatment (*Trichoderma viride* 5g/kg) is essential for seed health.\n");
            sb.append("- **Spacing:** Maintain standard row and plant spacing to optimize sunlight and air circulation.\n");
            sb.append("- **Weed Control:** One hand-weeding at 20-25 days or pre-emergence herbicide within 48 hours of sowing.\n");
        }
    }

    private void appendCropYieldGuide(StringBuilder sb, String crop) {
        String c = crop.toLowerCase();
        if (c.contains("wheat")) {
            sb.append("- **Expected Yield:** 18–24 Quintals per acre (45–60 q/ha) under good agronomic care.\n");
            sb.append("- **Maturity Duration:** 115–130 days.\n");
            sb.append("- **Harvest Indicators:** Grains become hard and flinty (cracking between teeth), straw turns golden-yellow.\n");
        } else if (c.contains("rice") || c.contains("paddy")) {
            sb.append("- **Expected Yield:** 20–28 Quintals per acre (50–70 q/ha) for high-yielding varieties; 14-18 q/acre for Basmati.\n");
            sb.append("- **Maturity Duration:** 110–140 days.\n");
            sb.append("- **Harvest Indicators:** 80-85% panicles turn golden brown and grain moisture drops to 20-22%.\n");
        } else if (c.contains("tomato")) {
            sb.append("- **Expected Yield:** 150–250 Quintals per acre (15–25 tonnes/acre) for high-yielding hybrids.\n");
            sb.append("- **Harvest Window:** Multiple pickings every 4-5 days over a 60-75 day fruiting period.\n");
            sb.append("- **Harvest Stage:** Breaker stage (pink blossom end) for distant markets; red-ripe for local mandis.\n");
        } else if (c.contains("potato")) {
            sb.append("- **Expected Yield:** 100–140 Quintals per acre (25–35 tonnes/ha).\n");
            sb.append("- **Maturity Duration:** 80–100 days.\n");
            sb.append("- **Curing:** Dehaulm (cut foliage) 10-12 days before harvest to firm up the tuber skin.\n");
        } else if (c.contains("onion")) {
            sb.append("- **Expected Yield:** 100–130 Quintals per acre for Rabi onion; 80-100 q/acre for Kharif.\n");
            sb.append("- **Harvest Stage:** When 50% of the tops fall over (neck fall), bulbs are fully mature.\n");
            sb.append("- **Curing:** Cure bulbs under shade with foliage for 8-10 days to prolong storage life.\n");
        } else if (c.contains("cotton")) {
            sb.append("- **Expected Yield:** 8–12 Quintals seed cotton (Kapas) per acre under irrigated Bt conditions.\n");
            sb.append("- **Picking:** Pick fully opened bolls during dry afternoon hours to avoid trash and moisture staining.\n");
        } else if (c.contains("mustard")) {
            sb.append("- **Expected Yield:** 8–12 Quintals per acre (20–25 q/ha).\n");
            sb.append("- **Harvest Stage:** When 75-80% pods turn golden-yellow to avoid pod shattering in the field.\n");
        } else if (c.contains("soybean")) {
            sb.append("- **Expected Yield:** 8–12 Quintals per acre (20–25 q/ha).\n");
            sb.append("- **Harvest Stage:** When leaves turn yellow and drop off, and pods rattle when shaken.\n");
        } else {
            sb.append("- **Expected Yield:** High yields correlate directly with balanced basal fertilization and timely weed control.\n");
            sb.append("- **Safe Storage:** Sun dry grain thoroughly on clean tarpaulins until moisture reaches <12% to prevent mold and storage weevils.\n");
        }
    }

    private String callGemini(String crop, String userQuery, Double n, Double p, Double k,
                              Double ph, Double moisture, Double temp, Double rain, String loc) {
        if (geminiApiKey == null || geminiApiKey.isBlank() || restTemplate == null) {
            log.warn("Gemini API key is missing or restTemplate is null. geminiApiKey present: {}", (geminiApiKey != null && !geminiApiKey.isBlank()));
            return null;
        }

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are AgroAI, a highly intelligent, friendly, and versatile AI assistant. Answer the user's question directly, clearly, and comprehensively.\n\n");
        prompt.append("Core Guidelines:\n");
        prompt.append("1. Answer ANY question the user asks—whether about agriculture, farming, crops, pest control, weather, soil health, government schemes, or general knowledge, science, daily life, calculations, letters, technology, and health. You are a full normal AI assistant.\n");
        prompt.append("2. If the user asks about crops or farming, provide expert, practical advice (including dosages and both organic and chemical options).\n");
        prompt.append("3. Format responses cleanly using structured Markdown with headings (###), bold key terms (**word**), and bullet points.\n");
        prompt.append("4. Fluently understand and reply in whichever language the user asks in (English, Hindi, Hinglish, etc.).\n");
        prompt.append("5. Maintain a polite, helpful, and respectful tone.\n\n");

        boolean hasContext = false;
        StringBuilder ctx = new StringBuilder("Optional Farm Telemetry Context (use only if relevant to the question):\n");
        if (crop != null && !crop.isBlank() && !crop.equalsIgnoreCase("General Crop") && !crop.equalsIgnoreCase("your crop")) {
            ctx.append("- Current Crop: ").append(crop).append("\n");
            hasContext = true;
        }
        if (loc != null && !loc.isBlank()) {
            ctx.append("- Location: ").append(loc).append("\n");
            hasContext = true;
        }
        if (n != null && p != null && k != null) {
            ctx.append("- Soil N-P-K: ").append(n).append(" : ").append(p).append(" : ").append(k).append(" kg/ha\n");
            hasContext = true;
        }
        if (ph != null) {
            ctx.append("- Soil pH: ").append(ph).append("\n");
            hasContext = true;
        }
        if (temp != null) {
            ctx.append("- Temperature: ").append(temp).append("°C\n");
            hasContext = true;
        }
        if (rain != null) {
            ctx.append("- Rainfall: ").append(rain).append(" mm\n");
            hasContext = true;
        }
        if (hasContext) {
            prompt.append(ctx).append("\n");
        }

        prompt.append("User's Question: ").append(userQuery);

        List<String> modelsToTry = new ArrayList<>();
        if (geminiModel != null && !geminiModel.isBlank()) {
            modelsToTry.add(geminiModel.trim());
        }
        for (String m : new String[]{"gemini-flash-lite-latest", "gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"}) {
            if (!modelsToTry.contains(m)) {
                modelsToTry.add(m);
            }
        }

        for (String model : modelsToTry) {
            try {
                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + geminiApiKey;

                Map<String, Object> part = new HashMap<>();
                part.put("text", prompt.toString());

                Map<String, Object> content = new HashMap<>();
                content.put("parts", List.of(part));

                Map<String, Object> body = new HashMap<>();
                body.put("contents", List.of(content));

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        JsonNode parts = candidates.get(0).path("content").path("parts");
                        if (parts.isArray()) {
                            for (JsonNode partNode : parts) {
                                if (partNode.has("text") && !partNode.get("text").asText().isBlank()) {
                                    log.info("Gemini AI successfully replied using model: {}", model);
                                    return partNode.get("text").asText();
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Gemini model '{}' attempt failed: {}", model, e.getMessage());
            }
        }
        log.warn("All Gemini models failed. Falling back to local agronomy rules engine.");
        return null;
    }

    private java.util.List<String> generateContextSuggestions(String crop, String query) {
        java.util.List<String> suggestions = new java.util.ArrayList<>();
        String q = (query != null ? query : "").toLowerCase();

        if (q.contains("fertilizer") || q.contains("urea") || q.contains("dap") || q.contains("npk")) {
            suggestions.add("What are the split dosages for " + crop + "?");
            suggestions.add("How to apply Zinc and micronutrients in " + crop + "?");
            suggestions.add("What organic alternatives can replace chemical DAP?");
            suggestions.add("Watering schedule after fertilizer application?");
        } else if (q.contains("pest") || q.contains("spray") || q.contains("keeda") || q.contains("disease")) {
            suggestions.add("What is the Neem oil dosage per liter?");
            suggestions.add("How to install pheromone traps in " + crop + "?");
            suggestions.add("Fungicide spray for leaf blight in " + crop);
            suggestions.add("Organic bio-pesticides for sucking insects");
        } else if (q.contains("water") || q.contains("irrigat") || q.contains("pani") || q.contains("drip")) {
            suggestions.add("Critical watering stages for " + crop);
            suggestions.add("How much water does drip irrigation save?");
            suggestions.add("Managing waterlogging during heavy rainfall");
            suggestions.add("Fertigation schedule through drip pipes");
        } else {
            suggestions.add("What is the fertilizer schedule for " + crop + "?");
            suggestions.add("How to prevent pests organically in " + crop + "?");
            suggestions.add("What are critical watering stages for " + crop + "?");
            suggestions.add("Expected yield and mandi price for " + crop + "?");
        }
        return suggestions;
    }
}
