import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types';
import {
  SplashScreen,
  HomeScreen,
  BrandScreen,
  ProductListScreen,
  ProductDetailScreen,
  GiftListScreen,
  GiftDetailScreen,
  CartScreen,
  CheckoutScreen,
  CheckoutCompleteScreen,
  AuthScreen,
  MyPageScreen,
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
            animation: 'fade',
            animationDuration: 400,
            freezeOnBlur: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Brand" component={BrandScreen} />
          <Stack.Screen name="ProductList" component={ProductListScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="GiftList" component={GiftListScreen} />
          <Stack.Screen name="GiftDetail" component={GiftDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="CheckoutComplete"
            component={CheckoutCompleteScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="MyPage" component={MyPageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
