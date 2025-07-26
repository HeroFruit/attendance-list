import { I18n } from 'i18n-js';

// Define the translations
const translations = {
  en: {
    // Main Screen
    attendanceTracker: 'Attendance Tracker',
    manageClassAttendance: 'Manage your class attendance easily',
    manageStudents: 'Manage Students',
    addEditViewStudents: 'Add, edit, and view your student list',
    viewStudents: 'View Students',
    takeAttendance: 'Take Attendance',
    markStudentsPresent: 'Mark students as present or absent for today',
    viewReports: 'View Reports',
    seeAttendanceStats: 'See attendance statistics and history',
    
    // Students Screen
    students: 'Students',
    addNewStudent: '+ Add New Student',
    studentName: 'Student Name *',
    email: 'Email (optional)',
    cancel: 'Cancel',
    addStudent: 'Add Student',
    noStudentsYet: 'No students added yet',
    addFirstStudent: 'Add your first student to get started',
    delete: 'Delete',
    added: 'Added',
    deleteStudent: 'Delete Student',
    deleteStudentConfirm: 'Are you sure you want to delete this student?',
    error: 'Error',
    enterStudentName: 'Please enter a student name',
    back: '← Back',
    
    // Attendance Screen
    attendance: 'Attendance',
    todaysSummary: "Today's Summary",
    present: 'Present',
    absent: 'Absent',
    marked: 'Marked',
    noStudentsFound: 'No students found',
    addStudentsFirst: 'Add students first to take attendance',
    addStudents: 'Add Students',
    markedAs: 'Marked as',
    loading: 'Loading...',
    
    // Reports Screen
    reports: 'Reports',
    overallStatistics: 'Overall Statistics',
    attendanceRate: 'Attendance Rate',
    recentActivity: 'Recent Activity',
    studentStatistics: 'Student Statistics',
    noAttendanceData: 'No attendance data yet',
    days: 'days',
    noAttendanceRecords: 'No attendance records yet',
    startTakingAttendance: 'Start taking attendance to see reports',
    loadingReports: 'Loading reports...',
    
    // Common
    ok: 'OK',
  },
  de: {
    // Main Screen
    attendanceTracker: 'Anwesenheitstracker',
    manageClassAttendance: 'Verwalten Sie die Anwesenheit Ihrer Klasse einfach',
    manageStudents: 'Schüler verwalten',
    addEditViewStudents: 'Schülerliste hinzufügen, bearbeiten und anzeigen',
    viewStudents: 'Schüler anzeigen',
    takeAttendance: 'Anwesenheit erfassen',
    markStudentsPresent: 'Schüler für heute als anwesend oder abwesend markieren',
    viewReports: 'Berichte anzeigen',
    seeAttendanceStats: 'Anwesenheitsstatistiken und -verlauf anzeigen',
    
    // Students Screen
    students: 'Schüler',
    addNewStudent: '+ Neuen Schüler hinzufügen',
    studentName: 'Schülername *',
    email: 'E-Mail (optional)',
    cancel: 'Abbrechen',
    addStudent: 'Schüler hinzufügen',
    noStudentsYet: 'Noch keine Schüler hinzugefügt',
    addFirstStudent: 'Fügen Sie Ihren ersten Schüler hinzu, um zu beginnen',
    delete: 'Löschen',
    added: 'Hinzugefügt',
    deleteStudent: 'Schüler löschen',
    deleteStudentConfirm: 'Sind Sie sicher, dass Sie diesen Schüler löschen möchten?',
    error: 'Fehler',
    enterStudentName: 'Bitte geben Sie einen Schülernamen ein',
    back: '← Zurück',
    
    // Attendance Screen
    attendance: 'Anwesenheit',
    todaysSummary: 'Heutige Zusammenfassung',
    present: 'Anwesend',
    absent: 'Abwesend',
    marked: 'Markiert',
    noStudentsFound: 'Keine Schüler gefunden',
    addStudentsFirst: 'Fügen Sie zuerst Schüler hinzu, um die Anwesenheit zu erfassen',
    addStudents: 'Schüler hinzufügen',
    markedAs: 'Markiert als',
    loading: 'Laden...',
    
    // Reports Screen
    reports: 'Berichte',
    overallStatistics: 'Gesamtstatistiken',
    attendanceRate: 'Anwesenheitsrate',
    recentActivity: 'Letzte Aktivitäten',
    studentStatistics: 'Schülerstatistiken',
    noAttendanceData: 'Noch keine Anwesenheitsdaten',
    days: 'Tage',
    noAttendanceRecords: 'Noch keine Anwesenheitsaufzeichnungen',
    startTakingAttendance: 'Beginnen Sie mit der Anwesenheitserfassung, um Berichte zu sehen',
    loadingReports: 'Berichte werden geladen...',
    
    // Common
    ok: 'OK',
  },
};

// Create and configure the i18n instance
const i18n = new I18n(translations);

// Set default locale
i18n.defaultLocale = 'en';
i18n.locale = 'en';

// Enable fallbacks
i18n.enableFallback = true;

export default i18n;

// Helper function to translate text
export const t = (key: string, options?: any) => {
  return i18n.t(key, options);
};

// Function to change language
export const setLanguage = (locale: string) => {
  i18n.locale = locale;
};

// Function to get current language
export const getCurrentLanguage = () => {
  return i18n.locale;
};