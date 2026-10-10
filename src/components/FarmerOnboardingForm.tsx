import React from 'react';
import { 
  MapPin, 
  Layers, 
  Gauge, 
  Zap, 
  Calendar, 
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { PUNJAB_DISTRICTS, PunjabDistrict, PunjabBlock } from '../data/punjabData';
import { CROPS_DATA } from '../data/cropsData';
import { FarmerAdvisoryInput } from '../utils/advisoryEngine';
import { Language, TRANSLATIONS } from '../data/translations';

interface FarmerOnboardingFormProps {
  currentLang: Language;
  input: FarmerAdvisoryInput;
  onChange: (updated: FarmerAdvisoryInput) => void;
  onApplyPreset: (presetName: 'ludhiana' | 'sangrur' | 'bet') => void;
}

export const FarmerOnboardingForm: React.FC<FarmerOnboardingFormProps> = ({
  currentLang,
  input,
  onChange,
  onApplyPreset,
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

  return (
    <div className="card onboarding-card">
      <div className="form-header-row">
        <div>
          <h2 className="section-title">
            <MapPin className="section-title-icon text-blue" size={22} />
            {currentLang === 'pa' ? '1. ਖੇਤ ਅਤੇ ਟਿਊਬਵੈੱਲ ਦੀ ਜਾਣਕਾਰੀ' : currentLang === 'hi' ? '1. खेत एवं ट्यूबवेल विवरण' : '1. Enter Farm & Tube-Well Details'}
          </h2>
          <p className="section-subtitle">
            {currentLang === 'pa'
              ? 'ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ, ਪਿੰਡ ਦਾ ਬਲਾਕ, ਟਿਊਬਵੈੱਲ ਦੀ ਡੂੰਘਾਈ ਅਤੇ ਫਸਲ ਚੁਣੋ'
              : 'Select your Punjab district, block, actual tube-well water depth and crop plan'}
          </p>
        </div>

        {/* Real-World Quick Scenarios */}
        <div className="presets-block">
          <span className="presets-title">
            {currentLang === 'pa' ? 'ਅਸਲ ਪੰਜਾਬ ਉਦਾਹਰਣਾਂ:' : 'Real Punjab Scenarios:'}
          </span>
          <div className="presets-group">
            <button
              type="button"
              className="preset-button preset-primary"
              onClick={() => onApplyPreset('ludhiana')}
            >
              🌾 {currentLang === 'pa' ? 'ਲੁਧਿਆਣਾ (ਜਗਰਾਓਂ 18m ਟਿਊਬਵੈੱਲ)' : 'Ludhiana: Jagraon (18m Tube-well)'}
            </button>
            <button
              type="button"
              className="preset-button"
              onClick={() => onApplyPreset('sangrur')}
            >
              ⚠️ {currentLang === 'pa' ? 'ਸੰਗਰੂਰ (32m ਡੂੰਘਾ ਡਾਰਕ ਜ਼ੋਨ)' : 'Sangrur: Deep Dark Zone (32m)'}
            </button>
            <button
              type="button"
              className="preset-button"
              onClick={() => onApplyPreset('bet')}
            >
              💧 {currentLang === 'pa' ? 'ਸਿੱਧਵਾਂ ਬੇਟ (12m ਨਹਿਰੀ ਇਲਾਕਾ)' : 'Sidhwan Bet: Canal Belt (12m)'}
            </button>
          </div>
        </div>
      </div>

      <form className="form-grid" onSubmit={e => e.preventDefault()}>
        {/* District */}
        <div className="form-field">
          <label className="field-label" htmlFor="district-select">
            {t.district} (ਜ਼ਿਲ੍ਹਾ)
          </label>
          <select
            id="district-select"
            className="field-input"
            value={currentDistrict.id}
            onChange={e => handleDistrictChange(e.target.value)}
          >
            {PUNJAB_DISTRICTS.map((d: PunjabDistrict) => (
              <option key={d.id} value={d.id}>
                {currentLang === 'pa' ? d.namePa : currentLang === 'hi' ? d.nameHi : d.name}
                {d.isLudhianaBelt ? ' (ਕੇਂਦਰੀ ਪੱਟੀ / Central Belt)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Block */}
        <div className="form-field">
          <label className="field-label" htmlFor="block-select">
            {t.block} (ਤਹਿਸੀਲ / ਬਲਾਕ)
          </label>
          <select
            id="block-select"
            className="field-input"
            value={input.block.id}
            onChange={e => handleBlockChange(e.target.value)}
          >
            {currentDistrict.blocks.map((b: PunjabBlock) => (
              <option key={b.id} value={b.id}>
                {currentLang === 'pa' ? b.namePa : currentLang === 'hi' ? b.nameHi : b.name} 
                {` — ਪਾਣੀ: ${b.waterTableDepthM}m (${b.cgwbCategory})`}
              </option>
            ))}
          </select>
        </div>

        {/* Land Size */}
        <div className="form-field">
          <div className="field-label-split">
            <label className="field-label" htmlFor="land-size-input">
              {t.landSizeAcre} (ਜ਼ਮੀਨ ਏਕੜ ਵਿੱਚ)
            </label>
            <span className="field-highlight-num">
              {input.landSizeAcres} ਏਕੜ (Acres)
            </span>
          </div>
          <div className="slider-input-group">
            <input
              type="range"
              id="land-size-slider"
              min="1"
              max="25"
              step="0.5"
              value={input.landSizeAcres}
              onChange={e => onChange({ ...input, landSizeAcres: parseFloat(e.target.value) || 1 })}
              className="styled-slider"
            />
            <input
              type="number"
              id="land-size-input"
              min="0.5"
              max="100"
              step="0.5"
              value={input.landSizeAcres}
              onChange={e => onChange({ ...input, landSizeAcres: Math.max(0.5, parseFloat(e.target.value) || 1) })}
              className="field-input field-input-small font-mono"
            />
          </div>
        </div>

        {/* Tube-well depth */}
        <div className="form-field">
          <div className="field-label-split">
            <label className="field-label" htmlFor="tubewell-depth-input">
              <Gauge size={15} className="inline-icon text-blue" />
              {t.tubewellDepthM} (ਟਿਊਬਵੈੱਲ ਪਾਣੀ ਦਾ ਪੱਧਰ)
            </label>
            <span className="field-highlight-num text-cyan">
              {input.tubewellDepthM} ਮੀਟਰ (~{Math.round(input.tubewellDepthM * 3.28)} ਫੁੱਟ)
            </span>
          </div>
          <div className="slider-input-group">
            <input
              type="range"
              id="tubewell-depth-slider"
              min="5"
              max="45"
              step="0.5"
              value={input.tubewellDepthM}
              onChange={e => onChange({ ...input, tubewellDepthM: parseFloat(e.target.value) || 10 })}
              className="styled-slider"
            />
            <input
              type="number"
              id="tubewell-depth-input"
              min="3"
              max="60"
              step="0.5"
              value={input.tubewellDepthM}
              onChange={e => onChange({ ...input, tubewellDepthM: parseFloat(e.target.value) || 10 })}
              className="field-input field-input-small font-mono"
            />
          </div>
        </div>

        {/* Current Crop */}
        <div className="form-field">
          <label className="field-label" htmlFor="current-crop-select">
            {t.currentCrop} (ਮੌਜੂਦਾ ਬੀਜੀ ਜਾਣ ਵਾਲੀ ਕਿਸਮ)
          </label>
          <select
            id="current-crop-select"
            className="field-input"
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
        <div className="form-field">
          <label className="field-label" htmlFor="soil-type-select">
            <Layers size={15} className="inline-icon text-blue" />
            {t.soilType} (ਜ਼ਮੀਨ / ਮਿੱਟੀ)
          </label>
          <select
            id="soil-type-select"
            className="field-input"
            value={input.soilType}
            onChange={e => onChange({ ...input, soilType: e.target.value })}
          >
            <option value="Sandy Loam">ਰੇਤਲੀ ਦੋਮਟ (Sandy Loam - ਲੁਧਿਆਣਾ ਵਿੱਚ ਆਮ)</option>
            <option value="Clayey Loam">ਚੀਕਣੀ ਦੋਮਟ (Clayey Loam - ਪਾਣੀ ਰੋਕੂ)</option>
            <option value="Silt Loam">ਗਲਦਾਰ ਦੋਮਟ (Silt Loam)</option>
            <option value="Alluvial">ਬੇਟ ਜਲੋਢ (Alluvial Sutlej Belt)</option>
          </select>
        </div>

        {/* Pump Motor HP */}
        <div className="form-field">
          <label className="field-label" htmlFor="pump-hp-select">
            <Zap size={15} className="inline-icon text-amber" />
            {t.pumpHp} (ਸਬਮਰਸੀਬਲ ਮੋਟਰ ਦੀ ਪਾਵਰ)
          </label>
          <select
            id="pump-hp-select"
            className="field-input"
            value={input.pumpHp}
            onChange={e => onChange({ ...input, pumpHp: parseFloat(e.target.value) || 10 })}
          >
            <option value="7.5">7.5 HP (ਸ਼ੈਲੋ ਬੋਰ ਮੋਟਰ)</option>
            <option value="10">10 HP (ਲੁਧਿਆਣਾ ਆਮ ਟਿਊਬਵੈੱਲ ~28 m³/ਘੰਟਾ)</option>
            <option value="12.5">12.5 HP (ਡੂੰਘਾ ਬੋਰ)</option>
            <option value="15">15 HP (ਵੱਡਾ ਡਿਸਚਾਰਜ ਡੂੰਘੀ ਮੋਟਰ)</option>
          </select>
        </div>

        {/* Power Source */}
        <div className="form-field">
          <label className="field-label">
            {t.powerSource} (ਪਾਵਰ ਦਾ ਸਾਧਨ)
          </label>
          <div className="button-choice-row">
            <button
              type="button"
              className={`choice-btn ${input.powerSource === 'diesel' ? 'active' : ''}`}
              onClick={() => onChange({ ...input, powerSource: 'diesel' })}
            >
              🛢️ ਡੀਜ਼ਲ ਪੰਪ (Diesel @₹88/L)
            </button>
            <button
              type="button"
              className={`choice-btn ${input.powerSource === 'electric' ? 'active' : ''}`}
              onClick={() => onChange({ ...input, powerSource: 'electric' })}
            >
              ⚡ ਬਿਜਲੀ ਟਿਊਬਵੈੱਲ (Electric)
            </button>
            <button
              type="button"
              className={`choice-btn ${input.powerSource === 'solar' ? 'active' : ''}`}
              onClick={() => onChange({ ...input, powerSource: 'solar' })}
            >
              ☀️ ਸੋਲਰ ਪੰਪ (Solar)
            </button>
          </div>
        </div>

        {/* Irrigation Method */}
        <div className="form-field">
          <label className="field-label" htmlFor="irrigation-method-select">
            <Droplets size={15} className="inline-icon text-blue" />
            {t.irrigationMethod} (ਸਿੰਚਾਈ ਦਾ ਤਰੀਕਾ)
          </label>
          <select
            id="irrigation-method-select"
            className="field-input"
            value={input.irrigationMethod}
            onChange={e => onChange({ ...input, irrigationMethod: e.target.value as any })}
          >
            <option value="flooding">ਲਗਾਤਾਰ ਖੜ੍ਹਾ ਪਾਣੀ (Conventional Flooding 5-7cm)</option>
            <option value="awd">ਬਦਲਵੀਂ ਸੁੱਕੀ-ਗਿੱਲੀ ਸਿੰਚਾਈ (AWD Pani-Pipe - 25% ਬੱਚਤ)</option>
            <option value="dsr">ਸਿੱਧੀ ਬਿਜਾਈ ਝੋਨਾ (DSR Tar-Wattar)</option>
          </select>
        </div>

        {/* Planned Date */}
        <div className="form-field">
          <label className="field-label" htmlFor="planned-date-input">
            <Calendar size={15} className="inline-icon text-blue" />
            {t.plannedDate} (ਝੋਨਾ ਲਾਉਣ ਦੀ ਸੋਚੀ ਹੋਈ ਮਿਤੀ)
          </label>
          <input
            type="date"
            id="planned-date-input"
            className="field-input font-mono"
            value={input.plannedDate}
            onChange={e => onChange({ ...input, plannedDate: e.target.value })}
          />
          <div className="field-note">
            ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਮਿਤੀ: <strong>{input.block.notifiedTransplantDate}</strong> (ਲੁਧਿਆਣਾ ਕੇਂਦਰੀ ਪੱਟੀ)
          </div>
        </div>
      </form>
    </div>
  );
};
