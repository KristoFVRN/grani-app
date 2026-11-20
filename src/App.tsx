import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { RoleSwitcher } from './components/RoleSwitcher';
import { PhoneFrame } from './components/PhoneFrame';
import { Header } from './components/Header';
import { ParentDashboard } from './components/ParentView/ParentDashboard';
import { TeacherDashboard } from './components/TeacherView/TeacherDashboard';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { MapPin, Phone, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role } = useApp();

  return (
    <div className="flex-1 flex flex-col min-h-full">
      {/* App Header with Logo & Role subtitle */}
      <Header />

      {/* Main Role Content */}
      <div className="flex-1 flex flex-col">
        {role === 'parent' && <ParentDashboard />}
        {(role === 'curator' || role === 'extended_teacher') && <TeacherDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
};

export function App() {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0e0c16] text-[#241c30] flex flex-col font-sans">
        {/* Global Toast Notifications */}
        <ToastContainer />

        {/* Top Control Bar with Role Switcher & Frame Toggler */}
        <RoleSwitcher isPhoneFrame={isPhoneFrame} setIsPhoneFrame={setIsPhoneFrame} />

        {/* Main Phone View / Responsive Screen */}
        <PhoneFrame isPhoneFrame={isPhoneFrame}>
          <AppContent />
        </PhoneFrame>

        {/* Desktop-only Footer (hidden in mobile simulator) */}
        {!isPhoneFrame && (
          <footer className="bg-[#140e20] text-purple-200/80 px-6 py-4 text-xs shrink-0 border-t border-purple-900/40 mt-auto">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#f7f8ea] p-0.5 flex items-center justify-center">
                  <img src="./logo_icon.png" alt="Грани" className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-[#f7f8ea] tracking-wider">ОБРАЗОВАТЕЛЬНЫЙ ЦЕНТР «ГРАНИ» (г. Воронеж)</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-purple-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>Гражданский переулок, д. 1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a href="tel:+79038586328" className="hover:underline text-white font-medium">+7 (903) 858-63-28</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-300" />
                  <a href="https://xn----7sbbl0ahhudy5f.xn--p1ai/" target="_blank" rel="noreferrer" className="hover:underline text-white">школа-грани.рф</a>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
