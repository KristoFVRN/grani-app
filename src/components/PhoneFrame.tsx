import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isPhoneFrame?: boolean;
  onToggleFrame?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isPhoneFrame = true, onToggleFrame }) => {
  const [time, setTime] = useState('11:05');
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    update();
    const timer = setInterval(update, 30000);

    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // On real mobile screens, always take 100% full screen
  if (isMobileScreen) {
    return (
      <main className="w-full min-h-screen bg-[#fbf9f4] text-[#241c30] flex flex-col">
        {children}
      </main>
    );
  }

  if (!isPhoneFrame) {
    return (
      <div className="w-full min-h-screen bg-[#0e0c16] py-6 px-4 flex flex-col items-center relative">
        <main className="w-full max-w-5xl bg-[#fbf9f4] text-[#241c30] shadow-2xl rounded-3xl overflow-hidden flex flex-col transition-all duration-300 min-h-[90vh]">
          {children}
        </main>
        {onToggleFrame && (
          <button
            onClick={onToggleFrame}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-900/90 hover:bg-purple-800 text-amber-200 text-xs font-bold shadow-xl border border-purple-500/30 backdrop-blur-md transition active:scale-95"
            title="Переключить на вид смартфона"
          >
            <Smartphone className="w-4 h-4 text-amber-300" />
            <span>Вид смартфона</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-[#120f1f] via-[#1a142e] to-[#0f0c1b] relative">
      {/* Phone Body with Realistic Bezel */}
      <div className="relative w-[390px] h-[844px] bg-[#0c0a14] rounded-[52px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[4px] border-[#3f345e] ring-1 ring-white/10 flex flex-col transition-all duration-300">
        {/* Outer buttons simulation */}
        <div className="absolute -left-[7px] top-[115px] w-[3px] h-[28px] bg-[#3f345e] rounded-l-sm" />
        <div className="absolute -left-[7px] top-[160px] w-[3px] h-[50px] bg-[#3f345e] rounded-l-sm" />
        <div className="absolute -left-[7px] top-[220px] w-[3px] h-[50px] bg-[#3f345e] rounded-l-sm" />
        <div className="absolute -right-[7px] top-[170px] w-[3px] h-[75px] bg-[#3f345e] rounded-r-sm" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full bg-[#fbf9f4] rounded-[44px] overflow-hidden flex flex-col shadow-inner select-none">
          {/* iOS Status Bar */}
          <div className="w-full h-11 pt-2.5 px-7 flex items-center justify-between text-xs font-semibold text-[#3b1d5a] shrink-0 z-30 select-none bg-[#3d1266]">
            <span className="text-white/90">{time}</span>

            {/* Dynamic Island */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2.5 gap-1.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-[#4e1984]/80 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-white/90">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable App Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col no-scrollbar bg-[#fbf9f4]">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-full h-5 bg-[#fbf9f4] flex items-center justify-center shrink-0 z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>

      {onToggleFrame && (
        <button
          onClick={onToggleFrame}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-900/90 hover:bg-purple-800 text-amber-200 text-xs font-bold shadow-xl border border-purple-500/30 backdrop-blur-md transition active:scale-95"
          title="Развернуть на широкий экран"
        >
          <Monitor className="w-4 h-4 text-amber-300" />
          <span>Широкий экран</span>
        </button>
      )}
    </div>
  );
};
