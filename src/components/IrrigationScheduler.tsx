import React from 'react';
import { 
  CloudRain, 
  Sun, 
  CloudLightning, 
  Cloud, 
  Clock, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { DayForecast } from '../data/weatherData';
import { Language, TRANSLATIONS } from '../data/translations';

interface IrrigationSchedulerProps {
  currentLang: Language;
  forecast: DayForecast[];
  pumpHp: number;
  powerSource: 'diesel' | 'electric' | 'solar';
}

export const IrrigationScheduler: React.FC<IrrigationSchedulerProps> = ({
  currentLang,
  forecast,
  pumpHp,
  powerSource,
}) => {
  const t = TRANSLATIONS[currentLang];
  const upcomingRainDay = forecast.find(d => d.rainfallMm >= 15 || d.rainProbabilityPercent >= 70);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Heavy Thunderstorm':
      case 'Moderate Rain':
        return <CloudLightning size={24} className="text-cyan" />;
      case 'Light Rain':
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
          <h2 className="section-title">
            <CloudRain className="section-title-icon text-cyan" size={22} />
            {currentLang === 'pa' ? '7 ਦਿਨਾਂ ਦਾ ਮੌਸਮ ਅਤੇ ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ' : '7-Day Weather & Irrigation Schedule'}
          </h2>
          <p className="section-subtitle">
            ਮੀਂਹ ਦੇ ਅਨੁਮਾਨ ਅਨੁਸਾਰ ਟਿਊਬਵੈੱਲ ਚਲਾਉਣ ਜਾਂ ਬੰਦ ਰੱਖਣ ਦੀ ਸਲਾਹ
          </p>
        </div>

        <div className="timing-box">
          <Clock size={15} className="text-cyan inline-icon" />
          <span>ਪਾਣੀ ਲਾਉਣ ਦਾ ਸਹੀ ਸਮਾਂ: ਸਵੇਰੇ 5:00 - 8:30 ਜਾਂ ਸ਼ਾਮ 6:30 - 9:00</span>
        </div>
      </div>

      {/* Rain Alert Banner in Blue/Navy */}
      {upcomingRainDay && (
        <div className="rain-alert-blue-box">
          <div className="rain-alert-left">
            <CloudLightning size={32} className="text-cyan flex-shrink-0" />
            <div>
              <span className="rain-tag text-cyan font-bold">
                ਮੀਂਹ ਦੀ ਖਾਸ ਚੇਤਾਵਨੀ (LIVE WEATHER FORECAST)
              </span>
              <h3 className="rain-heading font-bold text-white">
                {upcomingRainDay.dayNamePa} ਨੂੰ {upcomingRainDay.rainfallMm} ਮਿਲੀਮੀਟਰ ਚੰਗਾ ਮੀਂਹ ਪੈਣ ਦਾ ਅਨੁਮਾਨ ਹੈ!
              </h3>
              <p className="rain-advice">
                ਵੀਰਵਾਰ ਅਤੇ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਟਿਊਬਵੈੱਲ ਬਿਲਕੁਲ ਨਾ ਚਲਾਓ। ਖੇਤਾਂ ਦੀਆਂ ਵੱਟਾਂ ਉੱਚੀਆਂ ਰੱਖੋ। ਇਕੱਲਾ ਇਹ ਮੀਂਹ ਸੰਭਾਲਣ ਨਾਲ ਤੁਹਾਡੇ <strong>14 ਘੰਟੇ ਟਿਊਬਵੈੱਲ</strong> ਅਤੇ <strong>₹2,200 ਦਾ ਡੀਜ਼ਲ</strong> ਬਚੇਗਾ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Clean Cards Grid */}
      <div className="days-forecast-grid">
        {forecast.map((day, idx) => {
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
        })}
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
