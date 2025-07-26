import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function MainScreen() {
  console.log('MainScreen rendered');

  const navigateToStudents = () => {
    console.log('Navigating to students screen');
    router.push('/students');
  };

  const navigateToAttendance = () => {
    console.log('Navigating to attendance screen');
    router.push('/attendance');
  };

  const navigateToReports = () => {
    console.log('Navigating to reports screen');
    router.push('/reports');
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Attendance Tracker</Text>
        <Text style={commonStyles.textSecondary}>Manage your class attendance easily</Text>
      </View>
      
      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.section}>
          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="people" size={24} style={{ color: colors.primary }} />
              <Text style={commonStyles.subtitle}>Manage Students</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Add, edit, and view your student list
            </Text>
            <View style={{ marginTop: 16 }}>
              <Button
                text="View Students"
                onPress={navigateToStudents}
                style={buttonStyles.primary}
              />
            </View>
          </View>

          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="checkmark-circle" size={24} style={{ color: colors.success }} />
              <Text style={commonStyles.subtitle}>Take Attendance</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Mark students as present or absent for today
            </Text>
            <View style={{ marginTop: 16 }}>
              <Button
                text="Take Attendance"
                onPress={navigateToAttendance}
                style={buttonStyles.success}
              />
            </View>
          </View>

          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="bar-chart" size={24} style={{ color: colors.warning }} />
              <Text style={commonStyles.subtitle}>View Reports</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              See attendance statistics and history
            </Text>
            <View style={{ marginTop: 16 }}>
              <Button
                text="View Reports"
                onPress={navigateToReports}
                style={{ backgroundColor: colors.warning }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}