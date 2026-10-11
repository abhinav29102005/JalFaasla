import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Compass, 
  Layers, 
  RotateCcw, 
  MapPin, 
  Waves
} from "lucide-react";

import { PunjabBlock, PUNJAB_DISTRICTS } from "../data/punjabData";
import { Language } from "../data/translations";

interface PunjabGisMapProps {
  currentLang: Language;
  selectedBlock: PunjabBlock;
  onSelectBlock: (block: PunjabBlock) => void;
}

interface GisBlockLocation {
  id: string;
  name: string;
  namePa: string;
  district: string;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // Boundary catchment polygon
  category: "Over-Exploited" | "Critical" | "Semi-Critical" | "Safe";
  stagePercent: number;
  depthM: number;
  annualDropCm: number;
  tubewellsPerSqKm: number;
}

// True geographic coordinates for Central Punjab Alluvial Belt & surrounding agricultural blocks
const GIS_BLOCKS: GisBlockLocation[] = [
  // --- Ludhiana Central Belt ---
  {
    id: "jagraon",
    name: "Jagraon",
    namePa: "ਜਗਰਾਓਂ",
    district: "Ludhiana",
    center: [30.7853, 75.4740],
    polygon: [
      [30.85, 75.38], [30.86, 75.54], [30.77, 75.58], [30.71, 75.51], [30.72, 75.39]
    ],
    category: "Over-Exploited",
    stagePercent: 188,
    depthM: 18.4,
    annualDropCm: 53,
    tubewellsPerSqKm: 42
  },
  {
    id: "sidhwan-bet",
    name: "Sidhwan Bet",
    namePa: "ਸਿੱਧਵਾਂ ਬੇਟ",
    district: "Ludhiana",
    center: [30.9312, 75.5215],
    polygon: [
      [30.98, 75.42], [30.99, 75.62], [30.92, 75.60], [30.88, 75.48], [30.91, 75.41]
    ],
    category: "Critical",
    stagePercent: 132,
    depthM: 12.8,
    annualDropCm: 36,
    tubewellsPerSqKm: 32
  },
  {
    id: "ludhiana-1",
    name: "Ludhiana-1 (East)",
    namePa: "ਲੁਧਿਆਣਾ-1 (ਪੂਰਬੀ)",
    district: "Ludhiana",
    center: [30.9110, 75.9100],
    polygon: [
      [30.97, 75.84], [30.98, 75.99], [30.88, 76.01], [30.85, 75.86]
    ],
    category: "Over-Exploited",
    stagePercent: 194,
    depthM: 19.1,
    annualDropCm: 54,
    tubewellsPerSqKm: 48
  },
  {
    id: "ludhiana-2",
    name: "Ludhiana-2 (West)",
    namePa: "ਲੁਧਿਆਣਾ-2 (ਪੱਛਮੀ)",
    district: "Ludhiana",
    center: [30.8700, 75.7900],
    polygon: [
      [30.93, 75.72], [30.94, 75.85], [30.83, 75.87], [30.81, 75.73]
    ],
    category: "Over-Exploited",
    stagePercent: 215,
    depthM: 21.6,
    annualDropCm: 59,
    tubewellsPerSqKm: 51
  },
  {
    id: "dehlon",
    name: "Dehlon",
    namePa: "ਡੇਹਲੋਂ",
    district: "Ludhiana",
    center: [30.7686, 75.8756],
    polygon: [
      [30.83, 75.80], [30.83, 75.95], [30.72, 75.96], [30.71, 75.81]
    ],
    category: "Over-Exploited",
    stagePercent: 238,
    depthM: 24.3,
    annualDropCm: 64,
    tubewellsPerSqKm: 56
  },
  {
    id: "khanna",
    name: "Khanna",
    namePa: "ਖੰਨਾ",
    district: "Ludhiana",
    center: [30.7027, 76.2163],
    polygon: [
      [30.77, 76.13], [30.78, 76.29], [30.65, 76.30], [30.64, 76.14]
    ],
    category: "Over-Exploited",
    stagePercent: 192,
    depthM: 19.8,
    annualDropCm: 55,
    tubewellsPerSqKm: 45
  },
  {
    id: "samrala",
    name: "Samrala",
    namePa: "ਸਮਰਾਲਾ",
    district: "Ludhiana",
    center: [30.8359, 76.1927],
    polygon: [
      [30.90, 76.11], [30.91, 76.27], [30.79, 76.28], [30.78, 76.12]
    ],
    category: "Over-Exploited",
    stagePercent: 165,
    depthM: 16.7,
    annualDropCm: 48,
    tubewellsPerSqKm: 38
  },
  {
    id: "doraha",
    name: "Doraha",
    namePa: "ਦੋਰਾਹਾ",
    district: "Ludhiana",
    center: [30.8038, 76.0270],
    polygon: [
      [30.86, 75.96], [30.87, 76.11], [30.75, 76.11], [30.74, 75.96]
    ],
    category: "Over-Exploited",
    stagePercent: 172,
    depthM: 17.6,
    annualDropCm: 49,
    tubewellsPerSqKm: 40
  },
  {
    id: "raikot",
    name: "Raikot",
    namePa: "ਰਾਏਕੋਟ",
    district: "Ludhiana",
    center: [30.6508, 75.6022],
    polygon: [
      [30.72, 75.52], [30.72, 75.68], [30.58, 75.68], [30.58, 75.53]
    ],
    category: "Over-Exploited",
    stagePercent: 218,
    depthM: 22.4,
    annualDropCm: 61,
    tubewellsPerSqKm: 49
  },
  {
    id: "sudhar",
    name: "Sudhar",
    namePa: "ਸੁਧਾਰ",
    district: "Ludhiana",
    center: [30.7554, 75.6601],
    polygon: [
      [30.81, 75.59], [30.81, 75.74], [30.70, 75.74], [30.70, 75.60]
    ],
    category: "Over-Exploited",
    stagePercent: 186,
    depthM: 19.3,
    annualDropCm: 53,
    tubewellsPerSqKm: 44
  },
  {
    id: "machhiwara",
    name: "Machhiwara",
    namePa: "ਮਾਛੀਵਾੜਾ",
    district: "Ludhiana",
    center: [30.9125, 76.2005],
    polygon: [
      [30.98, 76.12], [30.99, 76.28], [30.88, 76.28], [30.87, 76.13]
    ],
    category: "Critical",
    stagePercent: 148,
    depthM: 14.5,
    annualDropCm: 41,
    tubewellsPerSqKm: 35
  },
  {
    id: "pakhowal",
    name: "Pakhowal",
    namePa: "ਪੱਖੋਵਾਲ",
    district: "Ludhiana",
    center: [30.6974, 75.7691],
    polygon: [
      [30.76, 75.70], [30.76, 75.84], [30.64, 75.85], [30.63, 75.71]
    ],
    category: "Over-Exploited",
    stagePercent: 204,
    depthM: 20.8,
    annualDropCm: 58,
    tubewellsPerSqKm: 47
  },

  // --- Surrounding Key Punjab Agricultural Blocks ---
  {
    id: "sangrur-central",
    name: "Sangrur / Dhuri",
    namePa: "ਸੰਗਰੂਰ / ਧੂਰੀ",
    district: "Sangrur",
    center: [30.2858, 75.8421],
    polygon: [
      [30.40, 75.74], [30.40, 75.95], [30.20, 75.95], [30.20, 75.74]
    ],
    category: "Over-Exploited",
    stagePercent: 284,
    depthM: 32.4,
    annualDropCm: 76,
    tubewellsPerSqKm: 62
  },
  {
    id: "jalandhar-east",
    name: "Jalandhar East",
    namePa: "ਜਲੰਧਰ ਪੂਰਬੀ",
    district: "Jalandhar",
    center: [31.3260, 75.5762],
    polygon: [
      [31.42, 75.48], [31.43, 75.68], [31.25, 75.68], [31.24, 75.48]
    ],
    category: "Over-Exploited",
    stagePercent: 182,
    depthM: 19.5,
    annualDropCm: 52,
    tubewellsPerSqKm: 45
  },
  {
    id: "moga-1",
    name: "Moga West",
    namePa: "ਮੋਗਾ ਪੱਛਮੀ",
    district: "Moga",
    center: [30.8165, 75.1717],
    polygon: [
      [30.90, 75.05], [30.91, 75.28], [30.72, 75.28], [30.71, 75.06]
    ],
    category: "Over-Exploited",
    stagePercent: 235,
    depthM: 29.5,
    annualDropCm: 76,
    tubewellsPerSqKm: 54
  },
  {
    id: "hoshiarpur-1",
    name: "Kandi Belt (Hoshiarpur)",
    namePa: "ਕੰਢੀ ਇਲਾਕਾ (ਹੁਸ਼ਿਆਰਪੁਰ)",
    district: "Hoshiarpur",
    center: [31.5273, 75.9149],
    polygon: [
      [31.62, 75.78], [31.65, 76.05], [31.42, 76.05], [31.40, 75.80]
    ],
    category: "Safe",
    stagePercent: 62,
    depthM: 8.5,
    annualDropCm: 15,
    tubewellsPerSqKm: 18
  }
];

// Sutlej River path across northern Punjab
const SUTLEJ_RIVER_COORDS: [number, number][] = [
  [31.28, 76.53],
  [31.18, 76.32],
  [31.11, 76.15],
  [30.99, 75.85],
  [30.95, 75.54],
  [30.96, 75.32],
  [31.14, 74.96]
];

// Major Sirhind Canal Network
const SIRHIND_CANAL_COORDS: [number, number][] = [
  [31.02, 76.45],
  [30.84, 76.22],
  [30.73, 75.96],
  [30.56, 75.60],
  [30.35, 75.25]
];

export const PunjabGisMap: React.FC<PunjabGisMapProps> = ({
  currentLang,
  selectedBlock,
  onSelectBlock,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.FeatureGroup | null>(null);
  const polygonsMapRef = useRef<Map<string, L.Polygon>>(new Map());

  const [activeTileLayer, setActiveTileLayer] = useState<"light" | "satellite" | "osm">("light");
  const [hoveredBlock, setHoveredBlock] = useState<GisBlockLocation | null>(null);

  const currentGisBlock = GIS_BLOCKS.find(b => b.id === selectedBlock.id) || 
    GIS_BLOCKS.find(b => b.name.toLowerCase().includes(selectedBlock.name.toLowerCase())) ||
    GIS_BLOCKS[0];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Over-Exploited": return "#DC2626";
      case "Critical": return "#EA580C";
      case "Semi-Critical": return "#D97706";
      case "Safe": return "#16A34A";
      default: return "#DC2626";
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [30.82, 75.75],
      zoom: 9,
      minZoom: 8,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    L.control.zoom({ position: "topright" }).addTo(map);

    const baseTile = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    });
    baseTile.addTo(map);

    const featureGroup = L.featureGroup().addTo(map);
    layersGroupRef.current = featureGroup;

    // Sutlej River
    const sutlejPolyline = L.polyline(SUTLEJ_RIVER_COORDS, {
      color: "#0284C7",
      weight: 5,
      opacity: 0.85,
    }).addTo(featureGroup);

    sutlejPolyline.bindTooltip(
      "<strong>🌊 Sutlej River (ਸਤਲੁਜ ਦਰਿਆ)</strong><br/><span style='font-size:11px;'>Northern Groundwater Recharge River</span>",
      { sticky: true, className: "gis-river-tooltip" }
    );

    // Sirhind Canal
    const canalPolyline = L.polyline(SIRHIND_CANAL_COORDS, {
      color: "#0EA5E9",
      weight: 2.5,
      opacity: 0.7,
      dashArray: "6, 6",
    }).addTo(featureGroup);

    canalPolyline.bindTooltip(
      "<strong>Sirhind Canal (ਸਰਹਿੰਦ ਨਹਿਰ)</strong><br/><span style='font-size:11px;'>Primary Irrigation Canal Network</span>",
      { sticky: true, className: "gis-river-tooltip" }
    );

    // Block Polygons & Markers
    GIS_BLOCKS.forEach(block => {
      const isSelected = block.id === selectedBlock.id;
      const catColor = getCategoryColor(block.category);

      const polygon = L.polygon(block.polygon, {
        color: isSelected ? "#E7B422" : catColor,
        weight: isSelected ? 3.5 : 1.5,
        fillColor: catColor,
        fillOpacity: isSelected ? 0.45 : 0.28,
        dashArray: isSelected ? "4, 4" : undefined,
      }).addTo(featureGroup);

      polygonsMapRef.current.set(block.id, polygon);

      const labelIcon = L.divIcon({
        className: "custom-gis-block-pin",
        html: `
          <div class="gis-pin-bubble ${isSelected ? "selected" : ""}" style="border-color: ${catColor};">
            <span class="pin-name">${currentLang === "pa" ? block.namePa : block.name}</span>
            <span class="pin-stat ${block.category.toLowerCase().replace(/[^a-z]/g, "-")}">${block.stagePercent}%</span>
          </div>
        `,
        iconSize: [100, 36],
        iconAnchor: [50, 18],
      });

      const marker = L.marker(block.center, { icon: labelIcon }).addTo(featureGroup);

      const tooltipContent = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="font-size: 13px; color: #1E293B;">${block.name} (${block.namePa})</strong><br/>
          <span style="color: #64748B;">District: ${block.district}</span><br/>
          <div style="margin-top: 4px; padding: 4px 6px; background: #F1F5F9; border-radius: 4px;">
            Extraction: <strong style="color: ${catColor};">${block.stagePercent}%</strong> (${block.category})<br/>
            Water Depth: <strong>${block.depthM} m</strong> (~${Math.round(block.depthM * 3.28)} ft)<br/>
            Annual Decline: <strong style="color: #B91C1C;">-${block.annualDropCm} cm/yr</strong>
          </div>
          <span style="font-size: 11px; color: #059669; font-weight: 600; display: block; margin-top: 4px;">
            👉 Click to select this block for advisory
          </span>
        </div>
      `;

      polygon.bindTooltip(tooltipContent, { sticky: true, opacity: 0.95 });
      marker.bindTooltip(tooltipContent, { sticky: true, opacity: 0.95 });

      const handleSelect = () => {
        let matched: PunjabBlock | undefined;
        for (const dist of PUNJAB_DISTRICTS) {
          const found = dist.blocks.find(b => b.id === block.id || b.name.toLowerCase() === block.name.toLowerCase());
          if (found) {
            matched = found;
            break;
          }
        }

        if (matched) {
          onSelectBlock(matched);
        } else {
          onSelectBlock({
            id: block.id,
            name: block.name,
            namePa: block.namePa,
            nameHi: block.name,
            waterTableDepthM: block.depthM,
            annualFallCm: block.annualDropCm,
            stageOfExtractionPercent: block.stagePercent,
            cgwbCategory: block.category,
            soilTypeDefault: "Sandy Loam",
            notifiedTransplantDate: "2026-06-20",
            transplantGroup: 2,
            canalIrrigationSharePercent: 8,
            tubewellCountPerSqKm: block.tubewellsPerSqKm,
            majorAquifer: "Upper Alluvial Belt",
            localObservations: `CGWB 2024 survey indicates stage of extraction at ${block.stagePercent}%.`
          });
        }

        map.flyTo(block.center, 10.5, { duration: 0.8 });
      };

      polygon.on("click", handleSelect);
      marker.on("click", handleSelect);

      polygon.on("mouseover", () => setHoveredBlock(block));
      polygon.on("mouseout", () => setHoveredBlock(null));
      marker.on("mouseover", () => setHoveredBlock(block));
      marker.on("mouseout", () => setHoveredBlock(null));
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    GIS_BLOCKS.forEach(block => {
      const polygon = polygonsMapRef.current.get(block.id);
      if (!polygon) return;

      const isSelected = block.id === selectedBlock.id || 
                         block.name.toLowerCase().includes(selectedBlock.name.toLowerCase());
      const catColor = getCategoryColor(block.category);

      polygon.setStyle({
        color: isSelected ? "#E7B422" : catColor,
        weight: isSelected ? 3.5 : 1.5,
        fillOpacity: isSelected ? 0.45 : 0.28,
        dashArray: isSelected ? "4, 4" : undefined,
      });
    });
  }, [selectedBlock]);

  const handleTileSwitch = (layerKey: "light" | "satellite" | "osm") => {
    if (!mapInstanceRef.current) return;
    setActiveTileLayer(layerKey);

    mapInstanceRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    let newUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    if (layerKey === "satellite") {
      newUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}";
    } else if (layerKey === "osm") {
      newUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }

    L.tileLayer(newUrl, { maxZoom: 18 }).addTo(mapInstanceRef.current);
    layersGroupRef.current?.bringToFront();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([30.82, 75.75], 9, { duration: 0.8 });
  };

  const activeDisplayBlock = hoveredBlock || currentGisBlock;

  return (
    <div className="gis-map-flat-section">
      <div className="card-top-row">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <Compass className="inline-icon text-water" size={20} aria-hidden="true" />
              {currentLang === "pa" ? "ਪੰਜਾਬ ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਬਲਾਕ GIS ਨਕਸ਼ਾ" : "Punjab groundwater GIS map"}
            </h2>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg)",
              color: "var(--muted)",
              border: "1px solid var(--line)"
            }}>
              CGWB 2024–26 Live Spatial
            </span>
          </div>
          <p className="section-subtitle">
            {currentLang === "pa"
              ? "ਅਸਲ ਸਤਲੁਜ ਦਰਿਆ, ਨਹਿਰੀ ਨੈੱਟਵਰਕ ਅਤੇ ਬਲਾਕਾਂ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਖੇਤ ਦਾ ਪਾਣੀ ਸੰਕਟ ਦੇਖੋ"
              : "Interactive spatial GIS: click any catchment block or explore the Sutlej riverbed to evaluate groundwater extraction"}
          </p>
        </div>

        <div className="gis-legend-strip">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#DC2626" }}></span>
            <span>Over-exploited (&gt;100%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#EA580C" }}></span>
            <span>Critical (90–100%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#D97706" }}></span>
            <span>Semi-Critical</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#16A34A" }}></span>
            <span>Safe (&lt;70%)</span>
          </div>
        </div>
      </div>

      <div className="gis-map-toolbar">
        <div className="gis-layer-toggles">
          <button 
            type="button" 
            className={`gis-tool-btn ${activeTileLayer === "light" ? "active" : ""}`}
            onClick={() => handleTileSwitch("light")}
            title="Clean Paper GIS Map"
          >
            <Layers size={14} />
            <span>🗺️ Carto Map</span>
          </button>
          <button 
            type="button" 
            className={`gis-tool-btn ${activeTileLayer === "satellite" ? "active" : ""}`}
            onClick={() => handleTileSwitch("satellite")}
            title="Real Satellite Imagery"
          >
            <Layers size={14} />
            <span>🛰️ Satellite</span>
          </button>
          <button 
            type="button" 
            className={`gis-tool-btn ${activeTileLayer === "osm" ? "active" : ""}`}
            onClick={() => handleTileSwitch("osm")}
            title="OpenStreetMap Topo"
          >
            <Layers size={14} />
            <span>⛰️ Topo / Road</span>
          </button>
        </div>

        <div className="gis-right-tools">
          <button 
            type="button" 
            className="gis-recenter-btn"
            onClick={handleRecenter}
            title="Recenter to Central Punjab Alluvial Belt"
          >
            <RotateCcw size={14} />
            <span>{currentLang === "pa" ? "ਕੇਂਦਰੀ ਪੰਜਾਬ ਦੇਖੋ" : "Recenter Punjab"}</span>
          </button>
        </div>
      </div>

      <div className="gis-leaflet-canvas-wrap">
        <div ref={mapContainerRef} className="gis-leaflet-map-element" />

        <div className="gis-river-badge">
          <Waves size={13} className="text-water" />
          <span>Sutlej River & Sirhind Canal Water Network</span>
        </div>
      </div>

      <div className="gis-block-telemetry-bar">
        <div className="telemetry-info-col">
          <div className="telemetry-title-row">
            <MapPin size={16} className="text-field" />
            <h4 className="telemetry-block-name">
              {currentLang === "pa" ? activeDisplayBlock.namePa : activeDisplayBlock.name}
            </h4>
            <span className="telemetry-district-badge">
              {activeDisplayBlock.district} District
            </span>
            <span className={`telemetry-status-pill ${activeDisplayBlock.category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
              {activeDisplayBlock.category}
            </span>
          </div>
          <span className="telemetry-helper-hint">
            {hoveredBlock 
              ? (currentLang === "pa" ? "👉 ਕਲਿੱਕ ਕਰਕੇ ਇਹ ਬਲਾਕ ਚੁਣੋ" : "👉 Click map zone to select for your advisory calculations")
              : (currentLang === "pa" ? "✅ ਇਸ ਬਲਾਕ ਲਈ ਫਸਲ ਅਤੇ ਟਿਊਬਵੈੱਲ ਸਲਾਹ ਚਾਲੂ ਹੈ" : "✅ Active block selected for current farm calculations")}
          </span>
        </div>

        <div className="telemetry-stats-strip tabular-nums">
          <div className="telemetry-stat-cell">
            <span className="stat-label">Extraction Stage</span>
            <span className={`stat-value font-bold ${activeDisplayBlock.stagePercent > 100 ? "text-alert" : "text-field"}`}>
              {activeDisplayBlock.stagePercent}%
            </span>
          </div>

          <div className="telemetry-stat-cell">
            <span className="stat-label">Water Table Depth</span>
            <span className="stat-value font-bold text-ink">
              {activeDisplayBlock.depthM}m <span className="stat-sub">({Math.round(activeDisplayBlock.depthM * 3.28)} ft)</span>
            </span>
          </div>

          <div className="telemetry-stat-cell">
            <span className="stat-label">Annual Drop Rate</span>
            <span className="stat-value font-bold text-alert">
              -{activeDisplayBlock.annualDropCm} cm/yr
            </span>
          </div>

          <div className="telemetry-stat-cell">
            <span className="stat-label">Tubewell Density</span>
            <span className="stat-value font-bold text-ink">
              {activeDisplayBlock.tubewellsPerSqKm}/km²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
