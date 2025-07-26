import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { t } from '../utils/i18n';

export default function MainScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  console.log('MainScreen rendered');

  // Force re-render when language changes
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
      <LanguageSwitcher />
      
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>{t('attendanceTracker')}</Text>
        <Text style={commonStyles.textSecondary}>{t('manageClassAttendance')}</Text>
      </View>
      
      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.section}>
          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="people" size={24} style={{ color: colors.primary }} />
              <Text style={commonStyles.subtitle}>{t('manageStudents')}</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              {t('addEditViewStudents')}
            </Text>
            <View style={{ marginTop: 16 }}>
              <Button
                text={t('viewStudents')}
                onPress={navigateToStudents}
                style={buttonStyles.primary}
              />
            </View>
          </View>

          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="checkmark-circle" size={24} style={{ color: colors.success }} />
              <Text style={commonStyles.subtitle}>{t('takeAttendance')}</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              {t('markStudentsPresent')}
            </Text>
            <View style={{ marginTop: 16 }}>
              <Button
                text={t('takeAttendance')}
                onPress={navigateToAttendance}
                style={buttonStyles.success}
              />
            </View>
          </View>

          <View style={commonStyles.card}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Icon name="bar-chart" size={24} style={{ color: colors.warning }} />
              <Text style={commonStyles.subtitle}>{t('viewReports')}</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              {t('seeAttendanceStats')}
            </Text>
            <View style={{ marginTop: 16 }}>
              <Button
                text={t('viewReports')}
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