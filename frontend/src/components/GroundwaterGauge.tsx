import React from 'react';
import { PunjabBlock } from '../data/punjabData';
import { GroundwaterAnalysis } from '../utils/groundwaterEngine';
import { Language } from '../data/translations';

interface GroundwaterGaugeProps {
  depthM: number;
  block: PunjabBlock;
  analysis: GroundwaterAnalysis;
  currentLang: Language;
}

export const GroundwaterGauge: React.FC<GroundwaterGaugeProps> = ({
  depthM,
  block,
  analysis,
  currentLang,
}) => {
  const depthFt = (depthM * 3.28084).toFixed(1);

  // SVG coordinate mapping: 0m -> Y=36, 40m -> Y=376 (Span = 340px)
  const svgTop = 36;
  const svgBottom = 376;
  const maxDepthM = 40;
  const clampedDepth = Math.min(maxDepthM, Math.max(0, depthM));
  const waterTableY = svgTop + (clampedDepth / maxDepthM) * (svgBottom - svgTop);
  const pumpInletY = Math.min(svgBottom - 10, waterTableY + 18);

  // Zone display label in sentence case using existing stress-zone analysis
  const zoneLabel = currentLang === 'pa'
    ? analysis.categoryLabelPa
    : currentLang === 'hi'
    ? analysis.categoryLabelHi
    : analysis.categoryLabel.toLowerCase().replace(/^\w/, c => c.toUpperCase());

  const zoneColorClass = analysis.stressLevel === 'CRITICAL'
    ? 'zone-critical'
    : analysis.stressLevel === 'LOW'
    ? 'zone-safe'
    : 'zone-moderate';

  return (
    <aside className="groundwater-gauge-container" aria-label="Groundwater depth gauge">
      {/* Zone Status & Big Depth Readout */}
      <div className="gauge-header">
        <div className="gauge-zone-row">
          <span className={`gauge-zone-pill ${zoneColorClass}`}>
            {zoneLabel}
          </span>
          <span className="gauge-block-name">
            {currentLang === 'pa' ? block.namePa : block.name}
          </span>
        </div>

        <div className="gauge-readout-row">
          <span className="gauge-big-number font-mono">
            {depthM.toFixed(1)} <span className="gauge-unit">m</span>
          </span>
          <span className="gauge-feet-number font-mono">
            (~{depthFt} ft)
          </span>
        </div>
        <p className="gauge-sub-label">
          {currentLang === 'pa' ? 'ਟਿਊਬਵੈੱਲ ਪਾਣੀ ਦਾ ਪੱਧਰ' : 'Observed water table depth'}
        </p>
      </div>

      {/* Cross-Section SVG Soil Profile */}
      <div className="gauge-svg-wrapper">
        <svg
          viewBox="0 0 280 400"
          className="gauge-svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="soilStipple" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="0.6" fill="var(--muted)" opacity="0.3" />
            </pattern>
            <pattern id="sandStipple" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="var(--muted)" opacity="0.4" />
              <circle cx="6" cy="6" r="0.8" fill="var(--muted)" opacity="0.4" />
            </pattern>
          </defs>

          {/* Surface & Sky */}
          <rect x="0" y="0" width="280" height={svgTop} fill="var(--bg)" />

          {/* Soil Layers: Topsoil (0-3m -> Y:36 to 61.5) */}
          <rect x="44" y={svgTop} width="226" height="25.5" fill="var(--soil-topsoil)" />
          <rect x="44" y={svgTop} width="226" height="25.5" fill="url(#soilStipple)" />

          {/* Clay Silt Layer (3-10m -> Y:61.5 to 121) */}
          <rect x="44" y="61.5" width="226" height="59.5" fill="var(--soil-clay)" />

          {/* Sand Alluvium Layer (10-22m -> Y:121 to 223) */}
          <rect x="44" y="121" width="226" height="102" fill="var(--soil-sand)" />
          <rect x="44" y="121" width="226" height="102" fill="url(#sandStipple)" />

          {/* Pale-Teal Deep Aquifer Layer (22-40m -> Y:223 to 380) */}
          <rect x="44" y="223" width="226" height="157" fill="var(--soil-aquifer)" />

          {/* Groundwater Fill below water table */}
          {waterTableY < svgBottom && (
            <rect
              x="44"
              y={waterTableY}
              width="226"
              height={svgBottom - waterTableY}
              fill="var(--water)"
              opacity="0.22"
            />
          )}

          {/* Depth Axis & Tick Marks (0m, 10m, 20m, 30m, 40m) */}
          <line x1="44" y1={svgTop} x2="44" y2={svgBottom} stroke="var(--line)" strokeWidth="1.5" />
          {[0, 10, 20, 30, 40].map(m => {
            const y = svgTop + (m / maxDepthM) * (svgBottom - svgTop);
            return (
              <g key={m}>
                <line x1="36" y1={y} x2="44" y2={y} stroke="var(--line)" strokeWidth="1.5" />
                <text
                  x="30"
                  y={y + 3.5}
                  textAnchor="end"
                  fill="var(--muted)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {m}m
                </text>
              </g>
            );
          })}

          {/* Layer Labels along right boundary */}
          <text x="264" y="52" textAnchor="end" fill="var(--ink)" fontSize="9" opacity="0.6">
            {currentLang === 'pa' ? 'ਉਪਰਲੀ ਮਿੱਟੀ (Topsoil)' : 'Topsoil (0-3m)'}
          </text>
          <text x="264" y="90" textAnchor="end" fill="var(--ink)" fontSize="9" opacity="0.6">
            {currentLang === 'pa' ? 'ਚੀਕਣੀ ਮਿੱਟੀ (Clay)' : 'Clay silt (3-10m)'}
          </text>
          <text x="264" y="170" textAnchor="end" fill="var(--ink)" fontSize="9" opacity="0.6">
            {currentLang === 'pa' ? 'ਰੇਤਲੀ ਦੋਮਟ (Sand)' : 'Sand alluvium (10-22m)'}
          </text>
          <text x="264" y="290" textAnchor="end" fill="var(--water)" fontSize="9" fontWeight="600">
            {currentLang === 'pa' ? 'ਪਾਣੀ ਦਾ ਭੰਡਾਰ (Aquifer)' : 'Deep aquifer (>22m)'}
          </text>

          {/* Surface Ground Line */}
          <line x1="44" y1={svgTop} x2="270" y2={svgTop} stroke="var(--field)" strokeWidth="2.5" />

          {/* Surface Tubewell Pump Head */}
          <rect x="74" y="16" width="18" height="20" rx="2" fill="var(--ink)" />
          <path d="M92 24 L104 24 L104 30 L92 30" fill="none" stroke="var(--ink)" strokeWidth="2" />

          {/* Tubewell Pump Pipe Going Down to Depth */}
          <line
            x1="83"
            y1="36"
            x2="83"
            y2={pumpInletY}
            stroke="var(--ink)"
            strokeWidth="4"
          />

          {/* Submersible Motor Strainer at Pipe Tip */}
          <rect
            x="77"
            y={pumpInletY - 14}
            width="12"
            height="18"
            rx="2"
            fill="var(--ink)"
          />
          {/* Strainer slots */}
          <line x1="79" y1={pumpInletY - 10} x2="87" y2={pumpInletY - 10} stroke="var(--paper)" strokeWidth="1" />
          <line x1="79" y1={pumpInletY - 6} x2="87" y2={pumpInletY - 6} stroke="var(--paper)" strokeWidth="1" />
          <line x1="79" y1={pumpInletY - 2} x2="87" y2={pumpInletY - 2} stroke="var(--paper)" strokeWidth="1" />

          {/* Live Teal Water Table Line */}
          <line
            x1="44"
            y1={waterTableY}
            x2="270"
            y2={waterTableY}
            stroke="var(--water)"
            strokeWidth="3"
            strokeDasharray="4 2"
          />
          {/* Water line indicator pill */}
          <rect
            x="96"
            y={waterTableY - 10}
            width="78"
            height="18"
            rx="4"
            fill="var(--paper)"
            stroke="var(--water)"
            strokeWidth="1.5"
          />
          <text
            x="135"
            y={waterTableY + 2.5}
            textAnchor="middle"
            fill="var(--water)"
            fontSize="10"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            {depthM.toFixed(1)}m water
          </text>
        </svg>
      </div>

      {/* Soil Extraction Note */}
      <div className="gauge-footer-note">
        <span className="gauge-extraction-rate">
          {currentLang === 'pa' ? 'ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਕੱਢਣ ਦੀ ਦਰ:' : 'Extraction ratio:'}{' '}
          <strong>{block.stageOfExtractionPercent}%</strong>
        </span>
        <span className="gauge-drop-rate">
          {currentLang === 'pa' ? 'ਸਾਲਾਨਾ ਗਿਰਾਵਟ:' : 'Annual drop:'}{' '}
          <strong>{block.annualFallCm} cm/yr</strong>
        </span>
      </div>
    </aside>
  );
};
