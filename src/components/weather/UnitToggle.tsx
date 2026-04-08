import React from 'react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface UnitToggleProps {
  unit: 'c' | 'f';
  onChange: (unit: 'c' | 'f') => void;
  theme: 'dark' | 'light';
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ unit, onChange, theme }) => {
  return (
    <div className={`flex items-center space-x-2 backdrop-blur-md px-3 py-1.5 rounded-full border transition-all ${theme === 'dark' ? 'bg-white/10 border-white/10' : 'bg-slate-900/10 border-slate-900/20'}`}>
      <span className={`text-xs font-bold ${unit === 'c' ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : (theme === 'dark' ? 'text-white/40' : 'text-slate-900/40')}`}>°C</span>
      <Switch 
        checked={unit === 'f'} 
        onCheckedChange={(checked) => onChange(checked ? 'f' : 'c')} 
        className={`data-[state=checked]:bg-blue-500 ${theme === 'dark' ? 'data-[state=unchecked]:bg-slate-700' : 'data-[state=unchecked]:bg-slate-300'}`}
      />
      <span className={`text-xs font-bold ${unit === 'f' ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : (theme === 'dark' ? 'text-white/40' : 'text-slate-900/40')}`}>°F</span>
    </div>
  );
};
