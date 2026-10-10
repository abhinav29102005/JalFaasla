import { PunjabBlock } from '../data/punjabData';
import { CROPS_DATA, CropVariety } from '../data/cropsData';
import { SUBSOIL_WATER_ACT, NOTIFIED_DATES } from '../data/rulesData';

export interface FarmerAdvisoryInput {
  block: PunjabBlock;
  landSizeAcres: number;
  soilType: string;
  currentCropId: string;
  tubewellDepthM: number;
  pumpHp: number;
  powerSource: 'diesel' | 'electric' | 'solar';
  irrigationMethod: 'flooding' | 'awd' | 'dsr' | 'drip';
  plannedDate: string; // YYYY-MM-DD
}

export interface LegalCheckResult {
  isCompliant: boolean;
  violationType: 'NONE' | 'EARLY_NURSERY' | 'EARLY_TRANSPLANT';
  daysEarly: number;
  penaltyRiskInr: number;
  applicableRuleSection: string;
  notifiedDateRequired: string;
  statusBadge: string;
  statusBadgePa: string;
  statusBadgeHi: string;
  message: string;
  messagePa: string;
}

export interface OptionEconomics {
  title: string;
  titlePa: string;
  cropName: string;
  cropNamePa: string;
  waterUsedM3Total: number;
  waterSavedM3Total: number;
  waterSavedPercent: number;
  tubewellHoursTotal: number;
  tubewellHoursSaved: number;
  operationalCostInr: number;
  costSavedInr: number;
  grossYieldQtlTotal: number;
  grossRevenueInr: number;
  netReturnInr: number;
  stubbleRisk: string;
  durationDays: number;
  keyRecommendation: string;
  keyRecommendationPa: string;
}

export interface FarmerAdvisoryResult {
  input: FarmerAdvisoryInput;
  legalCheck: LegalCheckResult;
  headlinePunchline: string;
  headlinePunchlinePa: string;
  headlinePunchlineHi: string;
  baseline: OptionEconomics;
  recommendedShortPaddyAwd: OptionEconomics;
  recommendedDiversified: OptionEconomics;
  awdGuidance: {
    irrigationIntervalDays: number;
    depthThresholdCm: number;
    safeStagesForDrying: string;
    criticalStageForContinuousWater: string;
  };
}

export function generateFarmerAdvisory(input: FarmerAdvisoryInput): FarmerAdvisoryResult {
  const {
    block,
    landSizeAcres,
    currentCropId,
    pumpHp,
    powerSource,
    plannedDate,
    irrigationMethod
  } = input;

  const currentCrop = CROPS_DATA[currentCropId] || CROPS_DATA.pusa44;
  const pr126 = CROPS_DATA.pr126;
  const maize = CROPS_DATA.maize;

  // 1. Legal Check under Punjab Preservation of Subsoil Water Act
  const notifiedTransplant = block.notifiedTransplantDate || NOTIFIED_DATES.transplantGroup2;
  const plannedTime = new Date(plannedDate).getTime();
  const notifiedTime = new Date(notifiedTransplant).getTime();
  const nurseryBanTime = new Date(NOTIFIED_DATES.nurseryBanBefore).getTime();

  let isCompliant = true;
  let violationType: 'NONE' | 'EARLY_NURSERY' | 'EARLY_TRANSPLANT' = 'NONE';
  let daysEarly = 0;
  let penaltyRiskInr = 0;
  let statusBadge = "LEGAL: Within Punjab Notified Window";
  let statusBadgePa = "ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਸਹੀ: ਨੋਟੀਫਾਈਡ ਮਿਤੀ ਦੇ ਅਨੁਕੂਲ";
  let statusBadgeHi = "कानूनी रूप से मान्य: अधिसूचित अवधि के भीतर";
  let message = "Your planned date is within the legal window under the Punjab Preservation of Subsoil Water Act.";
  let messagePa = "ਤੁਹਾਡੀ ਚੁਣੀ ਹੋਈ ਮਿਤੀ ਪੰਜਾਬ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਸੰਭਾਲ ਐਕਟ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਬਿਲਕੁਲ ਸਹੀ ਹੈ।";

  if (plannedTime < nurseryBanTime) {
    isCompliant = false;
    violationType = 'EARLY_NURSERY';
    daysEarly = Math.ceil((nurseryBanTime - plannedTime) / (1000 * 60 * 60 * 24));
    penaltyRiskInr = Math.round(landSizeAcres * SUBSOIL_WATER_ACT.penaltyPerAcreMonth * (Math.max(1, daysEarly) / 30));
    statusBadge = "CRITICAL VIOLATION: Nursery Sown Before 10 May";
    statusBadgePa = "ਗੰਭੀਰ ਉਲੰਘਣਾ: 10 ਮਈ ਤੋਂ ਪਹਿਲਾਂ ਪਨੀਰੀ ਬੀਜਣਾ ਗੈਰ-ਕਾਨੂੰਨੀ";
    statusBadgeHi = "गंभीर उल्लंघन: 10 मई से पहले पनीरी की बुवाई अवैध";
    message = `Illegal under Section 3(1). Nursery cannot be sown before 10 May. Agriculture Department authorized to destroy nursery and levy ₹10,000/ha/month fine.`;
    messagePa = `ਧਾਰਾ 3(1) ਦੀ ਉਲੰਘਣਾ। 10 ਮਈ ਤੋਂ ਪਹਿਲਾਂ ਪਨੀਰੀ ਬੀਜਣ 'ਤੇ ₹10,000 ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਪ੍ਰਤੀ ਮਹੀਨਾ ਜੁਰਮਾਨਾ ਅਤੇ ਪਨੀਰੀ ਵਾਹੁਣ ਦੀ ਕਾਰਵਾਈ ਹੋ ਸਕਦੀ ਹੈ।`;
  } else if (plannedTime < notifiedTime) {
    isCompliant = false;
    violationType = 'EARLY_TRANSPLANT';
    daysEarly = Math.ceil((notifiedTime - plannedTime) / (1000 * 60 * 60 * 24));
    penaltyRiskInr = Math.round(landSizeAcres * SUBSOIL_WATER_ACT.penaltyPerAcreMonth * (Math.max(1, daysEarly) / 30));
    statusBadge = `LEGAL WARNING: Transplanting ${daysEarly} Days Before ${notifiedTransplant}`;
    statusBadgePa = `ਚੇਤਾਵਨੀ: ਨੋਟੀਫਾਈਡ ਤਾਰੀਖ਼ (${notifiedTransplant}) ਤੋਂ ${daysEarly} ਦਿਨ ਪਹਿਲਾਂ ਲਵਾਈ!`;
    statusBadgeHi = `चेतावनी: अधिसूचित तिथि (${notifiedTransplant}) से ${daysEarly} दिन पहले रोपाई!`;
    message = `Transplanting before ${notifiedTransplant} violates Section 3(2). Penalties up to ₹10,000/ha/month (~₹${penaltyRiskInr.toLocaleString('en-IN')} on your land) plus uprooting risk.`;
    messagePa = `ਨੋਟੀਫਾਈਡ ਮਿਤੀ ${notifiedTransplant} ਤੋਂ ਪਹਿਲਾਂ ਝੋਨਾ ਲਾਉਣਾ ਗੈਰ-ਕਾਨੂੰਨੀ ਹੈ। ਤੁਹਾਡੇ ਰਕਬੇ 'ਤੇ ਲਗਭਗ ₹${penaltyRiskInr.toLocaleString('en-IN')} ਦਾ ਜੁਰਮਾਨਾ ਹੋ ਸਕਦਾ ਹੈ।`;
  }

  // 2. Pump HP scaling factor
  const hpFactor = 10 / Math.max(5, pumpHp);

  // Cost calculation function
  const calcCost = (hours: number): number => {
    if (powerSource === 'diesel') {
      const litersPerHour = 1.8 * Math.pow(pumpHp / 10, 0.7);
      return Math.round(hours * litersPerHour * 88);
    } else if (powerSource === 'electric') {
      const kw = pumpHp * 0.746;
      return Math.round(hours * kw * 6.5);
    } else {
      return Math.round(hours * 15);
    }
  };

  // 3. Baseline Calculations (Current crop with conventional flooding)
  const baselineWaterPerAcre = currentCrop.waterDemandM3PerAcre;
  const baselineHoursPerAcre = currentCrop.tubewellHoursPerAcre * hpFactor;
  const baselineWaterTotal = Math.round(baselineWaterPerAcre * landSizeAcres);
  const baselineHoursTotal = Math.round(baselineHoursPerAcre * landSizeAcres);
  const baselineCostTotal = calcCost(baselineHoursTotal);
  const baselineYieldTotal = Math.round(currentCrop.averageYieldQtlPerAcre * landSizeAcres * 10) / 10;
  const baselineGrossRevenue = Math.round(baselineYieldTotal * currentCrop.mspOrMarketPricePerQtl);
  const baselineNetReturn = Math.round((currentCrop.netReturnPerAcre * landSizeAcres) - (baselineCostTotal - currentCrop.dieselCostPerAcre * landSizeAcres));

  const baseline: OptionEconomics = {
    title: "Conventional Practice (Continuous Flooding)",
    titlePa: "ਰਵਾਇਤੀ ਤਰੀਕਾ (ਲਗਾਤਾਰ ਖੜ੍ਹਾ ਪਾਣੀ)",
    cropName: currentCrop.name,
    cropNamePa: currentCrop.namePa,
    waterUsedM3Total: baselineWaterTotal,
    waterSavedM3Total: 0,
    waterSavedPercent: 0,
    tubewellHoursTotal: baselineHoursTotal,
    tubewellHoursSaved: 0,
    operationalCostInr: baselineCostTotal,
    costSavedInr: 0,
    grossYieldQtlTotal: baselineYieldTotal,
    grossRevenueInr: baselineGrossRevenue,
    netReturnInr: baselineNetReturn,
    stubbleRisk: currentCrop.stubbleRisk,
    durationDays: currentCrop.durationDaysTotal,
    keyRecommendation: "Continuous flooding causes rapid groundwater decline, heavy evaporation, and high pump electric/diesel bills.",
    keyRecommendationPa: "ਖੇਤ ਵਿੱਚ ਲਗਾਤਾਰ ਪਾਣੀ ਖੜ੍ਹਾ ਰੱਖਣ ਨਾਲ ਪਾਣੀ ਅਤੇ ਡੀਜ਼ਲ ਦੀ ਭਾਰੀ ਬਰਬਾਦੀ ਹੁੰਦੀ ਹੈ।"
  };

  // 4. Recommendation 1: PR-126 + AWD
  const pr126WaterPerAcre = Math.round(pr126.waterDemandM3PerAcre * 0.85);
  const pr126HoursPerAcre = Math.round(pr126.tubewellHoursPerAcre * hpFactor * 0.85);
  const pr126WaterTotal = Math.round(pr126WaterPerAcre * landSizeAcres);
  const pr126HoursTotal = Math.round(pr126HoursPerAcre * landSizeAcres);
  const pr126CostTotal = calcCost(pr126HoursTotal);
  const pr126YieldTotal = Math.round(pr126.averageYieldQtlPerAcre * landSizeAcres * 10) / 10;
  const pr126GrossRevenue = Math.round(pr126YieldTotal * pr126.mspOrMarketPricePerQtl);
  const pr126HoursSaved = Math.max(0, baselineHoursTotal - pr126HoursTotal);
  const pr126CostSaved = Math.max(0, baselineCostTotal - pr126CostTotal);
  const pr126WaterSaved = Math.max(0, baselineWaterTotal - pr126WaterTotal);
  const pr126WaterSavedPercent = Math.round((pr126WaterSaved / baselineWaterTotal) * 100);

  const pr126NetReturn = Math.round((pr126.netReturnPerAcre * landSizeAcres) + pr126CostSaved * 0.4);

  const recommendedShortPaddyAwd: OptionEconomics = {
    title: "PAU Short-Duration PR-126 + AWD (Pani-Pipe)",
    titlePa: "ਪੀ.ਏ.ਯੂ. ਪੀ.ਆਰ.-126 + ਬਦਲਵੀਂ ਸਿੰਚਾਈ (ਪਾਣੀ-ਪਾਈਪ)",
    cropName: "PR-126 with Alternate Wetting & Drying",
    cropNamePa: "ਪੀ.ਆਰ.-126 ਬਦਲਵੀਂ ਗਿੱਲੀ-ਸੁੱਕੀ ਸਿੰਚਾਈ ਨਾਲ",
    waterUsedM3Total: pr126WaterTotal,
    waterSavedM3Total: pr126WaterSaved,
    waterSavedPercent: pr126WaterSavedPercent,
    tubewellHoursTotal: pr126HoursTotal,
    tubewellHoursSaved: pr126HoursSaved,
    operationalCostInr: pr126CostTotal,
    costSavedInr: pr126CostSaved,
    grossYieldQtlTotal: pr126YieldTotal,
    grossRevenueInr: pr126GrossRevenue,
    netReturnInr: pr126NetReturn,
    stubbleRisk: "Low",
    durationDays: 123,
    keyRecommendation: `Matures in only 93 days after transplanting. Delay transplanting to ${notifiedTransplant} to comply with the Act and tap monsoon showers.`,
    keyRecommendationPa: `ਲਵਾਈ ਤੋਂ ਬਾਅਦ ਸਿਰਫ਼ 93 ਦਿਨਾਂ ਵਿੱਚ ਪੱਕਦਾ ਹੈ। ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਮਿਤੀ ${notifiedTransplant} 'ਤੇ ਲਾ ਕੇ ਜੁਰਮਾਨੇ ਤੋਂ ਬਚੋ ਅਤੇ ਮੌਨਸੂਨ ਦਾ ਪੂਰਾ ਲਾਭ ਲਓ।`
  };

  // 5. Recommendation 2: Diversified Kharif Plan
  const paddyAcres = Math.max(1, Math.round(landSizeAcres * 0.6 * 10) / 10);
  const maizeAcres = Math.max(0.5, Math.round((landSizeAcres - paddyAcres) * 10) / 10);

  const divWaterTotal = Math.round((paddyAcres * pr126WaterPerAcre) + (maizeAcres * maize.waterDemandM3PerAcre));
  const divHoursTotal = Math.round((paddyAcres * pr126HoursPerAcre) + (maizeAcres * maize.tubewellHoursPerAcre * hpFactor));
  const divCostTotal = calcCost(divHoursTotal);
  const divHoursSaved = Math.max(0, baselineHoursTotal - divHoursTotal);
  const divCostSaved = Math.max(0, baselineCostTotal - divCostTotal);
  const divWaterSaved = Math.max(0, baselineWaterTotal - divWaterTotal);
  const divWaterSavedPercent = Math.round((divWaterSaved / baselineWaterTotal) * 100);

  const divPaddyYield = paddyAcres * pr126.averageYieldQtlPerAcre;
  const divMaizeYield = maizeAcres * maize.averageYieldQtlPerAcre;
  const divGrossRevenue = Math.round((divPaddyYield * pr126.mspOrMarketPricePerQtl) + (divMaizeYield * maize.mspOrMarketPricePerQtl));
  const divNetReturn = Math.round((paddyAcres * pr126.netReturnPerAcre) + (maizeAcres * maize.netReturnPerAcre) + divCostSaved * 0.4);

  const recommendedDiversified: OptionEconomics = {
    title: `Diversified Plan (${paddyAcres} ac PR-126 + ${maizeAcres} ac Maize)`,
    titlePa: `ਫਸਲੀ ਵਿਭਿੰਨਤਾ ਯੋਜਨਾ (${paddyAcres} ਏਕੜ ਪੀ.ਆਰ.-126 + ${maizeAcres} ਏਕੜ ਮੱਕੀ)`,
    cropName: `${paddyAcres} Ac PR-126 + ${maizeAcres} Ac Kharif Maize`,
    cropNamePa: `${paddyAcres} ਏਕੜ ਪੀ.ਆਰ.-126 + ${maizeAcres} ਏਕੜ ਮੱਕੀ`,
    waterUsedM3Total: divWaterTotal,
    waterSavedM3Total: divWaterSaved,
    waterSavedPercent: divWaterSavedPercent,
    tubewellHoursTotal: divHoursTotal,
    tubewellHoursSaved: divHoursSaved,
    operationalCostInr: divCostTotal,
    costSavedInr: divCostSaved,
    grossYieldQtlTotal: Math.round((divPaddyYield + divMaizeYield) * 10) / 10,
    grossRevenueInr: divGrossRevenue,
    netReturnInr: divNetReturn,
    stubbleRisk: "Zero on Maize area",
    durationDays: 95,
    keyRecommendation: `Maximized water and soil recovery. Saves ${divHoursSaved} tube-well hours while securing high-value green fodder and ethanol MSP market.`,
    keyRecommendationPa: `ਪਾਣੀ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਬੱਚਤ। ${divHoursSaved} ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਬਚਦਾ ਹੈ ਅਤੇ ਪਸ਼ੂਆਂ ਲਈ ਹਰਾ ਚਾਰਾ ਵੀ ਮਿਲਦਾ ਹੈ।`
  };

  // 6. The Core Pitch Insight / Headline Punchline
  const dateFormatted = new Date(notifiedTransplant).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const headlinePunchline = `On your ${landSizeAcres}-acre plot in ${block.name}, delaying transplanting to ${dateFormatted} and using alternate wetting-and-drying can save approximately ${pr126HoursSaved} tube-well hours and ₹${pr126CostSaved.toLocaleString('en-IN')} this season.`;
  const headlinePunchlinePa = `ਤੁਹਾਡੇ ${block.namePa} ਦੇ ${landSizeAcres} ਏਕੜ ਖੇਤ ਵਿੱਚ, ਝੋਨਾ ${dateFormatted} 'ਤੇ ਲਾਉਣ ਅਤੇ ਬਦਲਵੀਂ ਸਿੰਚਾਈ (AWD) ਵਰਤਣ ਨਾਲ ਇਸ ਸੀਜ਼ਨ ਲਗਭਗ ${pr126HoursSaved} ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਅਤੇ ₹${pr126CostSaved.toLocaleString('en-IN')} ਦੀ ਸਿੱਧੀ ਬੱਚਤ ਹੋਵੇਗੀ।`;
  const headlinePunchlineHi = `आपके ${block.nameHi} के ${landSizeAcres} एकड़ खेत में, रोपाई को ${dateFormatted} तक पुनर्निर्धारित करने और वैकल्पिक गीली-सूखी सिंचाई अपनाने से इस सीजन लगभग ${pr126HoursSaved} ट्यूबवेल घंटे और ₹${pr126CostSaved.toLocaleString('en-IN')} की बचत होगी।`;

  return {
    input,
    legalCheck: {
      isCompliant,
      violationType,
      daysEarly,
      penaltyRiskInr,
      applicableRuleSection: SUBSOIL_WATER_ACT.section,
      notifiedDateRequired: notifiedTransplant,
      statusBadge,
      statusBadgePa,
      statusBadgeHi,
      message,
      messagePa
    },
    headlinePunchline,
    headlinePunchlinePa,
    headlinePunchlineHi,
    baseline,
    recommendedShortPaddyAwd,
    recommendedDiversified,
    awdGuidance: {
      irrigationIntervalDays: 4,
      depthThresholdCm: 5,
      safeStagesForDrying: "Tillering and vegetative growth (weeks 3 to 7)",
      criticalStageForContinuousWater: "Flowering & panicle heading stage (keep flooded 3-5 cm for 14 days)"
    }
  };
}
