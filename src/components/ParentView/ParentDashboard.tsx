import React, { useState } from 'react';
import { SafetySection } from './SafetySection';
import { HomeworkClubSection } from './HomeworkClubSection';
import { ClubsSection } from './ClubsSection';
import { MealsSection } from './MealsSection';
import { FinanceSection } from './FinanceSection';
import { EventsFeedSection } from './EventsFeedSection';
import { ConsultationBookingModal } from './ConsultationBookingModal';
import { ClubEnrollmentModal } from './ClubEnrollmentModal';
import { ParentAbsenceModal } from './ParentAbsenceModal';
import { useApp, pluralizeApplications } from '../../context/AppContext';
import {
  LayoutDashboard,
  Shield,
  Utensils,
  BookOpen,
  CreditCard,
  Camera,
  Sparkles,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  BellRing,
  CheckCircle2
} from 'lucide-react';
import type { PickupPersonType } from '../../types';

export const ParentDashboard: React.FC = () => {
  const { subscriptions, bookings, currentStudent, updatePickup } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'safety' | 'homework' | 'clubs' | 'meals' | 'finance' | 'events'>('all');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [clubEnrollOpen, setClubEnrollOpen] = useState(false);
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [enrollType, setEnrollType] = useState<'trial' | 'regular'>('trial');

  // Check if any club is cancelled today (only for clubs where current student is actually enrolled)
  const cancelledClub = subscriptions.find(
    (c) =>
      c.todayStatus === 'cancelled' &&
      ((c.enrolledStudents || []).some((e) => e.studentId === currentStudent.id) ||
        c.studentId === currentStudent.id)
  );

  const tabs = [
    { id: 'all', label: 'Главная', icon: LayoutDashboard },
    { id: 'safety', label: 'Присутствие', icon: Shield },
    { id: 'homework', label: 'Продленка', icon: BookOpen },
    { id: 'clubs', label: 'Кружки', icon: Sparkles },
    { id: 'meals', label: 'Питание', icon: Utensils },
    { id: 'finance', label: 'Оплата', icon: CreditCard },
    { id: 'events', label: 'События', icon: Camera },
  ];

  const pickupOptions: { type: PickupPersonType; label: string; icon: string }[] = [
    { type: 'mom', label: 'Мама', icon: '👩' },
    { type: 'dad', label: 'Папа', icon: '👨' },
    { type: 'grandma', label: 'Бабушка', icon: '👵' },
    { type: 'custom', label: 'Доверенное', icon: '🤝' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#fbf9f4]">
      {/* Sticky Sub-Navigation Pills */}
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 border-b border-purple-100 sticky top-0 z-20 shadow-xs">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#241738] text-amber-200 shadow-sm shadow-purple-900/30'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-purple-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 space-y-4 pb-24">
        {/* ================= VIEW 1: ГЛАВНАЯ (РАЗГРУЖЕННЫЙ СТАРТОВЫЙ ДАШБОРД) ================= */}
        {activeTab === 'all' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Urgent Alert Banner: Cancelled Club */}
            {cancelledClub && (
              <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-3xl p-4 shadow-lg shadow-rose-900/20 flex items-start gap-3 border border-rose-300">
                <div className="w-9 h-9 rounded-2xl bg-white text-rose-600 flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-rose-100">
                      Внимание: отмена кружка
                    </span>
                    <span className="text-[11px] text-rose-200">Сегодня</span>
                  </div>
                  <h3 className="font-extrabold text-sm mt-1 text-white">
                    Кружок «{cancelledClub.title}» сегодня не проводится!
                  </h3>
                  <p className="text-xs text-rose-100 mt-1 leading-snug">
                    {cancelledClub.cancelReason || 'Педагог на выезде. Ребенок остается под присмотром дежурного куратора на продленке до 19:00.'}
                  </p>
                </div>
              </div>
            )}

            {/* Today Presence & Absence Notice Card */}
            <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Сегодня в центре
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">
                      {currentStudent.status === 'present_ontime'
                        ? 'В центре (вовремя к 1-му уроку)'
                        : currentStudent.status === 'late'
                        ? `Опоздание (прибыл в ${currentStudent.arrivalTime || '10:30'})`
                        : currentStudent.status === 'absent_sick'
                        ? 'Болеет (лечение дома)'
                        : 'Отсутствует'}
                    </div>
                  </div>
                </div>

                {/* Button to Warn School (Requirement 2.2) */}
                <button
                  type="button"
                  onClick={() => setAbsenceModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 active:scale-95 transition"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-700" />
                  <span>Предупредить</span>
                </button>
              </div>

              {/* Show Parent Notice Badge if sent */}
              {currentStudent.parentAbsenceNotice && (
                <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">
                      {currentStudent.parentAbsenceNotice.type === 'sick'
                        ? 'Передано куратору: ребенок заболел'
                        : currentStudent.parentAbsenceNotice.type === 'family'
                        ? 'Передано куратору: семейные обстоятельства'
                        : `Передано куратору: опоздание к ${currentStudent.parentAbsenceNotice.expectedTime || '10:00'}`}
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">
                      Кухня и куратор ступени скорректировали порции питания • {currentStudent.parentAbsenceNotice.reportedAt}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Who is Picking up Today */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-700" />
                    <span>Кто забирает сегодня:</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {currentStudent.pickup?.updatedAt || 'Сегодня'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {pickupOptions.map((opt) => {
                    const active = currentStudent.pickup?.person === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => updatePickup(opt.type)}
                        className={`py-1.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
                          active
                            ? 'bg-[#241738] text-amber-200 shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        <span className="text-sm">{opt.icon}</span>
                        <span className="text-[10px] truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Action Cards: Consultations & Single Clubs Card (Requirement 3.1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Consultation CTA */}
              <div className="bg-gradient-to-br from-[#241738] to-[#3f2563] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between gap-3 border border-purple-200/20">
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Индивидуальный диалог
                  </div>
                  <div className="font-extrabold text-sm text-white mt-1">
                    Личный прием и консультации
                  </div>
                  <p className="text-[11px] text-purple-200/90 mt-0.5 leading-snug">
                    Логопед, психолог, дефектолог, педагоги или руководство
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <span>Записаться на прием</span>
                </button>
              </div>

              {/* Clubs Enrollment CTA (Single Block, Two Buttons) */}
              <div className="bg-gradient-to-br from-[#3b1754] via-[#4e1d70] to-[#6a229a] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between gap-3 border border-amber-400/20">
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Студии и секции
                  </div>
                  <div className="font-extrabold text-sm text-white mt-1">
                    Кружки и дополнительное развитие
                  </div>
                  <p className="text-[11px] text-purple-200/90 mt-0.5 leading-snug">
                    Танцы, робототехника, шахматы, гончарное ремесло, Cambridge Kids
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEnrollType('trial');
                      setClubEnrollOpen(true);
                    }}
                    className="py-2.5 px-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-black text-xs shadow-md active:scale-95 transition flex flex-col items-center justify-center gap-0.5"
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>🎯 Пробное (-50%)</span>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-900 bg-amber-200/90 px-1.5 py-0.5 rounded-full">Разовое занятие</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEnrollType('regular');
                      setClubEnrollOpen(true);
                    }}
                    className="py-2.5 px-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 font-black text-xs shadow-md active:scale-95 transition flex flex-col items-center justify-center gap-0.5"
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>📚 На курс</span>
                    </div>
                    <span className="text-[10px] font-normal text-purple-200">Постоянные занятия</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Consultation Bookings List with Correct Pluralization (Requirement 1.7) */}
            {bookings && bookings.length > 0 && (
              <div className="bg-white p-3.5 rounded-3xl border border-purple-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-700" />
                    <span>Мои записи на консультации:</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {pluralizeApplications(bookings.length)}
                  </span>
                </div>

                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-950">
                          {b.specialistTitle} — {b.specialistName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status === 'confirmed' ? '✓ Согласовано' : '⏳ На рассмотрении'}
                        </span>
                      </div>

                      <p className="text-slate-600 text-[11px]">
                        <strong>Тема: </strong>«{b.topicProblem}»
                      </p>

                      {b.status === 'confirmed' && (
                        <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200/60 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            Время приема: <strong>{b.confirmedDateTime}</strong> ({b.confirmedRoom})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= DEDICATED TAB VIEWS (Requirement 3.2) ================= */}
        {activeTab === 'safety' && <SafetySection />}
        {activeTab === 'homework' && <HomeworkClubSection />}
        {activeTab === 'clubs' && <ClubsSection />}
        {activeTab === 'meals' && <MealsSection />}
        {activeTab === 'finance' && <FinanceSection />}
        {activeTab === 'events' && <EventsFeedSection />}
      </div>

      {/* Modals */}
      <ConsultationBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <ClubEnrollmentModal isOpen={clubEnrollOpen} onClose={() => setClubEnrollOpen(false)} defaultType={enrollType} />
      <ParentAbsenceModal open={absenceModalOpen} onClose={() => setAbsenceModalOpen(false)} />
    </div>
  );
};
