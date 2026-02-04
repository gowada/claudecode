import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../types';

type CheckoutCompleteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CheckoutComplete'>;
  route: RouteProp<RootStackParamList, 'CheckoutComplete'>;
};

export function CheckoutCompleteScreen({
  navigation,
}: CheckoutCompleteScreenProps) {
  const insets = useSafeAreaInsets();

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/No6.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>ご注文ありがとうございます</Text>
          <View style={styles.divider} />
          <Text style={styles.message}>
            選んでいただき、ありがとうございます。
          </Text>
          <Text style={styles.message}>
            この蜂蜜が、日常に静かに寄り添いますように。
          </Text>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            ご注文確認メールをお送りしました。
          </Text>
          <Text style={styles.noteText}>
            商品の発送まで、しばらくお待ちください。
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBackToHome}
        >
          <Text style={styles.primaryButtonText}>トップに戻る</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Text style={styles.secondaryButtonText}>注文履歴を見る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 60,
    height: 30,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
    marginBottom: spacing.lg,
    letterSpacing: 1,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  message: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  noteContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionContainer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.labelLarge,
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.labelLarge,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
