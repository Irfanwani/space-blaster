import { Platform } from 'react-native';

const PRODUCTION_IDS = {
  android: {
    appOpen: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
    interstitial: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    rewarded: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    banner: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  },
  ios: {
    appOpen: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
    interstitial: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    rewarded: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
    banner: 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy',
  },
};

const platform = Platform.OS as 'android' | 'ios';

export const AD_UNIT_IDS = __DEV__
  ? undefined // Use TestIds in dev
  : PRODUCTION_IDS[platform];

export const AD_CONFIG = {
  interstitialWaveInterval: 5,
  minWavesBeforeInterstitial: 3,
  appOpenDelayMs: 2000,
  rewardedContinueEnabled: true,
};
