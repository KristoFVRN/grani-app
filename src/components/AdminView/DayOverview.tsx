import React, { useState } from 'react';
import { useApp, pluralizePortions, pluralizeApplications } from '../../context/AppContext';
import {
  Users,
  Utensils,
  Calendar,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Check
} from 'lucide-react';

export const DayOverview: React.FC = () => {
  const {
    students,
    stages,
    subscriptions,
    bookings,
    updateBookingStatus,
    shiftHandoff
  } = useApp();

  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed'>('all');

  // Metrics
  const presentCount = students.filter((s) => s.status === 'present_ontime').length;
  const lateCount = students.filter((s) => s.status === 'late').length;
  const inCenterCount = presentCount + lateCount;
  const sickCount = students.filter((s) => s.status === 'absent_sick').length;
  const parentMissedCount = students.filter((s) => s.status === 'absent_parent').length;

  // Kitchen
  const portionsCount = inCenterCount;
  const specialDietStudents = students.filter((s) => s.dietaryNeeds && s.dietaryNeeds.includes('⚠️'));

  // Homework stats
  const hwDoneCount = students.filter((s) => s.homework?.finalStatus === 'all_done').length;
  const hwNeedsHomeCount = students.filter((s) => s.homework?.finalStatus === 'needs_home_finish').length;

  // Operational events
  const cancelledClubs = subscriptions.filter((c) => c.todayStatus === 'cancelled');

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'pending') return b.status === 'pending';
    if (bookingFilter === 'confirmed') return b.status === 'confirmed';
    return true;
  });

  const handleQuickApprove = (bookingId: string) => {
    updateBookingStatus(
      bookingId,
      'confirmed',
      'Завтра в 16:30',
      'Кабинет 104 «Психолог / Логопед»',
      'Согласовано руководителем школы'
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. School Header Banner */}
      <div className="bg-gradient-to-r from-[#241738] via-[#3a1d5a] to-[#4e1984] text-white p-4 rounded-3xl shadow-md border border-purple-300/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/25 px-2 py-0.5 rounded-full">
              Оперативная сводка за день
            </span>
            <h2 className="text-base font-black text-white mt-1">
              Центр развития «ГРАНИ» сегодня
            </h2>
            <p className="text-[11px] text-purple-200 mt-0.5">
              Сводная аналитика по всем 7 ступеням познания
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-amber-300">{inCenterCount}</span>
            <span className="text-xs text-white/80"> / {students.length} детей</span>
            <div className="text-[10px] text-emerald-300 font-semibold">в центре сейчас</div>
          </div>
        </div>

        {/* Counters grid */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/15 text-center text-xs">
          <div className="bg-black/25 p-2 rounded-2xl">
            <div className="text-emerald-300 font-black text-base">{presentCount}</div>
            <div className="text-[9px] text-white/80 uppercase font-semibold">Вовремя</div>
          </div>
          <div className="bg-black/25 p-2 rounded-2xl">
            <div className="text-amber-300 font-black text-base">{lateCount}</div>
            <div className="text-[9px] text-white/80 uppercase font-semibold">Опоздали</div>
          </div>
          <div className="bg-black/25 p-2 rounded-2xl">
            <div className="text-sky-300 font-black text-base">{sickCount}</div>
            <div className="text-[9px] text-white/80 uppercase font-semibold">Болеют</div>
          </div>
          <div className="bg-black/25 p-2 rounded-2xl">
            <div className="text-rose-300 font-black text-base">{parentMissedCount}</div>
            <div className="text-[9px] text-white/80 uppercase font-semibold">Пропуски</div>
          </div>
        </div>
      </div>

      {/* 2. Breakdown by the 7 Stages of Learning */}
      <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-700" />
            <span>Посещаемость по ступеням познания:</span>
          </div>
          <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-bold">
            7 официальных ступеней
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {stages.map((st) => {
            const stageStudents = students.filter((s) => s.stageId === st.id);
            const present = stageStudents.filter((s) => s.status === 'present_ontime' || s.status === 'late').length;
            const total = stageStudents.length || st.studentCount;

            return (
              <div
                key={st.id}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-extrabold text-slate-900 text-xs truncate">
                    {st.name} {st.badge ? `«${st.badge.split(' ')[0]}»` : ''}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {st.curatorName} • {st.room}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-purple-900 text-xs">
                    {present} из {total}
                  </span>
                  <div className="text-[9px] text-slate-400">в классе</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Kitchen & Nutrition Summary */}
      <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Сводка для пищеблока (кухни)
              </div>
              <div className="font-black text-sm text-slate-900">
                Заказ на сегодня: {pluralizePortions(portionsCount)}
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            По факту присутствия
          </span>
        </div>

        {specialDietStudents.length > 0 && (
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5">
            <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <span>⚠️ Особое питание и аллергии:</span>
              <span className="text-[10px] text-amber-700 font-normal">
                ({specialDietStudents.length} детей на контроле)
              </span>
            </div>
            <div className="space-y-1">
              {specialDietStudents.map((s) => (
                <div
                  key={s.id}
                  className="bg-white px-2.5 py-1.5 rounded-xl border border-amber-200 text-[11px] flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900">{s.name} ({s.class.split(' ')[2] || s.class}):</span>
                  <span className="text-amber-900 font-semibold">{s.dietaryNeeds}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Consultation Booking Registry */}
      <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Реестр консультаций со специалистами
              </div>
              <div className="font-black text-sm text-slate-900">
                {pluralizeApplications(bookings.length)}
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 p-0.5 bg-slate-100 rounded-xl text-[10px] font-bold">
            <button
              onClick={() => setBookingFilter('all')}
              className={`px-2 py-1 rounded-lg transition ${
                bookingFilter === 'all' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setBookingFilter('pending')}
              className={`px-2 py-1 rounded-lg transition ${
                bookingFilter === 'pending' ? 'bg-amber-400 text-purple-950 font-black shadow-2xs' : 'text-slate-500'
              }`}
            >
              Ожидают
            </button>
            <button
              onClick={() => setBookingFilter('confirmed')}
              className={`px-2 py-1 rounded-lg transition ${
                bookingFilter === 'confirmed' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              Согласованы
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-extrabold text-slate-900">
                    {b.studentName} • {b.parentName} ({b.parentPhone})
                  </div>
                  <div className="text-[11px] text-purple-800 font-bold mt-0.5">
                    К кому: {b.specialistTitle} ({b.specialistName})
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {b.status === 'confirmed' ? '✓ Согласовано' : '⏳ Ожидает'}
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <strong>Вопрос родителя: </strong>«{b.topicProblem}»
              </div>

              {b.status === 'confirmed' ? (
                <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Назначено: {b.confirmedDateTime} ({b.confirmedRoom})</span>
                </div>
              ) : (
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickApprove(b.id)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Согласовать время</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                  >
                    Отклонить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Operational Changes & Shift Handoff */}
      <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Лента оперативных изменений сегодня:</span>
          </div>
          <span className="text-[10px] text-slate-400">СКУД & Расписание</span>
        </div>

        {/* Shift handoff status */}
        {shiftHandoff ? (
          <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-teal-950 font-bold">
              <span>✓ Передача смены в 15:00 зафиксирована</span>
              <span className="text-[10px] text-teal-700">{shiftHandoff.time}</span>
            </div>
            <div className="text-[11px] text-teal-800">
              Куратор ({shiftHandoff.fromStaffName}) ➔ Педагог продленки ({shiftHandoff.toStaffName})
            </div>
            <div className="text-[10px] text-slate-600 italic">«{shiftHandoff.notes}»</div>
          </div>
        ) : (
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            Передача смены на продленку ожидается в 15:00.
          </div>
        )}

        {/* Cancelled clubs notice */}
        {cancelledClubs.length > 0 ? (
          cancelledClubs.map((club) => (
            <div
              key={club.id}
              className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                ✕
              </div>
              <div>
                <div className="font-extrabold text-rose-950">
                  Отмена кружка: {club.title}
                </div>
                <div className="text-[11px] text-rose-800 mt-0.5">
                  Причина: {club.cancelReason || 'Педагог на выезде'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Уведомлены родители {club.enrolledStudents?.length || 0} учеников
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[11px] text-slate-400 text-center py-1">
            Все кружки и занятия проводятся в штатном режиме.
          </div>
        )}
      </div>

      {/* 6. Homework Completion Summary */}
      <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-700" />
            <span>Сводка по выполнению ДЗ:</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            {hwDoneCount} из {students.length} закрыто
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="font-black text-emerald-800 text-base">{hwDoneCount}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Все сделано в школе</div>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="font-black text-amber-800 text-base">{hwNeedsHomeCount}</div>
            <div className="text-[10px] text-amber-700 font-semibold">Доделывают дома</div>
          </div>
        </div>
      </div>
    </div>
  );
};
