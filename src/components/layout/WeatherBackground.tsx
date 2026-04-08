import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getBackgroundGradient } from '../../lib/weather-utils';

interface WeatherBackgroundProps {
  code: number;
  isDay: boolean;
  theme: 'dark' | 'light';
  children: React.ReactNode;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ code, isDay, theme, children }) => {
  const gradient = getBackgroundGradient(code, isDay);
  const themeGradient = theme === 'light' ? 'from-sky-100 to-white' : gradient;

  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 bg-gradient-to-br ${themeGradient} overflow-x-hidden relative`}>
      {/* Animated elements based on weather */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${theme === 'light' ? 'opacity-50' : ''}`}>
        {/* Sun Glow */}
        {isDay && code === 1000 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"
          />
        )}
        
        {/* Clouds */}
        {[1003, 1006, 1009].includes(code) && (
          <>
            <motion.div 
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-10 w-64 h-32 bg-white/20 rounded-full blur-2xl"
            />
            <motion.div 
              animate={{ x: [0, -150, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-40 right-20 w-80 h-40 bg-white/10 rounded-full blur-3xl"
            />
          </>
        )}

        {/* Rain Effect */}
        {[1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code) && (
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 100 + '%' }}
                animate={{ y: '110vh' }}
                transition={{ 
                  duration: 0.5 + Math.random() * 0.5, 
                  repeat: Infinity, 
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
                className="absolute w-0.5 h-4 bg-white"
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
