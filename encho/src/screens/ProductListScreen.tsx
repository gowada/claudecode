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
import { RootStackParamList, PRODUCTS, Product, formatPrice } from '../types';
import { getCart, getCartItemCount } from '../storage';

const { width } = Dimensions.get('window');

type ProductListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
};

function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
      <Image
        source={require('../../assets/No6_demo.png')}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {product.name}｜{product.nameJa}
        </Text>
        <Text style={styles.productTagline}>{product.tagline}</Text>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
      </View>
      <View style={styles.productAction}>
        <Text style={styles.detailText}>詳細を見る</Text>
      </View>
    </TouchableOpacity>
  );
}

export function ProductListScreen({ navigation }: ProductListScreenProps) {
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
        <Text style={styles.headerTitle}>Products</Text>
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
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>商品一覧</Text>
          <View style={styles.sectionDivider} />
        </View>

        {/* Product List */}
        <View style={styles.productList}>
          {PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: product.id })
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
    marginTop: spacing.md,
  },
  productList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xxl,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: '100%',
    height: width - spacing.lg * 2,
  },
  productInfo: {
    padding: spacing.lg,
  },
  productName: {
    ...typography.headlineSmall,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  productTagline: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  productPrice: {
    ...typography.price,
    color: colors.text,
  },
  productAction: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  detailText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
});
