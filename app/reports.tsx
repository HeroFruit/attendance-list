import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { t } from '../utils/i18n';

interface Student {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

interface StudentStats {
  student: Student;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendanceRate: number;
}

export default function ReportsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('ReportsScreen rendered');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load students
      const storedStudents = await AsyncStorage.getItem('students');
      const parsedStudents = storedStudents ? JSON.parse(storedStudents) : [];
      console.log('Loaded students for reports:', parsedStudents);
      setStudents(parsedStudents);

      // Load attendance history
      const storedHistory = await AsyncStorage.getItem('attendance_history');
      const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
      console.log('Loaded attendance history:', parsedHistory);
      setAttendanceHistory(parsedHistory);

      // Calculate statistics
      const stats = calculateStudentStats(parsedStudents, parsedHistory);
      setStudentStats(stats);
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStudentStats = (students: Student[], history: AttendanceRecord[]): StudentStats[] => {
    return students.map(student => {
      const studentRecords = history.filter(record => record.studentId === student.id);
      const presentDays = studentRecords.filter(record => record.status === 'present').length;
      const absentDays = studentRecords.filter(record => record.status === 'absent').length;
      const totalDays = presentDays + absentDays;
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        student,
        totalDays,
        presentDays,
        absentDays,
        attendanceRate,
      };
    });
  };

  const getRecentDates = () => {
    const dates = [...new Set(attendanceHistory.map(record => record.date))];
    return dates.sort().reverse().slice(0, 7); // Last 7 days with attendance
  };

  const getOverallStats = () => {
    const totalRecords = attendanceHistory.length;
    const presentRecords = attendanceHistory.filter(record => record.status === 'present').length;
    const overallRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;
    
    return {
      totalRecords,
      presentRecords,
      absentRecords: totalRecords - presentRecords,
      overallRate,
    };
  };

  const goBack = () => {
    console.log('Going back to main screen');
    router.back();
  };

  const overallStats = getOverallStats();
  const recentDates = getRecentDates();

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>{t('loadingReports')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <Button
            text={t('back')}
            onPress={goBack}
            style={{ backgroundColor: 'transparent', width: 'auto', paddingHorizontal: 0 }}
            textStyle={{ color: colors.primary, fontSize: 16 }}
          />
          <Text style={commonStyles.title}>{t('reports')}</Text>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.section}>
          {/* Overall Statistics */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>{t('overallStatistics')}</Text>
            <View style={commonStyles.row}>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700' }]}>
                  {overallStats.overallRate.toFixed(1)}%
                </Text>
                <Text style={commonStyles.textSecondary}>{t('attendanceRate')}</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { color: colors.success, fontWeight: '600' }]}>
                  {overallStats.presentRecords}
                </Text>
                <Text style={commonStyles.textSecondary}>{t('present')}</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { color: colors.error, fontWeight: '600' }]}>
                  {overallStats.absentRecords}
                </Text>
                <Text style={commonStyles.textSecondary}>{t('absent')}</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          {recentDates.length > 0 && (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>{t('recentActivity')}</Text>
              {recentDates.map(date => {
                const dayRecords = attendanceHistory.filter(record => record.date === date);
                const presentCount = dayRecords.filter(record => record.status === 'present').length;
                const totalCount = dayRecords.length;
                
                return (
                  <View key={date} style={[commonStyles.row, { marginVertical: 4 }]}>
                    <Text style={commonStyles.text}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <Text style={commonStyles.textSecondary}>
                      {presentCount}/{totalCount} {t('present').toLowerCase()}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Student Statistics */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>{t('studentStatistics')}</Text>
            {studentStats.length === 0 ? (
              <View style={commonStyles.centerContent}>
                <Icon name="bar-chart-outline" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
                <Text style={commonStyles.textSecondary}>{t('noAttendanceData')}</Text>
              </View>
            ) : (
              studentStats
                .sort((a, b) => b.attendanceRate - a.attendanceRate)
                .map(stat => (
                  <View key={stat.student.id} style={[commonStyles.row, { marginVertical: 8 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={commonStyles.text}>{stat.student.name}</Text>
                      <Text style={commonStyles.textSecondary}>
                        {stat.presentDays}/{stat.totalDays} {t('days')}
                      </Text>
                    </View>
                    <View style={commonStyles.centerContent}>
                      <Text style={[
                        commonStyles.text,
                        { 
                          fontWeight: '600',
                          color: stat.attendanceRate >= 80 ? colors.success : 
                                stat.attendanceRate >= 60 ? colors.warning : colors.error
                        }
                      ]}>
                        {stat.attendanceRate.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))
            )}
          </View>

          {attendanceHistory.length === 0 && (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Icon name="calendar-outline" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
              <Text style={commonStyles.text}>{t('noAttendanceRecords')}</Text>
              <Text style={commonStyles.textSecondary}>{t('startTakingAttendance')}</Text>
              <View style={{ marginTop: 16 }}>
                <Button
                  text={t('takeAttendance')}
                  onPress={() => router.push('/attendance')}
                  style={buttonStyles.primary}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}