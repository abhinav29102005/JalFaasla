export interface DayForecast {
  dayOffset: number; // 0 = Today, 1 = Tomorrow, etc.
  date: string; // YYYY-MM-DD
  dayName: string;
  dayNamePa: string;
  dayNameHi: string;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Moderate Rain' | 'Heavy Thunderstorm';
  conditionPa: string;
  conditionHi: string;
  rainfallMm: number;
  rainProbabilityPercent: number;
  tempMaxC: number;
  tempMinC: number;
  humidityPercent: number;
  et0EvapoTranspirationMm: number; // reference crop ET0 mm/day
  windSpeedKmh: number;
  irrigationAction: 'IRRIGATE_MORNING_EVENING' | 'MONITOR_SOIL' | 'SKIP_RAIN_EXPECTED' | 'DRAIN_SURPLUS';
  actionNote: string;
  actionNotePa: string;
}

export function generate7DayForecast(blockId: string): DayForecast[] {
  // Ludhiana central belt forecast with realistic monsoon surge / western disturbance on Day 3 & Day 4
  const today = new Date();
  const days: DayForecast[] = [];
  
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesPa = ['ਐਤ', 'ਸੋਮ', 'ਮੰਗਲ', 'ਬੁੱਧ', 'ਵੀਰ', 'ਸ਼ੁੱਕਰ', 'ਸ਼ਨੀ'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  // Forecast template with a crucial rain event on Day 3 (Thu) and Day 4 (Fri) - exactly matching demo narrative!
  const mockTemplates = [
    {
      condition: 'Sunny' as const,
      conditionPa: 'ਖਿੜੀ ਧੁੱਪ',
      conditionHi: 'साफ धूप',
      rainfallMm: 0,
      rainProbabilityPercent: 10,
      tempMaxC: 38,
      tempMinC: 27,
      humidityPercent: 55,
      et0EvapoTranspirationMm: 6.8,
      windSpeedKmh: 11,
      irrigationAction: 'MONITOR_SOIL' as const,
      actionNote: 'Check Pani-Pipe: If water is >5cm below surface, light AWD irrigation only in early morning (5-8 AM).',
      actionNotePa: 'ਪਾਣੀ-ਪਾਈਪ ਚੈੱਕ ਕਰੋ: ਜੇਕਰ ਪਾਣੀ 5 ਸੈਂਟੀਮੀਟਰ ਤੋਂ ਹੇਠਾਂ ਹੈ, ਤਾਂ ਕੇਵਲ ਸਵੇਰੇ 5-8 ਵਜੇ ਹਲਕਾ ਪਾਣੀ ਲਾਓ।'
    },
    {
      condition: 'Partly Cloudy' as const,
      conditionPa: 'ਅੰਸ਼ਕ ਬੱਦਲਵਾਈ',
      conditionHi: 'आंशिक बादल',
      rainfallMm: 2,
      rainProbabilityPercent: 30,
      tempMaxC: 37,
      tempMinC: 26,
      humidityPercent: 62,
      et0EvapoTranspirationMm: 6.1,
      windSpeedKmh: 14,
      irrigationAction: 'MONITOR_SOIL' as const,
      actionNote: 'Western Disturbance approaching. Delay pumping; rain clouds gathering over Malwa belt.',
      actionNotePa: 'ਪੱਛਮੀ ਗੜਬੜੀ ਆ ਰਹੀ ਹੈ। ਟਿਊਬਵੈੱਲ ਚਲਾਉਣ ਤੋਂ ਗੁਰੇਜ਼ ਕਰੋ।'
    },
    {
      condition: 'Cloudy' as const,
      conditionPa: 'ਸੰਘਣੀ ਬੱਦਲਵਾਈ',
      conditionHi: 'घने बादल',
      rainfallMm: 8,
      rainProbabilityPercent: 65,
      tempMaxC: 34,
      tempMinC: 25,
      humidityPercent: 78,
      et0EvapoTranspirationMm: 4.2,
      windSpeedKmh: 19,
      irrigationAction: 'SKIP_RAIN_EXPECTED' as const,
      actionNote: 'DO NOT IRRIGATE: Pre-monsoon showers imminent. Soil moisture will be replenished naturally.',
      actionNotePa: 'ਟਿਊਬਵੈੱਲ ਬੰਦ ਰੱਖੋ! ਮੀਂਹ ਪੈਣ ਦੀ 65% ਸੰਭਾਵਨਾ ਹੈ। ਬਿਜਲੀ ਅਤੇ ਡੀਜ਼ਲ ਬਚਾਓ।'
    },
    {
      condition: 'Moderate Rain' as const,
      conditionPa: 'ਚੰਗਾ ਮੀਂਹ (28 ਮਿਲੀਮੀਟਰ)',
      conditionHi: 'मध्यम बारिश (28 मिमी)',
      rainfallMm: 28,
      rainProbabilityPercent: 90,
      tempMaxC: 31,
      tempMinC: 23,
      humidityPercent: 88,
      et0EvapoTranspirationMm: 2.4,
      windSpeedKmh: 24,
      irrigationAction: 'SKIP_RAIN_EXPECTED' as const,
      actionNote: 'CRITICAL ALERT: 28mm soaking rainfall predicted! Turn off tube-wells. Saves ~12-14 running hours!',
      actionNotePa: 'ਖਾਸ ਚੇਤਾਵਨੀ: 28 ਮਿਲੀਮੀਟਰ ਭਾਰੀ ਮੀਂਹ! ਟਿਊਬਵੈੱਲ ਬਿਲਕੁਲ ਨਾ ਚਲਾਓ। 12-14 ਘੰਟੇ ਬਿਜਲੀ ਬਚੇਗੀ।'
    },
    {
      condition: 'Light Rain' as const,
      conditionPa: 'ਹਲਕੀ ਬਾਰਿਸ਼',
      conditionHi: 'हल्की बारिश',
      rainfallMm: 12,
      rainProbabilityPercent: 75,
      tempMaxC: 32,
      tempMinC: 24,
      humidityPercent: 84,
      et0EvapoTranspirationMm: 3.1,
      windSpeedKmh: 16,
      irrigationAction: 'SKIP_RAIN_EXPECTED' as const,
      actionNote: 'Residual showers continuing. Retain rainwater in field bunds (Wattबंदी); no supplemental pumping required.',
      actionNotePa: 'ਖੇਤਾਂ ਦੀਆਂ ਵੱਟਾਂ ਉੱਚੀਆਂ ਰੱਖੋ ਤਾਂ ਜੋ ਮੀਂਹ ਦਾ ਪਾਣੀ ਬਾਹਰ ਨਾ ਵਗੇ।'
    },
    {
      condition: 'Partly Cloudy' as const,
      conditionPa: 'ਅੰਸ਼ਕ ਬੱਦਲ',
      conditionHi: 'आंशिक बादल',
      rainfallMm: 0,
      rainProbabilityPercent: 20,
      tempMaxC: 35,
      tempMinC: 25,
      humidityPercent: 68,
      et0EvapoTranspirationMm: 5.3,
      windSpeedKmh: 12,
      irrigationAction: 'MONITOR_SOIL' as const,
      actionNote: 'Post-rain drying stage. Field water will remain adequate for next 3-4 days under AWD.',
      actionNotePa: 'ਮੀਂਹ ਤੋਂ ਬਾਅਦ ਜ਼ਮੀਨ ਵਿੱਚ ਪੂਰੀ ਨਮੀ ਹੈ। ਅਗਲੇ 3-4 ਦਿਨ ਪਾਣੀ ਲਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ।'
    },
    {
      condition: 'Sunny' as const,
      conditionPa: 'ਧੁੱਪ',
      conditionHi: 'धूप',
      rainfallMm: 0,
      rainProbabilityPercent: 10,
      tempMaxC: 37,
      tempMinC: 26,
      humidityPercent: 58,
      et0EvapoTranspirationMm: 6.4,
      windSpeedKmh: 10,
      irrigationAction: 'IRRIGATE_MORNING_EVENING' as const,
      actionNote: 'If Pani-Pipe is dry below 5cm, give light irrigation during cool evening (6:30 PM - 9:00 PM).',
      actionNotePa: 'ਜੇਕਰ ਪਾਣੀ-ਪਾਈਪ ਵਿੱਚ ਪਾਣੀ ਸੁੱਕ ਗਿਆ ਹੈ, ਤਾਂ ਸ਼ਾਮ ਵੇਲੇ 6:30 ਤੋਂ 9:00 ਵਜੇ ਵਿਚਕਾਰ ਪਾਣੀ ਲਾਓ।'
    }
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();
    const dateStr = d.toISOString().split('T')[0];
    const tmpl = mockTemplates[i];

    days.push({
      dayOffset: i,
      date: dateStr,
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNamesEn[dayOfWeek],
      dayNamePa: i === 0 ? 'ਅੱਜ' : i === 1 ? 'ਭਲਕੇ' : dayNamesPa[dayOfWeek],
      dayNameHi: i === 0 ? 'आज' : i === 1 ? 'कल' : dayNamesHi[dayOfWeek],
      condition: tmpl.condition,
      conditionPa: tmpl.conditionPa,
      conditionHi: tmpl.conditionHi,
      rainfallMm: tmpl.rainfallMm,
      rainProbabilityPercent: tmpl.rainProbabilityPercent,
      tempMaxC: tmpl.tempMaxC,
      tempMinC: tmpl.tempMinC,
      humidityPercent: tmpl.humidityPercent,
      et0EvapoTranspirationMm: tmpl.et0EvapoTranspirationMm,
      windSpeedKmh: tmpl.windSpeedKmh,
      irrigationAction: tmpl.irrigationAction,
      actionNote: tmpl.actionNote,
      actionNotePa: tmpl.actionNotePa
    });
  }

  return days;
}
