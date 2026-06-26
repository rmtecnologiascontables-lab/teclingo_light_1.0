import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'normal';
type Language = 'es' | 'en';

interface Event {
  id: string;
  day: number;
  title: string;
  type: 'SCHOOL' | 'HOLIDAY' | 'TECLINGO';
  description: string;
  time?: string;
  visibility: ('GLOBAL' | 'DOCENTE' | 'ALUMNO')[];
}

export type UserRole = 'DIRECTOR' | 'DOCENTE' | 'ALUMNO' | 'TUTOR' | 'ADMIN';

export interface SyllabusUnit {
  number: number;
  title: string;
  topics: string[];
}

export interface Syllabus {
  generalObjective: string;
  units: SyllabusUnit[];
}

export interface Subject {
  id: string;
  clave: string;
  name: string;
  weeklyHours: number;
  careerId: string;
  semester: number;
  syllabus?: Syllabus;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  maxHours: number;
  qualifiedSubjects: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface GroupSubject extends Subject {
  assignedTeacherId?: string;
  isCompleted: boolean;
}

export interface Group {
  id: string;
  name: string;
  level: string;
  careerId: string;
  subjects: GroupSubject[];
  teacherId: string;
  studentIds: string[];
  schedule: any;
  time: string;
  days: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  isDirector?: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  type: 'GROUP' | 'DIRECT' | 'GLOBAL';
  participants: string[];
  messages: Message[];
  lastMessage?: string;
  unreadCount: number;
}

export interface FolioSignature {
  teacherId: string;
  teacherName: string;
  signatureData: string;
  timestamp: string;
}

export interface FolioEvidence {
  teacherId: string;
  teacherName: string;
  fileName: string;
  fileUrl: string;
  timestamp: string;
}

export interface Folio {
  id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
  senderName: string;
  assignedToIds: string[];
  signatures: FolioSignature[];
  evidence: FolioEvidence[];
  status: 'PENDING' | 'COMPLETED';
}

export interface Career {
  id: string;
  name: string;
  claveReticula: string;
  horasLimiteSemestre: number;
  subjects: Subject[];
}

interface AppContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userProgress: number;
  setUserProgress: (progress: number) => void;
  globalEvents: Event[];
  addGlobalEvent: (event: Event) => void;
  updateGlobalEvent: (event: Event) => void;
  deleteGlobalEvent: (id: string) => void;
  careers: Career[];
  subjects: Subject[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  institutionName: string;
  setInstitutionName: (name: string) => void;
  institutionLogo: string;
  setInstitutionLogo: (logo: string) => void;
  quickChatUser: any | null;
  setQuickChatUser: (user: any | null) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (mode: boolean) => void;
  currentRole: UserRole;
  isExtracurricularUnlocked: boolean;
  setIsExtracurricularUnlocked: (isUnlocked: boolean) => void;
}

const mockEvents: Event[] = [
  { id: '1', day: 15, title: 'Examen Global A1', type: 'SCHOOL', description: 'Evaluación final del primer bloque de Basic English.', time: '08:00 AM', visibility: ['GLOBAL'] },
  { id: '2', day: 20, title: 'Día de la Revolución', type: 'HOLIDAY', description: 'Suspensión de labores académicas por fecha oficial.', time: 'Todo el día', visibility: ['GLOBAL'] },
  { id: '3', day: 22, title: 'AI Workshop: Prompt Engineering', type: 'TECLINGO', description: 'Taller presencial sobre el uso de la IA en la creación de prompts para aprendizaje de idiomas.', time: '04:00 PM', visibility: ['ALUMNO'] },
  { id: '4', day: 25, title: 'Lanzamiento: Album AR Linguistic', type: 'TECLINGO', description: 'Evento especial con realidad aumentada para la presentación de nuevo material auditivo.', time: '06:00 PM', visibility: ['GLOBAL'] },
];

const translations = {
  es: {
    dashboard: 'Panel de Control',
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    profile: 'Mi Perfil',
    adn: 'Mi ADN',
    skills: 'Habilidades',
    normal: 'Normal',
    dark: 'Oscuro',
    light: 'Claro',
    english: 'Inglés',
    spanish: 'Español',
    welcome: '¡Hola!',
    progress: 'Progreso',
    new: 'NUEVO',
    logout: 'Cerrar Sesión',
    back: 'Volver',
    my_dashboard: 'Mi Dashboard',
    progress_map: 'Mapa de Progreso',
    ai_support: 'Soporte AI',
    pdp: 'Habilidades (PDP)',
    my_group: 'Mi Grupo',
    tasks: 'Tareas / Exámenes',
    grades: 'Calificaciones',
    calendar: 'Mi Calendario',
    folios: 'Mis Folios',
    messages: 'Mis Mensajes',
    achievements: 'Logros'
  },
  en: {
    dashboard: 'Dashboard',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    profile: 'Profile',
    adn: 'My ADN',
    skills: 'Skills',
    normal: 'Normal',
    dark: 'Dark',
    light: 'Light',
    english: 'English',
    spanish: 'Spanish',
    welcome: 'Hello!',
    progress: 'Progress',
    new: 'NEW',
    logout: 'Logout',
    back: 'Back',
    my_dashboard: 'My Dashboard',
    progress_map: 'Progress Map',
    ai_support: 'AI Support',
    pdp: 'Skills (PDP)',
    my_group: 'My Group',
    tasks: 'Tasks / Exams',
    grades: 'Grades',
    calendar: 'My Calendar',
    folios: 'My Folios',
    messages: 'My Messages',
    achievements: 'Achievements'
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const currentRole: UserRole = 'ALUMNO';
  const [isExtracurricularUnlocked, setIsExtracurricularUnlocked] = useState(() => localStorage.getItem('extracurricular_unlocked') === 'true');

  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'es');
  const [userProgress, setUserProgress] = useState(75);
  const [globalEvents, setGlobalEvents] = useState<Event[]>(mockEvents);
  const [careers] = useState<Career[]>([]);
  const [subjects] = useState<Subject[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [institutionName, setInstitutionName] = useState('TECLINGO AI');
  const [institutionLogo, setInstitutionLogo] = useState('https://raw.githubusercontent.com/lucide-react/lucide/main/icons/zap.svg');
  const [quickChatUser, setQuickChatUser] = useState<any | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('extracurricular_unlocked', String(isExtracurricularUnlocked));
  }, [isExtracurricularUnlocked]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'normal') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const addGlobalEvent = (event: Event) => {
    setGlobalEvents(prev => [...prev, event]);
  };

  const updateGlobalEvent = (event: Event) => {
    setGlobalEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const deleteGlobalEvent = (id: string) => {
    setGlobalEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{
      theme,
      language,
      setTheme,
      setLanguage,
      t,
      userProgress,
      setUserProgress,
      globalEvents,
      addGlobalEvent,
      updateGlobalEvent,
      deleteGlobalEvent,
      careers,
      subjects,
      isSidebarOpen,
      setIsSidebarOpen,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      institutionName,
      setInstitutionName,
      institutionLogo,
      setInstitutionLogo,
      quickChatUser,
      setQuickChatUser,
      maintenanceMode,
      setMaintenanceMode,
      currentRole,
      isExtracurricularUnlocked,
      setIsExtracurricularUnlocked
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
