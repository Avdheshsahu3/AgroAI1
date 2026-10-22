# AgroAI / KrishiMitra

An AI-assisted crop recommendation web app: farmers enter their location and soil
readings, and get a live weather picture, a soil health snapshot, an ML-based crop
recommendation with an explanation, mandi market prices, and a crop-disease-detection
upload.

> **Status of this build:** every file in this repo is real, complete source code
> (not pseudocode). It was written and reviewed carefully, but it has **not been
> compiled or run** in the environment that produced it (no network access to
> download Maven/npm dependencies there). Follow the steps below on your own
> machine, and see "If something doesn't compile" if `mvn` surfaces an issue.

---

## 1. What's real vs. what's a demo

- **Weather**: real, live data from [Open-Meteo](https://open-meteo.com) (no API key needed). Geocoding + current conditions + 7-day forecast are all genuinely dynamic - nothing is hardcoded per location.
- **Crop recommendation**: a real model trained at startup on `backend/src/main/resources/data/crop_training.csv`. That CSV is a **demo dataset** (illustrative agronomic ranges I generated, not a validated agricultural survey) - see section 5 below for swapping in a real one. The recommendation always comes from your actual soil + weather inputs, never a location lookup table.
- **Market prices**: **demo data only**, generated deterministically per location/day so it feels stable but isn't a live mandi feed. Section 6 below covers wiring in Agmarknet/eNAM.
- **Disease detection**: a **stub**. It really accepts, validates and stores the uploaded image, but the "diagnosis" is a labeled placeholder, not a trained CNN. See section 7.
- **Auth**: real BCrypt password hashing, no plain-text storage. There's no JWT/session token yet (see "Moving to production auth").

---

## 2. Requirements

- Java 17+
- Maven 3.9+
- Node.js 20+ and npm
- Docker + Docker Compose (only needed for the containerized/production path)

---

## 3. Run it locally (no Docker)

### Backend

```bash
cd backend
mvn clean spring-boot:run
```

This starts on `http://localhost:8080` using an in-memory H2 database - no setup
required. Inspect it live at `http://localhost:8080/h2-console` (JDBC URL:
`jdbc:h2:mem:agroai`, user `sa`, blank password).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

This starts on `http://localhost:5173` and talks to the backend via
`VITE_API_BASE_URL` (defaults to `http://localhost:8080/api`; override in
`frontend/.env`, copying from `.env.example`).

Open `http://localhost:5173`, register a farmer, set a location like
"Jabalpur, Madhya Pradesh", add a soil reading, and the dashboard will
pull live weather + a crop recommendation.

---

## 4. Switching to MySQL

1. Create a database: `CREATE DATABASE agroai;`
2. Set environment variables before starting the backend:
   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/agroai?allowPublicKeyRetrieval=true&useSSL=false"
   export DB_USERNAME=root
   export DB_PASSWORD=your_password
   ```
3. In `backend/src/main/resources/application.properties`, uncomment the line:
   ```properties
   spring.jpa.properties.hibernate.dialect... (not required - auto-detected)
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```
4. Run `mvn clean spring-boot:run` as before. Hibernate's `ddl-auto=update` will create the tables (`farmers`, `soil_data`, `weather_data`, `crop_recommendations`, `market_prices`, `disease_detection_history`).

---

## 5. Replacing the demo ML dataset with a real one

The model lives in `backend/src/main/java/com/agroai/ml/CropModel.java`. It reads
`backend/src/main/resources/data/crop_training.csv`, which must keep this exact
header:

```
N,P,K,temperature,humidity,rainfall,ph,moisture,previous_crop,crop
```

To use a validated dataset (e.g. an ICAR or state agricultural department release,
or a properly licensed public dataset):

1. Replace the CSV with your real data, keeping the same header/column order.
2. Add more crops if needed - `CropModel` reads class names directly from the CSV, nothing is hardcoded.
3. Restart the backend. Both the Smile RandomForest path and the fallback classifier retrain automatically from whatever CSV is present.

No Java code changes are required for a same-shaped CSV swap.

### How the model works

- **Primary path**: `RandomForest.fit(formula, dataframe)` from the [Smile](https://haifengl.github.io/) ML library, trained on the CSV every time the app starts.
- **Fallback path**: if Smile's training or prediction call throws for any reason (for example, a version mismatch in the exact method signature - something that couldn't be verified without compiling against the real dependency), the app automatically falls back to a dependency-free weighted nearest-centroid classifier built from the same CSV, so the feature keeps working end-to-end either way. Check the backend startup logs for `"Crop RandomForest trained..."` vs `"Falling back to the built-in..."` to see which one is active.
- Either way, the "why" explanation (`CropModel.explain`) is computed independently by comparing your inputs against each crop's observed min/max range in the CSV, so the reasoning shown to the farmer is always transparent and dataset-driven.

---

## 6. Connecting a real market-price source

`backend/src/main/java/com/agroai/service/MarketService.java` currently generates
demo prices. To go live:

1. Get access to an approved source (Agmarknet API, eNAM, or another permitted feed).
2. Replace the body of `getPricesForLocation()` with a call to that source, mapping its response into the existing `MarketPrice` model.
3. Nothing else changes - the controller, DTO shape, and frontend components (`MarketPriceTable`, `MarketChart`) are already wired to that shape.

Do not scrape mandi websites without authorization - this was intentionally left out.

---

## 7. Connecting a real disease-detection model

`backend/src/main/java/com/agroai/service/DiseaseService.java` stores the upload
and returns a labeled placeholder response. To connect a real CNN:

1. Train/validate a plant-disease classification model (a public starting point is the PlantVillage dataset, if its license fits your use case).
2. Serve it either:
   - behind a small **FastAPI** service that the Spring backend calls over HTTP with the stored image path, or
   - exported to **ONNX** and run in-process via ONNX Runtime for Java, or
   - trained/run directly in **DeepLearning4J**.
3. Replace the "STUB DETECTION LOGIC" block in `DiseaseService.detect()` with the real call, keeping the `DiseaseDetectionResponse` shape (`disease`, `confidence`, `status`, `message`) so the frontend doesn't need changes - just update `status` away from `"demo"`.

---

## 8. Moving to production auth

For the initial prototype, login returns the farmer's profile directly with no
token, and the frontend just remembers the farmer ID in `localStorage`. Before
shipping this for real:

1. Add `spring-boot-starter-security` and `jjwt` (or Spring's own JWT support) to `pom.xml`.
2. Issue a JWT on login/register, add a `FARMER` / `ADMIN` role to `Farmer`, and add a `SecurityFilterChain` that validates the token on every `/api/**` request except `/api/auth/**`.
3. On the frontend, attach the token as an `Authorization: Bearer ...` header in `src/services/api.js` (an axios request interceptor is the natural place) instead of just passing `farmerId` around.

---

## 9. Docker Compose (all three services)

```bash
docker compose up --build
```

This builds and runs MySQL, the Spring Boot backend, and an Nginx-served
production build of the frontend. Set `DB_PASSWORD` and `OPENWEATHER_API_KEY`
in a `.env` file at the repo root first (copy from `.env.example`).

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

---

## 10. Deployment

- **Frontend**: `npm run build` inside `frontend/`, then deploy the `dist/` folder to Vercel or Netlify. Set `VITE_API_BASE_URL` to your deployed backend's URL as an environment variable in that platform.
- **Backend**: build the Docker image (`docker build -t agroai-backend ./backend`) and deploy it to Render, AWS (ECS/App Runner), or GCP (Cloud Run), with `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`/`CORS_ALLOWED_ORIGINS` set as environment variables there.
- **Database**: AWS RDS or Google Cloud SQL (MySQL 8). Point `DB_URL` at it.

---

## 11. Project structure

```
AgroAI/
├── README.md
├── docker-compose.yml
├── .env.example
├── frontend/            React + Vite + Bootstrap + Recharts
│   └── src/
│       ├── components/  Reusable UI (Navbar, WeatherCard, SoilHealthCard, ...)
│       ├── pages/       Landing, Login, Register, Dashboard, SoilData, ...
│       ├── services/    api.js (axios client)
│       └── hooks/       useAuth.js
└── backend/             Spring Boot 3, Java 17, Maven
    └── src/main/java/com/agroai/
        ├── controller/  REST endpoints
        ├── service/     Business logic (auth, soil, weather, market, recommendation, disease)
        ├── repository/  Spring Data JPA
        ├── model/       JPA entities
        ├── dto/         Request/response shapes
        ├── ml/          CropModel (Smile RandomForest + fallback)
        └── config/      CORS, exception handling, RestTemplate bean
```

---

## 12. API reference

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a farmer account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/farmers/{id}` | Farmer profile |
| POST | `/api/soil/{farmerId}` | Save a soil reading |
| GET | `/api/soil/{farmerId}` | Latest soil reading |
| GET | `/api/soil/{farmerId}/history` | Soil reading history |
| GET | `/api/weather?location=` | Current + 7-day forecast for a location |
| GET | `/api/market?location=` | Demo mandi prices |
| POST | `/api/recommendation` | Run the crop recommendation model |
| POST | `/api/disease/detect` | Upload a crop/leaf image (multipart) |
| GET | `/api/dashboard/{farmerId}?location=` | Everything the dashboard needs, in one call |

All endpoints return errors as `{ status, error, message, timestamp, details? }`
with the matching HTTP status code (400/401/404/503/500).

---

## 13. If something doesn't compile

The one area with real version risk is the Smile ML dependency in `CropModel.java`,
since the exact method signatures couldn't be checked against a live build here.
If `mvn clean spring-boot:run` reports a compile error inside `CropModel.java`:

- Check the constructor/parameter names Maven reports against whatever `smile-core`
  version actually resolved (`mvn dependency:tree | grep smile`).
- The two calls most likely to need adjusting are `RandomForest.fit(formula, df)`
  and `Tuple.of(values, schema)`.
- As a quick unblock, you can comment out the body of `trainSmileModel()` so
  `smileAvailable` stays `false` - the app will run entirely on the
  dependency-free fallback classifier described in section 5 while you fix the
  Smile call at your own pace.

Every other file (controllers, services, entities, the React frontend) uses only
well-established, stable APIs and should compile as-is.
