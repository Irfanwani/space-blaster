import Storage from 'expo-sqlite/kv-store';
import { GameSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

const SETTINGS_KEY = 'spaceblaster.settings';
const HIGH_SCORE_KEY = 'spaceblaster.high_score';

export async function loadSettings(): Promise<GameSettings | null> {
  try {
    const raw = await Storage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return null;
  }
}

export function saveSettings(settings: GameSettings): void {
  Storage.setItem(SETTINGS_KEY, JSON.stringify(settings)).catch(() => {});
}

export async function loadHighScore(): Promise<number> {
  try {
    const raw = await Storage.getItem(HIGH_SCORE_KEY);
    if (!raw) return 0;
    const value = parseInt(raw, 10);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  if (score <= 0) return;
  Storage.setItem(HIGH_SCORE_KEY, String(score)).catch(() => {});
}