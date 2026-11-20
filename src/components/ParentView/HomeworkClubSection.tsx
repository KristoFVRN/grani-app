import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';

export const HomeworkClubSection: React.FC = () => {
  const { currentStudent, weeklySchedule } = useApp();
  const hw = currentStudent?.homework;
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDayIdx, setScheduleDayIdx] = useState(0);

  if (!hw) return null;

  const isAllDone = hw.finalStatus === 'all_done';

  return (
    <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-100 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm text-[#241738]">
                Дневник и продленка
              </h2>
              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                УТП Грани
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Двухэтапный контроль: куратор до 15:00 + дежурный педагог после 15:00
            </p>
          </div>
        </div>
      </div>

      {/* Main USP Hero Banner */}
      {isAllDone ? (
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-3xl p-4.5 shadow-md shadow-emerald-950/15 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-emerald-100">
                  Все задания выполнены
                </span>
              </div>
              <h3 className="font-black text-base mt-1 text-white flex items-center gap-1.5">
                Сделано на продленке!
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-50/90 mt-1 leading-snug">
                Никаких уроков вечером дома! Семья может спокойно ужинать, общаться и отдыхать.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-3xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/15 px-2 py-0.5 rounded-full text-amber-100">
                Есть небольшие недоделки
              </span>
              <h3 className="font-extrabold text-base mt-1">Осталось доделать дома</h3>
              <p className="text-xs text-amber-50 mt-1">
                {hw.homeTaskRemaining || 'Пожалуйста, проверьте комментарии педагогов ниже.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two-Stage Timeline (Requirement 3) */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
          Этапы выполнения заданий за день:
        </div>

        {/* Stage 1: Curator in Class (before 15:00) */}
        <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-purple-950">
              <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center text-[10px] font-black">
                1
              </span>
              <span>В ступени до 15:00 (Куратор)</span>
            </div>
            <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-semibold">
              {hw.stageClass?.updatedAt || '14:45'}
            </span>
          </div>
          <div className="text-slate-700 text-[11px] pl-6">
            <p className="font-medium text-slate-800">{hw.stageClass?.notes || 'Задания по плану выполнены.'}</p>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-purple-600" />
              Отметил: {hw.stageClass?.teacherName || 'Куратор ступени'}
            </div>
          </div>
        </div>

        {/* Stage 2: Duty Extended Teacher (after 15:00) */}
        <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-2xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-teal-950">
              <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center text-[10px] font-black">
                2
              </span>
              <span>На продленке после 15:00 (Дежурный педагог)</span>
            </div>
            <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full font-semibold">
              {hw.stageExtended?.updatedAt || '16:40'}
            </span>
          </div>
          <div className="text-slate-700 text-[11px] pl-6">
            <p className="font-medium text-slate-800">{hw.stageExtended?.notes || 'Все задания завершены под присмотром.'}</p>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-teal-600" />
              Проверил: {hw.stageExtended?.teacherName || 'Дежурный педагог продленки'}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Drawer */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-700" />
            <span>Расписание занятий ступени на неделю</span>
          </div>
          {showSchedule ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showSchedule && (
          <div className="p-3 pt-1 border-t border-slate-200 text-xs space-y-2">
            {/* Day Selector */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {weeklySchedule.map((d, idx) => (
                <button
                  key={d.dayName}
                  type="button"
                  onClick={() => setScheduleDayIdx(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                    scheduleDayIdx === idx
                      ? 'bg-[#241738] text-amber-200 shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {d.dayName}
                </button>
              ))}
            </div>

            {/* Lessons List */}
            <div className="space-y-1.5">
              {weeklySchedule[scheduleDayIdx]?.lessons.map((les, i) => (
                <div
                  key={i}
                  className="p-2 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-900 w-24 shrink-0 text-[10px]">
                      {les.time}
                    </span>
                    <span className="font-semibold text-slate-800">{les.subject}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{les.room}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
