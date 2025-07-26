import { Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

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

interface DailyAttendance {
  [studentId: string]: 'present' | 'absent';
}

export default function AttendanceScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<DailyAttendance>({});
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  console.log('AttendanceScreen rendered for date:', today);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load students
      const storedStudents = await AsyncStorage.getItem('students');
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        console.log('Loaded students for attendance:', parsedStudents);
        setStudents(parsedStudents);
      }

      // Load today's attendance
      const storedAttendance = await AsyncStorage.getItem(`attendance_${today}`);
      if (storedAttendance) {
        const parsedAttendance = JSON.parse(storedAttendance);
        console.log('Loaded today\'s attendance:', parsedAttendance);
        setTodayAttendance(parsedAttendance);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAttendance = async (attendance: DailyAttendance) => {
    try {
      await AsyncStorage.setItem(`attendance_${today}`, JSON.stringify(attendance));
      console.log('Attendance saved for', today);
      
      // Also save to attendance history
      const historyKey = 'attendance_history';
      const storedHistory = await AsyncStorage.getItem(historyKey);
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      
      // Remove existing records for today and add new ones
      const filteredHistory = history.filter((record: AttendanceRecord) => record.date !== today);
      const newRecords = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        date: today,
        status,
      }));
      
      const updatedHistory = [...filteredHistory, ...newRecords];
      await AsyncStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      console.log('Attendance history updated');
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    console.log('Marking student', studentId, 'as', status);
    const updatedAttendance = {
      ...todayAttendance,
      [studentId]: status,
    };
    setTodayAttendance(updatedAttendance);
    await saveAttendance(updatedAttendance);
  };

  const clearAllAttendance = () => {
    Alert.alert(
      'Clear Attendance',
      'Are you sure you want to clear all attendance for today?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Clearing all attendance for today');
              
              // Clear the state
              setTodayAttendance({});
              
              // Remove today's attendance from AsyncStorage
              await AsyncStorage.removeItem(`attendance_${today}`);
              
              // Also remove today's records from attendance history
              const historyKey = 'attendance_history';
              const storedHistory = await AsyncStorage.getItem(historyKey);
              if (storedHistory) {
                const history = JSON.parse(storedHistory);
                const filteredHistory = history.filter((record: AttendanceRecord) => record.date !== today);
                await AsyncStorage.setItem(historyKey, JSON.stringify(filteredHistory));
                console.log('Attendance history updated - removed records for', today);
              }
              
              console.log('All attendance cleared successfully for', today);
            } catch (error) {
              console.error('Error clearing attendance:', error);
              Alert.alert('Error', 'Failed to clear attendance. Please try again.');
            }
          },
        },
      ]
    );
  };

  const goBack = () => {
    console.log('Going back to main screen');
    router.back();
  };

  const presentCount = Object.values(todayAttendance).filter(status => status === 'present').length;
  const absentCount = Object.values(todayAttendance).filter(status => status === 'absent').length;
  const totalMarked = presentCount + absentCount;

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.header}>
        <View style={commonStyles.row}>
          <Button
            text="← Back"
            onPress={goBack}
            style={{ backgroundColor: 'transparent', width: 'auto', paddingHorizontal: 0 }}
            textStyle={{ color: colors.primary, fontSize: 16 }}
          />
          <Text style={commonStyles.title}>Attendance</Text>
        </View>
        <Text style={commonStyles.textSecondary}>
          {new Date(today).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.section}>
          {/* Summary Card */}
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Today's Summary</Text>
            <View style={commonStyles.row}>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { color: colors.success, fontWeight: '600' }]}>
                  {presentCount}
                </Text>
                <Text style={commonStyles.textSecondary}>Present</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { color: colors.error, fontWeight: '600' }]}>
                  {absentCount}
                </Text>
                <Text style={commonStyles.textSecondary}>Absent</Text>
              </View>
              <View style={commonStyles.centerContent}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {totalMarked}/{students.length}
                </Text>
                <Text style={commonStyles.textSecondary}>Marked</Text>
              </View>
            </View>
            {totalMarked > 0 && (
              <View style={{ marginTop: 16 }}>
                <Button
                  text="Clear All"
                  onPress={clearAllAttendance}
                  style={{ backgroundColor: colors.error }}
                />
              </View>
            )}
          </View>

          {students.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Icon name="people-outline" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
              <Text style={commonStyles.text}>No students found</Text>
              <Text style={commonStyles.textSecondary}>Add students first to take attendance</Text>
              <View style={{ marginTop: 16 }}>
                <Button
                  text="Add Students"
                  onPress={() => router.push('/students')}
                  style={buttonStyles.primary}
                />
              </View>
            </View>
          ) : (
            students.map((student) => {
              const status = todayAttendance[student.id];
              return (
                <View key={student.id} style={commonStyles.card}>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={commonStyles.text}>{student.name}</Text>
                    {student.email && (
                      <Text style={commonStyles.textSecondary}>{student.email}</Text>
                    )}
                  </View>
                  
                  <View style={commonStyles.row}>
                    <Button
                      text="Present"
                      onPress={() => markAttendance(student.id, 'present')}
                      style={[
                        { flex: 1, marginRight: 8 },
                        status === 'present' 
                          ? { backgroundColor: colors.success }
                          : buttonStyles.secondary
                      ]}
                      textStyle={status === 'present' ? { color: '#FFFFFF' } : { color: colors.primary }}
                    />
                    <Button
                      text="Absent"
                      onPress={() => markAttendance(student.id, 'absent')}
                      style={[
                        { flex: 1, marginLeft: 8 },
                        status === 'absent' 
                          ? { backgroundColor: colors.error }
                          : buttonStyles.secondary
                      ]}
                      textStyle={status === 'absent' ? { color: '#FFFFFF' } : { color: colors.primary }}
                    />
                  </View>
                  
                  {status && (
                    <View style={[commonStyles.row, { marginTop: 8 }]}>
                      <Icon 
                        name={status === 'present' ? 'checkmark-circle' : 'close-circle'} 
                        size={16} 
                        style={{ 
                          color: status === 'present' ? colors.success : colors.error,
                          marginRight: 4 
                        }} 
                      />
                      <Text style={[
                        commonStyles.textSecondary,
                        { color: status === 'present' ? colors.success : colors.error }
                      ]}>
                        Marked as {status}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}