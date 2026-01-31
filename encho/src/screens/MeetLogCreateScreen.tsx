import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList, Photo } from '../types';
import { createMeetLog } from '../storage';
import { Button, Input, PhotoPicker } from '../components';

type MeetLogCreateScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MeetLogCreate'>;
  route: RouteProp<RootStackParamList, 'MeetLogCreate'>;
};

export function MeetLogCreateScreen({
  navigation,
  route,
}: MeetLogCreateScreenProps) {
  const { personId, personName } = route.params;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [place, setPlace] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 位置情報を取得
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const [address] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (address) {
            const placeName = [address.city, address.district, address.street]
              .filter(Boolean)
              .join(' ');
            setPlace(placeName || '');
          }
        } catch (error) {
          console.log('Location error:', error);
        }
      }
    })();
  }, []);

  const handleClose = () => {
    if (memo || photos.length > 0) {
      Alert.alert('入力を破棄しますか？', '記入した内容は保存されません。', [
        { text: '続ける', style: 'cancel' },
        {
          text: '破棄する',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createMeetLog({
        personId,
        place,
        metAt: new Date(),
        memo,
        photos,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('保存に失敗しました', 'もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>再会の記録</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* 対象者 */}
        <Text style={styles.personName}>{personName}さんとの再会</Text>

        {/* 写真 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>写真（任意）</Text>
          <PhotoPicker photos={photos} onPhotosChange={setPhotos} />
        </View>

        {/* 場所 */}
        <View style={styles.section}>
          <Input
            label="会った場所"
            value={place}
            onChangeText={setPlace}
            placeholder="（位置情報を取得中...）"
          />
        </View>

        {/* メモ */}
        <View style={styles.section}>
          <Input
            label="覚え書き（任意）"
            value={memo}
            onChangeText={setMemo}
            placeholder="話した内容、印象に残ったことなど"
            multiline
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* フッター */}
      <View style={styles.footer}>
        <Button
          title="記録する"
          onPress={handleSave}
          loading={loading}
          size="large"
        />
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
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.textMuted,
    lineHeight: 30,
  },
  headerTitle: {
    ...typography.headlineSmall,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  personName: {
    ...typography.headlineMedium,
    color: colors.text,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bottomSpacer: {
    height: 120,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
});
