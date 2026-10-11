import React, { useState } from 'react';
import { 
  Info, 
  Compass 
} from 'lucide-react';

import { PunjabBlock, PUNJAB_DISTRICTS } from '../data/punjabData';
import { Language } from '../data/translations';

interface PunjabGisMapProps {
  currentLang: Language;
  selectedBlock: PunjabBlock;
  onSelectBlock: (block: PunjabBlock) => void;
}

interface MapBlockData {
  id: string;
  name: string;
  namePa: string;
  district: string;
  category: 'Over-Exploited' | 'Critical' | 'Semi-Critical' | 'Safe';
  stagePercent: number;
  depthM: number;
  annualDropCm: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

// Coordinate layout modeling Punjab central alluvial belt & surrounding districts
const MAP_BLOCKS: MapBlockData[] = [
  { id: 'sidhwan-bet', name: 'Sidhwan Bet', namePa: 'ਸਿੱਧਵਾਂ ਬੇਟ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 142, depthM: 12.8, annualDropCm: 38, x: 140, y: 110, width: 95, height: 50, rx: 6 },
  { id: 'jagraon', name: 'Jagraon', namePa: 'ਜਗਰਾਓਂ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 248, depthM: 28.4, annualDropCm: 74, x: 120, y: 170, width: 105, height: 60, rx: 6 },
  { id: 'ludhiana-1', name: 'Ludhiana-1 (East)', namePa: 'ਲੁਧਿਆਣਾ-1 (ਪੂਰਬੀ)', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 194, depthM: 19.1, annualDropCm: 54, x: 235, y: 155, width: 100, height: 55, rx: 6 },
  { id: 'ludhiana-2', name: 'Ludhiana-2 (West)', namePa: 'ਲੁਧਿਆਣਾ-2 (ਪੱਛਮੀ)', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 212, depthM: 22.4, annualDropCm: 61, x: 235, y: 218, width: 100, height: 55, rx: 6 },
  { id: 'raikot', name: 'Raikot', namePa: 'ਰਾਏਕੋਟ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 238, depthM: 26.2, annualDropCm: 68, x: 130, y: 238, width: 95, height: 55, rx: 6 },
  { id: 'dehlon', name: 'Dehlon', namePa: 'ਡੇਹਲੋਂ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 226, depthM: 25.0, annualDropCm: 64, x: 235, y: 280, width: 100, height: 55, rx: 6 },
  { id: 'samrala', name: 'Samrala', namePa: 'ਸਮਰਾਲਾ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 178, depthM: 17.5, annualDropCm: 48, x: 345, y: 150, width: 90, height: 55, rx: 6 },
  { id: 'khanna', name: 'Khanna', namePa: 'ਖੰਨਾ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 205, depthM: 21.0, annualDropCm: 58, x: 345, y: 215, width: 90, height: 60, rx: 6 },
  
  // Surrounding Key Punjab Districts in the Belt
  { id: 'sangrur', name: 'Sangrur / Dhuri', namePa: 'ਸੰਗਰੂਰ / ਧੂਰੀ', district: 'Sangrur', category: 'Over-Exploited', stagePercent: 260, depthM: 34.0, annualDropCm: 82, x: 180, y: 345, width: 130, height: 65, rx: 8 },
  { id: 'jalandhar-east', name: 'Jalandhar East', namePa: 'ਜਲੰਧਰ ਪੂਰਬੀ', district: 'Jalandhar', category: 'Over-Exploited', stagePercent: 182, depthM: 19.5, annualDropCm: 52, x: 140, y: 45, width: 110, height: 55, rx: 6 },
  { id: 'patiala-nabha', name: 'Nabha / Patiala', namePa: 'ਨਾਭਾ / ਪਟਿਆਲਾ', district: 'Patiala', category: 'Over-Exploited', stagePercent: 215, depthM: 27.0, annualDropCm: 66, x: 320, y: 320, width: 115, height: 65, rx: 8 },
  { id: 'hoshiarpur', name: 'Kandi Belt (Hoshiarpur)', namePa: 'ਕੰਢੀ ਇਲਾਕਾ (ਹੁਸ਼ਿਆਰਪੁਰ)', district: 'Hoshiarpur', category: 'Safe', stagePercent: 62, depthM: 8.5, annualDropCm: 15, x: 260, y: 40, width: 130, height: 50, rx: 6 },
  { id: 'moga', name: 'Moga West', namePa: 'ਮੋਗਾ ਪੱਛਮੀ', district: 'Moga', category: 'Over-Exploited', stagePercent: 235, depthM: 29.5, annualDropCm: 76, x: 35, y: 175, width: 78, height: 85, rx: 6 },
];

export const PunjabGisMap: React.FC<PunjabGisMapProps> = ({
  currentLang,
  selectedBlock,
  onSelectBlock,
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<MapBlockData | null>(null);

  const getColor = (category: string) => {
    switch (category) {
      case 'Over-Exploited':
        return 'var(--alert)';
      case 'Critical':
        return '#C25438';
      case 'Semi-Critical':
        return '#8A6D3B';
      case 'Safe':
        return 'var(--field)';
      default:
        return 'var(--muted)';
    }
  };

  const handleBlockClick = (mb: MapBlockData) => {
    for (const dist of PUNJAB_DISTRICTS) {
      const match = dist.blocks.find(b => b.id === mb.id);
      if (match) {
        onSelectBlock(match);
        return;
      }
    }

    const fallbackBlock: PunjabBlock = {
      id: mb.id,
      name: mb.name,
      namePa: mb.namePa,
      nameHi: mb.name,
      waterTableDepthM: mb.depthM,
      annualFallCm: mb.annualDropCm,
      stageOfExtractionPercent: mb.stagePercent,
      cgwbCategory: mb.category,
      soilTypeDefault: 'Sandy Loam',
      notifiedTransplantDate: '2026-06-20',
      transplantGroup: 2,
      canalIrrigationSharePercent: 8,
      tubewellCountPerSqKm: 40,
      majorAquifer: 'Upper Alluvial Quaternary',
      localObservations: `CGWB ground monitoring shows extraction rate of ${mb.stagePercent}%. Water table falling at ${mb.annualDropCm} cm/yr.`,
    };
    onSelectBlock(fallbackBlock);
  };

  return (
    <div className="gis-map-flat-section">
      <div className="card-top-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Compass className="inline-icon text-water" size={20} aria-hidden="true" />
              {currentLang === 'pa' ? 'ਪੰਜਾਬ ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਬਲਾਕ GIS ਨਕਸ਼ਾ' : 'Punjab groundwater GIS map'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg)',
              color: 'var(--muted)',
              border: '1px solid var(--line)'
            }}>
              CGWB 2024–26
            </span>
          </div>
          <p className="section-subtitle">
            {currentLang === 'pa'
              ? 'ਕਿਸੇ ਵੀ ਬਲਾਕ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਪਾਣੀ ਸੰਕਟ ਅਤੇ ਫਸਲ ਸਲਾਹ ਸਿੱਧੀ ਦੇਖੋ'
              : 'Click any Punjab block to view local extraction stage and calculate farm savings'}
          </p>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          background: 'var(--bg)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--line)',
          fontSize: '12px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--alert)' }} />
            {currentLang === 'pa' ? 'ਅਤਿ-ਸ਼ੋਸ਼ਿਤ (>100%)' : 'Over-exploited (>100%)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C25438' }} />
            {currentLang === 'pa' ? 'ਸੰਕਟਮਈ (90-100%)' : 'Critical (90-100%)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--field)' }} />
            {currentLang === 'pa' ? 'ਸੁਰੱਖਿਅਤ (<70%)' : 'Safe (<70%)'}
          </span>
        </div>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        backgroundColor: 'var(--bg)',
        borderRadius: 'var(--radius-md)',
        border: '2px solid var(--line)',
        overflow: 'hidden',
        minHeight: '430px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        {/* SVG Vector Map */}
        <svg 
          viewBox="20 20 440 400" 
          style={{ width: '100%', maxWidth: '780px', height: 'auto' }}
          aria-label="Punjab district map vector"
        >
          {/* Sutlej River stylized path */}
          <path
            d="M 40 105 Q 150 100 240 135 T 420 120"
            fill="none"
            stroke="var(--water)"
            strokeWidth="4"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          <text x="320" y="112" fill="var(--water)" fontSize="10" fontWeight="bold">
            Sutlej River (ਸਤਲੁਜ ਦਰਿਆ)
          </text>

          {/* District boundary grouping lines */}
          <rect
            x="115"
            y="105"
            width="325"
            height="235"
            fill="none"
            stroke="var(--line)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="8"
          />
          <text x="125" y="125" fill="var(--muted)" fontSize="11" fontWeight="bold">
            Ludhiana central belt (ਲੁਧਿਆਣਾ ਕੇਂਦਰੀ ਪੱਟੀ)
          </text>

          {/* Block Rectangles */}
          {MAP_BLOCKS.map(mb => {
            const isSelected = selectedBlock.id === mb.id || selectedBlock.name.toLowerCase().includes(mb.id);
            const isHovered = hoveredBlock?.id === mb.id;
            const fillColor = getColor(mb.category);

            return (
              <g 
                key={mb.id} 
                style={{ cursor: 'pointer' }}
                onClick={() => handleBlockClick(mb)}
                onMouseEnter={() => setHoveredBlock(mb)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                <rect
                  x={mb.x}
                  y={mb.y}
                  width={mb.width}
                  height={mb.height}
                  rx={mb.rx}
                  fill={fillColor}
                  fillOpacity={isSelected ? 0.9 : isHovered ? 0.75 : 0.35}
                  stroke={isSelected ? 'var(--ink)' : isHovered ? 'var(--ink)' : 'var(--line)'}
                  strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                />
                <text
                  x={mb.x + mb.width / 2}
                  y={mb.y + mb.height / 2 - 4}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="11"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {currentLang === 'pa' ? mb.namePa : mb.name}
                </text>
                <text
                  x={mb.x + mb.width / 2}
                  y={mb.y + mb.height / 2 + 11}
                  textAnchor="middle"
                  fill="var(--ink)"
                  fontSize="9.5"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {mb.stagePercent}% | {mb.depthM}m
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selection Detail Box */}
        {(hoveredBlock || selectedBlock) && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: 'var(--paper)',
            border: '2px solid var(--line)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            maxWidth: '280px',
            fontSize: '12px',
            color: 'var(--ink)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '14px' }}>
                {hoveredBlock ? (currentLang === 'pa' ? hoveredBlock.namePa : hoveredBlock.name) : selectedBlock.name}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                color: hoveredBlock?.category === 'Safe' ? 'var(--field)' : 'var(--alert)'
              }}>
                {hoveredBlock ? hoveredBlock.category : selectedBlock.cgwbCategory}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              <div>
                <span style={{ color: 'var(--muted)', fontSize: '10px', display: 'block' }}>Extraction stage</span>
                <span style={{ color: 'var(--alert)', fontWeight: 700, fontSize: '13px' }}>
                  {hoveredBlock ? hoveredBlock.stagePercent : selectedBlock.stageOfExtractionPercent}%
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--muted)', fontSize: '10px', display: 'block' }}>Depth</span>
                <span style={{ color: 'var(--water)', fontWeight: 700, fontSize: '13px' }}>
                  {hoveredBlock ? hoveredBlock.depthM : selectedBlock.waterTableDepthM}m (~{Math.round((hoveredBlock ? hoveredBlock.depthM : selectedBlock.waterTableDepthM) * 3.28)}ft)
                </span>
              </div>
            </div>
            <div style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '11px' }}>
              Annual drop: <strong>{hoveredBlock ? hoveredBlock.annualDropCm : selectedBlock.annualFallCm} cm/yr</strong>
            </div>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '14px',
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
          <strong>CGWB survey note:</strong> Over 115 of Punjab's 150 blocks are classified as over-exploited. Jagraon, Raikot, and Sangrur exceed 200% extraction.
        </span>
      </div>
    </div>
  );
};
