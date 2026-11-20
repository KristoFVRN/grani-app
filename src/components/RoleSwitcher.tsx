import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import {
  UserCheck,
  GraduationCap,
  Clock,
  ShieldAlert,
  Smartphone,
  Monitor,
  RotateCcw,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface RoleSwitcherProps {
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ isPhoneFrame, setIsPhoneFrame }) => {
  const { role, setRole, resetAllData, currentUser } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const roles: { id: UserRole; label: string; sub: string; icon: React.ElementType }[] = [
    { id: 'parent', label: 'Родитель', sub: 'Д/З, опоздания, запись к врачам/специалистам', icon: UserCheck },
    { id: 'curator', label: 'Куратор ступени', sub: '1-й урок, фиксация опозданий к 10:30, ДЗ до 15:00', icon: GraduationCap },
    { id: 'extended_teacher', label: 'Педагог продленки', sub: 'ДЗ после 15:00, контроль кружков', icon: Clock },
    { id: 'admin', label: 'Руководитель', sub: 'Супер-админка, 13 специалистов, ступени', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="bg-[#150f24] text-white border-b border-[#2d2247] px-3 py-2.5 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f7f8ea] p-1 flex items-center justify-center shadow-lg border border-purple-300">
              <img src="./logo_icon.png" alt="Грани" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#f7f8ea]">ГРАНИ</span>
                <span className="text-[10px] font-bold bg-[#4e1984] text-amber-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                  ОБРАЗОВАТЕЛЬНЫЙ ЦЕНТР
                </span>
              </div>
              <p className="text-[11px] text-purple-200/70 hidden sm:block">
                Частная школа и продленка • 7 ступеней познания (г. Воронеж)
              </p>
            </div>
          </div>

          {/* 4 Role Selector Buttons */}
          <div className="flex items-center bg-[#0d0918] p-1 rounded-2xl border border-[#372d56] shadow-inner overflow-x-auto max-w-full">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  title={r.sub}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#4e1984] text-[#f7f8ea] shadow-md shadow-purple-950 border border-purple-400/40'
                      : 'text-purple-200/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-purple-300/60'}`} />
                  <span className="hidden md:inline">{r.label}</span>
                  <span className="md:hidden">{r.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-1.5">
            {/* Quick Auth Modal Trigger */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-amber-200 text-xs font-bold border border-amber-300/30 transition shadow-xs"
              title="Войти под учетной записью"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Авторизация'}
              </span>
            </button>

            {/* Frame mode toggle */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              title={isPhoneFrame ? 'Развернуть на весь экран' : 'Показать в рамке смартфона'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#26203c] hover:bg-[#342b52] text-purple-200 text-xs font-medium border border-purple-400/20 transition"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden lg:inline">На весь экран</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden lg:inline">В рамку iPhone</span>
                </>
              )}
            </button>

            {/* Reset Demo button */}
            <button
              onClick={resetAllData}
              title="Сбросить демо-данные к исходным"
              className="p-1.5 rounded-xl bg-[#26203c] hover:bg-[#342b52] text-purple-200/70 hover:text-white border border-purple-400/20 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* School link */}
            <a
              href="https://xn----7sbbl0ahhudy5f.xn--p1ai/"
              target="_blank"
              rel="noopener noreferrer"
              title="Перейти на официальный сайт школа-грани.рф"
              className="p-1.5 rounded-xl bg-[#26203c] hover:bg-[#342b52] text-purple-200/70 hover:text-white border border-purple-400/20 transition hidden sm:flex"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
