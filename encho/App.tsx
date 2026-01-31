import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types';
import {
  SplashScreen,
  PersonListScreen,
  PersonCreateScreen,
  PersonDetailScreen,
  MeetLogCreateScreen,
} from './src/screens';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
            freezeOnBlur: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="PersonList" component={PersonListScreen} />
          <Stack.Screen
            name="PersonCreate"
            component={PersonCreateScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
              freezeOnBlur: false,
            }}
          />
          <Stack.Screen name="PersonDetail" component={PersonDetailScreen} />
          <Stack.Screen
            name="MeetLogCreate"
            component={MeetLogCreateScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
              freezeOnBlur: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
