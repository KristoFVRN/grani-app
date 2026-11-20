export type UserRole = 'parent' | 'curator' | 'extended_teacher' | 'admin';

export interface AuthUser {
  id: string;
  login: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  stageName?: string;
  studentId?: string;
}

export type AttendanceStatus = 'present_ontime' | 'late' | 'absent_sick' | 'absent_parent';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  arrivalTime?: string; // e.g. "10:30"
  missedLessonsCount?: number; // e.g. 1 or 2
  missedSubjects?: string; // e.g. "Русский язык (1-й урок)"
  curatorComment?: string;
  markedBy?: string;
}

export interface MonthlyAttendanceStats {
  monthName: string;
  totalDays: number;
  presentOnTime: number;
  lateDays: number; // Опоздания на 1-й урок
  sickDays: number;
  parentMissedDays: number; // Пропуски по вине/решению родителей
  lateDetails: AttendanceRecord[];
}

export type PickupPersonType = 'mom' | 'dad' | 'grandma' | 'custom';

export interface PickupInfo {
  person: PickupPersonType;
  customName?: string;
  phone?: string;
  updatedAt: string;
}

// Двухэтапная продленка
export interface HomeworkStageInfo {
  completed: boolean;
  notes: string;
  teacherName: string;
  updatedAt: string;
}

export interface TwoStageHomework {
  // Этап 1: До 15:00 в классе с куратором ступени
  stageClass: HomeworkStageInfo;
  // Этап 2: После 15:00 на продленке с дежурным педагогом
  stageExtended: HomeworkStageInfo;
  // Итоговый вердикт
  finalStatus: 'all_done' | 'needs_home_finish';
  homeTaskRemaining?: string;
}

export interface Student {
  id: string;
  name: string;
  class: string; // Юридически: "Ступень познания 1 «Первооткрыватели»"
  stageId: string;
  avatar: string;
  status: AttendanceStatus;
  arrivalTime: string;
  missedSubjectToday?: string;
  curatorName: string;
  room: string;
  pickup: PickupInfo;
  homework: TwoStageHomework;
  attendanceStats: MonthlyAttendanceStats;
  parentName: string;
  parentPhone: string;
  dietaryNeeds?: string; // Особенности питания / Аллергии (для кухни и куратора)
  parentAbsenceNotice?: {
    type: 'sick' | 'family' | 'late';
    expectedTime?: string;
    reason?: string;
    reportedAt: string;
  };
}

export interface ShiftHandoff {
  date: string;
  time: string; // e.g. "15:00"
  fromStaffName: string; // "Анна Сергеевна Воронова (Куратор)"
  toStaffName: string; // "Марина Игоревна Светлова (Педагог продленки)"
  notes: string;
  confirmed: boolean;
}

export interface SchoolStage {
  id: string;
  number: number;
  name: string; // e.g. "Ступень познания 1"
  badge: string; // e.g. "Первооткрыватели"
  curatorName: string;
  room: string;
  description: string;
  studentCount: number;
}

export interface ConsultationSpecialist {
  id: string;
  title: string; // e.g. "Руководителю", "Логопеду", "Преподавателю математики (ступень 5+)"
  name: string;
  room: string;
  availableDays: string;
  category: 'management' | 'support' | 'curator' | 'teachers';
}

export interface ConsultationBooking {
  id: string;
  specialistId: string;
  specialistTitle: string;
  specialistName: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  topicProblem: string; // Тематика проблемы (обязательный комментарий)
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmedDateTime?: string;
  confirmedRoom?: string;
  curatorNotes?: string;
  createdAt: string;
}

export type ClubEnrollmentType = 'trial' | 'regular'; // 'trial' - пробное (-50%), 'regular' - постоянный курс
export type TrialFeedbackStatus = 'pending' | 'attended' | 'declined' | 'converted'; // статус после пробного занятия

export interface EnrolledClubStudent {
  studentId: string;
  studentName: string;
  stageName: string;
  avatar?: string;
  parentPhone?: string;
  parentNote?: string;
  enrolledAt?: string;
  sentStatus?: 'waiting' | 'sent' | 'cancelled';
  sentAtTime?: string;
  sentByTeacher?: string;
  enrollmentType?: ClubEnrollmentType; // 'trial' или 'regular'
  trialPrice?: number; // цена разового пробного со скидкой 50%
  pricePerLesson?: number; // базовая цена за 1 занятие без скидки
  regularPricePerMonth?: number; // базовая стоимость в месяц
  trialFeedback?: TrialFeedbackStatus; // решение после пробного
  attendedCount?: number; // количество фактически посещенных занятий в текущем месяце
  accruedAmount?: number; // сумма к начислению по факту
}

export interface ClubSubscription {
  id: string;
  studentId?: string;
  studentName?: string;
  title: string;
  iconName: string;
  category?: 'dance' | 'it' | 'chess' | 'art' | 'math' | 'languages' | 'theater' | 'other';
  curatorName: string;
  room?: string;
  description?: string;
  scheduleDays: string; // e.g. "Понедельник, Среда, Пятница"
  startTime: string; // "17:00"
  endTime: string; // "18:15"
  pickupStrictTime: string; // "18:15"
  pickupNotice: string; // "Просьба забирать ровно в 18:15, не приходить раньше"
  totalLessons: number;
  remainingLessons: number;
  expiresDate: string;
  pricePerMonth: number;
  pricePerLesson?: number; // стоимость 1 занятия без скидки
  trialPrice?: number; // стоимость пробного занятия со скидкой 50%
  // Оперативный статус на сегодня
  todayStatus: 'active' | 'cancelled' | 'rescheduled';
  cancelReason?: string; // "Педагог на больничном, продленка работает в обычном режиме"
  enrolledStudents?: EnrolledClubStudent[];
}

export interface MealItem {
  name: string;
  weight: string;
  calories: number;
  allergens?: string[];
}

export interface DayMenu {
  date: string;
  dayName: string;
  breakfast: MealItem[];
  lunch: MealItem[];
  afternoonSnack: MealItem[];
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  title: string;
  category: 'tuition' | 'meals' | 'clubs';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  invoiceNumber: string;
}

export interface PostComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface SchoolPost {
  id: string;
  author: string;
  authorRole: string;
  title: string;
  text: string;
  time: string;
  images: string[];
  category: 'events' | 'workshops' | 'life';
  likes: number;
  isLiked: boolean;
  comments?: PostComment[];
}

export interface StaffShift {
  id: string;
  teacherName: string;
  role: string;
  date: string;
  timeRange: string;
  dutyType: string;
  isOvertime: boolean;
  overtimeHours?: number;
  overtimeReason?: string;
  status: 'confirmed' | 'pending';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'inside' | 'outside' | 'sick';
  checkInTime: string;
  location: string;
  phone: string;
}

export interface ParentAlert {
  id: string;
  studentId: string;
  invoiceId?: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'debt' | 'homework' | 'safety' | 'club_cancel' | 'consultation' | 'info';
}

export interface WeeklyScheduleDay {
  dayName: string;
  lessons: {
    time: string;
    subject: string;
    teacher: string;
    room: string;
  }[];
}
