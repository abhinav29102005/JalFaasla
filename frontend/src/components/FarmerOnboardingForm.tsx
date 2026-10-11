import React from 'react';
import { PUNJAB_DISTRICTS, PunjabDistrict, PunjabBlock } from '../data/punjabData';
import { CROPS_DATA } from '../data/cropsData';
import { FarmerAdvisoryInput } from '../utils/advisoryEngine';
import { Language, TRANSLATIONS } from '../data/translations';

interface FarmerOnboardingFormProps {
  currentLang: Language;
  input: FarmerAdvisoryInput;
  onChange: (updated: FarmerAdvisoryInput) => void;
  onApplyPreset: (presetName: 'ludhiana' | 'sangrur' | 'bet') => void;
  isEvaluating?: boolean;
  apiStatus?: 'connected' | 'syncing' | 'offline' | 'error';
  onEvaluateClick?: () => void;
}

export const FarmerOnboardingForm: React.FC<FarmerOnboardingFormProps> = ({
  currentLang,
  input,
  onChange,
  onApplyPreset,
  isEvaluating = false,
  onEvaluateClick,
}) => {
  const t = TRANSLATIONS[currentLang];

  const currentDistrict = PUNJAB_DISTRICTS.find(d => 
    d.blocks.some(b => b.id === input.block.id)
  ) || PUNJAB_DISTRICTS[0];

  const handleDistrictChange = (distId: string) => {
    const dist = PUNJAB_DISTRICTS.find(d => d.id === distId);
    if (dist && dist.blocks.length > 0) {
      const newBlock = dist.blocks[0];
      onChange({
        ...input,
        block: newBlock,
        tubewellDepthM: newBlock.waterTableDepthM,
        soilType: newBlock.soilTypeDefault,
      });
    }
  };

  const handleBlockChange = (blockId: string) => {
    const newBlock = currentDistrict.blocks.find(b => b.id === blockId);
    if (newBlock) {
      onChange({
        ...input,
        block: newBlock,
        tubewellDepthM: newBlock.waterTableDepthM,
        soilType: newBlock.soilTypeDefault,
      });
    }
  };

  // Determine which preset is currently active
  const isLudhianaPreset = input.block.id === 'jagraon' && input.landSizeAcres === 3 && input.currentCropId === 'pusa44';
  const isSangrurPreset = input.block.id === 'sangrur' && input.tubewellDepthM === 32;
  const isBetPreset = input.block.id === 'sidhwan-bet' && input.currentCropId === 'pr121';

  return (
    <div className="onboarding-form-flat">
      {/* Form Header without outer card */}
      <div className="form-header-bar">
        <div>
          <h2 className="form-title">
            {currentLang === 'pa' ? '1. ਖੇਤ ਅਤੇ ਟਿਊਬਵੈੱਲ ਦਾ ਵੇਰਵਾ' : currentLang === 'hi' ? '1. खेत एवं ट्यूबवेल विवरण' : '1. Farm & tube-well details'}
          </h2>
          <p className="form-subtitle">
            {currentLang === 'pa'
              ? 'ਜ਼ਿਲ੍ਹਾ, ਬਲਾਕ, ਟਿਊਬਵੈੱਲ ਦੀ ਡੂੰਘਾਈ ਅਤੇ ਫਸਲ ਚੁਣੋ'
              : currentLang === 'hi'
              ? 'जिला, ब्लॉक, ट्यूबवेल गहराई और फसल चुनें'
              : 'Select district, block, actual tube-well water depth, and planned crop'}
          </p>
        </div>

        {/* Presets as buttons with 5px green inset left bar when selected */}
        <div className="presets-wrapper" role="group" aria-label="Presets">
          <span className="presets-label">
            {currentLang === 'pa' ? 'ਉਦਾਹਰਣਾਂ:' : 'Presets:'}
          </span>
          <div className="presets-button-row">
            <button
              type="button"
              className={`preset-bar-btn ${isLudhianaPreset ? 'selected' : ''}`}
              onClick={() => onApplyPreset('ludhiana')}
            >
              {currentLang === 'pa' ? 'ਲੁਧਿਆਣਾ (ਜਗਰਾਓਂ 18m)' : 'Ludhiana: Jagraon (18m)'}
            </button>
            <button
              type="button"
              className={`preset-bar-btn ${isSangrurPreset ? 'selected' : ''}`}
              onClick={() => onApplyPreset('sangrur')}
            >
              {currentLang === 'pa' ? 'ਸੰਗਰੂਰ (ਡਾਰਕ ਜ਼ੋਨ 32m)' : 'Sangrur: Dark zone (32m)'}
            </button>
            <button
              type="button"
              className={`preset-bar-btn ${isBetPreset ? 'selected' : ''}`}
              onClick={() => onApplyPreset('bet')}
            >
              {currentLang === 'pa' ? 'ਸਿੱਧਵਾਂ ਬੇਟ (ਨਹਿਰੀ 12m)' : 'Sidhwan Bet: Canal belt (12m)'}
            </button>
          </div>
        </div>
      </div>

      <form className="form-fields-grid" onSubmit={e => e.preventDefault()}>
        {/* District */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="district-select">
            {t.district}
          </label>
          <select
            id="district-select"
            className="styled-select"
            value={currentDistrict.id}
            onChange={e => handleDistrictChange(e.target.value)}
          >
            {PUNJAB_DISTRICTS.map((d: PunjabDistrict) => (
              <option key={d.id} value={d.id}>
                {currentLang === 'pa' ? d.namePa : currentLang === 'hi' ? d.nameHi : d.name}
                {d.isLudhianaBelt ? (currentLang === 'pa' ? ' (ਕੇਂਦਰੀ ਪੱਟੀ)' : ' (Central belt)') : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Block */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="block-select">
            {t.block}
          </label>
          <select
            id="block-select"
            className="styled-select"
            value={input.block.id}
            onChange={e => handleBlockChange(e.target.value)}
          >
            {currentDistrict.blocks.map((b: PunjabBlock) => (
              <option key={b.id} value={b.id}>
                {currentLang === 'pa' ? b.namePa : currentLang === 'hi' ? b.nameHi : b.name}
                {` — ${b.waterTableDepthM}m (${b.cgwbCategory})`}
              </option>
            ))}
          </select>
        </div>

        {/* Land Size (Slider + Number input side by side, right-aligned in green) */}
        <div className="input-field-group">
          <div className="label-with-value-row">
            <label className="input-label" htmlFor="land-size-input">
              {t.landSizeAcre}
            </label>
            <span className="field-value-green tabular-nums">
              {input.landSizeAcres} {currentLang === 'pa' ? 'ਏਕੜ' : 'acres'}
            </span>
          </div>
          <div className="slider-number-pair">
            <input
              type="range"
              id="land-size-slider"
              min="1"
              max="25"
              step="0.5"
              value={input.landSizeAcres}
              onChange={e => onChange({ ...input, landSizeAcres: parseFloat(e.target.value) || 1 })}
              className="styled-range-slider"
              aria-label="Land size in acres"
            />
            <input
              type="number"
              id="land-size-input"
              min="0.5"
              max="100"
              step="0.5"
              value={input.landSizeAcres}
              onChange={e => onChange({ ...input, landSizeAcres: Math.max(0.5, parseFloat(e.target.value) || 1) })}
              className="styled-number-input tabular-nums"
            />
          </div>
        </div>

        {/* Tube-Well Depth (Slider + Number input side by side, right-aligned in green) */}
        <div className="input-field-group">
          <div className="label-with-value-row">
            <label className="input-label" htmlFor="tubewell-depth-input">
              {t.tubewellDepthM}
            </label>
            <span className="field-value-green tabular-nums">
              {input.tubewellDepthM} m (~{Math.round(input.tubewellDepthM * 3.28)} ft)
            </span>
          </div>
          <div className="slider-number-pair">
            <input
              type="range"
              id="tubewell-depth-slider"
              min="5"
              max="45"
              step="0.5"
              value={input.tubewellDepthM}
              onChange={e => onChange({ ...input, tubewellDepthM: parseFloat(e.target.value) || 10 })}
              className="styled-range-slider"
              aria-label="Tubewell water depth in meters"
            />
            <input
              type="number"
              id="tubewell-depth-input"
              min="3"
              max="60"
              step="0.5"
              value={input.tubewellDepthM}
              onChange={e => onChange({ ...input, tubewellDepthM: parseFloat(e.target.value) || 10 })}
              className="styled-number-input tabular-nums"
            />
          </div>
        </div>

        {/* Current Crop */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="current-crop-select">
            {t.currentCrop}
          </label>
          <select
            id="current-crop-select"
            className="styled-select"
            value={input.currentCropId}
            onChange={e => onChange({ ...input, currentCropId: e.target.value })}
          >
            {Object.values(CROPS_DATA).map(c => (
              <option key={c.id} value={c.id}>
                {currentLang === 'pa' ? c.namePa : currentLang === 'hi' ? c.nameHi : c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Soil Type */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="soil-type-select">
            {t.soilType}
          </label>
          <select
            id="soil-type-select"
            className="styled-select"
            value={input.soilType}
            onChange={e => onChange({ ...input, soilType: e.target.value })}
          >
            <option value="Sandy Loam">Sandy loam (ਰੇਤਲੀ ਦੋਮਟ)</option>
            <option value="Clayey Loam">Clayey loam (ਚੀਕਣੀ ਦੋਮਟ)</option>
            <option value="Silt Loam">Silt loam (ਗਲਦਾਰ ਦੋਮਟ)</option>
            <option value="Alluvial">Alluvial Sutlej belt (ਬੇਟ ਜਲੋਢ)</option>
          </select>
        </div>

        {/* Pump HP */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="pump-hp-select">
            {t.pumpHp}
          </label>
          <select
            id="pump-hp-select"
            className="styled-select"
            value={input.pumpHp}
            onChange={e => onChange({ ...input, pumpHp: parseFloat(e.target.value) || 10 })}
          >
            <option value="7.5">7.5 HP</option>
            <option value="10">10 HP</option>
            <option value="12.5">12.5 HP</option>
            <option value="15">15 HP</option>
          </select>
        </div>

        {/* Power Source */}
        <div className="input-field-group">
          <label className="input-label">
            {t.powerSource}
          </label>
          <div className="power-source-row" role="group" aria-label="Power source">
            <button
              type="button"
              className={`choice-bar-btn ${input.powerSource === 'diesel' ? 'selected' : ''}`}
              onClick={() => onChange({ ...input, powerSource: 'diesel' })}
            >
              {currentLang === 'pa' ? 'ਡੀਜ਼ਲ (Diesel)' : 'Diesel (@₹88/L)'}
            </button>
            <button
              type="button"
              className={`choice-bar-btn ${input.powerSource === 'electric' ? 'selected' : ''}`}
              onClick={() => onChange({ ...input, powerSource: 'electric' })}
            >
              {currentLang === 'pa' ? 'ਬਿਜਲੀ (Electric)' : 'Electric'}
            </button>
            <button
              type="button"
              className={`choice-bar-btn ${input.powerSource === 'solar' ? 'selected' : ''}`}
              onClick={() => onChange({ ...input, powerSource: 'solar' })}
            >
              {currentLang === 'pa' ? 'ਸੋਲਰ (Solar)' : 'Solar'}
            </button>
          </div>
        </div>

        {/* Irrigation Method */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="irrigation-method-select">
            {t.irrigationMethod}
          </label>
          <select
            id="irrigation-method-select"
            className="styled-select"
            value={input.irrigationMethod}
            onChange={e => onChange({ ...input, irrigationMethod: e.target.value as any })}
          >
            <option value="flooding">
              {currentLang === 'pa' ? 'ਲਗਾਤਾਰ ਖੜ੍ਹਾ ਪਾਣੀ (Conventional flooding)' : 'Conventional continuous flooding (5-7cm)'}
            </option>
            <option value="awd">
              {currentLang === 'pa' ? 'ਬਦਲਵੀਂ ਸਿੰਚਾਈ (AWD pani-pipe - 25% ਬੱਚਤ)' : 'Alternate wetting and drying (AWD pani-pipe)'}
            </option>
            <option value="dsr">
              {currentLang === 'pa' ? 'ਸਿੱਧੀ ਬਿਜਾਈ (DSR tar-wattar)' : 'Direct seeded rice (DSR tar-wattar)'}
            </option>
          </select>
        </div>

        {/* Planned Date */}
        <div className="input-field-group">
          <label className="input-label" htmlFor="planned-date-input">
            {t.plannedDate}
          </label>
          <input
            type="date"
            id="planned-date-input"
            className="styled-select tabular-nums"
            value={input.plannedDate}
            onChange={e => onChange({ ...input, plannedDate: e.target.value })}
          />
          <span className="field-helper-text">
            {currentLang === 'pa'
              ? `ਨੋਟੀਫਾਈਡ ਮਿਤੀ: ${input.block.notifiedTransplantDate}`
              : `Notified date: ${input.block.notifiedTransplantDate}`}
          </span>
        </div>
      </form>

      {/* Primary Action Button (Flat Mustard, 56px high) */}
      <div className="form-action-row">
        <button
          type="button"
          className="btn-primary-mustard"
          onClick={onEvaluateClick}
        >
          {isEvaluating
            ? (currentLang === 'pa' ? 'ਹਿਸਾਬ ਲਗਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...' : 'Evaluating farm...')
            : (currentLang === 'pa' ? 'ਨਵੀਂ ਸਲਾਹ ਅਤੇ ਬੱਚਤ ਵੇਖੋ' : 'Calculate savings & advisory')}
        </button>
      </div>
    </div>
  );
};
