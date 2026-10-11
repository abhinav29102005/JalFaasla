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

import punjabDistrictsGeoJson from "../data/punjab_districts.json";
import { PunjabBlock, PUNJAB_DISTRICTS } from "../data/punjabData";
import { Language } from "../data/translations";

interface PunjabGisMapProps {
  currentLang: Language;
  selectedBlock: PunjabBlock;
  onSelectBlock: (block: PunjabBlock) => void;
}

// Hydrological data for all official Punjab districts (CGWB 2024-26 Assessment)
interface DistrictGroundwaterData {
  name: string;
  namePa: string;
  category: "Over-Exploited" | "Critical" | "Semi-Critical" | "Safe";
  stagePercent: number;
  waterDepthM: number;
  annualFallCm: number;
  rechargeType: string;
}

const DISTRICT_HYDROLOGY: Record<string, DistrictGroundwaterData> = {
  "Ludhiana": {
    name: "Ludhiana",
    namePa: "ਲੁਧਿਆਣਾ",
    category: "Over-Exploited",
    stagePercent: 212,
    waterDepthM: 22.4,
    annualFallCm: 59,
    rechargeType: "Central Alluvial Aquifer (Severe Pumping Stress)"
  },
  "Sangrur": {
    name: "Sangrur",
    namePa: "ਸੰਗਰੂਰ",
    category: "Over-Exploited",
    stagePercent: 284,
    waterDepthM: 32.4,
    annualFallCm: 76,
    rechargeType: "Deep Quaternary Strata (>100m Depletion)"
  },
  "Barnala": {
    name: "Barnala",
    namePa: "ਬਰਨਾਲਾ",
    category: "Over-Exploited",
    stagePercent: 242,
    waterDepthM: 27.5,
    annualFallCm: 68,
    rechargeType: "Malwa Alluvial Basin"
  },
  "Moga": {
    name: "Moga",
    namePa: "ਮੋਗਾ",
    category: "Over-Exploited",
    stagePercent: 235,
    waterDepthM: 29.5,
    annualFallCm: 76,
    rechargeType: "Western Malwa Sandy Loam"
  },
  "Patiala": {
    name: "Patiala",
    namePa: "ਪਟਿਆਲਾ",
    category: "Over-Exploited",
    stagePercent: 212,
    waterDepthM: 23.5,
    annualFallCm: 60,
    rechargeType: "Ghaggar & Sirhind Basin"
  },
  "Jalandhar": {
    name: "Jalandhar",
    namePa: "ਜਲੰਧਰ",
    category: "Over-Exploited",
    stagePercent: 182,
    waterDepthM: 19.5,
    annualFallCm: 52,
    rechargeType: "Bist Doab Alluvium"
  },
  "Kapurthala": {
    name: "Kapurthala",
    namePa: "ਕਪੂਰਥਲਾ",
    category: "Over-Exploited",
    stagePercent: 170,
    waterDepthM: 18.2,
    annualFallCm: 48,
    rechargeType: "Beas Riverine Lowlands"
  },
  "Fatehgarh Sahib": {
    name: "Fatehgarh Sahib",
    namePa: "ਫ਼ਤਹਿਗੜ੍ਹ ਸਾਹਿਬ",
    category: "Over-Exploited",
    stagePercent: 185,
    waterDepthM: 20.1,
    annualFallCm: 53,
    rechargeType: "Sirhind Canal Command Zone"
  },
  "Bathinda": {
    name: "Bathinda",
    namePa: "ਬਠਿੰਡਾ",
    category: "Critical",
    stagePercent: 122,
    waterDepthM: 14.8,
    annualFallCm: 32,
    rechargeType: "Canal-Fed Cotton Belt"
  },
  "Firozpur": {
    name: "Firozpur",
    namePa: "ਫਿਰੋਜ਼ਪੁਰ",
    category: "Critical",
    stagePercent: 115,
    waterDepthM: 12.2,
    annualFallCm: 28,
    rechargeType: "Sutlej Border Plain"
  },
  "Faridkot": {
    name: "Faridkot",
    namePa: "ਫ਼ਰੀਦਕੋਟ",
    category: "Critical",
    stagePercent: 120,
    waterDepthM: 13.5,
    annualFallCm: 30,
    rechargeType: "Southwest Alluvial Loam"
  },
  "Mansa": {
    name: "Mansa",
    namePa: "ਮਾਨਸਾ",
    category: "Over-Exploited",
    stagePercent: 160,
    waterDepthM: 17.6,
    annualFallCm: 44,
    rechargeType: "Southern Semi-Arid Alluvium"
  },
  "Muktsar": {
    name: "Sri Muktsar Sahib",
    namePa: "ਸ੍ਰੀ ਮੁਕਤਸਰ ਸਾਹਿਬ",
    category: "Semi-Critical",
    stagePercent: 88,
    waterDepthM: 9.8,
    annualFallCm: 18,
    rechargeType: "Sirhind Feeder Canal Bank"
  },
  "Amritsar": {
    name: "Amritsar",
    namePa: "ਅੰਮ੍ਰਿਤਸਰ",
    category: "Over-Exploited",
    stagePercent: 155,
    waterDepthM: 16.4,
    annualFallCm: 42,
    rechargeType: "Upper Bari Doab Basin"
  },
  "Tarn Taran": {
    name: "Tarn Taran",
    namePa: "ਤਰਨ ਤਾਰਨ",
    category: "Over-Exploited",
    stagePercent: 168,
    waterDepthM: 17.8,
    annualFallCm: 46,
    rechargeType: "Harike Confluence Plain"
  },
  "Rupnagar": {
    name: "Rupnagar (Ropar)",
    namePa: "ਰੂਪਨਗਰ",
    category: "Semi-Critical",
    stagePercent: 78,
    waterDepthM: 10.2,
    annualFallCm: 22,
    rechargeType: "Sutlej River Gateway & Foothills"
  },
  "Sahibzada Ajit Singh Nagar": {
    name: "SAS Nagar (Mohali)",
    namePa: "ਮੋਹਾਲੀ",
    category: "Semi-Critical",
    stagePercent: 82,
    waterDepthM: 11.5,
    annualFallCm: 25,
    rechargeType: "Shivalik Piedmont Zone"
  },
  "Shahid Bhagat Singh Nagar": {
    name: "SBS Nagar (Nawanshahr)",
    namePa: "ਨਵਾਂਸ਼ਹਿਰ",
    category: "Critical",
    stagePercent: 95,
    waterDepthM: 12.8,
    annualFallCm: 29,
    rechargeType: "Bist Doab Alluvium"
  },
  "Hoshiarpur": {
    name: "Hoshiarpur (Kandi Belt)",
    namePa: "ਹੁਸ਼ਿਆਰਪੁਰ (ਕੰਢੀ)",
    category: "Safe",
    stagePercent: 62,
    waterDepthM: 8.5,
    annualFallCm: 15,
    rechargeType: "Natural Shivalik Rain Recharge Zone"
  },
  "Gurdaspur": {
    name: "Gurdaspur",
    namePa: "ਗੁਰਦਾਸਪੁਰ",
    category: "Safe",
    stagePercent: 68,
    waterDepthM: 8.9,
    annualFallCm: 16,
    rechargeType: "Ravi-Beas Submontane Watershed"
  }
};

// Sub-block Centroids for Ludhiana Central Alluvial Belt
interface LudhianaBlockPin {
  id: string;
  name: string;
  namePa: string;
  coords: [number, number];
  category: "Over-Exploited" | "Critical";
  stagePercent: number;
  depthM: number;
  annualDropCm: number;
}

const LUDHIANA_BLOCK_PINS: LudhianaBlockPin[] = [
  { id: "jagraon", name: "Jagraon", namePa: "ਜਗਰਾਓਂ", coords: [30.7853, 75.4740], category: "Over-Exploited", stagePercent: 188, depthM: 18.4, annualDropCm: 53 },
  { id: "sidhwan-bet", name: "Sidhwan Bet", namePa: "ਸਿੱਧਵਾਂ ਬੇਟ", coords: [30.9312, 75.5215], category: "Critical", stagePercent: 132, depthM: 12.8, annualDropCm: 36 },
  { id: "ludhiana-1", name: "Ludhiana-1 (East)", namePa: "ਲੁਧਿਆਣਾ-1", coords: [30.9110, 75.8900], category: "Over-Exploited", stagePercent: 194, depthM: 19.1, annualDropCm: 54 },
  { id: "ludhiana-2", name: "Ludhiana-2 (West)", namePa: "ਲੁਧਿਆਣਾ-2", coords: [30.8700, 75.7900], category: "Over-Exploited", stagePercent: 215, depthM: 21.6, annualDropCm: 59 },
  { id: "dehlon", name: "Dehlon", namePa: "ਡੇਹਲੋਂ", coords: [30.7686, 75.8756], category: "Over-Exploited", stagePercent: 238, depthM: 24.3, annualDropCm: 64 },
  { id: "khanna", name: "Khanna", namePa: "ਖੰਨਾ", coords: [30.7027, 76.2163], category: "Over-Exploited", stagePercent: 192, depthM: 19.8, annualDropCm: 55 },
  { id: "samrala", name: "Samrala", namePa: "ਸਮਰਾਲਾ", coords: [30.8359, 76.1927], category: "Over-Exploited", stagePercent: 165, depthM: 16.7, annualDropCm: 48 },
  { id: "doraha", name: "Doraha", namePa: "ਦੋਰਾਹਾ", coords: [30.8038, 76.0270], category: "Over-Exploited", stagePercent: 172, depthM: 17.6, annualDropCm: 49 },
  { id: "raikot", name: "Raikot", namePa: "ਰਾਏਕੋਟ", coords: [30.6508, 75.6022], category: "Over-Exploited", stagePercent: 218, depthM: 22.4, annualDropCm: 61 },
  { id: "sudhar", name: "Sudhar", namePa: "ਸੁਧਾਰ", coords: [30.7554, 75.6601], category: "Over-Exploited", stagePercent: 186, depthM: 19.3, annualDropCm: 53 },
  { id: "machhiwara", name: "Machhiwara", namePa: "ਮਾਛੀਵਾੜਾ", coords: [30.9125, 76.2005], category: "Critical", stagePercent: 148, depthM: 14.5, annualDropCm: 41 },
  { id: "pakhowal", name: "Pakhowal", namePa: "ਪੱਖੋਵਾਲ", coords: [30.6974, 75.7691], category: "Over-Exploited", stagePercent: 204, depthM: 20.8, annualDropCm: 58 }
];

// Sutlej River natural path
const SUTLEJ_RIVER_COORDS: [number, number][] = [
  [31.28, 76.53],
  [31.18, 76.32],
  [31.11, 76.15],
  [30.99, 75.85],
  [30.95, 75.54],
  [30.96, 75.32],
  [31.14, 74.96]
];

export const PunjabGisMap: React.FC<PunjabGisMapProps> = ({
  currentLang,
  selectedBlock,
  onSelectBlock,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const blockMarkersLayerRef = useRef<L.FeatureGroup | null>(null);

  const [activeTileLayer, setActiveTileLayer] = useState<"light" | "satellite" | "osm">("light");
  const [activeFeature, setActiveFeature] = useState<{
    title: string;
    titlePa: string;
    subDistrictOrDistrict: string;
    category: "Over-Exploited" | "Critical" | "Semi-Critical" | "Safe";
    stagePercent: number;
    depthM: number;
    annualFallCm: number;
    rechargeNote?: string;
  }>({
    title: selectedBlock.name,
    titlePa: selectedBlock.namePa,
    subDistrictOrDistrict: "Ludhiana District Block",
    category: selectedBlock.cgwbCategory as any || "Over-Exploited",
    stagePercent: selectedBlock.stageOfExtractionPercent || 188,
    depthM: selectedBlock.waterTableDepthM || 18.4,
    annualFallCm: selectedBlock.annualFallCm || 53,
    rechargeNote: selectedBlock.localObservations
  });

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

    // Center on Punjab Central Alluvial Belt (Ludhiana)
    const map = L.map(mapContainerRef.current, {
      center: [30.90, 75.75],
      zoom: 8.5,
      minZoom: 7.5,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    L.control.zoom({ position: "topright" }).addTo(map);

    // Default CartoDB Light Tile Layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // 1. Natural Sutlej River Polyline
    const river = L.polyline(SUTLEJ_RIVER_COORDS, {
      color: "#0284C7",
      weight: 4.5,
      opacity: 0.85,
    }).addTo(map);

    river.bindTooltip(
      "<div style='font-size:12px; font-weight:700;'>🌊 Sutlej River (ਸਤਲੁਜ ਦਰਿਆ)</div><span style='font-size:11px; color:#475569;'>Northern Floodplain & Groundwater Recharge Axis</span>",
      { sticky: true }
    );

    // 2. Render Official Punjab District Boundaries GeoJSON
    const geoJsonLayer = L.geoJSON(punjabDistrictsGeoJson as any, {
      style: (feature) => {
        const distName = feature?.properties?.district || "";
        const hydro = DISTRICT_HYDROLOGY[distName] || {
          category: "Over-Exploited",
          stagePercent: 180,
        };

        const isLudhiana = distName === "Ludhiana";
        const isSelected = selectedBlock.name.toLowerCase().includes(distName.toLowerCase()) ||
                           (distName === "Ludhiana" && selectedBlock.cgwbCategory !== undefined);

        const color = getCategoryColor(hydro.category);

        return {
          color: isSelected ? "#E7B422" : color,
          weight: isSelected ? 3.5 : (isLudhiana ? 2.5 : 1.2),
          fillColor: color,
          fillOpacity: isSelected ? 0.42 : (isLudhiana ? 0.30 : 0.22),
          dashArray: isSelected ? "4, 4" : undefined,
        };
      },
      onEachFeature: (feature, layer) => {
        const distName = feature?.properties?.district || "";
        const hydro = DISTRICT_HYDROLOGY[distName] || {
          name: distName,
          namePa: distName,
          category: "Over-Exploited",
          stagePercent: 180,
          waterDepthM: 19.5,
          annualFallCm: 50,
          rechargeType: "Alluvial Plain"
        };

        const tooltipHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
            <strong style="font-size: 13px; color: #0F172A;">${hydro.name} (${hydro.namePa})</strong><br/>
            <span style="color: #64748B;">Official District Division</span>
            <div style="margin-top: 4px; padding: 4px 6px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px;">
              Extraction: <strong style="color: ${getCategoryColor(hydro.category)};">${hydro.stagePercent}%</strong> (${hydro.category})<br/>
              Water Depth: <strong>${hydro.waterDepthM} m</strong> (~${Math.round(hydro.waterDepthM * 3.28)} ft)<br/>
              Annual Fall: <strong style="color: #B91C1C;">-${hydro.annualFallCm} cm/yr</strong>
            </div>
            <span style="font-size: 11px; color: #059669; font-weight: 600; display: block; margin-top: 4px;">
              👉 Click district to inspect groundwater
            </span>
          </div>
        `;

        layer.bindTooltip(tooltipHtml, { sticky: true });

        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.55, weight: 3 });
            setActiveFeature({
              title: hydro.name,
              titlePa: hydro.namePa,
              subDistrictOrDistrict: "Official Punjab District",
              category: hydro.category,
              stagePercent: hydro.stagePercent,
              depthM: hydro.waterDepthM,
              annualFallCm: hydro.annualFallCm,
              rechargeNote: hydro.rechargeType
            });
          },
          mouseout: (e) => {
            geoJsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            const poly = layer as L.Polygon;
            if (poly && typeof poly.getBounds === "function") {
              map.fitBounds(poly.getBounds(), { padding: [20, 20], maxZoom: 10.5 });
            }

            // If Ludhiana or district with matching blocks, select default
            let matched: PunjabBlock | undefined;
            for (const dist of PUNJAB_DISTRICTS) {
              if (dist.name.toLowerCase() === distName.toLowerCase()) {
                matched = dist.blocks[0];
                break;
              }
            }

            if (matched) {
              onSelectBlock(matched);
            }
          }
        });
      }
    }).addTo(map);

    geoJsonLayerRef.current = geoJsonLayer;

    // 3. Render Non-Overlapping Interactive Sub-Block Circle Centroids inside Ludhiana
    const blockMarkersGroup = L.featureGroup().addTo(map);
    blockMarkersLayerRef.current = blockMarkersGroup;

    LUDHIANA_BLOCK_PINS.forEach(block => {
      const isSelected = block.id === selectedBlock.id;
      const catColor = getCategoryColor(block.category);

      // Subtle, clean circular marker pin - NO overlapping large rectangular cards!
      const circleMarker = L.circleMarker(block.coords, {
        radius: isSelected ? 8 : 6,
        fillColor: isSelected ? "#E7B422" : catColor,
        color: "#FFFFFF",
        weight: isSelected ? 3 : 1.5,
        fillOpacity: 0.95,
      }).addTo(blockMarkersGroup);

      // Clean, elegant label next to circle
      const labelIcon = L.divIcon({
        className: "gis-clean-node-label",
        html: `
          <div class="clean-node-text ${isSelected ? "selected" : ""}">
            ${block.name} <span class="node-pct">${block.stagePercent}%</span>
          </div>
        `,
        iconSize: [90, 20],
        iconAnchor: [45, -6]
      });

      const labelMarker = L.marker(block.coords, { icon: labelIcon }).addTo(blockMarkersGroup);

      const blockTooltip = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="font-size: 13px; color: #0F172A;">${block.name} (${block.namePa})</strong><br/>
          <span style="color: #64748B;">Ludhiana Agricultural Block</span>
          <div style="margin-top: 4px; padding: 4px 6px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 4px;">
            Extraction: <strong style="color: ${catColor};">${block.stagePercent}%</strong> (${block.category})<br/>
            Water Depth: <strong>${block.depthM} m</strong> (~${Math.round(block.depthM * 3.28)} ft)<br/>
            Annual Decline: <strong style="color: #B91C1C;">-${block.annualDropCm} cm/yr</strong>
          </div>
          <span style="font-size: 11px; color: #059669; font-weight: 600; display: block; margin-top: 4px;">
            👉 Click to calculate plot savings for this block
          </span>
        </div>
      `;

      circleMarker.bindTooltip(blockTooltip, { sticky: true });
      labelMarker.bindTooltip(blockTooltip, { sticky: true });

      const handleBlockSelect = () => {
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
        }

        map.flyTo(block.coords, 10.5, { duration: 0.8 });

        setActiveFeature({
          title: block.name,
          titlePa: block.namePa,
          subDistrictOrDistrict: "Ludhiana Agricultural Block",
          category: block.category,
          stagePercent: block.stagePercent,
          depthM: block.depthM,
          annualFallCm: block.annualDropCm,
          rechargeNote: "Central Ludhiana High-Intensity Tube-Well Pumping Zone"
        });
      };

      circleMarker.on("click", handleBlockSelect);
      labelMarker.on("click", handleBlockSelect);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update selection highlight when selectedBlock changes
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.setStyle((feature) => {
      const distName = feature?.properties?.district || "";
      const hydro = DISTRICT_HYDROLOGY[distName] || {
        category: "Over-Exploited",
        stagePercent: 180,
      };

      const isLudhiana = distName === "Ludhiana";
      const isSelected = selectedBlock.name.toLowerCase().includes(distName.toLowerCase()) ||
                         (distName === "Ludhiana" && selectedBlock.cgwbCategory !== undefined);

      const color = getCategoryColor(hydro.category);

      return {
        color: isSelected ? "#E7B422" : color,
        weight: isSelected ? 3.5 : (isLudhiana ? 2.5 : 1.2),
        fillColor: color,
        fillOpacity: isSelected ? 0.42 : (isLudhiana ? 0.30 : 0.22),
        dashArray: isSelected ? "4, 4" : undefined,
      };
    });
  }, [selectedBlock]);

  // Handle Tile Switching
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
    geoJsonLayerRef.current?.bringToFront();
    blockMarkersLayerRef.current?.bringToFront();
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([30.90, 75.75], 8.5, { duration: 0.8 });
  };

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
              Official Administrative Boundaries
            </span>
          </div>
          <p className="section-subtitle">
            {currentLang === "pa"
              ? "ਅਸਲ ਪ੍ਰਸ਼ਾਸਕੀ ਜ਼ਿਲ੍ਹਾ ਹੱਦਾਂ, ਸਤਲੁਜ ਦਰਿਆ ਅਤੇ ਬਲਾਕਾਂ ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਪਾਣੀ ਸੰਕਟ ਦੇਖੋ"
              : "Real administrative district polygons with CGWB groundwater over-extraction choropleth shading"}
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
            title="Recenter to Punjab Central Alluvial Belt"
          >
            <RotateCcw size={14} />
            <span>{currentLang === "pa" ? "ਕੇਂਦਰੀ ਪੰਜਾਬ ਦੇਖੋ" : "Recenter Punjab"}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="gis-leaflet-canvas-wrap">
        <div ref={mapContainerRef} className="gis-leaflet-map-element" />

        <div className="gis-river-badge">
          <Waves size={13} className="text-water" />
          <span>Sutlej River Basin • Northern Groundwater Recharge Axis</span>
        </div>
      </div>

      {/* Real Spatial Telemetry Bar */}
      <div className="gis-block-telemetry-bar">
        <div className="telemetry-info-col">
          <div className="telemetry-title-row">
            <MapPin size={16} className="text-field" />
            <h4 className="telemetry-block-name">
              {currentLang === "pa" ? activeFeature.titlePa : activeFeature.title}
            </h4>
            <span className="telemetry-district-badge">
              {activeFeature.subDistrictOrDistrict}
            </span>
            <span className={`telemetry-status-pill ${activeFeature.category.toLowerCase().replace(/[^a-z]/g, "-")}`}>
              {activeFeature.category}
            </span>
          </div>
          <span className="telemetry-helper-hint">
            {activeFeature.rechargeNote || "CGWB official assessment: click any Punjab district or block to calculate your farm savings"}
          </span>
        </div>

        <div className="telemetry-stats-strip tabular-nums">
          <div className="telemetry-stat-cell">
            <span className="stat-label">Extraction Stage</span>
            <span className={`stat-value font-bold ${activeFeature.stagePercent > 100 ? "text-alert" : "text-field"}`}>
              {activeFeature.stagePercent}%
            </span>
          </div>

          <div className="telemetry-stat-cell">
            <span className="stat-label">Water Table Depth</span>
            <span className="stat-value font-bold text-ink">
              {activeFeature.depthM}m <span className="stat-sub">({Math.round(activeFeature.depthM * 3.28)} ft)</span>
            </span>
          </div>

          <div className="telemetry-stat-cell">
            <span className="stat-label">Annual Drop Rate</span>
            <span className="stat-value font-bold text-alert">
              -{activeFeature.annualFallCm} cm/yr
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
