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
import { Language } from '../data/translations';
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
  liveWeather,
  liveSchedule,
  onOpenSmsModal,
}) => {
  const upcomingRainDay = forecast.find(d => d.rainfallMm >= 15 || d.rainProbabilityPercent >= 70);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Heavy Thunderstorm':
      case 'Moderate Rain':
      case 'SKIP PUMPING (RAIN)':
        return <CloudLightning size={18} className="text-water" aria-hidden="true" />;
      case 'Light Rain':
      case 'CHECK TUBE':
        return <CloudRain size={18} className="text-water" aria-hidden="true" />;
      case 'Partly Cloudy':
      case 'Cloudy':
        return <Cloud size={18} className="text-muted" aria-hidden="true" />;
      default:
        return <Sun size={18} className="text-ink" aria-hidden="true" />;
    }
  };

  return (
    <div className="irrigation-scheduler-section">
      {/* Header Row */}
      <div className="scheduler-header-row">
        <div>
          <h2 className="scheduler-title">
            {currentLang === 'pa' ? '7 ਦਿਨਾਂ ਦਾ ਮੌਸਮ ਅਤੇ ਸਿੰਚਾਈ ਸ਼ਡਿਊਲ' : currentLang === 'hi' ? '7 दिनों का मौसम एवं सिंचाई शेड्यूल' : '7-day weather & irrigation schedule'}
          </h2>
          <p className="scheduler-subtitle">
            {liveWeather?.station || (currentLang === 'pa' ? 'ਮੀਂਹ ਦੇ ਅਨੁਮਾਨ ਅਤੇ ਪਾਣੀ-ਪਾਈਪ ਅਨੁਸਾਰ ਟਿਊਬਵੈੱਲ ਚਲਾਉਣ ਦੀ ਸਲਾਹ' : 'Tubewell advice based on rainfall forecast and AWD pani-pipe field status')}
          </p>
        </div>

        <div className="timing-notice">
          <Clock size={15} aria-hidden="true" />
          <span>
            {currentLang === 'pa'
              ? 'ਸਿੰਚਾਈ ਦਾ ਸਹੀ ਸਮਾਂ: ਸਵੇਰੇ 5:00 - 8:30 ਜਾਂ ਸ਼ਾਮ 6:30 - 9:00'
              : 'Best pumping window: 5:00 - 8:30 AM or 6:30 - 9:00 PM'}
          </span>
        </div>
      </div>

      {/* Live Agromet Metrics (Flat Strip) */}
      {liveWeather && (
        <div className="agromet-metrics-strip">
          <div className="agromet-metric-cell">
            <Thermometer size={16} className="text-muted" aria-hidden="true" />
            <div>
              <span className="agromet-cell-label">{currentLang === 'pa' ? 'ਤਾਪਮਾਨ' : 'Temperature'}</span>
              <span className="agromet-cell-value tabular-nums">{liveWeather.current_temperature_c}°C</span>
            </div>
          </div>
          <div className="agromet-metric-cell">
            <Droplets size={16} className="text-water" aria-hidden="true" />
            <div>
              <span className="agromet-cell-label">{currentLang === 'pa' ? 'ਨਮੀ' : 'Humidity'}</span>
              <span className="agromet-cell-value tabular-nums">{liveWeather.humidity_pct}%</span>
            </div>
          </div>
          <div className="agromet-metric-cell">
            <Wind size={16} className="text-muted" aria-hidden="true" />
            <div>
              <span className="agromet-cell-label">{currentLang === 'pa' ? 'ਹਵਾ' : 'Wind'}</span>
              <span className="agromet-cell-value tabular-nums">{liveWeather.wind_speed_kmh} km/h</span>
            </div>
          </div>
          <div className="agromet-metric-cell">
            <Cloud size={16} className="text-muted" aria-hidden="true" />
            <div>
              <span className="agromet-cell-label">{currentLang === 'pa' ? 'ਮੌਨਸੂਨ' : 'Monsoon onset'}</span>
              <span className="agromet-cell-value tabular-nums text-water">{liveWeather.monsoon_onset_forecast}</span>
            </div>
          </div>
        </div>
      )}

      {/* Rain Alert Box - Flat brick or alert border if severe, flat teal if rain expected */}
      {(upcomingRainDay || liveWeather?.rain_alert) && (
        <div className="rain-advisory-box">
          <div className="rain-advisory-content">
            <CloudLightning size={24} className="text-water" aria-hidden="true" />
            <div>
              <span className="rain-advisory-tag text-water">
                {currentLang === 'pa' ? 'ਮੀਂਹ ਦੀ ਖਾਸ ਚੇਤਾਵਨੀ (PAU Agromet)' : 'Weather alert (PAU Agromet)'}
              </span>
              <h3 className="rain-advisory-headline">
                {liveWeather?.rain_alert || (currentLang === 'pa' 
                  ? `${upcomingRainDay?.dayNamePa} ਨੂੰ ${upcomingRainDay?.rainfallMm} ਮਿਲੀਮੀਟਰ ਮੀਂਹ ਪੈਣ ਦਾ ਅਨੁਮਾਨ ਹੈ`
                  : `Expect ~${upcomingRainDay?.rainfallMm} mm rainfall on ${upcomingRainDay?.dayName}`)}
              </h3>
              <p className="rain-advisory-text">
                {liveWeather?.advisory_for_pumps || (currentLang === 'pa'
                  ? 'ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ। ਖੇਤਾਂ ਦੀਆਂ ਵੱਟਾਂ ਉੱਚੀਆਂ ਰੱਖੋ ਤਾਂ ਜੋ ਮੀਂਹ ਦਾ ਪਾਣੀ ਸੰਭਾਲਿਆ ਜਾ ਸਕੇ।'
                  : 'Postpone tubewell pumping. Ensure bunds are intact to capture natural rainwater.')}
              </p>
              {onOpenSmsModal && (
                <button
                  type="button"
                  onClick={onOpenSmsModal}
                  className="rain-sms-action-btn"
                >
                  <Bell size={13} aria-hidden="true" />
                  <span>{currentLang === 'pa' ? 'ਸਵੇਰੇ 6:00 ਵਜੇ SMS ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ' : 'Enable 6:00 AM SMS alert'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Irrigation Schedule: Simple table-like rows */}
      <div className="schedule-table-container" role="region" aria-label="7-day irrigation schedule table">
        <table className="schedule-table">
          <thead>
            <tr>
              <th scope="col">{currentLang === 'pa' ? 'ਦਿਨ ਤੇ ਮਿਤੀ' : 'Day & date'}</th>
              <th scope="col">{currentLang === 'pa' ? 'ਮੌਸਮ' : 'Weather'}</th>
              <th scope="col">{currentLang === 'pa' ? 'ਅਨੁਮਾਨਿਤ ਮੀਂਹ' : 'Rainfall'}</th>
              <th scope="col">{currentLang === 'pa' ? 'ਤਾਪਮਾਨ' : 'Temperature'}</th>
              <th scope="col">{currentLang === 'pa' ? 'ਪਾਣੀ-ਪਾਈਪ ਪੱਧਰ' : 'AWD tube reading'}</th>
              <th scope="col">{currentLang === 'pa' ? 'ਸਿੰਚਾਈ ਸਲਾਹ' : 'Irrigation advice'}</th>
            </tr>
          </thead>
          <tbody>
            {liveSchedule && liveSchedule.length > 0 ? (
              liveSchedule.map((advice, idx) => {
                const isRain = advice.action.includes('SKIP') || advice.forecast_rain_mm >= 10;
                return (
                  <tr 
                    key={idx} 
                    className={`schedule-row ${isRain ? 'row-rain-postponed' : ''} ${idx === 0 ? 'row-today' : ''}`}
                  >
                    <td className="cell-day">
                      <span className="font-bold">{advice.day_name}</span>
                      <span className="cell-subdate tabular-nums">{advice.date_str}</span>
                    </td>
                    <td className="cell-condition">
                      <div className="condition-flex">
                        {getConditionIcon(advice.action)}
                        <span>{advice.action.includes('SKIP') ? 'Rain expected' : 'Dry / Clear'}</span>
                      </div>
                    </td>
                    <td className="cell-rain tabular-nums">
                      {advice.forecast_rain_mm > 0 ? `${advice.forecast_rain_mm} mm` : '0 mm'}
                    </td>
                    <td className="cell-temp tabular-nums">
                      {advice.temp_max_c}°C
                    </td>
                    <td className="cell-awd tabular-nums">
                      {advice.awd_water_tube_reading_cm}
                    </td>
                    <td className="cell-action">
                      {isRain ? (
                        <div className="advice-rain-container">
                          <span className="advice-rain-text text-water font-bold">
                            {currentLang === 'pa' ? 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ — ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖੋ' : 'Rain forecast — postpone irrigation'}
                          </span>
                          <span className="advice-reason-sub">{advice.reason}</span>
                        </div>
                      ) : (
                        <div className="advice-normal-container">
                          <span className="advice-normal-text font-bold">
                            {currentLang === 'pa' ? 'ਪਾਣੀ ਲਾਓ (ਸ਼ਾਮ)' : 'Irrigate as scheduled'}
                          </span>
                          <span className="advice-reason-sub">{advice.reason}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              forecast.map((day, idx) => {
                const isRain = day.irrigationAction === 'SKIP_RAIN_EXPECTED';
                return (
                  <tr 
                    key={idx} 
                    className={`schedule-row ${isRain ? 'row-rain-postponed' : ''} ${idx === 0 ? 'row-today' : ''}`}
                  >
                    <td className="cell-day">
                      <span className="font-bold">
                        {currentLang === 'pa' ? day.dayNamePa : day.dayName}
                      </span>
                      <span className="cell-subdate tabular-nums">
                        {new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="cell-condition">
                      <div className="condition-flex">
                        {getConditionIcon(day.condition)}
                        <span>{currentLang === 'pa' ? day.conditionPa : day.condition}</span>
                      </div>
                    </td>
                    <td className="cell-rain tabular-nums">
                      {day.rainfallMm > 0 ? `${day.rainfallMm} mm (${day.rainProbabilityPercent}%)` : '0 mm'}
                    </td>
                    <td className="cell-temp tabular-nums">
                      {day.tempMaxC}°C / {day.tempMinC}°C
                    </td>
                    <td className="cell-awd tabular-nums">
                      ET₀ {day.et0EvapoTranspirationMm} mm
                    </td>
                    <td className="cell-action">
                      {isRain ? (
                        <div className="advice-rain-container">
                          <span className="advice-rain-text text-water font-bold">
                            {currentLang === 'pa' ? 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ — ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖੋ' : 'Rain forecast — postpone irrigation'}
                          </span>
                          <span className="advice-reason-sub">
                            {currentLang === 'pa' ? day.actionNotePa : day.actionNote}
                          </span>
                        </div>
                      ) : (
                        <div className="advice-normal-container">
                          <span className="advice-normal-text font-bold">
                            {currentLang === 'pa' ? 'ਪਾਣੀ ਲਾਓ (ਸ਼ਾਮ)' : 'Irrigate as scheduled'}
                          </span>
                          <span className="advice-reason-sub">
                            {currentLang === 'pa' ? day.actionNotePa : day.actionNote}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Village Farmer Pani-Pipe Guide - Clean flat rows */}
      <div className="pani-pipe-guide-flat">
        <h4 className="pipe-guide-heading font-bold">
          <HelpCircle size={17} className="text-water inline-icon" aria-hidden="true" />
          {currentLang === 'pa' ? 'ਪਾਣੀ-ਪਾਈਪ (AWD) ਕਿਵੇਂ ਵਰਤਣਾ ਹੈ?' : 'How to use the AWD pani-pipe method'}
        </h4>
        <div className="pipe-steps-row">
          <div className="pipe-step-cell">
            <span className="step-counter tabular-nums">1</span>
            <p>
              {currentLang === 'pa'
                ? '40 ਸੈ.ਮੀ. ਲੰਬੀ ਪਲਾਸਟਿਕ ਪਾਈਪ ਲਵੋ, ਜਿਸ ਵਿੱਚ 20 ਸੈ.ਮੀ. ਤੱਕ ਛੇਕ ਹੋਣ।'
                : 'Take a 40cm PVC perforated pipe with holes drilled up to 20cm.'}
            </p>
          </div>
          <div className="pipe-step-cell">
            <span className="step-counter tabular-nums">2</span>
            <p>
              {currentLang === 'pa'
                ? 'ਪਾਈਪ ਨੂੰ ਖੇਤ ਵਿੱਚ 20 ਸੈ.ਮੀ. ਜ਼ਮੀਨ ਅੰਦਰ ਗੱਡੋ ਅਤੇ ਅੰਦਰੋਂ ਮਿੱਟੀ ਕੱਢ ਲਵੋ।'
                : 'Install 20cm into field soil; scoop out internal mud with a trowel.'}
            </p>
          </div>
          <div className="pipe-step-cell">
            <span className="step-counter tabular-nums">3</span>
            <p>
              {currentLang === 'pa'
                ? 'ਜਦੋਂ ਤੱਕ ਪਾਈਪ ਵਿੱਚ ਪਾਣੀ ਦਾ ਪੱਧਰ 5 ਸੈ.ਮੀ. ਹੇਠਾਂ ਨਾ ਜਾਵੇ, ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ।'
                : 'Refrain from running the tube-well until water drops 5cm below soil level.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
