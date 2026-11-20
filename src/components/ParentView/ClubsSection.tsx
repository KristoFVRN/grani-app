import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  GraduationCap,
  Heart
} from 'lucide-react';
import { ClubEnrollmentModal } from './ClubEnrollmentModal';
import type { ClubEnrollmentType } from '../../types';

export const ClubsSection: React.FC = () => {
  const { subscriptions, currentStudent, convertTrialToRegular, declineClubAfterTrial } = useApp();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<ClubEnrollmentType>('trial');

  // Фильтруем кружки ребенка
  const studentClubs = subscriptions.filter((c) =>
    (c.enrolledStudents || []).some((e) => e.studentId === currentStudent.id) ||
    c.studentId === currentStudent.id
  );

  const openEnrollModal = (type: ClubEnrollmentType) => {
    setModalDefaultType(type);
    setIsEnrollModalOpen(true);
  };

  return (
    <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-100 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-[#241738]">
              Кружки и студии развития
            </h2>
            <p className="text-[11px] text-slate-500">
              Пробные занятия со скидкой 50% и постоянные курсы
            </p>
          </div>
        </div>

        {/* Две разграниченные кнопки записи в шапке */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => openEnrollModal('trial')}
            className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Пробное занятие • 50%</span>
          </button>

          <button
            type="button"
            onClick={() => openEnrollModal('regular')}
            className="px-3 py-1.5 rounded-2xl bg-[#241738] hover:bg-[#382156] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Записаться на курс</span>
          </button>
        </div>
      </div>

      {/* Banner CTA for enrolling */}
      <div className="p-3.5 bg-gradient-to-r from-[#241738] via-[#3a1d5a] to-[#4e1984] rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
            Дополнительное образование школы «ГРАНИ»
          </div>
          <div className="font-black text-xs text-white mt-0.5">
            Хотите попробовать танцы, робототехнику или шахматы?
          </div>
          <div className="text-[10px] text-purple-200 mt-0.5">
            Приходите на <strong>пробное занятие со скидкой 50%</strong>. Если ребенку не понравится — можно отказаться без каких-либо обязательств!
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => openEnrollModal('trial')}
            className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-sm transition active:scale-95 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-purple-950" />
            <span>На пробное (-50%)</span>
          </button>
          <button
            type="button"
            onClick={() => openEnrollModal('regular')}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition active:scale-95"
          >
            На курс
          </button>
        </div>
      </div>

      {/* Notice about Pickup Time */}
      <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100/80 text-xs text-purple-950 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Памятка для родителей:</strong> педагоги продленки сами своевременно сопровождают детей в кабинеты кружков. Пожалуйста, забирайте детей <strong>ровно по окончании занятия</strong>, чтобы не отвлекать учебный процесс.
        </p>
      </div>

      {/* Clubs List */}
      <div className="space-y-3">
        {(studentClubs.length > 0 ? studentClubs : subscriptions).map((club) => {
          const isCancelled = club.todayStatus === 'cancelled';
          const isRescheduled = club.todayStatus === 'rescheduled';

          const studentEnrollment = (club.enrolledStudents || []).find(
            (e) => e.studentId === currentStudent.id
          );
          const isEnrolled = !!studentEnrollment;
          const isTrial = studentEnrollment?.enrollmentType === 'trial';

          const lessonPrice = club.pricePerLesson || Math.round(club.pricePerMonth / (club.totalLessons || 8));
          const trialPrice = club.trialPrice || Math.round(lessonPrice * 0.5);

          return (
            <div
              key={club.id}
              className={`rounded-3xl p-3.5 border transition ${
                isCancelled
                  ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-200'
                  : isEnrolled && isTrial
                  ? 'bg-amber-50/40 border-amber-300 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200/80 hover:border-purple-300'
              }`}
            >
              {/* Title & Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-black text-xs text-slate-900 leading-snug">
                      {club.title}
                    </h3>
                    {isEnrolled && (
                      isTrial ? (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black text-[10px] flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-3 h-3 text-purple-950" />
                          Пробное занятие • Скидка 50%
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Постоянный курс
                        </span>
                      )
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Педагог: <strong>{club.curatorName}</strong> • {club.room || 'Учебный класс'}
                  </div>
                </div>

                {isCancelled ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center gap-1 shrink-0 animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    ОТМЕНЕНО СЕГОДНЯ
                  </span>
                ) : isRescheduled ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-extrabold text-[10px] flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    Перенос времени
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    По расписанию
                  </span>
                )}
              </div>

              {/* Cancellation Reason Box */}
              {isCancelled && club.cancelReason && (
                <div className="mb-2.5 p-2.5 bg-rose-100/90 border border-rose-200 rounded-xl text-[11px] text-rose-950 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Причина отмены: </span>
                    <span>{club.cancelReason}</span>
                  </div>
                </div>
              )}

              {/* Time & Strict Pickup Info */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Дни и время</div>
                    <div className="font-bold text-[11px] text-slate-900">
                      {club.scheduleDays}: {club.startTime} – {club.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-700 bg-amber-50/70 p-1.5 rounded-lg border border-amber-200/60">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <div>
                    <div className="text-[9px] text-amber-800 font-bold uppercase">Забирать строго</div>
                    <div className="font-black text-[11px] text-amber-950">
                      в {club.pickupStrictTime} (не раньше)
                    </div>
                  </div>
                </div>
              </div>

              {/* Информация об оплате по факту посещения (ТЗ 1.2) */}
              {isEnrolled && !isTrial && (
                <div className="mt-2.5 p-2.5 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-[11px]">
                  <span className="text-purple-950">
                    Посещено в этом месяце: <strong className="text-purple-900 font-extrabold">{studentEnrollment.attendedCount || 0} занятий</strong>
                  </span>
                  <span className="font-black text-[#241738] bg-white px-2 py-0.5 rounded-lg border border-purple-200">
                    к начислению: {((studentEnrollment.attendedCount || 0) * lessonPrice).toLocaleString('ru-RU')} ₽ (по факту)
                  </span>
                </div>
              )}

              {/* Блок решения после пробного занятия (Запрос пользователя) */}
              {isEnrolled && isTrial && (
                <div className="mt-2.5 p-3 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                      <span>🎯</span> Пробное занятие со скидкой 50% ({studentEnrollment.trialPrice || trialPrice} ₽)
                    </span>
                    <span className="text-[10px] font-black bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full">
                      Вводное
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-snug">
                    Понравилось ли ребенку пробное занятие? Вы можете подтвердить переход на постоянный курс или отказаться без каких-либо обязательств:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => convertTrialToRegular(club.id, currentStudent.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>❤️ Ребенку понравилось • На курс</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => declineClubAfterTrial(club.id, currentStudent.id)}
                      className="py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95"
                    >
                      <span>✕ Не подошло (не будем ходить)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Кнопки быстрой записи если не записан */}
              {!isEnrolled && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Скидка 50% на первое занятие:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEnrollModal('trial')}
                      className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-purple-950 font-black text-[11px] shadow-2xs transition active:scale-95"
                    >
                      Пробное {trialPrice} ₽
                    </button>
                    <button
                      type="button"
                      onClick={() => openEnrollModal('regular')}
                      className="px-2.5 py-1 rounded-xl bg-[#241738] hover:bg-[#382156] text-white font-bold text-[11px] shadow-2xs transition active:scale-95"
                    >
                      На курс
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Enroll in Clubs */}
      <ClubEnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        defaultType={modalDefaultType}
      />
    </section>
  );
};
