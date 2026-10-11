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

  const isCritical = analysis.stressLevel === 'CRITICAL' || stageExtraction > 170;
  const isSafe = analysis.stressLevel === 'LOW' && stageExtraction < 70;
  const statusColor = isCritical ? 'var(--alert)' : isSafe ? 'var(--field)' : 'var(--caution)';
  const statusBadgeText = isCritical 
    ? (currentLang === 'pa' ? 'ਗੰਭੀਰ ਸੰਕਟ (Critical)' : 'Critical') 
    : isSafe 
    ? (currentLang === 'pa' ? 'ਸੁਰੱਖਿਅਤ (Safe)' : 'Safe') 
    : (currentLang === 'pa' ? 'ਸਾਵਧਾਨੀ (Caution)' : 'Caution');

  return (
    <div className="panel scorecard-flat-container" style={{
      padding: '24px'
    }}>
      <div className="card-top-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--line)',
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 className="section-title" style={{ margin: 0, color: 'var(--ink)' }}>
              <Activity className="inline-icon text-water" size={20} aria-hidden="true" />
              {currentLang === 'pa' ? 'ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਦਾ ਸੰਕਟ: ' : 'Groundwater Stress Level: '}
              <span>{block.name} (ਲੁਧਿਆਣਾ)</span>
            </h2>
            {liveBlockInfo && (
              <span className="tag" style={{ color: 'var(--water)' }}>
                ✓ CGWB / PWRDA Live
              </span>
            )}
          </div>
          <p className="section-subtitle">
            ਕੇਂਦਰੀ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਬੋਰਡ (CGWB) ਅਤੇ PAU ਲੁਧਿਆਣਾ ਦੇ ਅਸਲ ਮਾਪੇ ਹੋਏ ਅੰਕੜੇ
          </p>
        </div>

        <div className="status-box" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          background: 'var(--bg)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--line)'
        }}>
          <span className="status-label" style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
            ਸੰਕਟ ਸ਼੍ਰੇਣੀ (CGWB Category):
          </span>
          <span className="status-value font-bold tabular-nums" style={{ color: statusColor, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>[{statusBadgeText}]</span>
            <span>{categoryStr}</span>
          </span>
        </div>
      </div>

      <div className="groundwater-layout">
        {/* Big Meter Box */}
        <div className="score-meter-box">
          <span className="meter-label">ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਸੰਕਟ ਸਕੋਰ</span>
          <div className="meter-num-row">
            <span className="meter-big-num tabular-nums text-water">
              {analysis.stressScore}
            </span>
            <span className="meter-max">/ 100</span>
          </div>

          <div className="meter-bar-track">
            <div 
              className="meter-bar-fill" 
              style={{ width: `${analysis.stressScore}%`, backgroundColor: statusColor }}
            />
          </div>

          {analysis.isPauAlarmingDrop && (
            <div className="warning-callout" style={{ color: 'var(--alert)' }}>
              <AlertTriangle size={16} className="text-alert flex-shrink-0" aria-hidden="true" />
              <span>
                <strong>PAU ਚੇਤਾਵਨੀ (Alert):</strong> ਇਸ ਬਲਾਕ ਵਿੱਚ ਪਾਣੀ ਹਰ ਸਾਲ <strong>50 ਸੈਂਟੀਮੀਟਰ ਤੋਂ ਵੱਧ</strong> ਹੇਠਾਂ ਜਾ ਰਿਹਾ ਹੈ!
              </span>
            </div>
          )}

          <div className="bore-life-note">
            <Clock size={14} className="text-water" aria-hidden="true" />
            <span>
              ਮੌਜੂਦਾ ਰਫ਼ਤਾਰ ਨਾਲ ਬੋਰ ਦਾ ਬਚਿਆ ਸਮਾਂ: ~<strong>{analysis.estimatedBoreLifeYears} ਸਾਲ</strong>
            </span>
          </div>
        </div>

        {/* 4 Clear Ground-Truth Cards */}
        <div className="real-factors-grid">
          <div className="real-factor-card">
            <span className="rf-title">ਟਿਊਬਵੈੱਲ ਪਾਣੀ ਦੀ ਡੂੰਘਾਈ</span>
            <div className="rf-val text-water tabular-nums font-bold">
              {waterDepthM} ਮੀਟਰ (~{Math.round(waterDepthM * 3.28)} ਫੁੱਟ)
            </div>
            <p className="rf-desc">
              ਜਗਰਾਓਂ/ਲੁਧਿਆਣਾ ਵਿੱਚ 60-80 ਫੁੱਟ ਤੱਕ ਪਾਣੀ ਸੁੱਕ ਚੁੱਕਾ ਹੈ। ਮੋਟਰਾਂ ਨੂੰ ਡੂੰਘਾ ਉਤਾਰਨਾ ਪੈ ਰਿਹਾ ਹੈ।
            </p>
          </div>

          <div className="real-factor-card">
            <span className="rf-title">ਸਾਲਾਨਾ ਪਾਣੀ ਗਿਰਨ ਦੀ ਦਰ</span>
            <div className="rf-val text-caution tabular-nums font-bold">
              {annualDrop} cm / ਸਾਲ [ਚੇਤਾਵਨੀ / Caution]
            </div>
            <p className="rf-desc">
              ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਅਨੁਸਾਰ 50cm ਤੋਂ ਵੱਧ ਗਿਰਾਵਟ ਖ਼ਤਰਨਾਕ ਹੈ।
            </p>
          </div>

          <div className="real-factor-card">
            <span className="rf-title">ਪਾਣੀ ਕੱਢਣ ਦੀ ਦਰ (Extraction)</span>
            <div className="rf-val text-alert tabular-nums font-bold">
              {stageExtraction}% [ਅਤਿ-ਸ਼ੋਸ਼ਿਤ / Critical]
            </div>
            <p className="rf-desc">
              100 ਲੀਟਰ ਮੀਂਹ ਦੇ ਮੁਕਾਬਲੇ {stageExtraction} ਲੀਟਰ ਪਾਣੀ ਜ਼ਮੀਨ ਵਿੱਚੋਂ ਕੱਢਿਆ ਜਾ ਰਿਹਾ ਹੈ (CGWB Block Report)।
            </p>
          </div>

          <div className="real-factor-card">
            <span className="rf-title">ਟਿਊਬਵੈੱਲ ਨਿਰਭਰਤਾ</span>
            <div className="rf-val text-ink tabular-nums font-bold">
              {100 - block.canalIrrigationSharePercent}% ਟਿਊਬਵੈੱਲ
            </div>
            <p className="rf-desc">
              ਨਹਿਰੀ ਪਾਣੀ ਸਿਰਫ਼ {block.canalIrrigationSharePercent}% ਰਕਬੇ ਵਿੱਚ ਹੈ; ਪ੍ਰਤੀ ਵਰਗ ਕਿਲੋਮੀਟਰ {block.tubewellCountPerSqKm} ਟਿਊਬਵੈੱਲ ਚੱਲ ਰਹੇ ਹਨ।
            </p>
          </div>
        </div>
      </div>

      <div className="observation-strip" style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        backgroundColor: 'var(--bg)',
        border: '1.5px solid var(--line)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '13px',
        color: 'var(--ink)'
      }}>
        <Info size={16} className="text-water flex-shrink-0" aria-hidden="true" />
        <span>
          <strong>ਜ਼ਮੀਨੀ ਹਾਲਤ ({block.name}):</strong> {liveBlockInfo?.description || block.localObservations}
        </span>
      </div>
    </div>
  );
};
