import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, typography, animation } from '../theme';
import { RootStackParamList } from '../types';
import { setFirstLaunchComplete } from '../storage';

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({ navigation }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // フェードインアニメーション
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animation.duration.slow,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animation.duration.slow,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      await setFirstLaunchComplete();
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/No6.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.divider} />
        <Text style={styles.tagline}>自然が選んだ、かたち。</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: spacing.xl,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: colors.textOnDarkMuted,
    marginBottom: spacing.lg,
    opacity: 0.3,
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.textOnDarkMuted,
    letterSpacing: 2,
  },
});
