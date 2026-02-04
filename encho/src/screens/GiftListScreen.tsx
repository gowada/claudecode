import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList, GIFT_PRODUCTS, Product, formatPrice } from '../types';
import { getCart, getCartItemCount } from '../storage';

const { width } = Dimensions.get('window');

type GiftListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GiftList'>;
};

function GiftCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.giftCard} onPress={onPress}>
      <Image
        source={require('../../assets/No6_demo.png')}
        style={styles.giftImage}
        resizeMode="cover"
      />
      <View style={styles.giftOverlay}>
        <Text style={styles.giftName}>
          {product.name}｜{product.nameJa}
        </Text>
        <Text style={styles.giftPrice}>{formatPrice(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function GiftListScreen({ navigation }: GiftListScreenProps) {
  const insets = useSafeAreaInsets();
  const [cartCount, setCartCount] = useState(0);

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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gift</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartText}>Cart</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/No6_demo.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>贈るために整えました</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ギフト一覧</Text>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionSubtitle}>
            言葉を減らして、気持ちを残す。
          </Text>
        </View>

        {/* Gift List */}
        <View style={styles.giftList}>
          {GIFT_PRODUCTS.map(product => (
            <GiftCard
              key={product.id}
              product={product}
              onPress={() =>
                navigation.navigate('GiftDetail', { productId: product.id })
              }
            />
          ))}
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
  cartButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  cartText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
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
    paddingBottom: spacing.xxl,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: width * 0.7,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    backgroundColor: colors.overlay,
  },
  heroTitle: {
    ...typography.headlineMedium,
    color: colors.textOnDark,
    textAlign: 'center',
    letterSpacing: 2,
  },
  sectionHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    ...typography.headlineMedium,
    color: colors.text,
    letterSpacing: 2,
  },
  sectionDivider: {
    width: 30,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  sectionSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  giftList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  giftCard: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  giftImage: {
    width: '100%',
    height: 200,
  },
  giftOverlay: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  giftName: {
    ...typography.headlineSmall,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  giftPrice: {
    ...typography.priceSmall,
    color: colors.textSecondary,
  },
});
