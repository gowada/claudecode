import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList, Cart, ShippingAddress, formatPrice } from '../types';
import {
  getCart,
  getCartTotal,
  createOrder,
  getUser,
  isLoggedIn,
} from '../storage';

type CheckoutScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
};

export function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState<Cart>({ items: [], updatedAt: new Date() });
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    postalCode: '',
    prefecture: '',
    city: '',
    address1: '',
    address2: '',
    name: '',
    phone: '',
  });

  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [cartData, isUserLoggedIn, userData] = await Promise.all([
      getCart(),
      isLoggedIn(),
      getUser(),
    ]);
    setCart(cartData);
    setLoggedIn(isUserLoggedIn);

    if (userData?.shippingAddress) {
      setAddress(userData.shippingAddress);
    }
  };

  const validateAddress = (): boolean => {
    if (!address.postalCode || !address.prefecture || !address.city ||
        !address.address1 || !address.name || !address.phone) {
      Alert.alert('入力エラー', '必須項目を入力してください');
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvc || !cardInfo.name) {
      Alert.alert('入力エラー', 'カード情報を入力してください');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 'address') {
      if (validateAddress()) {
        setStep('payment');
      }
    } else if (step === 'payment') {
      if (validatePayment()) {
        setStep('confirm');
      }
    }
  };

  const handleBackStep = () => {
    if (step === 'payment') {
      setStep('address');
    } else if (step === 'confirm') {
      setStep('payment');
    } else {
      navigation.goBack();
    }
  };

  const handleOrder = async () => {
    setIsProcessing(true);
    try {
      // シミュレートされた決済処理
      await new Promise(resolve => setTimeout(resolve, 1500));

      const order = await createOrder(cart, address);
      navigation.replace('CheckoutComplete', { orderId: order.id });
    } catch (error) {
      Alert.alert('エラー', '注文の処理に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = getCartTotal(cart);

  const renderAddressForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>配送先情報</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>郵便番号 *</Text>
        <TextInput
          style={styles.input}
          value={address.postalCode}
          onChangeText={text => setAddress({ ...address, postalCode: text })}
          placeholder="000-0000"
          keyboardType="numeric"
          maxLength={8}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>都道府県 *</Text>
        <TextInput
          style={styles.input}
          value={address.prefecture}
          onChangeText={text => setAddress({ ...address, prefecture: text })}
          placeholder="東京都"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>市区町村 *</Text>
        <TextInput
          style={styles.input}
          value={address.city}
          onChangeText={text => setAddress({ ...address, city: text })}
          placeholder="渋谷区"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>番地 *</Text>
        <TextInput
          style={styles.input}
          value={address.address1}
          onChangeText={text => setAddress({ ...address, address1: text })}
          placeholder="1-2-3"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>建物名・部屋番号</Text>
        <TextInput
          style={styles.input}
          value={address.address2}
          onChangeText={text => setAddress({ ...address, address2: text })}
          placeholder="〇〇マンション 101"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>お名前 *</Text>
        <TextInput
          style={styles.input}
          value={address.name}
          onChangeText={text => setAddress({ ...address, name: text })}
          placeholder="山田 太郎"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>電話番号 *</Text>
        <TextInput
          style={styles.input}
          value={address.phone}
          onChangeText={text => setAddress({ ...address, phone: text })}
          placeholder="090-0000-0000"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderPaymentForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>お支払い情報</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>カード番号 *</Text>
        <TextInput
          style={styles.input}
          value={cardInfo.number}
          onChangeText={text => setCardInfo({ ...cardInfo, number: text })}
          placeholder="0000 0000 0000 0000"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>有効期限 *</Text>
          <TextInput
            style={styles.input}
            value={cardInfo.expiry}
            onChangeText={text => setCardInfo({ ...cardInfo, expiry: text })}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>CVC *</Text>
          <TextInput
            style={styles.input}
            value={cardInfo.cvc}
            onChangeText={text => setCardInfo({ ...cardInfo, cvc: text })}
            placeholder="000"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>カード名義 *</Text>
        <TextInput
          style={styles.input}
          value={cardInfo.name}
          onChangeText={text => setCardInfo({ ...cardInfo, name: text })}
          placeholder="TARO YAMADA"
          autoCapitalize="characters"
        />
      </View>
    </View>
  );

  const renderConfirm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>ご注文内容の確認</Text>

      <View style={styles.confirmSection}>
        <Text style={styles.confirmLabel}>配送先</Text>
        <Text style={styles.confirmValue}>
          〒{address.postalCode}{'\n'}
          {address.prefecture}{address.city}{address.address1}
          {address.address2 ? `\n${address.address2}` : ''}{'\n'}
          {address.name}{'\n'}
          {address.phone}
        </Text>
      </View>

      <View style={styles.confirmSection}>
        <Text style={styles.confirmLabel}>お支払い方法</Text>
        <Text style={styles.confirmValue}>
          クレジットカード{'\n'}
          **** **** **** {cardInfo.number.slice(-4)}
        </Text>
      </View>

      <View style={styles.confirmSection}>
        <Text style={styles.confirmLabel}>ご注文金額</Text>
        <Text style={styles.confirmTotal}>{formatPrice(total)}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackStep}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, step === 'address' && styles.progressStepActive]}>
            <Text style={[styles.progressText, step === 'address' && styles.progressTextActive]}>
              配送先
            </Text>
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, step === 'payment' && styles.progressStepActive]}>
            <Text style={[styles.progressText, step === 'payment' && styles.progressTextActive]}>
              お支払い
            </Text>
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.progressStep, step === 'confirm' && styles.progressStepActive]}>
            <Text style={[styles.progressText, step === 'confirm' && styles.progressTextActive]}>
              確認
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'address' && renderAddressForm()}
        {step === 'payment' && renderPaymentForm()}
        {step === 'confirm' && renderConfirm()}
      </ScrollView>

      {/* Action Button */}
      <View style={[styles.actionContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
        {step !== 'confirm' ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleNextStep}
          >
            <Text style={styles.actionButtonText}>次へ</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, isProcessing && styles.actionButtonDisabled]}
            onPress={handleOrder}
            disabled={isProcessing}
          >
            <Text style={styles.actionButtonText}>
              {isProcessing ? '処理中...' : '注文を確定する'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  progressStep: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  progressStepActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  progressText: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  progressTextActive: {
    color: colors.primary,
  },
  progressLine: {
    width: spacing.xl,
    height: 1,
    backgroundColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  formContainer: {
    padding: spacing.xl,
  },
  formTitle: {
    ...typography.headlineMedium,
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  confirmSection: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  confirmLabel: {
    ...typography.labelMedium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  confirmValue: {
    ...typography.bodyMedium,
    color: colors.text,
    lineHeight: 24,
  },
  confirmTotal: {
    ...typography.price,
    color: colors.text,
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  actionButtonText: {
    ...typography.labelLarge,
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
