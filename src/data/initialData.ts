import type {
  Student,
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
  AuthUser,
  ShiftHandoff
} from '../types';

export const INITIAL_USERS: AuthUser[] = [
  {
    id: 'u_parent',
    login: 'parent',
    phone: '+7 (903) 858-12-34',
    birthDate: '14.05.2016',
    name: 'Елена Грачева',
    role: 'parent',
    roleTitle: 'Родитель (мама Миши)',
    stageName: 'Ступень познания 1 «Первооткрыватели»',
    studentId: 's1'
  },
  {
    id: 'u_curator',
    login: 'curator',
    phone: '+7 (903) 858-00-01',
    name: 'Анна Сергеевна Воронова',
    role: 'curator',
    roleTitle: 'Куратор ступени познания 1',
    stageName: 'Ступень познания 1 «Первооткрыватели»'
  },
  {
    id: 'u_extended',
    login: 'extended',
    phone: '+7 (903) 858-00-02',
    name: 'Марина Игоревна Светлова',
    role: 'extended_teacher',
    roleTitle: 'Дежурный педагог продленки',
    stageName: 'Группа продленного дня (все ступени)'
  },
  {
    id: 'u_admin',
    login: 'admin',
    phone: '+7 (999) 000-00-01',
    name: 'Ольга Николаевна Граничева',
    role: 'admin',
    roleTitle: 'Руководитель центра / Супер-админ',
    stageName: 'Все ступени познания'
  }
];

export const INITIAL_STAGES: SchoolStage[] = [
  {
    id: 'stage_0',
    number: 0,
    name: 'Ступень познания «Стартеры»',
    badge: 'Стартеры (подготовка / 0 класс)',
    curatorName: 'Ольга Николаевна Васильева',
    room: 'Кабинет 102 «Малыши»',
    description: 'Подготовка к школе, развитие речи, моторика, пространственное мышление и мягкая социализация.',
    studentCount: 10
  },
  {
    id: 'stage_1',
    number: 1,
    name: 'Ступень познания 1',
    badge: 'Первооткрыватели (1 класс)',
    curatorName: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204 «Космос»',
    description: 'Мягкая адаптация, основы чтения, логики и каллиграфии, проектные мастерские.',
    studentCount: 12
  },
  {
    id: 'stage_2',
    number: 2,
    name: 'Ступень познания 2',
    badge: 'Исследователи (2 класс)',
    curatorName: 'Елена Викторовна Орлова',
    room: 'Кабинет 206 «Атлас»',
    description: 'Развитие критического мышления, олимпиадная математика, окружающий мир через опыты.',
    studentCount: 14
  },
  {
    id: 'stage_3',
    number: 3,
    name: 'Ступень познания 3',
    badge: 'Мыслители (3 класс)',
    curatorName: 'Татьяна Васильевна Смирнова',
    room: 'Кабинет 302 «Лаборатория»',
    description: 'Исследовательские мини-проекты, глубокое погружение в естествознание и языки.',
    studentCount: 11
  },
  {
    id: 'stage_4',
    number: 4,
    name: 'Ступень познания 4',
    badge: 'Эрудиты (4 класс)',
    curatorName: 'Наталья Борисовна Жукова',
    room: 'Кабинет 304 «Интеллект»',
    description: 'Подготовка к переходу в среднее звено, дебаты, метапредметные турниры.',
    studentCount: 15
  },
  {
    id: 'stage_5',
    number: 5,
    name: 'Ступень познания 5–6',
    badge: 'Искатели (5–6 классы)',
    curatorName: 'Михаил Юрьевич Ковалев',
    room: 'Кабинет 401 «Хайтек»',
    description: 'Предметное обучение с преподавателями-предметниками, IT, биология, архитектура.',
    studentCount: 18
  },
  {
    id: 'stage_extended',
    number: 7,
    name: 'Ступень познания',
    badge: 'Созидатели (продленка)',
    curatorName: 'Марина Игоревна Светлова',
    room: 'Игровая гостиная / Продленка',
    description: 'Двухэтапная продленка до 19:00: выполнение ДЗ, прогулки, сопровождение на кружки и студии.',
    studentCount: 35
  }
];

// 13 специалистов для личной консультации / приема
export const INITIAL_SPECIALISTS: ConsultationSpecialist[] = [
  {
    id: 'spec_1',
    title: 'Руководителю',
    name: 'Ольга Николаевна Граничева',
    room: 'Кабинет 101 (Дирекция)',
    availableDays: 'Вт, Чт с 16:00 до 18:30',
    category: 'management'
  },
  {
    id: 'spec_2',
    title: 'Логопеду',
    name: 'Наталья Васильевна Климова',
    room: 'Кабинет 104 (Речевая студия)',
    availableDays: 'Пн, Ср, Пт с 14:00 до 17:30',
    category: 'support'
  },
  {
    id: 'spec_3',
    title: 'Нейропсихологу',
    name: 'Екатерина Дмитриевна Романова',
    room: 'Кабинет 108 (Сенсорная комната)',
    availableDays: 'Вт, Чт с 15:00 до 18:00',
    category: 'support'
  },
  {
    id: 'spec_4',
    title: 'Психологу',
    name: 'Анна Павловна Соколова',
    room: 'Кабинет 105 (Психологическая разгрузка)',
    availableDays: 'Пн–Пт с 13:00 до 17:00',
    category: 'support'
  },
  {
    id: 'spec_5',
    title: 'Дефектологу',
    name: 'Ирина Сергеевна Белова',
    room: 'Кабинет 107',
    availableDays: 'Ср, Пт с 14:30 до 17:30',
    category: 'support'
  },
  {
    id: 'spec_6',
    title: 'Куратору вашей ступени',
    name: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204',
    availableDays: 'Пн–Пт с 15:00 до 16:30',
    category: 'curator'
  },
  {
    id: 'spec_7',
    title: 'Преподавателю математики (ступень 5+)',
    name: 'Михаил Юрьевич Ковалев',
    room: 'Кабинет 402',
    availableDays: 'Вт, Чт с 16:30 до 18:00',
    category: 'teachers'
  },
  {
    id: 'spec_8',
    title: 'Преподавателю английского языка',
    name: 'Мария Александровна Грин',
    room: 'Кабинет 305 (Лингафонный)',
    availableDays: 'Пн, Ср с 16:00 до 17:30',
    category: 'teachers'
  },
  {
    id: 'spec_9',
    title: 'Преподавателю русского языка и литературы (ступень 5+)',
    name: 'Татьяна Ивановна Смирнова',
    room: 'Кабинет 404',
    availableDays: 'Вт, Пт с 16:00 до 17:30',
    category: 'teachers'
  },
  {
    id: 'spec_10',
    title: 'Преподавателю истории',
    name: 'Сергей Владимирович Морозов',
    room: 'Кабинет 406',
    availableDays: 'Ср, Чт с 16:00 до 17:30',
    category: 'teachers'
  },
  {
    id: 'spec_11',
    title: 'Преподавателю биологии (ступень 5+)',
    name: 'Ольга Геннадьевна Зайцева',
    room: 'Кабинет 308 (Биолаборатория)',
    availableDays: 'Пн, Чт с 16:00 до 17:30',
    category: 'teachers'
  },
  {
    id: 'spec_12',
    title: 'Преподавателю географии (ступень 5+)',
    name: 'Виктор Николаевич Попов',
    room: 'Кабинет 306',
    availableDays: 'Вт, Чт с 16:00 до 17:30',
    category: 'teachers'
  },
  {
    id: 'spec_13',
    title: 'Преподавателю информатики (ступень 5+)',
    name: 'Дмитрий Олегович Волков',
    room: 'Кабинет 401 (IT-полигон)',
    availableDays: 'Пн, Пт с 16:30 до 18:00',
    category: 'teachers'
  }
];

export const INITIAL_BOOKINGS: ConsultationBooking[] = [
  {
    id: 'b1',
    specialistId: 'spec_2',
    specialistTitle: 'Логопеду',
    specialistName: 'Наталья Васильевна Климова',
    studentId: 's1',
    studentName: 'Михаил Грачев',
    parentName: 'Елена Грачева',
    parentPhone: '+7 (903) 858-12-34',
    topicProblem: 'Хотим проконсультироваться по поводу темпа чтения и произношения шипящих звуков в длинных предложениях.',
    preferredDate: '2026-11-18',
    preferredTime: '16:00',
    status: 'confirmed',
    confirmedDateTime: '18 ноября (Вт) в 16:00',
    confirmedRoom: 'Кабинет 104 (Речевая студия)',
    curatorNotes: 'Ждем маму с Мишей, подготовила материалы для тестирования.',
    createdAt: '2026-11-14 11:20'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Михаил Грачев',
    birthDate: '14.05.2016',
    class: 'Ступень познания 1 «Первооткрыватели»',
    stageId: 'stage_1',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
    status: 'late',
    arrivalTime: '10:30',
    missedSubjectToday: 'Русский язык (1-й урок)',
    curatorName: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204 «Космос»',
    parentName: 'Елена Грачева',
    parentPhone: '+7 (903) 858-12-34',
    dietaryNeeds: 'Общий стол (без ограничений)',
    pickup: {
      person: 'mom',
      updatedAt: 'Сегодня, 08:30'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'В классе до 15:00: Математика (Петерсон упр. 4-6) выполнена полностью, Окружающий мир прочитан.',
        teacherName: 'Анна Сергеевна (Куратор)',
        updatedAt: '14:45'
      },
      stageExtended: {
        completed: true,
        notes: 'На продленке после 15:00: Дописали прописи по русскому языку (стр. 18). Проверено дежурным педагогом.',
        teacherName: 'Марина Игоревна (Дежурный педагог)',
        updatedAt: '16:40'
      },
      finalStatus: 'all_done',
      homeTaskRemaining: 'Все сделано в центре! Вечер свободен для отдыха.'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 14,
      lateDays: 5,
      sickDays: 2,
      parentMissedDays: 1,
      lateDetails: [
        {
          date: '14 ноября',
          status: 'late',
          arrivalTime: '10:30',
          missedLessonsCount: 1,
          missedSubjects: 'Русский язык (1-й урок)',
          curatorComment: 'Привезли после поликлиники к третьему занятию.'
        },
        {
          date: '11 ноября',
          status: 'late',
          arrivalTime: '10:15',
          missedLessonsCount: 1,
          missedSubjects: 'Русский язык (1-й урок)',
          curatorComment: 'Родители проспали, пропустили объяснение новой темы по письму.'
        },
        {
          date: '07 ноября',
          status: 'late',
          arrivalTime: '10:45',
          missedLessonsCount: 2,
          missedSubjects: 'Русский язык (1-й урок), Математика (2-й урок)',
          curatorComment: 'Пропущен утренний проверочный диктант.'
        },
        {
          date: '02 ноября',
          status: 'late',
          arrivalTime: '10:20',
          missedLessonsCount: 1,
          missedSubjects: 'Русский язык (1-й урок)',
          curatorComment: 'Задержка в дороге.'
        },
        {
          date: '28 октября',
          status: 'late',
          arrivalTime: '10:35',
          missedLessonsCount: 1,
          missedSubjects: 'Русский язык (1-й урок)',
          curatorComment: 'Систематическое позднее прибытие к 3-му уроку.'
        }
      ]
    }
  },
  {
    id: 's2',
    name: 'Алиса Смирнова',
    birthDate: '20.08.2016',
    class: 'Ступень познания 1 «Первооткрыватели»',
    stageId: 'stage_1',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:20',
    curatorName: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204 «Космос»',
    parentName: 'Ольга Смирнова',
    parentPhone: '+7 (903) 858-55-66',
    dietaryNeeds: '⚠️ Без лактозы (непереносимость цельного молока)',
    pickup: {
      person: 'dad',
      updatedAt: 'Сегодня, 08:15'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'Все задания в классе выполнены на отлично.',
        teacherName: 'Анна Сергеевна (Куратор)',
        updatedAt: '14:50'
      },
      stageExtended: {
        completed: true,
        notes: 'На продленке Алиса занималась рисованием и шахматами.',
        teacherName: 'Марина Игоревна (Дежурный педагог)',
        updatedAt: '16:15'
      },
      finalStatus: 'all_done',
      homeTaskRemaining: 'Все сделано!'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 20,
      lateDays: 1,
      sickDays: 1,
      parentMissedDays: 0,
      lateDetails: [
        {
          date: '05 ноября',
          status: 'late',
          arrivalTime: '09:10',
          missedLessonsCount: 1,
          missedSubjects: 'Разминка и утренний круг',
          curatorComment: 'Опоздание на 10 минут.'
        }
      ]
    }
  },
  {
    id: 's3',
    name: 'Даниил Морозов',
    birthDate: '11.03.2015',
    class: 'Ступень познания 2 «Исследователи»',
    stageId: 'stage_2',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:25',
    curatorName: 'Елена Викторовна Орлова',
    room: 'Кабинет 206 «Атлас»',
    parentName: 'Сергей Морозов',
    parentPhone: '+7 (903) 858-77-88',
    dietaryNeeds: '⚠️ Аллергия на цитрусовые и мед',
    pickup: {
      person: 'grandma',
      updatedAt: 'Сегодня, 08:20'
    },
    homework: {
      stageClass: {
        completed: false,
        notes: 'В классе успел сделать математику, русский остался на продленку (упр. 77).',
        teacherName: 'Елена Викторовна (Куратор)',
        updatedAt: '14:40'
      },
      stageExtended: {
        completed: true,
        notes: 'На продленке доделали русский язык упр. 77 и повторили словарные слова.',
        teacherName: 'Марина Игоревна (Дежурный педагог)',
        updatedAt: '16:50'
      },
      finalStatus: 'all_done'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 18,
      lateDays: 2,
      sickDays: 2,
      parentMissedDays: 0,
      lateDetails: []
    }
  },
  {
    id: 's4',
    name: 'Арсений Иванов',
    birthDate: '05.09.2016',
    class: 'Ступень познания 1 «Первооткрыватели»',
    stageId: 'stage_1',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:15',
    curatorName: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204 «Космос»',
    parentName: 'Виктория Иванова',
    parentPhone: '+7 (903) 111-22-33',
    pickup: {
      person: 'mom',
      updatedAt: 'Сегодня, 08:10'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'Все задания в классе выполнены.',
        teacherName: 'Анна Сергеевна',
        updatedAt: '14:50'
      },
      stageExtended: {
        completed: true,
        notes: 'Готов к кружку танцев.',
        teacherName: 'Марина Игоревна',
        updatedAt: '16:30'
      },
      finalStatus: 'all_done'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 21,
      lateDays: 1,
      sickDays: 0,
      parentMissedDays: 0,
      lateDetails: []
    }
  },
  {
    id: 's5',
    name: 'Максим Петров',
    birthDate: '12.11.2016',
    class: 'Ступень познания 1 «Первооткрыватели»',
    stageId: 'stage_1',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:20',
    curatorName: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204 «Космос»',
    parentName: 'Дмитрий Петров',
    parentPhone: '+7 (903) 222-33-44',
    pickup: {
      person: 'dad',
      updatedAt: 'Сегодня, 08:15'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'Математика и письмо сданы.',
        teacherName: 'Анна Сергеевна',
        updatedAt: '14:55'
      },
      stageExtended: {
        completed: true,
        notes: 'Ждет начала танцев в 17:00.',
        teacherName: 'Марина Игоревна',
        updatedAt: '16:45'
      },
      finalStatus: 'all_done'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 20,
      lateDays: 2,
      sickDays: 0,
      parentMissedDays: 0,
      lateDetails: []
    }
  },
  {
    id: 's6',
    name: 'София Сидорова',
    birthDate: '18.04.2015',
    class: 'Ступень познания 2 «Исследователи»',
    stageId: 'stage_2',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:25',
    curatorName: 'Елена Викторовна Орлова',
    room: 'Кабинет 206 «Атлас»',
    parentName: 'Наталья Сидорова',
    parentPhone: '+7 (903) 333-44-55',
    pickup: {
      person: 'mom',
      updatedAt: 'Сегодня, 08:20'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'Все уроки сделаны в классе.',
        teacherName: 'Елена Викторовна',
        updatedAt: '14:50'
      },
      stageExtended: {
        completed: true,
        notes: 'Переоделась на танцы.',
        teacherName: 'Марина Игоревна',
        updatedAt: '16:50'
      },
      finalStatus: 'all_done'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 19,
      lateDays: 1,
      sickDays: 2,
      parentMissedDays: 0,
      lateDetails: []
    }
  },
  {
    id: 's7',
    name: 'Артем Козлов',
    birthDate: '22.01.2016',
    class: 'Ступень познания 1 «Первооткрыватели»',
    stageId: 'stage_1',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:18',
    curatorName: 'Анна Сергеевна Воронова',
    room: 'Кабинет 204 «Космос»',
    parentName: 'Марина Козлова',
    parentPhone: '+7 (903) 444-55-66',
    pickup: {
      person: 'mom',
      updatedAt: 'Сегодня, 08:10'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'ДЗ сделано.',
        teacherName: 'Анна Сергеевна',
        updatedAt: '14:40'
      },
      stageExtended: {
        completed: true,
        notes: 'На робототехнике.',
        teacherName: 'Марина Игоревна',
        updatedAt: '16:30'
      },
      finalStatus: 'all_done'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 22,
      lateDays: 0,
      sickDays: 0,
      parentMissedDays: 0,
      lateDetails: []
    }
  },
  {
    id: 's8',
    name: 'Илья Васильев',
    birthDate: '30.07.2015',
    class: 'Ступень познания 2 «Исследователи»',
    stageId: 'stage_2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'present_ontime',
    arrivalTime: '08:22',
    curatorName: 'Елена Викторовна Орлова',
    room: 'Кабинет 206 «Атлас»',
    parentName: 'Олег Васильев',
    parentPhone: '+7 (903) 555-66-77',
    pickup: {
      person: 'dad',
      updatedAt: 'Сегодня, 08:15'
    },
    homework: {
      stageClass: {
        completed: true,
        notes: 'Математика и история сделаны.',
        teacherName: 'Елена Викторовна',
        updatedAt: '14:45'
      },
      stageExtended: {
        completed: true,
        notes: 'Шахматы отменены, читает книгу на продленке.',
        teacherName: 'Марина Игоревна',
        updatedAt: '16:40'
      },
      finalStatus: 'all_done'
    },
    attendanceStats: {
      monthName: 'Ноябрь',
      totalDays: 22,
      presentOnTime: 18,
      lateDays: 3,
      sickDays: 1,
      parentMissedDays: 0,
      lateDetails: []
    }
  }
];

export const INITIAL_SUBSCRIPTIONS: ClubSubscription[] = [
  {
    id: 'c4',
    studentId: 's1',
    title: 'Хореография и современные танцы «Ритм»',
    iconName: 'Activity',
    category: 'dance',
    curatorName: 'Марина Александровна Соколова',
    room: 'Зал хореографии (2 этаж)',
    description: 'Эстрадная хореография, пластика, осанка, сценическое движение и растяжка. Подготовка к городским конкурсам.',
    scheduleDays: 'Понедельник, Среда, Пятница',
    startTime: '17:00',
    endTime: '18:15',
    pickupStrictTime: '18:15',
    pickupNotice: 'Просьба забирать ровно в 18:15 в холле перед залом танцев! Не отвлекайте детей во время финальной растяжки.',
    totalLessons: 12,
    remainingLessons: 10,
    expiresDate: '20.12.2026',
    pricePerMonth: 4500,
    pricePerLesson: 600,
    trialPrice: 300,
    todayStatus: 'active',
    enrolledStudents: [
      {
        studentId: 's4',
        studentName: 'Арсений Иванов',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 111-22-33',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 4,
        pricePerLesson: 600
      },
      {
        studentId: 's5',
        studentName: 'Максим Петров',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 222-33-44',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 3,
        pricePerLesson: 600
      },
      {
        studentId: 's6',
        studentName: 'София Сидорова',
        stageName: 'Ступень познания 2 «Исследователи»',
        parentPhone: '+7 (903) 333-44-55',
        sentStatus: 'waiting',
        enrollmentType: 'trial',
        trialPrice: 300,
        trialFeedback: 'pending'
      },
      {
        studentId: 's1',
        studentName: 'Михаил Грачев',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 858-12-34',
        sentStatus: 'waiting',
        enrollmentType: 'trial',
        trialPrice: 300,
        trialFeedback: 'attended'
      },
      {
        studentId: 's2',
        studentName: 'Алиса Смирнова',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 858-55-66',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 5,
        pricePerLesson: 600
      },
      {
        studentId: 's3',
        studentName: 'Даниил Морозов',
        stageName: 'Ступень познания 2 «Исследователи»',
        parentPhone: '+7 (903) 858-77-88',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 4,
        pricePerLesson: 600
      }
    ]
  },
  {
    id: 'c1',
    studentId: 's1',
    title: 'Робототехника и алгоритмика Lego SPIKE',
    iconName: 'Cpu',
    category: 'it',
    curatorName: 'Дмитрий Олегович Волков',
    room: 'Кабинет 204 «Космос»',
    description: 'Конструирование умных роботов, программирование датчиков и моторов на базе Lego SPIKE Prime.',
    scheduleDays: 'Среда, Пятница',
    startTime: '16:30',
    endTime: '17:45',
    pickupStrictTime: '17:45',
    pickupNotice: 'Просьба забирать ровно в 17:45! Не приходите раньше, чтобы не прерывать сборку механизмов.',
    totalLessons: 8,
    remainingLessons: 6,
    expiresDate: '15.12.2026',
    pricePerMonth: 4800,
    pricePerLesson: 600,
    trialPrice: 300,
    todayStatus: 'active',
    enrolledStudents: [
      {
        studentId: 's1',
        studentName: 'Михаил Грачев',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 858-12-34',
        sentStatus: 'sent',
        sentAtTime: '16:25',
        sentByTeacher: 'Марина Игоревна (Продленка)',
        enrollmentType: 'regular',
        attendedCount: 3,
        pricePerLesson: 600
      },
      {
        studentId: 's7',
        studentName: 'Артем Козлов',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 444-55-66',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 2,
        pricePerLesson: 600
      }
    ]
  },
  {
    id: 'c2',
    studentId: 's1',
    title: 'Шахматная академия «Белая ладья»',
    iconName: 'Crown',
    category: 'chess',
    curatorName: 'Сергей Владимирович Морозов',
    room: 'Кабинет 108 «Логика»',
    description: 'Тактика и стратегия шахматных партий, решение этюдов, подготовка к школьным турнирам.',
    scheduleDays: 'Вторник, Четверг',
    startTime: '16:30',
    endTime: '17:30',
    pickupStrictTime: '17:30',
    pickupNotice: 'Забирать ровно в 17:30. В это время заканчивается турнирная партия.',
    totalLessons: 8,
    remainingLessons: 5,
    expiresDate: '18.12.2026',
    pricePerMonth: 3900,
    pricePerLesson: 500,
    trialPrice: 250,
    todayStatus: 'cancelled',
    cancelReason: 'Внимание родителей: Сегодня занятие отменено из-за выезда педагога на городской турнир. Дети остаются на продленке с дежурным куратором до 19:00!',
    enrolledStudents: [
      {
        studentId: 's3',
        studentName: 'Даниил Морозов',
        stageName: 'Ступень познания 2 «Исследователи»',
        parentPhone: '+7 (903) 858-77-88',
        sentStatus: 'cancelled',
        enrollmentType: 'regular',
        attendedCount: 3,
        pricePerLesson: 500
      },
      {
        studentId: 's8',
        studentName: 'Илья Васильев',
        stageName: 'Ступень познания 2 «Исследователи»',
        parentPhone: '+7 (903) 555-66-77',
        sentStatus: 'cancelled',
        enrollmentType: 'regular',
        attendedCount: 2,
        pricePerLesson: 500
      }
    ]
  },
  {
    id: 'c3',
    studentId: 's1',
    title: 'Керамика и гончарное ремесло',
    iconName: 'Palette',
    category: 'art',
    curatorName: 'Екатерина Дмитриевна Романова',
    room: 'Арт-мастерская (1 этаж)',
    description: 'Лепка из глины, работа на гончарном круге, роспись ангобами и глазурование изделий.',
    scheduleDays: 'Суббота',
    startTime: '11:00',
    endTime: '12:30',
    pickupStrictTime: '12:30',
    pickupNotice: 'Забирать в 12:30 после сушки глиняных изделий.',
    totalLessons: 4,
    remainingLessons: 3,
    expiresDate: '25.12.2026',
    pricePerMonth: 3600,
    pricePerLesson: 900,
    trialPrice: 450,
    todayStatus: 'active',
    enrolledStudents: [
      {
        studentId: 's1',
        studentName: 'Михаил Грачев',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 858-12-34',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 2,
        pricePerLesson: 900
      },
      {
        studentId: 's2',
        studentName: 'Алиса Смирнова',
        stageName: 'Ступень познания 1 «Первооткрыватели»',
        parentPhone: '+7 (903) 858-55-66',
        sentStatus: 'waiting',
        enrollmentType: 'regular',
        attendedCount: 2,
        pricePerLesson: 900
      }
    ]
  },
  {
    id: 'c5',
    studentId: 's1',
    title: 'Ментальная арифметика и скорочтение',
    iconName: 'Brain',
    category: 'math',
    curatorName: 'Наталья Ивановна Мельникова',
    room: 'Кабинет 104',
    description: 'Счет на абакусе, развитие фотографической памяти, синхронизация полушарий мозга и быстрое понимание текстов.',
    scheduleDays: 'Понедельник, Четверг',
    startTime: '16:30',
    endTime: '17:30',
    pickupStrictTime: '17:30',
    pickupNotice: 'Забирать ровно в 17:30.',
    totalLessons: 8,
    remainingLessons: 7,
    expiresDate: '28.12.2026',
    pricePerMonth: 4200,
    pricePerLesson: 525,
    trialPrice: 260,
    todayStatus: 'active',
    enrolledStudents: []
  },
  {
    id: 'c6',
    studentId: 's1',
    title: 'Английский разговорный клуб «Little Oxford»',
    iconName: 'Languages',
    category: 'languages',
    curatorName: 'Мария Александровна Родионова',
    room: 'Кабинет 305 «Лингва»',
    description: 'Погружение в языковую среду через настольные игры, квесты, песенный материал и британские традиции.',
    scheduleDays: 'Вторник, Пятница',
    startTime: '17:00',
    endTime: '18:00',
    pickupStrictTime: '18:00',
    pickupNotice: 'Забирать ровно в 18:00.',
    totalLessons: 8,
    remainingLessons: 8,
    expiresDate: '30.12.2026',
    pricePerMonth: 4600,
    pricePerLesson: 575,
    trialPrice: 290,
    todayStatus: 'active',
    enrolledStudents: []
  },
  {
    id: 'c7',
    studentId: 's1',
    title: 'Театральная студия «Лукоморье»',
    iconName: 'Sparkles',
    category: 'theater',
    curatorName: 'Светлана Олеговна Некрасова',
    room: 'Актовый зал (3 этаж)',
    description: 'Ораторское мастерство, сценическая речь, раскрепощение, постановка сказочных спектаклей для родителей.',
    scheduleDays: 'Среда',
    startTime: '17:00',
    endTime: '18:30',
    pickupStrictTime: '18:30',
    pickupNotice: 'Забирать ровно в 18:30.',
    totalLessons: 4,
    remainingLessons: 4,
    expiresDate: '30.12.2026',
    pricePerMonth: 3800,
    pricePerLesson: 950,
    trialPrice: 475,
    todayStatus: 'active',
    enrolledStudents: []
  }
];

export const INITIAL_MENU: DayMenu = {
  date: 'Понедельник, 10 ноября',
  dayName: 'Сегодня',
  breakfast: [
    { name: 'Овсяная каша со свежими ягодами и медом', weight: '200 г', calories: 230 },
    { name: 'Сырники из фермерского творога со сметаной', weight: '140 г', calories: 280, allergens: ['Лактоза'] },
    { name: 'Чай облепиховый витаминный с лимоном', weight: '200 мл', calories: 45 }
  ],
  lunch: [
    { name: 'Суп куриный с домашней лапшой и зеленью', weight: '250 мл', calories: 180, allergens: ['Глютен'] },
    { name: 'Нежные тефтели из индейки в сливочном соусе', weight: '120 г', calories: 260 },
    { name: 'Картофельное пюре на деревенском молоке', weight: '150 г', calories: 190, allergens: ['Лактоза'] },
    { name: 'Салат из свежих огурцов, томатов черри и микрозелени', weight: '100 г', calories: 65 },
    { name: 'Морс клюквенно-брусничный собственного приготовления', weight: '200 мл', calories: 70 }
  ],
  afternoonSnack: [
    { name: 'Творожная запеканка с курагой или фруктовый ланч-бокс', weight: '130 г', calories: 210, allergens: ['Лактоза'] },
    { name: 'Свежие яблоки сорта Голден и груши', weight: '120 г', calories: 60 },
    { name: 'Какао с фермерским молоком / Био-йогурт', weight: '200 мл', calories: 140, allergens: ['Лактоза'] }
  ]
};

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    studentId: 's1',
    studentName: 'Михаил Грачев',
    class: '1 «А»',
    title: 'Обучение за ноябрь 2026',
    category: 'tuition',
    amount: 38000,
    dueDate: '15.11.2026',
    status: 'paid',
    paidDate: '03.11.2026',
    invoiceNumber: 'СЧ-2026/11-042'
  },
  {
    id: 'inv-2',
    studentId: 's1',
    studentName: 'Михаил Грачев',
    class: '1 «А»',
    title: '3-разовое горячее питание (ноябрь)',
    category: 'meals',
    amount: 9500,
    dueDate: '15.11.2026',
    status: 'paid',
    paidDate: '03.11.2026',
    invoiceNumber: 'СЧ-2026/11-089'
  },
  {
    id: 'inv-3',
    studentId: 's1',
    studentName: 'Михаил Грачев',
    class: '1 «А»',
    title: 'Абонемент «Робототехника и LEGO Education»',
    category: 'clubs',
    amount: 4400,
    dueDate: '20.11.2026',
    status: 'pending',
    invoiceNumber: 'СЧ-2026/11-125'
  },
  // Invoices for other students to demonstrate admin debtors filter:
  {
    id: 'inv-4',
    studentId: 's2',
    studentName: 'София Мельникова',
    class: '1 «А»',
    title: 'Обучение за ноябрь 2026',
    category: 'tuition',
    amount: 38000,
    dueDate: '05.11.2026',
    status: 'overdue',
    invoiceNumber: 'СЧ-2026/11-018'
  },
  {
    id: 'inv-5',
    studentId: 's6',
    studentName: 'Полина Смирнова',
    class: '1 «А»',
    title: '3-разовое горячее питание (ноябрь)',
    category: 'meals',
    amount: 9500,
    dueDate: '05.11.2026',
    status: 'overdue',
    invoiceNumber: 'СЧ-2026/11-031'
  },
  {
    id: 'inv-6',
    studentId: 's7',
    studentName: 'Тимофей Морозов',
    class: '1 «А»',
    title: 'Кружок «Шахматный клуб Грани»',
    category: 'clubs',
    amount: 3600,
    dueDate: '18.11.2026',
    status: 'pending',
    invoiceNumber: 'СЧ-2026/11-140'
  }
];

export const INITIAL_POSTS: SchoolPost[] = [
  {
    id: 'p1',
    author: 'Екатерина Дмитриевна',
    authorRole: 'Куратор продленки и мастерских',
    title: 'Мастерская инженерии: конструируем первые мосты',
    text: 'Сегодня на продленке первоклассники изучали сопромат в игровой форме! Построили мосты из деревянных реек, выдержавшие испытание тяжелыми грузами. В «Гранях» знания сразу закрепляются на практике!',
    time: 'Сегодня в 15:20',
    category: 'workshops',
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600'
    ],
    likes: 24,
    isLiked: false
  },
  {
    id: 'p2',
    author: 'Школа «Грани»',
    authorRole: 'Пресс-служба центра',
    title: 'Осенний турнир юных шахматистов',
    text: 'Поздравляем наших учеников с блестящей серией шахматных партий! Тишина в зале стояла звенящая — ребята продумывали ходы на 3 шага вперед. Благодарим тренера за прекрасную подготовку.',
    time: 'Вчера в 18:00',
    category: 'events',
    images: [
      'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=600'
    ],
    likes: 38,
    isLiked: true
  },
  {
    id: 'p3',
    author: 'Ольга Васильевна',
    authorRole: 'Классный руководитель 1 «А»',
    title: 'Жизнь школы: прогулка и наблюдение за природой',
    text: 'После уроков и вкусного обеда гуляли на нашей закрытой благоустроенной территории. Собрали гербарий для урока окружающего мира, подышали свежим воздухом перед продленкой.',
    time: '6 ноября',
    category: 'life',
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600'
    ],
    likes: 42,
    isLiked: true
  }
];

export const INITIAL_SHIFTS: StaffShift[] = [
  {
    id: 'sh-1',
    teacherName: 'Ольга Васильевна (Вы)',
    role: 'Классный руководитель 1 «А»',
    date: 'Понедельник, 10 ноя',
    timeRange: '08:00 – 14:00',
    dutyType: 'Уроки 1 «А» + Дежурство по столовой',
    isOvertime: false,
    status: 'confirmed'
  },
  {
    id: 'sh-2',
    teacherName: 'Ольга Васильевна (Вы)',
    role: 'Педагог продленного дня',
    date: 'Понедельник, 10 ноя',
    timeRange: '14:00 – 19:00',
    dutyType: 'Продленка: выполнение ДЗ и прогулка',
    isOvertime: true,
    overtimeHours: 2,
    overtimeReason: 'Замещение воспитателя продленки 2 класса',
    status: 'confirmed'
  },
  {
    id: 'sh-3',
    teacherName: 'Ольга Васильевна (Вы)',
    role: 'Классный руководитель 1 «А»',
    date: 'Вторник, 11 ноя',
    timeRange: '08:15 – 14:30',
    dutyType: 'Уроки 1 «А» + Утренний фильтр на входе',
    isOvertime: false,
    status: 'confirmed'
  },
  {
    id: 'sh-4',
    teacherName: 'Ольга Васильевна (Вы)',
    role: 'Педагог продленного дня',
    date: 'Среда, 12 ноя',
    timeRange: '14:00 – 18:00',
    dutyType: 'Кураторство шахматной секции',
    isOvertime: false,
    status: 'confirmed'
  }
];

export const WEEKLY_SCHEDULE: WeeklyScheduleDay[] = [
  {
    dayName: 'Понедельник',
    lessons: [
      { time: '08:30 – 09:15', subject: 'Математика (Петерсон)', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '09:25 – 10:10', subject: 'Русский язык (Школа России)', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '10:10 – 10:40', subject: 'Горячий завтрак в столовой', teacher: 'Кухня Грани', room: 'Столовая' },
      { time: '10:40 – 11:25', subject: 'Литературное чтение', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '11:45 – 12:30', subject: 'Окружающий мир & Прогулка', teacher: 'Ольга Васильевна', room: 'Парк/Каб. 204' },
      { time: '13:00 – 14:00', subject: 'Обед и отдых в игровой', teacher: 'Воспитатели', room: 'Зона отдыха' },
      { time: '14:00 – 17:00', subject: 'Продленка: Выполнение ДЗ', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '17:00 – 18:30', subject: 'Кружки и мастерские', teacher: 'Педагоги доп. обр.', room: 'IT-класс' }
    ]
  },
  {
    dayName: 'Вторник',
    lessons: [
      { time: '08:30 – 09:15', subject: 'Математика & Логика', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '09:25 – 10:10', subject: 'Английский язык (Cambridge)', teacher: 'Анна Сергеевна', room: 'Каб. 208' },
      { time: '10:10 – 10:40', subject: 'Горячий завтрак', teacher: 'Кухня Грани', room: 'Столовая' },
      { time: '10:40 – 11:25', subject: 'Письмо и каллиграфия', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '11:45 – 12:30', subject: 'Физическая культура & ЛФК', teacher: 'Павел Игоревич', room: 'Спортзал' },
      { time: '13:00 – 14:00', subject: 'Обед и прогулка на свежем воздухе', teacher: 'Воспитатели', room: 'Двор' },
      { time: '14:00 – 17:00', subject: 'Продленка: ДЗ без стресса', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '16:30 – 17:30', subject: 'Робототехника LEGO Education', teacher: 'Максим Сергеевич', room: 'IT-лаборатория' }
    ]
  },
  {
    dayName: 'Среда',
    lessons: [
      { time: '08:30 – 09:15', subject: 'Русский язык & Развитие речи', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '09:25 – 10:10', subject: 'Математика (Петерсон)', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '10:10 – 10:40', subject: 'Горячий завтрак в столовой', teacher: 'Кухня Грани', room: 'Столовая' },
      { time: '10:40 – 11:25', subject: 'Нейрогимнастика и логика', teacher: 'Мария Алексеевна', room: 'Зал ЛФК' },
      { time: '13:00 – 14:00', subject: 'Обед и прогулка', teacher: 'Воспитатели', room: 'Двор' },
      { time: '14:00 – 17:00', subject: 'Продленка: Выполнение ДЗ', teacher: 'Екатерина Дмитриевна', room: 'Каб. 204' },
      { time: '15:30 – 16:30', subject: 'Шахматный клуб', teacher: 'Игорь Викторович', room: 'Каб. 105' }
    ]
  },
  {
    dayName: 'Четверг',
    lessons: [
      { time: '08:30 – 09:15', subject: 'Английский язык (Cambridge)', teacher: 'Анна Сергеевна', room: 'Каб. 208' },
      { time: '09:25 – 10:10', subject: 'Математика (Петерсон)', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '10:10 – 10:40', subject: 'Горячий завтрак', teacher: 'Кухня Грани', room: 'Столовая' },
      { time: '10:40 – 11:25', subject: 'Литературное чтение', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '13:00 – 14:00', subject: 'Обед и отдых', teacher: 'Воспитатели', room: 'Игровая' },
      { time: '14:00 – 17:00', subject: 'Продленка: Выполнение ДЗ', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '16:30 – 17:30', subject: 'Робототехника & IT', teacher: 'Максим Сергеевич', room: 'IT-лаборатория' }
    ]
  },
  {
    dayName: 'Пятница',
    lessons: [
      { time: '08:30 – 09:15', subject: 'Окружающий мир (проекты)', teacher: 'Ольга Васильевна', room: 'Каб. 204' },
      { time: '09:25 – 10:10', subject: 'Творческая мастерская', teacher: 'Екатерина Дмитриевна', room: 'Арт-студия' },
      { time: '10:10 – 10:40', subject: 'Горячий завтрак', teacher: 'Кухня Грани', room: 'Столовая' },
      { time: '10:40 – 11:25', subject: 'Музыка и театр', teacher: 'Светлана Олеговна', room: 'Актовый зал' },
      { time: '13:00 – 14:00', subject: 'Обед и прогулка', teacher: 'Воспитатели', room: 'Парк' },
      { time: '14:00 – 16:00', subject: 'Продленка: Закрепление недели', teacher: 'Екатерина Дмитриевна', room: 'Каб. 204' },
      { time: '16:00 – 17:30', subject: 'Гончарная мастерская', teacher: 'Екатерина Дмитриевна', room: 'Мастерская' }
    ]
  }
];

export const INITIAL_WEEKLY_MENU: DayMenu[] = [
  INITIAL_MENU,
  {
    date: 'Вторник',
    dayName: 'Вторник',
    breakfast: [
      { name: 'Молочная рисовая каша с тыквой и маслом', weight: '200 г', calories: 220, allergens: ['Лактоза'] },
      { name: 'Омлет пышный запеченный с зеленью', weight: '130 г', calories: 195, allergens: ['Яйца', 'Лактоза'] },
      { name: 'Какао с молоком / шиповник', weight: '200 мл', calories: 110 }
    ],
    lunch: [
      { name: 'Борщ со сметаной (на говяжьем бульоне)', weight: '250 мл', calories: 210, allergens: ['Лактоза'] },
      { name: 'Филе белой рыбы на пару под сырной шапкой', weight: '120 г', calories: 240, allergens: ['Рыба'] },
      { name: 'Гречка рассыпчатая фермерская', weight: '150 г', calories: 175 },
      { name: 'Компот из сухофруктов без сахара', weight: '200 мл', calories: 60 }
    ],
    afternoonSnack: [
      { name: 'Яблочный штрудель домашний / Печенье овсяное', weight: '90 г', calories: 220, allergens: ['Глютен'] },
      { name: 'Био-ряженка / Фруктовый салат', weight: '180 мл', calories: 130, allergens: ['Лактоза'] }
    ]
  },
  {
    date: 'Среда',
    dayName: 'Среда',
    breakfast: [
      { name: 'Пшенная каша с яблоками и корицей', weight: '200 г', calories: 215 },
      { name: 'Бутерброд со сливочным маслом и сыром', weight: '60 г', calories: 165, allergens: ['Лактоза', 'Глютен'] },
      { name: 'Чай с мятой и медом', weight: '200 мл', calories: 40 }
    ],
    lunch: [
      { name: 'Крем-суп из брокколи и цветной капусты с сухариками', weight: '250 мл', calories: 170, allergens: ['Лактоза'] },
      { name: 'Котлета куриная рубленая запеченная', weight: '120 г', calories: 230 },
      { name: 'Рис бурый с овощами', weight: '150 г', calories: 185 },
      { name: 'Морс ягодный домашний', weight: '200 мл', calories: 65 }
    ],
    afternoonSnack: [
      { name: 'Блинчики с творожной начинкой', weight: '140 г', calories: 260, allergens: ['Лактоза', 'Глютен'] },
      { name: 'Бананы и мандарины', weight: '130 г', calories: 95 }
    ]
  },
  {
    date: 'Четверг',
    dayName: 'Четверг',
    breakfast: [
      { name: 'Гречневая каша с молоком', weight: '200 г', calories: 210, allergens: ['Лактоза'] },
      { name: 'Творожная запеканка с грушей', weight: '130 г', calories: 225, allergens: ['Лактоза'] },
      { name: 'Компот яблочный', weight: '200 мл', calories: 55 }
    ],
    lunch: [
      { name: 'Суп с фрикадельками из индейки', weight: '250 мл', calories: 195 },
      { name: 'Бефстроганов из телятины в нежном соусе', weight: '120 г', calories: 270, allergens: ['Лактоза'] },
      { name: 'Макароны из твердых сортов пшеницы', weight: '150 г', calories: 195, allergens: ['Глютен'] },
      { name: 'Напиток из черной смородины', weight: '200 мл', calories: 60 }
    ],
    afternoonSnack: [
      { name: 'Йогурт натуральный с гранолой', weight: '180 г', calories: 190, allergens: ['Лактоза'] },
      { name: 'Свежая груша', weight: '120 г', calories: 60 }
    ]
  },
  {
    date: 'Пятница',
    dayName: 'Пятница',
    breakfast: [
      { name: 'Овсяные хлопья на молоке с бананом', weight: '200 г', calories: 230, allergens: ['Лактоза'] },
      { name: 'Вареное яйцо и свежие овощи', weight: '100 г', calories: 110, allergens: ['Яйца'] },
      { name: 'Чай с лимоном', weight: '200 мл', calories: 30 }
    ],
    lunch: [
      { name: 'Щи из свежей капусты на овощном бульоне', weight: '250 мл', calories: 155 },
      { name: 'Запеченное филе курицы с травами', weight: '125 г', calories: 220 },
      { name: 'Булгур с морковью и зеленью', weight: '150 г', calories: 180, allergens: ['Глютен'] },
      { name: 'Кисель вишневый', weight: '200 мл', calories: 85 }
    ],
    afternoonSnack: [
      { name: 'Ватрушка домашняя с творогом', weight: '100 г', calories: 250, allergens: ['Глютен', 'Лактоза'] },
      { name: 'Кефир фермерский', weight: '200 мл', calories: 100, allergens: ['Лактоза'] }
    ]
  }
];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Ольга Васильевна Соколова',
    role: 'Классный руководитель 1 «А»',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    status: 'inside',
    checkInTime: '07:55',
    location: 'Кабинет 204',
    phone: '+7 (903) 858-01-12'
  },
  {
    id: 'st-2',
    name: 'Екатерина Дмитриевна Белова',
    role: 'Куратор продленки и мастерских',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    status: 'inside',
    checkInTime: '10:30',
    location: 'Мастерская / Продленка',
    phone: '+7 (905) 655-02-44'
  },
  {
    id: 'st-3',
    name: 'Анна Сергеевна Лебедева',
    role: 'Преподаватель английского языка',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    status: 'inside',
    checkInTime: '08:20',
    location: 'Кабинет 208',
    phone: '+7 (920) 411-77-19'
  },
  {
    id: 'st-4',
    name: 'Максим Сергеевич Орлов',
    role: 'Преподаватель робототехники',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    status: 'outside',
    checkInTime: 'С 16:00 по графику',
    location: 'IT-лаборатория',
    phone: '+7 (910) 244-55-01'
  },
  {
    id: 'st-5',
    name: 'Наталья Петровна Громова',
    role: 'Шеф-повар школьной кухни',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
    status: 'inside',
    checkInTime: '06:45',
    location: 'Пищеблок',
    phone: '+7 (903) 858-99-03'
  }
];

export const INITIAL_ALERTS: ParentAlert[] = [
  {
    id: 'al-1',
    studentId: 's1',
    invoiceId: 'inv-3',
    title: 'Напоминание о счете',
    message: 'Выставлен счет СЧ-2026/11-125 за абонемент «Робототехника» на сумму 4 400 ₽ (до 20.11.2026).',
    createdAt: 'Сегодня, 09:15',
    read: false,
    type: 'debt'
  },
  {
    id: 'al-2',
    studentId: 's1',
    title: 'ДЗ выполнено на продленке',
    message: 'Ольга Васильевна отметила: домашнее задание по математике и прописи выполнено в полном объеме!',
    createdAt: 'Вчера, 16:45',
    read: true,
    type: 'homework'
  }
];

export const INITIAL_SHIFT_HANDOFF: ShiftHandoff = {
  date: 'Сегодня',
  time: '15:00',
  fromStaffName: 'Анна Сергеевна Воронова (Куратор 1 ступени)',
  toStaffName: 'Марина Игоревна Светлова (Педагог продленки)',
  notes: 'Все дети 1 ступени накормлены обедом, ДЗ по математике выполнено. В 17:00 Михаил Грачев идет на пробное по хореографии.',
  confirmed: true
};
