import { 
  AlertTriangle, 
  Activity, 
  Info, 
  Clock 
} from 'lucide-react';
import { GroundwaterAnalysis } from '../utils/groundwaterEngine';
import { PunjabBlock } from '../data/punjabData';
import { Language } from '../data/translations';

import { GroundwaterBlockInfo } from '../services/api';

interface GroundwaterScorecardProps {
  currentLang: Language;
  block: PunjabBlock;
  analysis: GroundwaterAnalysis;
  liveBlockInfo?: GroundwaterBlockInfo | null;
}

export const GroundwaterScorecard: React.FC<GroundwaterScorecardProps> = ({
  currentLang,
  block,
  analysis,
  liveBlockInfo,
}) => {


  const stageExtraction = liveBlockInfo?.stage_of_extraction_pct ?? block.stageOfExtractionPercent;
  const annualDrop = liveBlockInfo?.annual_water_drop_cm ?? block.annualFallCm;
  const categoryStr = liveBlockInfo?.category ?? (currentLang === 'pa' ? analysis.categoryLabelPa : analysis.categoryLabel);
  const waterDepthM = liveBlockInfo?.avg_water_table_depth_m ?? block.waterTableDepthM;

  return (
    <div className="card scorecard-card">
      <div className="card-top-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Activity className="section-title-icon text-cyan" size={22} />
              {currentLang === 'pa' ? 'ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਦਾ ਸੰਕਟ: ' : 'Groundwater Stress Level: '}
              <span className="text-white">{block.name} (ਲੁਧਿਆਣਾ)</span>
            </h2>
            {liveBlockInfo && (
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                ✓ CGWB / PWRDA Live
              </span>
            )}
          </div>
          <p className="section-subtitle">
            ਕੇਂਦਰੀ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਬੋਰਡ (CGWB) ਅਤੇ PAU ਲੁਧਿਆਣਾ ਦੇ ਅਸਲ ਮਾਪੇ ਹੋਏ ਅੰਕੜੇ
          </p>
        </div>

        <div className="status-box">
          <span className="status-label">ਸੰਕਟ ਸ਼੍ਰੇਣੀ (CGWB Category):</span>
          <span className="status-value text-red font-bold">
            {categoryStr}
          </span>
        </div>
      </div>


      <div className="groundwater-layout">
        {/* Big Meter Box */}
        <div className="score-meter-box">
          <span className="meter-label">ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਸੰਕਟ ਸਕੋਰ</span>
          <div className="meter-num-row">
            <span className="meter-big-num font-mono text-cyan">
              {analysis.stressScore}
            </span>
            <span className="meter-max">/ 100</span>
          </div>

          <div className="meter-bar-track">
            <div 
              className="meter-bar-fill" 
              style={{ width: `${analysis.stressScore}%` }}
            />
          </div>

          {analysis.isPauAlarmingDrop && (
            <div className="warning-callout">
              <AlertTriangle size={16} className="text-amber flex-shrink-0" />
              <span>
                <strong>PAU ਚੇਤਾਵਨੀ:</strong> ਇਸ ਬਲਾਕ ਵਿੱਚ ਪਾਣੀ ਹਰ ਸਾਲ <strong>50 ਸੈਂਟੀਮੀਟਰ ਤੋਂ ਵੱਧ</strong> ਹੇਠਾਂ ਜਾ ਰਿਹਾ ਹੈ!
              </span>
            </div>
          )}

          <div className="bore-life-note">
            <Clock size={14} className="text-cyan" />
            <span>
              ਮੌਜੂਦਾ ਰਫ਼ਤਾਰ ਨਾਲ ਬੋਰ ਦਾ ਬਚਿਆ ਸਮਾਂ: ~<strong>{analysis.estimatedBoreLifeYears} ਸਾਲ</strong>
            </span>
          </div>
        </div>

        {/* 4 Clear Ground-Truth Cards */}
        <div className="real-factors-grid">
          <div className="real-factor-card">
            <span className="rf-title">ਟਿਊਬਵੈੱਲ ਪਾਣੀ ਦੀ ਡੂੰਘਾਈ</span>
            <div className="rf-val text-cyan font-mono font-bold">
              {waterDepthM} ਮੀਟਰ (~{Math.round(waterDepthM * 3.28)} ਫੁੱਟ)
            </div>
            <p className="rf-desc">
              ਜਗਰਾਓਂ/ਲੁਧਿਆਣਾ ਵਿੱਚ 60-80 ਫੁੱਟ ਤੱਕ ਪਾਣੀ ਸੁੱਕ ਚੁੱਕਾ ਹੈ। ਮੋਟਰਾਂ ਨੂੰ ਡੂੰਘਾ ਉਤਾਰਨਾ ਪੈ ਰਿਹਾ ਹੈ।
            </p>
          </div>

          <div className="real-factor-card">
            <span className="rf-title">ਸਾਲਾਨਾ ਪਾਣੀ ਗਿਰਨ ਦੀ ਦਰ</span>
            <div className="rf-val text-amber font-mono font-bold">
              {annualDrop} cm / ਸਾਲ
            </div>
            <p className="rf-desc">
              ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਅਨੁਸਾਰ 50cm ਤੋਂ ਵੱਧ ਗਿਰਾਵਟ ਖ਼ਤਰਨਾਕ ਹੈ।
            </p>
          </div>

          <div className="real-factor-card">
            <span className="rf-title">ਪਾਣੀ ਕੱਢਣ ਦੀ ਦਰ (Extraction)</span>
            <div className="rf-val text-red font-mono font-bold">
              {stageExtraction}%
            </div>
            <p className="rf-desc">
              100 ਲੀਟਰ ਮੀਂਹ ਦੇ ਮੁਕਾਬਲੇ {stageExtraction} ਲੀਟਰ ਪਾਣੀ ਜ਼ਮੀਨ ਵਿੱਚੋਂ ਕੱਢਿਆ ਜਾ ਰਿਹਾ ਹੈ (CGWB Block Report)।
            </p>
          </div>

          <div className="real-factor-card">
            <span className="rf-title">ਟਿਊਬਵੈੱਲ ਨਿਰਭਰਤਾ</span>
            <div className="rf-val text-blue font-mono font-bold">
              {100 - block.canalIrrigationSharePercent}% ਟਿਊਬਵੈੱਲ
            </div>
            <p className="rf-desc">
              ਨਹਿਰੀ ਪਾਣੀ ਸਿਰਫ਼ {block.canalIrrigationSharePercent}% ਰਕਬੇ ਵਿੱਚ ਹੈ; ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ {block.tubewellCountPerSqKm} ਟਿਊਬਵੈੱਲ ਚੱਲ ਰਹੇ ਹਨ।
            </p>
          </div>
        </div>
      </div>

      <div className="observation-strip">
        <Info size={16} className="text-cyan flex-shrink-0" />
        <span>
          <strong>ਜ਼ਮੀਨੀ ਹਾਲਤ ({block.name}):</strong> {liveBlockInfo?.description || block.localObservations}
        </span>
      </div>
    </div>
  );
};
