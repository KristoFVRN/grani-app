import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, MessageSquare, User, X, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConsultationBookingModal: React.FC<Props> = ({ open, onClose }) => {
  const { specialists, currentStudent, addConsultationBooking } = useApp();
  const [selectedSpecId, setSelectedSpecId] = useState<string>(specialists[0]?.id || 'spec_1');
  const [preferredDate, setPreferredDate] = useState('2026-11-20');
  const [preferredTime, setPreferredTime] = useState('16:30');
  const [topicProblem, setTopicProblem] = useState('');
  const [parentPhone, setParentPhone] = useState(currentStudent?.parentPhone || '+7 (903) 858-12-34');
  const [parentName, setParentName] = useState(currentStudent?.parentName || 'Елена Грачева');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const currentSpec = specialists.find((s) => s.id === selectedSpecId) || specialists[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topicProblem.trim() || topicProblem.trim().length < 5) {
      setError('Пожалуйста, кратко опишите тематику вашей проблемы или вопрос.');
      return;
    }

    addConsultationBooking({
      specialistId: currentSpec.id,
      specialistTitle: currentSpec.title,
      specialistName: currentSpec.name,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      parentName,
      parentPhone,
      topicProblem: topicProblem.trim(),
      preferredDate,
      preferredTime,
      confirmedRoom: currentSpec.room
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-purple-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#241738] to-[#3a225c] px-5 py-4 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-purple-950 flex items-center justify-center font-bold text-xs shadow">
              Г
            </div>
            <h2 className="font-extrabold text-base text-amber-200">
              Запись на личный прием / консультацию
            </h2>
          </div>
          <p className="text-[11px] text-purple-200/90 mt-1">
            Индивидуальная встреча с преподавателем, узким специалистом или руководством
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3 flex flex-col items-center justify-center my-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <div className="font-extrabold text-lg text-slate-900">Заявка принята!</div>
            <p className="text-xs text-slate-500 max-w-xs">
              Специалист <strong>{currentSpec.name}</strong> ({currentSpec.title}) ознакомится с темой вопроса и мы подтвердим точное время приема.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Specialist Dropdown (All 13 from prompt) */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                1. Выберите специалиста для записи:
              </label>
              <select
                value={selectedSpecId}
                onChange={(e) => setSelectedSpecId(e.target.value)}
                className="w-full px-3 py-2.5 bg-purple-50/60 border border-purple-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition"
              >
                {specialists.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx + 1}. {s.title} — {s.name}
                  </option>
                ))}
              </select>

              {/* Specialist info badge */}
              <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-700" />
                  {currentSpec.room}
                </span>
                <span className="text-purple-700 font-medium">
                  {currentSpec.availableDays}
                </span>
              </div>
            </div>

            {/* Topic & Problem Description */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                2. Тематика проблемы / комментарий <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Кратко опишите причину обращения (например: трудности с чтением / темп усвоения математики / адаптация в ступени / поведение)..."
                value={topicProblem}
                onChange={(e) => setTopicProblem(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white transition resize-none text-slate-800"
              />
              <span className="text-[10px] text-slate-400">
                Это поможет специалисту заранее изучить динамику ребенка и подготовить рекомендации.
              </span>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-700" /> Желаемая дата
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-700" /> Удобное время
                </label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Parent Contact */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ФИО родителя</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Телефон для связи</label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Student info */}
            <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-2 text-[11px] text-amber-900">
              <User className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Запись для ребенка: <strong>{currentStudent.name}</strong> ({currentStudent.class})</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#241738] hover:bg-[#342250] text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Отправить заявку на консультацию
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
