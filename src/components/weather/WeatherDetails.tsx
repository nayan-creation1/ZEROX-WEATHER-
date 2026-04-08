import React, { useState } from 'react';
import { WeatherData, ForecastHour } from '../../types/weather';
import { getAQIDetails, getUVDetails } from '../../lib/weather-utils';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Gauge, 
  CloudRain, 
  Activity 
} from 'lucide-react';
import { motion } from 'motion/react';
import { WeatherDetailModal } from './WeatherDetailModal';

interface WeatherDetailsProps {
  data: WeatherData;
  hourlyData: ForecastHour[];
  t: any;
  theme: 'dark' | 'light';
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, hourlyData, t, theme }) => {
  const { current } = data;
  const aqiIndex = current.air_quality?.["us-epa-index"] || 1;
  const aqi = getAQIDetails(aqiIndex);
  const uv = getUVDetails(current.uv || 0);

  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);

  const details = [
    {
      id: 'uv',
      label: t.uvIndex,
      value: current.uv,
      subValue: uv.label,
      icon: Sun,
      sticker: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sun/3D/sun_3d.png',
      color: uv.color,
      dataKey: 'uv',
      unit: '',
      description: 'The UV index indicates the intensity of ultraviolet radiation from the sun. Higher values mean a greater risk of skin damage and eye irritation. It is recommended to use sunscreen and wear protective clothing when the index is high.'
    },
    {
      id: 'wind',
      label: t.windSpeed,
      value: `${current.wind_kph} km/h`,
      subValue: 'Direction: N/A',
      icon: Wind,
      sticker: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Wind%20face/3D/wind_face_3d.png',
      color: 'text-blue-300',
      dataKey: 'wind_kph',
      unit: 'km/h',
      description: 'Wind speed is the rate at which air is moving horizontally past a given point. It is typically measured in kilometers per hour (km/h) or miles per hour (mph). Strong winds can affect outdoor activities and travel.'
    },
    {
      id: 'humidity',
      label: t.humidity,
      value: `${current.humidity}%`,
      subValue: 'Dew point: N/A',
      icon: Droplets,
      sticker: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Droplet/3D/droplet_3d.png',
      color: 'text-cyan-400',
      dataKey: 'humidity',
      unit: '%',
      description: 'Humidity is the amount of water vapor present in the air. High humidity can make it feel warmer than it actually is, while low humidity can cause dry skin and respiratory irritation.'
    },
    {
      id: 'aqi',
      label: t.airQuality,
      value: aqi.label,
      subValue: aqi.description,
      icon: Activity,
      sticker: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Leaf%20fluttering%20in%20wind/3D/leaf_fluttering_in_wind_3d.png',
      color: aqi.text,
      dataKey: 'aqi',
      unit: 'AQI',
      description: 'The Air Quality Index (AQI) measures how clean or polluted the air is. It takes into account various pollutants like ozone, particulate matter, and nitrogen dioxide. A lower AQI indicates better air quality.'
    },
    {
      id: 'pressure',
      label: t.pressure,
      value: `${current.pressure_mb} hPa`,
      subValue: 'Stable',
      icon: Gauge,
      sticker: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Compass/3D/compass_3d.png',
      color: 'text-slate-300',
      dataKey: 'pressure_mb',
      unit: 'hPa',
      description: 'Atmospheric pressure is the force exerted by the weight of the air above us. Changes in pressure can indicate approaching weather systems. Falling pressure often precedes storms, while rising pressure typically brings clearer skies.'
    },
    {
      id: 'precipitation',
      label: t.precipitation,
      value: `${current.precip_mm} mm`,
      subValue: 'Last 24h',
      icon: CloudRain,
      sticker: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cloud%20with%20rain/3D/cloud_with_rain_3d.png',
      color: 'text-blue-400',
      dataKey: 'chance_of_rain',
      unit: '%',
      description: 'Precipitation is any form of water, liquid or solid, that falls from the atmosphere and reaches the ground. This includes rain, snow, sleet, and hail. The chart shows the probability of precipitation over the next 24 hours.'
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {details.map((detail, i) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onClick={() => setSelectedDetail(detail)}
            className={`backdrop-blur-md border rounded-3xl p-5 flex flex-col gap-3 cursor-pointer transition-all active:scale-95 group relative overflow-hidden ${theme === 'dark' ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-slate-900/5 border-slate-900/10 hover:bg-slate-900/10'}`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-white/50 group-hover:text-white' : 'text-slate-900/50 group-hover:text-slate-900'}`}>
                <detail.icon size={16} />
                <span className="text-[10px] uppercase tracking-wider font-bold">{detail.label}</span>
              </div>
              <img 
                src={detail.sticker} 
                alt={detail.label} 
                className="w-8 h-8 object-contain drop-shadow-lg group-hover:scale-125 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{detail.value}</p>
              <p className={`text-[10px] mt-1 font-medium ${detail.color}`}>{detail.subValue}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedDetail && (
        <WeatherDetailModal
          isOpen={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          title={selectedDetail.label}
          description={selectedDetail.description}
          icon={selectedDetail.icon}
          data={hourlyData}
          dataKey={selectedDetail.dataKey}
          unit={selectedDetail.unit}
          color={selectedDetail.color}
          t={t}
          theme={theme}
        />
      )}
    </>
  );
};
