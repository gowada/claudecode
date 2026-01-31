import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { RootStackParamList, Person, MeetLog, SITUATION_LABELS } from '../types';
import {
  getPersonById,
  getMeetLogsByPersonId,
  deletePerson,
  getAllPersons,
} from '../storage';
import { Button } from '../components';

type PersonDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonDetail'>;
  route: RouteProp<RootStackParamList, 'PersonDetail'>;
};

const { width } = Dimensions.get('window');

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

function formatShortDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

export function PersonDetailScreen({
  navigation,
  route,
}: PersonDetailScreenProps) {
  const { personId } = route.params;
  const [person, setPerson] = useState<Person | null>(null);
  const [meetLogs, setMeetLogs] = useState<MeetLog[]>([]);
  const [introducer, setIntroducer] = useState<Person | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const loadData = useCallback(async () => {
    const personData = await getPersonById(personId);
    if (personData) {
      setPerson(personData);

      if (personData.introducedBy) {
        const introducerData = await getPersonById(personData.introducedBy);
        setIntroducer(introducerData);
      }
    }

    const logs = await getMeetLogsByPersonId(personId);
    setMeetLogs(logs);
  }, [personId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = () => {
    if (!person) return;

    Alert.alert(
      'この縁を削除しますか？',
      `${person.name}さんとの記録がすべて削除されます。\nこの操作は取り消せません。`,
      [
        { text: 'やめる', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: async () => {
            await deletePerson(personId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMeetLog = () => {
    if (!person) return;
    navigation.navigate('MeetLogCreate', {
      personId: person.id,
      personName: person.name,
    });
  };

  if (!person) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  const hasPhotos = person.photos.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 写真ヘッダー */}
        {hasPhotos ? (
          <View style={styles.photoHeader}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentPhotoIndex(index);
              }}
            >
              {person.photos.map(photo => (
                <Image
                  key={photo.id}
                  source={{ uri: photo.uri }}
                  style={styles.photo}
                />
              ))}
            </ScrollView>
            {person.photos.length > 1 && (
              <View style={styles.photoIndicator}>
                {person.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoIndicatorDot,
                      index === currentPhotoIndex &&
                        styles.photoIndicatorDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              {person.name.charAt(0)}
            </Text>
          </View>
        )}

        {/* 戻るボタン（オーバーレイ） */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* コンテンツ */}
        <View style={styles.content}>
          {/* 名前 */}
          <Text style={styles.name}>{person.name}</Text>

          {/* 基本情報 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>この縁について</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>初めて会った日</Text>
              <Text style={styles.infoValue}>
                {formatDate(person.firstMetAt)}
              </Text>
            </View>

            {person.firstMetPlace && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>会った場所</Text>
                <Text style={styles.infoValue}>{person.firstMetPlace}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>どんな場で</Text>
              <Text style={styles.infoValue}>
                {SITUATION_LABELS[person.situation]}
              </Text>
            </View>

            {introducer && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ご紹介</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('PersonDetail', { personId: introducer.id })
                  }
                >
                  <Text style={[styles.infoValue, styles.linkText]}>
                    {introducer.name}さん
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* メモ */}
          {person.memo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>覚え書き</Text>
              <Text style={styles.memo}>{person.memo}</Text>
            </View>
          )}

          {/* 再会ログ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>再会の記録</Text>

            {meetLogs.length === 0 ? (
              <Text style={styles.emptyLog}>まだ再会の記録はありません</Text>
            ) : (
              meetLogs.map(log => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logDot} />
                  <View style={styles.logContent}>
                    <Text style={styles.logDate}>{formatShortDate(log.metAt)}</Text>
                    <Text style={styles.logPlace}>{log.place}</Text>
                    {log.memo && (
                      <Text style={styles.logMemo} numberOfLines={2}>
                        {log.memo}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          {/* 削除ボタン */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>この縁を削除</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* 再会ボタン */}
      <View style={styles.footer}>
        <Button title="再会した" onPress={handleMeetLog} size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  photoHeader: {
    width,
    height: width * 0.8,
    backgroundColor: colors.backgroundDark,
  },
  photo: {
    width,
    height: width * 0.8,
    resizeMode: 'cover',
  },
  photoIndicator: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  photoIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoIndicatorDotActive: {
    backgroundColor: colors.white,
  },
  photoPlaceholder: {
    width,
    height: width * 0.5,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 64,
    color: colors.textMuted,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  content: {
    padding: spacing.lg,
  },
  name: {
    ...typography.displayMedium,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    width: 120,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  memo: {
    ...typography.bodyMedium,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyLog: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginTop: 6,
    marginRight: spacing.md,
  },
  logContent: {
    flex: 1,
  },
  logDate: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  logPlace: {
    ...typography.bodyMedium,
    color: colors.text,
    marginTop: spacing.xs,
  },
  logMemo: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  deleteButton: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  deleteButtonText: {
    ...typography.labelMedium,
    color: colors.error,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 40,
    backgroundColor: colors.background,
    ...shadows.lg,
  },
});
