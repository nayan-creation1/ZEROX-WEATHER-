import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { WeatherData, WeatherAlert } from '../types/weather';
import { WeatherBackground } from './layout/WeatherBackground';
import { CurrentWeather } from './weather/CurrentWeather';
import { HourlyForecast } from './weather/HourlyForecast';
import { DailyForecast } from './weather/DailyForecast';
import { WeatherDetails } from './weather/WeatherDetails';
import { SearchLocation } from './weather/SearchLocation';
import { UnitToggle } from './weather/UnitToggle';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { Bell, BellOff, AlertTriangle, Info, Languages, Moon, Sun as SunIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../lib/translations';

export const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<'c' | 'f'>('c');
  const [location, setLocation] = useState<string>('London');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const t = translations[language];

  useEffect(() => {
    // Check if notification permission is already granted
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  useEffect(() => {
    // Try to get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadWeather(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          loadWeather('London'); // Fallback
          toast.error(t.locationDenied);
        }
      );
    } else {
      loadWeather('London');
    }
  }, []);

  const loadWeather = async (query: string) => {
    setLoading(true);
    try {
      const data = await fetchWeather(query);
      setWeather(data);
      setLocation(data.location.name);
      
      // Check for alerts (WeatherAPI style)
      if (data.alerts?.alert && data.alerts.alert.length > 0) {
        data.alerts.alert.forEach(alert => {
          if (notificationsEnabled && 'Notification' in window) {
            new Notification("Weather Alert", { body: alert.headline });
          }
        });
      }

      // Check for severe weather (Open-Meteo style)
      const severeCodes = [65, 75, 82, 95, 96, 99];
      if (severeCodes.includes(data.current.condition.code) && notificationsEnabled && 'Notification' in window) {
        new Notification("Severe Weather Alert", { 
          body: `Severe ${data.current.condition.text} detected in ${data.location.name}. Please take caution.` 
        });
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = () => {
    if (!('Notification' in window)) {
      toast.error(t.notSupported);
      return;
    }

    if (Notification.permission === 'denied') {
      toast.error(t.permissionDenied, {
        description: t.permissionDeniedDesc,
        duration: 5000,
      });
      return;
    }

    if (!notificationsEnabled) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          toast.success(t.notificationsEnabled);
          // Send a test notification immediately
          new Notification("zerox weather monitor", { body: t.testNotification });
        } else {
          toast.error(t.permissionDenied);
        }
      });
    } else {
      setNotificationsEnabled(false);
      toast.info(t.notificationsDisabled);
    }
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center p-6 gap-8">
        <Skeleton className="h-12 w-full max-w-md rounded-2xl bg-white/5" />
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-48 bg-white/5" />
          <Skeleton className="h-32 w-32 rounded-full bg-white/5" />
          <Skeleton className="h-16 w-32 bg-white/5" />
        </div>
        <Skeleton className="h-64 w-full max-w-4xl rounded-3xl bg-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-32 rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <WeatherBackground 
      code={weather?.current.condition.code || 1000} 
      isDay={!!weather?.current.is_day}
      theme={theme}
    >
      <div className={`max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-8 pb-20 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SearchLocation onSelect={loadWeather} placeholder={t.searchPlaceholder} theme={theme} />
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${theme === 'dark' ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-slate-900/10 border-slate-900/20 text-slate-900 hover:bg-slate-900/20'}`}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <SunIcon size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${theme === 'dark' ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-slate-900/10 border-slate-900/20 text-slate-900 hover:bg-slate-900/20'}`}>
                <Languages size={20} />
              </button>
              <div className={`absolute right-0 top-full mt-2 w-32 rounded-2xl border backdrop-blur-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] ${theme === 'dark' ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-900/10'}`}>
                {(['en', 'es', 'fr', 'de', 'hi', 'bn'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-full text-left px-4 py-2 text-sm first:rounded-t-2xl last:rounded-b-2xl transition-colors ${language === lang ? (theme === 'dark' ? 'bg-white/20 text-white' : 'bg-slate-900/20 text-slate-900') : (theme === 'dark' ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-slate-900/60 hover:bg-slate-900/10 hover:text-slate-900')}`}
                  >
                    {lang === 'en' && 'English'}
                    {lang === 'es' && 'Español'}
                    {lang === 'fr' && 'Français'}
                    {lang === 'de' && 'Deutsch'}
                    {lang === 'hi' && 'हिन्दी'}
                    {lang === 'bn' && 'বাংলা'}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={toggleNotifications}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${notificationsEnabled ? (theme === 'dark' ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-slate-900/10 border-slate-900/20 text-slate-900 hover:bg-slate-900/20') : 'bg-blue-500/20 border-blue-500/50 text-blue-400 animate-pulse'}`}
              title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
            >
              {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
            <UnitToggle unit={unit} onChange={setUnit} theme={theme} />
          </div>
        </div>

        {/* Notification Prompt Banner */}
        <AnimatePresence>
          {!notificationsEnabled && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`backdrop-blur-md border rounded-2xl p-4 flex items-center justify-between gap-4 ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20 text-white' : 'bg-blue-500/5 border-blue-500/10 text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <Bell className="text-blue-400" size={20} />
                <p className="text-sm">{t.enableNotifications}</p>
              </div>
              <button 
                onClick={toggleNotifications}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                {t.enable}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {weather && (
          <>
            {/* Alerts Section */}
            <AnimatePresence>
              {weather.alerts?.alert && weather.alerts.alert.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-white"
                >
                  <AlertTriangle className="text-red-400 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm">{t.weatherAlert}</h4>
                    <p className="text-xs opacity-90">{weather.alerts.alert[0].headline}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <CurrentWeather data={weather} unit={unit} t={t} theme={theme} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <HourlyForecast hours={weather.forecast.forecastday[0].hour} unit={unit} t={t} theme={theme} />
                <WeatherDetails data={weather} hourlyData={weather.forecast.forecastday[0].hour} t={t} theme={theme} />
              </div>
              <div className="flex flex-col gap-8">
                <DailyForecast days={weather.forecast.forecastday} unit={unit} t={t} theme={theme} />
                
                {/* Info Card */}
                <div className={`backdrop-blur-sm border rounded-3xl p-6 text-xs flex gap-3 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-900/5 border-slate-900/10 text-slate-900/60'}`}>
                  <Info size={16} className="shrink-0" />
                  <p>
                    {t.dataProvidedBy} 
                    <br />
                    {t.uvDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <footer className={`mt-12 py-8 border-t text-center ${theme === 'dark' ? 'border-white/5' : 'border-slate-900/5'}`}>
              <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${theme === 'dark' ? 'text-white/20' : 'text-slate-900/20'}`}>
                © 2026 zerox weather monitor • <span className={theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}>NAYAN CREATION</span>
              </p>
            </footer>
          </>
        )}
      </div>
    </WeatherBackground>
  );
};
