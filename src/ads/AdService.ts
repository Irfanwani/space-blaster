import mobileAds, {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, AD_CONFIG } from './adConfig';

function getAdUnitId(type: 'appOpen' | 'interstitial' | 'rewarded' | 'banner'): string {
  const id = AD_UNIT_IDS[type];
  if (!id) {
    console.warn(`[Ads] Missing ad unit ID for "${type}" — check your .env file`);
  }
  return id;
}

let appOpenAd: AppOpenAd | null = null;
let interstitialAd: InterstitialAd | null = null;
let rewardedAd: RewardedAd | null = null;
let initialized = false;

export async function initAds(): Promise<void> {
  if (initialized) return;
  try {
    await mobileAds().initialize();
    initialized = true;
    preloadAppOpenAd();
  } catch (e) {
    console.warn('[Ads] Init failed:', e);
  }
}

export function preloadAppOpenAd(): void {
  try {
    appOpenAd = AppOpenAd.createForAdRequest(getAdUnitId('appOpen'));
    appOpenAd.load();
  } catch (e) {
    console.warn('[Ads] App open preload failed:', e);
  }
}

export function showAppOpenAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!appOpenAd) {
      resolve(false);
      return;
    }

    const unsubLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      unsubLoaded();
      unsubError();
      appOpenAd!.show();
    });

    const unsubError = appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
      unsubLoaded();
      unsubError();
      resolve(false);
    });

    const unsubClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClosed();
      preloadAppOpenAd();
      resolve(true);
    });

    appOpenAd.load();
  });
}

export function preloadInterstitial(): void {
  try {
    interstitialAd = InterstitialAd.createForAdRequest(getAdUnitId('interstitial'));
    interstitialAd.load();
  } catch (e) {
    console.warn('[Ads] Interstitial preload failed:', e);
  }
}

export function showInterstitialAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!interstitialAd) {
      resolve(false);
      preloadInterstitial();
      return;
    }

    const unsubLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      unsubLoaded();
      unsubError();
      interstitialAd!.show();
    });

    const unsubError = interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      unsubLoaded();
      unsubError();
      resolve(false);
    });

    const unsubClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClosed();
      preloadInterstitial();
      resolve(true);
    });

    interstitialAd.load();
  });
}

export function preloadRewarded(): void {
  try {
    rewardedAd = RewardedAd.createForAdRequest(getAdUnitId('rewarded'));
    rewardedAd.load();
  } catch (e) {
    console.warn('[Ads] Rewarded preload failed:', e);
  }
}

export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!rewardedAd) {
      resolve(false);
      preloadRewarded();
      return;
    }

    let earned = false;

    const unsubLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      unsubLoaded();
      unsubError();
      rewardedAd!.show();
    });

    const unsubError = rewardedAd.addAdEventListener(AdEventType.ERROR, () => {
      unsubLoaded();
      unsubError();
      resolve(false);
    });

    const unsubEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });

    const unsubClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClosed();
      unsubEarned();
      preloadRewarded();
      resolve(earned);
    });

    rewardedAd.load();
  });
}

export function shouldShowInterstitial(wave: number): boolean {
  return (
    wave > AD_CONFIG.minWavesBeforeInterstitial &&
    wave % AD_CONFIG.interstitialWaveInterval === 0
  );
}

export { BannerAdSize };
