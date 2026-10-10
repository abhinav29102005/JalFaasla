import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  Droplet
} from 'lucide-react';
import { FarmerAdvisoryResult } from '../utils/advisoryEngine';
import { Language } from '../data/translations';

interface ShareableAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisory: FarmerAdvisoryResult;
  currentLang: Language;
}

export const ShareableAdvisoryModal: React.FC<ShareableAdvisoryModalProps> = ({
  isOpen,
  onClose,
  advisory,
  currentLang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { input, legalCheck, headlinePunchline, recommendedShortPaddyAwd } = advisory;

  const whatsappMessage = `*🌾 JalFaasla (ਜਲ ਫ਼ਾਸਲਾ) Farmer Advisory*\n\n` +
    `📍 *Plot:* ${input.landSizeAcres} Acres in ${input.block.name}, Punjab\n` +
    `💧 *Water Table:* ${input.tubewellDepthM}m (${input.block.cgwbCategory})\n` +
    `⚖️ *Punjab Subsoil Act Status:* ${legalCheck.statusBadge}\n` +
    `📅 *Notified Transplanting Date:* ${legalCheck.notifiedDateRequired}\n\n` +
    `💡 *THE JALFAASLA PUNCHLINE:*\n` +
    `"${headlinePunchline}"\n\n` +
    `⚡ *Season Savings Summary:*\n` +
    `• Tube-well Running Saved: *${recommendedShortPaddyAwd.tubewellHoursSaved} Hours*\n` +
    `• Operating Cost Saved: *₹${recommendedShortPaddyAwd.costSavedInr.toLocaleString('en-IN')}*\n` +
    `• Groundwater Conserved: *${recommendedShortPaddyAwd.waterSavedM3Total.toLocaleString('en-IN')} m³*\n` +
    `• Method: *PR-126 + AWD (Pani-Pipe)*\n\n` +
    `📲 Generated via JalFaasla | Punjab Groundwater Advisory Platform`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppClick = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container share-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Share2 className="text-emerald" size={22} />
            <h3 className="modal-title">Shareable Farmer Advisory</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Visual Printable Card Preview */}
          <div className="advisory-card-preview" id="printable-advisory">
            <div className="advisory-preview-header">
              <div className="preview-logo-brand">
                <img src="/logo.svg" alt="JalFaasla" className="preview-logo-img" />
                <div>
                  <h4 className="preview-brand-title">JalFaasla • ਜਲ ਫ਼ਾਸਲਾ</h4>
                  <span className="preview-brand-sub">Government & PAU Ground-Truth Agricultural Advisory</span>
                </div>
              </div>
              <span className="preview-date-stamp font-mono text-xs">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="advisory-highlight-banner">
              <Sparkles size={20} className="text-amber flex-shrink-0" />
              <p className="preview-punchline-text font-bold">
                "{headlinePunchline}"
              </p>
            </div>

            <div className="preview-meta-grid">
              <div className="preview-meta-item">
                <span className="meta-lbl">Farmer Plot:</span>
                <span className="meta-val font-mono">{input.landSizeAcres} Acres • {input.block.name}</span>
              </div>
              <div className="preview-meta-item">
                <span className="meta-lbl">Water Table:</span>
                <span className="meta-val font-mono">{input.tubewellDepthM} m ({input.block.cgwbCategory})</span>
              </div>
              <div className="preview-meta-item">
                <span className="meta-lbl">Legal Notified Date:</span>
                <span className="meta-val font-mono font-bold text-emerald">{legalCheck.notifiedDateRequired}</span>
              </div>
              <div className="preview-meta-item">
                <span className="meta-lbl">Legal Status:</span>
                <span className="meta-val font-mono">{legalCheck.statusBadge}</span>
              </div>
            </div>

            <div className="preview-metrics-strip">
              <div className="p-metric-box">
                <span className="p-m-val font-mono font-bold text-cyan">{recommendedShortPaddyAwd.tubewellHoursSaved} Hrs</span>
                <span className="p-m-lbl">Tube-Well Saved</span>
              </div>
              <div className="p-metric-box">
                <span className="p-m-val font-mono font-bold text-emerald">₹{recommendedShortPaddyAwd.costSavedInr.toLocaleString('en-IN')}</span>
                <span className="p-m-lbl">Fuel / Power Saved</span>
              </div>
              <div className="p-metric-box">
                <span className="p-m-val font-mono font-bold text-blue">{recommendedShortPaddyAwd.waterSavedPercent}%</span>
                <span className="p-m-lbl">Water Conserved</span>
              </div>
            </div>

            <div className="preview-footer-rule">
              <span>⚠️ Punjab Preservation of Subsoil Water Act: Penalties of ₹10,000/ha/month for transplanting before notified date.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-actions-row">
            <button 
              type="button" 
              className="btn btn-whatsapp flex-1"
              onClick={handleWhatsAppClick}
            >
              <MessageSquare size={18} />
              <span>Send via WhatsApp</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCopy}
            >
              {copied ? <Check size={18} className="text-emerald" /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={18} />
              <span>Print Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
