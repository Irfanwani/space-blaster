import { Platform } from 'react-native';

const IS_ANDROID = Platform.OS === 'android';

export const AD_UNIT_IDS = {
  appOpen: IS_ANDROID
    ? process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_OPEN ?? ''
    : process.env.EXPO_PUBLIC_ADMOB_IOS_APP_OPEN ?? '',
  interstitial: IS_ANDROID
    ? process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL ?? ''
    : process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL ?? '',
  rewarded: IS_ANDROID
    ? process.env.EXPO_PUBLIC_ADMOB_ANDROID_REWARDED ?? ''
    : process.env.EXPO_PUBLIC_ADMOB_IOS_REWARDED ?? '',
  banner: IS_ANDROID
    ? process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER ?? ''
    : process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER ?? '',
};

export const AD_CONFIG = {
  interstitialWaveInterval: 5,
  minWavesBeforeInterstitial: 3,
  appOpenDelayMs: 2000,
  rewardedContinueEnabled: true,
};

export function isValidAdUnitId(id: string): boolean {
  return typeof id === 'string' && /^ca-app-pub-\d+\/\d+$/.test(id.trim());
}