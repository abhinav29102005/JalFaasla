import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Scale,
  FileText
} from 'lucide-react';
import { LegalCheckResult } from '../utils/advisoryEngine';
import { SUBSOIL_WATER_ACT } from '../data/rulesData';
import { Language, TRANSLATIONS } from '../data/translations';

interface LegalComplianceAlertProps {
  currentLang: Language;
  legal: LegalCheckResult;
  landSizeAcres: number;
}

export const LegalComplianceAlert: React.FC<LegalComplianceAlertProps> = ({
  currentLang,
  legal,
  landSizeAcres,
}) => {
  const t = TRANSLATIONS[currentLang];

  const notifiedDateFormatted = new Date(legal.notifiedDateRequired).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`card legal-card ${legal.isCompliant ? 'legal-compliant' : 'legal-warning'}`}>
      <div className="card-top-row">
        <div>
          <h2 className="section-title">
            <Scale className={`section-title-icon ${legal.isCompliant ? 'text-emerald' : 'text-amber'}`} size={22} />
            {currentLang === 'pa' 
              ? 'ਪੰਜਾਬ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਕਾਨੂੰਨ (2009) ਨਿਯਮ' 
              : 'Punjab Preservation of Subsoil Water Act, 2009'}
          </h2>
          <p className="section-subtitle">
            ਸਰਕਾਰੀ ਨੋਟੀਫਿਕੇਸ਼ਨ ਅਤੇ ਧਾਰਾ 3 ਅਤੇ 5 ਅਨੁਸਾਰ ਸਰਕਾਰੀ ਤਾਰੀਖ਼ਾਂ ਦੀ ਪਾਲਣਾ
          </p>
        </div>

        <div className={`status-badge-clean ${legal.isCompliant ? 'badge-ok' : 'badge-alert'}`}>
          {legal.isCompliant ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>
            {currentLang === 'pa' ? legal.statusBadgePa : legal.statusBadge}
          </span>
        </div>
      </div>

      <div className="legal-content-grid">
        {/* Left Notice */}
        <div className="legal-left-block">
          <div className="notified-callout">
            <Calendar size={22} className="text-cyan flex-shrink-0" />
            <div>
              <span className="notified-title">ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਝੋਨਾ ਲਵਾਈ ਮਿਤੀ:</span>
              <span className="notified-value font-mono font-bold text-white">
                {notifiedDateFormatted}
              </span>
            </div>
          </div>

          <p className="legal-explanation">
            {currentLang === 'pa' ? legal.messagePa : legal.message}
          </p>

          {!legal.isCompliant && (
            <div className="penalty-summary-box">
              <span className="penalty-label">ਸੰਭਾਵੀ ਕਾਨੂੰਨੀ ਜੁਰਮਾਨਾ (ਧਾਰਾ 5 ਤਹਿਤ):</span>
              <div className="penalty-amount-row">
                <span className="penalty-amount font-mono text-red font-bold">
                  ₹{legal.penaltyRiskInr.toLocaleString('en-IN')}
                </span>
                <span className="penalty-rate">
                  (₹10,000 ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਪ੍ਰਤੀ ਮਹੀਨਾ ਦੇ ਹਿਸਾਬ ਨਾਲ {landSizeAcres} ਏਕੜ 'ਤੇ)
                </span>
              </div>
              <p className="penalty-note">
                ਖੇਤੀਬਾੜੀ ਅਫ਼ਸਰ ਵੱਲੋਂ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਲਾਇਆ ਝੋਨਾ ਵਾਹੁਣ ਦਾ ਨੋਟਿਸ ਵੀ ਜਾਰੀ ਹੋ ਸਕਦਾ ਹੈ।
              </p>
            </div>
          )}
        </div>

        {/* Right Law Details */}
        <div className="legal-right-block">
          <h4 className="rules-heading font-bold text-white">
            <FileText size={16} className="inline-icon text-blue" /> ਕਾਨੂੰਨ ਦੀਆਂ ਜ਼ਰੂਰੀ ਸ਼ਰਤਾਂ:
          </h4>
          <ul className="rules-simple-list">
            <li>
              <strong>ਧਾਰਾ 3(1) - ਪਨੀਰੀ ਬਿਜਾਈ:</strong> 10 ਮਈ ਤੋਂ ਪਹਿਲਾਂ ਪਨੀਰੀ ਬੀਜਣਾ ਸਖ਼ਤ ਮਨ੍ਹਾ ਹੈ।
            </li>
            <li>
              <strong>ਧਾਰਾ 3(2) - ਖੇਤ ਵਿੱਚ ਲਵਾਈ:</strong> ਨੋਟੀਫਾਈਡ ਮਿਤੀ ({legal.notifiedDateRequired}) ਤੋਂ ਪਹਿਲਾਂ ਖੇਤਾਂ ਵਿੱਚ ਝੋਨਾ ਨਹੀਂ ਲਾਇਆ ਜਾ ਸਕਦਾ।
            </li>
            <li>
              <strong>ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ ਇਹ ਕਾਨੂੰਨ?</strong> ਮਈ ਅਤੇ ਜੂਨ ਦੇ ਪਹਿਲੇ ਹਫ਼ਤੇ ਗਰਮੀ (42°C-45°C) ਕਾਰਨ ਪਾਣੀ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਭਾਫ਼ ਬਣ ਕੇ ਉੱਡ ਜਾਂਦਾ ਹੈ। ਜੂਨ ਦੇ ਅਖੀਰ ਵਿੱਚ ਝੋਨਾ ਲਾਉਣ ਨਾਲ ਮੌਨਸੂਨ ਦਾ ਪਾਣੀ ਮਿਲਦਾ ਹੈ।
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
