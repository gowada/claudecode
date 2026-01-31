import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { RootStackParamList, Person } from '../types';
import { getAllPersons, searchPersons } from '../storage';
import { PersonCard } from '../components';

type PersonListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonList'>;
};

export function PersonListScreen({ navigation }: PersonListScreenProps) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadPersons = useCallback(async () => {
    const data = searchQuery
      ? await searchPersons(searchQuery)
      : await getAllPersons();
    setPersons(data);
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadPersons();
    }, [loadPersons])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPersons();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const data = query ? await searchPersons(query) : await getAllPersons();
    setPersons(data);
  };

  const renderItem = ({ item }: { item: Person }) => (
    <PersonCard
      person={item}
      onPress={() => navigation.navigate('PersonDetail', { personId: item.id })}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>まだ縁が記されていません</Text>
      <Text style={styles.emptySubtitle}>
        はじめての縁を残しましょう。{'\n'}
        大切な出会いは、ここから。
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>縁帳</Text>
      </View>

      {/* 検索バー */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="名前や場所で探す"
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* 縁一覧 */}
      <FlatList
        data={persons}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PersonCreate')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>縁を記す</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.primary,
    letterSpacing: 4,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    ...typography.bodyMedium,
    color: colors.text,
    ...shadows.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    ...typography.headlineSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.white,
    marginRight: spacing.xs,
    lineHeight: 26,
  },
  fabText: {
    ...typography.labelLarge,
    color: colors.white,
  },
});
