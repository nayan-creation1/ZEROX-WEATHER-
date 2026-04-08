/// <reference types="vite/client" />
import axios from 'axios';
import { WeatherData, ForecastDay, ForecastHour } from '../types/weather';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Helper to map WMO weather codes to WeatherAPI-like codes for compatibility with existing logic
const mapWMOCodeToWeatherAPI = (code: number): number => {
  const mapping: Record<number, number> = {
    0: 1000, // Clear sky
    1: 1003, // Mainly clear
    2: 1003, // Partly cloudy
    3: 1006, // Overcast
    45: 1030, // Fog
    48: 1030, // Depositing rime fog
    51: 1150, // Drizzle: Light
    53: 1153, // Drizzle: Moderate
    55: 1153, // Drizzle: Dense intensity
    61: 1183, // Rain: Slight
    63: 1189, // Rain: Moderate
    65: 1195, // Rain: Heavy intensity
    71: 1213, // Snow fall: Slight
    73: 1219, // Snow fall: Moderate
    75: 1225, // Snow fall: Heavy intensity
    80: 1240, // Rain showers: Slight
    81: 1243, // Rain showers: Moderate
    82: 1246, // Rain showers: Violent
    95: 1273, // Thunderstorm: Slight or moderate
    96: 1276, // Thunderstorm with slight hail
    99: 1282, // Thunderstorm with heavy hail
  };
  return mapping[code] || 1000;
};

const getWeatherDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown';
};

export const fetchWeather = async (query: string): Promise<WeatherData> => {
  let lat: number, lon: number, name: string, region: string, country: string;

  // Check if query is coordinates
  if (query.includes(',')) {
    [lat, lon] = query.split(',').map(Number);
    // Reverse geocode or just use coordinates as name
    name = `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    region = '';
    country = '';
    
    // Try to get city name from coordinates
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (geoRes.data.address) {
        name = geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.village || name;
        region = geoRes.data.address.state || '';
        country = geoRes.data.address.country || '';
      }
    } catch (e) {
      console.warn("Reverse geocoding failed", e);
    }
  } else {
    // Search for city first
    const searchRes = await axios.get(GEOCODING_BASE_URL, {
      params: { name: query, count: 1 }
    });
    
    if (!searchRes.data.results || searchRes.data.results.length === 0) {
      throw new Error(`City not found: ${query}`);
    }
    
    const city = searchRes.data.results[0];
    lat = city.latitude;
    lon = city.longitude;
    name = city.name;
    region = city.admin1 || '';
    country = city.country || '';
  }

  // Fetch weather and air quality in parallel
  const [weatherRes, aqiRes] = await Promise.all([
    axios.get(WEATHER_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m',
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,uv_index,pressure_msl',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: 7
      }
    }),
    axios.get(AIR_QUALITY_BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
        hourly: 'us_aqi'
      }
    })
  ]);

  const w = weatherRes.data;
  const a = aqiRes.data;

  // Transform to our WeatherData shape
  const forecastDays: ForecastDay[] = w.daily.time.map((date: string, i: number) => {
    const dayHours: ForecastHour[] = w.hourly.time
      .map((time: string, j: number) => ({
        time,
        temp_c: w.hourly.temperature_2m[j],
        temp_f: (w.hourly.temperature_2m[j] * 9/5) + 32,
        is_day: 1,
        condition: {
          text: getWeatherDescription(w.hourly.weather_code[j]),
          icon: '',
          code: mapWMOCodeToWeatherAPI(w.hourly.weather_code[j])
        },
        chance_of_rain: w.hourly.precipitation_probability[j],
        humidity: w.hourly.relative_humidity_2m[j],
        wind_kph: w.hourly.wind_speed_10m[j],
        pressure_mb: w.hourly.pressure_msl[j],
        uv: w.hourly.uv_index[j],
        aqi: a.hourly?.us_aqi?.[j]
      }))
      .filter((h: any) => h.time.startsWith(date));

    return {
      date,
      day: {
        maxtemp_c: w.daily.temperature_2m_max[i],
        maxtemp_f: (w.daily.temperature_2m_max[i] * 9/5) + 32,
        mintemp_c: w.daily.temperature_2m_min[i],
        mintemp_f: (w.daily.temperature_2m_min[i] * 9/5) + 32,
        daily_chance_of_rain: w.daily.precipitation_probability_max[i],
        condition: {
          text: getWeatherDescription(w.daily.weather_code[i]),
          icon: '',
          code: mapWMOCodeToWeatherAPI(w.daily.weather_code[i])
        }
      },
      hour: dayHours
    };
  });

  return {
    location: {
      name,
      region,
      country,
      lat,
      lon,
      localtime: new Date().toISOString(),
      timezone: w.timezone
    },
    current: {
      temp_c: w.current.temperature_2m,
      temp_f: (w.current.temperature_2m * 9/5) + 32,
      is_day: w.current.is_day,
      condition: {
        text: getWeatherDescription(w.current.weather_code),
        icon: '',
        code: mapWMOCodeToWeatherAPI(w.current.weather_code)
      },
      wind_kph: w.current.wind_speed_10m,
      pressure_mb: w.current.pressure_msl,
      precip_mm: w.current.precipitation,
      humidity: w.current.relative_humidity_2m,
      feelslike_c: w.current.apparent_temperature,
      feelslike_f: (w.current.apparent_temperature * 9/5) + 32,
      uv: w.daily.uv_index_max[0],
      air_quality: {
        "us-epa-index": Math.ceil(a.current.us_aqi / 50), // Rough mapping
        pm2_5: a.current.pm2_5,
        pm10: a.current.pm10,
        o3: a.current.ozone,
        no2: a.current.nitrogen_dioxide,
        so2: a.current.sulphur_dioxide
      }
    },
    forecast: {
      forecastday: forecastDays
    }
  };
};

export const searchCities = async (query: string) => {
  if (query.length < 2) return [];

  try {
    const response = await axios.get(GEOCODING_BASE_URL, {
      params: {
        name: query,
        count: 10,
        language: 'en',
        format: 'json'
      },
    });

    return (response.data.results || []).map((city: any) => ({
      id: city.id,
      name: city.name,
      region: city.admin1 || '',
      country: city.country || '',
      latitude: city.latitude,
      longitude: city.longitude
    }));
  } catch (e) {
    console.error("Search failed", e);
    return [];
  }
};
