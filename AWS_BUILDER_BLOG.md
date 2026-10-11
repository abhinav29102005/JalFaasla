# JalFaasla: Tackling Punjab’s Groundwater Depletion with AWS Serverless and Geospatial GIS

> *"Don't just say 'save water.' Tell a farmer: on your plot, delaying transplanting to the notified date and using alternate wetting-and-drying saves tube-well hours and ₹ electricity/diesel costs this season."*

---

## 📌 Live Deployments & Endpoints

| Resource | URL | Infrastructure & Provider |
| :--- | :--- | :--- |
| **🌐 Production Web App** | [https://jalfaasla.abhinavkumarsingh.tech/](https://jalfaasla.abhinavkumarsingh.tech/) | Cloudflare Edge CDN + [Amazon S3](https://aws.amazon.com/s3/) Static Website Hosting |
| **⚡ Serverless Backend API** | [https://ofkasl4fri.execute-api.ap-southeast-2.amazonaws.com](https://ofkasl4fri.execute-api.ap-southeast-2.amazonaws.com) | [Amazon API Gateway](https://aws.amazon.com/api-gateway/) HTTP API + [AWS Lambda](https://aws.amazon.com/lambda/) (Python 3.12) |
| **🩺 Live API Health Probe** | [https://ofkasl4fri.execute-api.ap-southeast-2.amazonaws.com/health](https://ofkasl4fri.execute-api.ap-southeast-2.amazonaws.com/health) | Sub-millisecond health status probe & uptime |
| **💻 Open Source Codebase** | [https://github.com/abhinav29102005/JalFaasla](https://github.com/abhinav29102005/JalFaasla) | Full GitHub repository with CI/CD and tests |
| **🪣 AWS Storage Bucket** | `s3://jalfaasla.abhinavkumarsingh.tech` | Amazon S3 Storage Bucket (`ap-southeast-2`) |

---

## 🌾 1. The Context: A Crisis Beneath the Soil

Punjab is the grain basket of India, contributing over 12% of the nation's rice and 18% of its wheat. However, this intensive agricultural output has come at a severe ecological cost: **critical groundwater exhaustion**.

According to official assessments by the [Central Ground Water Board (CGWB)](http://cgwb.gov.in/):
* **114 out of 150 administrative blocks (76%)** across Punjab are categorized as **Over-Exploited**, withdrawing far more water annually than natural monsoon recharge replenishes.
* In central agricultural districts like Sangrur, Patiala, Ludhiana, and Moga, the groundwater table drops by **50 to 90 cm every single year**.
* Tube-well bore depths have plunged from 30–40 feet during the 1970s Green Revolution to **300–450 feet today**, forcing farmers into recurring debt to install deep submersible pumps rated at 10–25 Horsepower (HP).

### The Pre-Monsoon Evaporative Trap
When farmers transplant puddled paddy in scorching May or early June, the atmospheric vapor pressure deficit is severe. Reference crop evapotranspiration ($ET_0$) peaks at **8–10 mm/day**. Puddling fields under extreme heat demands **4,500–5,000 liters of water per kg of grain**. Conversely, crops transplanted in late June (aligned with the onset of the monsoon) need only **2,800–3,200 liters/kg**.

To arrest this decline, the state enacted the [Punjab Preservation of Subsoil Water Act, 2008](https://agri.punjab.gov.in/), which legally prohibits nursery sowing before May 15/20 and transplanting before June 15/20.

Yet, abstract appeals to "save water" routinely fail on the ground. Farmers need to see the tangible operational math: **how many pumping hours, kilowatt-hours, and hard cash (₹) will they save on their specific plot of land?**

This is why we built [JalFaasla (ਜਲ ਫ਼ਾਸਲਾ)](https://jalfaasla.abhinavkumarsingh.tech/).

---

## 💡 2. What JalFaasla Delivers

JalFaasla is a groundwater-aware decision support engine that converts agricultural hydrological physics into practical farm-level unit economics:

* **⏱️ Quantified Tube-Well Hours:** Computes the exact pumping hours eliminated per season based on plot acreage, pump horsepower (HP), dynamic lift depth, and soil category.
* **💰 Financial & Energy Savings:** Shows farmers the monetary savings in electricity tariffs (or equivalent diesel backup generator costs).
* **🌱 Multi-Pathway Agronomic Evaluation:**
  * **Timely Statutory Transplanting:** Aligning transplanting with the notified date to bypass early-summer peak evapotranspiration.
  * **Alternate Wetting and Drying (AWD):** Using [Punjab Agricultural University (PAU)](https://www.pau.edu/) recommended field water tubes (*pani pipe*) to safely reduce irrigation water consumption by 25–30% with zero yield reduction.
  * **Direct-Seeded Rice (Tar-Wattar DSR):** Eliminating puddling entirely to reduce seasonal groundwater draft by 15–20%.
  * **Kharif Crop Diversification:** Comparing high-value, lower-water crops such as Basmati 1509/1121, Maize (*Makki*), and Summer Moong.
* **🗺️ Interactive Geospatial GIS:** Built with [Leaflet](https://leafletjs.com/) mapping all 23 Punjab districts with official GeoJSON administrative polygons, OpenStreetMap Road & Topographic terrain layers, and key river networks (Sutlej, Beas, Ravi).
* **📲 Omnichannel Last-Mile Delivery:**
  * **Voice Advisory:** Browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) speech synthesis in Punjabi and Hindi for low-literacy farmers.
  * **WhatsApp Community Dispatch:** Generates formatted Gurmukhi & English advisory cards ready for village *kisan* groups.
  * **Kisan SMS Gateway:** Formatted 160-character cellular SMS text for feature phone delivery.

---

## 🏛️ 3. Architecture: Why AWS Serverless?

Agricultural advisory tools have distinct traffic dynamics: demand spikes heavily during the May–July Kharif sowing and transplanting window, while seeing lower utilization during off-season months.

Running traditional virtual servers ([Amazon EC2](https://aws.amazon.com/ec2/)) would create idle costs and maintenance overhead. We architected JalFaasla as a **100% serverless solution on AWS** using the [AWS Serverless Application Model (AWS SAM)](https://aws.amazon.com/serverless/sam/):

```
[ Farmer Client (React 19 + Vite) ]
                 │
                 ▼
      [ Cloudflare Edge CDN ]
      ┌──────────┴──────────┐
      ▼                     ▼
 [ Amazon S3 Bucket ]   [ Amazon API Gateway ]
(Static Web Hosting)     (HTTP API v2)
                             │
                             ▼
                        [ AWS Lambda ]
                     (Python 3.12 + FastAPI)
                             │
               ┌─────────────┼─────────────┐
               ▼             ▼             ▼
          [ CGWB Data ] [ PAU AWD ] [ 2008 Act Engine ]
```

### Key Architectural Components:
1. **Frontend Hosting on [Amazon S3](https://aws.amazon.com/s3/):** The client bundle is hosted on an Amazon S3 static website bucket in the `ap-southeast-2` region and served via edge CDN for fast sub-second loading on mobile networks.
2. **[Amazon API Gateway (HTTP API v2)](https://aws.amazon.com/api-gateway/):** Provides low-latency, secure API routing with native CORS handling and direct integration to compute.
3. **[AWS Lambda](https://aws.amazon.com/lambda/) (Python 3.12 + [FastAPI](https://fastapi.tiangolo.com/)):** Executes our hydrological calculations via [Mangum](https://mangum.io/) ASGI adapter. Execution time averages under 40ms with minimal memory footprint.
4. **Infrastructure as Code (IaC) with [AWS SAM](https://aws.amazon.com/serverless/sam/):** The full serverless stack is codified in `template.yaml`, enabling deterministic automated deployments (`sam build && sam deploy`).

---

## 🧮 4. Scientific Agronomic Models & Mathematical Formulas

Our backend advisory engine implements the mathematical models developed by the [Food and Agriculture Organization (FAO)](https://www.fao.org/) and calibrated by [Punjab Agricultural University (PAU)](https://www.pau.edu/):

### Formula 1: Crop Evapotranspiration (ET_c)
Water consumption is modeled using the FAO-56 Penman-Monteith dual crop coefficient method:

```text
ET_c = ET₀ × K_c
```

* **ET₀ (Reference Evapotranspiration):** Daily baseline evaporative demand driven by solar radiation, temperature, wind, and relative humidity:
  * May–June (Pre-Monsoon heat peak): **8.5 mm/day**
  * July–August (Monsoon season): **4.8 mm/day**
  * September (Maturity stage): **3.8 mm/day**
* **K_c (Crop Coefficient):** Crop-specific physiological factor:
  * Initial vegetative stage: **1.05**
  * Mid-season reproductive stage: **1.20**
  * Late maturity stage: **0.90**

By shifting transplanting from May 25 to the state-notified date of June 20, the crop bypasses 26 days of extreme May heat and atmospheric dryness:

```text
ΔW_evaporation = Σ (ET_early - ET_fallow) ≈ 180 to 220 mm
```
*(This translates to saving **1.8 to 2.2 million liters** of extracted groundwater per hectare, or **730,000 to 890,000 liters per acre**).*

---

### Formula 2: Tube-Well Pumping Energy & Dynamic Head
The electrical and mechanical power required to extract groundwater from deep aquifers is governed by hydraulic head physics:

```text
                     ρ · g · Q · H_dynamic
P_hydraulic (kW)  =  ───────────────────────
                         1000 · η_pump
```

Where:
* **ρ (Water Density):** 1,000 kg/m³
* **g (Gravitational Acceleration):** 9.81 m/s²
* **Q (Discharge Rate):** Water discharge rate in m³/s (calibrated to ~25–35 L/s for 10–12.5 HP submersible pumps)
* **H_dynamic (Total Dynamic Head in meters):** Static Water Table Depth + Drawdown during pumping + Frictional Head Loss in delivery pipes
* **η_pump (Pump Operating Efficiency):** Overall motor-pump efficiency (calibrated to 0.62 / 62% for agricultural pumpsets)

From this hydraulic equation, the seasonal operational savings are computed as:

```text
Operating Hours Saved = (ΔWater Volume Saved in m³) / (Discharge Rate Q × 3600)

Cost Saved (₹) = Hours Saved × Motor kW Rating × Effective Electricity Tariff (₹/kWh)
```

---

### Backend Python Implementation in AWS Lambda
In our [AWS Lambda](https://aws.amazon.com/lambda/) handler, these formulas execute in real-time on every evaluation:

```python
# From backend/app/main.py
@app.post("/advisor/evaluate")
def evaluate_farm_plan(request: FarmEvaluationRequest):
    district = DISTRICT_PROFILES.get(request.district)
    
    # Baseline evapotranspiration penalty if transplanted before statutory cutoff
    evap_penalty_mm = calculate_pre_monsoon_evaporation(
        district=request.district,
        transplant_date=request.transplant_date,
        notified_date=district.notified_cutoff_date
    )
    
    # Discharge rate based on pump horsepower and bore depth
    discharge_lps = calibrate_discharge(request.pump_hp, request.bore_depth_feet)
    
    # Water volume savings across plot acreage (m^3)
    water_saved_m3 = (evap_penalty_mm / 1000.0) * (request.plot_size_acres * 4046.86)
    
    # Pumping hours saved
    hours_saved = water_saved_m3 / (discharge_lps * 0.001 * 3600)
    
    # Financial electricity / diesel savings
    cost_saved_inr = hours_saved * (request.pump_hp * 0.746) * ELECTRICITY_TARIFF_INR
    
    return {
        "district": request.district,
        "hours_saved": round(hours_saved, 1),
        "water_saved_liters": int(water_saved_m3 * 1000),
        "cost_saved_inr": round(cost_saved_inr, 2),
        "statutory_compliant": request.transplant_date >= district.notified_cutoff_date
    }
```

---

## 📱 5. Designing for Rural Usability

Field technology must overcome digital literacy barriers to achieve real-world adoption:

1. **Bilingual Gurmukhi & English UI:** Key metrics and advisories are rendered simultaneously in Punjabi (ਗੁਰਮੁਖੀ) and English.
2. **Text-to-Speech Voice Synthesizer:** Farmers can listen to their customized field advisory spoken aloud in natural Punjabi or Hindi by pressing a single button.
3. **Village WhatsApp Sharing:** Pre-formatted text cards can be forwarded with one click into local farmer groups.
4. **Feature Phone SMS Format:** 160-character cellular SMS summaries for areas with limited mobile data connectivity.

---

## 🚀 6. Verification & Test Suite

The system includes automated tests validating statutory compliance logic, AWD irrigation reduction thresholds, and numerical edge cases:

```bash
cd backend
uv run pytest -v
```

* **8 out of 8 tests passing** (health probe, district extraction, statutory act compliance, AWD calculations, and boundary edge cases).

---

## 👥 7. Team Contributions

* **Member 1 (Cloud Architecture & Backend Lead):** Designed the AWS Serverless stack ([AWS Lambda](https://aws.amazon.com/lambda/), [Amazon API Gateway](https://aws.amazon.com/api-gateway/), [Amazon S3](https://aws.amazon.com/s3/), [AWS SAM](https://aws.amazon.com/serverless/sam/)), authored the [FastAPI](https://fastapi.tiangolo.com/) agronomic and hydraulic calculation engines, integrated CGWB datasets, and implemented the automated pytest test suite.
* **Member 2 (Frontend & GIS Engineering Lead):** Developed the [React 19](https://react.dev/) single-page interface, built the [Leaflet](https://leafletjs.com/) geospatial district mapping system with official GeoJSON boundaries, and engineered the omnichannel delivery systems (Punjabi voice synthesis, WhatsApp, and SMS).

---

## 🌾 8. Conclusion

By connecting open agronomic science from [Punjab Agricultural University (PAU)](https://www.pau.edu/) with scalable, cost-effective serverless architecture on [Amazon Web Services (AWS)](https://aws.amazon.com/), JalFaasla proves that complex groundwater conservation policies can be translated into clear, actionable, and financially compelling insights for farmers.
