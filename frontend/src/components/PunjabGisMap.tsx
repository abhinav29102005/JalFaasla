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
  { id: 'sidhwan-bet', name: 'Sidhwan Bet', namePa: 'ਸਿੱਧਵਾਂ ਬੇਟ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 142, depthM: 12.8, annualDropCm: 38, x: 140, y: 110, width: 95, height: 50, rx: 8 },
  { id: 'jagraon', name: 'Jagraon', namePa: 'ਜਗਰਾਓਂ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 248, depthM: 28.4, annualDropCm: 74, x: 120, y: 170, width: 105, height: 60, rx: 8 },
  { id: 'ludhiana-1', name: 'Ludhiana-1 (East)', namePa: 'ਲੁਧਿਆਣਾ-1 (ਪੂਰਬੀ)', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 194, depthM: 19.1, annualDropCm: 54, x: 235, y: 155, width: 100, height: 55, rx: 8 },
  { id: 'ludhiana-2', name: 'Ludhiana-2 (West)', namePa: 'ਲੁਧਿਆਣਾ-2 (ਪੱਛਮੀ)', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 212, depthM: 22.4, annualDropCm: 61, x: 235, y: 218, width: 100, height: 55, rx: 8 },
  { id: 'raikot', name: 'Raikot', namePa: 'ਰਾਏਕੋਟ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 238, depthM: 26.2, annualDropCm: 68, x: 130, y: 238, width: 95, height: 55, rx: 8 },
  { id: 'dehlon', name: 'Dehlon', namePa: 'ਡੇਹਲੋਂ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 226, depthM: 25.0, annualDropCm: 64, x: 235, y: 280, width: 100, height: 55, rx: 8 },
  { id: 'samrala', name: 'Samrala', namePa: 'ਸਮਰਾਲਾ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 178, depthM: 17.5, annualDropCm: 48, x: 345, y: 150, width: 90, height: 55, rx: 8 },
  { id: 'khanna', name: 'Khanna', namePa: 'ਖੰਨਾ', district: 'Ludhiana', category: 'Over-Exploited', stagePercent: 205, depthM: 21.0, annualDropCm: 58, x: 345, y: 215, width: 90, height: 60, rx: 8 },
  
  // Surrounding Key Punjab Districts in the Belt
  { id: 'sangrur', name: 'Sangrur / Dhuri', namePa: 'ਸੰਗਰੂਰ / ਧੂਰੀ', district: 'Sangrur', category: 'Over-Exploited', stagePercent: 260, depthM: 34.0, annualDropCm: 82, x: 180, y: 345, width: 130, height: 65, rx: 10 },
  { id: 'jalandhar-east', name: 'Jalandhar East', namePa: 'ਜਲੰਧਰ ਪੂਰਬੀ', district: 'Jalandhar', category: 'Over-Exploited', stagePercent: 182, depthM: 19.5, annualDropCm: 52, x: 140, y: 45, width: 110, height: 55, rx: 8 },
  { id: 'patiala-nabha', name: 'Nabha / Patiala', namePa: 'ਨਾਭਾ / ਪਟਿਆਲਾ', district: 'Patiala', category: 'Over-Exploited', stagePercent: 215, depthM: 27.0, annualDropCm: 66, x: 320, y: 320, width: 115, height: 65, rx: 8 },
  { id: 'hoshiarpur', name: 'Kandi Belt (Hoshiarpur)', namePa: 'ਕੰਢੀ ਇਲਾਕਾ (ਹੁਸ਼ਿਆਰਪੁਰ)', district: 'Hoshiarpur', category: 'Safe', stagePercent: 62, depthM: 8.5, annualDropCm: 15, x: 260, y: 40, width: 130, height: 50, rx: 8 },
  { id: 'moga', name: 'Moga West', namePa: 'ਮੋਗਾ ਪੱਛਮੀ', district: 'Moga', category: 'Over-Exploited', stagePercent: 235, depthM: 29.5, annualDropCm: 76, x: 35, y: 175, width: 78, height: 85, rx: 8 },
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
        return '#ef4444'; // Red
      case 'Critical':
        return '#f97316'; // Orange
      case 'Semi-Critical':
        return '#eab308'; // Amber
      case 'Safe':
        return '#06b6d4'; // Cyan
      default:
        return '#64748b';
    }
  };

  const handleBlockClick = (mb: MapBlockData) => {
    // Find matching block in PUNJAB_DISTRICTS
    for (const dist of PUNJAB_DISTRICTS) {
      const match = dist.blocks.find(b => b.id === mb.id);
      if (match) {
        onSelectBlock(match);
        return;
      }
    }

    // If not found in primary list, create a virtual block representation
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
    <div className="card gis-map-card" style={{ padding: '24px' }}>
      <div className="card-top-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Compass className="section-title-icon text-cyan" size={22} />
              {currentLang === 'pa' ? 'ਪੰਜਾਬ ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਬਲਾਕ GIS ਨਕਸ਼ਾ' : 'Interactive Punjab Groundwater GIS Map'}
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              CGWB 2024-26 Data
            </span>
          </div>
          <p className="section-subtitle">
            {currentLang === 'pa'
              ? 'ਕਿਸੇ ਵੀ ਬਲਾਕ \'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਉਸਦਾ ਪਾਣੀ ਸੰਕਟ ਸਕੋਰ ਅਤੇ ਫਸਲ ਸਲਾਹ ਸਿੱਧੀ ਦੇਖੋ'
              : 'Click any Punjab block to view live groundwater over-extraction stage and calculate farm savings'}
          </p>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444' }} />
            {currentLang === 'pa' ? 'ਅਤਿ-ਸ਼ੋਸ਼ਿਤ (>100%)' : 'Over-Exploited (>100%)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f97316' }} />
            {currentLang === 'pa' ? 'ਸੰਕਟਮਈ (90-100%)' : 'Critical (90-100%)'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06b6d4' }} />
            {currentLang === 'pa' ? 'ਸੁਰੱਖਿਅਤ (<70%)' : 'Safe (<70%)'}
          </span>
        </div>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
        borderRadius: '12px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
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
          style={{ width: '100%', maxWidth: '780px', height: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        >
          {/* Sutlej River stylized path */}
          <path
            d="M 40 105 Q 150 100 240 135 T 420 120"
            fill="none"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="5"
            strokeDasharray="6 4"
          />
          <text x="320" y="112" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.7">
            Sutlej River (ਸਤਲੁਜ ਦਰਿਆ)
          </text>

          {/* District boundary grouping lines */}
          <rect
            x="115"
            y="105"
            width="325"
            height="235"
            fill="rgba(56, 189, 248, 0.03)"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            rx="12"
          />
          <text x="125" y="125" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.6">
            Ludhiana Central Alluvial Belt (ਲੁਧਿਆਣਾ ਕੇਂਦਰੀ ਪੱਟੀ)
          </text>

          {/* Block Rectangles */}
          {MAP_BLOCKS.map(mb => {
            const isSelected = selectedBlock.id === mb.id || selectedBlock.name.toLowerCase().includes(mb.id);
            const isHovered = hoveredBlock?.id === mb.id;
            const fillColor = getColor(mb.category);

            return (
              <g 
                key={mb.id} 
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
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
                  fillOpacity={isSelected ? 0.85 : isHovered ? 0.75 : 0.45}
                  stroke={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : fillColor}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.2}
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.7))' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                <text
                  x={mb.x + mb.width / 2}
                  y={mb.y + mb.height / 2 - 4}
                  textAnchor="middle"
                  fill="#f8fafc"
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
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {mb.stagePercent}% | {mb.depthM}m
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selection Detail Floating Box */}
        {(hoveredBlock || selectedBlock) && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            maxWidth: '280px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '14px' }}>
                {hoveredBlock ? (currentLang === 'pa' ? hoveredBlock.namePa : hoveredBlock.name) : selectedBlock.name}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171'
              }}>
                {hoveredBlock ? hoveredBlock.category : selectedBlock.cgwbCategory}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontFamily: 'monospace' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block' }}>ਪਾਣੀ ਕੱਢਣ ਦੀ ਦਰ (Stage)</span>
                <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>
                  {hoveredBlock ? hoveredBlock.stagePercent : selectedBlock.stageOfExtractionPercent}%
                </span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '10px', display: 'block' }}>ਪਾਣੀ ਡੂੰਘਾਈ (Depth)</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px' }}>
                  {hoveredBlock ? hoveredBlock.depthM : selectedBlock.waterTableDepthM}m (~{Math.round((hoveredBlock ? hoveredBlock.depthM : selectedBlock.waterTableDepthM) * 3.28)}ft)
                </span>
              </div>
            </div>
            <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '11px' }}>
              ਸਾਲਾਨਾ ਗਿਰਾਵਟ: <strong style={{ color: '#fbbf24' }}>{hoveredBlock ? hoveredBlock.annualDropCm : selectedBlock.annualFallCm} cm/ਸਾਲ</strong>
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
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#bae6fd'
      }}>
        <Info size={16} className="text-cyan flex-shrink-0" />
        <span>
          <strong>ਕੇਂਦਰੀ ਭੂਮੀ ਜਲ ਬੋਰਡ (CGWB) ਸਰਵੇਖਣ:</strong> ਪੰਜਾਬ ਦੇ 150 ਵਿੱਚੋਂ 115 ਤੋਂ ਵੱਧ ਬਲਾਕ "ਅਤਿ-ਸ਼ੋਸ਼ਿਤ" (Over-Exploited) ਹਨ। ਜਗਰਾਓਂ, ਰਾਏਕੋਟ, ਅਤੇ ਸੰਗਰੂਰ ਵਿੱਚ ਪਾਣੀ ਕੱਢਣ ਦੀ ਦਰ 200% ਤੋਂ ਵੱਧ ਹੈ।
        </span>
      </div>
    </div>
  );
};
