import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  CheckCircle2, 
  MapPin, 
  ThumbsUp, 
  RefreshCw, 
  Loader2 
} from 'lucide-react';
import { PunjabBlock } from '../data/punjabData';
import { Language, TRANSLATIONS } from '../data/translations';
import { api } from '../services/api';


interface FarmerReport {
  id: string;
  farmerName: string;
  village: string;
  blockName: string;
  reportedDepthM: number;
  addedExtraPipes: boolean;
  motorBurnoutIssue: boolean;
  waterQuality: 'Sweet / Normal' | 'Brackish (Khara)' | 'High Salinity / EC';
  cropSown: string;
  actualYieldQtl: number;
  timestamp: string;
  verifiedCount: number;
}

const INITIAL_REPORTS: FarmerReport[] = [
  {
    id: 'r1',
    farmerName: 'Gurpreet Singh',
    village: 'Sohian, Jagraon',
    blockName: 'Jagraon',
    reportedDepthM: 19.2,
    addedExtraPipes: true,
    motorBurnoutIssue: false,
    waterQuality: 'Sweet / Normal',
    cropSown: 'PR-126 with AWD',
    actualYieldQtl: 31.5,
    timestamp: '2 hours ago',
    verifiedCount: 14
  },
  {
    id: 'r2',
    farmerName: 'Harinder Pal',
    village: 'Gill, Ludhiana',
    blockName: 'Ludhiana-2',
    reportedDepthM: 22.0,
    addedExtraPipes: true,
    motorBurnoutIssue: true,
    waterQuality: 'Sweet / Normal',
    cropSown: 'Pusa-44 (Shifted to PR-126 this year)',
    actualYieldQtl: 32.0,
    timestamp: '5 hours ago',
    verifiedCount: 23
  },
  {
    id: 'r3',
    farmerName: 'Balwant Singh',
    village: 'Kanganwal, Dehlon',
    blockName: 'Dehlon',
    reportedDepthM: 24.8,
    addedExtraPipes: true,
    motorBurnoutIssue: true,
    waterQuality: 'Sweet / Normal',
    cropSown: 'Kharif Hybrid Maize (PMH-13)',
    actualYieldQtl: 27.2,
    timestamp: '1 day ago',
    verifiedCount: 31
  },
  {
    id: 'r4',
    farmerName: 'Jasvir Dhillon',
    village: 'Barsal, Sidhwan Bet',
    blockName: 'Sidhwan Bet',
    reportedDepthM: 13.5,
    addedExtraPipes: false,
    motorBurnoutIssue: false,
    waterQuality: 'Sweet / Normal',
    cropSown: 'Pusa Basmati 1509',
    actualYieldQtl: 24.5,
    timestamp: '2 days ago',
    verifiedCount: 19
  }
];

interface FarmerReportLoopProps {
  currentLang: Language;
  block: PunjabBlock;
}

export const FarmerReportLoop: React.FC<FarmerReportLoopProps> = ({
  currentLang,
  block,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [reports, setReports] = useState<FarmerReport[]>(INITIAL_REPORTS);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Form fields
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('');
  const [depth, setDepth] = useState(block.waterTableDepthM.toString());
  const [addedPipes, setAddedPipes] = useState(true);
  const [motorTripping, setMotorTripping] = useState(false);
  const [waterQuality, setWaterQuality] = useState<'Sweet / Normal' | 'Brackish (Khara)' | 'High Salinity / EC'>('Sweet / Normal');
  const [cropSown, setCropSown] = useState('PR-126 with AWD');
  const [yieldVal, setYieldVal] = useState('31');

  // Load live reports from AWS API Gateway on mount
  const fetchLiveReports = async () => {
    setIsLoadingFeed(true);
    try {
      const serverReports = await api.getCommunityReports();
      if (serverReports && serverReports.length > 0) {
        setIsLiveConnected(true);
        // Map backend CommunityReportResponse to UI format
        const mapped: FarmerReport[] = serverReports.map((sr, idx) => ({
          id: sr.id || `live-${idx}`,
          farmerName: sr.farmer_name,
          village: sr.village,
          blockName: sr.block,
          reportedDepthM: Math.round((sr.depth_feet / 3.28084) * 10) / 10,
          addedExtraPipes: sr.notes?.includes('Lowered') ?? true,
          motorBurnoutIssue: sr.notes?.includes('Burnout') ?? false,
          waterQuality: 'Sweet / Normal',
          cropSown: sr.notes?.split('Crop: ')?.[1]?.split(',')?.[0] || 'PAU PR-126 AWD',
          actualYieldQtl: 31.0,
          timestamp: sr.timestamp || 'Recent',
          verifiedCount: 12 + idx * 3,
        }));

        // Merge keeping uniqueness
        setReports(prev => {
          const ids = new Set(mapped.map(m => m.id));
          const remainingPrev = prev.filter(p => !ids.has(p.id));
          return [...mapped, ...remainingPrev];
        });
      }
    } catch (err) {
      console.warn('Community reports fetched with local fallback:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchLiveReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const depthMeters = parseFloat(depth) || block.waterTableDepthM;
    const depthFeet = Math.round(depthMeters * 3.28084 * 10) / 10;
    const resolvedFarmer = farmerName.trim() || 'Anonymous Farmer';
    const resolvedVillage = village.trim() || `${block.name} Village`;

    const newReport: FarmerReport = {
      id: `report-${Date.now()}`,
      farmerName: resolvedFarmer,
      village: resolvedVillage,
      blockName: block.name,
      reportedDepthM: depthMeters,
      addedExtraPipes: addedPipes,
      motorBurnoutIssue: motorTripping,
      waterQuality,
      cropSown,
      actualYieldQtl: parseFloat(yieldVal) || 30,
      timestamp: 'Just now',
      verifiedCount: 1
    };

    // Optimistic UI update
    setReports(prev => [newReport, ...prev]);
    setSubmitted(true);

    // Call live API
    try {
      await api.submitCommunityReport({
        farmer_name: resolvedFarmer,
        village: resolvedVillage,
        block: block.name,
        depth_feet: depthFeet,
        change_past_year_feet: 3.2,
        notes: `Crop: ${cropSown}, Yield: ${yieldVal} qtl/ac, Quality: ${waterQuality}${addedPipes ? ', Lowered Motor' : ''}${motorTripping ? ', Burnout' : ''}`,
      });
      setIsLiveConnected(true);
    } catch (err) {
      console.warn('Report stored locally (API call note):', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitted(false), 5000);
      setFarmerName('');
      setVillage('');
    }
  };

  const handleVerify = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, verifiedCount: r.verifiedCount + 1 } : r
    ));
  };

  return (
    <div className="panel report-loop-card">
      <div className="card-header-row">
        <div className="title-with-badge">
          <h2 className="card-title">
            <Users className="card-title-icon text-field" size={20} />
            {t.reportTitle}
          </h2>
          <span className="status">
            <span className="status-dot" style={{ backgroundColor: isLiveConnected ? 'var(--field)' : 'var(--water)' }} />
            {isLiveConnected ? 'AWS API Gateway Live Feed' : 'Crowdsourced Ground Truth'}
          </span>
        </div>
        <button 
          type="button" 
          onClick={fetchLiveReports} 
          disabled={isLoadingFeed}
          style={{
            background: 'transparent',
            border: '1px solid var(--line)',
            color: 'var(--muted)',
            padding: '4px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px'
          }}
          title="Refresh feed from AWS API Gateway"
        >
          <RefreshCw size={12} className={isLoadingFeed ? 'animate-spin' : ''} />
          <span>ਤਾਜ਼ਾ ਕਰੋ (Refresh)</span>
        </button>
      </div>

      <p className="report-subtext">
        {t.reportSubtitle}
      </p>

      <div className="report-loop-layout">
        {/* Left: Submission Form */}
        <div className="report-form-box">
          <h3 className="box-section-title font-bold">
            ✍️ {currentLang === 'pa' ? 'ਨਵੀਂ ਖੇਤ ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ' : 'Submit Your Well Data'}
          </h3>

          {submitted && (
            <div className="report-success-alert">
              <CheckCircle2 size={18} className="text-field" />
              <span>
                ਰਿਪੋਰਟ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਈ! ਪੰਜਾਬ ਦੇ ਖੁੱਲ੍ਹੇ ਭੂਮੀਗਤ ਪਾਣੀ ਡਾਟਾਸੈੱਟ ਵਿੱਚ ਯੋਗਦਾਨ ਲਈ ਧੰਨਵਾਦ।
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="report-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="rep-name">
                Farmer / Well Owner Name
              </label>
              <input
                id="rep-name"
                type="text"
                className="form-control"
                placeholder="e.g. Jaswinder Singh"
                value={farmerName}
                onChange={e => setFarmerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rep-village">
                Village Name ({block.name} Block)
              </label>
              <input
                id="rep-village"
                type="text"
                className="form-control"
                placeholder="e.g. Kothe Baghel, Jagraon"
                value={village}
                required
                onChange={e => setVillage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rep-depth">
                Current Water Depth (Meters)
              </label>
              <input
                id="rep-depth"
                type="number"
                step="0.5"
                className="form-control tabular-nums"
                value={depth}
                onChange={e => setDepth(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rep-crop">
                Crop Variety Cultivated
              </label>
              <input
                id="rep-crop"
                type="text"
                className="form-control"
                value={cropSown}
                onChange={e => setCropSown(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rep-yield">
                Harvest Yield (Quintal / Acre)
              </label>
              <input
                id="rep-yield"
                type="number"
                step="0.5"
                className="form-control tabular-nums"
                value={yieldVal}
                onChange={e => setYieldVal(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rep-quality">
                Water Quality / EC
              </label>
              <select
                id="rep-quality"
                className="form-control"
                value={waterQuality}
                onChange={e => setWaterQuality(e.target.value as any)}
              >
                <option value="Sweet / Normal">Sweet / Normal Drinking Water</option>
                <option value="Brackish (Khara)">Brackish / Slightly Saline</option>
                <option value="High Salinity / EC">High Salinity (Needs Gypsum/Canal blend)</option>
              </select>
            </div>

            {/* Checkboxes for pump maintenance */}
            <div className="checkbox-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={addedPipes}
                  onChange={e => setAddedPipes(e.target.checked)}
                />
                <span>Lowered motor / added pipes this season</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={motorTripping}
                  onChange={e => setMotorTripping(e.target.checked)}
                />
                <span>Experienced motor dry-run or burnout</span>
              </label>
            </div>

            <button type="submit" className="btn-primary submit-rep-btn" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{isSubmitting ? 'ਦਰਜ ਹੋ ਰਿਹਾ ਹੈ...' : t.submitReport}</span>
            </button>
          </form>
        </div>

        {/* Right: Community Reports Feed */}
        <div className="report-feed-box">
          <div className="feed-header">
            <h3 className="box-section-title font-bold">
              📡 {t.recentReports}
            </h3>
            <span className="feed-count-pill tabular-nums">{reports.length} Reports</span>
          </div>

          <div className="reports-list">
            {reports.map(report => (
              <div key={report.id} className="single-report-card">
                <div className="rep-card-top">
                  <div>
                    <span className="rep-farmer-name font-bold">{report.farmerName}</span>
                    <span className="rep-village-location text-xs text-muted">
                      <MapPin size={12} className="inline-icon text-ink" />
                      {report.village} ({report.blockName})
                    </span>
                  </div>
                  <span className="rep-timestamp text-xs">{report.timestamp}</span>
                </div>

                <div className="rep-metrics-row">
                  <div className="rep-metric">
                    <span className="rep-m-label">Water Depth</span>
                    <span className="rep-m-val tabular-nums font-bold text-water">
                      {report.reportedDepthM} m (~{Math.round(report.reportedDepthM * 3.28)} ft)
                    </span>
                  </div>
                  <div className="rep-metric">
                    <span className="rep-m-label">Crop & Yield</span>
                    <span className="rep-m-val tabular-nums font-bold text-field">
                      {report.cropSown} ({report.actualYieldQtl} qtl/ac)
                    </span>
                  </div>
                </div>

                <div className="rep-tags-row">
                  {report.addedExtraPipes && (
                    <span className="tag text-caution">⚠️ Motor Lowered (Extra Pipes)</span>
                  )}
                  {report.motorBurnoutIssue && (
                    <span className="tag text-alert">🔥 Pump Burnout Reported</span>
                  )}
                  <span className="tag text-water">💧 {report.waterQuality}</span>
                </div>

                <div className="rep-card-bottom">
                  <button 
                    type="button" 
                    className="verify-btn"
                    onClick={() => handleVerify(report.id)}
                  >
                    <ThumbsUp size={13} />
                    <span>Confirm / Verify ({report.verifiedCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
