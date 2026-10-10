import React from 'react';
import { Droplet, Languages, Share2, Server, AlertTriangle } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAwsModal: () => void;
  onOpenShareModal: () => void;
  onOpenLegalModal: () => void;
  isLegalViolation: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAwsModal,
  onOpenShareModal,
  onOpenLegalModal,
  isLegalViolation,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="site-header">
      {/* Top Statutory Advisory Bar */}
      <div className={`top-rule-bar ${isLegalViolation ? 'top-rule-alert' : ''}`}>
        <div className="app-container">
          <div className="top-rule-content">
            <div className="rule-text-left">
              <AlertTriangle size={15} className="flex-shrink-0" />
              <span>
                {isLegalViolation
                  ? (currentLang === 'pa'
                      ? 'ਚੇਤਾਵਨੀ: 20 ਜੂਨ ਤੋਂ ਪਹਿਲਾਂ ਝੋਨਾ ਲਾਉਣਾ ਗੈਰ-ਕਾਨੂੰਨੀ ਹੈ। ₹10,000 ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਜੁਰਮਾਨਾ ਲੱਗ ਸਕਦਾ ਹੈ!'
                      : currentLang === 'hi'
                      ? 'चेतावनी: 20 जून से पहले धान रोपाई अवैध है। ₹10,000 प्रति हेक्टेयर जुर्माना लग सकता है!'
                      : 'PUNJAB SUBSOIL WATER ACT: Transplanting before 20 June is illegal. Risks ₹10,000/ha/month penalty!')
                  : (currentLang === 'pa'
                      ? 'ਪੰਜਾਬ ਸਰਕਾਰ ਨਿਯਮ: ਨੋਟੀਫਾਈਡ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਝੋਨਾ ਨਾ ਲਾਓ। ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਬਚਾਓ।'
                      : 'Punjab Preservation of Subsoil Water Act: Enforcing notified sowing and transplanting dates.')}
              </span>
            </div>
            <button 
              type="button"
              onClick={onOpenLegalModal}
              className="top-rule-btn"
            >
              {currentLang === 'pa' ? 'ਕਾਨੂੰਨੀ ਨਿਯਮ' : currentLang === 'hi' ? 'नियम पढ़ें' : 'Act Rules'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Symmetrical Navbar */}
      <div className="navbar-wrapper">
        <div className="app-container">
          <div className="navbar-container">
            <div className="navbar-brand">
              <div className="navbar-logo-box">
                <Droplet size={26} className="navbar-logo-icon" />
              </div>
              <div className="navbar-title-block">
                <div className="navbar-title-row">
                  <h1 className="navbar-title">JalFaasla</h1>
                  <span className="navbar-subtitle-pa">ਜਲ ਫ਼ਾਸਲਾ</span>
                  <span className="navbar-gov-tag">PAU Ludhiana & CGWB Sentinel Data</span>
                </div>
                <p className="navbar-tagline">
                  {currentLang === 'pa' 
                    ? 'ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ, ਟਿਊਬਵੈੱਲ ਘੰਟੇ ਅਤੇ ਬੱਚਤ ਸਲਾਹਕਾਰ' 
                    : currentLang === 'hi'
                    ? 'पंजाब के किसानों हेतु भूजल, ट्यूबवेल घंटे एवं लागत बचत सलाहकार'
                    : 'Groundwater-Aware Crop & Irrigation Advisor for Punjab Farmers'}
                </p>
              </div>
            </div>

            <div className="navbar-actions">
              {/* Language Switcher */}
              <div className="lang-group">
                <span className="lang-label" title="Select Language">
                  <Languages size={14} />
                </span>
                <button
                  type="button"
                  className={`lang-option ${currentLang === 'en' ? 'active' : ''}`}
                  onClick={() => onLanguageChange('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`lang-option ${currentLang === 'pa' ? 'active' : ''}`}
                  onClick={() => onLanguageChange('pa')}
                >
                  ਪੰਜਾਬੀ
                </button>
                <button
                  type="button"
                  className={`lang-option ${currentLang === 'hi' ? 'active' : ''}`}
                  onClick={() => onLanguageChange('hi')}
                >
                  हिंदी
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                className="nav-btn nav-btn-share"
                onClick={onOpenShareModal}
              >
                <Share2 size={15} />
                <span>{currentLang === 'pa' ? 'ਵਟਸਐਪ' : 'WhatsApp'}</span>
              </button>

              <button
                type="button"
                className="nav-btn nav-btn-aws"
                onClick={onOpenAwsModal}
              >
                <Server size={15} />
                <span>AWS Cloud</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical Insight Strip */}
      <div className="insight-blue-strip">
        <div className="app-container">
          <div className="insight-strip-inner">
            <span className="insight-strip-lead">
              {currentLang === 'pa' ? 'ਮੁੱਖ ਸੱਚਾਈ' : 'CORE PRINCIPLE'}
            </span>
            <span className="insight-strip-text">
              {currentLang === 'pa'
                ? 'ਸਿਰਫ਼ "ਪਾਣੀ ਬਚਾਓ" ਨਾ ਕਹੋ। ਕਿਸਾਨ ਨੂੰ ਦੱਸੋ: ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰਹੇਗਾ ਅਤੇ ਕਿੰਨੇ ਰੁਪਏ ਬਚਣਗੇ।'
                : currentLang === 'hi'
                ? 'सिर्फ "पानी बचाओ" मत कहिए। किसान को बताइए: आपके खेत पर कितने घंटे ट्यूबवेल बंद रहेगा और कितने ₹ बचेंगे।'
                : 'Don’t say "save water." Tell a farmer: "On your plot, delaying transplanting to the notified date and using alternate wetting-and-drying saves X tube-well hours and ₹Y this season."'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
