import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Phone,
  User,
  Calendar,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  HelpCircle,
  AlertCircle,
  GraduationCap,
  Shield,
  Users
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, quickLogin } = useApp();
  const [activeTab, setActiveTab] = useState<'parent' | 'staff'>('parent');
  
  // Parent Form
  const [parentPhone, setParentPhone] = useState('');
  const [childBirthDate, setChildBirthDate] = useState('');
  
  // Staff Form
  const [staffLogin, setStaffLogin] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format phone as user types
  const handlePhoneChange = (val: string) => {
    setErrorMessage(null);
    setParentPhone(val);
  };

  const handleBirthDateChange = (val: string) => {
    setErrorMessage(null);
    setChildBirthDate(val.replace(/\D/g, '').slice(0, 8));
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentPhone.trim()) {
      setErrorMessage('Пожалуйста, введите номер телефона родителя');
      return;
    }
    if (!childBirthDate.trim()) {
      setErrorMessage('Пожалуйста, введите дату рождения ребенка (8 цифр без точек)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(parentPhone, childBirthDate);
      setIsSubmitting(false);
      if (typeof res === 'object' && !res.success) {
        setErrorMessage(res.message || 'Не удалось войти. Проверьте номер телефона или дату рождения.');
      } else if (res === false) {
        setErrorMessage('Ученик с таким номером родителя или датой рождения не найден.');
      }
    }, 200);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffLogin.trim()) {
      setErrorMessage('Введите номер телефона или логин сотрудника');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(staffLogin, staffPassword);
      setIsSubmitting(false);
      if (typeof res === 'object' && !res.success) {
        setErrorMessage(res.message || 'Неверный логин или пароль сотрудника');
      } else if (res === false) {
        setErrorMessage('Сотрудник не найден или пароль не совпадает');
      }
    }, 200);
  };

  return (
    <div className="min-h-full flex flex-col bg-[#fbf9f4] text-slate-800">
      {/* Brand Top Header */}
      <div className="bg-gradient-to-b from-[#2b1049] via-[#451475] to-[#5a1c99] text-white pt-8 pb-10 px-5 rounded-b-[36px] shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-md mx-auto flex flex-col items-center text-center relative z-10">
          {/* Logo with purple origami bird */}
          <div className="w-20 h-20 rounded-3xl bg-[#f7f8ea] p-2.5 shadow-2xl flex items-center justify-center border-2 border-purple-200/60 mb-3.5 transform hover:scale-105 transition duration-300">
            <img src="./logo_icon.png" alt="Школа ГРАНИ" className="w-full h-full object-contain" />
          </div>

          <h1 className="font-extrabold text-2xl tracking-tight text-[#f7f8ea] leading-tight">
            ЧАСТНАЯ ШКОЛА «ГРАНИ»
          </h1>
          <p className="text-xs font-semibold text-amber-300 tracking-wider uppercase mt-1">
            Образовательный центр • г. Воронеж
          </p>
          <p className="text-[12px] text-purple-200/90 mt-1.5 max-w-xs font-serif italic">
            «Создаем будущее»
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 -mt-5 pb-8 relative z-20 flex flex-col">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100 flex flex-col">
          {/* Role Switch Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-5 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('parent');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'parent'
                  ? 'bg-gradient-to-r from-[#4e1984] to-[#6a25b3] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Родителям</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('staff');
                setErrorMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'staff'
                  ? 'bg-gradient-to-r from-[#4e1984] to-[#6a25b3] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Сотрудникам</span>
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* PARENT LOGIN FORM */}
          {activeTab === 'parent' && (
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Номер телефона родителя</span>
                  <span className="text-[10px] text-purple-700 font-normal">Ваш логин</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+7 (903) 858-12-34"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4e1984] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Дата рождения ребенка</span>
                  <span className="text-[10px] text-purple-700 font-normal">Ваш пароль (8 цифр)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    value={childBirthDate}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    placeholder="ДДММГГГГ (например, 14052016)"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold tracking-wider text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4e1984] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Informational Hint */}
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100 text-[11px] text-purple-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  Для входа используется номер телефона из договора и дата рождения вашего ребенка — <strong>только 8 цифр без точек</strong> в формате <strong>ДДММГГГГ</strong> (например: <strong>14052016</strong>).
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#4e1984] to-[#6b25b6] hover:from-[#431472] hover:to-[#5e1f9f] active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-900/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Проверка данных...' : 'Войти в личный кабинет'}</span>
              </button>
            </form>
          )}

          {/* STAFF LOGIN FORM */}
          {activeTab === 'staff' && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Телефон или логин сотрудника</span>
                  <span className="text-[10px] text-purple-700 font-normal">Логин</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={staffLogin}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setStaffLogin(e.target.value);
                    }}
                    placeholder="+7 (___) ... или admin / curator"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4e1984] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Пароль сотрудника</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={staffPassword}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setStaffPassword(e.target.value);
                    }}
                    placeholder="•••••••• (по умолчанию: grani2026)"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4e1984] focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  Для входа руководителя: <strong>admin</strong> (пароль <strong>grani2026</strong>).
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#241738] to-[#3a2157] hover:from-[#1b112c] hover:to-[#2e1a47] active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Вход...' : 'Войти как сотрудник'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Login Cards for easy testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Быстрый тестовый вход в 1 клик</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-left border border-purple-200/60 transition active:scale-95 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-[#241738] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  Р
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-purple-950 truncate">Руководитель</div>
                  <div className="text-[10px] text-purple-700 truncate">Ольга Николаевна</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('parent')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-left border border-amber-200/60 transition active:scale-95 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  М
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-amber-950 truncate">Родитель Миши</div>
                  <div className="text-[10px] text-amber-800 truncate">Елена Грачева</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('curator')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-left border border-blue-200/60 transition active:scale-95 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  К
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-blue-950 truncate">Куратор ступени 1</div>
                  <div className="text-[10px] text-blue-700 truncate">Анна Сергеевна</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('extended')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-left border border-emerald-200/60 transition active:scale-95 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  П
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-emerald-950 truncate">Педагог продленки</div>
                  <div className="text-[10px] text-emerald-700 truncate">Марина Игоревна</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-xs text-slate-400">
          Возникли трудности со входом? Позвоните в приемную:{' '}
          <a href="tel:+79038586328" className="text-purple-700 font-bold hover:underline">
            +7 (903) 858-63-28
          </a>
        </div>
      </div>
    </div>
  );
};
