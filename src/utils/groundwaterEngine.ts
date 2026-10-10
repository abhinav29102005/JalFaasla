import { PunjabBlock } from '../data/punjabData';

export interface GroundwaterAnalysis {
  stressScore: number; // 0 to 100
  stressLevel: 'CRITICAL' | 'MODERATE' | 'LOW';
  categoryLabel: string;
  categoryLabelPa: string;
  categoryLabelHi: string;
  colorHex: string;
  bgHex: string;
  borderHex: string;
  annualDropCm: number;
  isPauAlarmingDrop: boolean; // true if > 50 cm/year
  estimatedBoreLifeYears: number; // years before water table drops below typical 35m pump ceiling
  factors: {
    title: string;
    value: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
}

export function evaluateGroundwaterStress(
  block: PunjabBlock,
  userReportedDepthM?: number
): GroundwaterAnalysis {
  // Use reported depth or block official depth
  const effectiveDepth = userReportedDepthM && userReportedDepthM > 0 
    ? userReportedDepthM 
    : block.waterTableDepthM;

  // Base score from CGWB Stage of Groundwater Development
  // e.g. 100% -> 45 pts, 180% -> 72 pts, 220%+ -> 85 pts
  let baseScore = Math.min(85, Math.max(20, (block.stageOfExtractionPercent / 200) * 80));

  // Depth modifier
  if (effectiveDepth >= 25) {
    baseScore += 12;
  } else if (effectiveDepth >= 18) {
    baseScore += 8;
  } else if (effectiveDepth >= 14) {
    baseScore += 4;
  }

  // Annual decline modifier (>50 cm is PAU red zone)
  if (block.annualFallCm >= 60) {
    baseScore += 8;
  } else if (block.annualFallCm >= 50) {
    baseScore += 5;
  }

  const stressScore = Math.min(98, Math.max(15, Math.round(baseScore)));

  let stressLevel: 'CRITICAL' | 'MODERATE' | 'LOW' = 'MODERATE';
  let categoryLabel = 'Moderate Stress';
  let categoryLabelPa = 'ਦਰਮਿਆਨਾ ਸੰਕਟ';
  let categoryLabelHi = 'मध्यम तनाव';
  let colorHex = '#eab308'; // yellow
  let bgHex = 'rgba(234, 179, 8, 0.1)';
  let borderHex = 'rgba(234, 179, 8, 0.3)';

  if (stressScore >= 75) {
    stressLevel = 'CRITICAL';
    categoryLabel = 'Critical Over-Exploited (Dark Zone)';
    categoryLabelPa = 'ਅਤਿ ਗੰਭੀਰ ਸੰਕਟ (ਡਾਰਕ ਜ਼ੋਨ)';
    categoryLabelHi = 'अत्यधिक गंभीर (डार्क ज़ोन)';
    colorHex = '#ef4444'; // red
    bgHex = 'rgba(239, 68, 68, 0.12)';
    borderHex = 'rgba(239, 68, 68, 0.4)';
  } else if (stressScore < 45) {
    stressLevel = 'LOW';
    categoryLabel = 'Adequate / Safe Recharge';
    categoryLabelPa = 'ਸੁਰੱਖਿਅਤ ਖੇਤਰ';
    categoryLabelHi = 'सुरक्षित क्षेत्र';
    colorHex = '#10b981'; // green
    bgHex = 'rgba(16, 185, 129, 0.12)';
    borderHex = 'rgba(16, 185, 129, 0.4)';
  }

  // Calculate estimated years before reaching typical 35m pump ceiling at current depletion rate
  const depthRemainingM = Math.max(1, 35 - effectiveDepth);
  const annualFallM = Math.max(0.2, block.annualFallCm / 100);
  const estimatedBoreLifeYears = Math.max(2, Math.round(depthRemainingM / annualFallM));

  const isPauAlarmingDrop = block.annualFallCm >= 50;

  const factors = [
    {
      title: 'CGWB Extraction Ratio',
      value: `${block.stageOfExtractionPercent}%`,
      description: `For every 100 liters recharged by rainfall, ${block.stageOfExtractionPercent} liters are pumped out.`,
      severity: block.stageOfExtractionPercent > 170 ? ('high' as const) : ('medium' as const)
    },
    {
      title: 'Observed Water Table Depth',
      value: `${effectiveDepth.toFixed(1)} m (~${Math.round(effectiveDepth * 3.28)} ft)`,
      description: `Aquifer tapped between 60m and 120m depths. Requires high-voltage submersible pumps.`,
      severity: effectiveDepth >= 18 ? ('high' as const) : ('medium' as const)
    },
    {
      title: 'Annual Rate of Depletion',
      value: `${block.annualFallCm} cm/year`,
      description: isPauAlarmingDrop
        ? 'EXCEEDS PAU THRESHOLD: Punjab Agricultural University study warned losing >50 cm annually triggers motor burnouts.'
        : 'Continuous negative trend observed over 10-year monitoring well series.',
      severity: isPauAlarmingDrop ? ('high' as const) : ('medium' as const)
    },
    {
      title: 'Canal vs Tube-Well Dependence',
      value: `${100 - block.canalIrrigationSharePercent}% Tube-Well Dependent`,
      description: `Only ${block.canalIrrigationSharePercent}% of fields are reached by canal distributaries; ${block.tubewellCountPerSqKm} tube-wells operate per sq km.`,
      severity: block.canalIrrigationSharePercent < 10 ? ('high' as const) : ('medium' as const)
    }
  ];

  return {
    stressScore,
    stressLevel,
    categoryLabel,
    categoryLabelPa,
    categoryLabelHi,
    colorHex,
    bgHex,
    borderHex,
    annualDropCm: block.annualFallCm,
    isPauAlarmingDrop,
    estimatedBoreLifeYears,
    factors
  };
}
