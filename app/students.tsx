import { Text, View, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
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
      Alert.alert('Error', 'Please enter a student name');
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
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
            text="← Back"
            onPress={goBack}
            style={{ backgroundColor: 'transparent', width: 'auto', paddingHorizontal: 0 }}
            textStyle={{ color: colors.primary, fontSize: 16 }}
          />
          <Text style={commonStyles.title}>Students ({students.length})</Text>
        </View>
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.section}>
          {!isAddingStudent ? (
            <View style={commonStyles.card}>
              <Button
                text="+ Add New Student"
                onPress={() => setIsAddingStudent(true)}
                style={buttonStyles.primary}
              />
            </View>
          ) : (
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>Add New Student</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Student Name *"
                value={newStudentName}
                onChangeText={setNewStudentName}
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={commonStyles.input}
                placeholder="Email (optional)"
                value={newStudentEmail}
                onChangeText={setNewStudentEmail}
                keyboardType="email-address"
                placeholderTextColor={colors.textSecondary}
              />
              <View style={commonStyles.row}>
                <Button
                  text="Cancel"
                  onPress={() => {
                    setIsAddingStudent(false);
                    setNewStudentName('');
                    setNewStudentEmail('');
                  }}
                  style={[buttonStyles.secondary, { flex: 1, marginRight: 8 }]}
                  textStyle={{ color: colors.primary }}
                />
                <Button
                  text="Add Student"
                  onPress={addStudent}
                  style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                />
              </View>
            </View>
          )}

          {students.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.centerContent]}>
              <Icon name="people-outline" size={48} style={{ color: colors.textSecondary, marginBottom: 16 }} />
              <Text style={commonStyles.text}>No students added yet</Text>
              <Text style={commonStyles.textSecondary}>Add your first student to get started</Text>
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
                      Added: {new Date(student.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Button
                    text="Delete"
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