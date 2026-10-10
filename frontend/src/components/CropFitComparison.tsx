import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Droplet, 
  TrendingUp, 
  Flame, 
  Layers
} from 'lucide-react';
import { FarmerAdvisoryResult } from '../utils/advisoryEngine';
import { Language, TRANSLATIONS } from '../data/translations';

interface CropFitComparisonProps {
  currentLang: Language;
  advisory: FarmerAdvisoryResult;
}

export const CropFitComparison: React.FC<CropFitComparisonProps> = ({
  currentLang,
  advisory,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedPlan, setSelectedPlan] = useState<'pr126' | 'diversified'>('pr126');

  const { baseline, recommendedShortPaddyAwd, recommendedDiversified } = advisory;
  const activePlan = selectedPlan === 'pr126' ? recommendedShortPaddyAwd : recommendedDiversified;

  return (
    <div className="card cropfit-card">
      {/* Real-world Pitch Banner in Blue Gradient */}
      <div className="punchline-blue-card">
        <div className="punchline-lead-tag">
          {currentLang === 'pa' ? 'ਤੁਹਾਡੇ ਖੇਤ ਦਾ ਸਿੱਧਾ ਹਿਸਾਬ-ਕਿਤਾਬ' : 'REAL ECONOMIC IMPACT ON YOUR FARM'}
        </div>
        <h3 className="punchline-main-heading">
          "{currentLang === 'pa' 
            ? advisory.headlinePunchlinePa 
            : currentLang === 'hi' 
            ? advisory.headlinePunchlineHi 
            : advisory.headlinePunchline}"
        </h3>
        <p className="punchline-source-note">
          {currentLang === 'pa'
            ? 'ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਲੁਧਿਆਣਾ ਰਿਸਰਚ ਅਤੇ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਬੋਰ ਅੰਕੜਿਆਂ ਤੇ ਆਧਾਰਿਤ।'
            : 'Based on Punjab Agricultural University (PAU) Ludhiana trials and Central Ground Water Board monitoring.'}
        </p>
      </div>

      {/* 4 Big Numbers - Simple for Farmers */}
      <div className="big-metrics-grid">
        <div className="metric-box box-blue">
          <div className="box-top">
            <Clock size={20} className="text-cyan" />
            <span className="box-title">
              {currentLang === 'pa' ? 'ਟਿਊਬਵੈੱਲ ਘੰਟੇ ਬਚੇ' : 'Tube-Well Hours Saved'}
            </span>
          </div>
          <div className="box-number-row">
            <span className="big-number font-mono text-cyan">
              {activePlan.tubewellHoursSaved}
            </span>
            <span className="big-unit">ਘੰਟੇ (Hrs)</span>
          </div>
          <span className="box-detail">
            {baseline.tubewellHoursTotal} ਘੰਟਿਆਂ ਤੋਂ ਘੱਟ ਕੇ {activePlan.tubewellHoursTotal} ਘੰਟੇ ਰਹਿ ਗਏ
          </span>
        </div>

        <div className="metric-box box-green">
          <div className="box-top">
            <IndianRupee size={20} className="text-emerald" />
            <span className="box-title">
              {currentLang === 'pa' ? 'ਸਿੱਧਾ ਖਰਚਾ ਬਚਿਆ' : 'Diesel / Power Saved'}
            </span>
          </div>
          <div className="box-number-row">
            <span className="big-number font-mono text-emerald">
              ₹{activePlan.costSavedInr.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="box-detail">
            ਡੀਜ਼ਲ / ਬਿਜਲੀ ਅਤੇ ਮੋਟਰ ਮੁਰੰਮਤ ਦੇ ਬਚੇ ਪੈਸੇ
          </span>
        </div>

        <div className="metric-box box-water">
          <div className="box-top">
            <Droplet size={20} className="text-blue" />
            <span className="box-title">
              {currentLang === 'pa' ? 'ਧਰਤੀ ਹੇਠਲਾ ਪਾਣੀ ਬਚਿਆ' : 'Groundwater Saved'}
            </span>
          </div>
          <div className="box-number-row">
            <span className="big-number font-mono text-blue">
              {activePlan.waterSavedPercent}%
            </span>
            <span className="big-unit">ਬੱਚਤ</span>
          </div>
          <span className="box-detail">
            {activePlan.waterSavedM3Total.toLocaleString('en-IN')} m³ ਪਾਣੀ ਬਚਾਇਆ
          </span>
        </div>

        <div className="metric-box box-profit">
          <div className="box-top">
            <TrendingUp size={20} className="text-amber" />
            <span className="box-title">
              {currentLang === 'pa' ? 'ਕੁੱਲ ਸ਼ੁੱਧ ਕਮਾਈ' : 'Est. Net Income'}
            </span>
          </div>
          <div className="box-number-row">
            <span className="big-number font-mono text-amber">
              ₹{activePlan.netReturnInr.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="box-detail">
            ਘੱਟ ਖਰਚੇ ਕਾਰਨ ਮੁਨਾਫ਼ਾ ਬਰਾਬਰ ਜਾਂ ਵੱਧ
          </span>
        </div>
      </div>

      {/* Plan Select Buttons - Clean Rectangles */}
      <div className="plan-selection-bar">
        <span className="plan-bar-label">
          {currentLang === 'pa' ? 'ਫਸਲ ਯੋਜਨਾ ਚੁਣੋ:' : 'Choose Farm Plan:'}
        </span>
        <div className="plan-buttons">
          <button
            type="button"
            className={`plan-btn ${selectedPlan === 'pr126' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('pr126')}
          >
            ਯੋਜਨਾ 1: ਪੀ.ਆਰ.-126 + ਪਾਣੀ-ਪਾਈਪ (PAU ਸਿਫਾਰਸ਼)
          </button>
          <button
            type="button"
            className={`plan-btn ${selectedPlan === 'diversified' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('diversified')}
          >
            ਯੋਜਨਾ 2: ਫਸਲੀ ਵਿਭਿੰਨਤਾ (ਪੀ.ਆਰ.-126 + ਮੱਕੀ)
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="side-comparison-grid">
        {/* Baseline Old Method */}
        <div className="compare-card old-method">
          <div className="compare-header">
            <span className="compare-tag tag-old">ਰਵਾਇਤੀ ਤਰੀਕਾ (ਪੁਰਾਣਾ ਅਭਿਆਸ)</span>
            <h4 className="compare-title">{baseline.cropName}</h4>
            <span className="compare-sub">ਲਗਾਤਾਰ ਖੜ੍ਹਾ ਪਾਣੀ (ਕੱਦੂ ਕਰਕੇ 5-7cm ਭਰ ਕੇ ਰੱਖਣਾ)</span>
          </div>

          <div className="compare-specs">
            <div className="spec-row">
              <span className="spec-label">ਟਿਊਬਵੈੱਲ ਚੱਲਣ ਦੇ ਘੰਟੇ:</span>
              <span className="spec-value font-mono">{baseline.tubewellHoursTotal} ਘੰਟੇ (Hours)</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ਡੀਜ਼ਲ / ਬਿਜਲੀ ਖਰਚਾ:</span>
              <span className="spec-value font-mono">₹{baseline.operationalCostInr.toLocaleString('en-IN')}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ਧਰਤੀ ਹੇਠੋਂ ਕੱਢਿਆ ਪਾਣੀ:</span>
              <span className="spec-value font-mono">{baseline.waterUsedM3Total.toLocaleString('en-IN')} m³</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ਪੱਕਣ ਦਾ ਸਮਾਂ:</span>
              <span className="spec-value font-mono">{baseline.durationDays} ਦਿਨ (ਲੇਟ ਕਟਾਈ)</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ਪਰਾਲੀ ਦੀ ਸਮੱਸਿਆ:</span>
              <span className="spec-value font-mono text-red">
                <Flame size={14} className="inline-icon" /> ਭਾਰੀ ਪਰਾਲੀ, ਕਣਕ ਬਿਜਾਈ ਲੇਟ
              </span>
            </div>
            <div className="spec-row spec-total">
              <span className="spec-label">ਕਿਸਾਨ ਦੀ ਬੱਚਤ:</span>
              <span className="spec-value font-mono font-bold">₹{baseline.netReturnInr.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="compare-warning-box">
            ⚠️ <strong>ਨੁਕਸਾਨ:</strong> ਪਾਣੀ ਦਾ ਪੱਧਰ ਤੇਜ਼ੀ ਨਾਲ ਹੇਠਾਂ ਜਾਂਦਾ ਹੈ, ਮੋਟਰਾਂ ਸੜਦੀਆਂ ਹਨ ਅਤੇ ਡੀਜ਼ਲ ਦਾ ਬੋਝ ਵਧਦਾ ਹੈ।
          </div>
        </div>

        {/* Recommended New Method */}
        <div className="compare-card new-method">
          <div className="compare-header">
            <span className="compare-tag tag-new">
              <CheckCircle2 size={14} /> ਸਿਫਾਰਸ਼ ਕੀਤਾ ਤਰੀਕਾ (ਨਵਾਂ ਮੁਨਾਫ਼ਾ)
            </span>
            <h4 className="compare-title">{activePlan.cropName}</h4>
            <span className="compare-sub">
              {selectedPlan === 'pr126' 
                ? 'ਪਾਣੀ-ਪਾਈਪ (AWD) ਨਾਲ ਬਦਲਵੀਂ ਸੁੱਕੀ-ਗਿੱਲੀ ਸਿੰਚਾਈ' 
                : 'ਅੱਧੇ ਰਕਬੇ ਵਿੱਚ ਮੱਕੀ + ਅੱਧੇ ਵਿੱਚ ਪੀ.ਆਰ.-126'}
            </span>
          </div>

          <div className="compare-specs">
            <div className="spec-row highlight-spec">
              <span className="spec-label">ਟਿਊਬਵੈੱਲ ਚੱਲਣ ਦੇ ਘੰਟੇ:</span>
              <span className="spec-value font-mono font-bold text-cyan">
                {activePlan.tubewellHoursTotal} ਘੰਟੇ ({activePlan.tubewellHoursSaved} ਘੰਟੇ ਬਚੇ!)
              </span>
            </div>
            <div className="spec-row highlight-spec">
              <span className="spec-label">ਡੀਜ਼ਲ / ਬਿਜਲੀ ਖਰਚਾ:</span>
              <span className="spec-value font-mono font-bold text-emerald">
                ₹{activePlan.operationalCostInr.toLocaleString('en-IN')} (₹{activePlan.costSavedInr.toLocaleString('en-IN')} ਬਚੇ!)
              </span>
            </div>
            <div className="spec-row highlight-spec">
              <span className="spec-label">ਧਰਤੀ ਹੇਠੋਂ ਕੱਢਿਆ ਪਾਣੀ:</span>
              <span className="spec-value font-mono font-bold text-blue">
                {activePlan.waterUsedM3Total.toLocaleString('en-IN')} m³ ({activePlan.waterSavedPercent}% ਬੱਚਤ)
              </span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ਪੱਕਣ ਦਾ ਸਮਾਂ:</span>
              <span className="spec-value font-mono text-emerald">
                {activePlan.durationDays} ਦਿਨ (ਸਤੰਬਰ ਦੇ ਅਖੀਰ ਵਿੱਚ ਕਟਾਈ)
              </span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ਪਰਾਲੀ ਦੀ ਸਥਿਤੀ:</span>
              <span className="spec-value font-mono text-emerald">
                ਘੱਟ ਪਰਾਲੀ, ਆਲੂ/ਮਟਰ ਜਾਂ ਕਣਕ ਦੀ ਸਮੇਂ ਸਿਰ ਬਿਜਾਈ
              </span>
            </div>
            <div className="spec-row spec-total highlight-spec">
              <span className="spec-label">ਕਿਸਾਨ ਦੀ ਕੁੱਲ ਕਮਾਈ:</span>
              <span className="spec-value font-mono font-bold text-amber">
                ₹{activePlan.netReturnInr.toLocaleString('en-IN')} (+₹{(activePlan.netReturnInr - baseline.netReturnInr).toLocaleString('en-IN')} ਵੱਧ ਮੁਨਾਫ਼ਾ)
              </span>
            </div>
          </div>

          <div className="compare-success-box">
            ✅ <strong>ਫ਼ਾਇਦਾ:</strong> {currentLang === 'pa' ? activePlan.keyRecommendationPa : activePlan.keyRecommendation}
          </div>
        </div>
      </div>
    </div>
  );
};
