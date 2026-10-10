export interface PunjabBlock {
  id: string;
  name: string;
  namePa: string;
  nameHi: string;
  waterTableDepthM: number; // meters below ground level (mbgl)
  annualFallCm: number; // annual rate of fall (cm/year)
  stageOfExtractionPercent: number; // CGWB Stage of groundwater development (%)
  cgwbCategory: 'Over-Exploited' | 'Critical' | 'Semi-Critical' | 'Safe';
  soilTypeDefault: 'Sandy Loam' | 'Clayey Loam' | 'Silt Loam' | 'Alluvial' | 'Loam';
  notifiedTransplantDate: string; // YYYY-MM-DD
  transplantGroup: 1 | 2; // Group 1: June 11, Group 2: June 20
  canalIrrigationSharePercent: number;
  tubewellCountPerSqKm: number;
  majorAquifer: string;
  localObservations: string;
}

export interface PunjabDistrict {
  id: string;
  name: string;
  namePa: string;
  nameHi: string;
  isLudhianaBelt: boolean;
  blocks: PunjabBlock[];
}

export const PUNJAB_DISTRICTS: PunjabDistrict[] = [
  {
    id: 'ludhiana',
    name: 'Ludhiana',
    namePa: 'ਲੁਧਿਆਣਾ',
    nameHi: 'लुधियाना',
    isLudhianaBelt: true,
    blocks: [
      {
        id: 'jagraon',
        name: 'Jagraon',
        namePa: 'ਜਗਰਾਓਂ',
        nameHi: 'जगरांव',
        waterTableDepthM: 18.4,
        annualFallCm: 53,
        stageOfExtractionPercent: 188,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 6,
        tubewellCountPerSqKm: 42,
        majorAquifer: 'Upper Alluvial (0-60m depleted, tapping 80-120m deep sand layer)',
        localObservations: 'PAU sentinel monitoring reveals groundwater falling over 52 cm/yr in Jagraon belt. Over 94% irrigation is electric/diesel submersible tube-wells.'
      },
      {
        id: 'ludhiana-1',
        name: 'Ludhiana-1 (East)',
        namePa: 'ਲੁਧਿਆਣਾ-1 (ਪੂਰਬੀ)',
        nameHi: 'लुधियाना-1 (पूर्वी)',
        waterTableDepthM: 19.1,
        annualFallCm: 54,
        stageOfExtractionPercent: 194,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 4,
        tubewellCountPerSqKm: 48,
        majorAquifer: 'Central Alluvial Plain',
        localObservations: 'Heavy suburban industrial and agricultural pumping confluence. Significant motor deepening reported.'
      },
      {
        id: 'ludhiana-2',
        name: 'Ludhiana-2 (West)',
        namePa: 'ਲੁਧਿਆਣਾ-2 (ਪੱਛਮੀ)',
        nameHi: 'लुधियाना-2 (पश्चिमी)',
        waterTableDepthM: 21.6,
        annualFallCm: 59,
        stageOfExtractionPercent: 215,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 5,
        tubewellCountPerSqKm: 51,
        majorAquifer: 'Middle Quaternary Aquifer',
        localObservations: 'Water table has breached 21m depth. Submersible motors require 12.5 to 15 HP capacity to pump discharge.'
      },
      {
        id: 'dehlon',
        name: 'Dehlon',
        namePa: 'ਡੇਹਲੋਂ',
        nameHi: 'डेहलों',
        waterTableDepthM: 24.3,
        annualFallCm: 64,
        stageOfExtractionPercent: 238,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 3,
        tubewellCountPerSqKm: 56,
        majorAquifer: 'Deep Deep Sand Strata',
        localObservations: 'One of the most severe dark zones in Ludhiana. Water depth down to 80 feet (24.3m); frequent bore failures.'
      },
      {
        id: 'khanna',
        name: 'Khanna',
        namePa: 'ਖੰਨਾ',
        nameHi: 'खन्ना',
        waterTableDepthM: 19.8,
        annualFallCm: 55,
        stageOfExtractionPercent: 192,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Clayey Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 8,
        tubewellCountPerSqKm: 45,
        majorAquifer: 'Upper Alluvial',
        localObservations: 'Asia largest grain market hub. High paddy intensity with intensive tube-well extraction.'
      },
      {
        id: 'samrala',
        name: 'Samrala',
        namePa: 'ਸਮਰਾਲਾ',
        nameHi: 'समराला',
        waterTableDepthM: 16.7,
        annualFallCm: 48,
        stageOfExtractionPercent: 165,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 11,
        tubewellCountPerSqKm: 38,
        majorAquifer: 'Alluvial Loam Belt',
        localObservations: 'Marginally better retention due to partial canal distributaries, but persistent dry trend.'
      },
      {
        id: 'doraha',
        name: 'Doraha',
        namePa: 'ਦੋਰਾਹਾ',
        nameHi: 'दोराहा',
        waterTableDepthM: 17.6,
        annualFallCm: 49,
        stageOfExtractionPercent: 172,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Alluvial',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 14,
        tubewellCountPerSqKm: 40,
        majorAquifer: 'Sirhind Canal Influence Zone',
        localObservations: 'Near Sirhind canal, recharge is relatively higher along canal bank, but interior villages face 18m depths.'
      },
      {
        id: 'raikot',
        name: 'Raikot',
        namePa: 'ਰਾਏਕੋਟ',
        nameHi: 'रायकोट',
        waterTableDepthM: 22.4,
        annualFallCm: 61,
        stageOfExtractionPercent: 218,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 4,
        tubewellCountPerSqKm: 49,
        majorAquifer: 'Deep Alluvial',
        localObservations: 'Bordering Barnala/Sangrur dark zone belt. High power tripping during peak paddy transplantation.'
      },
      {
        id: 'sudhar',
        name: 'Sudhar',
        namePa: 'ਸੁਧਾਰ',
        nameHi: 'सुधार',
        waterTableDepthM: 19.3,
        annualFallCm: 53,
        stageOfExtractionPercent: 186,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 7,
        tubewellCountPerSqKm: 44,
        majorAquifer: 'Central Alluvial Plain',
        localObservations: 'Submersible motors running 12-14 hours per day during flooded paddy cycle.'
      },
      {
        id: 'sidhwan-bet',
        name: 'Sidhwan Bet',
        namePa: 'ਸਿੱਧਵਾਂ ਬੇਟ',
        nameHi: 'सिद्धवां बेट',
        waterTableDepthM: 12.8,
        annualFallCm: 36,
        stageOfExtractionPercent: 132,
        cgwbCategory: 'Critical',
        soilTypeDefault: 'Alluvial',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 18,
        tubewellCountPerSqKm: 32,
        majorAquifer: 'Sutlej Riverine Floodplain',
        localObservations: 'Sutlej river basin proximity offers higher groundwater table (12-14m), but rate of fall has accelerated.'
      },
      {
        id: 'machhiwara',
        name: 'Machhiwara',
        namePa: 'ਮਾਛੀਵਾੜਾ',
        nameHi: 'माछीवाड़ा',
        waterTableDepthM: 14.5,
        annualFallCm: 41,
        stageOfExtractionPercent: 148,
        cgwbCategory: 'Critical',
        soilTypeDefault: 'Alluvial',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 15,
        tubewellCountPerSqKm: 35,
        majorAquifer: 'Floodplain Alluvial Belt',
        localObservations: 'Bet area along Sutlej river, soil moisture remains relatively higher, excellent for crop diversification.'
      },
      {
        id: 'pakhowal',
        name: 'Pakhowal',
        namePa: 'ਪੱਖੋਵਾਲ',
        nameHi: 'पखोवाल',
        waterTableDepthM: 20.8,
        annualFallCm: 58,
        stageOfExtractionPercent: 204,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 5,
        tubewellCountPerSqKm: 47,
        majorAquifer: 'Deep Central Alluvial',
        localObservations: 'Critical water depletion zone; PAU has demonstrated AWD trials in this cluster showing 22% water saving.'
      }
    ]
  },
  {
    id: 'sangrur',
    name: 'Sangrur',
    namePa: 'ਸੰਗਰੂਰ',
    nameHi: 'संगरूर',
    isLudhianaBelt: false,
    blocks: [
      {
        id: 'sangrur-central',
        name: 'Sangrur Central',
        namePa: 'ਸੰਗਰੂਰ ਕੇਂਦਰੀ',
        nameHi: 'संगरूर सेंट्रल',
        waterTableDepthM: 32.4,
        annualFallCm: 76,
        stageOfExtractionPercent: 284,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 3,
        tubewellCountPerSqKm: 62,
        majorAquifer: 'Very Deep Quaternary (100m+)',
        localObservations: 'Punjab highest water depletion zone. Tube-wells exceed 100 feet depth with 20 HP motors.'
      },
      {
        id: 'dhuri',
        name: 'Dhuri',
        namePa: 'ਧੂਰੀ',
        nameHi: 'धूरी',
        waterTableDepthM: 29.8,
        annualFallCm: 71,
        stageOfExtractionPercent: 265,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 4,
        tubewellCountPerSqKm: 58,
        majorAquifer: 'Deep Alluvial Aquifer',
        localObservations: 'Persistent groundwater mining since 1990s.'
      },
      {
        id: 'sunam',
        name: 'Sunam',
        namePa: 'ਸੁਨਾਮ',
        nameHi: 'सुनाम',
        waterTableDepthM: 34.1,
        annualFallCm: 79,
        stageOfExtractionPercent: 292,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 2,
        tubewellCountPerSqKm: 65,
        majorAquifer: 'Deep Deep Strata',
        localObservations: 'Groundwater drought conditions; urgent crop substitution required.'
      }
    ]
  },
  {
    id: 'patiala',
    name: 'Patiala',
    namePa: 'ਪਟਿਆਲਾ',
    nameHi: 'पटियाला',
    isLudhianaBelt: false,
    blocks: [
      {
        id: 'nabha',
        name: 'Nabha',
        namePa: 'ਨਾਭਾ',
        nameHi: 'नाभा',
        waterTableDepthM: 23.5,
        annualFallCm: 60,
        stageOfExtractionPercent: 212,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Clayey Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 6,
        tubewellCountPerSqKm: 52,
        majorAquifer: 'Ghaggar Basin Alluvial',
        localObservations: 'High density of tube-wells. Intensive paddy-wheat monoculture.'
      },
      {
        id: 'rajpura',
        name: 'Rajpura',
        namePa: 'ਰਾਜਪੁਰਾ',
        nameHi: 'राजपुरा',
        waterTableDepthM: 19.2,
        annualFallCm: 51,
        stageOfExtractionPercent: 180,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 8,
        tubewellCountPerSqKm: 44,
        majorAquifer: 'Alluvial Basin',
        localObservations: 'Groundwater drop moderate-to-severe.'
      }
    ]
  },
  {
    id: 'moga',
    name: 'Moga',
    namePa: 'ਮੋਗਾ',
    nameHi: 'मोगा',
    isLudhianaBelt: false,
    blocks: [
      {
        id: 'moga-1',
        name: 'Moga-1',
        namePa: 'ਮੋਗਾ-1',
        nameHi: 'मोगा-1',
        waterTableDepthM: 24.8,
        annualFallCm: 65,
        stageOfExtractionPercent: 226,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 5,
        tubewellCountPerSqKm: 54,
        majorAquifer: 'South-Central Alluvial',
        localObservations: 'Water level fell from 12m in 2005 to 24.8m in 2024.'
      },
      {
        id: 'baghapurana',
        name: 'Baghapurana',
        namePa: 'ਬਾਘਾਪੁਰਾਣਾ',
        nameHi: 'बाघापुराना',
        waterTableDepthM: 26.2,
        annualFallCm: 68,
        stageOfExtractionPercent: 242,
        cgwbCategory: 'Over-Exploited',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 4,
        tubewellCountPerSqKm: 57,
        majorAquifer: 'Deep Alluvial Sand',
        localObservations: 'Over-exploited dark zone. PAU recommends immediate shift to PR-126 or Maize.'
      }
    ]
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    namePa: 'ਅੰਮ੍ਰਿਤਸਰ',
    nameHi: 'अमृतसर',
    isLudhianaBelt: false,
    blocks: [
      {
        id: 'majitha',
        name: 'Majitha',
        namePa: 'ਮਜੀਠਾ',
        nameHi: 'मजीठा',
        waterTableDepthM: 16.5,
        annualFallCm: 44,
        stageOfExtractionPercent: 158,
        cgwbCategory: 'Critical',
        soilTypeDefault: 'Loam',
        notifiedTransplantDate: '2026-06-11', // Group 1 early notified
        transplantGroup: 1,
        canalIrrigationSharePercent: 22,
        tubewellCountPerSqKm: 36,
        majorAquifer: 'Upper Bari Doab Canal Tract',
        localObservations: 'Group 1 district (Notified date 11 June). Significant canal irrigation from UBDC.'
      },
      {
        id: 'ajnala',
        name: 'Ajnala',
        namePa: 'ਅਜਨਾਲਾ',
        nameHi: 'अजनाला',
        waterTableDepthM: 14.2,
        annualFallCm: 39,
        stageOfExtractionPercent: 142,
        cgwbCategory: 'Critical',
        soilTypeDefault: 'Alluvial',
        notifiedTransplantDate: '2026-06-11',
        transplantGroup: 1,
        canalIrrigationSharePercent: 25,
        tubewellCountPerSqKm: 34,
        majorAquifer: 'Ravi River Floodplain',
        localObservations: 'Ravi basin proximity buffers water levels; Basmati cultivation dominant.'
      }
    ]
  },
  {
    id: 'bathinda',
    name: 'Bathinda',
    namePa: 'ਬਠਿੰਡਾ',
    nameHi: 'बठिंडा',
    isLudhianaBelt: false,
    blocks: [
      {
        id: 'bathinda-central',
        name: 'Bathinda Central',
        namePa: 'ਬਠਿੰਡਾ ਕੇਂਦਰੀ',
        nameHi: 'बठिंडा सेंट्रल',
        waterTableDepthM: 14.8,
        annualFallCm: 28,
        stageOfExtractionPercent: 122,
        cgwbCategory: 'Semi-Critical',
        soilTypeDefault: 'Sandy Loam',
        notifiedTransplantDate: '2026-06-20',
        transplantGroup: 2,
        canalIrrigationSharePercent: 42,
        tubewellCountPerSqKm: 28,
        majorAquifer: 'Southern Alluvial (Brackish Deep)',
        localObservations: 'Canal network is strong, but underground water has high EC/salinity; blending is essential.'
      }
    ]
  },
  {
    id: 'hoshiarpur',
    name: 'Hoshiarpur',
    namePa: 'ਹੁਸ਼ਿਆਰਪੁਰ',
    nameHi: 'होशियारपुर',
    isLudhianaBelt: false,
    blocks: [
      {
        id: 'mukerian',
        name: 'Mukerian',
        namePa: 'ਮੁਕੇਰੀਆਂ',
        nameHi: 'मुकेरियां',
        waterTableDepthM: 9.8,
        annualFallCm: 22,
        stageOfExtractionPercent: 96,
        cgwbCategory: 'Safe',
        soilTypeDefault: 'Alluvial',
        notifiedTransplantDate: '2026-06-11',
        transplantGroup: 1,
        canalIrrigationSharePercent: 32,
        tubewellCountPerSqKm: 22,
        majorAquifer: 'Sub-Himalayan Piedmont Kandi Belt',
        localObservations: 'Higher rainfall zone with adequate recharge; categorized Safe by CGWB.'
      }
    ]
  }
];
