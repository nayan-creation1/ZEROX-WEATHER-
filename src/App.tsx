import { WeatherApp } from './components/WeatherApp';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="antialiased">
      <WeatherApp />
      <Toaster position="top-center" richColors />
    </div>
  );
}
