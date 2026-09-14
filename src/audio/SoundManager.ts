import { createAudioPlayer } from 'expo-audio';
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
  laser: 0.5,
  enemyLaser: 0.4,
  explosion: 0.9,
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

class SoundManager {
  private players = new Map<SoundName, AudioPlayer>();
  private soundEnabled = true;
  private lastPlayed = new Map<SoundName, number>();
  private audioActive = true;
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
    for (const name of Object.keys(SOURCES) as SoundName[]) {
      try {
        const player = createAudioPlayer(SOURCES[name]);
        player.loop = false;
        const vol = VOLUMES[name];
        if (vol !== undefined) player.volume = vol;
        this.players.set(name, player);
      } catch {
        // individual sound failure should not crash the game
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
      this.players.forEach((p) => p.pause());
    }
  }

  play(name: SoundName, cooldownMs = 0): void {
    if (!this.audioActive || !this.soundEnabled) return;

    const player = this.players.get(name);
    if (!player) return;

    if (cooldownMs > 0) {
      const last = this.lastPlayed.get(name) ?? 0;
      const now = Date.now();
      if (now - last < cooldownMs) return;
      this.lastPlayed.set(name, now);
    }

    try {
      player.seekTo(0);
      player.play();
    } catch {
      // ignore transient playback errors
    }
  }

  release(): void {
    this.players.forEach((p) => p.remove());
    this.players.clear();
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();

export function playSound(name: SoundName, cooldownMs = 0): void {
  soundManager.play(name, cooldownMs);
}