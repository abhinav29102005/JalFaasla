import React from 'react';
import { Droplet } from 'lucide-react';
import { Language } from '../data/translations';

interface FooterProps {
  currentLang: Language;
  onOpenAwsModal: () => void;
  onOpenLegalModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenAwsModal,
  onOpenLegalModal,
}) => {
  return (
    <footer className="site-footer">
      <div className="app-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="brand-logo-inline">
              <Droplet size={20} className="text-blue" />
              <span className="footer-brand-title">JalFaasla • ਜਲ ਫ਼ਾਸਲਾ</span>
            </div>
            <p className="footer-brand-desc">
              Groundwater-aware crop & irrigation decision engine engineered for Punjab's 1.2 million farm holdings.
            </p>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-col-title">Scientific Backing</h5>
            <ul className="footer-links-list">
              <li>
                <a 
                  href="https://cgwb.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  className="footer-link"
                >
                  CGWB Central Ground Water Board (Ludhiana Sentinel Wells)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.pau.edu" 
                  target="_blank" 
                  rel="noreferrer"
                  className="footer-link"
                >
                  Punjab Agricultural University (PAU Package of Practices)
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenLegalModal}
                  className="footer-link-btn"
                >
                  Punjab Preservation of Subsoil Water Act (Notified Windows)
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-col-title">Technology & Cloud</h5>
            <ul className="footer-links-list">
              <li>
                <button 
                  onClick={onOpenAwsModal}
                  className="footer-link-btn text-cyan"
                >
                  AWS Cloud Architecture (Amplify, Lambda, SageMaker)
                </button>
              </li>
              <li>
                <span className="footer-static-text">
                  Strands Agents SDK Conversational Core
                </span>
              </li>
              <li>
                <span className="footer-static-text">
                  Real-time Agro-Meteorological Weather Ingestion
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-legal-copy">
            <span>© 2026 JalFaasla. Dedicated to Punjab's Farmers and Groundwater Sustainability.</span>
          </div>
          <div className="footer-subtext-pill">
            <Droplet size={14} className="text-cyan" />
            <span>"ਨਾ ਕਹੋ ਪਾਣੀ ਬਚਾਓ, ਦੱਸੋ ਕਿੰਨੇ ਘੰਟੇ ਅਤੇ ਰੁਪਏ ਬਚਣਗੇ!"</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
