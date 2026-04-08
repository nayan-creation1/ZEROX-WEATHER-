import React from 'react';
import { ForecastDay } from '../../types/weather';
import { getWeatherIcon, getWeatherSticker } from '../../lib/weather-utils';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface DailyForecastProps {
  days: ForecastDay[];
  unit: 'c' | 'f';
  t: any;
  theme: 'dark' | 'light';
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ days, unit, t, theme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`backdrop-blur-md border rounded-3xl p-6 w-full transition-all ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-slate-900/5 border-slate-900/10'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white/70' : 'text-slate-900/70'}`}>{t.sevenDayForecast}</h3>
        <img 
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Spiral%20calendar/3D/spiral_calendar_3d.png" 
          alt="Calendar" 
          className="w-8 h-8 object-contain drop-shadow-md"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="space-y-4">
        {days.map((day, i) => {
          const stickerUrl = getWeatherSticker(day.day.condition.code, true);
          const isToday = i === 0;
          
          return (
            <motion.div 
              key={day.date} 
              whileHover={{ x: 5 }}
              className={`flex items-center justify-between group p-2 rounded-2xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-900/5'}`}
            >
              <div className="w-24">
                <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{isToday ? t.today : format(new Date(day.date), 'EEEE')}</p>
                <p className={`text-[10px] uppercase font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>{format(new Date(day.date), 'd MMM')}</p>
              </div>
              
              <div className="flex items-center gap-3 flex-1 justify-center relative">
                <img 
                  src={stickerUrl} 
                  alt={day.day.condition.text} 
                  className="w-8 h-8 object-contain drop-shadow-lg group-hover:scale-125 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {day.day.daily_chance_of_rain > 20 && (
                  <span className="text-blue-500 text-[9px] font-black absolute -right-4 top-1/2 -translate-y-1/2">{day.day.daily_chance_of_rain}%</span>
                )}
              </div>

              <div className="flex items-center gap-4 w-24 justify-end">
                <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round(unit === 'c' ? day.day.maxtemp_c : day.day.maxtemp_f)}°
                </span>
                <span className={`font-medium ${theme === 'dark' ? 'text-white/30' : 'text-slate-900/30'}`}>
                  {Math.round(unit === 'c' ? day.day.mintemp_c : day.day.mintemp_f)}°
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
