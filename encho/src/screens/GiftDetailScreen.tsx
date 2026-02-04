import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList, getProductById, formatPrice } from '../types';
import { addToCart } from '../storage';

const { width } = Dimensions.get('window');

type GiftDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GiftDetail'>;
  route: RouteProp<RootStackParamList, 'GiftDetail'>;
};

export function GiftDetailScreen({
  navigation,
  route,
}: GiftDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const product = getProductById(productId);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>商品が見つかりません</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      Alert.alert(
        'カートに追加しました',
        `${product.name}｜${product.nameJa} × ${quantity}`,
        [
          { text: '買い物を続ける', style: 'cancel' },
          {
            text: 'カートを見る',
            onPress: () => navigation.navigate('Cart'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', 'カートへの追加に失敗しました');
    } finally {
      setIsAdding(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
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
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <Image
          source={require('../../assets/No6_demo.png')}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Gift Message */}
        <View style={styles.giftMessageContainer}>
          <Text style={styles.giftMessage}>
            言葉を減らして、気持ちを残す。
          </Text>
          <Text style={styles.giftSubMessage}>
            派手な演出はありません。{'\n'}
            ただ、静かに、確かに伝わります。
          </Text>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {product.name}｜{product.nameJa}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.productTagline}>{product.tagline}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>内容量</Text>
            <Text style={styles.detailValue}>{product.volume}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>価格</Text>
            <Text style={styles.detailValue}>{formatPrice(product.price)}</Text>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>数量</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.addButton, isAdding && styles.addButtonDisabled]}
            onPress={handleAddToCart}
            disabled={isAdding}
          >
            <Text style={styles.addButtonText}>
              {isAdding ? '追加中...' : 'ギフトとしてカートに追加'}
            </Text>
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.textMuted,
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
  },
  cartText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  productImage: {
    width: width,
    height: width * 0.8,
  },
  giftMessageContainer: {
    padding: spacing.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  giftMessage: {
    ...typography.headlineMedium,
    color: colors.textOnDark,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  giftSubMessage: {
    ...typography.bodyMedium,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  productInfo: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  productName: {
    ...typography.headlineLarge,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  productTagline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  detailsContainer: {
    marginHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  detailValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quantityLabel: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    ...typography.headlineMedium,
    color: colors.text,
  },
  quantityValue: {
    ...typography.bodyLarge,
    color: colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  actionContainer: {
    padding: spacing.xl,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  addButtonText: {
    ...typography.labelLarge,
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
