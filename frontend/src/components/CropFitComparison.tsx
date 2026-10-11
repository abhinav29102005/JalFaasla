import React, { useState } from 'react';
import { IndianRupee, Droplet, Clock, TrendingUp, Volume2, Square } from 'lucide-react';
import { FarmerAdvisoryResult } from '../utils/advisoryEngine';
import { Language } from '../data/translations';
import { playPunjabiAdvisory, stopVoiceAdvisory } from '../utils/voiceAdvisory';

interface CropFitComparisonProps {
  currentLang: Language;
  advisory: FarmerAdvisoryResult;
}

export const CropFitComparison: React.FC<CropFitComparisonProps> = ({
  currentLang,
  advisory,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pr126' | 'diversified'>('pr126');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopVoiceAdvisory();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = currentLang === 'pa' 
        ? advisory.headlinePunchlinePa 
        : currentLang === 'hi' 
        ? advisory.headlinePunchlineHi 
        : advisory.headlinePunchline;
      playPunjabiAdvisory(
        textToSpeak,
        currentLang,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const { baseline, recommendedShortPaddyAwd, recommendedDiversified } = advisory;
  const activePlan = selectedPlan === 'pr126' ? recommendedShortPaddyAwd : recommendedDiversified;

  return (
    <div className="cropfit-comparison-section">
      {/* Punchline Header Bar - Flat surface */}
      <div className="punchline-flat-card">
        <div className="punchline-top-row">
          <span className="punchline-subtitle-label">
            {currentLang === 'pa' ? 'ਤੁਹਾਡੇ ਖੇਤ ਦਾ ਸਿੱਧਾ ਹਿਸਾਬ-ਕਿਤਾਬ' : 'Real economic impact on your farm'}
          </span>
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`voice-listen-btn ${isPlayingAudio ? 'playing' : ''}`}
            title="Listen to Punjabi voice advisory"
          >
            {isPlayingAudio ? (
              <>
                <Square size={13} fill="currentColor" aria-hidden="true" />
                <span>{currentLang === 'pa' ? 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ' : 'Stop audio'}</span>
              </>
            ) : (
              <>
                <Volume2 size={15} aria-hidden="true" />
                <span>{currentLang === 'pa' ? 'ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ' : 'Listen voice advisory'}</span>
              </>
            )}
          </button>
        </div>

        <h3 className="punchline-quote">
          "{currentLang === 'pa' 
            ? advisory.headlinePunchlinePa 
            : currentLang === 'hi' 
            ? advisory.headlinePunchlineHi 
            : advisory.headlinePunchline}"
        </h3>
        <p className="punchline-attribution">
          {currentLang === 'pa'
            ? 'ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਖੋਜ ਅਤੇ ਕੇਂਦਰੀ ਗਰਾਊਂਡ ਵਾਟਰ ਬੋਰਡ (CGWB) ਅੰਕੜਿਆਂ ਤੇ ਆਧਾਰਿਤ।'
            : 'Based on Punjab Agricultural University (PAU) trials and Central Ground Water Board monitoring.'}
        </p>
      </div>

      {/* 4 Flat Key Metrics */}
      <div className="metrics-flat-grid">
        <div className="metric-flat-item">
          <div className="metric-flat-header">
            <Clock size={16} className="metric-icon-muted" aria-hidden="true" />
            <span className="metric-flat-label">
              {currentLang === 'pa' ? 'ਟਿਊਬਵੈੱਲ ਘੰਟੇ ਬਚੇ' : 'Tube-well hours saved'}
            </span>
          </div>
          <div className="metric-number-display">
            <span className="metric-large-number tabular-nums">
              {activePlan.tubewellHoursSaved}
            </span>
            <span className="metric-unit-text">{currentLang === 'pa' ? 'ਘੰਟੇ' : 'hours'}</span>
          </div>
          <span className="metric-footnote">
            {baseline.tubewellHoursTotal} {currentLang === 'pa' ? 'ਘੰਟਿਆਂ ਤੋਂ ਘੱਟ ਕੇ' : 'hrs reduced to'} {activePlan.tubewellHoursTotal} {currentLang === 'pa' ? 'ਘੰਟੇ' : 'hrs'}
          </span>
        </div>

        <div className="metric-flat-item">
          <div className="metric-flat-header">
            <IndianRupee size={16} className="metric-icon-green" aria-hidden="true" />
            <span className="metric-flat-label">
              {currentLang === 'pa' ? 'ਡੀਜ਼ਲ / ਬਿਜਲੀ ਖਰਚਾ ਬਚਿਆ' : 'Diesel / power saved'}
            </span>
          </div>
          <div className="metric-number-display">
            <span className="metric-large-number metric-green-number tabular-nums">
              ₹{(activePlan.costSavedInr ?? 0).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="metric-footnote">
            {currentLang === 'pa' ? 'ਡੀਜ਼ਲ, ਬਿਜਲੀ ਅਤੇ ਮੋਟਰ ਮੁਰੰਮਤ ਦੀ ਬੱਚਤ' : 'Direct operating cost reduction'}
          </span>
        </div>

        <div className="metric-flat-item">
          <div className="metric-flat-header">
            <Droplet size={16} className="metric-icon-teal" aria-hidden="true" />
            <span className="metric-flat-label">
              {currentLang === 'pa' ? 'ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਬਚਿਆ' : 'Groundwater saved'}
            </span>
          </div>
          <div className="metric-number-display">
            <span className="metric-large-number metric-teal-number tabular-nums">
              {activePlan.waterSavedPercent ?? 0}%
            </span>
            <span className="metric-unit-text">{currentLang === 'pa' ? 'ਬੱਚਤ' : 'saved'}</span>
          </div>
          <span className="metric-footnote">
            {(activePlan.waterSavedM3Total ?? 0).toLocaleString('en-IN')} m³ {currentLang === 'pa' ? 'ਪਾਣੀ ਬਚਾਇਆ' : 'water conserved'}
          </span>
        </div>

        <div className="metric-flat-item">
          <div className="metric-flat-header">
            <TrendingUp size={16} className="metric-icon-muted" aria-hidden="true" />
            <span className="metric-flat-label">
              {currentLang === 'pa' ? 'ਕੁੱਲ ਸ਼ੁੱਧ ਕਮਾਈ' : 'Estimated net income'}
            </span>
          </div>
          <div className="metric-number-display">
            <span className="metric-large-number tabular-nums">
              ₹{(activePlan.netReturnInr ?? 0).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="metric-footnote">
            {currentLang === 'pa' ? 'ਘੱਟ ਖਰਚੇ ਕਾਰਨ ਮੁਨਾਫ਼ਾ ਬਰਾਬਰ ਜਾਂ ਵੱਧ' : 'Net profitability per season'}
          </span>
        </div>
      </div>

      {/* Plan Selection Buttons */}
      <div className="plan-toggle-row">
        <span className="plan-toggle-title">
          {currentLang === 'pa' ? 'ਫਸਲ ਯੋਜਨਾ ਚੁਣੋ:' : 'Choose crop plan:'}
        </span>
        <div className="plan-toggle-group">
          <button
            type="button"
            className={`plan-tab-btn ${selectedPlan === 'pr126' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('pr126')}
          >
            {currentLang === 'pa' ? 'ਯੋਜਨਾ 1: ਪੀ.ਆਰ.-126 + ਪਾਣੀ-ਪਾਈਪ (AWD)' : 'Plan 1: PR-126 + AWD pani-pipe (PAU)'}
          </button>
          <button
            type="button"
            className={`plan-tab-btn ${selectedPlan === 'diversified' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('diversified')}
          >
            {currentLang === 'pa' ? 'ਯੋਜਨਾ 2: ਫਸਲੀ ਵਿਭਿੰਨਤਾ (ਪੀ.ਆਰ.-126 + ਮੱਕੀ)' : 'Plan 2: Crop diversification (PR-126 + maize)'}
          </button>
        </div>
      </div>

      {/* 50/50 Crop Comparison: Two panels split by a single 2px divider, not two floating cards */}
      <div className="split-comparison-container">
        {/* Left Panel: Baseline Method */}
        <div className="split-panel panel-baseline">
          <div className="split-panel-header">
            <span className="panel-category-title">
              {currentLang === 'pa' ? 'ਰਵਾਇਤੀ ਤਰੀਕਾ (ਪੁਰਾਣਾ ਅਭਿਆਸ)' : 'Baseline conventional practice'}
            </span>
            <h4 className="panel-crop-heading">{baseline.cropName}</h4>
            <p className="panel-crop-desc">
              {currentLang === 'pa' ? 'ਲਗਾਤਾਰ ਖੜ੍ਹਾ ਪਾਣੀ (ਕੱਦੂ ਕਰਕੇ 5-7cm ਭਰਨਾ)' : 'Continuous flood irrigation (5-7cm puddle)'}
            </p>
          </div>

          <div className="split-specs-list">
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਟਿਊਬਵੈੱਲ ਚੱਲਣ ਦੇ ਘੰਟੇ:' : 'Tube-well run time:'}</span>
              <span className="spec-value tabular-nums">{baseline.tubewellHoursTotal} {currentLang === 'pa' ? 'ਘੰਟੇ' : 'hours'}</span>
            </div>
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਡੀਜ਼ਲ / ਬਿਜਲੀ ਖਰਚਾ:' : 'Fuel / electricity cost:'}</span>
              <span className="spec-value tabular-nums">₹{(baseline.operationalCostInr ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਧਰਤੀ ਹੇਠੋਂ ਕੱਢਿਆ ਪਾਣੀ:' : 'Groundwater pumped:'}</span>
              <span className="spec-value tabular-nums">{(baseline.waterUsedM3Total ?? 0).toLocaleString('en-IN')} m³</span>
            </div>
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਪੱਕਣ ਦਾ ਸਮਾਂ:' : 'Crop maturity period:'}</span>
              <span className="spec-value tabular-nums">{baseline.durationDays} {currentLang === 'pa' ? 'ਦਿਨ' : 'days'}</span>
            </div>
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਪਰਾਲੀ ਦੀ ਸਮੱਸਿਆ:' : 'Stubble management:'}</span>
              <span className="spec-value text-alert">
                {currentLang === 'pa' ? 'ਭਾਰੀ ਪਰਾਲੀ, ਕਣਕ ਬਿਜਾਈ ਲੇਟ' : 'Heavy biomass, delayed wheat sowing'}
              </span>
            </div>
            <div className="split-spec-row split-spec-total">
              <span className="spec-label">{currentLang === 'pa' ? 'ਕਿਸਾਨ ਦੀ ਕਮਾਈ:' : 'Net farm return:'}</span>
              <span className="spec-value tabular-nums font-bold">₹{(baseline.netReturnInr ?? 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="panel-consequence-note text-alert">
            {currentLang === 'pa'
              ? 'ਨੁਕਸਾਨ: ਪਾਣੀ ਦਾ ਪੱਧਰ ਤੇਜ਼ੀ ਨਾਲ ਹੇਠਾਂ ਜਾਂਦਾ ਹੈ, ਮੋਟਰਾਂ ਸੜਦੀਆਂ ਹਨ ਅਤੇ ਡੀਜ਼ਲ ਦਾ ਬੋਝ ਵਧਦਾ ਹੈ।'
              : 'Drawback: Accelerates groundwater depletion, increases pump burnout, and raises fuel costs.'}
          </div>
        </div>

        {/* Right Panel: Winner marked with a green left bar, not a badge */}
        <div className="split-panel panel-recommended winner-green-bar">
          <div className="split-panel-header">
            <span className="panel-category-title text-field">
              {currentLang === 'pa' ? 'ਸਿਫਾਰਸ਼ ਕੀਤਾ ਤਰੀਕਾ (ਨਵਾਂ ਮੁਨਾਫ਼ਾ)' : 'Recommended method'}
            </span>
            <h4 className="panel-crop-heading">{activePlan.cropName}</h4>
            <p className="panel-crop-desc">
              {selectedPlan === 'pr126' 
                ? (currentLang === 'pa' ? 'ਪਾਣੀ-ਪਾਈਪ (AWD) ਨਾਲ ਬਦਲਵੀਂ ਸੁੱਕੀ-ਗਿੱਲੀ ਸਿੰਚਾਈ' : 'Alternate wetting and drying (AWD pani-pipe)')
                : (currentLang === 'pa' ? 'ਅੱਧੇ ਰਕਬੇ ਵਿੱਚ ਮੱਕੀ + ਅੱਧੇ ਵਿੱਚ ਪੀ.ਆਰ.-126' : 'Half area maize + half area PR-126')}
            </p>
          </div>

          <div className="split-specs-list">
            <div className="split-spec-row highlight-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਟਿਊਬਵੈੱਲ ਚੱਲਣ ਦੇ ਘੰਟੇ:' : 'Tube-well run time:'}</span>
              <span className="spec-value tabular-nums font-bold">
                {activePlan.tubewellHoursTotal} {currentLang === 'pa' ? 'ਘੰਟੇ' : 'hours'} ({activePlan.tubewellHoursSaved} {currentLang === 'pa' ? 'ਘੰਟੇ ਬਚੇ' : 'hrs saved'})
              </span>
            </div>
            <div className="split-spec-row highlight-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਡੀਜ਼ਲ / ਬਿਜਲੀ ਖਰਚਾ:' : 'Fuel / electricity cost:'}</span>
              <span className="spec-value tabular-nums font-bold text-field">
                ₹{(activePlan.operationalCostInr ?? 0).toLocaleString('en-IN')} (₹{(activePlan.costSavedInr ?? 0).toLocaleString('en-IN')} {currentLang === 'pa' ? 'ਬਚੇ' : 'saved'})
              </span>
            </div>
            <div className="split-spec-row highlight-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਧਰਤੀ ਹੇਠੋਂ ਕੱਢਿਆ ਪਾਣੀ:' : 'Groundwater pumped:'}</span>
              <span className="spec-value tabular-nums font-bold text-water">
                {(activePlan.waterUsedM3Total ?? 0).toLocaleString('en-IN')} m³ ({activePlan.waterSavedPercent ?? 0}% {currentLang === 'pa' ? 'ਬੱਚਤ' : 'saved'})
              </span>
            </div>
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਪੱਕਣ ਦਾ ਸਮਾਂ:' : 'Crop maturity period:'}</span>
              <span className="spec-value tabular-nums text-field">
                {activePlan.durationDays} {currentLang === 'pa' ? 'ਦਿਨ (ਸਤੰਬਰ ਅਖੀਰ ਕਟਾਈ)' : 'days (late September harvest)'}
              </span>
            </div>
            <div className="split-spec-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਪਰਾਲੀ ਦੀ ਸਥਿਤੀ:' : 'Stubble management:'}</span>
              <span className="spec-value text-field">
                {currentLang === 'pa' ? 'ਘੱਟ ਪਰਾਲੀ, ਕਣਕ ਦੀ ਸਮੇਂ ਸਿਰ ਬਿਜਾਈ' : 'Reduced residue, on-time wheat sowing'}
              </span>
            </div>
            <div className="split-spec-row split-spec-total highlight-row">
              <span className="spec-label">{currentLang === 'pa' ? 'ਕਿਸਾਨ ਦੀ ਕਮਾਈ:' : 'Net farm return:'}</span>
              <span className="spec-value tabular-nums font-bold text-field">
                ₹{(activePlan.netReturnInr ?? 0).toLocaleString('en-IN')} (+₹{((activePlan.netReturnInr ?? 0) - (baseline.netReturnInr ?? 0)).toLocaleString('en-IN')} {currentLang === 'pa' ? 'ਵੱਧ ਮੁਨਾਫ਼ਾ' : 'gain'})
              </span>
            </div>
          </div>

          <div className="panel-consequence-note text-field">
            {currentLang === 'pa'
              ? `ਸਿਫਾਰਸ਼: ${activePlan.keyRecommendationPa}`
              : `Recommendation: ${activePlan.keyRecommendation}`}
          </div>
        </div>
      </div>
    </div>
  );
};
