import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Phone, ChevronDown, Check, CheckCheck, X, User, LogOut, Eye, Camera, Loader2 } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { PersonAvatar } from './PersonAvatar';
import { uploadAvatarImage } from '../utils/imageUpload';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    logout,
    currentStudent,
    students,
    setSelectedStudentId,
    updateStudentAvatar,
    parentAlerts,
    markAlertRead,
    markAllAlertsRead,
    addNotification,
    bookings
  } = useApp();

  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminPreview, setShowAdminPreview] = useState(false);
  const [isUploadingChildPhoto, setIsUploadingChildPhoto] = useState(false);
  const childPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleChildPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentStudent) return;
    setIsUploadingChildPhoto(true);
    try {
      const { url } = await uploadAvatarImage(file);
      updateStudentAvatar(currentStudent.id, url);
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Не удалось загрузить фотографию');
    } finally {
      setIsUploadingChildPhoto(false);
      e.target.value = '';
    }
  };

  const studentAlerts = parentAlerts.filter((a) => a.studentId === currentStudent?.id);
  const unreadCount = studentAlerts.filter((a) => !a.read).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  const todayFormatted = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getRoleHeaderInfo = () => {
    switch (role) {
      case 'parent':
        return {
          title: 'Кабинет Родителя',
          subtitle: 'Ступени познания • Спокойствие и сервис'
        };
      case 'curator':
        return {
          title: 'Кабинет Куратора ступени',
          subtitle: 'Ступень познания 1 «Первооткрыватели» • Урок 1 & ДЗ'
        };
      case 'extended_teacher':
        return {
          title: 'Кабинет Педагога продленки',
          subtitle: 'Группа продленного дня • Доделывание Д/З после 15:00'
        };
      case 'admin':
        return {
          title: 'Панель Руководителя / Супер-админ',
          subtitle: 'Полное управление • Ступени, меню, 13 специалистов'
        };
      default:
        return {
          title: 'Кабинет Центра «Грани»',
          subtitle: 'Образовательный центр'
        };
    }
  };

  const info = getRoleHeaderInfo();

  return (
    <>
      <div className="bg-gradient-to-b from-[#3d1266] via-[#4e1984] to-[#5a2296] text-white px-4 pt-3 pb-4 shadow-lg shrink-0 rounded-b-[26px] relative z-30">
        {/* Top row with Logo and Quick Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f7f8ea] p-1 flex items-center justify-center shadow-md shrink-0">
              <img src="./logo_icon.png" alt="Грани" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-[#f7f8ea]">ГРАНИ</span>
                <span className="text-[10px] uppercase font-bold bg-[#f7f8ea]/20 px-1.5 py-0.5 rounded text-amber-200">
                  центр
                </span>
              </div>
              <p className="text-[11px] text-white/80 leading-none">{info.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* Quick Call to Reception */}
            <a
              href="tel:+79038586328"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center"
              title="Позвонить в центр: +7 (903) 858-63-28"
              onClick={() => addNotification('Вызов в приемную центра «Грани»: +7 (903) 858-63-28')}
            >
              <Phone className="w-4 h-4 text-emerald-300" />
            </a>

            {/* Notifications button */}
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition relative"
              title="Уведомления"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-amber-400 text-[#241c30] rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-[#4e1984]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Admin Preview Mode Switcher (only for admin) */}
            {currentUser?.role === 'admin' && (
              <div className="relative">
                <button
                  onClick={() => setShowAdminPreview(!showAdminPreview)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-xs font-bold transition"
                  title="Режим предпросмотра ролей"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline text-[11px]">Вид</span>
                </button>

                {showAdminPreview && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1e1330] text-white rounded-2xl shadow-2xl border border-purple-400/30 p-2 z-50 space-y-1 text-xs">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-amber-300 border-b border-white/10">
                      Режим предпросмотра:
                    </div>
                    <button
                      onClick={() => {
                        setRole('admin');
                        setShowAdminPreview(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === 'admin' ? 'bg-[#4e1984] text-white font-bold' : 'hover:bg-white/10 text-purple-200'
                      }`}
                    >
                      <span>Руководитель</span>
                      {role === 'admin' && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </button>
                    <button
                      onClick={() => {
                        setRole('parent');
                        setShowAdminPreview(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === 'parent' ? 'bg-[#4e1984] text-white font-bold' : 'hover:bg-white/10 text-purple-200'
                      }`}
                    >
                      <span>Родитель</span>
                      {role === 'parent' && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </button>
                    <button
                      onClick={() => {
                        setRole('curator');
                        setShowAdminPreview(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === 'curator' ? 'bg-[#4e1984] text-white font-bold' : 'hover:bg-white/10 text-purple-200'
                      }`}
                    >
                      <span>Куратор ступени</span>
                      {role === 'curator' && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </button>
                    <button
                      onClick={() => {
                        setRole('extended_teacher');
                        setShowAdminPreview(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        role === 'extended_teacher' ? 'bg-[#4e1984] text-white font-bold' : 'hover:bg-white/10 text-purple-200'
                      }`}
                    >
                      <span>Педагог продленки</span>
                      {role === 'extended_teacher' && <Check className="w-3.5 h-3.5 text-amber-300" />}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Info */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15 border border-white/20 text-white text-xs font-semibold relative"
              title={currentUser?.roleTitle || 'Пользователь'}
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span className="max-w-[85px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Гость'}
              </span>
              {currentUser?.role === 'admin' && pendingBookingsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" title={`Новых заявок: ${pendingBookingsCount}`} />
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (confirm('Вы действительно хотите выйти из приложения?')) {
                  logout();
                }
              }}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 transition"
              title="Выйти из учетной записи"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
            </button>

            {/* Notifications Dropdown */}
            {showAlerts && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#26163b] text-white rounded-2xl shadow-2xl border border-white/20 p-3 z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-amber-200">Уведомления</span>
                  <div className="flex items-center gap-1.5">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAlertsRead}
                        className="text-[10px] text-emerald-300 hover:underline flex items-center gap-0.5"
                      >
                        <CheckCheck className="w-3 h-3" /> Прочитать все
                      </button>
                    )}
                    <button onClick={() => setShowAlerts(false)} className="text-white/60 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {studentAlerts.length === 0 ? (
                  <div className="text-xs text-white/60 py-3 text-center">Уведомлений пока нет</div>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {studentAlerts.map((al) => (
                      <div
                        key={al.id}
                        onClick={() => markAlertRead(al.id)}
                        className={`p-2 rounded-xl text-xs cursor-pointer transition ${
                          al.read ? 'bg-white/5 text-white/70' : 'bg-[#4e1984] text-white border border-amber-300/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px]">{al.title}</span>
                          <span className="text-[9px] text-white/60">{al.createdAt}</span>
                        </div>
                        <p className="text-[11px] mt-0.5 leading-snug text-white/90">{al.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* For Parent: Active Child Card & Switcher */}
        {role === 'parent' && currentStudent && (
          <div className="relative mt-2">
            <input
              ref={childPhotoInputRef}
              type="file"
              accept="image/*"
              onChange={handleChildPhotoUpload}
              className="hidden"
            />
            <div className="w-full bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between gap-2.5 border border-white/15 transition">
              <button
                type="button"
                disabled={isUploadingChildPhoto}
                onClick={() => childPhotoInputRef.current?.click()}
                title="Нажмите, чтобы загрузить или обновить фото ребенка"
                className="relative shrink-0 active:scale-95 transition disabled:opacity-70"
              >
                <PersonAvatar
                  src={currentStudent.avatar}
                  name={currentStudent.name}
                  className="w-11 h-11 rounded-full ring-2 ring-amber-300/70 shadow"
                  textClassName="text-sm"
                />
                {isUploadingChildPhoto && (
                  <span className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </span>
                )}
                <span
                  className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-[#4e1984] ${
                    currentStudent.status === 'present_ontime'
                      ? 'bg-emerald-400'
                      : currentStudent.status === 'late'
                      ? 'bg-amber-400'
                      : currentStudent.status === 'absent_sick'
                      ? 'bg-sky-400'
                      : 'bg-rose-400'
                  }`}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-[#241c30] flex items-center justify-center ring-2 ring-[#4e1984] shadow">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                className="flex-1 flex items-center justify-between gap-2 min-w-0 text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-[#f7f8ea]">{currentStudent.name}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold text-amber-200">
                      {currentStudent.class}
                    </span>
                  </div>
                  <div className="text-xs text-white/90 mt-0.5 leading-snug">
                    <span>
                      {currentStudent.status === 'present_ontime'
                        ? `В центре с ${currentStudent.arrivalTime} • ${currentStudent.room}`
                        : currentStudent.status === 'late'
                        ? `Прибыл в ${currentStudent.arrivalTime} (опоздание)`
                        : currentStudent.status === 'absent_sick'
                        ? 'Болеет (дома)'
                        : 'Отсутствует'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs font-medium pr-1 shrink-0">
                  <span>Сменить</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            {/* Child Dropdown */}
            {showStudentDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#26163b] rounded-2xl shadow-2xl border border-white/20 p-2 z-40">
                <div className="text-[11px] font-semibold text-white/60 px-2 py-1 uppercase tracking-wider">
                  Выберите ребенка для просмотра:
                </div>
                <div className="space-y-1">
                  {students.slice(0, 6).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setShowStudentDropdown(false);
                        addNotification(`Выбран ученик: ${s.name}`);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                        currentStudent.id === s.id ? 'bg-[#4e1984] text-white' : 'hover:bg-white/10 text-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PersonAvatar src={s.avatar} name={s.name} className="w-7 h-7 rounded-full" textClassName="text-[10px]" />
                        <div>
                          <div className="text-xs font-bold">{s.name}</div>
                          <div className="text-[10px] text-white/70">{s.class}</div>
                        </div>
                      </div>
                      {currentStudent.id === s.id && <Check className="w-4 h-4 text-amber-300" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* For Staff: Subtitle banner */}
        {role !== 'parent' && (
          <div className="mt-1 text-xs text-purple-100/90 flex items-center justify-between bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <span>{info.subtitle}</span>
            <span className="font-semibold text-amber-300 capitalize">{todayFormatted}</span>
          </div>
        )}
      </div>

      {/* Global Auth Modal */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
