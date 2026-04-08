import React, { useState, useEffect } from 'react';
import { Search, MapPin, History, Star, X } from 'lucide-react';
import { Input } from '../ui/input';
import { searchCities } from '../../services/weatherService';
import { motion, AnimatePresence } from 'motion/react';

interface SearchLocationProps {
  onSelect: (city: string) => void;
  placeholder: string;
  theme: 'dark' | 'light';
}

export const SearchLocation: React.FC<SearchLocationProps> = ({ onSelect, placeholder, theme }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('weather_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('weather_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3) {
        const results = await searchCities(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: string) => {
    onSelect(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    
    const newHistory = [city, ...history.filter(h => h !== city)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('weather_history', JSON.stringify(newHistory));
  };

  const toggleFavorite = (e: React.MouseEvent, city: string) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(city) 
      ? favorites.filter(f => f !== city)
      : [...favorites, city];
    setFavorites(newFavorites);
    localStorage.setItem('weather_favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-50">
      <div className="relative group">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-white/50 group-focus-within:text-white' : 'text-slate-900/50 group-focus-within:text-slate-900'}`} size={18} />
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`pl-10 border transition-all rounded-2xl h-12 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 placeholder:text-slate-900/40 focus:bg-slate-900/10 focus:border-slate-900/20'}`}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-slate-900/50 hover:text-slate-900'}`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-full mt-2 w-full backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl z-50 ${theme === 'dark' ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-900/10'}`}
            >
              {suggestions.length > 0 ? (
                <div className="p-2">
                  <p className={`text-[10px] uppercase tracking-wider px-3 py-2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>Suggestions</p>
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelect(`${s.name}, ${s.region}, ${s.country}`)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-900/10 text-slate-900'}`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-blue-400" />
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-slate-900/50'}`}>{s.region}, {s.country}</p>
                        </div>
                      </div>
                      <Star 
                        size={16} 
                        className={favorites.includes(`${s.name}, ${s.region}, ${s.country}`) ? "fill-yellow-400 text-yellow-400" : (theme === 'dark' ? "text-white/20" : "text-slate-900/20")}
                        onClick={(e) => toggleFavorite(e, `${s.name}, ${s.region}, ${s.country}`)}
                      />
                    </button>
                  ))}
                </div>
              ) : query.length < 3 && (
                <div className="p-2">
                  {favorites.length > 0 && (
                    <>
                      <p className={`text-[10px] uppercase tracking-wider px-3 py-2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>Favorites</p>
                      {favorites.map((f) => (
                        <button
                          key={f}
                          onClick={() => handleSelect(f)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-900/10 text-slate-900'}`}
                        >
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{f}</span>
                        </button>
                      ))}
                    </>
                  )}
                  {history.length > 0 && (
                    <>
                      <p className={`text-[10px] uppercase tracking-wider px-3 py-2 mt-2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>Recent Searches</p>
                      {history.map((h) => (
                        <button
                          key={h}
                          onClick={() => handleSelect(h)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-900/10 text-slate-900'}`}
                        >
                          <History size={16} className={theme === 'dark' ? "text-white/30" : "text-slate-900/30"} />
                          <span className="font-medium">{h}</span>
                        </button>
                      ))}
                    </>
                  )}
                  {favorites.length === 0 && history.length === 0 && (
                    <div className={`px-3 py-8 text-center text-sm italic ${theme === 'dark' ? 'text-white/40' : 'text-slate-900/40'}`}>
                      Start typing to search for a city
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
