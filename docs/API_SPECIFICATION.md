# JalFaasla Direct API Specification

All endpoints are hosted without versioning prefixes or file extensions.

## Base URL
- Development: `http://localhost:8000`
- Production: `https://<api-domain>`

---

### 1. Advisor Plot Evaluation
- **Endpoint**: `POST /advisor/evaluate`
- **Description**: Evaluates farmer plot inputs, checks legal transplant dates under Punjab Act 6 of 2008, calculates groundwater stress index, and returns concrete tubewell hour/money savings.
- **Request Body**:
```json
{
  "district": "Ludhiana",
  "block": "Jagraon",
  "village": "Sidhwan Kalan",
  "land_size_acres": 3.0,
  "soil_type": "Sandy Loam",
  "current_crop": "Pusa-44 (Long Duration)",
  "tubewell_depth_feet": 220.0,
  "irrigation_method": "Flood (Continuous)",
  "planned_sowing_date": "2026-05-28"
}
```
- **Response**:
```json
{
  "plot_input": { ... },
  "groundwater_status": {
    "score": 94.7,
    "stage_of_extraction_pct": 248.0,
    "category": "Over-Exploited (Critical)",
    "status_label": "CRITICAL DANGER",
    "color_code": "red",
    "water_table_depth_meters": 28.4,
    "annual_drop_cm": 74.0
  },
  "legal_compliance": {
    "is_compliant": false,
    "status": "VIOLATION_RISK",
    "days_premature": 13,
    "potential_penalty_inr": 12140.59,
    "warning": "Sowing/transplanting on 28 May violates Punjab law. Section 6 imposes a penalty of ₹10,000/month/hectare..."
  },
  "savings_estimate": {
    "water_saved_cubic_meters": 5820.0,
    "tubewell_hours_saved": 420.0,
    "diesel_or_electricity_cost_saved_inr": 50400.0,
    "summary_farmer_message": "On your 3.0-acre plot in Sidhwan Kalan (Jagraon), switching to PAU PR-126 and adopting Alternate Wetting-and-Drying (AWD) can save approximately 420 tube-well hours and ₹50,400 in pumping costs this season..."
  },
  "seven_day_irrigation_schedule": [ ... ]
}
```

---

### 2. Groundwater Block Status
- **Endpoint**: `GET /groundwater/blocks`
- **Description**: Returns all CGWB/PWRDA monitored blocks with extraction stage percentages and annual drop rates.

### 3. Single Block Detail
- **Endpoint**: `GET /groundwater/block/{block_name}`
- **Description**: Returns groundwater data for a specific block (e.g., `/groundwater/block/Jagraon`).

---

### 4. Crop Diversification Alternatives
- **Endpoint**: `GET /crops/alternatives`
- **Description**: Comparative economics and water requirements for PR-126, Pusa-44, Maize, and Summer Moong.

---

### 5. Weather Forecast & Pump Advisory
- **Endpoint**: `GET /weather/forecast?district=Ludhiana`
- **Description**: 7-day meteorological forecast from PAU Agromet Observatory with tubewell rain-suppression triggers.

---

### 6. Community Crowdsourced Reports
- **Endpoint**: `GET /community/reports`
- **Description**: Lists recent water table and borehole reports submitted by village farmers.
- **Endpoint**: `POST /community/reports`
- **Description**: Submits a new tubewell depth observation.
- **Request Body**:
```json
{
  "farmer_name": "Sardar Gurpreet Singh",
  "village": "Sidhwan Kalan",
  "block": "Jagraon",
  "depth_feet": 245.0,
  "change_past_year_feet": 4.2,
  "notes": "Bore pipe had to be extended by 40 ft."
}
```

---

### 7. Health Check
- **Endpoint**: `GET /health`
- **Response**: `{"status": "healthy", ...}`
