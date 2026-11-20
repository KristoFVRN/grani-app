import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, PlusCircle, ShieldCheck } from 'lucide-react';

export const TeacherShifts: React.FC = () => {
  const { shifts, addOvertimeShift } = useApp();
  const [showOvertimeForm, setShowOvertimeForm] = useState(false);
  const [hours, setHours] = useState(2);
  const [reason, setReason] = useState('');

  const totalOvertimeHours = shifts
    .filter((s) => s.isOvertime)
    .reduce((acc, cur) => acc + (cur.overtimeHours || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    addOvertimeShift(hours, reason);
    setReason('');
    setShowOvertimeForm(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#2d124d] to-[#4e1984] text-white p-4 rounded-2xl shadow-md border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                Табель педагога • Ноябрь 2026
              </div>
              <div className="font-extrabold text-base">Смены и дежурства</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2.5 py-1 rounded-full font-bold border border-emerald-400/30">
              +{totalOvertimeHours} ч. сверхурочно
            </span>
          </div>
        </div>
        <p className="text-xs text-purple-200/90 mt-2">
          Все часы и дежурства регистрируются в системе, исключая кулуарные споры по оплате труда и надбавкам.
        </p>
      </div>

      {/* Button to log Overtime */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-xs text-[#2d124d]">График смен и табель</h3>
        <button
          onClick={() => setShowOvertimeForm(!showOvertimeForm)}
          className="text-xs font-bold text-[#4e1984] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Зафиксировать переработку</span>
        </button>
      </div>

      {/* Overtime Form */}
      {showOvertimeForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-2xl border-2 border-[#4e1984] shadow-md space-y-3 text-xs"
        >
          <div className="font-bold text-sm text-[#4e1984] flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Внесение переработки / замещения в табель:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#6d647a] block mb-1">Количество часов:</label>
              <select
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-xl bg-white font-bold"
              >
                <option value={1}>1 час</option>
                <option value={2}>2 часа</option>
                <option value={3}>3 часа</option>
                <option value={4}>4 часа</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#6d647a] block mb-1">Дата:</label>
              <input
                type="text"
                disabled
                value={`Сегодня (${new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })})`}
                className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#6d647a] block mb-1">
              Основание (замещение, дежурство, продленная смена):
            </label>
            <input
              type="text"
              required
              placeholder="Например: Замещение воспитателя продленки 2 класса"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#4e1984]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-[#4e1984] hover:bg-[#3b1266] text-white py-2 rounded-xl font-bold transition"
            >
              Отправить в табель директора
            </button>
            <button
              type="button"
              onClick={() => setShowOvertimeForm(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Shifts List */}
      <div className="space-y-2">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className={`p-3 rounded-2xl border transition ${
              shift.isOvertime
                ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                : 'bg-white border-[#eceecc]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-[#4e1984] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {shift.date}
                  </span>
                  <span className="text-[10px] text-[#8e859b] font-medium">{shift.timeRange}</span>
                </div>
                <div className="font-bold text-xs text-[#2d124d] mt-1">{shift.dutyType}</div>
                {shift.overtimeReason && (
                  <div className="text-[11px] text-amber-800 bg-amber-100/60 p-1.5 rounded-lg mt-1 border border-amber-200/50">
                    Причина: {shift.overtimeReason}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                {shift.isOvertime && (
                  <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded-full block mb-1">
                    +{shift.overtimeHours} ч.
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    shift.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {shift.status === 'confirmed' ? 'Утверждено' : 'На проверке'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
