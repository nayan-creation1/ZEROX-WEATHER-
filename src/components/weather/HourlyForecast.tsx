import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ForecastHour } from '../../types/weather';
import { getWeatherIcon, getWeatherSticker } from '../../lib/weather-utils';
import { motion } from 'motion/react';

interface HourlyForecastProps {
  hours: ForecastHour[];
  unit: 'c' | 'f';
  t: any;
  theme: 'dark' | 'light';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hours, unit, t, theme }) => {
  // Get next 24 hours
  const displayHours = hours.slice(0, 24);

  const chartData = displayHours.map(h => ({
    time: format(new Date(h.time), 'HH:mm'),
    temp: unit === 'c' ? h.temp_c : h.temp_f,
    icon: h.condition.icon,
    chance: h.chance_of_rain
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`backdrop-blur-md border rounded-3xl p-6 w-full relative overflow-hidden transition-all ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-slate-900/5 border-slate-900/10'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white/70' : 'text-slate-900/70'}`}>{t.hourlyForecast}</h3>
        <img 
          src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Mantelpiece%20clock/3D/mantelpiece_clock_3d.png" 
          alt="Clock" 
          className="w-8 h-8 object-contain drop-shadow-md animate-pulse"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="h-40 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme === 'dark' ? '#fff' : '#0f172a'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={theme === 'dark' ? '#fff' : '#0f172a'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)', fontSize: 10 }}
              interval={3}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`border p-2 rounded-lg text-xs backdrop-blur-md shadow-xl ${theme === 'dark' ? 'bg-slate-900/90 border-white/10 text-white' : 'bg-white/90 border-slate-900/10 text-slate-900'}`}>
                      <p className="font-bold">{payload[0].value}°</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke={theme === 'dark' ? '#fff' : '#0f172a'} 
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              strokeWidth={3}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
        {displayHours.map((hour, i) => {
          const stickerUrl = getWeatherSticker(hour.condition.code, !!hour.is_day);
          return (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, scale: 1.05 }}
              className={`flex flex-col items-center min-w-[70px] gap-3 p-3 rounded-2xl transition-colors border border-transparent ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 hover:border-white/10' : 'bg-slate-900/5 hover:bg-slate-900/10 hover:border-slate-900/10'}`}
            >
              <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-white/50' : 'text-slate-900/50'}`}>{format(new Date(hour.time), 'HH:mm')}</span>
              <div className="relative">
                <img 
                  src={stickerUrl} 
                  alt={hour.condition.text} 
                  className="w-10 h-10 object-contain drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
                {hour.chance_of_rain > 30 && (
                  <motion.div 
                    animate={{ y: [0, 2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1"
                  >
                    <img 
                      src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Droplet/3D/droplet_3d.png" 
                      className="w-3 h-3"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                )}
              </div>
              <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{Math.round(unit === 'c' ? hour.temp_c : hour.temp_f)}°</span>
              {hour.chance_of_rain > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-blue-500 text-[9px] font-black uppercase tracking-tighter">{hour.chance_of_rain}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
