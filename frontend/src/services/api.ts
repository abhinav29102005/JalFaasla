/**
 * JalFaasla Frontend API Client
 * Connects React UI to AWS API Gateway / FastAPI Backend.
 */

export interface FarmerPlotInput {
  district: string;
  block: string;
  village: string;
  land_size_acres: number;
  soil_type: string;
  current_crop: string;
  tubewell_depth_feet: number;
  irrigation_method: string;
  planned_sowing_date?: string | null;
}

/**
 * Mapper helper to convert frontend form input to API payload
 */
export function toFarmerPlotInput(
  input: {
    block: { name: string; id: string };
    landSizeAcres: number;
    soilType: string;
    currentCropId: string;
    tubewellDepthM: number;
    irrigationMethod: string;
    plannedDate?: string;
  },
  districtName: string = 'Ludhiana',
  villageName: string = 'Sidhwan Kalan'
): FarmerPlotInput {
  const cropNames: Record<string, string> = {
    pusa44: 'Pusa-44 (Long Duration)',
    pr126: 'PAU PR-126 (Short Duration)',
    pr121: 'PR-121 (Medium Duration)',
    maize: 'Kharif Hybrid Maize (PMH-13)',
    moong: 'Summer Moong (SML-668)',
    basmati1509: 'Pusa Basmati 1509',
  };

  const methodNames: Record<string, string> = {
    flooding: 'Flood (Continuous)',
    awd: 'AWD (Pani Pipe)',
    dsr: 'DSR (Direct Seeded)',
    drip: 'Drip Irrigation',
  };

  return {
    district: districtName,
    block: input.block.name,
    village: villageName,
    land_size_acres: Number(input.landSizeAcres) || 3.0,
    soil_type: input.soilType || 'Sandy Loam',
    current_crop: cropNames[input.currentCropId] || input.currentCropId || 'Pusa-44 (Long Duration)',
    tubewell_depth_feet: Math.round((Number(input.tubewellDepthM) || 18) * 3.28084 * 10) / 10,
    irrigation_method: methodNames[input.irrigationMethod] || input.irrigationMethod || 'Flood (Continuous)',
    planned_sowing_date: input.plannedDate || null,
  };
}


export interface GroundwaterBlockInfo {
  block_name: string;
  district: string;
  stage_of_extraction_pct: number;
  category: string;
  avg_water_table_depth_m: number;
  annual_water_drop_cm: number;
  safe_recharge_threshold_m: number;
  description: string;
}

export interface CropOption {
  crop_name: string;
  variety: string;
  growth_duration_days: number;
  water_requirement_cm: number;
  tubewell_hours_per_acre: number;
  avg_yield_quintal_per_acre: number;
  msp_or_market_price_per_qtl: number;
  gross_revenue_per_acre: number;
  pumping_cost_per_acre: number;
  net_profit_per_acre: number;
  groundwater_stress_rating: string;
  recommendation_tier: string;
}

export interface SavingsEstimate {
  water_saved_cubic_meters: number;
  water_saved_acre_inches: number;
  tubewell_hours_saved: number;
  diesel_or_electricity_cost_saved_inr: number;
  net_income_boost_inr: number;
  summary_farmer_message: string;
}

export interface IrrigationDayAdvice {
  day_name: string;
  date_str: string;
  forecast_rain_mm: number;
  temp_max_c: number;
  evapotranspiration_mm: number;
  action: string;
  awd_water_tube_reading_cm: string;
  reason: string;
}

export interface LegalComplianceStatus {
  is_compliant: boolean;
  status: string;
  penalty_risk_inr: number;
  notified_date_allowed: string;
  days_early: number;
  statutory_act: string;
  warning_summary: string;
}

export interface AdvisoryEvaluationResponse {
  plot_input: FarmerPlotInput;
  groundwater_status: {
    block_name: string;
    stress_score: number;
    stress_level: string;
    category: string;
    water_table_depth_feet: number;
    annual_drop_cm: number;
    alarming_pau_drop: boolean;
    estimated_bore_life_years: number;
  };
  legal_compliance: LegalComplianceStatus;
  recommended_strategy: string;
  target_crop_variety: string;
  crop_switch_recommendation: {
    current_crop: string;
    recommended_crop: string;
    alternative_diversification: string;
    days_saved: number;
    pumping_hours_difference: string;
  };
  savings_estimate: SavingsEstimate;
  seven_day_irrigation_schedule: IrrigationDayAdvice[];
  pau_package_of_practices: string[];
}

export interface CommunityReportCreate {
  farmer_name: string;
  village: string;
  block: string;
  depth_feet: number;
  change_past_year_feet?: number;
  notes?: string;
}

export interface CommunityReportResponse {
  id: string;
  farmer_name: string;
  village: string;
  block: string;
  depth_feet: number;
  change_past_year_feet: number;
  timestamp: string;
  notes?: string | null;
}

export interface WeatherForecastResponse {
  district: string;
  station: string;
  current_temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  cloud_cover: string;
  monsoon_onset_forecast: string;
  rain_alert: string;
  advisory_for_pumps: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  region: string;
  authorities: string[];
}

// Target API base URL
const DEFAULT_API_URL = 'https://ofkasl4fri.execute-api.ap-southeast-2.amazonaws.com';
export const API_BASE_URL: string = 
  import.meta.env.VITE_API_URL?.trim() || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : DEFAULT_API_URL);

/**
 * Generic Fetch helper with timeout and JSON handling
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`API Error [${res.status}] ${res.statusText}: ${errorText}`);
    }

    return await res.json() as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`API Request to ${endpoint} timed out after 12s`);
    }
    throw err;
  }
}

export const api = {
  /**
   * Health Check
   */
  async getHealth(): Promise<HealthResponse> {
    return apiFetch<HealthResponse>('/health');
  },

  /**
   * Evaluate Farmer Plot against Punjab hydrology and PAU crop models
   */
  async evaluatePlot(input: FarmerPlotInput): Promise<AdvisoryEvaluationResponse> {
    return apiFetch<AdvisoryEvaluationResponse>('/advisor/evaluate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Fetch CGWB & PWRDA groundwater status for all blocks
   */
  async getGroundwaterBlocks(): Promise<GroundwaterBlockInfo[]> {
    return apiFetch<GroundwaterBlockInfo[]>('/groundwater/blocks');
  },

  /**
   * Fetch single block groundwater extraction data
   */
  async getGroundwaterBlock(blockName: string): Promise<GroundwaterBlockInfo> {
    return apiFetch<GroundwaterBlockInfo>(`/groundwater/block/${encodeURIComponent(blockName)}`);
  },

  /**
   * Fetch crop economics and pumping requirements
   */
  async getCropAlternatives(): Promise<CropOption[]> {
    return apiFetch<CropOption[]>('/crops/alternatives');
  },

  /**
   * Fetch PAU Agromet live weather and pump postponement advisory
   */
  async getWeatherForecast(district: string = 'Ludhiana'): Promise<WeatherForecastResponse> {
    return apiFetch<WeatherForecastResponse>(`/weather/forecast?district=${encodeURIComponent(district)}`);
  },

  /**
   * Get community crowdsourced borehole depth reports
   */
  async getCommunityReports(): Promise<CommunityReportResponse[]> {
    return apiFetch<CommunityReportResponse[]>('/community/reports');
  },

  /**
   * Post farmer crowdsourced borehole observation
   */
  async submitCommunityReport(report: CommunityReportCreate): Promise<CommunityReportResponse> {
    return apiFetch<CommunityReportResponse>('/community/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  },
};
