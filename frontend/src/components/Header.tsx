import React from 'react';
import { Share2, Bell, ShieldAlert, Cloud } from 'lucide-react';
import { Language } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAwsModal: () => void;
  onOpenShareModal: () => void;
  onOpenLegalModal: () => void;
  onOpenSmsModal?: () => void;
  isLegalViolation: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAwsModal,
  onOpenShareModal,
  onOpenLegalModal,
  onOpenSmsModal,
  isLegalViolation,
}) => {
  return (
    <header className="site-header">
      {/* Top Slim Solid Brick Strip: Subsoil Water Act Warning */}
      <div className="top-brick-strip" role="banner" aria-label="Punjab Subsoil Water Act notice">
        <div className="app-container">
          <div className="brick-strip-content">
            <div className="brick-strip-message">
              <ShieldAlert size={16} className="brick-strip-icon" aria-hidden="true" />
              <span>
                {isLegalViolation
                  ? (currentLang === 'pa'
                      ? 'ਚੇਤਾਵਨੀ: 20 ਜੂਨ ਤੋਂ ਪਹਿਲਾਂ ਝੋਨਾ ਲਾਉਣਾ ਗੈਰ-ਕਾਨੂੰਨੀ ਹੈ। ₹10,000 ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਜੁਰਮਾਨੇ ਦਾ ਜੋਖਮ ਹੈ।'
                      : currentLang === 'hi'
                      ? 'चेतावनी: 20 जून से पहले धान रोपाई अवैध है। ₹10,000 प्रति हेक्टेयर जुर्माने का जोखिम है।'
                      : 'Punjab Subsoil Water Act warning: Transplanting before 20 June risks a ₹10,000/ha/month penalty.')
                  : (currentLang === 'pa'
                      ? 'ਪੰਜਾਬ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਕਾਨੂੰਨ: ਨੋਟੀਫਾਈਡ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਝੋਨਾ ਨਾ ਲਾਓ।'
                      : currentLang === 'hi'
                      ? 'पंजाब भूजल कानून: अधिसूचित तिथि से पहले धान न लगाएं।'
                      : 'Punjab Preservation of Subsoil Water Act: Sowing and transplanting dates strictly enforced.')}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenLegalModal}
              className="brick-strip-button"
            >
              {currentLang === 'pa' ? 'ਨਿਯਮ ਪੜ੍ਹੋ' : currentLang === 'hi' ? 'नियम पढ़ें' : 'Read the rules'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header-surface">
        <div className="app-container">
          <div className="header-main-row">
            {/* Title & One-Line Subtitle */}
            <div className="header-brand">
              <div className="header-title-line">
                <h1 className="header-app-name">JalFaasla</h1>
                <span className="header-punjabi-name">ਜਲ ਫ਼ਾਸਲਾ</span>
              </div>
              <p className="header-subtitle">
                {currentLang === 'pa'
                  ? 'ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ, ਟਿਊਬਵੈੱਲ ਘੰਟੇ ਅਤੇ ਖਰਚਾ ਬਚਾਉਣ ਵਾਲਾ ਸਲਾਹਕਾਰ'
                  : currentLang === 'hi'
                  ? 'पंजाब के किसानों हेतु भूजल, ट्यूबवेल घंटे एवं लागत बचत सलाहकार'
                  : 'Groundwater-aware crop & irrigation advisor for Punjab farmers'}
              </p>
            </div>

            {/* Actions: Pill Language Toggle, SMS, WhatsApp */}
            <div className="header-actions">
              {/* Pill Language Toggle (Selected = Solid Ink) */}
              <div className="pill-language-toggle" role="group" aria-label="Select language">
                <button
                  type="button"
                  className={`lang-pill-btn ${currentLang === 'en' ? 'selected' : ''}`}
                  onClick={() => onLanguageChange('en')}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`lang-pill-btn ${currentLang === 'pa' ? 'selected' : ''}`}
                  onClick={() => onLanguageChange('pa')}
                >
                  ਪੰਜਾਬੀ
                </button>
                <button
                  type="button"
                  className={`lang-pill-btn ${currentLang === 'hi' ? 'selected' : ''}`}
                  onClick={() => onLanguageChange('hi')}
                >
                  हिंदी
                </button>
              </div>

              {/* SMS Alerts Button (Outline) */}
              {onOpenSmsModal && (
                <button
                  type="button"
                  className="btn-sms-outline"
                  onClick={onOpenSmsModal}
                  title="Enable daily morning rain alert SMS"
                >
                  <Bell size={15} aria-hidden="true" />
                  <span>{currentLang === 'pa' ? 'SMS ਅਲਰਟ' : currentLang === 'hi' ? 'SMS अलर्ट' : 'SMS alert'}</span>
                </button>
              )}

              {/* WhatsApp Share Button (Solid Green) */}
              <button
                type="button"
                className="btn-whatsapp-solid"
                onClick={onOpenShareModal}
              >
                <Share2 size={15} aria-hidden="true" />
                <span>{currentLang === 'pa' ? 'ਵਟਸਐਪ' : 'WhatsApp'}</span>
              </button>

              {/* Architecture Info (Subtle Outline) */}
              <button
                type="button"
                className="btn-info-outline"
                onClick={onOpenAwsModal}
                title="System architecture"
              >
                <Cloud size={15} aria-hidden="true" />
                <span>Cloud</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principle: One large bold sentence, max 62ch, no box, mustard marker */}
      <div className="core-principle-wrapper">
        <div className="app-container">
          <p className="core-principle-sentence">
            {currentLang === 'pa' ? (
              <>
                ਸਿਰਫ਼ "ਪਾਣੀ ਬਚਾਓ" ਨਾ ਕਹੋ। ਕਿਸਾਨ ਨੂੰ ਦੱਸੋ:{' '}
                <mark className="mustard-marker">
                  ਤੁਹਾਡੇ ਖੇਤ ਵਿੱਚ ਕਿੰਨੇ ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰਹੇਗਾ ਅਤੇ ਕਿੰਨੇ ਰੁਪਏ ਬਚਣਗੇ।
                </mark>
              </>
            ) : currentLang === 'hi' ? (
              <>
                सिर्फ "पानी बचाओ" मत कहिए। किसान को बताइए:{' '}
                <mark className="mustard-marker">
                  आपके खेत पर कितने घंटे ट्यूबवेल बंद रहेगा और कितने ₹ बचेंगे।
                </mark>
              </>
            ) : (
              <>
                Don't say "save water." Tell a farmer:{' '}
                <mark className="mustard-marker">
                  "On your plot, delaying transplanting to the notified date and using alternate wetting-and-drying saves tube-well hours and money this season."
                </mark>
              </>
            )}
          </p>
        </div>
      </div>
    </header>
  );
};
