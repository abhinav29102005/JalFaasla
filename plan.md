# JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) — Master Engineering & Product Plan

## 1. Executive Summary
**JalFaasla** is a groundwater-aware agronomic and financial advisor engineered for farmers in the Punjab central alluvial belt (Ludhiana, Sangrur, Jalandhar, Patiala). It addresses the groundwater over-extraction crisis by speaking directly to the farmer's economic self-interest:
> *"Don’t say 'save water.' Tell a farmer: 'On your 3-acre plot in Sidhwan Kalan, delaying transplanting to the notified date and adopting PAU Alternate Wetting-and-Drying (AWD) will save 420 tube-well hours and ₹50,400 this season while protecting you from statutory penalties.'"*

---

## 2. Current Architecture & Completed Milestones

### Repository Structure
```
JalFaasla/
├── frontend/    # React 19 + TypeScript + Vite SPA (Port 5180)
├── backend/     # FastAPI + Python 3.14 + Pydantic hydrological engine (Port 8000)
├── docs/        # Legal, agronomic & API specifications
└── aws/         # SAM CloudFormation template & Agent Toolkit setup (Region: ap-southeast-2)
```

### Verified Completed Work
- [x] **Monorepo Reorganization**: 4 distinct root folders (`frontend`, `backend`, `docs`, `aws`).
- [x] **Punjab Legal Compliance Engine**: Implemented *Punjab Preservation of Subsoil Water Act, 2008* rules (Section 6 penalty calculator of ₹10,000/ha/month for transplanting before June 10th).
- [x] **CGWB & PWRDA Hydrological Models**: Real block-level data for Ludhiana (Jagraon, Dehlon, Sidhwan Bet, Raikot, Khanna, Samrala, Ludhiana-1/2).
- [x] **PAU AWD & Varietal Economics**: Mathematical models comparing PR-126 vs Pusa-44 vs Maize vs Moong with exact tubewell run hours and diesel/electricity costs.
- [x] **Direct Clean REST API**: Fast, unversioned endpoints without extensions (`/advisor/evaluate`, `/groundwater/blocks`, `/crops/alternatives`, `/weather/forecast`, `/community/reports`, `/health`).
- [x] **100% Automated Backend Tests**: All unit and integration tests passing (`uv run pytest`).
- [x] **Agent Toolkit for AWS**: Configured for project **Building Momentum** (Account `715621341923`, Region `ap-southeast-2`).
- [x] **Live AWS Serverless Deployment**:
  - API Gateway: `https://ofkasl4fri.execute-api.ap-southeast-2.amazonaws.com`
  - Lambda Backend (FastAPI + Mangum): Live & verified via curl.
  - Frontend Hosting S3: `s3://building-momentum-frontend-715621341923-ap-southeast-2`

---

## 3. Comprehensive Phased Engineering Roadmap

### Phase 1: Frontend ↔ Backend End-to-End Dynamic Integration
**Objective**: Replace client-side mock logic in the React UI with real-time API Gateway integration.

- [x] **1.1 API Client Layer (`frontend/src/services/api.ts`)**:
  - Implemented typed Fetch client with environment-aware baseURL (`VITE_API_URL` pointing to local `http://localhost:8000` during dev and AWS API Gateway in production).
  - Included TypeScript request/response contracts mirrored from `backend/app/models/schemas.py`.
- [x] **1.2 Dynamic Advisory Form**:
  - Connected `FarmerOnboardingForm.tsx` & `App.tsx` to `POST /advisor/evaluate`.
  - Added loading states, error boundaries, live sync status badge, and debounce calculations.
- [x] **1.3 Dynamic Groundwater Scorecard & Gauge**:
  - Populated gauge and factors grid with real extraction stage (%) and annual decline rate (cm/yr) from `GET /groundwater/block/{block_name}`.
- [x] **1.4 Live Agromet Weather & Rain Suppression Alerts**:
  - Connected `IrrigationScheduler.tsx` to `GET /weather/forecast` to dynamically render the 7-day Pani Pipe AWD schedule and storm suppression triggers.
- [x] **1.5 Interactive Community Crowdsourced Reports**:
  - Enabled live form submission to `POST /community/reports` and polling/refreshing of recent village borehole readings from `GET /community/reports`.

---

### Phase 2: Production Hosting & Single-Domain CloudFront CDN
**Objective**: Serve both the React SPA and API Gateway behind a unified CloudFront distribution with HTTPS and zero-CORS latency.

- [x] **2.1 CloudFront Distribution Architecture**:
  - **Default Cache Behavior (`/*`)**: Origin points to S3 frontend bucket with Origin Access Control (OAC). SPA routing configured via 404/403 redirect to `index.html`.
  - **API Behavior (`/advisor/*`, `/groundwater/*`, `/crops/*`, `/weather/*`, `/community/*`, `/health`)**: Origin points to the HTTP API Gateway endpoint with caching disabled (query strings, headers, and methods forwarded).
- [x] **2.2 SAM Template Update (`aws/template.yaml`)**:
  - Added `AWS::CloudFront::Distribution` and `AWS::CloudFront::OriginAccessControl` with S3 Bucket Policy.
- [x] **2.3 Automated Deployment Script (`aws/deploy.sh` & `aws/deploy.ps1`)**:
  - Single command script: build backend -> `sam deploy` -> build frontend -> `aws s3 sync` -> `aws cloudfront create-invalidation`.

---

### Phase 3: Persistent Database Layer (Amazon DynamoDB)
**Objective**: Transition from in-memory pre-seeded storage to persistent, serverless DynamoDB tables.

- [x] **3.1 Table Definitions in SAM Template**:
  - `FarmerEvaluationsTable`: Partition Key `block_name` (String), Sort Key `timestamp` (String). Stores anonymous plot evaluations for district planning.
  - `CommunityBoreholeReportsTable`: Partition Key `district_block` (String), Sort Key `report_id` (String). Stores farmer borehole measurements and pump lowerings.
- [x] **3.2 Backend Service Updates**:
  - Integrated `boto3` in `community_service.py` to persist and query reports with graceful memory fallback.
  - Integrated anonymous evaluation persistence in `advisory_service.py`.
  - Added IAM least-privilege role policies on `JalFaaslaBackendFunction` in `aws/template.yaml` (`DynamoDBCrudPolicy`).

---

### Phase 4: Farmer Accessibility & Hyper-Local Mobile Features
**Objective**: Bridge the digital divide for rural Punjabi farmers.

- [x] **4.1 Voice Advisory / Audio Playback (AWS Polly & Web Speech Synthesis)**:
  - Generated natural Punjabi audio summaries of recommendations in `frontend/src/utils/voiceAdvisory.ts`.
  - Added a 1-click audio play button with playing state and waveform on the Crop Economics scorecard banner.
- [x] **4.2 SMS / WhatsApp Monsoon Alerts (Amazon SNS / Pinpoint)**:
  - Created `SmsAlertModal.tsx` allowing farmers to subscribe to daily 6:00 AM PAU Agromet rain suppression alerts.
  - Integrated quick action button in both `Header.tsx` and `IrrigationScheduler.tsx`.
- [x] **4.3 Interactive Punjab District & Block GIS Map**:
  - Implemented interactive vector GIS map in `PunjabGisMap.tsx` covering all Punjab central belt blocks color-coded by CGWB groundwater criticality.
  - Interactive click-to-select updates the entire advisory engine in real-time.


---

## 4. Key Performance Indicators (KPIs)
1. **Pumping Hours Saved**: Target reduction of 120–150 running hours per acre in participating plots.
2. **Farmer Financial Gain**: Target ₹4,000–₹6,000 per acre in pumping fuel and electricity cost savings.
3. **Legal Compliance**: Zero Section 6 statutory penalties incurred by informed farmers.
4. **API Latency**: Sub-200ms response time on AWS API Gateway + Lambda in `ap-southeast-2`.

---

## 5. Implementation Schedule

| Milestone | Deliverables | Target Timeline | Status |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | Full Frontend ↔ Backend integration, dynamic forms, API client | Sprint 1 | ✅ Completed |
| **Milestone 2** | CloudFront CDN distribution, unified domain, single-command deploy | Sprint 2 | ✅ Completed |
| **Milestone 3** | DynamoDB persistence for community reports and plot evaluations | Sprint 3 | ✅ Completed |
| **Milestone 4** | Punjabi text-to-speech audio advisories and interactive GIS map | Sprint 4 | ✅ Completed |

