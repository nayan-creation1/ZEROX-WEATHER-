import React from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { WeatherData } from '../../types/weather';
import { getWeatherIcon, getWeatherSticker } from '../../lib/weather-utils';
import { MapPin, Calendar } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'c' | 'f';
  t: any;
  theme: 'dark' | 'light';
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit, t, theme }) => {
  const { current, location } = data;
  const stickerUrl = getWeatherSticker(current.condition.code, !!current.is_day);
  const temp = unit === 'c' ? current.temp_c : current.temp_f;
  const feelsLike = unit === 'c' ? current.feelslike_c : current.feelslike_f;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center text-center py-8 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex items-center gap-2 mb-2 opacity-80">
        <MapPin size={18} className="text-blue-400" />
        <h2 className="text-xl font-bold tracking-tight">{location.name}, {location.region}</h2>
      </div>
      
      <div className="flex items-center gap-2 mb-8 opacity-60 text-[10px] uppercase font-black tracking-[0.2em]">
        <Calendar size={12} />
        <span>{format(new Date(), 'EEEE, d MMMM')}</span>
        <span className="mx-2 opacity-30">|</span>
        <span>{format(new Date(), 'HH:mm')}</span>
      </div>

      <div className="relative mb-8 group">
        <motion.img 
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          src={stickerUrl} 
          alt={current.condition.text} 
          className="w-40 h-40 object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className={`absolute inset-0 rounded-full blur-3xl -z-10 ${theme === 'dark' ? 'bg-white/10' : 'bg-blue-500/10'}`}
        />
      </div>

      <div className="flex items-start relative">
        <span className="text-9xl font-black tracking-tighter drop-shadow-2xl">{Math.round(temp)}</span>
        <span className="text-5xl font-light mt-6 ml-1 opacity-50">°</span>
        <motion.img 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.5 }}
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Thermometer/3D/thermometer_3d.png"
          alt="Thermometer"
          className="w-14 h-14 absolute -right-16 top-6 drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>

      <p className="text-3xl font-black mt-4 uppercase tracking-tight">{current.condition.text}</p>
      <div className="flex items-center gap-2 mt-2 opacity-60 font-medium">
        <span>{t.feelsLike} {Math.round(feelsLike)}°</span>
        <span className="opacity-30">•</span>
        <span>{t.day} {Math.round(unit === 'c' ? data.forecast.forecastday[0].day.maxtemp_c : data.forecast.forecastday[0].day.maxtemp_f)}°</span>
      </div>
    </motion.div>
  );
};
