import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, typography } from '../theme';
import { Photo } from '../types';
import { createPhoto } from '../storage';

interface PhotoPickerProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxPhotos?: number;
}

export function PhotoPicker({
  photos,
  onPhotosChange,
  maxPhotos = 3,
}: PhotoPickerProps) {
  const canAddMore = photos.length < maxPhotos;

  const showPicker = () => {
    Alert.alert('写真を追加', '写真の追加方法を選んでください', [
      {
        text: 'カメラで撮影',
        onPress: handleCamera,
      },
      {
        text: 'アルバムから選ぶ',
        onPress: handleLibrary,
      },
      {
        text: 'キャンセル',
        style: 'cancel',
      },
    ]);
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('カメラへのアクセスを許可してください');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto = createPhoto(result.assets[0].uri);
      onPhotosChange([...photos, newPhoto]);
    }
  };

  const handleLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('写真へのアクセスを許可してください');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto = createPhoto(result.assets[0].uri);
      onPhotosChange([...photos, newPhoto]);
    }
  };

  const removePhoto = (photoId: string) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {photos.map(photo => (
          <View key={photo.id} style={styles.photoWrapper}>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(photo.id)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        {canAddMore && (
          <TouchableOpacity style={styles.addButton} onPress={showPicker}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>写真を追加</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {photos.length === 0 && (
        <Text style={styles.hint}>
          一緒に写った写真や、その場の様子など。{'\n'}
          記憶を呼び戻す手がかりになります。
        </Text>
      )}
    </View>
  );
}

const PHOTO_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 18,
  },
  addButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  addButtonIcon: {
    fontSize: 32,
    color: colors.textMuted,
    lineHeight: 36,
  },
  addButtonText: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
});
