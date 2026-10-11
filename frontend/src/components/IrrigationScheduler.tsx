import React from 'react';
import { 
  CloudRain, 
  Sun, 
  CloudLightning, 
  Cloud, 
  Clock, 
  HelpCircle,
  Wind,
  Droplets,
  Thermometer,
  Bell
} from 'lucide-react';
import { DayForecast } from '../data/weatherData';
import { Language, TRANSLATIONS } from '../data/translations';
import { WeatherForecastResponse, IrrigationDayAdvice } from '../services/api';

interface IrrigationSchedulerProps {
  currentLang: Language;
  forecast: DayForecast[];
  pumpHp: number;
  powerSource: 'diesel' | 'electric' | 'solar';
  liveWeather?: WeatherForecastResponse | null;
  liveSchedule?: IrrigationDayAdvice[] | null;
  onOpenSmsModal?: () => void;
}

export const IrrigationScheduler: React.FC<IrrigationSchedulerProps> = ({
  currentLang,
  forecast,
  pumpHp,
  powerSource,
  liveWeather,
  liveSchedule,
  onOpenSmsModal,
}) => {

  const t = TRANSLATIONS[currentLang];
  const upcomingRainDay = forecast.find(d => d.rainfallMm >= 15 || d.rainProbabilityPercent >= 70);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Heavy Thunderstorm':
      case 'Moderate Rain':
      case 'SKIP PUMPING (RAIN)':
        return <CloudLightning size={24} className="text-cyan" />;
      case 'Light Rain':
      case 'CHECK TUBE':
        return <CloudRain size={24} className="text-cyan" />;
      case 'Partly Cloudy':
      case 'Cloudy':
        return <Cloud size={24} className="text-muted" />;
      default:
        return <Sun size={24} className="text-amber" />;
    }
  };

  return (
    <div className="card scheduler-card">
      <div className="card-top-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <CloudRain className="section-title-icon text-cyan" size={22} />
              {currentLang === 'pa' ? '7 ਦਿਨਾਂ ਦਾ ਮੌਸਮ ਅਤੇ ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ' : '7-Day Weather & Irrigation Schedule'}
            </h2>
            {liveWeather && (
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                ✓ PAU Agromet Live
              </span>
            )}
          </div>
          <p className="section-subtitle">
            {liveWeather?.station || 'ਮੀਂਹ ਦੇ ਅਨੁਮਾਨ ਅਨੁਸਾਰ ਟਿਊਬਵੈੱਲ ਚਲਾਉਣ ਜਾਂ ਬੰਦ ਰੱਖਣ ਦੀ ਸਲਾਹ'}
          </p>
        </div>

        <div className="timing-box">
          <Clock size={15} className="text-cyan inline-icon" />
          <span>ਪਾਣੀ ਲਾਉਣ ਦਾ ਸਹੀ ਸਮਾਂ: ਸਵੇਰੇ 5:00 - 8:30 ਜਾਂ ਸ਼ਾਮ 6:30 - 9:00</span>
        </div>
      </div>

      {/* Live Agromet Metrics Bar if available */}
      {liveWeather && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer size={18} className="text-amber" />
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>ਤਾਪਮਾਨ (Temp)</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{liveWeather.current_temperature_c}°C</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplets size={18} className="text-cyan" />
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>ਨਮੀ (Humidity)</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{liveWeather.humidity_pct}%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={18} className="text-blue" />
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>ਹਵਾ (Wind)</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{liveWeather.wind_speed_kmh} km/h</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cloud size={18} className="text-muted" />
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>ਮੌਨਸੂਨ ਆਮਦ (Onset)</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>{liveWeather.monsoon_onset_forecast}</div>
            </div>
          </div>
        </div>
      )}

      {/* Rain Alert Banner in Blue/Navy */}
      {(upcomingRainDay || liveWeather?.rain_alert) && (
        <div className="rain-alert-blue-box">
          <div className="rain-alert-left">
            <CloudLightning size={32} className="text-cyan flex-shrink-0" />
            <div>
              <span className="rain-tag text-cyan font-bold">
                ਮੀਂਹ ਦੀ ਖਾਸ ਚੇਤਾਵਨੀ (PAU AGROMET WEATHER ALERT)
              </span>
              <h3 className="rain-heading font-bold text-white">
                {liveWeather?.rain_alert || `${upcomingRainDay?.dayNamePa} ਨੂੰ ${upcomingRainDay?.rainfallMm} ਮਿਲੀਮੀਟਰ ਚੰਗਾ ਮੀਂਹ ਪੈਣ ਦਾ ਅਨੁਮਾਨ ਹੈ!`}
              </h3>
              <p className="rain-advice">
                {liveWeather?.advisory_for_pumps || 'ਵੀਰਵਾਰ ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਟਿਊਬਵੈੱਲ ਬਿਲਕੁਲ ਨਾ ਚਲਾਓ। ਖੇਤਾਂ ਦੀਆਂ ਵੱਟਾਂ ਉੱਚੀਆਂ ਰੱਖੋ। ਇਕੱਲਾ ਇਹ ਮੀਂਹ ਸੰਭਾਲਣ ਨਾਲ ਤੁਹਾਡੇ 14 ਘੰਟੇ ਟਿਊਬਵੈੱਲ ਅਤੇ ₹2,200 ਦਾ ਡੀਜ਼ਲ ਬਚੇਗਾ।'}
              </p>
              {onOpenSmsModal && (
                <button
                  type="button"
                  onClick={onOpenSmsModal}
                  style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Bell size={13} />
                  <span>{currentLang === 'pa' ? 'ਸਵੇਰੇ 6:00 ਵਜੇ SMS ਅਲਰਟ ਸ਼ੁਰੂ ਕਰੋ' : 'Enable 6:00 AM SMS Alert'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* 7-Day Clean Cards Grid */}
      <div className="days-forecast-grid">
        {liveSchedule && liveSchedule.length > 0 ? (
          liveSchedule.map((advice, idx) => {
            const isRain = advice.action.includes('SKIP') || advice.forecast_rain_mm >= 10;
            return (
              <div 
                key={idx} 
                className={`single-day-box ${isRain ? 'day-rain-active' : ''} ${idx === 0 ? 'day-today' : ''}`}
              >
                <div className="day-title-row">
                  <span className="day-txt font-bold">{advice.day_name}</span>
                  <span className="day-date-txt font-mono text-xs">
                    {advice.date_str}
                  </span>
                </div>

                <div className="day-icon-row">
                  {getConditionIcon(advice.action)}
                  <span className="day-cond-name font-mono text-xs">{advice.awd_water_tube_reading_cm}</span>
                </div>

                <div className="day-rain-stat font-mono">
                  ਮੀਂਹ: <strong>{advice.forecast_rain_mm} mm</strong>
                </div>

                <div className="day-temp-stat font-mono text-xs">
                  Max: {advice.temp_max_c}°C | ET: {advice.evapotranspiration_mm}mm
                </div>

                <div className={`day-status-pill ${isRain ? 'status-skip' : advice.action.includes('NO') ? 'status-ok' : 'status-skip'}`}>
                  {advice.action}
                </div>

                <p className="day-short-tip">
                  {advice.reason}
                </p>
              </div>
            );
          })
        ) : (
          forecast.map((day, idx) => {
            const isRain = day.irrigationAction === 'SKIP_RAIN_EXPECTED';
            return (
              <div 
                key={idx} 
                className={`single-day-box ${isRain ? 'day-rain-active' : ''} ${idx === 0 ? 'day-today' : ''}`}
              >
                <div className="day-title-row">
                  <span className="day-txt font-bold">{day.dayNamePa}</span>
                  <span className="day-date-txt font-mono text-xs">
                    {new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="day-icon-row">
                  {getConditionIcon(day.condition)}
                  <span className="day-cond-name">{day.conditionPa}</span>
                </div>

                <div className="day-rain-stat font-mono">
                  ਮੀਂਹ: <strong>{day.rainfallMm} mm</strong> ({day.rainProbabilityPercent}%)
                </div>

                <div className="day-temp-stat font-mono text-xs">
                  {day.tempMaxC}°C / {day.tempMinC}°C
                </div>

                <div className={`day-status-pill ${isRain ? 'status-skip' : 'status-ok'}`}>
                  {isRain ? '🚫 ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖੋ' : '💧 ਪਾਣੀ ਲਾਓ (ਸ਼ਾਮ)'}
                </div>

                <p className="day-short-tip">
                  {day.actionNotePa}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Village Farmer Pani-Pipe Guide */}
      <div className="pani-pipe-village-guide">
        <h4 className="pipe-guide-title font-bold text-white">
          <HelpCircle size={18} className="text-cyan inline-icon" /> ਪਾਣੀ-ਪਾਈਪ ਤਰੀਕਾ ਕੀ ਹੈ ਅਤੇ ਕਿਵੇਂ ਵਰਤਣਾ ਹੈ?
        </h4>
        <div className="pipe-simple-steps">
          <div className="simple-step">
            <span className="step-badge">1</span>
            <div>
              <strong>ਪਾਈਪ ਲਗਾਓ:</strong> ਖੇਤ ਵਿੱਚ ਝੋਨਾ ਲਾਉਣ ਤੋਂ 2 ਹਫ਼ਤੇ ਬਾਅਦ, ਇੱਕ 40cm ਲੰਬੀ ਪਲਾਸਟਿਕ ਪਾਈਪ (ਹੇਠਲੇ 20cm ਵਿੱਚ ਸੁਰਾਖ਼ ਹੋਣ) ਨੂੰ 20cm ਜ਼ਮੀਨ ਵਿੱਚ ਗੱਡ ਦਿਓ।
            </div>
          </div>
          <div className="simple-step">
            <span className="step-badge">2</span>
            <div>
              <strong>ਪਾਣੀ ਵੇਖੋ:</strong> ਜਦੋਂ ਤੱਕ ਪਾਈਪ ਵਿੱਚ ਪਾਣੀ ਜ਼ਮੀਨ ਤੋਂ 5cm ਹੇਠਾਂ ਨਾ ਜਾਵੇ, ਦੂਜਾ ਪਾਣੀ ਨਾ ਲਾਓ। ਲਗਾਤਾਰ ਪਾਣੀ ਖੜ੍ਹਾ ਰੱਖਣ ਦੀ ਲੋੜ ਨਹੀਂ।
            </div>
          </div>
          <div className="simple-step">
            <span className="step-badge">3</span>
            <div>
              <strong>ਨਿਸਰਣ ਵੇਲੇ ਧਿਆਨ:</strong> ਜਦੋਂ ਝੋਨਾ ਨਿਸਰ ਰਿਹਾ ਹੋਵੇ (ਫੁੱਲ ਪੈਣ ਵੇਲੇ ਲਗਭਗ 14 ਦਿਨ), ਉਦੋਂ ਖੇਤ ਵਿੱਚ 2-3 ਇੰਚ ਪਾਣੀ ਲਗਾਤਾਰ ਖੜ੍ਹਾ ਰੱਖੋ ਤਾਂ ਜੋ ਫੋਕ ਨਾ ਬਣੇ।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
