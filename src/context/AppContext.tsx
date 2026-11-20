import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserRole,
  AuthUser,
  Student,
  AttendanceStatus,
  PickupPersonType,
  DayMenu,
  Invoice,
  ClubSubscription,
  SchoolPost,
  StaffShift,
  StaffMember,
  ParentAlert,
  WeeklyScheduleDay,
  SchoolStage,
  ConsultationSpecialist,
  ConsultationBooking,
  HomeworkStageInfo,
  EnrolledClubStudent,
  ClubEnrollmentType,
  TrialFeedbackStatus,
  ShiftHandoff
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STAGES,
  INITIAL_SPECIALISTS,
  INITIAL_BOOKINGS,
  INITIAL_STUDENTS,
  INITIAL_MENU,
  INITIAL_WEEKLY_MENU,
  INITIAL_INVOICES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_POSTS,
  INITIAL_SHIFTS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_ALERTS,
  WEEKLY_SCHEDULE,
  INITIAL_SHIFT_HANDOFF
} from '../data/initialData';
import { fetchSyncedState, pushStateKey } from '../api/syncApi';


export function pluralizePortions(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${n} порций`;
  if (mod10 === 1) return `${n} порция`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} порции`;
  return `${n} порций`;
}

export function pluralizeApplications(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${n} заявок`;
  if (mod10 === 1) return `${n} заявка`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} заявки`;
  return `${n} заявок`;
}

interface AppContextType {
  // Auth
  currentUser: AuthUser | null;
  role: UserRole;
  login: (loginOrRole: string, password?: string) => boolean;
  logout: () => void;
  users: AuthUser[];

  // Student selection
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  students: Student[];
  currentStudent: Student;

  // Stages & Specialists
  stages: SchoolStage[];
  specialists: ConsultationSpecialist[];
  bookings: ConsultationBooking[];
  addConsultationBooking: (data: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: ConsultationBooking['status'], confirmedDateTime?: string, confirmedRoom?: string, notes?: string) => void;

  // School data
  menu: DayMenu;
  weeklyMenu: DayMenu[];
  invoices: Invoice[];
  subscriptions: ClubSubscription[];
  posts: SchoolPost[];
  shifts: StaffShift[];
  staffMembers: StaffMember[];
  parentAlerts: ParentAlert[];
  weeklySchedule: WeeklyScheduleDay[];
  notifications: string[];
  isSynced: boolean;
  shiftHandoff: ShiftHandoff | null;
  handoverShift: (notes: string, toStaffName?: string) => void;
  reportParentAbsence: (studentId: string, type: 'sick' | 'family' | 'late', expectedTime?: string, reason?: string) => void;

  // Core Actions
  addNotification: (msg: string) => void;
  clearNotification: (idx: number) => void;
  setRole: (role: UserRole) => void;
  updateAttendance: (
    studentId: string,
    status: AttendanceStatus,
    arrivalTime?: string,
    missedSubject?: string,
    comment?: string
  ) => void;
  updatePickup: (person: PickupPersonType, customName?: string, phone?: string) => void;
  updateTwoStageHomework: (
    studentId: string,
    stage: 'class' | 'extended',
    data: Partial<HomeworkStageInfo>,
    finalStatus?: 'all_done' | 'needs_home_finish',
    homeTaskRemaining?: string
  ) => void;
  toggleClubStatus: (clubId: string, status: 'active' | 'cancelled' | 'rescheduled', reason?: string) => void;
  enrollStudentInClub: (clubId: string, studentId: string, enrollmentType?: ClubEnrollmentType, notes?: string) => void;
  convertTrialToRegular: (clubId: string, studentId: string) => void;
  declineClubAfterTrial: (clubId: string, studentId: string) => void;
  cancelClubEnrollment: (clubId: string, studentId: string) => void;
  updateStudentClubDispatch: (clubId: string, studentId: string, status: 'waiting' | 'sent' | 'cancelled', teacherName?: string) => void;
  sendAllStudentsToClub: (clubId: string, teacherName?: string) => void;
  payInvoice: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'status' | 'invoiceNumber'>) => void;
  togglePostLike: (postId: string) => void;
  addPost: (post: Omit<SchoolPost, 'id' | 'time' | 'likes' | 'isLiked' | 'comments'>) => void;
  addPostComment: (postId: string, text: string) => void;
  addOvertimeShift: (hours: number, reason: string) => void;
  approveShift: (shiftId: string) => void;
  toggleStaffPresence: (staffId: string) => void;
  sendDebtorReminder: (invoiceId: string) => void;
  sendAllDebtorsReminder: () => void;
  updateDayMenu: (dayMenu: DayMenu) => void;
  updateWeeklyScheduleAndMenu: (schedule: WeeklyScheduleDay[], menuDays: DayMenu[]) => void;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;

  // Super-Admin CRUD
  addOrUpdateStage: (stage: SchoolStage) => void;
  deleteStage: (stageId: string) => void;
  addOrUpdateSpecialist: (spec: ConsultationSpecialist) => void;
  deleteSpecialist: (specId: string) => void;
  addOrUpdateClub: (club: ClubSubscription) => void;
  deleteClub: (clubId: string) => void;
  addOrUpdateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('grani_user_session_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0];
  });

  const [role, setRoleState] = useState<UserRole>(() => currentUser?.role || 'parent');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s1');

  // Stages & Specialists
  const [stages, setStages] = useState<SchoolStage[]>(() => {
    const s = localStorage.getItem('grani_stages');
    return s ? JSON.parse(s) : INITIAL_STAGES;
  });

  const [specialists, setSpecialists] = useState<ConsultationSpecialist[]>(() => {
    const s = localStorage.getItem('grani_specialists');
    return s ? JSON.parse(s) : INITIAL_SPECIALISTS;
  });

  const [bookings, setBookings] = useState<ConsultationBooking[]>(() => {
    const s = localStorage.getItem('grani_bookings');
    return s ? JSON.parse(s) : INITIAL_BOOKINGS;
  });

  // School Entities
  const [students, setStudents] = useState<Student[]>(() => {
    const s = localStorage.getItem('grani_students_v3');
    if (!s) return INITIAL_STUDENTS;
    try {
      const parsed: Student[] = JSON.parse(s);
      return parsed.map((item) => {
        const init = INITIAL_STUDENTS.find((x) => x.id === item.id);
        return {
          ...item,
          dietaryNeeds: item.dietaryNeeds || init?.dietaryNeeds || 'Общий стол',
          stageId: item.stageId || init?.stageId || 'stage_1'
        };
      });
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [menu, setMenu] = useState<DayMenu>(() => {
    const s = localStorage.getItem('grani_menu');
    return s ? JSON.parse(s) : INITIAL_MENU;
  });

  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>(() => {
    const s = localStorage.getItem('grani_weekly_menu');
    return s ? JSON.parse(s) : INITIAL_WEEKLY_MENU;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const s = localStorage.getItem('grani_invoices');
    return s ? JSON.parse(s) : INITIAL_INVOICES;
  });

  const [subscriptions, setSubscriptions] = useState<ClubSubscription[]>(() => {
    const s = localStorage.getItem('grani_clubs_v3');
    return s ? JSON.parse(s) : INITIAL_SUBSCRIPTIONS;
  });

  const [posts, setPosts] = useState<SchoolPost[]>(() => {
    const s = localStorage.getItem('grani_posts');
    return s ? JSON.parse(s) : INITIAL_POSTS;
  });

  const [shifts, setShifts] = useState<StaffShift[]>(() => {
    const s = localStorage.getItem('grani_shifts');
    return s ? JSON.parse(s) : INITIAL_SHIFTS;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const s = localStorage.getItem('grani_staff');
    return s ? JSON.parse(s) : INITIAL_STAFF_MEMBERS;
  });

  const [parentAlerts, setParentAlerts] = useState<ParentAlert[]>(() => {
    const s = localStorage.getItem('grani_alerts_v3');
    return s ? JSON.parse(s) : INITIAL_ALERTS;
  });

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleDay[]>(() => {
    const s = localStorage.getItem('grani_schedule');
    return s ? JSON.parse(s) : WEEKLY_SCHEDULE;
  });

  const [notifications, setNotifications] = useState<string[]>([]);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  // Shift Handoff in 15:00 (Requirement 2.4)
  const [shiftHandoff, setShiftHandoff] = useState<ShiftHandoff | null>(() => INITIAL_SHIFT_HANDOFF);

  // Parent Absence Notice (Requirement 2.2)
  const reportParentAbsence = useCallback((
    studentId: string,
    type: 'sick' | 'family' | 'late',
    expectedTime?: string,
    reason?: string
  ) => {
    const timeNow = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        let newStatus: AttendanceStatus = 'present_ontime';
        if (type === 'sick') newStatus = 'absent_sick';
        if (type === 'family') newStatus = 'absent_parent';
        if (type === 'late') newStatus = 'late';

        return {
          ...s,
          status: newStatus,
          arrivalTime: type === 'late' ? (expectedTime || '10:00') : '',
          missedSubjectToday: type === 'late' ? 'Русский язык (1-й урок)' : 'Все уроки за день',
          parentAbsenceNotice: {
            type,
            expectedTime: type === 'late' ? expectedTime : undefined,
            reason: reason || (type === 'sick' ? 'Заболели, лечимся дома' : type === 'family' ? 'Семейные обстоятельства' : 'Опоздание'),
            reportedAt: `Сегодня, ${timeNow}`
          }
        };
      })
    );

    const desc = type === 'sick' ? '«Не придем (болеем)»' : type === 'family' ? '«Не придем (по семейным обстоятельствам)»' : `«Опоздаем к ${expectedTime || '10:00'}»`;
    setNotifications((prev) => [...prev, `Уведомление от родителя отправлено куратору и на пищеблок: ${desc}`]);
  }, []);

  const handoverShift = useCallback((notes: string, toStaffName?: string) => {
    const timeNow = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const handoff: ShiftHandoff = {
      date: 'Сегодня',
      time: timeNow,
      fromStaffName: currentUser?.name || 'Анна Сергеевна Воронова (Куратор 1 ступени)',
      toStaffName: toStaffName || 'Марина Игоревна Светлова (Педагог продленки)',
      notes: notes || 'Смена передана на продленку. Дети накормлены обедом, ДЗ в классе проверено.',
      confirmed: true
    };
    setShiftHandoff(handoff);
    setNotifications((prev) => [...prev, `Смена успешно передана в ${timeNow} педагогу продленки (${handoff.toStaffName})`]);
  }, [currentUser]);

  // Notifications
  const addNotification = useCallback((msg: string) => {
    setNotifications((prev) => [...prev, msg]);
  }, []);

  const clearNotification = useCallback((idx: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // Sync with Pi server on mount
  useEffect(() => {
    async function syncFromServer() {
      try {
        const remote = await fetchSyncedState();
        if (remote && remote.state) {
          const st = remote.state as Record<string, any>;
          if (st.students) setStudents(st.students);
          if (st.stages) setStages(st.stages);
          if (st.specialists) setSpecialists(st.specialists);
          if (st.bookings) setBookings(st.bookings);
          if (st.menu) setMenu(st.menu);
          if (st.weeklyMenu) setWeeklyMenu(st.weeklyMenu);
          if (st.invoices) setInvoices(st.invoices);
          if (st.subscriptions) setSubscriptions(st.subscriptions);
          if (st.posts) setPosts(st.posts);
          if (st.shifts) setShifts(st.shifts);
          if (st.staffMembers) setStaffMembers(st.staffMembers);
          if (st.parentAlerts) setParentAlerts(st.parentAlerts);
          if (st.weeklySchedule) setWeeklySchedule(st.weeklySchedule);
          setIsSynced(true);
        }
      } catch {
        // Fallback to local
      }
    }
    syncFromServer();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('grani_students_v3', JSON.stringify(students));
    pushStateKey('students', students).catch(() => {});
  }, [students]);

  useEffect(() => {
    localStorage.setItem('grani_stages', JSON.stringify(stages));
    pushStateKey('stages', stages).catch(() => {});
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('grani_specialists', JSON.stringify(specialists));
    pushStateKey('specialists', specialists).catch(() => {});
  }, [specialists]);

  useEffect(() => {
    localStorage.setItem('grani_bookings', JSON.stringify(bookings));
    pushStateKey('bookings', bookings).catch(() => {});
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('grani_clubs_v3', JSON.stringify(subscriptions));
    pushStateKey('subscriptions', subscriptions).catch(() => {});
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('grani_alerts_v3', JSON.stringify(parentAlerts));
    pushStateKey('parentAlerts', parentAlerts).catch(() => {});
  }, [parentAlerts]);

  useEffect(() => {
    localStorage.setItem('grani_weekly_menu_v3', JSON.stringify(weeklyMenu));
    pushStateKey('weeklyMenu', weeklyMenu).catch(() => {});
  }, [weeklyMenu]);

  // Auth Functions
  const login = useCallback((loginOrRole: string, _password?: string) => {
    const matched = INITIAL_USERS.find(
      (u) => u.login.toLowerCase() === loginOrRole.toLowerCase() || u.role === loginOrRole
    );
    if (matched) {
      setCurrentUser(matched);
      setRoleState(matched.role);
      if (matched.studentId) setSelectedStudentId(matched.studentId);
      localStorage.setItem('grani_user_session_v3', JSON.stringify(matched));
      addNotification(`Вы успешно вошли как: ${matched.roleTitle} (${matched.name})`);
      return true;
    }
    return false;
  }, [addNotification]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('grani_user_session_v3');
    addNotification('Вы вышли из учетной записи');
  }, [addNotification]);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    const matched = INITIAL_USERS.find((u) => u.role === newRole);
    if (matched) {
      setCurrentUser(matched);
      if (matched.studentId) setSelectedStudentId(matched.studentId);
      localStorage.setItem('grani_user_session_v3', JSON.stringify(matched));
    }
  }, []);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // 2. Attendance & Late Arrival
  const updateAttendance = useCallback((
    studentId: string,
    status: AttendanceStatus,
    arrivalTime: string = '08:30',
    missedSubject?: string,
    comment?: string
  ) => {
    const todayStr = 'Сегодня, 15 ноября';
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        const isLate = status === 'late';
        const isSick = status === 'absent_sick';
        const isParentMissed = status === 'absent_parent';

        const updatedStats = { ...s.attendanceStats };
        if (isLate) {
          updatedStats.lateDays += 1;
          updatedStats.lateDetails = [
            {
              date: todayStr,
              status: 'late',
              arrivalTime: arrivalTime,
              missedLessonsCount: 1,
              missedSubjects: missedSubject || 'Русский язык (1-й урок)',
              curatorComment: comment || 'Отмечено куратором ступени'
            },
            ...(updatedStats.lateDetails || [])
          ];
        } else if (isSick) {
          updatedStats.sickDays += 1;
        } else if (isParentMissed) {
          updatedStats.parentMissedDays += 1;
        } else {
          updatedStats.presentOnTime += 1;
        }

        return {
          ...s,
          status,
          arrivalTime,
          missedSubjectToday: isLate ? (missedSubject || 'Русский язык (1-й урок)') : undefined,
          attendanceStats: updatedStats
        };
      })
    );

    const st = students.find((s) => s.id === studentId);
    const sName = st ? st.name : 'Ребенок';

    if (status === 'late') {
      addNotification(`⏰ ${sName}: зафиксировано опоздание к ${arrivalTime}. Пропущен 1-й урок (${missedSubject || 'Русский язык'}).`);
      // Alert to parent
      const alert: ParentAlert = {
        id: `al_${Date.now()}`,
        studentId,
        title: `⏰ Опоздание на 1-й урок (${arrivalTime})`,
        message: `${sName} прибыл в школу в ${arrivalTime}. Пропущен 1-й урок: ${missedSubject || 'Русский язык'}. Пожалуйста, старайтесь приводить ребенка вовремя, чтобы не упускать материал.`,
        createdAt: 'Только что',
        read: false,
        type: 'safety'
      };
      setParentAlerts((prev) => [alert, ...prev]);
    } else if (status === 'present_ontime') {
      addNotification(`✓ ${sName}: вовремя на занятиях ступени (${arrivalTime})`);
    } else {
      addNotification(`Отметка для ${sName} сохранена`);
    }
  }, [students, addNotification]);

  // Pickup Info
  const updatePickup = useCallback((person: PickupPersonType, customName?: string, phone?: string) => {
    const timeStr = `Сегодня, ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudentId
          ? {
              ...s,
              pickup: {
                person,
                customName,
                phone,
                updatedAt: timeStr
              }
            }
          : s
      )
    );
    addNotification('Информация о том, кто забирает ребенка, передана охране и кураторам');
  }, [selectedStudentId, addNotification]);

  // 3. Two-Stage Homework (Curator in class + Extended Teacher on after-school)
  const updateTwoStageHomework = useCallback((
    studentId: string,
    stage: 'class' | 'extended',
    data: Partial<HomeworkStageInfo>,
    finalStatus?: 'all_done' | 'needs_home_finish',
    homeTaskRemaining?: string
  ) => {
    const nowTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const hw = { ...s.homework };
        if (stage === 'class') {
          hw.stageClass = {
            ...hw.stageClass,
            ...data,
            updatedAt: nowTime
          };
        } else {
          hw.stageExtended = {
            ...hw.stageExtended,
            ...data,
            updatedAt: nowTime
          };
        }
        if (finalStatus) hw.finalStatus = finalStatus;
        if (homeTaskRemaining !== undefined) hw.homeTaskRemaining = homeTaskRemaining;
        return { ...s, homework: hw };
      })
    );

    const st = students.find((s) => s.id === studentId);
    const sName = st ? st.name : 'Ребенок';
    addNotification(
      stage === 'class'
        ? `Куратор ступени обновил ДЗ в классе для ${sName}`
        : `Дежурный педагог продленки обновил ДЗ для ${sName}`
    );
  }, [students, addNotification]);

  // 4. Consultation Bookings
  const addConsultationBooking = useCallback((data: Omit<ConsultationBooking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: ConsultationBooking = {
      ...data,
      id: `b_${Date.now()}`,
      status: 'pending',
      createdAt: 'Сегодня, ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    setBookings((prev) => [newBooking, ...prev]);
    addNotification(`Заявка на прием к специалисту «${data.specialistTitle}» отправлена на согласование!`);
  }, [addNotification]);

  const updateBookingStatus = useCallback((
    id: string,
    status: ConsultationBooking['status'],
    confirmedDateTime?: string,
    confirmedRoom?: string,
    notes?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status,
              confirmedDateTime: confirmedDateTime || b.confirmedDateTime,
              confirmedRoom: confirmedRoom || b.confirmedRoom,
              curatorNotes: notes || b.curatorNotes
            }
          : b
      )
    );
    const b = bookings.find((x) => x.id === id);
    if (b) {
      const alert: ParentAlert = {
        id: `al_${Date.now()}`,
        studentId: b.studentId,
        title: `Прием согласован: ${b.specialistTitle}`,
        message: `Вам назначено время: ${confirmedDateTime || 'В ближайшие дни'}, кабинет: ${confirmedRoom || b.specialistTitle}. ${notes || ''}`,
        createdAt: 'Только что',
        read: false,
        type: 'consultation'
      };
      setParentAlerts((prev) => [alert, ...prev]);
      addNotification(`Заявка обновлена. Родитель получил уведомление!`);
    }
  }, [bookings, addNotification]);

  // 6. Club Status & Cancellation
  const toggleClubStatus = useCallback((
    clubId: string,
    status: 'active' | 'cancelled' | 'rescheduled',
    reason?: string
  ) => {
    setSubscriptions((prev) =>
      prev.map((c) =>
        c.id === clubId
          ? { ...c, todayStatus: status, cancelReason: reason || c.cancelReason }
          : c
      )
    );

    const club = subscriptions.find((c) => c.id === clubId);
    const cTitle = club ? club.title : 'Кружок';

    if (status === 'cancelled') {
      const alert: ParentAlert = {
        id: `al_${Date.now()}`,
        studentId: club?.studentId || 's1',
        title: `🚨 Внимание: отмена кружка «${cTitle}»`,
        message: reason || `Занятие по кружку «${cTitle}» сегодня отменено! Дети остаются под присмотром дежурного куратора на продленке до 19:00.`,
        createdAt: 'Только что',
        read: false,
        type: 'club_cancel'
      };
      setParentAlerts((prev) => [alert, ...prev]);
      addNotification(`⚠️ Кружок «${cTitle}» отменен на сегодня! Родители мгновенно оповещены.`);
    } else {
      addNotification(`Статус кружка «${cTitle}» изменен на: ${status === 'active' ? 'Проводится по плану' : 'Перенос'}`);
    }
  }, [subscriptions, addNotification]);

  // Invoices & Payments
  const payInvoice = useCallback((id: string) => {
    const timeStr = `${new Date().toLocaleDateString('ru-RU')} ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'paid', paidDate: timeStr } : inv
      )
    );
    addNotification('Оплата успешно зафиксирована. Чек ОФД сформирован!');
  }, [addNotification]);

  const addInvoice = useCallback((invoiceData: Omit<Invoice, 'id' | 'status' | 'invoiceNumber'>) => {
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      status: 'pending',
      invoiceNumber: `СЧ-${new Date().getFullYear()}/${Date.now().toString().slice(-4)}`
    };
    setInvoices((prev) => [newInv, ...prev]);
    const alert: ParentAlert = {
      id: `al_${Date.now()}`,
      studentId: newInv.studentId,
      invoiceId: newInv.id,
      title: 'Выставлен новый счет',
      message: `Вам выставлен счет «${newInv.title}» на сумму ${newInv.amount.toLocaleString()} ₽ до ${newInv.dueDate}.`,
      createdAt: 'Только что',
      read: false,
      type: 'debt'
    };
    setParentAlerts((prev) => [alert, ...prev]);
    addNotification(`Счет «${newInv.title}» на сумму ${newInv.amount} ₽ выставлен!`);
  }, [addNotification]);

  // Feed & Posts
  const togglePostLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      })
    );
  }, []);

  const addPost = useCallback((postData: Omit<SchoolPost, 'id' | 'time' | 'likes' | 'isLiked' | 'comments'>) => {
    const newPost: SchoolPost = {
      ...postData,
      id: `post_${Date.now()}`,
      time: 'Только что',
      likes: 0,
      isLiked: false,
      comments: []
    };
    setPosts((prev) => [newPost, ...prev]);
    addNotification('Фотоотчет успешно опубликован в ленте для родителей!');
  }, [addNotification]);

  const addPostComment = useCallback((postId: string, text: string) => {
    const comment = {
      id: `c_${Date.now()}`,
      author: currentUser?.name || 'Елена Грачева',
      text,
      time: 'Только что'
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p))
    );
    addNotification('Ваш комментарий добавлен!');
  }, [currentUser, addNotification]);

  // Shifts
  const addOvertimeShift = useCallback((hours: number, reason: string) => {
    const newShift: StaffShift = {
      id: `sh_${Date.now()}`,
      teacherName: currentUser?.name || 'Анна Сергеевна Воронова',
      role: currentUser?.roleTitle || 'Куратор ступени познания 1',
      date: new Date().toISOString().split('T')[0],
      timeRange: 'Сверхурочные часы',
      dutyType: 'Дежурство / замещение',
      isOvertime: true,
      overtimeHours: hours,
      overtimeReason: reason,
      status: 'pending'
    };
    setShifts((prev) => [newShift, ...prev]);
    addNotification(`Заявка на ${hours} ч переработки отправлена руководителю на согласование!`);
  }, [currentUser, addNotification]);

  const approveShift = useCallback((shiftId: string) => {
    setShifts((prev) =>
      prev.map((sh) => (sh.id === shiftId ? { ...sh, status: 'confirmed' } : sh))
    );
    addNotification('Переработка утверждена руководителем и включена в табель!');
  }, [addNotification]);

  const toggleStaffPresence = useCallback((staffId: string) => {
    const timeStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setStaffMembers((prev) =>
      prev.map((m) => {
        if (m.id !== staffId) return m;
        const isInside = m.status === 'inside';
        return {
          ...m,
          status: isInside ? 'outside' : 'inside',
          checkInTime: isInside ? '-' : timeStr
        };
      })
    );
  }, []);

  const sendDebtorReminder = useCallback((invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    const alert: ParentAlert = {
      id: `al_${Date.now()}`,
      studentId: inv.studentId,
      invoiceId: inv.id,
      title: 'Напоминание о своевременной оплате',
      message: `Напоминаем об оплате счета «${inv.title}» на сумму ${inv.amount.toLocaleString()} ₽ до ${inv.dueDate}.`,
      createdAt: 'Только что',
      read: false,
      type: 'debt'
    };
    setParentAlerts((prev) => [alert, ...prev]);
    addNotification(`Напоминание по счету ${inv.invoiceNumber} отправлено родителю!`);
  }, [invoices, addNotification]);

  const sendAllDebtorsReminder = useCallback(() => {
    const debtors = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue');
    debtors.forEach((inv) => {
      const alert: ParentAlert = {
        id: `al_${Date.now()}_${inv.id}`,
        studentId: inv.studentId,
        invoiceId: inv.id,
        title: 'Уведомление об оплате',
        message: `Уважаемые родители, напоминаем о неоплаченном счете «${inv.title}» (${inv.amount.toLocaleString()} ₽).`,
        createdAt: 'Только что',
        read: false,
        type: 'debt'
      };
      setParentAlerts((prev) => [alert, ...prev]);
    });
    addNotification(`Уведомления успешно отправлены всем должникам (${debtors.length} счетов)!`);
  }, [invoices, addNotification]);

  const updateDayMenu = useCallback((dayMenu: DayMenu) => {
    setMenu(dayMenu);
    setWeeklyMenu((prev) =>
      prev.map((m) => (m.dayName === dayMenu.dayName ? dayMenu : m))
    );
    addNotification(`Меню на день (${dayMenu.dayName}) обновлено для родителей!`);
  }, [addNotification]);

  const updateWeeklyScheduleAndMenu = useCallback((schedule: WeeklyScheduleDay[], menuDays: DayMenu[]) => {
    if (schedule && schedule.length > 0) setWeeklySchedule(schedule);
    if (menuDays && menuDays.length > 0) {
      setWeeklyMenu(menuDays);
      setMenu(menuDays[0]);
    }
    addNotification('Расписание ступеней и меню успешно загружены из таблицы Excel!');
  }, [addNotification]);

  const markAlertRead = useCallback((alertId: string) => {
    setParentAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setParentAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    addNotification('Все оповещения прочитаны');
  }, [addNotification]);

  // 7. Super-Admin CRUD Functions
  const addOrUpdateStage = useCallback((stage: SchoolStage) => {
    setStages((prev) => {
      const exists = prev.some((s) => s.id === stage.id);
      return exists ? prev.map((s) => (s.id === stage.id ? stage : s)) : [...prev, stage];
    });
    addNotification(`Ступень «${stage.name}» сохранена!`);
  }, [addNotification]);

  const deleteStage = useCallback((stageId: string) => {
    setStages((prev) => prev.filter((s) => s.id !== stageId));
    addNotification('Ступень удалена');
  }, [addNotification]);

  const addOrUpdateSpecialist = useCallback((spec: ConsultationSpecialist) => {
    setSpecialists((prev) => {
      const exists = prev.some((s) => s.id === spec.id);
      return exists ? prev.map((s) => (s.id === spec.id ? spec : s)) : [...prev, spec];
    });
    addNotification(`Специалист «${spec.title}» сохранен!`);
  }, [addNotification]);

  const deleteSpecialist = useCallback((specId: string) => {
    setSpecialists((prev) => prev.filter((s) => s.id !== specId));
    addNotification('Специалист удален из списка');
  }, [addNotification]);

  const addOrUpdateClub = useCallback((club: ClubSubscription) => {
    setSubscriptions((prev) => {
      const exists = prev.some((c) => c.id === club.id);
      return exists ? prev.map((c) => (c.id === club.id ? club : c)) : [...prev, club];
    });
    addNotification(`Кружок «${club.title}» сохранен!`);
  }, [addNotification]);

  const deleteClub = useCallback((clubId: string) => {
    setSubscriptions((prev) => prev.filter((c) => c.id !== clubId));
    addNotification('Кружок удален');
  }, [addNotification]);

  const enrollStudentInClub = useCallback((
    clubId: string,
    studentId: string,
    enrollmentType: ClubEnrollmentType = 'regular',
    notes?: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    let targetTitle = '';
    let trialFee = 0;

    setSubscriptions((prev) => {
      return prev.map((club) => {
        if (club.id !== clubId) return club;
        targetTitle = club.title;
        const currentEnrolled = club.enrolledStudents || [];
        const alreadyEnrolled = currentEnrolled.some((e) => e.studentId === studentId);
        if (alreadyEnrolled) {
          return club;
        }

        const calculatedLessonPrice = club.pricePerLesson || Math.round(club.pricePerMonth / (club.totalLessons || 8));
        const calculatedTrialPrice = club.trialPrice || Math.round(calculatedLessonPrice * 0.5);
        trialFee = calculatedTrialPrice;

        const newEnrollment: EnrolledClubStudent = {
          studentId: student.id,
          studentName: student.name,
          stageName: student.class,
          avatar: student.avatar,
          parentPhone: student.parentPhone,
          parentNote: notes,
          enrolledAt: new Date().toLocaleDateString('ru-RU'),
          sentStatus: 'waiting',
          enrollmentType,
          trialPrice: calculatedTrialPrice,
          pricePerLesson: calculatedLessonPrice,
          regularPricePerMonth: club.pricePerMonth,
          trialFeedback: enrollmentType === 'trial' ? 'pending' : undefined,
          attendedCount: 0,
          accruedAmount: enrollmentType === 'trial' ? calculatedTrialPrice : 0
        };

        return {
          ...club,
          enrolledStudents: [...currentEnrolled, newEnrollment]
        };
      });
    });

    if (enrollmentType === 'trial') {
      addNotification(`🎯 ${student.name} записан(а) на пробное занятие «${targetTitle}» со скидкой 50% (${trialFee} ₽)!`);
    } else {
      addNotification(`🎉 ${student.name} успешно записан(а) на постоянный курс «${targetTitle}»!`);
    }
  }, [students, addNotification]);

  const convertTrialToRegular = useCallback((clubId: string, studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    let targetTitle = '';

    setSubscriptions((prev) => {
      return prev.map((club) => {
        if (club.id !== clubId) return club;
        targetTitle = club.title;
        const updatedEnrolled = (club.enrolledStudents || []).map((e) => {
          if (e.studentId !== studentId) return e;
          return {
            ...e,
            enrollmentType: 'regular' as ClubEnrollmentType,
            trialFeedback: 'converted' as TrialFeedbackStatus,
            parentNote: (e.parentNote ? e.parentNote + ' • ' : '') + 'Переведен с пробного занятия на курс'
          };
        });
        return {
          ...club,
          enrolledStudents: updatedEnrolled
        };
      });
    });

    addNotification(`🌟 ${student?.name || 'Ребенок'} успешно зачислен(а) на постоянный курс «${targetTitle}»!`);
  }, [students, addNotification]);

  const declineClubAfterTrial = useCallback((clubId: string, studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    let targetTitle = '';

    setSubscriptions((prev) => {
      return prev.map((club) => {
        if (club.id !== clubId) return club;
        targetTitle = club.title;
        return {
          ...club,
          enrolledStudents: (club.enrolledStudents || []).filter((e) => e.studentId !== studentId)
        };
      });
    });

    addNotification(`✓ Решение зафиксировано: ${student?.name || 'Ребенок'} не будет продолжать курс «${targetTitle}». Оплата только за 1 пробное занятие со скидкой 50%.`);
  }, [students, addNotification]);

  const cancelClubEnrollment = useCallback((clubId: string, studentId: string) => {
    setSubscriptions((prev) => {
      return prev.map((club) => {
        if (club.id !== clubId) return club;
        return {
          ...club,
          enrolledStudents: (club.enrolledStudents || []).filter((e) => e.studentId !== studentId)
        };
      });
    });
    addNotification('Запись на кружок отменена.');
  }, [addNotification]);

  const updateStudentClubDispatch = useCallback((
    clubId: string,
    studentId: string,
    status: 'waiting' | 'sent' | 'cancelled',
    teacherName?: string
  ) => {
    const nowTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const teacher = teacherName || currentUser?.name || 'Дежурный педагог продленки';

    setSubscriptions((prev) => {
      return prev.map((club) => {
        if (club.id !== clubId) return club;
        return {
          ...club,
          enrolledStudents: (club.enrolledStudents || []).map((e) => {
            if (e.studentId !== studentId) return e;
            return {
              ...e,
              sentStatus: status,
              sentAtTime: status === 'sent' ? nowTime : undefined,
              sentByTeacher: status === 'sent' ? teacher : undefined
            };
          })
        };
      });
    });

    if (status === 'sent') {
      addNotification(`✅ Ребенок отправлен на кружок в ${nowTime} (${teacher})`);
    } else if (status === 'waiting') {
      addNotification('Статус отправки сброшен (ребенок в классе продленки)');
    }
  }, [currentUser, addNotification]);

  const sendAllStudentsToClub = useCallback((clubId: string, teacherName?: string) => {
    const nowTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const teacher = teacherName || currentUser?.name || 'Дежурный педагог продленки';

    let count = 0;
    setSubscriptions((prev) => {
      return prev.map((club) => {
        if (club.id !== clubId) return club;
        const updated = (club.enrolledStudents || []).map((e) => {
          if (e.sentStatus !== 'sent' && club.todayStatus !== 'cancelled') {
            count++;
            return {
              ...e,
              sentStatus: 'sent' as const,
              sentAtTime: nowTime,
              sentByTeacher: teacher
            };
          }
          return e;
        });
        return { ...club, enrolledStudents: updated };
      });
    });

    addNotification(`✅ Все дети (${count} чел.) отправлены на кружок в ${nowTime}`);
  }, [currentUser, addNotification]);

  const addOrUpdateStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      return exists ? prev.map((s) => (s.id === student.id ? student : s)) : [...prev, student];
    });
    addNotification(`Данные ребенка «${student.name}» сохранены!`);
  }, [addNotification]);

  const deleteStudent = useCallback((studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    addNotification('Запись ребенка удалена');
  }, [addNotification]);

  const resetAllData = useCallback(() => {
    localStorage.clear();
    setStages(INITIAL_STAGES);
    setSpecialists(INITIAL_SPECIALISTS);
    setBookings(INITIAL_BOOKINGS);
    setStudents(INITIAL_STUDENTS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setMenu(INITIAL_MENU);
    setWeeklyMenu(INITIAL_WEEKLY_MENU);
    setInvoices(INITIAL_INVOICES);
    setPosts(INITIAL_POSTS);
    setShifts(INITIAL_SHIFTS);
    setStaffMembers(INITIAL_STAFF_MEMBERS);
    setParentAlerts(INITIAL_ALERTS);
    setWeeklySchedule(WEEKLY_SCHEDULE);
    setCurrentUser(INITIAL_USERS[0]);
    setRoleState('parent');
    addNotification('Все демонстрационные данные сброшены к начальным');
  }, [addNotification]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        login,
        logout,
        users: INITIAL_USERS,
        selectedStudentId,
        setSelectedStudentId,
        students,
        currentStudent,
        stages,
        specialists,
        bookings,
        addConsultationBooking,
        updateBookingStatus,
        menu,
        weeklyMenu,
        invoices,
        subscriptions,
        posts,
        shifts,
        staffMembers,
        parentAlerts,
        weeklySchedule,
        notifications,
        isSynced,
        addNotification,
        shiftHandoff,
        handoverShift,
        reportParentAbsence,
        clearNotification,
        setRole,
        updateAttendance,
        updatePickup,
        updateTwoStageHomework,
        toggleClubStatus,
        enrollStudentInClub,
        convertTrialToRegular,
        declineClubAfterTrial,
        cancelClubEnrollment,
        updateStudentClubDispatch,
        sendAllStudentsToClub,
        payInvoice,
        addInvoice,
        togglePostLike,
        addPost,
        addPostComment,
        addOvertimeShift,
        approveShift,
        toggleStaffPresence,
        sendDebtorReminder,
        sendAllDebtorsReminder,
        updateDayMenu,
        updateWeeklyScheduleAndMenu,
        markAlertRead,
        markAllAlertsRead,
        addOrUpdateStage,
        deleteStage,
        addOrUpdateSpecialist,
        deleteSpecialist,
        addOrUpdateClub,
        deleteClub,
        addOrUpdateStudent,
        deleteStudent,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
