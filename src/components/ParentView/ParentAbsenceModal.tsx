import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Clock,
  Thermometer,
  Home,
  Send
} from 'lucide-react';

interface ParentAbsenceModalProps {
  open: boolean;
  onClose: () => void;
}

export const ParentAbsenceModal: React.FC<ParentAbsenceModalProps> = ({ open, onClose }) => {
  const { currentStudent, reportParentAbsence } = useApp();
  const [absenceType, setAbsenceType] = useState<'sick' | 'family' | 'late'>('late');
  const [expectedTime, setExpectedTime] = useState('10:00');
  const [reason, setReason] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportParentAbsence(
      currentStudent.id,
      absenceType,
      absenceType === 'late' ? expectedTime : undefined,
      reason
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              До 08:30 утра
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-1">
              Предупредить школу об отсутствии / опоздании
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
          Уведомление мгновенно поступит <strong>куратору ступени ({currentStudent.curatorName})</strong> и на <strong>пищеблок школы</strong> для корректировки порций питания.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Reason Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Причина или характер изменения:
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setAbsenceType('sick')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition ${
                  absenceType === 'sick'
                    ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    Не придем сегодня (болеем)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Лечимся дома, порция питания на сегодня отменяется
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAbsenceType('family')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition ${
                  absenceType === 'family'
                    ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    Не придем (семейные обстоятельства)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Пропуск по согласованию с родителями
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAbsenceType('late')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition ${
                  absenceType === 'late'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    Опоздаем к определенному времени
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Придем позже (врач, пробки и т.д.), питание сохраняется
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Time Picker if Late */}
          {absenceType === 'late' && (
            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80 space-y-1.5 animate-in fade-in duration-150">
              <label className="text-[11px] font-bold text-amber-900 block">
                Ориентировочное время прибытия в школу:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['09:15', '09:45', '10:00', '10:30'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setExpectedTime(time)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition ${
                      expectedTime === time
                        ? 'bg-amber-500 text-purple-950 shadow-xs'
                        : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Comment */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">
              Краткий комментарий для куратора (необязательно):
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                absenceType === 'late'
                  ? 'Например: задерживаемся у стоматолога, приедем к началу 2-го урока'
                  : 'Например: температура с утра, вызвали педиатра'
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Передать в школу</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
