import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Send, 
  X, 
  CloudLightning 
} from 'lucide-react';

import { Language } from '../data/translations';

interface SmsAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  defaultVillage?: string;
  defaultBlock?: string;
}

export const SmsAlertModal: React.FC<SmsAlertModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  defaultVillage = 'Sidhwan Kalan',
  defaultBlock = 'Jagraon',
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [villageName, setVillageName] = useState(defaultVillage);
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell className="text-cyan" size={18} />
            </div>
            <div>
              <h3 className="modal-title font-bold" style={{ margin: 0, fontSize: '17px' }}>
                {currentLang === 'pa' ? 'ਰੋਜ਼ਾਨਾ ਮੌਸਮ ਤੇ ਮੀਂਹ SMS ਅਲਰਟ' : 'Daily Monsoon & Pump SMS Alerts'}
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Powered by Amazon SNS & PAU Agromet Observatory
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={32} className="text-emerald" />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                {currentLang === 'pa' ? 'ਅਲਰਟ ਸਫਲਤਾਪੂਰਵਕ ਚਾਲੂ ਹੋ ਗਿਆ!' : 'Alerts Successfully Activated!'}
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'pa'
                  ? `ਤੁਹਾਡੇ ਨੰਬਰ +91 ${phoneNumber} 'ਤੇ ਪਿੰਡ ${villageName} ਲਈ ਹਰ ਰੋਜ਼ ਸਵੇਰੇ 6:00 ਵਜੇ ਮੌਸਮ ਅਤੇ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖਣ ਦਾ ਸੁਨੇਹਾ ਭੇਜਿਆ ਜਾਵੇਗਾ।`
                  : `Your mobile +91 ${phoneNumber} has been registered to receive daily 6:00 AM PAU weather forecasts and rain shutdown triggers for ${villageName}.`}
              </p>

              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'left',
                fontSize: '12px',
                color: '#cbd5e1',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>
                  📩 ਨਮੂਨਾ SMS ਸੁਨੇਹਾ (Sample Alert):
                </div>
                "ਪੀਏਯੂ ਮੌਸਮ ਚਿਤਾਵਨੀ: ਅੱਜ ਰਾਤ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ। 14 ਘੰਟੇ ਅਤੇ ₹2,200 ਬਚਾਓ।"
              </div>

              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={onClose}
                style={{ width: '100%' }}
              >
                ਠੀਕ ਹੈ (Close)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.5 }}>
                {currentLang === 'pa'
                  ? 'ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ ਤਾਂ ਜੋ ਭਾਰੀ ਮੀਂਹ ਤੋਂ ਪਹਿਲਾਂ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖਣ ਦਾ ਮੁਫ਼ਤ SMS ਆ ਸਕੇ:'
                  : 'Subscribe your phone number to receive automated Amazon SNS morning monsoon alerts:'}
              </p>

              {/* Alert Channel Choice */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  ਸੁਨੇਹਾ ਪ੍ਰਾਪਤ ਕਰਨ ਦਾ ਤਰੀਕਾ (Notification Channel)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: channel === 'sms' ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.15)',
                      background: channel === 'sms' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                      color: channel === 'sms' ? '#38bdf8' : '#94a3b8',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    💬 SMS ਟੈਕਸਟ
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: channel === 'whatsapp' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                      background: channel === 'whatsapp' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                      color: channel === 'whatsapp' ? '#34d399' : '#94a3b8',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    📱 WhatsApp
                  </button>
                </div>
              </div>

              {/* Mobile Input */}
              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="farmer-mobile" style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  ਕਿਸਾਨ ਮੋਬਾਈਲ ਨੰਬਰ (10-Digit Mobile)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#64748b'
                  }}>
                    +91
                  </span>
                  <input
                    id="farmer-mobile"
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 48px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#f8fafc',
                      fontSize: '15px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              {/* Village */}
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="farmer-village" style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  ਪਿੰਡ ਦਾ ਨਾਂ (Village Name)
                </label>
                <input
                  id="farmer-village"
                  type="text"
                  value={villageName}
                  onChange={e => setVillageName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#f8fafc',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Highlights */}
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                marginBottom: '20px',
                fontSize: '12px',
                color: '#bae6fd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontWeight: 600 }}>
                  <CloudLightning size={14} className="text-cyan" />
                  ਮੁਫ਼ਤ ਸਰਕਾਰੀ ਸੁਵਿਧਾ (100% Free PAU Service):
                </div>
                ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ 6:00 ਵਜੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਅਤੇ ਝੋਨਾ ਲਵਾਈ ਮਿਤੀ ਨਿਯਮਾਂ ਦੀ ਜਾਣਕਾਰੀ।
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || phoneNumber.length < 10}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send size={15} />
                <span>
                  {isSubmitting 
                    ? (currentLang === 'pa' ? 'ਚਾਲੂ ਹੋ ਰਿਹਾ ਹੈ...' : 'Subscribing...')
                    : (currentLang === 'pa' ? 'SMS ਅਲਰਟ ਸ਼ੁਰੂ ਕਰੋ (Activate Alerts)' : 'Activate Daily SMS Alerts')}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
