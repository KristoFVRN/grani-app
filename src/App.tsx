import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { PhoneFrame } from './components/PhoneFrame';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { ParentDashboard } from './components/ParentView/ParentDashboard';
import { TeacherDashboard } from './components/TeacherView/TeacherDashboard';
import { AdminDashboard } from './components/AdminView/AdminDashboard';
import { MapPin, Phone, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, role } = useApp();
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // If user is not authenticated, show modern School Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0e0c16] text-[#241c30] flex flex-col font-sans">
        <ToastContainer />
        <PhoneFrame isPhoneFrame={isPhoneFrame} onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}>
          <LoginScreen />
        </PhoneFrame>
      </div>
    );
  }

  // Authenticated Application View
  return (
    <div className="min-h-screen bg-[#0e0c16] text-[#241c30] flex flex-col font-sans">
      <ToastContainer />

      <PhoneFrame isPhoneFrame={isPhoneFrame} onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}>
        <div className="flex-1 flex flex-col min-h-full">
          <Header />
          <div className="flex-1 flex flex-col">
            {role === 'parent' && <ParentDashboard />}
            {(role === 'curator' || role === 'extended_teacher') && <TeacherDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        </div>
      </PhoneFrame>

      {/* Desktop-only Footer (shown in wide desktop view) */}
      {!isPhoneFrame && (
        <footer className="bg-[#140e20] text-purple-200/80 px-6 py-4 text-xs shrink-0 border-t border-purple-900/40 mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#f7f8ea] p-0.5 flex items-center justify-center">
                <img src="./logo_icon.png" alt="Грани" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-[#f7f8ea] tracking-wider">
                ЧАСТНАЯ ШКОЛА «ГРАНИ» (г. Воронеж)
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-purple-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Гражданский переулок, д. 1</span>
              </div>
              <a href="tel:+79038586328" className="flex items-center gap-1.5 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+7 (903) 858-63-28</span>
              </a>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-300" />
                <span>Частная школа & продленка</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
