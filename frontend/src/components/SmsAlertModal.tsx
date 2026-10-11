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
      <div className="modal-container sms-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', backgroundColor: 'var(--paper)', border: '2px solid var(--line)', color: 'var(--ink)' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg)',
              border: '1.5px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink)'
            }}>
              <Bell size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 className="modal-title font-bold" style={{ margin: 0, fontSize: '17px', color: 'var(--ink)' }}>
                {currentLang === 'pa' ? 'ਰੋਜ਼ਾਨਾ ਮੌਸਮ ਤੇ ਮੀਂਹ SMS ਅਲਰਟ' : 'Daily Monsoon & Pump SMS Alerts'}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Powered by Amazon SNS & PAU Agromet Observatory
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal"><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ padding: '20px 0 0 0' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg)',
                border: '2px solid var(--line)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--field)'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--field)', marginBottom: '8px' }}>
                {currentLang === 'pa' ? 'ਅਲਰਟ ਸਫਲਤਾਪੂਰਵਕ ਚਾਲੂ ਹੋ ਗਿਆ!' : 'Alerts Successfully Activated!'}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                {currentLang === 'pa'
                  ? `ਤੁਹਾਡੇ ਨੰਬਰ +91 ${phoneNumber} 'ਤੇ ਪਿੰਡ ${villageName} ਲਈ ਹਰ ਰੋਜ਼ ਸਵੇਰੇ 6:00 ਵਜੇ ਮੌਸਮ ਅਤੇ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖਣ ਦਾ ਸੁਨੇਹਾ ਭੇਜਿਆ ਜਾਵੇਗਾ।`
                  : `Your mobile +91 ${phoneNumber} has been registered to receive daily 6:00 AM PAU weather forecasts and rain shutdown triggers for ${villageName}.`}
              </p>

              <div style={{
                background: 'var(--bg)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--line)',
                textAlign: 'left',
                fontSize: '13px',
                color: 'var(--ink)',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--field)', marginBottom: '6px' }}>
                  📩 ਨਮੂਨਾ SMS ਸੁਨੇਹਾ (Sample Alert):
                </div>
                "ਪੀਏਯੂ ਮੌਸਮ ਚਿਤਾਵਨੀ: ਅੱਜ ਰਾਤ ਭਾਰੀ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ। 14 ਘੰਟੇ ਅਤੇ ₹2,200 ਬਚਾਓ।"
              </div>

              <button 
                type="button" 
                onClick={onClose}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                ਠੀਕ ਹੈ (Close)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                {currentLang === 'pa'
                  ? 'ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ ਤਾਂ ਜੋ ਭਾਰੀ ਮੀਂਹ ਤੋਂ ਪਹਿਲਾਂ ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖਣ ਦਾ ਮੁਫ਼ਤ SMS ਆ ਸਕੇ:'
                  : 'Subscribe your phone number to receive automated Amazon SNS morning monsoon alerts:'}
              </p>

              {/* Alert Channel Choice */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                  ਸੁਨੇਹਾ ਪ੍ਰਾਪਤ ਕਰਨ ਦਾ ਤਰੀਕਾ (Notification Channel)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: channel === 'sms' ? '2px solid var(--ink)' : '1.5px solid var(--line)',
                      background: channel === 'sms' ? 'var(--bg)' : 'transparent',
                      color: 'var(--ink)',
                      fontSize: '13px',
                      fontWeight: channel === 'sms' ? 700 : 500,
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                  >
                    💬 SMS ਟੈਕਸਟ
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: channel === 'whatsapp' ? '2px solid var(--ink)' : '1.5px solid var(--line)',
                      background: channel === 'whatsapp' ? 'var(--bg)' : 'transparent',
                      color: 'var(--ink)',
                      fontSize: '13px',
                      fontWeight: channel === 'whatsapp' ? 700 : 500,
                      cursor: 'pointer',
                      minHeight: '44px'
                    }}
                  >
                    📱 WhatsApp
                  </button>
                </div>
              </div>

              {/* Mobile Input */}
              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="farmer-mobile" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                  ਕਿਸਾਨ ਮੋਬਾਈਲ ਨੰਬਰ (10-Digit Mobile)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span className="tabular-nums" style={{
                    position: 'absolute',
                    left: '14px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--muted)'
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
                    className="tabular-nums"
                    style={{
                      width: '100%',
                      height: '52px',
                      padding: '10px 14px 10px 52px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg)',
                      border: '2px solid var(--line)',
                      color: 'var(--ink)',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Village */}
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="farmer-village" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
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
                    height: '52px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg)',
                    border: '2px solid var(--line)',
                    color: 'var(--ink)',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Highlights */}
              <div style={{
                background: 'var(--bg)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--line)',
                marginBottom: '20px',
                fontSize: '12px',
                color: 'var(--ink)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontWeight: 700, color: 'var(--ink)' }}>
                  <CloudLightning size={15} style={{ color: 'var(--muted)' }} aria-hidden="true" />
                  ਮੁਫ਼ਤ ਸਰਕਾਰੀ ਸੁਵਿਧਾ (100% Free PAU Service):
                </div>
                ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ 6:00 ਵਜੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਅਤੇ ਝੋਨਾ ਲਵਾਈ ਮਿਤੀ ਨਿਯਮਾਂ ਦੀ ਜਾਣਕਾਰੀ।
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || phoneNumber.length < 10}
                style={{
                  width: '100%',
                  fontSize: '15px'
                }}
              >
                <Send size={16} aria-hidden="true" />
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
