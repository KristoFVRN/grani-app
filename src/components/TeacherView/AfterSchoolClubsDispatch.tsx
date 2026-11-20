import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send
} from 'lucide-react';

export const AfterSchoolClubsDispatch: React.FC = () => {
  const { subscriptions, updateStudentClubDispatch, sendAllStudentsToClub, currentUser } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('all'); // 'all' or day name

  const daysList = [
    { id: 'all', label: '📅 Сегодня (Все кружки)' },
    { id: 'Понедельник', label: 'Понедельник' },
    { id: 'Вторник', label: 'Вторник' },
    { id: 'Среда', label: 'Среда' },
    { id: 'Четверг', label: 'Четверг' },
    { id: 'Пятница', label: 'Пятница' },
  ];

  // Фильтрация кружков по дням
  const displayedClubs = subscriptions.filter((club) => {
    if (selectedDay === 'all') return true;
    return club.scheduleDays.toLowerCase().includes(selectedDay.toLowerCase());
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Подсчет статистики на продленке
  let totalEnrolledKids = 0;
  let sentKidsCount = 0;
  let waitingKidsCount = 0;

  displayedClubs.forEach((club) => {
    const list = club.enrolledStudents || [];
    totalEnrolledKids += list.length;
    list.forEach((e) => {
      if (e.sentStatus === 'sent') sentKidsCount++;
      else if (club.todayStatus !== 'cancelled') waitingKidsCount++;
    });
  });

  return (
    <div className="space-y-3.5 text-xs">
      {/* Шапка диспетчера продленки */}
      <div className="bg-gradient-to-r from-[#241738] via-[#3a1d5a] to-[#4e1984] text-white p-4 rounded-3xl shadow-md border border-amber-400/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold shadow-md">
              <Clock className="w-5 h-5 text-purple-950" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                Продленка центра «Грани»
              </div>
              <div className="font-black text-base leading-snug">
                Маршрутный лист: Кто и во сколько идет на кружки
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-purple-200 mt-2 leading-relaxed">
          Напоминание для педагога продленки: пожалуйста, отмечайте отправку каждого ребенка. Так родители видят, что ребенок вовремя прибыл на кружок и не остался забыт в классе!
        </p>

        {/* Быстрая сводка-счетчик */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-300/20 text-center">
          <div className="bg-white/10 rounded-2xl p-2">
            <div className="text-[10px] text-purple-200 font-bold uppercase">Всего детей</div>
            <div className="text-base font-black text-amber-300">{totalEnrolledKids}</div>
          </div>
          <div className="bg-emerald-500/20 rounded-2xl p-2 border border-emerald-400/30">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">Отправлено</div>
            <div className="text-base font-black text-emerald-300">{sentKidsCount}</div>
          </div>
          <div className="bg-amber-500/20 rounded-2xl p-2 border border-amber-400/30">
            <div className="text-[10px] text-amber-200 font-bold uppercase">Ожидают в классе</div>
            <div className="text-base font-black text-amber-300">{waitingKidsCount}</div>
          </div>
        </div>
      </div>

      {/* Фильтр по дням недели */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {daysList.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDay(d.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs flex items-center gap-1 ${
              selectedDay === d.id
                ? 'bg-[#241738] text-amber-300 shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Список кружков по времени */}
      {displayedClubs.length === 0 ? (
        <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-xs">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="font-bold text-slate-700">На этот день кружков нет</div>
          <div className="text-slate-400 text-[11px] mt-0.5">Все дети остаются на продленке до прихода родителей</div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedClubs.map((club) => {
            const isCancelled = club.todayStatus === 'cancelled';
            const students = club.enrolledStudents || [];
            const waitingCount = students.filter((s) => s.sentStatus !== 'sent').length;

            return (
              <div
                key={club.id}
                className={`rounded-3xl border transition shadow-xs overflow-hidden ${
                  isCancelled
                    ? 'bg-rose-50/60 border-rose-300 ring-1 ring-rose-200'
                    : 'bg-white border-purple-100'
                }`}
              >
                {/* Шапка карточки кружка со временем и локацией */}
                <div className={`p-3.5 border-b ${
                  isCancelled ? 'bg-rose-100/60 border-rose-200' : 'bg-gradient-to-r from-purple-50/80 to-amber-50/50 border-purple-100/60'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#241738] text-amber-300 font-black text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {club.startTime} – {club.endTime}
                        </span>
                        <span className="text-[10px] text-purple-900 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                          {club.scheduleDays}
                        </span>
                      </div>

                      <h3 className="font-black text-sm text-[#241738] mt-1.5 leading-snug">
                        {club.title}
                      </h3>
                      <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>Кабинет / зал: <strong>{club.room || 'Учебный класс'}</strong></span>
                        <span>•</span>
                        <span>Преподаватель: <strong>{club.curatorName}</strong></span>
                      </div>
                    </div>

                    {isCancelled ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] shrink-0">
                        ОТМЕНЕН
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0">
                        {students.length} детей
                      </span>
                    )}
                  </div>

                  {/* Оповещение об отмене занятия */}
                  {isCancelled && (
                    <div className="mt-2.5 p-2 bg-rose-100 text-rose-900 rounded-xl text-[11px] flex items-start gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{club.cancelReason || 'Занятие отменено. Никого не отправлять, дети остаются в группе продленки!'}</span>
                    </div>
                  )}

                  {/* Кнопка отправки всех детей разом */}
                  {!isCancelled && waitingCount > 1 && (
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => sendAllStudentsToClub(club.id, currentUser?.name)}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Отправить всех на кружок ({waitingCount} детей)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Список детей, идущих на этот кружок */}
                <div className="p-3.5 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Список детей на это время:</span>
                    <span>Забирать родителей: в <strong>{club.pickupStrictTime}</strong></span>
                  </div>

                  {students.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs">
                      На этот кружок пока никто не записан
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {students.map((student, idx) => {
                        const isSent = student.sentStatus === 'sent';

                        return (
                          <div
                            key={student.studentId || idx}
                            className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-2.5 ${
                              isSent
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : isCancelled
                                ? 'bg-slate-100/60 border-slate-200 text-slate-400'
                                : 'bg-white border-slate-200 hover:border-amber-400/60 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-[#241738] font-black text-xs flex items-center justify-center shrink-0 border border-purple-200">
                                {idx + 1}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-extrabold text-xs text-slate-900 truncate">
                                    {student.studentName}
                                  </span>
                                  {student.enrollmentType === 'trial' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black text-[10px] shadow-2xs flex items-center gap-1">
                                      <span>🎯</span> Пробное (-50%)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px]">
                                      📚 Курс
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {student.stageName}
                                  {student.parentNote && (
                                    <span className="text-amber-800 font-medium ml-1">
                                      • Прим: «{student.parentNote}»
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Статус и действие */}
                            <div className="shrink-0">
                              {isCancelled ? (
                                <span className="px-2.5 py-1 rounded-xl bg-slate-200 text-slate-600 font-bold text-[10px]">
                                  На продленке
                                </span>
                              ) : isSent ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="text-right">
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Отправлен в {student.sentAtTime || '17:00'}
                                    </span>
                                    {student.sentByTeacher && (
                                      <div className="text-[9px] text-slate-400 mt-0.5">
                                        {student.sentByTeacher}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => updateStudentClubDispatch(club.id, student.studentId, 'waiting')}
                                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 text-[10px]"
                                    title="Сбросить статус"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateStudentClubDispatch(club.id, student.studentId, 'sent', currentUser?.name)}
                                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs flex items-center gap-1 shadow-xs transition active:scale-95"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                  <span>Отправить на кружок</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
