import mobileAds, {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, AD_CONFIG, isValidAdUnitId } from './adConfig';

function getAdUnitId(type: 'appOpen' | 'interstitial' | 'rewarded' | 'banner'): string {
  const id = AD_UNIT_IDS[type];
  if (!isValidAdUnitId(id)) {
    console.warn(`[Ads] Missing/invalid ad unit ID for "${type}" — check your .env file`);
    return '';
  }
  return id;
}

let appOpenAd: AppOpenAd | null = null;
let interstitialAd: InterstitialAd | null = null;
let rewardedAd: RewardedAd | null = null;
let interstitialReady = false;
let initialized = false;

export async function initAds(): Promise<void> {
  if (initialized) return;
  try {
    await mobileAds().initialize();
    initialized = true;
    preloadAppOpenAd();
    preloadInterstitial();
  } catch (e) {
    console.warn('[Ads] Init failed:', e);
  }
}

export function preloadAppOpenAd(): void {
  try {
    const id = getAdUnitId('appOpen');
    if (isValidAdUnitId(id)) {
      appOpenAd = AppOpenAd.createForAdRequest(id);
      appOpenAd.load();
    }
  } catch (e) {
    console.warn('[Ads] App open preload failed:', e);
  }
}

export function showAppOpenAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!appOpenAd || !isValidAdUnitId(getAdUnitId('appOpen'))) {
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
    const id = getAdUnitId('interstitial');
    if (isValidAdUnitId(id)) {
      interstitialReady = false;
      if (interstitialAd) {
        interstitialAd.removeAllListeners();
      }
      interstitialAd = InterstitialAd.createForAdRequest(id);
      interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        interstitialReady = true;
      });
      interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
        interstitialReady = false;
      });
      interstitialAd.load();
    }
  } catch (e) {
    console.warn('[Ads] Interstitial preload failed:', e);
  }
}

export function isInterstitialReady(): boolean {
  return interstitialReady && interstitialAd !== null;
}

export function showInterstitialAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      !interstitialReady ||
      !interstitialAd ||
      !isValidAdUnitId(getAdUnitId('interstitial'))
    ) {
      resolve(false);
      preloadInterstitial();
      return;
    }

    let settled = false;
    const settle = (value: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimer);
      resolve(value);
    };

    const safetyTimer = setTimeout(() => {
      settle(false);
      preloadInterstitial();
    }, 30000);

    const unsubError = interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      unsubError();
      settle(false);
    });

    const unsubClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClosed();
      preloadInterstitial();
      settle(true);
    });

    interstitialAd.show();
  });
}

export function preloadRewarded(): void {
  try {
    const id = getAdUnitId('rewarded');
    if (isValidAdUnitId(id)) {
      rewardedAd = RewardedAd.createForAdRequest(id);
      rewardedAd.load();
    }
  } catch (e) {
    console.warn('[Ads] Rewarded preload failed:', e);
  }
}

export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!rewardedAd || !isValidAdUnitId(getAdUnitId('rewarded'))) {
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
