import { Text, View, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
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

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  console.log('StudentsScreen rendered with', students.length, 'students');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('students');
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        console.log('Loaded students:', parsedStudents);
        setStudents(parsedStudents);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const saveStudents = async (updatedStudents: Student[]) => {
    try {
      await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
      console.log('Students saved successfully');
    } catch (error) {
      console.error('Error saving students:', error);
    }
  };

  const addStudent = async () => {
    if (!newStudentName.trim()) {
      Alert.alert(t('error'), t('enterStudentName'));
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    console.log('Adding new student:', newStudent);
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    await saveStudents(updatedStudents);

    setNewStudentName('');
    setNewStudentEmail('');
    setIsAddingStudent(false);
  };

  const deleteStudent = async (studentId: string) => {
    Alert.alert(
      t('deleteStudent'),
      t('deleteStudentConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            console.log('Deleting student with id:', studentId);
            const updatedStudents = students.filter(s => s.id !== studentId);
            setStudents(updatedStudents);
            await saveStudents(updatedStudents);
          },
        },
      ]
    );
  };

  const goBack = () => {
    console.log('Going back to main screen');
    router.back();
  };

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
          <Text style={commonStyles.title}>{t('students')} ({students.length})</Text>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.section}>
          {!isAddingStudent ? (
            <View style={commonStyles.card}>
              <Button
                text={t('addNewStudent')}
                onPress={() => setIsAddingStudent(true)}
                style={buttonStyles.primary}
              />
            </View>
          ) : (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>{t('addNewStudent')}</Text>
              <TextInput
                style={commonStyles.input}
                placeholder={t('studentName')}
                value={newStudentName}
                onChangeText={setNewStudentName}
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={commonStyles.input}
                placeholder={t('email')}
                value={newStudentEmail}
                onChangeText={setNewStudentEmail}
                keyboardType="email-address"
                placeholderTextColor={colors.textSecondary}
              />
              <View style={commonStyles.row}>
                <Button
                  text={t('cancel')}
                  onPress={() => {
                    setIsAddingStudent(false);
                    setNewStudentName('');
                    setNewStudentEmail('');
                  }}
                  style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
                  textStyle={{ color: colors.primary }}
                />
                <Button
                  text={t('addStudent')}
                  onPress={addStudent}
                  style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                />
              </View>
            </View>
          )}

          {students.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Icon name="people-outline" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
              <Text style={commonStyles.text}>{t('noStudentsYet')}</Text>
              <Text style={commonStyles.textSecondary}>{t('addFirstStudent')}</Text>
            </View>
          ) : (
            students.map((student) => (
              <View key={student.id} style={commonStyles.card}>
                <View style={commonStyles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={commonStyles.text}>{student.name}</Text>
                    {student.email && (
                      <Text style={commonStyles.textSecondary}>{student.email}</Text>
                    )}
                    <Text style={commonStyles.textSecondary}>
                      {t('added')}: {new Date(student.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Button
                    text={t('delete')}
                    onPress={() => deleteStudent(student.id)}
                    style={{ backgroundColor: colors.error, width: 'auto', paddingHorizontal: 16 }}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}