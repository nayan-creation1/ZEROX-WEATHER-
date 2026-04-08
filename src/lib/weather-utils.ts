import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  CloudSun, 
  Sun, 
  Wind,
  Droplets,
  Thermometer,
  Eye,
  ArrowDown,
  ArrowUp,
  Navigation
} from 'lucide-react';

export const getWeatherIcon = (code: number, isDay: boolean = true) => {
  // WeatherAPI codes: https://www.weatherapi.com/docs/weather_conditions.json
  if (code === 1000) return isDay ? Sun : CloudSun; // Clear/Sunny
  if ([1003, 1006, 1009].includes(code)) return CloudSun; // Partly cloudy/Cloudy/Overcast
  if ([1030, 1135, 1147].includes(code)) return CloudFog; // Mist/Fog
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return CloudRain; // Patchy rain/Rain
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return CloudSnow; // Snow
  if ([1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1249, 1252].includes(code)) return CloudDrizzle; // Sleet/Freezing rain
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return CloudLightning; // Thunder
  
  return Cloud;
};

export const getWeatherSticker = (code: number, isDay: boolean = true) => {
  const baseUrl = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets';
  
  if (code === 1000) {
    return isDay 
      ? `${baseUrl}/Sun/3D/sun_3d.png` 
      : `${baseUrl}/Moon/3D/moon_3d.png`;
  }
  
  if ([1003, 1006, 1009].includes(code)) {
    return isDay 
      ? `${baseUrl}/Sun%20behind%20cloud/3D/sun_behind_cloud_3d.png`
      : `${baseUrl}/Cloud/3D/cloud_3d.png`;
  }
  
  if ([1030, 1135, 1147].includes(code)) {
    return `${baseUrl}/Fog/3D/fog_3d.png`;
  }
  
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
    return `${baseUrl}/Cloud%20with%20rain/3D/cloud_with_rain_3d.png`;
  }
  
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
    return `${baseUrl}/Cloud%20with%20snow/3D/cloud_with_snow_3d.png`;
  }
  
  if ([1069, 1072, 1168, 1171, 1198, 1201, 1204, 1207, 1249, 1252].includes(code)) {
    return `${baseUrl}/Cloud%20with%20rain/3D/cloud_with_rain_3d.png`;
  }
  
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return `${baseUrl}/Cloud%20with%20lightning/3D/cloud_with_lightning_3d.png`;
  }
  
  return `${baseUrl}/Cloud/3D/cloud_3d.png`;
};

export const getAQIDetails = (index: number) => {
  const levels = [
    { label: 'Good', color: 'bg-green-500', text: 'text-green-500', description: 'Air quality is satisfactory.' },
    { label: 'Moderate', color: 'bg-yellow-500', text: 'text-yellow-500', description: 'Air quality is acceptable.' },
    { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-orange-500', description: 'Sensitive groups may experience health effects.' },
    { label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-500', description: 'Everyone may begin to experience health effects.' },
    { label: 'Very Unhealthy', color: 'bg-purple-500', text: 'text-purple-500', description: 'Health alert: everyone may experience more serious health effects.' },
    { label: 'Hazardous', color: 'bg-rose-950', text: 'text-rose-950', description: 'Health warnings of emergency conditions.' },
  ];
  return levels[index - 1] || levels[0];
};

export const getUVDetails = (uv: number) => {
  if (uv <= 2) return { label: 'Low', color: 'text-green-500' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
};

export const getBackgroundGradient = (code: number, isDay: boolean) => {
  if (!isDay) return 'from-slate-900 to-slate-800';
  
  if (code === 1000) return 'from-sky-400 to-blue-500'; // Clear
  if ([1003, 1006, 1009].includes(code)) return 'from-blue-400 to-slate-400'; // Cloudy
  if ([1030, 1135, 1147].includes(code)) return 'from-slate-400 to-slate-500'; // Fog
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'from-blue-600 to-indigo-800'; // Rain
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return 'from-slate-100 to-blue-100'; // Snow
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'from-slate-800 to-indigo-900'; // Thunder
  
  return 'from-sky-400 to-blue-500';
};
