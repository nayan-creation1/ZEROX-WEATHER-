import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../ui/dialog';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { ForecastHour } from '../../types/weather';
import { LucideIcon } from 'lucide-react';

interface WeatherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  data: ForecastHour[];
  dataKey: keyof ForecastHour;
  unit: string;
  color: string;
  t: any;
  theme: 'dark' | 'light';
}

export const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  data,
  dataKey,
  unit,
  color,
  t,
  theme
}) => {
  const chartData = data.map(h => ({
    time: format(new Date(h.time), 'HH:mm'),
    value: h[dataKey] as number,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`backdrop-blur-xl max-w-2xl sm:rounded-3xl border transition-all ${theme === 'dark' ? 'bg-slate-900/95 border-white/10 text-white' : 'bg-white/95 border-slate-900/10 text-slate-900'}`}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl bg-blue-500/10 ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              <DialogDescription className={theme === 'dark' ? 'text-white/60' : 'text-slate-900/60'}>
                {t.trend24h}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} className={color}/>
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0} className={color}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"} vertical={false} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.4)', fontSize: 12 }}
                  interval={3}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.4)', fontSize: 12 }}
                  width={40}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className={`border p-3 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-900/10'}`}>
                          <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-slate-900/60'}`}>{payload[0].payload.time}</p>
                          <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {payload[0].value} {unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="currentColor" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={3}
                  className={color}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`mt-8 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-900/10'}`}>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>{t.about} {title}</h4>
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-white/80' : 'text-slate-900/80'}`}>
              {description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
