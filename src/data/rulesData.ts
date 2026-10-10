export interface SubsoilRule {
  actName: string;
  actNamePa: string;
  actNameHi: string;
  section: string;
  ruleTitle: string;
  ruleTitlePa: string;
  ruleDescription: string;
  ruleDescriptionPa: string;
  penaltyPerHectareMonth: number; // ₹10,000 per month per hectare
  penaltyPerAcreMonth: number; // approx ₹4,047 per month per acre
  enforcementAgency: string;
  consequences: string[];
}

export const SUBSOIL_WATER_ACT: SubsoilRule = {
  actName: 'The Punjab Preservation of Subsoil Water Act, 2009 (and Notified Amendments)',
  actNamePa: 'ਪੰਜਾਬ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਸੰਭਾਲ ਐਕਟ, 2009 (ਅਤੇ ਨੋਟੀਫਾਈਡ ਸੋਧਾਂ)',
  actNameHi: 'पंजाब उपमृदा जल संरक्षण अधिनियम, 2009 (एवं अधिसूचित संशोधन)',
  section: 'Section 3, Section 4 & Section 5',
  ruleTitle: 'Mandatory Ban on Early Sowing of Nursery and Early Paddy Transplantation',
  ruleTitlePa: 'ਪਨੀਰੀ ਅਤੇ ਝੋਨਾ ਲਵਾਈ ਦੇ ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਦਿਨਾਂ ਦੀ ਪਾਲਣਾ',
  ruleDescription: 'Under the Act, no farmer in Punjab shall sow nursery of paddy before 10th May, nor transplant paddy in fields before the notified date (June 11 for Group 1 districts or June 20 for Group 2 districts including Ludhiana central belt). Early planting in peak hot May-June wastes excessive groundwater via evaporation before monsoon onset.',
  ruleDescriptionPa: 'ਇਸ ਕਾਨੂੰਨ ਤਹਿਤ ਕੋਈ ਵੀ ਕਿਸਾਨ 10 ਮਈ ਤੋਂ ਪਹਿਲਾਂ ਝੋਨੇ ਦੀ ਪਨੀਰੀ ਨਹੀਂ ਬੀਜ ਸਕਦਾ ਅਤੇ ਨੋਟੀਫਾਈਡ ਮਿਤੀ (ਲੁਧਿਆਣਾ ਅਤੇ ਗਰੁੱਪ 2 ਲਈ 20 ਜੂਨ, ਗਰੁੱਪ 1 ਲਈ 11 ਜੂਨ) ਤੋਂ ਪਹਿਲਾਂ ਖੇਤਾਂ ਵਿੱਚ ਝੋਨਾ ਨਹੀਂ ਲਾ ਸਕਦਾ। ਮਈ-ਜੂਨ ਦੀ ਭਿਆਨਕ ਗਰਮੀ ਵਿੱਚ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੁੰਦਾ ਹੈ।',
  penaltyPerHectareMonth: 10000,
  penaltyPerAcreMonth: 4047,
  enforcementAgency: 'Authorized Agriculture Officer / Sub-Divisional Magistrate (SDM), Punjab Dept of Agriculture & Farmers Welfare',
  consequences: [
    'Fine of ₹10,000 per month per hectare (₹4,047/acre/month) or part thereof.',
    'Issue of formal destruction notice to plough up and uproot the unauthorized crop at farmer expense.',
    'Risk of temporary disconnection of agricultural tube-well power supply for repeated violations.',
    'Exclusion from subsidized agricultural schemes and crop loss compensation.'
  ]
};

export const NOTIFIED_DATES = {
  nurseryBanBefore: '2026-05-10', // Nursery cannot be sown before 10 May
  dsrPermittedFrom: '2026-06-01', // Direct Seeded Rice permitted from 1 June
  transplantGroup1: '2026-06-11', // Amritsar, Gurdaspur, Pathankot, Hoshiarpur, Tarn Taran, etc.
  transplantGroup2: '2026-06-20', // Ludhiana, Sangrur, Patiala, Jalandhar, Moga, Bathinda, etc.
};
