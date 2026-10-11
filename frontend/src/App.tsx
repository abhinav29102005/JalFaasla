import React, { useState, useMemo, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  FarmerOnboardingForm 
} from './components/FarmerOnboardingForm';
import { 
  GroundwaterScorecard 
} from './components/GroundwaterScorecard';
import { 
  PunjabGisMap 
} from './components/PunjabGisMap';
import { 
  LegalComplianceAlert 
} from './components/LegalComplianceAlert';
import { 
  CropFitComparison 
} from './components/CropFitComparison';
import { 
  IrrigationScheduler 
} from './components/IrrigationScheduler';
import { 
  FarmerReportLoop 
} from './components/FarmerReportLoop';
import { 
  ConversationalAdvisor 
} from './components/ConversationalAdvisor';
import { 
  ShareableAdvisoryModal 
} from './components/ShareableAdvisoryModal';
import { 
  AwsArchitectureModal 
} from './components/AwsArchitectureModal';
import { 
  SmsAlertModal 
} from './components/SmsAlertModal';
import { 
  Footer 
} from './components/Footer';

import { PUNJAB_DISTRICTS, PunjabBlock } from './data/punjabData';
import { Language } from './data/translations';
import { evaluateGroundwaterStress } from './utils/groundwaterEngine';
import { generateFarmerAdvisory, FarmerAdvisoryInput } from './utils/advisoryEngine';
import { generate7DayForecast } from './data/weatherData';
import { 
  api, 
  toFarmerPlotInput, 
  AdvisoryEvaluationResponse, 
  GroundwaterBlockInfo, 
  WeatherForecastResponse 
} from './services/api';

import { 
  LayoutDashboard, 
  BarChart3, 
  Activity, 
  CloudRain, 
  Scale, 
  Users, 
  Bot,
  Compass
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // Ground-Truth Pitch Scenario (Ludhiana / Jagraon)
  const initialBlock = PUNJAB_DISTRICTS[0].blocks[0]; // Jagraon (Ludhiana)

  const [input, setInput] = useState<FarmerAdvisoryInput>({
    block: initialBlock,
    landSizeAcres: 3,
    soilType: initialBlock.soilTypeDefault,
    currentCropId: 'pusa44',
    tubewellDepthM: 18,
    pumpHp: 10,
    powerSource: 'diesel',
    irrigationMethod: 'flooding',
    plannedDate: '2026-06-05', // 15 days before June 20 - illustrates statutory warning
  });

  const [activeTab, setActiveTab] = useState<'all' | 'advisory' | 'groundwater' | 'map' | 'irrigation' | 'legal' | 'report' | 'ai'>('all');

  // Live API States
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'syncing' | 'offline' | 'error'>('connected');
  const [serverEvaluation, setServerEvaluation] = useState<AdvisoryEvaluationResponse | null>(null);
  const [liveBlockInfo, setLiveBlockInfo] = useState<GroundwaterBlockInfo | null>(null);
  const [liveWeather, setLiveWeather] = useState<WeatherForecastResponse | null>(null);

  // Modals state
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  // Health check and live weather on mount
  useEffect(() => {
    api.getHealth()
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('offline'));

    api.getWeatherForecast('Ludhiana')
      .then(setLiveWeather)
      .catch(err => console.warn('Weather forecast live fetch note:', err));
  }, []);

  // Fetch live block information whenever block changes
  useEffect(() => {
    api.getGroundwaterBlock(input.block.name)
      .then(setLiveBlockInfo)
      .catch(err => console.warn('Block live info fetch note:', err));
  }, [input.block.name]);

  // Debounced API evaluation on input change
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsEvaluating(true);
      setApiStatus('syncing');
      try {
        const currentDistrict = PUNJAB_DISTRICTS.find(d => 
          d.blocks.some(b => b.id === input.block.id)
        ) || PUNJAB_DISTRICTS[0];

        const payload = toFarmerPlotInput(input, currentDistrict.name);
        const res = await api.evaluatePlot(payload);
        setServerEvaluation(res);
        setApiStatus('connected');
      } catch (err) {
        console.warn('Live evaluatePlot fallback to local engine:', err);
        setApiStatus('offline');
      } finally {
        setIsEvaluating(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [input]);

  // Computations
  const analysis = useMemo(() => {
    return evaluateGroundwaterStress(input.block, input.tubewellDepthM);
  }, [input.block, input.tubewellDepthM]);

  const localAdvisory = useMemo(() => {
    return generateFarmerAdvisory(input);
  }, [input]);

  // Merge server evaluation with client advisory
  const advisory = useMemo(() => {
    if (!serverEvaluation) return localAdvisory;

    const merged = { ...localAdvisory };
    const est = serverEvaluation.savings_estimate;
    const leg = serverEvaluation.legal_compliance;

    if (est) {
      merged.recommendedShortPaddyAwd = {
        ...merged.recommendedShortPaddyAwd,
        tubewellHoursSaved: est.tubewell_hours_saved,
        costSavedInr: est.diesel_or_electricity_cost_saved_inr,
        waterSavedM3Total: est.water_saved_cubic_meters,
      };
      if (est.summary_farmer_message) {
        merged.headlinePunchline = est.summary_farmer_message;
        merged.headlinePunchlinePa = `ਤੁਹਾਡੇ ${input.landSizeAcres} ਏਕੜ ਖੇਤ ਲਈ, ਪੀਏਯੂ ਪੀਆਰ-126 ਬੀਜਣ ਅਤੇ ਪਾਣੀ-ਪਾਈਪ (AWD) ਨਾਲ ਲਗਭਗ ${est.tubewell_hours_saved} ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਅਤੇ ₹${est.diesel_or_electricity_cost_saved_inr.toLocaleString('en-IN')} ਦੀ ਬੱਚਤ ਹੋਵੇਗੀ।`;
      }
    }

    if (leg) {
      merged.legalCheck = {
        ...merged.legalCheck,
        isCompliant: leg.is_compliant,
        penaltyRiskInr: leg.penalty_risk_inr,
      };
    }

    return merged;
  }, [localAdvisory, serverEvaluation, input.landSizeAcres]);

  const forecast = useMemo(() => {
    return generate7DayForecast(input.block.id);
  }, [input.block.id]);

  const handleApplyPreset = (presetName: 'ludhiana' | 'sangrur' | 'bet') => {
    if (presetName === 'ludhiana') {
      const ludhianaDist = PUNJAB_DISTRICTS.find(d => d.id === 'ludhiana') || PUNJAB_DISTRICTS[0];
      const jagraon = ludhianaDist.blocks.find(b => b.id === 'jagraon') || ludhianaDist.blocks[0];
      setInput({
        block: jagraon,
        landSizeAcres: 3,
        soilType: 'Sandy Loam',
        currentCropId: 'pusa44',
        tubewellDepthM: 18,
        pumpHp: 10,
        powerSource: 'diesel',
        irrigationMethod: 'flooding',
        plannedDate: '2026-06-05',
      });
    } else if (presetName === 'sangrur') {
      const sangrurDist = PUNJAB_DISTRICTS.find(d => d.id === 'sangrur') || PUNJAB_DISTRICTS[1];
      const sangrurBlock = sangrurDist.blocks[0];
      setInput({
        block: sangrurBlock,
        landSizeAcres: 8,
        soilType: 'Sandy Loam',
        currentCropId: 'pusa44',
        tubewellDepthM: 32,
        pumpHp: 15,
        powerSource: 'electric',
        irrigationMethod: 'flooding',
        plannedDate: '2026-06-10',
      });
    } else if (presetName === 'bet') {
      const ludhianaDist = PUNJAB_DISTRICTS.find(d => d.id === 'ludhiana') || PUNJAB_DISTRICTS[0];
      const betBlock = ludhianaDist.blocks.find(b => b.id === 'sidhwan-bet') || ludhianaDist.blocks[0];
      setInput({
        block: betBlock,
        landSizeAcres: 4,
        soilType: 'Alluvial',
        currentCropId: 'pr121',
        tubewellDepthM: 12.8,
        pumpHp: 7.5,
        powerSource: 'electric',
        irrigationMethod: 'awd',
        plannedDate: '2026-06-20',
      });
    }
  };

  const handleSelectBlockFromMap = (b: PunjabBlock) => {
    setInput(prev => ({
      ...prev,
      block: b,
      tubewellDepthM: b.waterTableDepthM,
      soilType: b.soilTypeDefault,
    }));
  };

  return (
    <div className="jalfaasla-app">
      {/* Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onOpenSmsModal={() => setIsSmsModalOpen(true)}
        isLegalViolation={!advisory.legalCheck.isCompliant}
      />

      {/* Symmetrical Section Navigation Control */}
      <nav className="subnav-wrapper" aria-label="Advisory Navigation">
        <div className="app-container">
          <div className="subnav-segmented-control">
            <button
              type="button"
              className={`subnav-item ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <LayoutDashboard size={15} />
              <span>{currentLang === 'pa' ? 'ਸਭ ਵੇਰਵੇ (All)' : 'Full Advisory'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'advisory' ? 'active' : ''}`}
              onClick={() => setActiveTab('advisory')}
            >
              <BarChart3 size={15} />
              <span>{currentLang === 'pa' ? 'ਫਸਲ ਤੇ ਬੱਚਤ' : 'Crop Economics'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'groundwater' ? 'active' : ''}`}
              onClick={() => setActiveTab('groundwater')}
            >
              <Activity size={15} />
              <span>{currentLang === 'pa' ? 'ਪਾਣੀ ਸੰਕਟ' : 'Water Stress'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <Compass size={15} />
              <span>{currentLang === 'pa' ? 'GIS ਨਕਸ਼ਾ' : 'GIS Map'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'irrigation' ? 'active' : ''}`}
              onClick={() => setActiveTab('irrigation')}
            >
              <CloudRain size={15} />
              <span>{currentLang === 'pa' ? 'ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ' : 'Irrigation'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'legal' ? 'active' : ''}`}
              onClick={() => setActiveTab('legal')}
            >
              <Scale size={15} />
              <span>{currentLang === 'pa' ? 'ਕਾਨੂੰਨੀ ਨਿਯਮ' : 'Legal Rules'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'report' ? 'active' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              <Users size={15} />
              <span>{currentLang === 'pa' ? 'ਪਿੰਡ ਰਿਪੋਰਟਾਂ' : 'Village Feed'}</span>
            </button>
            <button
              type="button"
              className={`subnav-item ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <Bot size={15} />
              <span>{currentLang === 'pa' ? 'ਏ.ਆਈ. ਸਲਾਹਕਾਰ' : 'AI Agronomist'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Symmetrical Content Area */}
      <main className="main-content-layout">
        <div className="app-container">
          <div className="dashboard-content-container">
            {/* 1. Farmer Configuration Form */}
            <section className="dashboard-section section-onboarding">
              <FarmerOnboardingForm
                currentLang={currentLang}
                input={input}
                onChange={setInput}
                onApplyPreset={handleApplyPreset}
                isEvaluating={isEvaluating}
                apiStatus={apiStatus}
              />
            </section>

            {/* 2. Legal Alert & Statutory Notice */}
            {(activeTab === 'all' || activeTab === 'legal') && (
              <section className="dashboard-section section-legal">
                <LegalComplianceAlert
                  currentLang={currentLang}
                  legal={advisory.legalCheck}
                  landSizeAcres={input.landSizeAcres}
                />
              </section>
            )}

            {/* 3. The Core Crop-Fit & Savings Punchline */}
            {(activeTab === 'all' || activeTab === 'advisory') && (
              <section className="dashboard-section section-cropfit">
                <CropFitComparison
                  currentLang={currentLang}
                  advisory={advisory}
                />
              </section>
            )}

            {/* 4. Interactive GIS Map */}
            {(activeTab === 'all' || activeTab === 'map' || activeTab === 'groundwater') && (
              <section className="dashboard-section section-gis-map">
                <PunjabGisMap
                  currentLang={currentLang}
                  selectedBlock={input.block}
                  onSelectBlock={handleSelectBlockFromMap}
                />
              </section>
            )}

            {/* 5. Groundwater Risk Profile Scorecard */}
            {(activeTab === 'all' || activeTab === 'groundwater') && (
              <section className="dashboard-section section-scorecard">
                <GroundwaterScorecard
                  currentLang={currentLang}
                  block={input.block}
                  analysis={analysis}
                  liveBlockInfo={liveBlockInfo}
                />
              </section>
            )}

            {/* 6. 7-Day Rain-Aware Irrigation Scheduler */}
            {(activeTab === 'all' || activeTab === 'irrigation') && (
              <section className="dashboard-section section-irrigation">
                <IrrigationScheduler
                  currentLang={currentLang}
                  forecast={forecast}
                  pumpHp={input.pumpHp}
                  powerSource={input.powerSource}
                  liveWeather={liveWeather}
                  liveSchedule={serverEvaluation?.seven_day_irrigation_schedule}
                  onOpenSmsModal={() => setIsSmsModalOpen(true)}
                />
              </section>
            )}

            {/* 7. Conversational AI Agronomist */}
            {(activeTab === 'all' || activeTab === 'ai') && (
              <section className="dashboard-section section-ai">
                <ConversationalAdvisor
                  currentLang={currentLang}
                />
              </section>
            )}

            {/* 8. Farmer Ground-Truth Crowdsourced Loop */}
            {(activeTab === 'all' || activeTab === 'report') && (
              <section className="dashboard-section section-report">
                <FarmerReportLoop
                  currentLang={currentLang}
                  block={input.block}
                />
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
      />

      {/* Modals */}
      <ShareableAdvisoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        advisory={advisory}
        currentLang={currentLang}
      />

      <AwsArchitectureModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
      />

      <SmsAlertModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        currentLang={currentLang}
        defaultVillage="Sidhwan Kalan"
        defaultBlock={input.block.name}
      />

      {isLegalModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLegalModalOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-bold">Punjab Preservation of Subsoil Water Act, 2009</h3>
              <button className="modal-close-btn" onClick={() => setIsLegalModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body legal-act-modal-body">
              <div className="legal-act-full-text">
                <p>
                  The Punjab Preservation of Subsoil Water Act was enacted to arrest the alarming depletion of the groundwater table across Punjab.
                </p>
                <h4>Core Statutory Provisions:</h4>
                <ul>
                  <li>
                    <strong>Section 3(1) - Nursery Sowing:</strong> No farmer shall sow nursery of paddy before the 10th day of May of the agricultural year.
                  </li>
                  <li>
                    <strong>Section 3(2) - Paddy Transplantation:</strong> No farmer shall transplant paddy into the field before the date notified by the State Government for that district (June 11 for Group 1 districts or June 20 for Group 2 districts like Ludhiana, Sangrur, Patiala).
                  </li>
                  <li>
                    <strong>Section 5 - Penalties & Destruction:</strong> Any farmer violating these dates is liable to a penalty of <strong>₹10,000 per month per hectare</strong> (~₹4,047 per acre/month). The designated Agricultural Officer or Sub-Divisional Magistrate is empowered to enter the land, uproot and plough down the standing crop, and recover all expenses from the violator.
                  </li>
                </ul>
                <div className="pau-scientific-rationale">
                  <h5>Scientific Rationale from PAU Ludhiana:</h5>
                  <p>
                    During May and early June, temperatures routinely exceed 42°C–45°C. Evaporation demand is over 8–10 mm/day. Paddy transplanted in early June consumes up to 5,000 liters of groundwater for every single kilogram of rice produced. By delaying transplanting to June 20, the crop's peak vegetative and reproductive stages coincide with the arrival of the South-West Monsoon (July–August), saving 25% to 30% of groundwater without any yield loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
