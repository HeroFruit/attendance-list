import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { colors } from '../styles/commonStyles';
import { setLanguage, getCurrentLanguage, t } from '../utils/i18n';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const switchLanguage = (lang: string) => {
    console.log('Switching language to:', lang);
    setLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Language / Sprache:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.langButton,
            currentLang === 'en' && styles.activeLangButton
          ]}
          onPress={() => switchLanguage('en')}
        >
          <Text style={[
            styles.langButtonText,
            currentLang === 'en' && styles.activeLangButtonText
          ]}>
            EN
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.langButton,
            currentLang === 'de' && styles.activeLangButton
          ]}
          onPress={() => switchLanguage('de')}
        >
          <Text style={[
            styles.langButtonText,
            currentLang === 'de' && styles.activeLangButtonText
          ]}>
            DE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grey,
    borderRadius: 6,
    padding: 2,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  activeLangButton: {
    backgroundColor: colors.primary,
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeLangButtonText: {
    color: '#FFFFFF',
  },
});