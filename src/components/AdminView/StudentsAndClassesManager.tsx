import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import type { Student, StaffMember } from '../../types';
import {
  Users,
  UserPlus,
  Download,
  Upload,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  Phone,
  Calendar,
  Check,
  Copy,
  Printer,
  X,
  AlertCircle,
  GraduationCap,
  Utensils
} from 'lucide-react';

export const StudentsAndClassesManager: React.FC = () => {
  const {
    students,
    stages,
    staffMembers,
    addOrUpdateStudent,
    deleteStudent,
    batchAddStudents,
    addOrUpdateStaffMember,
    deleteStaffMember,
    addNotification
  } = useApp();

  const [selectedStageId, setSelectedStageId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMainSection, setActiveMainSection] = useState<'students' | 'staff'>('students');

  // Modals state
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [isNewStudent, setIsNewStudent] = useState<boolean>(false);

  const [showAccessCardsModal, setShowAccessCardsModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importParsedStudents, setImportParsedStudents] = useState<Partial<Student>[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');

  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);
  const [isNewStaff, setIsNewStaff] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchStage = selectedStageId === 'all' || s.stageId === selectedStageId;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.parentName?.toLowerCase().includes(q) ||
      s.parentPhone?.includes(q) ||
      s.birthDate?.includes(q);
    return matchStage && matchQuery;
  });

  // Filtered Staff
  const filteredStaff = staffMembers.filter((st) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || st.name.toLowerCase().includes(q) || st.role.toLowerCase().includes(q) || st.phone.includes(q);
  });

  // Copy text helper
  const copyToClipboard = (text: string, notificationMsg: string) => {
    navigator.clipboard.writeText(text);
    addNotification(notificationMsg);
  };

  // 1. Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const rows = [
      ['Класс/Ступень', 'ФИО ученика', 'Дата рождения (пароль)', 'ФИО родителя', 'Телефон родителя (логин)', 'Особенности питания / аллергии'],
      ['Ступень 1 «Первооткрыватели»', 'Иванов Иван Алексеевич', '15.04.2016', 'Иванова Мария Сергеевна', '+7 (903) 123-45-67', 'Без ограничений'],
      ['Ступень 2 «Исследователи»', 'Петрова Анна Дмитриевна', '22.09.2015', 'Петров Дмитрий Олегович', '+7 (905) 987-65-43', 'Без лактозы (непереносимость молока)'],
      ['Стартеры (0 класс)', 'Смирнов Артем Максимович', '08.11.2018', 'Смирнова Ольга Викторовна', '+7 (910) 555-11-22', 'Аллергия на орехи и мед']
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Список_учеников');
    XLSX.writeFile(wb, 'Shablon_Spiska_Uchenikov_GRANI.xlsx');
    addNotification('Шаблон Excel для загрузки учеников успешно скачан!');
  };

  // 2. Parse Excel/CSV File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet);

      if (!rawData || rawData.length === 0) {
        addNotification('Файл пустой или не содержит строк с данными.');
        return;
      }

      const parsed: Partial<Student>[] = rawData.map((row, idx) => {
        // Detect fields dynamically
        const name = row['ФИО ученика'] || row['ФИО'] || row['Ученик'] || row['Student'] || `Ученик ${idx + 1}`;
        const rawStage = row['Класс/Ступень'] || row['Класс'] || row['Ступень'] || 'Ступень познания 1 «Первооткрыватели»';
        const birthDate = row['Дата рождения (пароль)'] || row['Дата рождения'] || row['ДР'] || row['BirthDate'] || '01.01.2016';
        const parentName = row['ФИО родителя'] || row['Родитель'] || row['Parent'] || 'Родитель';
        const parentPhone = row['Телефон родителя (логин)'] || row['Телефон'] || row['Phone'] || '+7 (900) 000-00-00';
        const dietaryNeeds = row['Особенности питания / аллергии'] || row['Питание'] || row['Аллергии'] || 'Общий стол';

        // Match stage ID
        let stageId = 'stage_1';
        if (String(rawStage).toLowerCase().includes('старт')) stageId = 'stage_0';
        else if (String(rawStage).includes('2') || String(rawStage).toLowerCase().includes('исслед')) stageId = 'stage_2';
        else if (String(rawStage).includes('3') || String(rawStage).toLowerCase().includes('мысл')) stageId = 'stage_3';
        else if (String(rawStage).includes('4') || String(rawStage).toLowerCase().includes('эруд')) stageId = 'stage_4';
        else if (String(rawStage).includes('5') || String(rawStage).includes('6') || String(rawStage).toLowerCase().includes('искат')) stageId = 'stage_5';
        else if (String(rawStage).toLowerCase().includes('продлен') || String(rawStage).toLowerCase().includes('созид')) stageId = 'stage_extended';

        const matchedStage = stages.find((s) => s.id === stageId);
        const fullClassName = matchedStage ? `${matchedStage.name} «${matchedStage.badge}»` : String(rawStage);

        return {
          id: `imp_${Date.now()}_${idx}`,
          name: String(name).trim(),
          class: fullClassName,
          stageId,
          birthDate: String(birthDate).trim(),
          parentName: String(parentName).trim(),
          parentPhone: String(parentPhone).trim(),
          dietaryNeeds: String(dietaryNeeds).trim(),
          avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
          status: 'present_ontime',
          arrivalTime: '08:30',
          curatorName: matchedStage?.curatorName || 'Анна Сергеевна Воронова',
          room: matchedStage?.room || 'Кабинет 204',
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
        };
      });

      setImportParsedStudents(parsed);
      setImportFileName(file.name);
      setShowImportModal(true);
    } catch {
      addNotification('Ошибка при чтении файла. Убедитесь, что это корректный .xlsx или .csv файл.');
    } finally {
      e.target.value = '';
    }
  };

  // 3. Confirm Import
  const handleConfirmImport = () => {
    if (importParsedStudents.length === 0) return;
    batchAddStudents(importParsedStudents as Student[]);
    setShowImportModal(false);
    setImportParsedStudents([]);
  };

  // 4. Save Student (Add / Edit)
  const handleSaveStudent = () => {
    if (!editingStudent?.name?.trim()) {
      addNotification('Укажите ФИО ученика');
      return;
    }
    if (!editingStudent?.birthDate?.trim()) {
      addNotification('Укажите дату рождения (пароль родителя)');
      return;
    }
    if (!editingStudent?.parentPhone?.trim()) {
      addNotification('Укажите номер телефона родителя (логин)');
      return;
    }

    const matchedStage = stages.find((s) => s.id === editingStudent.stageId) || stages[1];
    const fullClass = `${matchedStage.name} «${matchedStage.badge}»`;

    const studentToSave: Student = {
      id: editingStudent.id || `s_${Date.now()}`,
      name: editingStudent.name.trim(),
      class: fullClass,
      stageId: matchedStage.id,
      birthDate: editingStudent.birthDate.trim(),
      parentName: editingStudent.parentName?.trim() || 'Родитель',
      parentPhone: editingStudent.parentPhone.trim(),
      dietaryNeeds: editingStudent.dietaryNeeds?.trim() || 'Общий стол',
      avatar: editingStudent.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
      status: editingStudent.status || 'present_ontime',
      arrivalTime: editingStudent.arrivalTime || '08:30',
      curatorName: matchedStage.curatorName,
      room: matchedStage.room,
      pickup: editingStudent.pickup || { person: 'mom', updatedAt: 'Сегодня' },
      homework: editingStudent.homework || {
        stageClass: { completed: true, notes: 'В классе выполнено', teacherName: matchedStage.curatorName, updatedAt: '14:45' },
        stageExtended: { completed: true, notes: 'На продленке проверено', teacherName: 'Дежурный педагог', updatedAt: '16:40' },
        finalStatus: 'all_done'
      },
      attendanceStats: editingStudent.attendanceStats || {
        monthName: 'Ноябрь',
        totalDays: 22,
        presentOnTime: 20,
        lateDays: 0,
        sickDays: 0,
        parentMissedDays: 0,
        lateDetails: []
      }
    };

    addOrUpdateStudent(studentToSave);
    setEditingStudent(null);
  };

  // 5. Generate Text for Access Cards (to send in chat)
  const generateAccessCardsText = () => {
    const list = filteredStudents;
    const stageLabel = selectedStageId === 'all' ? 'Все ступени' : stages.find((s) => s.id === selectedStageId)?.name || '';
    let text = `ЧАСТНАЯ ШКОЛА «ГРАНИ» • ДОСТУПЫ В МОБИЛЬНОЕ ПРИЛОЖЕНИЕ\n`;
    text += `Ссылка для входа: https://kristofvrn.github.io/grani-app/\n`;
    text += `Класс: ${stageLabel}\n`;
    text += `----------------------------------------\n\n`;

    list.forEach((st, i) => {
      text += `${i + 1}. Ученик: ${st.name} (${st.class})\n`;
      text += `   Родитель: ${st.parentName}\n`;
      text += `   📱 Логин (телефон): ${st.parentPhone}\n`;
      text += `   🔑 Пароль (дата рождения): ${st.birthDate || 'не указана'}\n\n`;
    });

    return text;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-[#241738] via-[#371d59] to-[#4e1984] rounded-3xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full">
              Контингент & Доступы
            </span>
            <span className="text-xs text-purple-200">г. Воронеж</span>
          </div>
          <h2 className="text-xl font-black text-[#f7f8ea] leading-tight">
            Управление классами, учениками и сотрудниками
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            Поименное редактирование каждого класса, массовая загрузка из Excel и генерация логинов (номеров телефонов) и паролей (дат рождения) для родителей.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-purple-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            title="Загрузить список учеников из файла Excel или CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Загрузить Excel</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 border border-white/20 transition"
            title="Скачать образец таблицы Excel с правильными колонками"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Шаблон (.xlsx)</span>
          </button>

          <button
            onClick={() => setShowAccessCardsModal(true)}
            className="px-3 py-2 bg-purple-600/60 hover:bg-purple-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 border border-purple-400/40 transition"
            title="Посмотреть и распечатать логины и пароли родителей"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Карточки доступов</span>
          </button>

          <button
            onClick={() => {
              setIsNewStudent(true);
              setEditingStudent({
                id: `s_${Date.now()}`,
                name: '',
                stageId: selectedStageId === 'all' ? 'stage_1' : selectedStageId,
                birthDate: '15.05.2016',
                parentName: '',
                parentPhone: '+7 (9',
                dietaryNeeds: 'Общий стол'
              });
            }}
            className="px-3 py-2 bg-white hover:bg-slate-100 active:scale-95 text-purple-950 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow transition"
          >
            <UserPlus className="w-4 h-4 text-purple-700" />
            <span>+ Ученик</span>
          </button>
        </div>
      </div>

      {/* Main Section Toggle: Students vs Staff */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveMainSection('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeMainSection === 'students'
              ? 'bg-[#4e1984] text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ученики и родители ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveMainSection('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeMainSection === 'staff'
              ? 'bg-[#4e1984] text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Преподаватели и сотрудники ({staffMembers.length})</span>
        </button>
      </div>

      {/* SECTION 1: STUDENTS & CLASSES */}
      {activeMainSection === 'students' && (
        <div className="space-y-3">
          {/* Class / Stage Selector Bar (7 Official Stages) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedStageId('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedStageId === 'all'
                  ? 'bg-[#241738] text-amber-200 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Все ступени ({students.length})
            </button>
            {stages.map((stg) => {
              const countInStage = students.filter((s) => s.stageId === stg.id).length;
              const isSelected = selectedStageId === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setSelectedStageId(stg.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#241738] text-amber-200 shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{stg.badge || stg.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-400 text-purple-950' : 'bg-slate-100 text-slate-600'}`}>
                    {countInStage}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск ученика по имени, родителю, телефону или дате рождения..."
              className="flex-1 text-xs font-medium bg-transparent focus:outline-none text-slate-900"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Students Grid / Cards */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-sm text-slate-700">В этом классе пока нет учеников</div>
              <p className="text-xs text-slate-400 mt-1">
                Нажмите «+ Ученик» или «Загрузить Excel», чтобы добавить детей в этот класс.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-3 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm text-slate-900 truncate">{st.name}</div>
                        <div className="text-[11px] font-semibold text-[#4e1984] truncate">{st.class}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>Родитель:</span>
                          <strong className="text-slate-700">{st.parentName || 'Не указан'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          const info = `Ученик: ${st.name}\nРодитель: ${st.parentName}\nЛогин: ${st.parentPhone}\nПароль: ${st.birthDate || '—'}`;
                          copyToClipboard(info, `Доступы для ${st.name} скопированы!`);
                        }}
                        className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition"
                        title="Скопировать логин и пароль"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setIsNewStudent(false);
                          setEditingStudent(st);
                        }}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                        title="Редактировать ученика"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Удалить ученика ${st.name} из класса?`)) {
                            deleteStudent(st.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                        title="Удалить ученика"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Credentials & Diet Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-100 flex flex-col">
                      <span className="text-[10px] font-bold text-purple-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-purple-600" />
                        <span>Логин (Телефон):</span>
                      </span>
                      <strong className="text-purple-950 font-mono text-[11px] truncate mt-0.5">
                        {st.parentPhone}
                      </strong>
                    </div>

                    <div className="bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 flex flex-col">
                      <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Пароль (Д/Р):</span>
                      </span>
                      <strong className="text-amber-950 font-mono text-[11px] truncate mt-0.5">
                        {st.birthDate || 'не указана'}
                      </strong>
                    </div>
                  </div>

                  {/* Dietary info */}
                  {st.dietaryNeeds && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Utensils className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">Питание: <strong>{st.dietaryNeeds}</strong></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: STAFF & TEACHERS */}
      {activeMainSection === 'staff' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-800">
              Список преподавателей и администрации ({staffMembers.length})
            </h3>
            <button
              onClick={() => {
                setIsNewStaff(true);
                setEditingStaff({
                  id: `st_${Date.now()}`,
                  name: '',
                  role: 'Преподаватель',
                  location: 'Кабинет 204',
                  phone: '+7 (903) 858-',
                  password: 'grani2026',
                  status: 'inside',
                  checkInTime: '08:00',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                });
              }}
              className="px-3 py-1.5 bg-[#4e1984] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Сотрудник</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStaff.map((st) => (
              <div
                key={st.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-slate-900 truncate">{st.name}</div>
                      <div className="text-[11px] font-semibold text-purple-700 truncate">{st.role}</div>
                      <div className="text-[11px] text-slate-500 truncate">{st.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIsNewStaff(false);
                        setEditingStaff(st);
                      }}
                      className="p-1.5 rounded-lg bg-purple-50 text-purple-700"
                      title="Редактировать"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить сотрудника ${st.name}?`)) {
                          deleteStaffMember(st.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Login & Password Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Логин (Телефон):</span>
                    <strong className="text-slate-900 font-mono text-[11px] truncate block">{st.phone}</strong>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-800 block">Пароль сотрудника:</span>
                    <strong className="text-amber-950 font-mono text-[11px] truncate block">
                      {st.password || 'grani2026'}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT STUDENT */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {isNewStudent ? 'Добавление нового ученика' : 'Редактирование данных ученика'}
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ФИО ученика *</label>
                <input
                  type="text"
                  value={editingStudent.name || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  placeholder="Иванов Иван Алексеевич"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Дата рождения ребенка (Пароль родителя) *</span>
                  <span className="text-purple-700 font-normal">Формат: ДД.ММ.ГГГГ</span>
                </label>
                <input
                  type="text"
                  value={editingStudent.birthDate || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, birthDate: e.target.value })}
                  placeholder="14.05.2016"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold text-purple-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ступень познания (Класс) *</label>
                <select
                  value={editingStudent.stageId || 'stage_1'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, stageId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium text-slate-900"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} «{s.badge}»
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-900 block mb-2 text-xs">Данные родителя:</span>
                
                <div className="space-y-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ФИО родителя</label>
                    <input
                      type="text"
                      value={editingStudent.parentName || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                      placeholder="Иванова Елена Сергеевна (мама)"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Номер телефона родителя (Логин для входа) *</span>
                    </label>
                    <input
                      type="tel"
                      value={editingStudent.parentPhone || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      placeholder="+7 (903) 858-12-34"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold text-purple-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Особенности питания и аллергии</label>
                <input
                  type="text"
                  value={editingStudent.dietaryNeeds || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, dietaryNeeds: e.target.value })}
                  placeholder="Общий стол / Без лактозы / Аллергия на мед"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveStudent}
                className="px-5 py-2 rounded-xl bg-[#4e1984] text-white font-bold text-xs shadow-md"
              >
                Сохранить ученика
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ACCESS CARDS FOR PARENTS */}
      {showAccessCardsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-black">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    Карточки доступов для родителей
                  </h3>
                  <p className="text-xs text-slate-500">
                    Логин — номер телефона, пароль — дата рождения ребенка
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAccessCardsModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick action bar inside modal */}
            <div className="flex items-center justify-between gap-2 bg-purple-50 p-3 rounded-2xl border border-purple-100">
              <span className="text-xs text-purple-900 font-medium">
                Показано учеников: <strong>{filteredStudents.length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = generateAccessCardsText();
                    copyToClipboard(text, 'Памятка со всеми логинами и паролями скопирована в буфер!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Скопировать для чата</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-purple-900 font-bold text-xs flex items-center gap-1 border border-purple-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Печать</span>
                </button>
              </div>
            </div>

            {/* Access Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredStudents.map((st, idx) => (
                <div
                  key={st.id}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-purple-700 font-medium">{st.class}</div>
                      <div className="text-xs text-slate-600">Родитель: {st.parentName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Логин (телефон):</span>
                      <strong className="text-purple-950 font-mono">{st.parentPhone}</strong>
                    </div>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Пароль (Д/Р):</span>
                      <strong className="text-amber-800 font-mono">{st.birthDate || 'не указана'}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EXCEL IMPORT PREVIEW */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  Предварительный просмотр импорта ({importParsedStudents.length} строк)
                </h3>
                <p className="text-xs text-purple-700 font-medium mt-0.5">
                  Файл: {importFileName}
                </p>
              </div>

              <button
                onClick={() => setShowImportModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                Проверьте распознанные данные. После подтверждения все ученики будут добавлены в выбранные классы, а для их родителей будут созданы учетные записи для входа.
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 sticky top-0 text-slate-700 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">ФИО ученика</th>
                    <th className="p-2.5">Класс</th>
                    <th className="p-2.5">Д/Р (Пароль)</th>
                    <th className="p-2.5">Родитель</th>
                    <th className="p-2.5">Телефон (Логин)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importParsedStudents.map((st, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{st.name}</td>
                      <td className="p-2.5 text-purple-800">{st.class}</td>
                      <td className="p-2.5 font-mono text-amber-800 font-bold">{st.birthDate}</td>
                      <td className="p-2.5 text-slate-700">{st.parentName}</td>
                      <td className="p-2.5 font-mono text-purple-950 font-bold">{st.parentPhone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-xl bg-[#4e1984] hover:bg-[#3d1266] text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Импортировать {importParsedStudents.length} учеников</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT STAFF */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {isNewStaff ? 'Новый сотрудник' : 'Редактирование сотрудника'}
              </h3>
              <button onClick={() => setEditingStaff(null)} className="p-1.5 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ФИО сотрудника *</label>
                <input
                  type="text"
                  value={editingStaff.name || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  placeholder="Соколова Ольга Васильевна"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Должность / Роль *</label>
                <input
                  type="text"
                  value={editingStaff.role || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  placeholder="Куратор ступени 1 / Педагог продленки"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Номер телефона (Логин для входа) *</label>
                <input
                  type="tel"
                  value={editingStaff.phone || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                  placeholder="+7 (903) 858-01-12"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold text-purple-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Пароль сотрудника *</label>
                <input
                  type="text"
                  value={editingStaff.password || 'grani2026'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Кабинет / Локация</label>
                <input
                  type="text"
                  value={editingStaff.location || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, location: e.target.value })}
                  placeholder="Кабинет 204 «Космос»"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (!editingStaff.name?.trim() || !editingStaff.phone?.trim()) {
                    addNotification('Заполните ФИО и номер телефона');
                    return;
                  }
                  addOrUpdateStaffMember(editingStaff as StaffMember);
                  setEditingStaff(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#4e1984] text-white font-bold text-xs"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
