import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isPhoneFrame }) => {
  const [time, setTime] = useState('11:05');

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!isPhoneFrame) {
    return (
      <main className="w-full max-w-5xl mx-auto min-h-[calc(100vh-65px)] bg-[#f7f8ea] text-[#241c30] shadow-2xl flex flex-col transition-all duration-300">
        {children}
      </main>
    );
  }

  return (
    <div className="py-6 sm:py-8 flex items-center justify-center min-h-[calc(100vh-65px)] bg-gradient-to-br from-[#120f1f] via-[#1a142e] to-[#0f0c1b]">
      {/* Phone Body with Realistic Bezel */}
      <div className="relative w-[390px] h-[830px] bg-[#0c0a14] rounded-[52px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[4px] border-[#3f345e] ring-1 ring-white/10 flex flex-col transition-all duration-300">
        {/* Outer buttons simulation */}
        <div className="absolute -left-[7px] top-[115px] w-[3px] h-[28px] bg-[#3f345e] rounded-l-sm" />
        <div className="absolute -left-[7px] top-[160px] w-[3px] h-[50px] bg-[#3f345e] rounded-l-sm" />
        <div className="absolute -left-[7px] top-[220px] w-[3px] h-[50px] bg-[#3f345e] rounded-l-sm" />
        <div className="absolute -right-[7px] top-[170px] w-[3px] h-[75px] bg-[#3f345e] rounded-r-sm" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full bg-[#f7f8ea] rounded-[44px] overflow-hidden flex flex-col shadow-inner select-none">
          {/* iOS Status Bar */}
          <div className="w-full h-11 pt-2.5 px-7 flex items-center justify-between text-xs font-semibold text-[#3b1d5a] shrink-0 z-30 select-none">
            <span>{time}</span>

            {/* Dynamic Island */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2.5 gap-1.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-[#4e1984]/80 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="w-full h-5 flex items-center justify-center shrink-0 bg-[#f7f8ea] z-30">
            <div className="w-32 h-1 bg-[#3b1d5a]/25 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
