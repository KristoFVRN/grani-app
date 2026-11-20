import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import type { WeeklyScheduleDay, DayMenu } from '../../types';
import {
  Upload,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  Utensils,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';

export const ScheduleAndMenuUploader: React.FC = () => {
  const { weeklySchedule, weeklyMenu, menu, updateWeeklyScheduleAndMenu, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'schedule' | 'menu'>('schedule');
  const [selectedMenuDayIdx, setSelectedMenuDayIdx] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [parsedSchedule, setParsedSchedule] = useState<WeeklyScheduleDay[] | null>(null);
  const [parsedMenu, setParsedMenu] = useState<DayMenu[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displaySchedule = parsedSchedule || weeklySchedule;
  const displayWeeklyMenu = parsedMenu || (weeklyMenu.length > 0 ? weeklyMenu : [menu]);

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Расписание
    const schedRows: (string | number)[][] = [['День', 'Время', 'Предмет', 'Педагог', 'Кабинет']];
    weeklySchedule.forEach((day) => {
      day.lessons.forEach((l) => {
        schedRows.push([day.dayName, l.time, l.subject, l.teacher, l.room]);
      });
    });
    const wsSched = XLSX.utils.aoa_to_sheet(schedRows);
    XLSX.utils.book_append_sheet(wb, wsSched, 'Расписание');

    // Sheet 2: Меню
    const menuRows: (string | number)[][] = [['День', 'Прием пищи', 'Блюдо', 'Вес', 'Калории', 'Аллергены']];
    displayWeeklyMenu.forEach((d) => {
      d.breakfast.forEach((m) =>
        menuRows.push([d.dayName, 'Завтрак', m.name, m.weight, m.calories, (m.allergens || []).join(', ')])
      );
      d.lunch.forEach((m) =>
        menuRows.push([d.dayName, 'Обед', m.name, m.weight, m.calories, (m.allergens || []).join(', ')])
      );
      d.afternoonSnack.forEach((m) =>
        menuRows.push([d.dayName, 'Полдник', m.name, m.weight, m.calories, (m.allergens || []).join(', ')])
      );
    });
    const wsMenu = XLSX.utils.aoa_to_sheet(menuRows);
    XLSX.utils.book_append_sheet(wb, wsMenu, 'Меню');

    XLSX.writeFile(wb, 'Shablon_Raspisanie_i_Menu_Grani.xlsx');
    addNotification('Шаблон Excel (.xlsx) с расписанием и меню скачан!');
  };

  const processFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });

      const newScheduleMap = new Map<string, WeeklyScheduleDay['lessons']>();
      const newMenuMap = new Map<string, DayMenu>();

      const getOrCreateMenuDay = (dayName: string): DayMenu => {
        const clean = dayName.trim() || 'Понедельник';
        if (!newMenuMap.has(clean)) {
          newMenuMap.set(clean, {
            date: clean,
            dayName: clean,
            breakfast: [],
            lunch: [],
            afternoonSnack: []
          });
        }
        return newMenuMap.get(clean)!;
      };

      // Parse sheets
      for (const sheetName of wb.SheetNames) {
        const sheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
        const lowerSheet = sheetName.toLowerCase();

        for (const row of rows) {
          // Normalize keys
          const norm: Record<string, string> = {};
          Object.entries(row).forEach(([k, v]) => {
            norm[k.toLowerCase().trim()] = String(v ?? '').trim();
          });

          const day = norm['день'] || norm['day'] || 'Понедельник';

          // Check if it looks like Schedule or Menu
          if (norm['предмет'] || norm['урок'] || lowerSheet.includes('расп')) {
            const subject = norm['предмет'] || norm['урок'];
            if (!subject) continue;
            const list = newScheduleMap.get(day) || [];
            list.push({
              time: norm['время'] || '09:00',
              subject,
              teacher: norm['педагог'] || norm['учитель'] || 'Педагог Грани',
              room: norm['кабинет'] || 'Каб. 204'
            });
            newScheduleMap.set(day, list);
          }

          if (norm['блюдо'] || norm['прием пищи'] || lowerSheet.includes('меню')) {
            const dish = norm['блюдо'];
            if (!dish) continue;
            const mealType = (norm['прием пищи'] || 'обед').toLowerCase();
            const dayObj = getOrCreateMenuDay(day);
            const allergens = norm['аллергены']
              ? norm['аллергены']
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              : undefined;
            const item = {
              name: dish,
              weight: norm['вес'] || '150 г',
              calories: Number(norm['калории']) || 200,
              allergens
            };
            if (mealType.includes('завтрак')) {
              dayObj.breakfast.push(item);
            } else if (mealType.includes('полдник') || mealType.includes('ланч')) {
              dayObj.afternoonSnack.push(item);
            } else {
              dayObj.lunch.push(item);
            }
          }
        }
      }

      const nextSched: WeeklyScheduleDay[] = [];
      newScheduleMap.forEach((lessons, dayName) => nextSched.push({ dayName, lessons }));

      const nextMenu: DayMenu[] = [];
      newMenuMap.forEach((m) => nextMenu.push(m));

      if (nextSched.length === 0 && nextMenu.length === 0) {
        addNotification('Не удалось распознать столбцы таблицы. Скачайте наш шаблон .xlsx для примера.');
        return;
      }

      setSelectedFile(file.name);
      if (nextSched.length > 0) setParsedSchedule(nextSched);
      if (nextMenu.length > 0) setParsedMenu(nextMenu);

      updateWeeklyScheduleAndMenu(
        nextSched.length > 0 ? nextSched : weeklySchedule,
        nextMenu.length > 0 ? nextMenu : displayWeeklyMenu
      );
    } catch {
      addNotification('Ошибка чтения файла. Проверьте формат (.xlsx / .csv).');
    }
  };

  const handlePublishWeek = () => {
    updateWeeklyScheduleAndMenu(displaySchedule, displayWeeklyMenu);
  };

  const currentPreviewMenu = displayWeeklyMenu[selectedMenuDayIdx] || displayWeeklyMenu[0];

  return (
    <div className="space-y-4">
      {/* Real File Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) processFile(dropped);
        }}
        className={`bg-white rounded-2xl p-5 border-2 border-dashed transition text-center space-y-3 ${
          isDragging ? 'border-[#4e1984] bg-purple-50/50' : 'border-[#d2cddf] hover:border-[#4e1984]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
            e.target.value = '';
          }}
        />

        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4e1984] mx-auto flex items-center justify-center shadow-xs">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-extrabold text-sm text-[#2d124d]">
            Загрузка расписания и меню на неделю вперед
          </h3>
          <p className="text-xs text-[#6d647a] mt-1 max-w-sm mx-auto">
            Перетащите файл <strong>Excel (.xlsx / .csv)</strong> сюда или выберите с устройства, чтобы обновить расписание и меню на всю неделю сразу.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#4e1984] hover:bg-[#3b1266] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Выбрать файл Excel / Таблицу</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="bg-[#f7f8ea] text-[#4e1984] border border-[#eceecc] hover:bg-[#eceecc] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Скачать шаблон (.xlsx)</span>
          </button>
        </div>

        {selectedFile && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-xl border border-emerald-200 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Файл применен: <strong>{selectedFile}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Switcher: Расписание уроков vs Меню столовой */}
      <div className="flex items-center justify-between px-1 gap-2 flex-wrap">
        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#eceecc] text-xs">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'schedule' ? 'bg-[#4e1984] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Расписание ({displaySchedule.length} дн.)</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeTab === 'menu' ? 'bg-[#4e1984] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Меню ({displayWeeklyMenu.length} дн.)</span>
          </button>
        </div>

        <button
          onClick={handlePublishWeek}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Опубликовать</span>
        </button>
      </div>

      {/* Content: Schedule View */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          {displaySchedule.map((day, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-[#eceecc] space-y-2.5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-extrabold text-xs text-[#4e1984]">{day.dayName}</span>
                <span className="text-[10px] text-gray-400">{day.lessons.length} блоков в день</span>
              </div>

              <div className="space-y-1.5">
                {day.lessons.map((lesson, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-2 rounded-xl bg-[#fbfbf6] border border-[#f0eee0] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <div>
                        <div className="font-bold text-[#2d124d]">{lesson.subject}</div>
                        <div className="text-[10px] text-[#8e859b]">{lesson.teacher}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold text-[#4e1984] bg-purple-50 px-2 py-0.5 rounded-md">
                        {lesson.time}
                      </span>
                      <div className="text-[10px] text-gray-500 mt-0.5">{lesson.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content: Weekly Menu Preview */}
      {activeTab === 'menu' && currentPreviewMenu && (
        <div className="bg-white rounded-2xl p-4 border border-[#eceecc] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-xs text-[#2d124d]">
              Меню на неделю ({currentPreviewMenu.dayName})
            </h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              Шеф-повар согласовал
            </span>
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {displayWeeklyMenu.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMenuDayIdx(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
                  selectedMenuDayIdx === idx
                    ? 'bg-[#4e1984] text-white'
                    : 'bg-[#f7f8ea] text-[#563b76] border border-[#eceecc]'
                }`}
              >
                {d.dayName === 'Сегодня' ? 'Понедельник' : d.dayName}
              </button>
            ))}
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#f7f8ea] border border-[#eceecc]">
              <span className="font-bold text-[#4e1984] block mb-1">Завтрак (10:10 – 10:40)</span>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 text-[11px]">
                {currentPreviewMenu.breakfast.map((m, i) => (
                  <li key={i}>
                    {m.name} ({m.weight})
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-[#f7f8ea] border border-[#eceecc]">
              <span className="font-bold text-[#4e1984] block mb-1">Обед (13:00 – 13:40)</span>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 text-[11px]">
                {currentPreviewMenu.lunch.map((m, i) => (
                  <li key={i}>
                    {m.name} ({m.weight})
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-[#f7f8ea] border border-[#eceecc]">
              <span className="font-bold text-[#4e1984] block mb-1">Полдник / Ланч (16:00 – 16:30)</span>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5 text-[11px]">
                {currentPreviewMenu.afternoonSnack.map((m, i) => (
                  <li key={i}>
                    {m.name} ({m.weight})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
