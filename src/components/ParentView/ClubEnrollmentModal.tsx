import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Clock,
  Calendar,
  Check,
  User,
  GraduationCap,
  Heart,
  CheckCircle2
} from 'lucide-react';
import type { ClubSubscription, ClubEnrollmentType } from '../../types';

interface ClubEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ClubEnrollmentType;
}

export const ClubEnrollmentModal: React.FC<ClubEnrollmentModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'trial'
}) => {
  const {
    subscriptions,
    currentStudent,
    enrollStudentInClub,
    convertTrialToRegular,
    declineClubAfterTrial
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [enrollingClub, setEnrollingClub] = useState<ClubSubscription | null>(null);
  const [enrollmentType, setEnrollmentType] = useState<ClubEnrollmentType>(defaultType);
  const [parentNote, setParentNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Все направления' },
    { id: 'dance', label: '💃 Танцы и спорт' },
    { id: 'it', label: '🤖 Робототехника и IT' },
    { id: 'chess', label: '♟️ Шахматы' },
    { id: 'art', label: '🎨 Творчество' },
    { id: 'math', label: '🧠 Интеллект' },
    { id: 'languages', label: '🇬🇧 Языки' },
    { id: 'theater', label: '🎭 Театр' },
  ];

  const filteredClubs = subscriptions.filter((club) => {
    if (selectedCategory === 'all') return true;
    return club.category === selectedCategory;
  });

  const handleStartEnroll = (club: ClubSubscription, type: ClubEnrollmentType) => {
    setEnrollingClub(club);
    setEnrollmentType(type);
    setParentNote('');
    setIsSuccess(false);
  };

  const handleConfirmEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingClub) return;

    enrollStudentInClub(enrollingClub.id, currentStudent.id, enrollmentType, parentNote);
    setIsSuccess(true);
    setTimeout(() => {
      setEnrollingClub(null);
      setIsSuccess(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#241738] via-[#351a54] to-[#402368] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-purple-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Запись на кружки и секции</h2>
              <p className="text-[11px] text-amber-200/90 font-medium">Пробные занятия со скидкой 50% и постоянные курсы</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="p-2.5 bg-purple-50/60 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-[#241738] text-amber-300 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Ребенок */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-amber-50/60 border border-purple-200/70 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-200 text-purple-900 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ученик центра:</span>
                <div className="font-extrabold text-slate-900">{currentStudent.name}</div>
              </div>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-200/80 text-purple-950 border border-amber-300">
              {currentStudent.class}
            </span>
          </div>

          {/* Информационная плашка про пробные занятия */}
          <div className="p-3 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-300/80 rounded-2xl text-[11px] text-amber-950 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Пробные занятия со скидкой 50% для учеников «ГРАНИ»</span>
            </div>
            <p className="leading-relaxed text-slate-700">
              Вы можете записать ребенка на <strong>одно пробное занятие со скидкой 50%</strong>. Если ребенку не понравится — вы не продолжаете курс и ни за что не переплачиваете. А если понравится — подтвердите продолжение в 1 клик!
            </p>
          </div>

          {/* Форма подтверждения записи (если выбран кружок) */}
          {enrollingClub && (
            <form
              onSubmit={handleConfirmEnroll}
              className="p-4 rounded-3xl bg-white border-2 border-amber-400 shadow-lg space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                  Оформление записи
                </span>
                <button
                  type="button"
                  onClick={() => setEnrollingClub(null)}
                  className="text-xs text-slate-400 hover:text-slate-800 font-bold"
                >
                  ✕ Закрыть
                </button>
              </div>

              <div>
                <h3 className="font-black text-sm text-[#241738]">{enrollingClub.title}</h3>
                <div className="text-xs text-purple-900 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>🕒 {enrollingClub.scheduleDays}: <strong>{enrollingClub.startTime} – {enrollingClub.endTime}</strong></span>
                  <span>📍 {enrollingClub.room || 'Учебный класс'}</span>
                  <span>👤 Педагог: <strong>{enrollingClub.curatorName}</strong></span>
                </div>
              </div>

              {/* Переключатель формата: Пробное или Курс */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Выберите формат записи:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setEnrollmentType('trial')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex flex-col items-center justify-center gap-0.5 ${
                      enrollmentType === 'trial'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 shadow-sm ring-2 ring-amber-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Пробное занятие
                    </span>
                    <span className="text-[10px] font-extrabold text-purple-950/80">
                      Скидка 50%
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEnrollmentType('regular')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex flex-col items-center justify-center gap-0.5 ${
                      enrollmentType === 'regular'
                        ? 'bg-[#241738] text-amber-300 shadow-sm ring-2 ring-purple-400'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Постоянный курс
                    </span>
                    <span className="text-[10px] font-bold text-purple-200">
                      Регулярные занятия
                    </span>
                  </button>
                </div>
              </div>

              {/* Карточка с условиями выбранного формата */}
              {enrollmentType === 'trial' ? (
                <div className="p-3 bg-amber-50/90 border border-amber-300/80 rounded-2xl text-xs text-amber-950 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-extrabold text-amber-900">Стоимость пробного занятия:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="line-through text-slate-400 text-xs">
                        {enrollingClub.pricePerLesson || Math.round(enrollingClub.pricePerMonth / 8)} ₽
                      </span>
                      <span className="font-black text-base text-purple-950">
                        {enrollingClub.trialPrice || Math.round((enrollingClub.pricePerLesson || Math.round(enrollingClub.pricePerMonth / 8)) * 0.5)} ₽
                      </span>
                      <span className="text-[10px] font-extrabold bg-amber-300 px-1.5 py-0.5 rounded text-purple-950">
                        -50%
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    ✨ Разовое ознакомительное занятие. Преподаватель продленки проводит ребенка в кабинет ровно к <strong>{enrollingClub.startTime}</strong> и проследит за адаптацией. После занятия вы сможете легко решить, продолжать ли курс.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl text-xs text-purple-950 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-extrabold text-[#241738]">Стоимость курса:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-base text-[#241738]">
                        {enrollingClub.pricePerMonth} ₽
                      </span>
                      <span className="text-[11px] text-slate-500">/ месяц</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    📚 Ребенок будет зачислен в регулярную группу. Оплата рассчитывается строго по факту посещений в конце месяца (~{enrollingClub.pricePerLesson || Math.round(enrollingClub.pricePerMonth / 8)} ₽ за занятие).
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Пожелание или комментарий для куратора продленки (необязательно):
                </label>
                <input
                  type="text"
                  value={parentNote}
                  onChange={(e) => setParentNote(e.target.value)}
                  placeholder="Например: Чешки и форма в шкафчике, напомнить переодеться"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEnrollingClub(null)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60"
                >
                  Назад
                </button>

                <button
                  type="submit"
                  disabled={isSuccess}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95 ${
                    isSuccess
                      ? 'bg-emerald-600 text-white'
                      : enrollmentType === 'trial'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950'
                      : 'bg-[#241738] hover:bg-[#382255] text-amber-300'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Успешно записан!</span>
                    </>
                  ) : enrollmentType === 'trial' ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Записаться на пробное (
                        {enrollingClub.trialPrice || Math.round((enrollingClub.pricePerLesson || Math.round(enrollingClub.pricePerMonth / 8)) * 0.5)} ₽
                        )
                      </span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Подтвердить запись на курс</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Список доступных кружков */}
          <div className="space-y-3">
            {filteredClubs.map((club) => {
              const enrolledItem = (club.enrolledStudents || []).find(
                (e) => e.studentId === currentStudent.id
              );
              const isEnrolled = !!enrolledItem;
              const isTrial = enrolledItem?.enrollmentType === 'trial';

              const lessonPrice = club.pricePerLesson || Math.round(club.pricePerMonth / (club.totalLessons || 8));
              const trialPrice = club.trialPrice || Math.round(lessonPrice * 0.5);

              return (
                <div
                  key={club.id}
                  className={`p-3.5 rounded-3xl border transition shadow-2xs ${
                    isEnrolled
                      ? isTrial
                        ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
                        : 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {/* Заголовок кружка и бейджи статуса */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-xs text-slate-900 leading-snug">
                          {club.title}
                        </span>
                        {isEnrolled && (
                          isTrial ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 font-black text-[10px] shrink-0 flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3 text-purple-950" />
                              Пробное со скидкой 50%
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Постоянный курс
                            </span>
                          )
                        )}
                      </div>

                      {club.description && (
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {club.description}
                        </p>
                      )}

                      <div className="mt-2 text-[11px] space-y-0.5 text-slate-600">
                        <div>
                          Педагог: <strong>{club.curatorName}</strong>
                        </div>
                        <div className="text-purple-900 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-700" />
                          <span>{club.scheduleDays}: <strong>{club.startTime} – {club.endTime}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>Забирать родителей ровно в <strong>{club.pickupStrictTime}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-sm text-[#241738]">
                        {club.pricePerMonth} ₽
                      </div>
                      <div className="text-[10px] text-slate-400">в месяц</div>
                      <div className="text-[10px] text-purple-700 font-bold mt-0.5">
                        ~{lessonPrice} ₽ / занятие
                      </div>
                    </div>
                  </div>

                  {/* Блок действий если ребенок уже записан */}
                  {isEnrolled ? (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70">
                      {isTrial ? (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                              <span>🎯</span> Записан на пробное занятие ({enrolledItem.trialPrice || trialPrice} ₽)
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-300 text-purple-950">
                              Скидка 50%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            После посещения пробного занятия вы можете перевести ребенка на постоянный курс или отказаться без обязательств:
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => convertTrialToRegular(club.id, currentStudent.id)}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-2xs transition"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>Ребенку понравилось • На курс</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => declineClubAfterTrial(club.id, currentStudent.id)}
                              className="py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs flex items-center justify-center gap-1 transition"
                            >
                              <span>✕ Не продолжать (после пробного)</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-950">
                          <span className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Зачислен на постоянный курс
                          </span>
                          <span className="text-[10px] text-emerald-800 font-semibold">
                            Оплата по факту посещений
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ДВЕ РАЗГРАНИЧЕННЫЕ КНОПКИ ДЛЯ ЗАПИСИ */
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                      {/* Кнопка 1: Пробное занятие со скидкой 50% */}
                      <button
                        type="button"
                        onClick={() => handleStartEnroll(club, 'trial')}
                        className="flex-1 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 border border-amber-300"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-950" />
                        <span>Пробное занятие • 50%</span>
                        <span className="bg-purple-950 text-amber-300 px-2 py-0.5 rounded-lg text-[10px] font-black ml-1">
                          {trialPrice} ₽
                        </span>
                      </button>

                      {/* Кнопка 2: Записаться на курс */}
                      <button
                        type="button"
                        onClick={() => handleStartEnroll(club, 'regular')}
                        className="flex-1 px-3 py-2 rounded-2xl bg-[#241738] hover:bg-[#392058] text-white font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Записаться на курс</span>
                        <span className="text-purple-300 text-[10px] font-normal ml-0.5">
                          ({club.pricePerMonth} ₽/мес)
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
