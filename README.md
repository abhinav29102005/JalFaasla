# JalFaasla (ਜਲ ਫ਼ਾਸਲਾ)
### Punjab Groundwater-Aware Crop & Irrigation Advisor

> *"Don’t say 'save water.' Tell a farmer: 'On your 3-acre plot in Sidhwan Kalan, delaying transplanting to the notified date and adopting PAU Alternate Wetting-and-Drying (AWD) can save 420 tube-well hours and ₹50,400 this season.'"*

---

## 4 Root Modules

```
JalFaasla/
├── frontend/    # High-contrast, Punjabi/English bilingual React SPA (Vite + TS)
├── backend/     # FastAPI hydrological & economic advisory calculation engine
├── docs/        # Punjab Preservation of Subsoil Water Act, PAU protocols, and API specs
└── aws/         # AWS infrastructure, CloudFormation/SAM template, and Agent Toolkit scripts
```

## Module Highlights

### 1. `frontend/`
- Real-time groundwater stress gauge, tubewell bore depth inputs, and 50/50 crop comparison cards.
- 7-day PAU Agromet irrigation schedule with monsoon rain suppression alerts.
- Bilingual toggle (English / ਪੰਜਾਬੀ) tuned for village farmers and peasants.
- Symmetrical layout without horizontal scrollbars or distracting animations.
- Dev server running at `http://localhost:5180/`.

### 2. `backend/`
- Direct clean endpoints without versioning prefixes or file extensions (`/advisor/evaluate`, `/groundwater/blocks`, `/crops/alternatives`, `/weather/forecast`, `/community/reports`, `/health`).
- Punjab Preservation of Subsoil Water Act, 2008 statutory penalty calculation engine (₹10,000/ha/month).
- Central Ground Water Board (CGWB) & PWRDA Ludhiana block-level extraction database.
- 100% automated test suite (`uv run pytest`).
- Running at `http://localhost:8000/`.

### 3. `docs/`
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md): System layout and data flow.
- [`PUNJAB_GROUNDWATER_ACT_2008.md`](docs/PUNJAB_GROUNDWATER_ACT_2008.md): Legal constraints and Section 6 penalties.
- [`PAU_RECOMMENDATIONS_AND_ADVISORY_LOGIC.md`](docs/PAU_RECOMMENDATIONS_AND_ADVISORY_LOGIC.md): Alternate Wetting and Drying (Pani Pipe) and PR-126 varietal economics.
- [`API_SPECIFICATION.md`](docs/API_SPECIFICATION.md): Direct route documentation and JSON payloads.

### 4. `aws/`
- Serverless SAM CloudFormation template for AWS deployment (`ap-southeast-2`).
- Setup script and guide for **Agent Toolkit for AWS** in project mode.
- AWS S3 + CloudFront static hosting and API Gateway HTTP API routing.

---

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:5180
```

### Backend
```bash
cd backend
uv run pytest -v
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
