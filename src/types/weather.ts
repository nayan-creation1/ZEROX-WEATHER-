
export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
    timezone: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    pressure_mb: number;
    precip_mm: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    air_quality: {
      "us-epa-index": number;
      pm2_5: number;
      pm10: number;
      o3: number;
      no2: number;
      so2: number;
    };
  };
  forecast: {
    forecastday: ForecastDay[];
  };
  alerts?: {
    alert: WeatherAlert[];
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    daily_chance_of_rain: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  hour: ForecastHour[];
}

export interface ForecastHour {
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  chance_of_rain: number;
  humidity: number;
  wind_kph: number;
  pressure_mb: number;
  uv: number;
  aqi?: number;
}

export interface WeatherAlert {
  headline: string;
  severity: string;
  urgency: string;
  areas: string;
  category: string;
  certainty: string;
  event: string;
  note: string;
  effective: string;
  expires: string;
  desc: string;
  instruction: string;
}
