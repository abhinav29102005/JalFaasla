import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Scale,
  FileText
} from 'lucide-react';
import { LegalCheckResult } from '../utils/advisoryEngine';
import { Language } from '../data/translations';

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
  const notifiedDateFormatted = new Date(legal.notifiedDateRequired).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`legal-alert-section ${legal.isCompliant ? 'is-compliant' : 'is-violation'}`}>
      <div className="legal-header-row">
        <div>
          <h2 className="legal-title">
            <Scale className="inline-icon" size={20} aria-hidden="true" />
            {currentLang === 'pa' 
              ? 'ਪੰਜਾਬ ਜ਼ਮੀਨਦੋਜ਼ ਪਾਣੀ ਕਾਨੂੰਨ (2009)' 
              : 'Punjab Preservation of Subsoil Water Act, 2009'}
          </h2>
          <p className="legal-subtitle">
            {currentLang === 'pa'
              ? 'ਸਰਕਾਰੀ ਨੋਟੀਫਿਕੇਸ਼ਨ ਅਤੇ ਧਾਰਾ 3 ਅਤੇ 5 ਅਨੁਸਾਰ ਤਾਰੀਖ਼ਾਂ ਦੀ ਪਾਲਣਾ'
              : 'Mandatory compliance with notified paddy transplantation timeline'}
          </p>
        </div>

        <div className={`legal-status-indicator ${legal.isCompliant ? 'status-pass' : 'status-fail'}`}>
          {legal.isCompliant ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
          <span>
            {currentLang === 'pa' ? legal.statusBadgePa : legal.statusBadge}
          </span>
        </div>
      </div>

      <div className="legal-details-split">
        {/* Left Notice */}
        <div className="legal-summary-pane">
          <div className="notified-date-chip">
            <Calendar size={18} className="inline-icon text-muted" aria-hidden="true" />
            <div>
              <span className="notified-date-label">
                {currentLang === 'pa' ? 'ਸਰਕਾਰੀ ਨੋਟੀਫਾਈਡ ਝੋਨਾ ਲਵਾਈ ਮਿਤੀ:' : 'State notified transplanting date:'}
              </span>{' '}
              <strong className="notified-date-val tabular-nums">
                {notifiedDateFormatted}
              </strong>
            </div>
          </div>

          <p className="legal-explanation-body">
            {currentLang === 'pa' ? legal.messagePa : legal.message}
          </p>

          {!legal.isCompliant && (
            <div className="penalty-brick-callout">
              <span className="penalty-callout-title font-bold text-alert">
                {currentLang === 'pa' ? 'ਸੰਭਾਵੀ ਕਾਨੂੰਨੀ ਜੁਰਮਾਨਾ (ਧਾਰਾ 5 ਤਹਿਤ):' : 'Potential statutory penalty (Section 5):'}
              </span>
              <div className="penalty-figure-row">
                <span className="penalty-number tabular-nums font-bold text-alert">
                  ₹{(legal.penaltyRiskInr ?? 0).toLocaleString('en-IN')}
                </span>
                <span className="penalty-rate-note">
                  (₹10,000/ha/month on {landSizeAcres} acres)
                </span>
              </div>
              <p className="penalty-sub-warning">
                {currentLang === 'pa'
                  ? 'ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ ਵੱਲੋਂ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਲਾਇਆ ਝੋਨਾ ਵਾਹੁਣ ਦਾ ਹੁਕਮ ਵੀ ਜਾਰੀ ਹੋ ਸਕਦਾ ਹੈ।'
                  : 'Agricultural officer is empowered to uproot and plough down premature crop.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Law Details */}
        <div className="legal-rules-pane">
          <h4 className="rules-pane-heading font-bold">
            <FileText size={16} className="inline-icon text-muted" aria-hidden="true" />
            {currentLang === 'pa' ? 'ਕਾਨੂੰਨ ਦੀਆਂ ਜ਼ਰੂਰੀ ਸ਼ਰਤਾਂ:' : 'Core statutory provisions:'}
          </h4>
          <ul className="rules-flat-list">
            <li>
              <strong>{currentLang === 'pa' ? 'ਧਾਰਾ 3(1) — ਪਨੀਰੀ ਬਿਜਾਈ:' : 'Section 3(1) — Nursery sowing:'}</strong>{' '}
              {currentLang === 'pa' ? '10 ਮਈ ਤੋਂ ਪਹਿਲਾਂ ਪਨੀਰੀ ਬੀਜਣਾ ਮਨ੍ਹਾ ਹੈ।' : 'No sowing of paddy nursery before 10 May.'}
            </li>
            <li>
              <strong>{currentLang === 'pa' ? 'ਧਾਰਾ 3(2) — ਖੇਤ ਵਿੱਚ ਲਵਾਈ:' : 'Section 3(2) — Field transplantation:'}</strong>{' '}
              {currentLang === 'pa' ? `ਨੋਟੀਫਾਈਡ ਮਿਤੀ (${legal.notifiedDateRequired}) ਤੋਂ ਪਹਿਲਾਂ ਖੇਤਾਂ ਵਿੱਚ ਝੋਨਾ ਨਹੀਂ ਲਾਇਆ ਜਾ ਸਕਦਾ।` : `No transplanting before notified date (${legal.notifiedDateRequired}).`}
            </li>
            <li>
              <strong>{currentLang === 'pa' ? 'ਵਿਗਿਆਨਕ ਕਾਰਨ:' : 'PAU scientific rationale:'}</strong>{' '}
              {currentLang === 'pa' ? 'ਮਈ-ਜੂਨ ਵਿੱਚ ਗਰਮੀ (42°C-45°C) ਕਾਰਨ ਪਾਣੀ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਉੱਡ ਜਾਂਦਾ ਹੈ। ਜੂਨ ਅਖੀਰ ਵਿੱਚ ਲਵਾਈ ਨਾਲ ਮੌਨਸੂਨ ਦਾ ਪਾਣੀ ਮਿਲਦਾ ਹੈ।' : 'High evaporative demand (42°C-45°C) in early June consumes 5,000L water/kg rice. Delaying captures monsoon rain.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
