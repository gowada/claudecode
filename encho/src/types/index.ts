// No6 - データモデル定義

// 商品
export interface Product {
  id: string;
  name: string;
  nameJa: string;
  tagline: string;
  description: string;
  price: number;
  volume: string;
  images: string[];
  isGift: boolean;
  category: 'honey' | 'gift';
}

// カート内アイテム
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

// カート
export interface Cart {
  items: CartItem[];
  updatedAt: Date;
}

// 注文ステータス
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// 注文
export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentMethod: 'credit_card';
  orderedAt: Date;
  createdAt: Date;
}

// 注文アイテム
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// 配送先住所
export interface ShippingAddress {
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string;
  name: string;
  phone: string;
}

// ユーザー
export interface User {
  id: string;
  email: string;
  name?: string;
  shippingAddress?: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

// 認証情報
export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

// 商品データ（固定）
export const PRODUCTS: Product[] = [
  {
    id: '820',
    name: 'TEIKAKAZURA',
    nameJa: '頂点',
    tagline: '沈黙が、最も雄弁になる。',
    description: `日本にしか咲かない花から生まれた、
極めて静かな蜂蜜。

強さを誇らず、効能を語らず、
ただ在り方だけを示します。

選ぶ覚悟を持つ人のための一本。`,
    price: 12000,
    volume: '150g',
    images: ['product_820'],
    isGift: true,
    category: 'honey',
  },
  {
    id: '821',
    name: 'MOCHINOKI',
    nameJa: '調える',
    tagline: '日々を調える、甘やかな知恵。',
    description: `日本の養生は、声を荒げません。

続けることで、静かに差が生まれます。

日常に溶け込む、整えるための蜂蜜。`,
    price: 8500,
    volume: '180g',
    images: ['product_821'],
    isGift: true,
    category: 'honey',
  },
  {
    id: '822',
    name: 'CHESTNUT',
    nameJa: '支える',
    tagline: '続けることが、美しさになる。',
    description: `派手さはありません。

ただ、確かに、身体のそばにあります。

日常という名の、贅沢。`,
    price: 6800,
    volume: '200g',
    images: ['product_822'],
    isGift: true,
    category: 'honey',
  },
];

// ギフト商品データ
export const GIFT_PRODUCTS: Product[] = PRODUCTS.filter(p => p.isGift);

// ナビゲーション用の型定義
export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Brand: undefined;
  ProductList: undefined;
  ProductDetail: { productId: string };
  GiftList: undefined;
  GiftDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  CheckoutComplete: { orderId: string };
  Auth: { mode?: 'login' | 'register' };
  MyPage: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
};

// 商品IDから商品を取得
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

// 価格フォーマット
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}
