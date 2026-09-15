import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

export type SoundName =
  | 'laser'
  | 'enemyLaser'
  | 'explosion'
  | 'bigExplosion'
  | 'hit'
  | 'powerup'
  | 'powerUpCollect'
  | 'shield'
  | 'playerHit'
  | 'waveStart'
  | 'bossWave'
  | 'gameOver'
  | 'select';

const SOURCES: Record<SoundName, number> = {
  laser: require('../../assets/sounds/laser.wav'),
  enemyLaser: require('../../assets/sounds/enemyLaser.wav'),
  explosion: require('../../assets/sounds/explosion.wav'),
  bigExplosion: require('../../assets/sounds/bigExplosion.wav'),
  hit: require('../../assets/sounds/hit.wav'),
  powerup: require('../../assets/sounds/powerup.wav'),
  powerUpCollect: require('../../assets/sounds/powerUpCollect.wav'),
  shield: require('../../assets/sounds/shield.wav'),
  playerHit: require('../../assets/sounds/playerHit.wav'),
  waveStart: require('../../assets/sounds/waveStart.wav'),
  bossWave: require('../../assets/sounds/bossWave.wav'),
  gameOver: require('../../assets/sounds/gameOver.wav'),
  select: require('../../assets/sounds/select.wav'),
};

const VOLUMES: Partial<Record<SoundName, number>> = {
  laser: 0.55,
  enemyLaser: 0.4,
  explosion: 0.85,
  bigExplosion: 1.0,
  hit: 0.6,
  powerup: 0.7,
  powerUpCollect: 0.8,
  shield: 0.8,
  playerHit: 0.9,
  waveStart: 0.8,
  bossWave: 0.8,
  gameOver: 1.0,
  select: 0.5,
};

// Number of parallel playback slots per sound. Rapid-fire sounds get more
// slots so an overlapping retrigger reuses an idle player instead of
// cutting the previous one short (which caused clicks/scratching).
const POOL_SIZES: Partial<Record<SoundName, number>> = {
  laser: 4,
  enemyLaser: 3,
  hit: 3,
  explosion: 2,
  bigExplosion: 2,
  playerHit: 2,
};

class SoundManager {
  private pools = new Map<SoundName, AudioPlayer[]>();
  private cursor = new Map<SoundName, number>();
  private soundEnabled = true;
  private lastPlayed = new Map<SoundName, number>();
  private audioActive = true;
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

    for (const name of Object.keys(SOURCES) as SoundName[]) {
      const size = POOL_SIZES[name] ?? 2;
      const players: AudioPlayer[] = [];
      for (let i = 0; i < size; i++) {
        try {
          const player = createAudioPlayer(SOURCES[name]);
          player.loop = false;
          const vol = VOLUMES[name];
          if (vol !== undefined) player.volume = vol;
          players.push(player);
        } catch {
          // individual sound failure should not crash the game
        }
      }
      if (players.length > 0) {
        this.pools.set(name, players);
        this.cursor.set(name, 0);
      }
    }
  }

  setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  isEnabled(): boolean {
    return this.soundEnabled;
  }

  setAudioActive(active: boolean): void {
    this.audioActive = active;
    if (!active) {
      this.pools.forEach((players) => {
        players.forEach((p) => {
          try {
            p.pause();
          } catch {
            // ignore
          }
        });
      });
    }
  }

  play(name: SoundName, cooldownMs = 0): void {
    if (!this.audioActive || !this.soundEnabled) return;

    const players = this.pools.get(name);
    if (!players || players.length === 0) return;

    if (cooldownMs > 0) {
      const last = this.lastPlayed.get(name) ?? 0;
      const now = Date.now();
      if (now - last < cooldownMs) return;
      this.lastPlayed.set(name, now);
    }

    const cursor = this.cursor.get(name) ?? 0;
    this.cursor.set(name, (cursor + 1) % players.length);
    const player = players[cursor];

    try {
      player.seekTo(0).catch(() => {});
      player.play();
    } catch {
      // ignore transient playback errors
    }
  }

  release(): void {
    this.pools.forEach((players) => {
      players.forEach((p) => {
        try {
          p.remove();
        } catch {
          // ignore
        }
      });
    });
    this.pools.clear();
    this.cursor.clear();
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();

export function playSound(name: SoundName, cooldownMs = 0): void {
  soundManager.play(name, cooldownMs);
}