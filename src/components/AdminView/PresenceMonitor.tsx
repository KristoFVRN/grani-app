import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PersonAvatar } from '../PersonAvatar';
import {
  Users,
  Shield,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Briefcase,
  Clock,
  Check
} from 'lucide-react';

export const PresenceMonitor: React.FC = () => {
  const { students, staffMembers, shifts, toggleStaffPresence, approveShift } = useApp();
  const [subView, setSubView] = useState<'students' | 'staff'>('students');

  const totalStudents = students.length;
  const onTimeStudents = students.filter((s) => s.status === 'present_ontime').length;
  const lateStudents = students.filter((s) => s.status === 'late').length;
  const presentStudents = onTimeStudents + lateStudents;
  const sickStudents = students.filter((s) => s.status === 'absent_sick').length;
  const absentStudents = students.filter((s) => s.status === 'absent_parent').length;

  const staffInside = staffMembers.filter((st) => st.status === 'inside');
  const pendingShifts = shifts.filter((sh) => sh.status === 'pending');

  return (
    <div className="space-y-4">
      {/* Top Banner Dashboard */}
      <div className="bg-gradient-to-r from-[#2a1347] via-[#4e1984] to-[#6a28b0] text-white p-4 rounded-2xl shadow-lg border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                Учет очного присутствия
              </div>
              <div className="font-extrabold text-base">Центр развития «Грани»</div>
            </div>
          </div>
          <span className="text-[11px] bg-white/15 text-purple-100 px-3 py-1 rounded-full font-semibold border border-white/20">
            По факту 1-го урока
          </span>
        </div>

        {/* Big numbers grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="bg-black/25 p-2.5 rounded-xl border border-white/10">
            <div className="text-xl font-black text-emerald-300">
              {presentStudents} / {totalStudents}
            </div>
            <div className="text-[11px] text-white/80 mt-0.5 font-medium">В центре ({lateStudents} опозд.)</div>
          </div>

          <div className="bg-black/25 p-2.5 rounded-xl border border-white/10">
            <div className="text-xl font-black text-amber-300">
              {staffInside.length} / {staffMembers.length}
            </div>
            <div className="text-[11px] text-white/80 mt-0.5 font-medium">Сотрудников внутри</div>
          </div>

          <div className="bg-black/25 p-2.5 rounded-xl border border-white/10">
            <div className="text-xl font-black text-cyan-300">{presentStudents}</div>
            <div className="text-[11px] text-white/80 mt-0.5 font-medium">Порций кухни</div>
          </div>

          <div className="bg-black/25 p-2.5 rounded-xl border border-white/10">
            <div className="text-xl font-black text-rose-300">{sickStudents + absentStudents}</div>
            <div className="text-[11px] text-white/80 mt-0.5 font-medium">Детей отсутствует</div>
          </div>
        </div>
      </div>

      {/* Real-time Kitchen alert */}
      <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-emerald-950">Сводка для шеф-повара столовой</div>
            <div className="text-[11px] text-emerald-800">
              Сегодня подается: Завтрак — <strong>{presentStudents}</strong> порц., Обед —{' '}
              <strong>{presentStudents}</strong> порц., Полдник — <strong>{presentStudents}</strong> порц.
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200 shrink-0">
          Согласовано
        </span>
      </div>

      {/* Pending Overtime Shifts from Teachers */}
      {pendingShifts.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Заявки педагогов в табель ({pendingShifts.length})</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {pendingShifts.map((sh) => (
              <div
                key={sh.id}
                className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-[#2d124d]">{sh.teacherName}</div>
                  <div className="text-[11px] text-amber-900">
                    {sh.date} • <strong>+{sh.overtimeHours} ч.</strong> ({sh.overtimeReason || sh.dutyType})
                  </div>
                </div>
                <button
                  onClick={() => approveShift(sh.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" /> Утвердить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Switcher: Дети vs Сотрудники */}
      <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-[#eceecc] text-xs">
        <button
          onClick={() => setSubView('students')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
            subView === 'students' ? 'bg-[#4e1984] text-white shadow-xs' : 'text-[#563b76] hover:bg-[#f7f8ea]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Дети ({presentStudents}/{totalStudents})</span>
        </button>
        <button
          onClick={() => setSubView('staff')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
            subView === 'staff' ? 'bg-[#4e1984] text-white shadow-xs' : 'text-[#563b76] hover:bg-[#f7f8ea]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Сотрудники ({staffInside.length}/{staffMembers.length})</span>
        </button>
      </div>

      {/* Detailed Student Presence List */}
      {subView === 'students' && (
        <div className="bg-white rounded-2xl p-4 border border-[#eceecc] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4e1984]" />
              <h3 className="font-bold text-xs text-[#2d124d]">Дети в здании (1 «А» класс)</h3>
            </div>
            <span className="text-[11px] text-[#8e859b]">В реальном времени</span>
          </div>

          <div className="divide-y divide-gray-100">
            {students.map((student) => (
              <div key={student.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar
                    src={student.avatar}
                    name={student.name}
                    className="w-8 h-8 rounded-full"
                    textClassName="text-[11px]"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[#2d124d] truncate">{student.name}</div>
                    <div className="text-[10px] text-[#6d647a]">
                      Забирает:{' '}
                      <strong>
                        {student.pickup.person === 'mom' && 'Мама'}
                        {student.pickup.person === 'dad' && 'Папа'}
                        {student.pickup.person === 'grandma' && 'Бабушка'}
                        {student.pickup.person === 'custom' &&
                          (student.pickup.customName || 'Доверенное лицо')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {student.status === 'present_ontime' ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Вовремя с {student.arrivalTime}
                    </span>
                  ) : student.status === 'late' ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" /> Опоздал к {student.arrivalTime}
                    </span>
                  ) : student.status === 'absent_sick' ? (
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-sky-500" /> Болеет
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 inline-flex items-center gap-1">
                      <UserX className="w-3 h-3 text-rose-500" /> Пропуск
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Staff Presence List */}
      {subView === 'staff' && (
        <div className="bg-white rounded-2xl p-4 border border-[#eceecc] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#4e1984]" />
              <h3 className="font-bold text-xs text-[#2d124d]">Сотрудники и педагоги на месте</h3>
            </div>
            <span className="text-[11px] text-[#8e859b]">Табель сотрудников</span>
          </div>

          <div className="divide-y divide-gray-100">
            {staffMembers.map((st) => (
              <div key={st.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar
                    src={st.avatar}
                    name={st.name}
                    className="w-9 h-9 rounded-full ring-1 ring-purple-100"
                    textClassName="text-xs"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[#2d124d] truncate">{st.name}</div>
                    <div className="text-[10px] text-[#6d647a] truncate">
                      {st.role} • {st.location}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleStaffPresence(st.id)}
                  title="Нажмите для отметки входа/выхода"
                  className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                    st.status === 'inside'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                      : 'text-gray-600 bg-gray-100 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {st.status === 'inside' ? `В здании с ${st.checkInTime}` : st.checkInTime}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
