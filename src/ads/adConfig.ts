import { Platform } from 'react-native';

const platform = Platform.OS as 'android' | 'ios';
const prefix = `EXPO_PUBLIC_ADMOB_${platform.toUpperCase()}`;

function getEnv(id: string): string | undefined {
  return process.env[`${prefix}_${id}`];
}

export const AD_UNIT_IDS = {
  appOpen: getEnv('APP_OPEN') ?? '',
  interstitial: getEnv('INTERSTITIAL') ?? '',
  rewarded: getEnv('REWARDED') ?? '',
  banner: getEnv('BANNER') ?? '',
};

export const AD_CONFIG = {
  interstitialWaveInterval: 5,
  minWavesBeforeInterstitial: 3,
  appOpenDelayMs: 2000,
  rewardedContinueEnabled: true,
};
