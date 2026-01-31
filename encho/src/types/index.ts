// 縁帳 - データモデル定義

export interface Photo {
  id: string;
  uri: string;
  takenAt?: Date;
}

export type Situation = 'bar' | 'work' | 'referral' | 'event' | 'other';

export const SITUATION_LABELS: Record<Situation, string> = {
  bar: '飲み屋',
  work: '仕事',
  referral: '紹介',
  event: 'イベント',
  other: 'その他',
};

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// 縁（Person）エンティティ
export interface Person {
  id: string;
  name: string;
  photos: Photo[];
  firstMetAt: Date;
  firstMetPlace: string;
  firstMetLocation?: GeoPoint;
  situation: Situation;
  memo: string;
  introducedBy?: string; // 紹介者のPersonId
  createdAt: Date;
  updatedAt: Date;
}

// 再会ログ（MeetLog）エンティティ
export interface MeetLog {
  id: string;
  personId: string;
  metAt: Date;
  place: string;
  location?: GeoPoint;
  memo: string;
  photos: Photo[];
  createdAt: Date;
}

// 新規作成時の入力データ
export interface PersonInput {
  name: string;
  photos: Photo[];
  firstMetPlace: string;
  firstMetLocation?: GeoPoint;
  firstMetAt: Date;
  situation: Situation;
  memo: string;
  introducedBy?: string;
}

// 再会記録の入力データ
export interface MeetLogInput {
  personId: string;
  place: string;
  location?: GeoPoint;
  metAt: Date;
  memo: string;
  photos: Photo[];
}

// ナビゲーション用の型定義
export type RootStackParamList = {
  Splash: undefined;
  PersonList: undefined;
  PersonDetail: { personId: string };
  PersonCreate: undefined;
  PersonEdit: { personId: string };
  MeetLogCreate: { personId: string; personName: string };
};
