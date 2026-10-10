# JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) Backend Engine

Groundwater-Aware Crop & Irrigation Advisor backend powered by FastAPI and `uv`.

## Features
- **Statutory Legal Compliance**: Evaluates planting dates against the *Punjab Preservation of Subsoil Water Act, 2008* (Section 6 penalty calculator and gazetted transplant dates).
- **Groundwater Dynamics Engine**: Central Ground Water Board (CGWB) & Punjab Water Regulation and Development Authority (PWRDA) block-level extraction stages and stress indexing.
- **PAU Crop Economics**: Precise tubewell pumping hours, diesel/electricity costs, water volume saved, and farmer net profit model.
- **Agromet Weather & AWD Engine**: 7-day irrigation schedule with rain suppression triggers and perforated Pani Pipe thresholds.
- **Direct Clean Routes**: No API extensions (`/advisor/evaluate`, `/groundwater/blocks`, `/crops/alternatives`, `/weather/forecast`, `/community/reports`, `/health`).

## Running the Server
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Running Automated Tests
```bash
uv run pytest -v
```
