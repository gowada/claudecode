import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, animation } from '../theme';
import { RootStackParamList } from '../types';
import { getCart, getCartItemCount } from '../storage';

const { width } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animation.duration.slow,
      useNativeDriver: true,
    }).start();

    loadCartCount();
  }, [fadeAnim]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartCount();
    });
    return unsubscribe;
  }, [navigation]);

  const loadCartCount = async () => {
    const cart = await getCart();
    setCartCount(getCartItemCount(cart));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Brand')}
        >
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>
        <Image
          source={require('../../assets/No6.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('MyPage')}
          >
            <Text style={styles.iconText}>My</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.iconText}>Cart</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          {/* Hero Image */}
          <Image
            source={require('../../assets/No6_demo.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Main Copy */}
          <View style={styles.copyContainer}>
            <Text style={styles.mainCopy}>自然の叡智を、静かに選ぶ。</Text>
            <View style={styles.copyDivider} />
            <Text style={styles.subCopy}>最小で、最大を満たす。</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('ProductList')}
            >
              <Text style={styles.primaryButtonText}>商品一覧</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('GiftList')}
            >
              <Text style={styles.secondaryButtonText}>ギフト一覧</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Brand')}>
            <Text style={styles.footerLink}>ブランドについて</Text>
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
  menuButton: {
    padding: spacing.sm,
  },
  menuText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  headerLogo: {
    width: 60,
    height: 30,
    tintColor: colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconButton: {
    padding: spacing.sm,
  },
  cartButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  iconText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    ...typography.labelSmall,
    color: colors.textOnDark,
    fontSize: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
  },
  heroImage: {
    width: width,
    height: width * 1.2,
  },
  copyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  mainCopy: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 3,
  },
  copyDivider: {
    width: 40,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  subCopy: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
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
  footer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.textMuted,
    letterSpacing: 1,
  },
});
