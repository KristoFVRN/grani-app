import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  X,
  ListOrdered
} from 'lucide-react';
import type { ClubSubscription } from '../../types';
import { AfterSchoolClubsDispatch } from './AfterSchoolClubsDispatch';

export const ClubsManager: React.FC = () => {
  const { subscriptions, toggleClubStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'dispatch' | 'status'>('dispatch');
  const [cancellingClub, setCancellingClub] = useState<ClubSubscription | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const quickReasons = [
    'Педагог на больничном. Дети находятся на продленке с дежурным куратором.',
    'Выезд студии на городской турнир/выставку.',
    'Технический перерыв в арт-лаборатории. Продленка работает до 19:00.',
  ];

  const handleOpenCancel = (club: ClubSubscription) => {
    setCancellingClub(club);
    setReasonInput(quickReasons[0]);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingClub) return;
    toggleClubStatus(cancellingClub.id, 'cancelled', reasonInput);
    setCancellingClub(null);
  };

  return (
    <div className="space-y-3.5 text-xs">
      {/* Sub-tabs for Clubs Manager */}
      <div className="grid grid-cols-2 p-1 bg-white rounded-2xl border border-purple-100 shadow-xs font-bold text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'dispatch'
              ? 'bg-[#241738] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>1️⃣ Маршрутный лист продленки</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('status')}
          className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'status'
              ? 'bg-[#241738] text-amber-300 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>2️⃣ Статус занятий и отмены</span>
        </button>
      </div>

      {activeTab === 'dispatch' ? (
        <AfterSchoolClubsDispatch />
      ) : (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#241738] to-[#402368] text-white p-4 rounded-3xl shadow-md border border-purple-300/30">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">
                  Управление кружками и мастерскими
                </div>
                <div className="font-extrabold text-base">Оперативный статус занятий</div>
              </div>
            </div>
            <p className="text-[11px] text-purple-200 mt-2 leading-relaxed">
              Если преподаватель заболел или на турнире — отметьте отмену здесь в 1 клик. Родители мгновенно увидят яркое предупреждение в приложении и не будут зря приезжать за ребенком!
            </p>
          </div>

          {/* Clubs List */}
          <div className="space-y-3">
            {subscriptions.map((club) => {
              const isCancelled = club.todayStatus === 'cancelled';

              return (
                <div
                  key={club.id}
                  className={`p-4 rounded-2xl border transition ${
                    isCancelled
                      ? 'bg-rose-50/70 border-rose-300'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">{club.title}</h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Преподаватель: <strong>{club.curatorName}</strong>
                      </div>
                      <div className="text-[10px] text-purple-700 font-semibold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {club.scheduleDays}: {club.startTime} – {club.endTime} (забирать в {club.pickupStrictTime})
                      </div>
                    </div>

                    {isCancelled ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] shrink-0">
                        ОТМЕНЕНО
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                        По расписанию
                      </span>
                    )}
                  </div>

                  {isCancelled && club.cancelReason && (
                    <div className="mb-3 p-2 bg-rose-100 text-rose-900 rounded-xl text-[11px]">
                      <strong>Причина: </strong>{club.cancelReason}
                    </div>
                  )}

                  {/* Status Toggles */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {!isCancelled ? (
                      <button
                        type="button"
                        onClick={() => handleOpenCancel(club)}
                        className="flex-1 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 border border-rose-200"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Отменить занятие на сегодня
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleClubStatus(club.id, 'active')}
                        className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Вернуть в расписание (Состоится)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Cancel Modal */}
      {cancellingClub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 border border-rose-100 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-extrabold text-sm text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Отмена кружка на сегодня</span>
              </div>
              <button
                onClick={() => setCancellingClub(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-950">
              Кружок: <strong>{cancellingClub.title}</strong>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Выберите готовую причину или введите свою:
                </label>
                <div className="space-y-1 mb-2">
                  {quickReasons.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReasonInput(r)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-purple-50 text-[11px] text-slate-700 border border-slate-200 transition"
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  required
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Отменить и оповестить родителей
                </button>
                <button
                  type="button"
                  onClick={() => setCancellingClub(null)}
                  className="px-3 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-xl"
                >
                  Назад
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
