import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../types';
import { setFirstLaunchComplete } from '../storage';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await setFirstLaunchComplete();
      navigation.replace('PersonList');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>縁帳</Text>
        <View style={styles.divider} />
        <Text style={styles.mainCopy}>出会いを、資産に。</Text>
        <Text style={styles.subCopy}>縁を残す。次に会うために。</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: spacing.lg,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: colors.secondary,
    marginBottom: spacing.xl,
  },
  mainCopy: {
    ...typography.headlineLarge,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subCopy: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});
