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

- [ ] **1.1 API Client Layer (`frontend/src/services/api.ts`)**:
  - Implement Axios/Fetch client with environment-aware baseURL (`VITE_API_URL` pointing to local `http://localhost:8000` during dev and AWS API Gateway in production).
  - Include TypeScript request/response contracts mirrored from `backend/app/models/schemas.py`.
- [ ] **1.2 Dynamic Advisory Form**:
  - Connect `FarmerOnboardingForm.tsx` to `POST /advisor/evaluate`.
  - Trigger loading states, error boundaries, and debounce calculations.
- [ ] **1.3 Dynamic Groundwater Scorecard & Gauge**:
  - Populate gauge with real extraction stage (%) and annual decline rate (cm/yr) from `GET /groundwater/block/{block_name}`.
- [ ] **1.4 Live Agromet Weather & Rain Suppression Alerts**:
  - Connect `IrrigationScheduler.tsx` to `GET /weather/forecast` to dynamically render the 7-day Pani Pipe AWD schedule and storm suppression triggers.
- [ ] **1.5 Interactive Community Crowdsourced Reports**:
  - Enable live form submission to `POST /community/reports` and polling/refreshing of recent village borehole readings from `GET /community/reports`.

---

### Phase 2: Production Hosting & Single-Domain CloudFront CDN
**Objective**: Serve both the React SPA and API Gateway behind a unified CloudFront distribution with HTTPS and zero-CORS latency.

- [ ] **2.1 CloudFront Distribution Architecture**:
  - **Default Cache Behavior (`/*`)**: Origin points to S3 frontend bucket with Origin Access Control (OAC). SPA routing configured via 404/403 redirect to `index.html`.
  - **API Behavior (`/advisor/*`, `/groundwater/*`, `/crops/*`, `/weather/*`, `/community/*`, `/health`)**: Origin points to the HTTP API Gateway endpoint with caching disabled (query strings, headers, and methods forwarded).
- [ ] **2.2 SAM Template Update (`aws/template.yaml`)**:
  - Add `AWS::CloudFront::Distribution` and `AWS::CloudFront::OriginAccessControl`.
- [ ] **2.3 Automated Deployment Script (`aws/deploy.sh`)**:
  - Single command script: build backend -> `sam deploy` -> build frontend -> `aws s3 sync` -> `aws cloudfront create-invalidation`.

---

### Phase 3: Persistent Database Layer (Amazon DynamoDB)
**Objective**: Transition from in-memory pre-seeded storage to persistent, serverless DynamoDB tables.

- [ ] **3.1 Table Definitions in SAM Template**:
  - `FarmerEvaluationsTable`: Partition Key `block_name` (String), Sort Key `timestamp` (String). Stores anonymous plot evaluations for district planning.
  - `CommunityBoreholeReportsTable`: Partition Key `district_block` (String), Sort Key `report_id` (String). Stores farmer borehole measurements and pump lowerings.
- [ ] **3.2 Backend Service Updates**:
  - Use `aioboto3` or standard `boto3` in `community_service.py` to persist and query reports.
  - Implement IAM least-privilege role permissions on `JalFaaslaBackendFunctionRole` (`dynamodb:PutItem`, `dynamodb:Query`, `dynamodb:Scan`).

---

### Phase 4: Farmer Accessibility & Hyper-Local Mobile Features
**Objective**: Bridge the digital divide for rural Punjabi farmers.

- [ ] **4.1 Voice Advisory / Audio Playback (AWS Polly)**:
  - Generate Punjabi audio summaries of recommendations: *"ਤੁਹਾਡੇ 3 ਏਕੜ ਖੇਤ ਲਈ, ਪੀਆਰ-126 ਬੀਜਣ ਨਾਲ 420 ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਅਤੇ ₹50,400 ਦੀ ਬੱਚਤ ਹੋਵੇਗੀ।"*
  - Add a 1-click audio play button on the scorecard.
- [ ] **4.2 SMS / WhatsApp Monsoon Alerts (Amazon SNS / Pinpoint)**:
  - Daily 6:00 AM SMS alert for registered villages: *"ਪੀਏਯੂ ਮੌਸਮ ਚਿਤਾਵਨੀ: ਅੱਜ ਰਾਤ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ।"*
- [ ] **4.3 Interactive Punjab District & Block GIS Map**:
  - Leaflet-based vector map covering all 150+ Punjab blocks colored by CGWB groundwater criticality (Over-exploited = Dark Red, Critical = Orange, Safe = Blue).

---

## 4. Key Performance Indicators (KPIs)
1. **Pumping Hours Saved**: Target reduction of 120–150 running hours per acre in participating plots.
2. **Farmer Financial Gain**: Target ₹4,000–₹6,000 per acre in pumping fuel and electricity cost savings.
3. **Legal Compliance**: Zero Section 6 statutory penalties incurred by informed farmers.
4. **API Latency**: Sub-200ms response time on AWS API Gateway + Lambda in `ap-southeast-2`.

---

## 5. Implementation Schedule

| Milestone | Deliverables | Target Timeline |
| :--- | :--- | :--- |
| **Milestone 1** | Full Frontend ↔ Backend integration, dynamic forms, API client | Sprint 1 |
| **Milestone 2** | CloudFront CDN distribution, unified domain, single-command deploy | Sprint 2 |
| **Milestone 3** | DynamoDB persistence for community reports and plot evaluations | Sprint 3 |
| **Milestone 4** | Punjabi text-to-speech audio advisories and interactive GIS map | Sprint 4 |
