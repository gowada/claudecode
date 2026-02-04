// No6 - ローカルストレージ管理

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {
  Cart,
  CartItem,
  Order,
  OrderItem,
  User,
  ShippingAddress,
  getProductById,
} from '../types';

const STORAGE_KEYS = {
  CART: '@no6/cart',
  ORDERS: '@no6/orders',
  USER: '@no6/user',
  AUTH: '@no6/auth',
  FIRST_LAUNCH: '@no6/first_launch',
};

// ====== カート管理 ======

export async function getCart(): Promise<Cart> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CART);
    if (!json) {
      return { items: [], updatedAt: new Date() };
    }

    const cart: Cart = JSON.parse(json);
    return {
      ...cart,
      updatedAt: new Date(cart.updatedAt),
      items: cart.items.map(item => ({
        ...item,
        addedAt: new Date(item.addedAt),
      })),
    };
  } catch (error) {
    console.error('Failed to get cart:', error);
    return { items: [], updatedAt: new Date() };
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<Cart> {
  const cart = await getCart();
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      addedAt: new Date(),
    });
  }

  cart.updatedAt = new Date();
  await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  return cart;
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number
): Promise<Cart> {
  const cart = await getCart();
  const item = cart.items.find(i => i.productId === productId);

  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }
  }

  cart.updatedAt = new Date();
  await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  return cart;
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const cart = await getCart();
  cart.items = cart.items.filter(i => i.productId !== productId);
  cart.updatedAt = new Date();
  await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  return cart;
}

export async function clearCart(): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.CART,
    JSON.stringify({ items: [], updatedAt: new Date() })
  );
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}

// ====== 注文管理 ======

export async function getAllOrders(): Promise<Order[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!json) return [];

    const orders: Order[] = JSON.parse(json);
    return orders
      .map(o => ({
        ...o,
        orderedAt: new Date(o.orderedAt),
        createdAt: new Date(o.createdAt),
      }))
      .sort((a, b) => b.orderedAt.getTime() - a.orderedAt.getTime());
  } catch (error) {
    console.error('Failed to get orders:', error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getAllOrders();
  return orders.find(o => o.id === id) || null;
}

export async function createOrder(
  cart: Cart,
  shippingAddress: ShippingAddress
): Promise<Order> {
  const now = new Date();

  const orderItems: OrderItem[] = cart.items.map(item => {
    const product = getProductById(item.productId);
    return {
      productId: item.productId,
      productName: product ? `${product.name}｜${product.nameJa}` : '',
      quantity: item.quantity,
      price: product ? product.price : 0,
    };
  });

  const newOrder: Order = {
    id: uuidv4(),
    items: orderItems,
    totalAmount: getCartTotal(cart),
    shippingAddress,
    status: 'pending',
    paymentMethod: 'credit_card',
    orderedAt: now,
    createdAt: now,
  };

  const orders = await getAllOrders();
  orders.push(newOrder);
  await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // カートをクリア
  await clearCart();

  return newOrder;
}

// ====== ユーザー管理 ======

export async function getUser(): Promise<User | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!json) return null;

    const user: User = JSON.parse(json);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

export async function createUser(email: string, password: string): Promise<User> {
  const now = new Date();
  const newUser: User = {
    id: uuidv4(),
    email,
    createdAt: now,
    updatedAt: now,
  };

  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ email, password }));
  return newUser;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const authJson = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
    if (!authJson) return null;

    const auth = JSON.parse(authJson);
    if (auth.email === email && auth.password === password) {
      return await getUser();
    }
    return null;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

export async function updateUser(
  updates: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User | null> {
  const user = await getUser();
  if (!user) return null;

  const updatedUser: User = {
    ...user,
    ...updates,
    updatedAt: new Date(),
  };

  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  return updatedUser;
}

export async function updateShippingAddress(
  address: ShippingAddress
): Promise<User | null> {
  return await updateUser({ shippingAddress: address });
}

export async function logoutUser(): Promise<void> {
  // ユーザーデータは保持、認証状態のみリセット
  // 実際のアプリではセッション管理を行う
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

// ====== 初回起動チェック ======

export async function isFirstLaunch(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
  return value === null;
}

export async function setFirstLaunchComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
}

// ====== データクリア（開発用） ======

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
