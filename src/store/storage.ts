import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const PREFIX = 'good-spirits-';

function handleStorageError(operation: string, key: string, error: unknown): void {
  console.error(`Storage ${operation} failed for key "${key}":`, error);
  if (Platform.OS !== 'web') {
    Alert.alert('Storage Error', 'Failed to save your data. Please try again.');
  }
}

export const storage = {
  async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const v = await AsyncStorage.getItem(PREFIX + key);
      return v ? JSON.parse(v) : fallback;
    } catch (error) {
      console.error(`Storage read failed for key "${key}":`, error);
      return fallback;
    }
  },
  async set(key: string, value: unknown): Promise<boolean> {
    try {
      await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      handleStorageError('write', key, error);
      return false;
    }
  },
};
