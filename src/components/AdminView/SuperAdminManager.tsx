import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PersonAvatar } from '../PersonAvatar';
import { AvatarUploader } from '../AvatarUploader';
import {
  Layers,
  Sparkles,
  Users,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  UserCheck,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import type { SchoolStage, ConsultationSpecialist, ClubSubscription, Student, DayMenu, MealItem } from '../../types';

export const SuperAdminManager: React.FC = () => {
  const {
    stages,
    addOrUpdateStage,
    deleteStage,
    specialists,
    addOrUpdateSpecialist,
    deleteSpecialist,
    subscriptions,
    addOrUpdateClub,
    deleteClub,
    students,
    addOrUpdateStudent,
    deleteStudent,
    bookings,
    updateBookingStatus,
    weeklyMenu,
    menu,
    updateDayMenu
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'stages' | 'specialists' | 'menu' | 'clubs' | 'students' | 'bookings'>('stages');

  // Stage edit state
  const [editingStage, setEditingStage] = useState<Partial<SchoolStage> | null>(null);

  // Specialist edit state
  const [editingSpecialist, setEditingSpecialist] = useState<Partial<ConsultationSpecialist> | null>(null);

  // Menu edit state
  const [selectedMenuDayIdx, setSelectedMenuDayIdx] = useState<number>(0);
  const [editingMeal, setEditingMeal] = useState<{
    dayIdx: number;
    mealType: 'breakfast' | 'lunch' | 'afternoonSnack';
    dishIdx: number | null;
    name: string;
    weight: string;
    calories: number;
    allergens: string;
  } | null>(null);

  // Club edit state
  const [editingClub, setEditingClub] = useState<Partial<ClubSubscription> | null>(null);

  // Student edit state
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

  // Booking confirm state
  const [confirmingBookingId, setConfirmingBookingId] = useState<string | null>(null);
  const [confirmDate, setConfirmDate] = useState('20 ноября (Вт) в 16:30');
  const [confirmRoom, setConfirmRoom] = useState('Кабинет 104');
  const [confirmNotes, setConfirmNotes] = useState('Ждем вас с ребенком.');

  const displayWeeklyMenu = weeklyMenu && weeklyMenu.length > 0 ? weeklyMenu : [menu];
  const currentDayMenu = displayWeeklyMenu[selectedMenuDayIdx] || displayWeeklyMenu[0];

  const handleSaveMealDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeal || !editingMeal.name.trim()) return;

    const days = weeklyMenu.length > 0 ? [...weeklyMenu] : [menu];
    const targetDay: DayMenu = {
      ...(days[editingMeal.dayIdx] || currentDayMenu),
      breakfast: [...(days[editingMeal.dayIdx]?.breakfast || currentDayMenu.breakfast)],
      lunch: [...(days[editingMeal.dayIdx]?.lunch || currentDayMenu.lunch)],
      afternoonSnack: [...(days[editingMeal.dayIdx]?.afternoonSnack || currentDayMenu.afternoonSnack)],
    };

    const newItem: MealItem = {
      name: editingMeal.name.trim(),
      weight: editingMeal.weight.trim() || '200 г',
      calories: Number(editingMeal.calories) || 200,
      allergens: editingMeal.allergens
        ? editingMeal.allergens.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined
    };

    const targetList = [...targetDay[editingMeal.mealType]];
    if (editingMeal.dishIdx === null) {
      targetList.push(newItem);
    } else {
      targetList[editingMeal.dishIdx] = newItem;
    }
    targetDay[editingMeal.mealType] = targetList;

    updateDayMenu(targetDay);
    setEditingMeal(null);
  };

  const handleDeleteDish = (
    dayIdx: number,
    mealType: 'breakfast' | 'lunch' | 'afternoonSnack',
    dishIdx: number
  ) => {
    const days = weeklyMenu.length > 0 ? [...weeklyMenu] : [menu];
    const targetDay: DayMenu = {
      ...(days[dayIdx] || currentDayMenu),
      breakfast: [...(days[dayIdx]?.breakfast || currentDayMenu.breakfast)],
      lunch: [...(days[dayIdx]?.lunch || currentDayMenu.lunch)],
      afternoonSnack: [...(days[dayIdx]?.afternoonSnack || currentDayMenu.afternoonSnack)],
    };

    targetDay[mealType] = targetDay[mealType].filter((_, i) => i !== dishIdx);
    updateDayMenu(targetDay);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Super Admin Top Banner */}
      <div className="bg-gradient-to-r from-[#241738] via-[#3d1e63] to-[#1e1330] text-white p-4 rounded-3xl shadow-lg border border-amber-300/30">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              Панель Руководителя / Редактора
            </div>
            <div className="font-extrabold text-base">
              Конструктор ступеней, кружков и меню
            </div>
          </div>
        </div>
        <p className="text-[11px] text-purple-200 mt-2 leading-relaxed">
          Здесь можно редактировать <strong>любые названия</strong>, добавлять новые ступени познания, настраивать список специалистов для консультаций, кружки и учеников.
        </p>

        {/* Sub-tabs pills */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'stages', label: 'Ступени познания', icon: Layers },
            { id: 'specialists', label: '13 Специалистов', icon: Users },
            { id: 'menu', label: 'Меню питания', icon: Utensils },
            { id: 'clubs', label: 'Кружки и студии', icon: Sparkles },
            { id: 'students', label: 'Дети и родители', icon: UserCheck },
            { id: 'bookings', label: 'Заявки на прием', icon: Calendar },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSubTab(t.id as any)}
                className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition text-[11px] ${
                  active
                    ? 'bg-amber-400 text-purple-950 shadow-md'
                    : 'bg-black/25 text-purple-200 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- 1. STAGES MANAGER ---------------- */}
      {activeSubTab === 'stages' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-xs text-slate-900">
              Ступени познания ({stages.length} ступеней)
            </h3>
            <button
              onClick={() =>
                setEditingStage({
                  id: `stage_${Date.now()}`,
                  number: stages.length + 1,
                  name: `Ступень познания ${stages.length + 1}`,
                  badge: 'Новая ступень',
                  curatorName: 'ФИО куратора',
                  room: 'Кабинет ...',
                  description: 'Описание программы ступени',
                  studentCount: 10
                })
              }
              className="px-2.5 py-1 bg-[#241738] text-amber-200 font-bold rounded-lg flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить ступень
            </button>
          </div>

          <div className="space-y-2">
            {stages.map((st) => (
              <div
                key={st.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-purple-950">{st.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                      «{st.badge}»
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Куратор: <strong>{st.curatorName}</strong> • {st.room}
                  </div>
                  <p className="text-[10px] text-slate-400">{st.description}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingStage(st)}
                    className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1 text-xs font-bold transition"
                    title="Редактировать"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Изменить</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Editor Modal */}
          {editingStage && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Редактирование ступени</span>
                  <button onClick={() => setEditingStage(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">
                      Юридическое название (например: Ступень познания 1)
                    </label>
                    <input
                      type="text"
                      value={editingStage.name || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">
                      Название группы (например: Первооткрыватели / Мыслители)
                    </label>
                    <input
                      type="text"
                      value={editingStage.badge || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, badge: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Куратор ступени</label>
                    <input
                      type="text"
                      value={editingStage.curatorName || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, curatorName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Кабинет / локация</label>
                    <input
                      type="text"
                      value={editingStage.room || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, room: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Краткое описание</label>
                    <textarea
                      rows={2}
                      value={editingStage.description || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      if (editingStage.name) addOrUpdateStage(editingStage as SchoolStage);
                      setEditingStage(null);
                    }}
                    className="w-full py-2 bg-[#241738] hover:bg-[#34224f] text-amber-200 font-bold rounded-xl text-xs shadow-xs"
                  >
                    Сохранить ступень
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (editingStage?.id && window.confirm(`Вы уверены, что хотите удалить «${editingStage.name}»? Это действие нельзя отменить.`)) {
                        deleteStage(editingStage.id);
                        setEditingStage(null);
                      }
                    }}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Удалить эту ступень</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 2. SPECIALISTS MANAGER (13 Specialists) ---------------- */}
      {activeSubTab === 'specialists' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-xs text-slate-900">
              Специалисты для консультаций ({specialists.length} позиций)
            </h3>
            <button
              onClick={() =>
                setEditingSpecialist({
                  id: `spec_${Date.now()}`,
                  title: 'Новый специалист',
                  name: 'ФИО специалиста',
                  room: 'Кабинет ...',
                  availableDays: 'Вт, Чт с 16:00',
                  category: 'teachers'
                })
              }
              className="px-2.5 py-1 bg-[#241738] text-amber-200 font-bold rounded-lg flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить
            </button>
          </div>

          <div className="space-y-2">
            {specialists.map((sp, idx) => (
              <div
                key={sp.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-extrabold text-xs text-slate-900 truncate">
                    {idx + 1}. {sp.title}
                  </div>
                  <div className="text-[11px] text-purple-900 font-semibold truncate">
                    {sp.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {sp.room} • {sp.availableDays}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingSpecialist(sp)}
                    className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSpecialist(sp.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Specialist Editor Modal */}
          {editingSpecialist && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Редактирование специалиста</span>
                  <button onClick={() => setEditingSpecialist(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">
                      Название позиции (как в списке для родителей)
                    </label>
                    <input
                      type="text"
                      value={editingSpecialist.title || ''}
                      onChange={(e) => setEditingSpecialist({ ...editingSpecialist, title: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">ФИО сотрудника</label>
                    <input
                      type="text"
                      value={editingSpecialist.name || ''}
                      onChange={(e) => setEditingSpecialist({ ...editingSpecialist, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Кабинет</label>
                    <input
                      type="text"
                      value={editingSpecialist.room || ''}
                      onChange={(e) => setEditingSpecialist({ ...editingSpecialist, room: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Дни и часы приема</label>
                    <input
                      type="text"
                      value={editingSpecialist.availableDays || ''}
                      onChange={(e) => setEditingSpecialist({ ...editingSpecialist, availableDays: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (editingSpecialist.title) addOrUpdateSpecialist(editingSpecialist as ConsultationSpecialist);
                    setEditingSpecialist(null);
                  }}
                  className="w-full py-2 bg-[#241738] text-amber-200 font-bold rounded-xl"
                >
                  Сохранить
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 3. MENU MANAGER (Руководитель редактирует меню столовой) ---------------- */}
      {activeSubTab === 'menu' && (
        <div className="space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-600" />
                Меню столовой и пищеблока
              </h3>
              <p className="text-[10px] text-slate-500">
                Редактирование блюд, веса и калорийности для родителей и кухни
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Онлайн редактор
            </span>
          </div>

          {/* Days Switcher */}
          <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-2xl">
            {displayWeeklyMenu.map((d, idx) => (
              <button
                key={d.dayName}
                type="button"
                onClick={() => setSelectedMenuDayIdx(idx)}
                className={`py-1.5 px-1 rounded-xl text-center text-xs font-bold transition ${
                  selectedMenuDayIdx === idx
                    ? 'bg-[#241738] text-amber-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="truncate">{d.dayName.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          {/* Current Day Info */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-xs text-amber-950">
                {currentDayMenu.dayName} ({currentDayMenu.date})
              </div>
              <div className="text-[10px] text-amber-800/80">
                Завтрак, обед и полдник • Изменения сразу видны в кабинете родителей
              </div>
            </div>
          </div>

          {/* Meals Sections: Breakfast, Lunch, Snack */}
          {(
            [
              { type: 'breakfast', label: 'Завтрак', time: '08:30 – 09:00', icon: '🍳', items: currentDayMenu.breakfast },
              { type: 'lunch', label: 'Обед (Горячее питание)', time: '13:00 – 14:00', icon: '🍲', items: currentDayMenu.lunch },
              { type: 'afternoonSnack', label: 'Полдник', time: '16:30 – 17:00', icon: '🥐', items: currentDayMenu.afternoonSnack },
            ] as const
          ).map((section) => (
            <div key={section.type} className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{section.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{section.label}</h4>
                    <span className="text-[10px] text-slate-400">{section.time}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMeal({
                      dayIdx: selectedMenuDayIdx,
                      mealType: section.type,
                      dishIdx: null,
                      name: '',
                      weight: '200 г',
                      calories: 220,
                      allergens: ''
                    })
                  }
                  className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 font-bold text-[11px] flex items-center gap-1 active:scale-95 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-700" /> Добавить
                </button>
              </div>

              {section.items.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic py-2 text-center bg-slate-50 rounded-xl">
                  Блюда еще не добавлены
                </div>
              ) : (
                <div className="space-y-1.5">
                  {section.items.map((item, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between gap-2 transition"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                            {item.weight}
                          </span>
                          <span>{item.calories} ккал</span>
                          {item.allergens && item.allergens.length > 0 && (
                            <span className="text-amber-700 bg-amber-100/70 px-1 rounded">
                              {item.allergens.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingMeal({
                              dayIdx: selectedMenuDayIdx,
                              mealType: section.type,
                              dishIdx: dIdx,
                              name: item.name,
                              weight: item.weight,
                              calories: item.calories,
                              allergens: (item.allergens || []).join(', ')
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-purple-100 text-purple-700 transition"
                          title="Редактировать блюдо"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(selectedMenuDayIdx, section.type, dIdx)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition"
                          title="Удалить блюдо"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Dish Editor Modal */}
          {editingMeal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {editingMeal.dishIdx === null ? 'Добавить блюдо' : 'Редактировать блюдо'}
                    </h3>
                  </div>
                  <button onClick={() => setEditingMeal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveMealDish} className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">
                      Название блюда
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Например: Сырники с ягодным соусом"
                      value={editingMeal.name}
                      onChange={(e) => setEditingMeal({ ...editingMeal, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">
                        Выход / Вес
                      </label>
                      <input
                        type="text"
                        placeholder="180 г"
                        value={editingMeal.weight}
                        onChange={(e) => setEditingMeal({ ...editingMeal, weight: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">
                        Калории (ккал)
                      </label>
                      <input
                        type="number"
                        placeholder="220"
                        value={editingMeal.calories}
                        onChange={(e) => setEditingMeal({ ...editingMeal, calories: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">
                      Аллергены (через запятую)
                    </label>
                    <input
                      type="text"
                      placeholder="молоко, глютен, яйцо"
                      value={editingMeal.allergens}
                      onChange={(e) => setEditingMeal({ ...editingMeal, allergens: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#241738] hover:bg-[#341e52] text-amber-200 font-extrabold rounded-xl shadow-md transition active:scale-95"
                  >
                    Сохранить блюдо
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 4. CLUBS & WORKSHOPS MANAGER ---------------- */}
      {activeSubTab === 'clubs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-xs text-slate-900">
              Кружки и студии ({subscriptions.length})
            </h3>
            <button
              onClick={() =>
                setEditingClub({
                  id: `club_${Date.now()}`,
                  title: 'Новый кружок',
                  iconName: 'Sparkles',
                  curatorName: 'Преподаватель',
                  scheduleDays: 'Понедельник, Среда',
                  startTime: '16:30',
                  endTime: '17:45',
                  pickupStrictTime: '17:45',
                  pickupNotice: 'Забирать ровно в 17:45',
                  totalLessons: 8,
                  remainingLessons: 8,
                  expiresDate: '31.12.2026',
                  pricePerMonth: 4000,
                  todayStatus: 'active'
                })
              }
              className="px-2.5 py-1 bg-[#241738] text-amber-200 font-bold rounded-lg flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить кружок
            </button>
          </div>

          <div className="space-y-2">
            {subscriptions.map((club) => (
              <div
                key={club.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{club.title}</div>
                    <div className="text-[11px] text-purple-900">
                      Преподаватель: {club.curatorName} • {club.pricePerMonth} ₽/мес
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingClub(club)}
                      className="p-1.5 rounded-lg bg-purple-50 text-purple-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteClub(club.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 flex items-center justify-between">
                  <span>Расписание: {club.scheduleDays} ({club.startTime}–{club.endTime})</span>
                  <span className="font-bold">Забирать в {club.pickupStrictTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Club Editor Modal */}
          {editingClub && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Редактирование кружка</span>
                  <button onClick={() => setEditingClub(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Название кружка</label>
                    <input
                      type="text"
                      value={editingClub.title || ''}
                      onChange={(e) => setEditingClub({ ...editingClub, title: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Преподаватель</label>
                    <input
                      type="text"
                      value={editingClub.curatorName || ''}
                      onChange={(e) => setEditingClub({ ...editingClub, curatorName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block">Дни занятий</label>
                      <input
                        type="text"
                        value={editingClub.scheduleDays || ''}
                        onChange={(e) => setEditingClub({ ...editingClub, scheduleDays: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block">Забирать в (строго)</label>
                      <input
                        type="text"
                        value={editingClub.pickupStrictTime || ''}
                        onChange={(e) => setEditingClub({ ...editingClub, pickupStrictTime: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block">Начало</label>
                      <input
                        type="text"
                        value={editingClub.startTime || ''}
                        onChange={(e) => setEditingClub({ ...editingClub, startTime: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block">Окончание</label>
                      <input
                        type="text"
                        value={editingClub.endTime || ''}
                        onChange={(e) => setEditingClub({ ...editingClub, endTime: e.target.value })}
                        className="w-full px-2.5 py-1.5 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (editingClub.title) addOrUpdateClub(editingClub as ClubSubscription);
                    setEditingClub(null);
                  }}
                  className="w-full py-2 bg-[#241738] text-amber-200 font-bold rounded-xl"
                >
                  Сохранить кружок
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 4. STUDENTS MANAGER ---------------- */}
      {activeSubTab === 'students' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-xs text-slate-900">
              Список учащихся ({students.length})
            </h3>
            <button
              onClick={() =>
                setEditingStudent({
                  id: `s_${Date.now()}`,
                  name: 'Новый ученик',
                  class: 'Ступень познания 1 «Первооткрыватели»',
                  stageId: 'stage_1',
                  avatar: '',
                  status: 'present_ontime',
                  arrivalTime: '08:30',
                  curatorName: 'Анна Сергеевна',
                  room: 'Каб. 204',
                  parentName: 'ФИО родителя',
                  parentPhone: '+7 (900) 000-00-00',
                  pickup: { person: 'mom', updatedAt: 'Сегодня' },
                  homework: {
                    stageClass: { completed: true, notes: 'В классе выполнено', teacherName: 'Куратор', updatedAt: '14:45' },
                    stageExtended: { completed: true, notes: 'На продленке проверено', teacherName: 'Дежурный педагог', updatedAt: '16:40' },
                    finalStatus: 'all_done'
                  },
                  attendanceStats: {
                    monthName: 'Ноябрь',
                    totalDays: 22,
                    presentOnTime: 20,
                    lateDays: 0,
                    sickDays: 0,
                    parentMissedDays: 0,
                    lateDetails: []
                  }
                })
              }
              className="px-2.5 py-1 bg-[#241738] text-amber-200 font-bold rounded-lg flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить ребенка
            </button>
          </div>

          <div className="space-y-2">
            {students.map((st) => (
              <div
                key={st.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar
                    src={st.avatar}
                    name={st.name}
                    className="w-9 h-9 rounded-full"
                    textClassName="text-xs"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900">{st.name}</div>
                    <div className="text-[10px] text-purple-700">{st.class}</div>
                    <div className="text-[10px] text-slate-400">
                      Родитель: {st.parentName} ({st.parentPhone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingStudent(st)}
                    className="p-1.5 rounded-lg bg-purple-50 text-purple-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteStudent(st.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Student Editor Modal */}
          {editingStudent && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Данные ребенка</span>
                  <button onClick={() => setEditingStudent(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <AvatarUploader
                    label="Фотография ученика"
                    value={editingStudent.avatar}
                    name={editingStudent.name || ''}
                    onChange={(url) => setEditingStudent({ ...editingStudent, avatar: url })}
                  />
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">ФИО ребенка</label>
                    <input
                      type="text"
                      value={editingStudent.name || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Ступень познания</label>
                    <select
                      value={editingStudent.class || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={`${s.name} «${s.badge}»`}>
                          {s.name} «{s.badge}»
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">ФИО родителя</label>
                    <input
                      type="text"
                      value={editingStudent.parentName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Телефон родителя</label>
                    <input
                      type="tel"
                      value={editingStudent.parentPhone || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (editingStudent.name) addOrUpdateStudent(editingStudent as Student);
                    setEditingStudent(null);
                  }}
                  className="w-full py-2 bg-[#241738] text-amber-200 font-bold rounded-xl"
                >
                  Сохранить
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 5. CONSULTATION BOOKINGS MANAGER ---------------- */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-3">
          <div className="px-1">
            <h3 className="font-extrabold text-xs text-slate-900">
              Входящие заявки от родителей на личный прием ({bookings.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Руководитель или специалист назначает точное время и кабинет
            </p>
          </div>

          <div className="space-y-2.5">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-purple-950">
                      К кому: <strong className="text-amber-800">{b.specialistTitle}</strong> ({b.specialistName})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Родитель: <strong>{b.parentName}</strong> ({b.parentPhone}) • Ребенок:{' '}
                      <strong>{b.studentName}</strong>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {b.status === 'confirmed' ? '✓ Согласовано' : '⏳ Ждет ответа'}
                  </span>
                </div>

                {/* Topic / Problem */}
                <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-800 border border-slate-200/60">
                  <span className="font-bold text-purple-900">Тематика проблемы: </span>
                  «{b.topicProblem}»
                </div>

                {b.status === 'confirmed' ? (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-xl flex items-center justify-between">
                    <span>
                      Назначено: <strong>{b.confirmedDateTime}</strong> ({b.confirmedRoom})
                    </span>
                    <button
                      onClick={() => setConfirmingBookingId(b.id)}
                      className="text-purple-700 font-bold hover:underline"
                    >
                      Изменить время
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingBookingId(b.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Согласовать время и назначить прием
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Confirm Dialog */}
          {confirmingBookingId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>Согласование времени приема</span>
                  <button onClick={() => setConfirmingBookingId(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Дата и время приема</label>
                    <input
                      type="text"
                      value={confirmDate}
                      onChange={(e) => setConfirmDate(e.target.value)}
                      placeholder="Например: 20 ноября (Вт) в 16:30"
                      className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Кабинет</label>
                    <input
                      type="text"
                      value={confirmRoom}
                      onChange={(e) => setConfirmRoom(e.target.value)}
                      placeholder="Кабинет 104 (Речевая студия)"
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block">Комментарий для мамы</label>
                    <input
                      type="text"
                      value={confirmNotes}
                      onChange={(e) => setConfirmNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateBookingStatus(confirmingBookingId, 'confirmed', confirmDate, confirmRoom, confirmNotes);
                    setConfirmingBookingId(null);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Подтвердить и отправить пуш родителю
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
