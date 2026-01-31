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
import * as Location from 'expo-location';
import { colors, spacing, borderRadius, typography } from '../theme';
import { RootStackParamList, Photo, Situation, SITUATION_LABELS, Person } from '../types';
import { createPerson, getAllPersons } from '../storage';
import { Button, Input, PhotoPicker } from '../components';

type PersonCreateScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonCreate'>;
};

const STEPS = ['写真', 'お名前', 'メモ', '詳細'];

export function PersonCreateScreen({ navigation }: PersonCreateScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [place, setPlace] = useState('');
  const [situation, setSituation] = useState<Situation>('other');
  const [introducedBy, setIntroducedBy] = useState<string | undefined>();
  const [existingPersons, setExistingPersons] = useState<Person[]>([]);
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

    // 既存の縁を取得（紹介者選択用）
    (async () => {
      const persons = await getAllPersons();
      setExistingPersons(persons);
    })();
  }, []);

  const handleClose = () => {
    if (name || photos.length > 0 || memo) {
      Alert.alert(
        '入力を破棄しますか？',
        '記入した内容は保存されません。',
        [
          { text: '続ける', style: 'cancel' },
          {
            text: '破棄する',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('お名前を入力してください');
      return;
    }

    setLoading(true);
    try {
      await createPerson({
        name: name.trim(),
        photos,
        firstMetPlace: place,
        firstMetAt: new Date(),
        situation,
        memo,
        introducedBy,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('保存に失敗しました', 'もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View key={step} style={styles.stepItem}>
          <View
            style={[
              styles.stepDot,
              index <= currentStep && styles.stepDotActive,
            ]}
          />
          <Text
            style={[
              styles.stepLabel,
              index === currentStep && styles.stepLabelActive,
            ]}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>写真を残す</Text>
            <PhotoPicker photos={photos} onPhotosChange={setPhotos} />
            <TouchableOpacity onPress={handleNext} style={styles.skipLink}>
              <Text style={styles.skipLinkText}>あとで追加する</Text>
            </TouchableOpacity>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>お名前</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="田中 太郎"
              autoFocus
              hint="フルネームでなくても大丈夫です。思い出せる形で残しましょう。"
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>覚え書き</Text>
            <Input
              value={memo}
              onChangeText={setMemo}
              placeholder={'話した内容、印象に残ったこと、\n次に会ったときに話したいことなど'}
              multiline
              hint="箇条書きでも、思いつくままでも。"
            />
            <TouchableOpacity onPress={handleNext} style={styles.skipLink}>
              <Text style={styles.skipLinkText}>あとで追加する</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.stepTitle}>出会いの詳細</Text>

            <Input
              label="会った場所"
              value={place}
              onChangeText={setPlace}
              placeholder="（位置情報を取得中...）"
            />

            <Text style={styles.sectionLabel}>どんな場で</Text>
            <View style={styles.situationContainer}>
              {(Object.entries(SITUATION_LABELS) as [Situation, string][]).map(
                ([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.situationChip,
                      situation === key && styles.situationChipActive,
                    ]}
                    onPress={() => setSituation(key)}
                  >
                    <Text
                      style={[
                        styles.situationChipText,
                        situation === key && styles.situationChipTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {existingPersons.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>どなたのご紹介ですか？</Text>
                <View style={styles.situationContainer}>
                  <TouchableOpacity
                    style={[
                      styles.situationChip,
                      !introducedBy && styles.situationChipActive,
                    ]}
                    onPress={() => setIntroducedBy(undefined)}
                  >
                    <Text
                      style={[
                        styles.situationChipText,
                        !introducedBy && styles.situationChipTextActive,
                      ]}
                    >
                      なし
                    </Text>
                  </TouchableOpacity>
                  {existingPersons.slice(0, 10).map(person => (
                    <TouchableOpacity
                      key={person.id}
                      style={[
                        styles.situationChip,
                        introducedBy === person.id && styles.situationChipActive,
                      ]}
                      onPress={() => setIntroducedBy(person.id)}
                    >
                      <Text
                        style={[
                          styles.situationChipText,
                          introducedBy === person.id &&
                            styles.situationChipTextActive,
                        ]}
                      >
                        {person.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.spacer} />
          </ScrollView>
        );

      default:
        return null;
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
        {renderStepIndicator()}
      </View>

      {/* コンテンツ */}
      {renderStep()}

      {/* フッター */}
      <View style={styles.footer}>
        {currentStep > 0 && (
          <Button title="戻る" variant="secondary" onPress={handleBack} />
        )}
        <View style={styles.footerSpacer} />
        {currentStep < STEPS.length - 1 ? (
          <Button
            title="次へ"
            onPress={handleNext}
            disabled={currentStep === 1 && !name.trim()}
          />
        ) : (
          <Button
            title="縁を残す"
            onPress={handleSave}
            loading={loading}
            disabled={!name.trim()}
          />
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
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  stepLabelActive: {
    color: colors.primary,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  stepTitle: {
    ...typography.headlineMedium,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  skipLink: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  skipLinkText: {
    ...typography.labelMedium,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  sectionLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  situationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  situationChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  situationChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  situationChipText: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  situationChipTextActive: {
    color: colors.white,
  },
  spacer: {
    height: spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  footerSpacer: {
    flex: 1,
  },
});
