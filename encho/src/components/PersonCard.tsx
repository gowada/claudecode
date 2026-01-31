import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme';
import { Person } from '../types';

interface PersonCardProps {
  person: Person;
  onPress: () => void;
}

function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

function formatPlace(place: string): string {
  // 長い場所名は省略
  if (place.length > 8) {
    return place.substring(0, 8) + '...';
  }
  return place;
}

export function PersonCard({ person, onPress }: PersonCardProps) {
  const hasPhoto = person.photos.length > 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.photoContainer}>
        {hasPhoto ? (
          <Image source={{ uri: person.photos[0].uri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>
              {person.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {person.name}
        </Text>
        <Text style={styles.date}>{formatDate(person.updatedAt)}</Text>
        {person.firstMetPlace && (
          <Text style={styles.place} numberOfLines={1}>
            {formatPlace(person.firstMetPlace)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = 160;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  photoContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    ...typography.displayLarge,
    color: colors.textMuted,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    ...typography.labelLarge,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  place: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
