# JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) System Architecture

## Overview
JalFaasla is an agronomic decision-support platform designed for Punjab farmers, agricultural extension workers, and groundwater policy planners. It connects groundwater depletion statistics directly to farmer economic survival (tubewell electricity hours, diesel expenditure, legal penalties, and yield protection).

## Repository Organization
The repository is structured into four root modules:

```
JalFaasla/
├── frontend/    # React 19 + TypeScript + Vite SPA with high-contrast Punjabi/English UI
├── backend/     # FastAPI + Python 3.14 + Pydantic hydrological & legal advisory engine
├── docs/        # Punjab groundwater laws, PAU scientific practices, and API specs
└── aws/         # AWS infrastructure, CloudFormation/SAM templates, and Agent Toolkit integrations
```

## System Data Flow
```
┌─────────────────────────────────┐
│ Farmer UI (frontend: port 5180) │
│ - Village/Block Selector        │
│ - Land size & Bore depth        │
│ - Planned transplant date       │
└────────────────┬────────────────┘
                 │ HTTP REST (Direct routes: /advisor, /groundwater, /crops)
                 ▼
┌─────────────────────────────────┐
│ Backend Engine (backend: 8000)  │
├─────────────────────────────────┤
│ 1. Legal Compliance Validator   │ ──► Punjab Act 6 of 2008 (Section 6 penalty check)
│ 2. Groundwater Stress Calculator│ ──► CGWB / PWRDA Extraction % & Aquifer Drawdown
│ 3. PAU Advisory & AWD Model     │ ──► Tubewell hours, diesel savings, PR-126 switch
│ 4. Agromet Weather Engine       │ ──► Rain suppression trigger (skip pump on rain)
│ 5. Community Observation Feed   │ ──► Village tubewell level crowdsourced reports
└─────────────────────────────────┘
```

## Core Principles
1. **Direct Routes**: Clean URL paths without `/api/v1` or file extensions (`.json`).
2. **Actionable Farmer Language**: Avoid abstract "save water" slogans. Deliver concrete metric impacts: "On your 3-acre plot, switching to PR-126 saves 420 tubewell hours and ₹50,400."
3. **Statutory Awareness**: Real-time legal warnings with financial penalty estimates when transplanting before June 10th.
