// 縁帳 - ローカルストレージ管理

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Person, MeetLog, PersonInput, MeetLogInput, Photo } from '../types';

const STORAGE_KEYS = {
  PERSONS: '@encho/persons',
  MEET_LOGS: '@encho/meet_logs',
  FIRST_LAUNCH: '@encho/first_launch',
};

// ====== Person CRUD ======

export async function getAllPersons(): Promise<Person[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PERSONS);
    if (!json) return [];

    const persons: Person[] = JSON.parse(json);
    // Date型の復元と更新順ソート
    return persons
      .map(p => ({
        ...p,
        firstMetAt: new Date(p.firstMetAt),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        photos: p.photos.map(photo => ({
          ...photo,
          takenAt: photo.takenAt ? new Date(photo.takenAt) : undefined,
        })),
      }))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error('Failed to get persons:', error);
    return [];
  }
}

export async function getPersonById(id: string): Promise<Person | null> {
  const persons = await getAllPersons();
  return persons.find(p => p.id === id) || null;
}

export async function createPerson(input: PersonInput): Promise<Person> {
  const now = new Date();
  const newPerson: Person = {
    id: uuidv4(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  const persons = await getAllPersons();
  persons.push(newPerson);
  await AsyncStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));

  return newPerson;
}

export async function updatePerson(
  id: string,
  updates: Partial<Omit<Person, 'id' | 'createdAt'>>
): Promise<Person | null> {
  const persons = await getAllPersons();
  const index = persons.findIndex(p => p.id === id);

  if (index === -1) return null;

  const updated: Person = {
    ...persons[index],
    ...updates,
    updatedAt: new Date(),
  };

  persons[index] = updated;
  await AsyncStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));

  return updated;
}

export async function deletePerson(id: string): Promise<boolean> {
  const persons = await getAllPersons();
  const filtered = persons.filter(p => p.id !== id);

  if (filtered.length === persons.length) return false;

  await AsyncStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(filtered));

  // 関連するMeetLogも削除
  const logs = await getAllMeetLogs();
  const filteredLogs = logs.filter(l => l.personId !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.MEET_LOGS, JSON.stringify(filteredLogs));

  return true;
}

// ====== MeetLog CRUD ======

export async function getAllMeetLogs(): Promise<MeetLog[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.MEET_LOGS);
    if (!json) return [];

    const logs: MeetLog[] = JSON.parse(json);
    return logs.map(l => ({
      ...l,
      metAt: new Date(l.metAt),
      createdAt: new Date(l.createdAt),
      photos: l.photos.map(photo => ({
        ...photo,
        takenAt: photo.takenAt ? new Date(photo.takenAt) : undefined,
      })),
    }));
  } catch (error) {
    console.error('Failed to get meet logs:', error);
    return [];
  }
}

export async function getMeetLogsByPersonId(personId: string): Promise<MeetLog[]> {
  const logs = await getAllMeetLogs();
  return logs
    .filter(l => l.personId === personId)
    .sort((a, b) => b.metAt.getTime() - a.metAt.getTime());
}

export async function createMeetLog(input: MeetLogInput): Promise<MeetLog> {
  const now = new Date();
  const newLog: MeetLog = {
    id: uuidv4(),
    ...input,
    createdAt: now,
  };

  const logs = await getAllMeetLogs();
  logs.push(newLog);
  await AsyncStorage.setItem(STORAGE_KEYS.MEET_LOGS, JSON.stringify(logs));

  // Person の updatedAt も更新
  await updatePerson(input.personId, {});

  return newLog;
}

export async function deleteMeetLog(id: string): Promise<boolean> {
  const logs = await getAllMeetLogs();
  const filtered = logs.filter(l => l.id !== id);

  if (filtered.length === logs.length) return false;

  await AsyncStorage.setItem(STORAGE_KEYS.MEET_LOGS, JSON.stringify(filtered));
  return true;
}

// ====== 初回起動チェック ======

export async function isFirstLaunch(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
  return value === null;
}

export async function setFirstLaunchComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
}

// ====== 検索 ======

export async function searchPersons(query: string): Promise<Person[]> {
  const persons = await getAllPersons();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return persons;

  return persons.filter(
    p =>
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.firstMetPlace.toLowerCase().includes(normalizedQuery) ||
      p.memo.toLowerCase().includes(normalizedQuery)
  );
}

// ====== ユーティリティ ======

export function createPhoto(uri: string): Photo {
  return {
    id: uuidv4(),
    uri,
    takenAt: new Date(),
  };
}
