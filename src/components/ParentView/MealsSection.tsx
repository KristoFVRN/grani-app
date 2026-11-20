import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Utensils, Coffee, Sun, Apple, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';

export const MealsSection: React.FC = () => {
  const { menu, weeklyMenu, currentStudent } = useApp();
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [activeMealTab, setActiveMealTab] = useState<'all' | 'breakfast' | 'lunch' | 'snack'>('all');

  const days = weeklyMenu && weeklyMenu.length > 0 ? weeklyMenu : [menu];
  const currentDayMenu = days[activeDayIndex] || menu;

  const mealCategories = [
    { id: 'breakfast', title: 'Завтрак', time: '10:10 – 10:40', icon: Coffee, items: currentDayMenu.breakfast, color: 'text-amber-600 bg-amber-50' },
    { id: 'lunch', title: 'Обед', time: '13:00 – 13:40', icon: Sun, items: currentDayMenu.lunch, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'snack', title: 'Полдник / Ланч', time: '16:00 – 16:30', icon: Apple, items: currentDayMenu.afternoonSnack, color: 'text-purple-700 bg-purple-50' },
  ];

  const totalCalories = [
    ...currentDayMenu.breakfast,
    ...currentDayMenu.lunch,
    ...currentDayMenu.afternoonSnack
  ].reduce((acc, cur) => acc + (cur.calories || 0), 0);

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8e6d9] space-y-3.5">
      {/* Student Personal Dietary Profile (Requirement 2.3) */}
      {currentStudent && (
        <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-sm">
              🥗
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-800">
                Индивидуальный стол: {currentStudent.name}
              </div>
              <div className="font-extrabold text-xs text-amber-950">
                {currentStudent.dietaryNeeds || 'Общий стол (без ограничений)'}
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-amber-200/70 text-amber-950 px-2 py-0.5 rounded-full font-bold">
            Пищеблок учёл
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#2d124d]">Питание на день</h2>
            <p className="text-[11px] text-[#6d647a]">{currentDayMenu.date} • Собственная кухня</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-bold text-[#4e1984] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            {totalCalories} ккал / день
          </span>
        </div>
      </div>

      {/* Day of Week Selector (when weekly menu loaded) */}
      {days.length > 1 && (
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
          <Calendar className="w-3.5 h-3.5 text-[#8e859b] shrink-0 mr-1" />
          {days.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                activeDayIndex === idx
                  ? 'bg-[#4e1984] text-[#f7f8ea] shadow-xs'
                  : 'bg-[#f7f8ea] text-[#563b76] hover:bg-[#eceecc] border border-[#eceecc]'
              }`}
            >
              {d.dayName === 'Сегодня' ? 'Понедельник' : d.dayName}
            </button>
          ))}
        </div>
      )}

      {/* Meal Time Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#f7f8ea] rounded-xl border border-[#eceecc] text-xs">
        <button
          onClick={() => setActiveMealTab('all')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition ${
            activeMealTab === 'all'
              ? 'bg-[#4e1984] text-white shadow-sm'
              : 'text-[#563b76] hover:bg-white/50'
          }`}
        >
          Все приемы
        </button>
        {mealCategories.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMealTab(m.id as 'breakfast' | 'lunch' | 'snack')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              activeMealTab === m.id
                ? 'bg-[#4e1984] text-white shadow-sm'
                : 'text-[#563b76] hover:bg-white/50'
            }`}
          >
            {m.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Meal items */}
      <div className="space-y-3">
        {mealCategories
          .filter((cat) => activeMealTab === 'all' || activeMealTab === cat.id)
          .map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="rounded-xl border border-[#eceecc] bg-[#fbfbf6] p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-[#2d124d]">{cat.title}</span>
                  </div>
                  <span className="text-[11px] text-[#8e859b] font-medium">{cat.time}</span>
                </div>

                <div className="space-y-1.5">
                  {cat.items.length === 0 ? (
                    <div className="text-[11px] text-[#8e859b] italic py-1">Блюда не указаны</div>
                  ) : (
                    cat.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded-lg border border-[#f0eee0] flex items-center justify-between text-xs"
                      >
                        <div className="flex-1 pr-2">
                          <div className="font-semibold text-[#2d124d] text-xs leading-snug">
                            {item.name}
                          </div>
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                Аллерген: {item.allergens.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] font-bold text-[#4e1984]">{item.weight}</div>
                          <div className="text-[10px] text-[#8e859b]">{item.calories} ккал</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Allergens & Dietary note */}
      <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="text-[11px] leading-tight">
          Индивидуальный стол учитывает персональные непереносимости. Пища готовится только из свежих фермерских продуктов.
        </span>
      </div>
    </section>
  );
};
