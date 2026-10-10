export interface CropVariety {
  id: string;
  name: string;
  namePa: string;
  nameHi: string;
  category: 'paddy_conventional' | 'paddy_short' | 'paddy_dsr' | 'maize' | 'pulses' | 'basmati';
  durationDaysTotal: number;
  durationTransplantDays: number;
  waterDemandM3PerAcre: number; // m3 of water per acre
  irrigationCountTypical: number;
  tubewellHoursPerAcre: number; // hours of submersible running (based on 10 HP pump @ 25-30 m3/hr discharge)
  dieselCostPerAcre: number; // ₹ at ₹88/litre (approx 1.8 L/hr)
  electricUnitsPerAcre: number; // kWh units (7.5 kW x hours)
  electricCostEquivPerAcre: number; // ₹ based on subsidized unit cost benchmark (approx ₹6.5/unit)
  averageYieldQtlPerAcre: number;
  mspOrMarketPricePerQtl: number; // ₹ per quintal
  seedAndInputCostPerAcre: number; // ₹
  grossReturnPerAcre: number; // ₹
  netReturnPerAcre: number; // ₹
  stubbleRisk: 'Severe' | 'Low' | 'Zero';
  pauRecommendationNote: string;
  suitabilityCondition: string;
}

export const CROPS_DATA: Record<string, CropVariety> = {
  pusa44: {
    id: 'pusa44',
    name: 'Pusa-44 (Conventional Long-Duration Paddy)',
    namePa: 'ਪੂਸਾ-44 (ਲੰਬੀ ਮਿਆਦ ਝੋਨਾ - ਪੀਲੀ ਪੂਸਾ)',
    nameHi: 'पूसा-44 (लंबी अवधि धान)',
    category: 'paddy_conventional',
    durationDaysTotal: 155,
    durationTransplantDays: 125,
    waterDemandM3PerAcre: 4800,
    irrigationCountTypical: 26,
    tubewellHoursPerAcre: 145,
    dieselCostPerAcre: 22968, // 145 hrs * 1.8 L * 88
    electricUnitsPerAcre: 1087, // 145 * 7.5 kW
    electricCostEquivPerAcre: 7065,
    averageYieldQtlPerAcre: 34,
    mspOrMarketPricePerQtl: 2320, // Kharif 2024-25 MSP
    seedAndInputCostPerAcre: 14500,
    grossReturnPerAcre: 78880,
    netReturnPerAcre: 41412,
    stubbleRisk: 'Severe',
    pauRecommendationNote: 'DISCOURAGED BY PAU & PUNJAB GOVT: Heavy water mining, matures late (late October) delaying wheat sowing and causing catastrophic stubble burning.',
    suitabilityCondition: 'Not recommended under groundwater crisis. Banned from official state seed distribution.'
  },
  pr126: {
    id: 'pr126',
    name: 'PR-126 (PAU Short-Duration High-Yield Wonder)',
    namePa: 'ਪੀ.ਆਰ.-126 (ਪੀ.ਏ.ਯੂ. ਘੱਟ ਸਮੇਂ ਵਾਲੀ ਕਿਸਮ)',
    nameHi: 'पी.आर.-126 (पीएयू कम अवधि वाली किस्म)',
    category: 'paddy_short',
    durationDaysTotal: 123,
    durationTransplantDays: 93,
    waterDemandM3PerAcre: 3450,
    irrigationCountTypical: 18,
    tubewellHoursPerAcre: 102,
    dieselCostPerAcre: 16156, // saves ₹6,812 in diesel vs Pusa-44!
    electricUnitsPerAcre: 765,
    electricCostEquivPerAcre: 4972, // saves ₹2,093 in electricity units!
    averageYieldQtlPerAcre: 31,
    mspOrMarketPricePerQtl: 2320,
    seedAndInputCostPerAcre: 12800,
    grossReturnPerAcre: 71920,
    netReturnPerAcre: 42964, // HIGHER net return due to huge savings in diesel/irrigation/pesticides!
    stubbleRisk: 'Low',
    pauRecommendationNote: 'STRONGLY RECOMMENDED BY PAU: Matures in only 93 days after transplanting. Saves 25-30% groundwater (35-43 tube-well hours/acre), frees field by mid-September for potato/peas or timely wheat.',
    suitabilityCondition: 'Ideal for Ludhiana, Sangrur, Moga, Patiala deep tube-well areas with AWD irrigation.'
  },
  pr121: {
    id: 'pr121',
    name: 'PR-121 (PAU Medium-Duration Resistant Variety)',
    namePa: 'ਪੀ.ਆਰ.-121 (ਪੀ.ਏ.ਯੂ. ਦਰਮਿਆਨੀ ਮਿਆਦ)',
    nameHi: 'पी.आर.-121 (मध्यम अवधि किस्म)',
    category: 'paddy_short',
    durationDaysTotal: 140,
    durationTransplantDays: 110,
    waterDemandM3PerAcre: 3950,
    irrigationCountTypical: 21,
    tubewellHoursPerAcre: 118,
    dieselCostPerAcre: 18691,
    electricUnitsPerAcre: 885,
    electricCostEquivPerAcre: 5752,
    averageYieldQtlPerAcre: 32.5,
    mspOrMarketPricePerQtl: 2320,
    seedAndInputCostPerAcre: 13200,
    grossReturnPerAcre: 75400,
    netReturnPerAcre: 43509,
    stubbleRisk: 'Low',
    pauRecommendationNote: 'PAU certified resistant against all 10 pathotypes of bacterial leaf blight. 15-18% water saving vs Pusa-44.',
    suitabilityCondition: 'Suitable for farmers seeking steady high yields with balanced water reduction.'
  },
  dsr_tarwattar: {
    id: 'dsr_tarwattar',
    name: 'Direct Seeded Rice (DSR - Tar-Wattar Technique)',
    namePa: 'ਸਿੱਧੀ ਬਿਜਾਈ ਝੋਨਾ (ਡੀ.ਐਸ.ਆਰ. ਤਰ-ਵੱਤਰ ਤਕਨੀਕ)',
    nameHi: 'सीधी बिजाई धान (डीएसआर तर-वत्तर)',
    category: 'paddy_dsr',
    durationDaysTotal: 130,
    durationTransplantDays: 130, // direct seeded
    waterDemandM3PerAcre: 3600,
    irrigationCountTypical: 17,
    tubewellHoursPerAcre: 98,
    dieselCostPerAcre: 15523,
    electricUnitsPerAcre: 735,
    electricCostEquivPerAcre: 4777,
    averageYieldQtlPerAcre: 30,
    mspOrMarketPricePerQtl: 2320,
    seedAndInputCostPerAcre: 10500, // Saves nursery raising and puddling tractor diesel (₹4,000/acre saved!)
    grossReturnPerAcre: 69600,
    netReturnPerAcre: 43577, // Extra state incentive ₹1,500/acre often provided by Punjab Govt
    stubbleRisk: 'Low',
    pauRecommendationNote: 'No nursery raising, zero puddling (kaddu) compaction. Water infiltrates naturally, saves 15-20% irrigation water and ₹3,500 in labor/diesel.',
    suitabilityCondition: 'Medium to heavy soils. Allowed by Punjab Govt from June 1.'
  },
  maize: {
    id: 'maize',
    name: 'Kharif Maize (Makka - PMH-13 / DKC 9108)',
    namePa: 'ਮੱਕੀ (ਪੀ.ਐਮ.ਐਚ.-13 / ਮੱਕਾ ਹਾਈਬ੍ਰਿਡ)',
    nameHi: 'खरीफ मक्का (पीएमएच-13)',
    category: 'maize',
    durationDaysTotal: 95,
    durationTransplantDays: 95,
    waterDemandM3PerAcre: 1750, // 63% LESS water than Pusa-44!
    irrigationCountTypical: 4, // Only 4 irrigations vs 26 for paddy!
    tubewellHoursPerAcre: 24, // Saves 121 tube-well hours!
    dieselCostPerAcre: 3801,
    electricUnitsPerAcre: 180,
    electricCostEquivPerAcre: 1170,
    averageYieldQtlPerAcre: 26,
    mspOrMarketPricePerQtl: 2225, // MSP ₹2,225/qtl + strong ethanol distillery demand in Punjab
    seedAndInputCostPerAcre: 11000,
    grossReturnPerAcre: 57850,
    netReturnPerAcre: 43049,
    stubbleRisk: 'Zero',
    pauRecommendationNote: 'MAXIMUM WATER SAVING: Consumes only 35% of paddy water. No stubble burning—leaves valuable green fodder. Enormous relief for falling water table.',
    suitabilityCondition: 'Well-drained soils in Ludhiana, Jagraon, Hoshiarpur, Shaheed Bhagat Singh Nagar.'
  },
  moong: {
    id: 'moong',
    name: 'Kharif/Summer Moong (Green Gram - SML-668 / 1827)',
    namePa: 'ਮੂੰਗੀ (ਐਸ.ਐਮ.ਐਲ.-668 / ਦਾਲ)',
    nameHi: 'मूंग (दाल एसएमएल-668)',
    category: 'pulses',
    durationDaysTotal: 65,
    durationTransplantDays: 65,
    waterDemandM3PerAcre: 1100, // 77% LESS water than Pusa-44!
    irrigationCountTypical: 3,
    tubewellHoursPerAcre: 18,
    dieselCostPerAcre: 2851,
    electricUnitsPerAcre: 135,
    electricCostEquivPerAcre: 877,
    averageYieldQtlPerAcre: 5.5,
    mspOrMarketPricePerQtl: 8682, // High MSP ₹8,682/qtl
    seedAndInputCostPerAcre: 6200,
    grossReturnPerAcre: 47751,
    netReturnPerAcre: 38699,
    stubbleRisk: 'Zero',
    pauRecommendationNote: 'LEGUME NITROGEN-FIXING WONDER: Fixes 35-40 kg atmospheric nitrogen per acre, reducing urea need in next crop by 25%. Extremely low tube-well hours.',
    suitabilityCondition: 'Ideal crop diversification or short catch-crop between wheat and basmati.'
  },
  basmati1509: {
    id: 'basmati1509',
    name: 'Pusa Basmati 1509 / 1847 (Export Fragrant Rice)',
    namePa: 'ਪੂਸਾ ਬਾਸਮਤੀ 1509 / 1847',
    nameHi: 'पूसा बासमती 1509 / 1847',
    category: 'basmati',
    durationDaysTotal: 120,
    durationTransplantDays: 90,
    waterDemandM3PerAcre: 3100,
    irrigationCountTypical: 15,
    tubewellHoursPerAcre: 85,
    dieselCostPerAcre: 13464,
    electricUnitsPerAcre: 637,
    electricCostEquivPerAcre: 4143,
    averageYieldQtlPerAcre: 24,
    mspOrMarketPricePerQtl: 3450, // Mandi market auction price
    seedAndInputCostPerAcre: 12000,
    grossReturnPerAcre: 82800,
    netReturnPerAcre: 57336,
    stubbleRisk: 'Low',
    pauRecommendationNote: 'CLIMATE-RESILIENT TIMING: Transplanted in early July (July 1-15), directly leveraging peak monsoon rains (July-August) rather than dry June groundwater.',
    suitabilityCondition: 'Excellent where farmer has export mandi market access and wants high profit with less June pumping.'
  }
};
