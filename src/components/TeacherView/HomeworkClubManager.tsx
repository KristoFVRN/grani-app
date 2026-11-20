import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Check,
  Edit3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AfterSchoolClubsDispatch } from './AfterSchoolClubsDispatch';
import { PersonAvatar } from '../PersonAvatar';

export const HomeworkClubManager: React.FC = () => {
  const { students, updateTwoStageHomework, currentUser, shiftHandoff, handoverShift } = useApp();
  const [handoffModalOpen, setHandoffModalOpen] = useState(false);
  const [handoffNotes, setHandoffNotes] = useState('Все дети 1 ступени накормлены обедом, ДЗ по математике выполнено. В 17:00 Михаил Грачев идет на пробное по хореографии.');
  const [toTeacherName, setToTeacherName] = useState('Марина Игоревна Светлова (Педагог продленки)');
  const [activeStage, setActiveStage] = useState<'class' | 'extended'>('class');
  const [showClubsDispatch, setShowClubsDispatch] = useState<boolean>(true);

  // Currently editing student notes
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [homeTaskRemaining, setHomeTaskRemaining] = useState('');

  const completedCount = students.filter(
    (s) => s.homework?.finalStatus === 'all_done'
  ).length;

  const handleOpenEdit = (studentId: string, currentNotes: string, remaining = '') => {
    setEditingStudentId(studentId);
    setNotesText(currentNotes || '');
    setHomeTaskRemaining(remaining || '');
  };

  const handleSaveStage = (
    studentId: string,
    isCompleted: boolean,
    finalStatus?: 'all_done' | 'needs_home_finish'
  ) => {
    updateTwoStageHomework(
      studentId,
      activeStage,
      {
        completed: isCompleted,
        notes: notesText || (isCompleted ? 'Все задания выполнены в полном объеме.' : 'Требуется доработка.'),
        teacherName: currentUser?.name || (activeStage === 'class' ? 'Куратор ступени' : 'Дежурный педагог продленки')
      },
      finalStatus,
      homeTaskRemaining
    );
    setEditingStudentId(null);
  };

  return (
    <div className="space-y-3.5 text-xs">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-3xl shadow-md border border-amber-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">
                Продленка центра «Грани»
              </div>
              <div className="font-black text-base">Двухэтапный контроль ДЗ</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-black/25 text-white px-2.5 py-1 rounded-full font-bold">
              {completedCount} из {students.length} завершено
            </span>
          </div>
        </div>

        <p className="text-[11px] text-amber-100/90 mt-2 leading-relaxed">
          Куратор фиксирует выполнение <strong>до 15:00</strong> в классе, а дежурный педагог продленки дополняет статус <strong>после 15:00</strong>, если ребенок доделывал уроки.
        </p>

        {/* Stage Toggle Pills */}
        <div className="mt-3 grid grid-cols-2 p-1 bg-black/20 rounded-2xl font-bold text-xs">
          <button
            type="button"
            onClick={() => setActiveStage('class')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeStage === 'class'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-amber-100 hover:text-white'
            }`}
          >
            <span>1️⃣ В ступени (до 15:00)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStage('extended')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeStage === 'extended'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-amber-100 hover:text-white'
            }`}
          >
            <span>2️⃣ На продленке (после 15:00)</span>
          </button>
        </div>
      </div>

      {/* Extended Care Route Sheet Widget (Requirement: who goes where and when) */}
      {activeStage === 'extended' && (
        <div className="bg-gradient-to-r from-[#241738] via-[#3a1d5a] to-[#4e1984] text-white p-4 rounded-3xl shadow-md border border-amber-400/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5 text-purple-950" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  Маршрутный лист продленки на сегодня
                </div>
                <div className="font-extrabold text-sm leading-snug">
                  Кто и во сколько идет на кружки
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowClubsDispatch(!showClubsDispatch)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 transition"
            >
              <span>{showClubsDispatch ? 'Свернуть' : 'Развернуть'}</span>
              {showClubsDispatch ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="mt-2.5 p-2.5 bg-black/25 rounded-2xl text-[11px] text-purple-100 flex items-center gap-2">
            <span className="text-amber-300 font-extrabold">📌 Напоминание:</span>
            <span>В 17:00 Иванов, Петров, Сидоров идут на танцы («Ритм», Зал хореографии)</span>
          </div>

          {showClubsDispatch && (
            <div className="mt-3 pt-3 border-t border-purple-300/20 text-slate-900 bg-white/95 backdrop-blur-md rounded-2xl p-3">
              <AfterSchoolClubsDispatch />
            </div>
          )}
        </div>
      )}

      {/* Shift Handoff Card at 15:00 (Requirement 2.4) */}
      <div className="p-3 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl shadow-sm border border-teal-700/40 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/30 text-teal-200 flex items-center justify-center font-bold text-sm">
              ⏰
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-300">
                Передача смены куратора в 15:00
              </div>
              <div className="font-extrabold text-xs text-white">
                {shiftHandoff ? `Смена передана в ${shiftHandoff.time}` : 'Ожидает передачи'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHandoffModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-black text-[11px] active:scale-95 transition shadow-xs flex items-center gap-1"
          >
            <span>{shiftHandoff ? 'Обновить смену' : 'Передать смену'}</span>
          </button>
        </div>

        {shiftHandoff && (
          <div className="p-2 bg-black/25 rounded-xl text-[10px] text-teal-100/90 leading-snug">
            <strong>От: </strong>{shiftHandoff.fromStaffName} ➔ <strong>Кому: </strong>{shiftHandoff.toStaffName}
            <div className="text-white/80 mt-0.5 italic">«{shiftHandoff.notes}»</div>
          </div>
        )}
      </div>

      {/* Handoff Modal */}
      {handoffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Передача смены дежурному педагогу (15:00)
            </h3>
            <p className="text-xs text-slate-500">
              Фиксация перехода контроля детей от куратора к продленке «Созидатели».
            </p>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                Кому передается смена (дежурный педагог):
              </label>
              <input
                type="text"
                value={toTeacherName}
                onChange={(e) => setToTeacherName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                Заметки о детях и выполненных уроках:
              </label>
              <textarea
                rows={3}
                value={handoffNotes}
                onChange={(e) => setHandoffNotes(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHandoffModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  handoverShift(handoffNotes, toTeacherName);
                  setHandoffModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-xs"
              >
                Зафиксировать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice about Current Mode */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-700 shrink-0" />
          <span>
            Режим отметки:{' '}
            <strong className="text-purple-950">
              {activeStage === 'class'
                ? 'Куратор ступени (уроки и задания в классе)'
                : 'Дежурный педагог продленки (доделка после 15:00)'}
            </strong>
          </span>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-2.5">
        {students.map((student) => {
          const hw = student.homework;
          const stageData = activeStage === 'class' ? hw?.stageClass : hw?.stageExtended;
          const isDone = stageData?.completed;
          const isEditing = editingStudentId === student.id;

          return (
            <div
              key={student.id}
              className={`bg-white rounded-2xl p-3 border transition ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar
                    src={student.avatar}
                    name={student.name}
                    className="w-10 h-10 rounded-full ring-1 ring-gray-200"
                    textClassName="text-xs"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {student.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {student.class}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Сделано
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-amber-600" />
                      В процессе
                    </>
                  )}
                </span>
              </div>

              {/* Dietary Needs Badge (Requirement 2.3) */}
              {student.dietaryNeeds && (
                <div className="mt-2 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 font-medium flex items-center gap-1.5">
                  <span className="shrink-0">🥗 Особенности питания:</span>
                  <span className="font-bold">{student.dietaryNeeds}</span>
                </div>
              )}

              {/* In Extended Mode: Show what curator handed over from class (Requirement 1.3) */}
              {activeStage === 'extended' && hw?.stageClass && (
                <div className="mt-2 p-2 bg-amber-50/90 rounded-xl border border-amber-200/80 text-[11px] text-amber-950">
                  <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mb-0.5">
                    <span>📋 Комментарий куратора из класса (до 15:00):</span>
                    <span>{hw.stageClass.teacherName}</span>
                  </div>
                  <p className="font-medium text-slate-800">
                    {hw.stageClass.notes || 'Математика и окружающий мир выполнены.'}
                  </p>
                  {hw.homeTaskRemaining && (
                    <div className="mt-1 text-[10px] text-rose-700 font-semibold">
                      📌 Осталось доделать на продленке: {hw.homeTaskRemaining}
                    </div>
                  )}
                </div>
              )}

              {/* Current Stage Note */}
              <div className="mt-2 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>
                    {activeStage === 'class' ? 'Отметка куратора в классе:' : 'Отметка дежурного педагога:'}
                  </span>
                  <span>{stageData?.updatedAt || 'Сегодня'}</span>
                </div>
                <p className="font-medium text-slate-900">
                  {stageData?.notes || 'Задания выполняются по расписанию.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSaveStage(student.id, true, activeStage === 'extended' ? 'all_done' : undefined)
                  }
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  {activeStage === 'class' ? 'Сделано в классе ✓' : 'Доделано на продленке ✓'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenEdit(student.id, stageData?.notes || '', hw?.homeTaskRemaining || '')
                  }
                  className="px-3 py-1.5 bg-purple-50 text-purple-900 hover:bg-purple-100 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3 text-purple-700" />
                  Детали
                </button>
              </div>

              {/* Edit Comment Drawer */}
              {isEditing && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Уточнить комментарий для родителя ({activeStage === 'class' ? 'до 15:00' : 'после 15:00'}):
                  </label>
                  <textarea
                    rows={2}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Например: математику сделали, прописи дописать на продленке..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />

                  {activeStage === 'extended' && (
                    <div>
                      <label className="text-[11px] font-bold text-amber-800 block mb-0.5">
                        Если осталось доделать дома:
                      </label>
                      <input
                        type="text"
                        placeholder="Например: почитать рассказ на стр. 42 (15 мин)"
                        value={homeTaskRemaining}
                        onChange={(e) => setHomeTaskRemaining(e.target.value)}
                        className="w-full px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveStage(
                          student.id,
                          true,
                          homeTaskRemaining ? 'needs_home_finish' : 'all_done'
                        )
                      }
                      className="flex-1 py-1.5 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                    >
                      Сохранить и оповестить маму
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStudentId(null)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
