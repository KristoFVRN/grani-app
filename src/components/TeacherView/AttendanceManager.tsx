import React, { useState, useRef } from 'react';
import { useApp, pluralizePortions } from '../../context/AppContext';
import type { Student } from '../../types';
import { PersonAvatar } from '../PersonAvatar';
import { uploadAvatarImage } from '../../utils/imageUpload';
import {
  Check,
  Clock,
  Thermometer,
  UserX,
  Utensils,
  Users,
  X,
  Camera,
  Loader2
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { students, stages, updateAttendance, updateStudentAvatar, addNotification } = useApp();
  const [selectedStageId, setSelectedStageId] = useState<string>('stage_1');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetStudentId, setUploadTargetStudentId] = useState<string | null>(null);
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const studentId = uploadTargetStudentId;
    if (!file || !studentId) return;
    setUploadingStudentId(studentId);
    try {
      const { url } = await uploadAvatarImage(file);
      updateStudentAvatar(studentId, url);
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Не удалось загрузить фотографию');
    } finally {
      setUploadingStudentId(null);
      setUploadTargetStudentId(null);
      e.target.value = '';
    }
  };

  const [lateModalStudent, setLateModalStudent] = useState<Student | null>(null);
  const [lateTime, setLateTime] = useState('10:30');
  const [missedSubject, setMissedSubject] = useState('Русский язык (1-й урок)');
  const [curatorComment, setCuratorComment] = useState('Привезли позже к 3-му уроку');

  const stageStudents = students.filter((s) => s.stageId === selectedStageId);
  const presentCount = stageStudents.filter((s) => s.status === 'present_ontime').length;
  const lateCount = stageStudents.filter((s) => s.status === 'late').length;
  const totalInSchool = presentCount + lateCount;
  const sickCount = stageStudents.filter((s) => s.status === 'absent_sick').length;
  const parentMissedCount = stageStudents.filter((s) => s.status === 'absent_parent').length;

  const handleMarkAllPresent = () => {
    stageStudents.forEach((s) => {
      if (s.status !== 'present_ontime') {
        updateAttendance(s.id, 'present_ontime', '08:30');
      }
    });
    addNotification(`Все дети выбранной ступени отмечены: «Вовремя к 1-му уроку (08:30)»`);
  };

  const handleConfirmLate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lateModalStudent) return;
    updateAttendance(
      lateModalStudent.id,
      'late',
      lateTime,
      missedSubject,
      curatorComment
    );
    setLateModalStudent(null);
  };

  return (
    <div className="space-y-3.5">
      {/* Stage Selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {(stages && stages.length > 0
          ? stages.filter((st) => ['stage_1', 'stage_2', 'stage_3'].includes(st.id))
          : [
              { id: 'stage_1', name: 'Ступень 1 «Первооткрыватели»' },
              { id: 'stage_2', name: 'Ступень 2 «Исследователи»' }
            ]
        ).map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setSelectedStageId(st.id)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              selectedStageId === st.id
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.name}
          </button>
        ))}
      </div>

      {/* Kitchen Sync Banner */}
      <div className="bg-gradient-to-r from-[#241738] via-[#381e59] to-[#1e1330] text-white p-4 rounded-3xl shadow-md border border-purple-300/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Utensils className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                Сводка для пищеблока (кухни)
              </div>
              <div className="font-black text-xl text-white">
                {pluralizePortions(totalInSchool)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] bg-emerald-500/30 text-emerald-200 px-2.5 py-1 rounded-full font-bold border border-emerald-400/30">
              По факту присутствия
            </span>
            <div className="text-[10px] text-white/70 mt-1">Очный учет на 1-м уроке</div>
          </div>
        </div>

        {/* Mini stats counters */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/15 text-center text-xs">
          <div className="bg-black/20 p-1.5 rounded-xl">
            <div className="text-emerald-300 font-black text-sm">{presentCount}</div>
            <div className="text-[9px] text-white/80">Вовремя</div>
          </div>
          <div className="bg-black/20 p-1.5 rounded-xl">
            <div className="text-amber-300 font-black text-sm">{lateCount}</div>
            <div className="text-[9px] text-white/80">Опоздали</div>
          </div>
          <div className="bg-black/20 p-1.5 rounded-xl">
            <div className="text-sky-300 font-black text-sm">{sickCount}</div>
            <div className="text-[9px] text-white/80">Болеют</div>
          </div>
          <div className="bg-black/20 p-1.5 rounded-xl">
            <div className="text-rose-300 font-black text-sm">{parentMissedCount}</div>
            <div className="text-[9px] text-white/80">Пропуск</div>
          </div>
        </div>
      </div>

      {/* Header with Quick Action */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-700" />
          <h3 className="font-bold text-xs text-slate-900">
            Список ступени познания 1 «Первооткрыватели» ({students.length} чел.)
          </h3>
        </div>
        <button
          type="button"
          onClick={handleMarkAllPresent}
          className="text-[11px] text-emerald-700 font-bold hover:underline bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 active:scale-95 transition"
        >
          Все вовремя ✓
        </button>
      </div>

      {/* Students Attendance List */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileChange}
        className="hidden"
      />
      <div className="space-y-2.5">
        {stageStudents.map((student) => {
          const isPresent = student.status === 'present_ontime';
          const isLate = student.status === 'late';
          const isSick = student.status === 'absent_sick';
          const isParentMissed = student.status === 'absent_parent';

          return (
            <div
              key={student.id}
              className={`p-3 rounded-2xl border transition ${
                isLate
                  ? 'bg-amber-50/70 border-amber-300'
                  : isPresent
                  ? 'bg-white border-slate-200/80 shadow-2xs'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    disabled={uploadingStudentId === student.id}
                    onClick={() => {
                      setUploadTargetStudentId(student.id);
                      avatarInputRef.current?.click();
                    }}
                    title="Загрузить / обновить фото ученика"
                    className="relative shrink-0 active:scale-95 transition disabled:opacity-70"
                  >
                    <PersonAvatar
                      src={student.avatar}
                      name={student.name}
                      className="w-9 h-9 rounded-full border border-slate-200"
                      textClassName="text-xs"
                    />
                    {uploadingStudentId === student.id ? (
                      <span className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#4e1984] text-white flex items-center justify-center ring-1 ring-white shadow-2xs">
                        <Camera className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {student.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {student.class}
                    </div>
                  </div>
                </div>

                {/* Current Status Pill */}
                {isLate ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] shrink-0 border border-amber-300">
                    Опоздал к {student.arrivalTime}
                  </span>
                ) : isPresent ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                    Вовремя (08:24)
                  </span>
                ) : isSick ? (
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px] shrink-0">
                    Болеет
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] shrink-0">
                    Не явился
                  </span>
                )}
              </div>

              {/* Dietary Needs & Allergies (Requirement 2.3) */}
              {student.dietaryNeeds && (
                <div className="mb-2 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 font-medium flex items-center gap-1.5">
                  <span className="shrink-0">🥗 Особенности питания:</span>
                  <span className="font-bold">{student.dietaryNeeds}</span>
                </div>
              )}

              {/* Parent Absence Notice if received */}
              {student.parentAbsenceNotice && (
                <div className="mb-2 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200 text-[10px] text-purple-900 font-medium flex items-center justify-between">
                  <span>📩 Предупреждение родителя: <strong>{student.parentAbsenceNotice.reason || student.parentAbsenceNotice.type}</strong></span>
                  <span className="text-purple-600 font-semibold">{student.parentAbsenceNotice.reportedAt}</span>
                </div>
              )}

              {/* Late info notice if applicable */}
              {isLate && (
                <div className="mb-2 p-2 bg-amber-100/70 rounded-xl text-[10px] text-amber-900 flex items-center justify-between">
                  <span>
                    Пропущен 1-й урок: <strong>{student.missedSubjectToday || 'Русский язык'}</strong>
                  </span>
                  <button
                    onClick={() => setLateModalStudent(student)}
                    className="text-purple-700 font-bold hover:underline"
                  >
                    Изменить время
                  </button>
                </div>
              )}

              {/* Action Buttons for Curator on Lesson 1 */}
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => updateAttendance(student.id, 'present_ontime', '08:30')}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition ${
                    isPresent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Check className="w-3 h-3" /> Вовремя
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLateModalStudent(student);
                    setLateTime('10:30');
                    setMissedSubject('Русский язык (1-й урок)');
                  }}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition ${
                    isLate
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <Clock className="w-3 h-3" /> Опоздал
                </button>

                <button
                  type="button"
                  onClick={() => updateAttendance(student.id, 'absent_sick')}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition ${
                    isSick
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  <Thermometer className="w-3 h-3" /> Болеет
                </button>

                <button
                  type="button"
                  onClick={() => updateAttendance(student.id, 'absent_parent')}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition ${
                    isParentMissed
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <UserX className="w-3 h-3" /> Пропуск
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for recording Late Arrival details (Requirement 2) */}
      {lateModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 border border-purple-100 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Фиксация опоздания</span>
              </div>
              <button
                onClick={() => setLateModalStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-950">
              Ученик: <strong>{lateModalStudent.name}</strong> ({lateModalStudent.class})
            </div>

            <form onSubmit={handleConfirmLate} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Фактическое время прихода:
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                  {['09:30', '10:00', '10:30', '11:00'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLateTime(t)}
                      className={`py-1 rounded-lg font-bold text-xs border ${
                        lateTime === t
                          ? 'bg-[#241738] text-amber-200 border-[#241738]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="time"
                  value={lateTime}
                  onChange={(e) => setLateTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Какой предмет пропущен из-за опоздания:
                </label>
                <select
                  value={missedSubject}
                  onChange={(e) => setMissedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Русский язык и прописи (1-й урок)">
                    Русский язык и прописи (1-й урок)
                  </option>
                  <option value="Математика (1-й урок)">
                    Математика (1-й урок)
                  </option>
                  <option value="Русский язык (1-й урок) + Математика (2-й урок)">
                    2 урока: Русский язык + Математика
                  </option>
                  <option value="Утренний круг и каллиграфия">
                    Утренний круг и каллиграфия
                  </option>
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Эта отметка автоматически попадет в ежемесячный отчет родителям.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Комментарий куратора (причина):
                </label>
                <input
                  type="text"
                  placeholder="Родители проспали / задержка в пробке..."
                  value={curatorComment}
                  onChange={(e) => setCuratorComment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#241738] text-amber-200 font-bold rounded-xl shadow-md active:scale-95 transition"
                >
                  Зафиксировать опоздание
                </button>
                <button
                  type="button"
                  onClick={() => setLateModalStudent(null)}
                  className="px-3 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-xl"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
