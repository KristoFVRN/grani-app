import React, { useState } from 'react';
import { Lock, LogIn, User, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const { login, currentUser } = useApp();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = login(loginInput.trim(), passwordInput);
    if (success) {
      onClose();
    } else {
      setError('Неверный логин. Попробуйте один из быстрых аккаунтов ниже.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    login(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-purple-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#241738] via-[#351e54] to-[#1e1330] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-black text-sm shadow">
              Г
            </div>
            <div>
              <div className="font-extrabold text-base leading-tight tracking-wide text-amber-200">
                ЦЕНТР «ГРАНИ»
              </div>
              <div className="text-[10px] text-purple-300">
                Студии познания и развития
              </div>
            </div>
          </div>
          <p className="text-xs text-purple-200/90 mt-2">
            Вход в персональный кабинет родителя, куратора ступени или руководителя
          </p>
        </div>

        {/* Current User Info if any */}
        {currentUser && (
          <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Сейчас активен: <strong>{currentUser.name}</strong></span>
            </div>
          </div>
        )}

        {/* Quick Roles Grid */}
        <div className="p-5 pb-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Быстрый вход по роли:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('parent')}
              className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-left transition flex flex-col gap-0.5 active:scale-95"
            >
              <span className="font-bold text-purple-950">👨‍👩‍👦 Родитель</span>
              <span className="text-[10px] text-purple-600 truncate">Елена Грачева (Миша)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('curator')}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition flex flex-col gap-0.5 active:scale-95"
            >
              <span className="font-bold text-emerald-950">👩‍🏫 Куратор ступени</span>
              <span className="text-[10px] text-emerald-700 truncate">Анна Сергеевна (Ступень 1)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('extended_teacher')}
              className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100/70 text-left transition flex flex-col gap-0.5 active:scale-95"
            >
              <span className="font-bold text-sky-950">🎒 Дежурный продленки</span>
              <span className="text-[10px] text-sky-700 truncate">Марина Игоревна (после 15:00)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-left transition flex flex-col gap-0.5 active:scale-95"
            >
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Руководитель
              </span>
              <span className="text-[10px] text-amber-800 truncate">Супер-админ (Редактор)</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="px-5 flex items-center gap-3 my-1">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">или вход по логину</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="p-5 pt-2 space-y-3">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Логин (parent / curator / extended / admin)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="parent"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Пароль
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#241738] hover:bg-[#342250] text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            Войти в систему
          </button>
        </form>
      </div>
    </div>
  );
};
