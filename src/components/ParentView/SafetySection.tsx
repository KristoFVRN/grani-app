import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PickupPersonType } from '../../types';
import {
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react';

export const SafetySection: React.FC = () => {
  const { currentStudent, updatePickup } = useApp();
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customName, setCustomName] = useState(currentStudent?.pickup?.customName || '');
  const [customPhone, setCustomPhone] = useState(currentStudent?.pickup?.phone || '');
  const [showStats, setShowStats] = useState(false);

  React.useEffect(() => {
    if (currentStudent?.pickup) {
      setCustomName(currentStudent.pickup.customName || '');
      setCustomPhone(currentStudent.pickup.phone || '');
    }
    setIsEditingCustom(false);
  }, [currentStudent?.id, currentStudent?.pickup]);

  if (!currentStudent) return null;

  const pickupOptions: { type: PickupPersonType; label: string; icon: string }[] = [
    { type: 'mom', label: 'Мама', icon: '👩' },
    { type: 'dad', label: 'Папа', icon: '👨' },
    { type: 'grandma', label: 'Бабушка', icon: '👵' },
    { type: 'custom', label: 'Доверенное лицо', icon: '👤' },
  ];

  const handleSelectPickup = (type: PickupPersonType) => {
    if (type === 'custom') {
      setIsEditingCustom(true);
    } else {
      setIsEditingCustom(false);
      updatePickup(type);
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    updatePickup('custom', customName, customPhone);
    setIsEditingCustom(false);
  };

  const isLate = currentStudent.status === 'late';
  const isPresent = currentStudent.status === 'present_ontime';
  const isSick = currentStudent.status === 'absent_sick';
  const stats = currentStudent.attendanceStats || {
    monthName: 'Ноябрь',
    totalDays: 22,
    presentOnTime: 14,
    lateDays: 5,
    sickDays: 2,
    parentMissedDays: 1,
    lateDetails: []
  };

  return (
    <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-[#241738] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-[#3e255f]" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-[#241738]">
              Присутствие и безопасность
            </h2>
            <p className="text-[11px] text-slate-500">
              Фиксация куратором на 1-м занятии
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs ${
            isPresent
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : isLate
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : isSick
              ? 'bg-sky-50 text-sky-800 border border-sky-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPresent
                ? 'bg-emerald-500 animate-pulse'
                : isLate
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          />
          {isPresent
            ? 'В центре (вовремя)'
            : isLate
            ? `Опоздал к ${currentStudent.arrivalTime || '10:30'}`
            : isSick
            ? 'Болеет'
            : 'Отсутствует'}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-purple-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Фактический приход
            </div>
            <div className="font-extrabold text-slate-900 leading-snug">
              {isPresent
                ? `В ${currentStudent.arrivalTime || '08:24'} (вовремя)`
                : isLate
                ? `В ${currentStudent.arrivalTime || '10:30'} (опоздание)`
                : 'Не явился'}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Локация и куратор
            </div>
            <div className="font-extrabold text-slate-900 leading-snug" title={currentStudent.room}>
              {currentStudent.room}
            </div>
          </div>
        </div>
      </div>

      {/* Alert if Late Today */}
      {isLate && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 text-amber-950 rounded-2xl text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Зафиксирован поздний приход: {currentStudent.arrivalTime}</span>
          </div>
          <p className="text-[11px] text-amber-800">
            Пропущен 1-й урок: <strong>{currentStudent.missedSubjectToday || 'Русский язык и грамота'}</strong>.
            Материал будет восполнен на индивидуальной продленке с куратором.
          </p>
        </div>
      )}

      {/* Monthly Attendance & Late Arrival Analytics (Requirement 2) */}
      <div className="border border-purple-100 rounded-2xl overflow-hidden bg-purple-50/30">
        <button
          type="button"
          onClick={() => setShowStats(!showStats)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#241738] hover:bg-purple-50 transition"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-700" />
            <span>Статистика посещаемости и пропусков за {stats.monthName}</span>
            {stats.lateDays > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                {stats.lateDays} опозд.
              </span>
            )}
          </div>
          {showStats ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showStats && (
          <div className="p-4 pt-1 space-y-3 border-t border-purple-100 text-xs">
            {/* 4 Summary Pills */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-semibold">Всего дней</div>
                <div className="font-black text-slate-800 text-sm">{stats.totalDays}</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                <div className="text-[10px] text-emerald-600 font-semibold">Вовремя</div>
                <div className="font-black text-emerald-700 text-sm">{stats.presentOnTime}</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-2xs bg-amber-50/50">
                <div className="text-[10px] text-amber-800 font-bold">Опозданий</div>
                <div className="font-black text-amber-700 text-sm">{stats.lateDays}</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-rose-100 shadow-2xs">
                <div className="text-[10px] text-rose-600 font-semibold">Пропусков</div>
                <div className="font-black text-rose-700 text-sm">{stats.sickDays + stats.parentMissedDays}</div>
              </div>
            </div>

            {/* Explanation why missed lessons hurt grades */}
            <div className="p-3 bg-white rounded-xl border border-amber-200/80 text-[11px] text-slate-700 space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Отчет для родителей об упущенных занятиях:</span>
              </div>
              <p className="text-slate-600">
                Из-за утренних опозданий (приезд после 10:00) в этом месяце пропущено{' '}
                <strong className="text-rose-700 font-bold">{stats.lateDays} первых уроков «Русский язык и прописи»</strong>.
                Это ключевая причина сложностей с каллиграфией и орфографией. Рекомендуем приводить ребенка к 08:20.
              </p>
            </div>

            {/* List of specific late days */}
            {stats.lateDetails && stats.lateDetails.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Журнал поздних приходов:
                </div>
                {stats.lateDetails.map((rec, i) => (
                  <div
                    key={i}
                    className="p-2 bg-white rounded-xl border border-slate-100 flex items-start justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{rec.date}</span> — прибыл в{' '}
                      <strong className="text-amber-700">{rec.arrivalTime}</strong>
                      <div className="text-slate-500 text-[10px] mt-0.5">
                        Пропущен: {rec.missedSubjects} • {rec.curatorComment}
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded text-[9px] font-bold">
                      Опоздание
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pickup Section ("Кто забирает сегодня") */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-700" />
            <span>Кто забирает ребенка сегодня:</span>
          </div>
          <span className="text-[10px] text-slate-400">
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
                onClick={() => handleSelectPickup(opt.type)}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
                  active
                    ? 'bg-[#241738] text-amber-200 shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <span className="text-sm">{opt.icon}</span>
                <span className="text-[10px] truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Person form */}
        {isEditingCustom && (
          <form onSubmit={handleSaveCustom} className="p-3 bg-purple-50 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-purple-950">Укажите доверенное лицо:</div>
            <input
              type="text"
              required
              placeholder="ФИО (например: Сергеева Ольга Петровна)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-xs"
            />
            <input
              type="tel"
              placeholder="Телефон для проверки охраны"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-xs"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-[#241738] text-amber-200 font-bold rounded-lg text-xs"
              >
                Подтвердить
              </button>
              <button
                type="button"
                onClick={() => setIsEditingCustom(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs"
              >
                Отмена
              </button>
            </div>
          </form>
        )}

        {currentStudent.pickup?.person === 'custom' && !isEditingCustom && (
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500 text-[10px]">Доверенное лицо: </span>
              <strong className="text-slate-900">{currentStudent.pickup.customName}</strong>
              {currentStudent.pickup.phone && (
                <span className="text-slate-500 text-[11px]"> ({currentStudent.pickup.phone})</span>
              )}
            </div>
            <button
              onClick={() => setIsEditingCustom(true)}
              className="text-[10px] text-purple-700 font-bold hover:underline"
            >
              Изменить
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
