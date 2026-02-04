import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList, User, Order, formatPrice } from '../types';
import { getUser, getAllOrders, isLoggedIn } from '../storage';

type MyPageScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyPage'>;
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '注文受付',
  processing: '準備中',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル',
};

function OrderCard({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  const date = new Date(order.orderedAt);
  const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{formattedDate}</Text>
        <View style={styles.orderStatus}>
          <Text style={styles.orderStatusText}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </Text>
        </View>
      </View>
      <View style={styles.orderContent}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.orderItem}>
            {item.productName} × {item.quantity}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.orderMore}>
            他 {order.items.length - 2} 点
          </Text>
        )}
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{formatPrice(order.totalAmount)}</Text>
        <Text style={styles.orderDetailLink}>詳細を見る</Text>
      </View>
    </TouchableOpacity>
  );
}

export function MyPageScreen({ navigation }: MyPageScreenProps) {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [userData, ordersData, isUserLoggedIn] = await Promise.all([
        getUser(),
        getAllOrders(),
        isLoggedIn(),
      ]);
      setUser(userData);
      setOrders(ordersData);
      setLoggedIn(isUserLoggedIn);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = (order: Order) => {
    Alert.alert(
      '再注文',
      'この注文と同じ商品をカートに追加しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '追加する',
          onPress: async () => {
            // 実際のアプリではカートに追加する処理を実装
            Alert.alert('完了', 'カートに追加しました', [
              { text: 'OK', onPress: () => navigation.navigate('Cart') },
            ]);
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>My Page</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!loggedIn ? (
          /* Not Logged In */
          <View style={styles.authPromptContainer}>
            <Text style={styles.authPromptTitle}>
              会員登録・ログイン
            </Text>
            <View style={styles.authPromptDivider} />
            <Text style={styles.authPromptText}>
              会員登録すると、注文履歴の確認や{'\n'}
              配送先情報の保存ができます。
            </Text>
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Auth', { mode: 'login' })}
              >
                <Text style={styles.loginButtonText}>ログイン</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Auth', { mode: 'register' })}
              >
                <Text style={styles.registerButtonText}>新規会員登録</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Logged In */
          <>
            {/* User Info */}
            <View style={styles.userSection}>
              <Text style={styles.sectionTitle}>会員情報</Text>
              <View style={styles.userCard}>
                <View style={styles.userRow}>
                  <Text style={styles.userLabel}>メールアドレス</Text>
                  <Text style={styles.userValue}>{user?.email}</Text>
                </View>
                {user?.name && (
                  <View style={styles.userRow}>
                    <Text style={styles.userLabel}>お名前</Text>
                    <Text style={styles.userValue}>{user.name}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Order History */}
            <View style={styles.ordersSection}>
              <Text style={styles.sectionTitle}>注文履歴</Text>
              {orders.length === 0 ? (
                <View style={styles.emptyOrders}>
                  <Text style={styles.emptyText}>注文履歴がありません</Text>
                  <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => navigation.navigate('ProductList')}
                  >
                    <Text style={styles.browseButtonText}>商品を見る</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.orderList}>
                  {orders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPress={() => handleReorder(order)}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
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
  authPromptContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    marginTop: spacing.huge,
  },
  authPromptTitle: {
    ...typography.headlineLarge,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  authPromptDivider: {
    width: 40,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  authPromptText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  authButtons: {
    width: '100%',
    gap: spacing.md,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loginButtonText: {
    ...typography.labelLarge,
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  registerButton: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  registerButtonText: {
    ...typography.labelLarge,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  userSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.headlineSmall,
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  userLabel: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  userValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  ordersSection: {
    padding: spacing.lg,
  },
  emptyOrders: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  browseButtonText: {
    ...typography.labelMedium,
    color: colors.textOnDark,
    letterSpacing: 1,
  },
  orderList: {
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderDate: {
    ...typography.labelMedium,
    color: colors.text,
  },
  orderStatus: {
    backgroundColor: colors.backgroundDark,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  orderStatusText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  orderContent: {
    padding: spacing.md,
  },
  orderItem: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  orderMore: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orderTotal: {
    ...typography.priceSmall,
    color: colors.text,
  },
  orderDetailLink: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
});
