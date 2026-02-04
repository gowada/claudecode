import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../types';

type BrandScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Brand'>;
};

export function BrandScreen({ navigation }: BrandScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/No6.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Brand Story */}
        <View style={styles.storyContainer}>
          <Text style={styles.storyText}>
            蜂が六角形を選んだ理由は、
          </Text>
          <Text style={styles.storyText}>
            最小で、最大を満たすため。
          </Text>
          <View style={styles.storyDivider} />
          <Text style={styles.storyText}>
            私たちも、その答えに従いました。
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            No6は、
          </Text>
          <Text style={styles.descriptionText}>
            多くを足さず、
          </Text>
          <Text style={styles.descriptionText}>
            多くを語らず、
          </Text>
          <Text style={styles.descriptionText}>
            ただ、自然が選んだかたちを届けます。
          </Text>
        </View>

        {/* Image */}
        <Image
          source={require('../../assets/No6_demo.png')}
          style={styles.brandImage}
          resizeMode="cover"
        />

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('ProductList')}
          >
            <Text style={styles.ctaButtonText}>商品を見る</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: spacing.sm,
  },
  backText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  headerTitle: {
    ...typography.labelLarge,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  placeholder: {
    width: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  heroContainer: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    backgroundColor: colors.primary,
  },
  logo: {
    width: 100,
    height: 50,
  },
  storyContainer: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  storyText: {
    ...typography.headlineMedium,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  storyDivider: {
    width: 30,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  descriptionContainer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  descriptionText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.5,
  },
  brandImage: {
    width: '100%',
    height: 300,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaButtonText: {
    ...typography.labelLarge,
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
