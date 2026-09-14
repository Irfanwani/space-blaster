import { Dimensions } from 'react-native';
import { GameSettings } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

export const PLAYER = {
  width: 44,
  height: 48,
  speed: 320,
  speedBoostSpeed: 480,
  fireRate: 200,
  bulletSpeed: 600,
  bulletDamage: 1,
  maxHealth: 5,
  invulnerableDuration: 1500,
};

export const ENEMIES = {
  scout: {
    width: 32,
    height: 32,
    speed: 120,
    health: 1,
    fireRate: 2000,
    scoreValue: 100,
    color: '#ff4757',
  },
  fighter: {
    width: 40,
    height: 40,
    speed: 80,
    health: 2,
    fireRate: 1500,
    scoreValue: 250,
    color: '#ff6348',
  },
  bomber: {
    width: 52,
    height: 48,
    speed: 50,
    health: 5,
    fireRate: 2500,
    scoreValue: 500,
    color: '#ff7f50',
  },
  boss: {
    width: 80,
    height: 72,
    speed: 40,
    health: 30,
    fireRate: 800,
    scoreValue: 5000,
    color: '#e040fb',
  },
};

export const BULLET = {
  width: 4,
  height: 12,
  enemyWidth: 6,
  enemyHeight: 14,
  speed: 500,
  enemySpeed: 300,
  color: '#00e5ff',
  enemyColor: '#ff1744',
  trailLength: 5,
};

export const POWER_UP = {
  width: 30,
  height: 30,
  speed: 80,
  lifetime: 8000,
  shieldDuration: 5000,
  rapidFireDuration: 6000,
  multiShotDuration: 8000,
  homingDuration: 7000,
  speedBoostDuration: 6000,
  magnetDuration: 10000,
  magnetRange: 150,
  dropChance: 0.18,
  dropChanceBoss: 1.0,
};

export const PARTICLES = {
  explosionCount: 12,
  thrustCount: 2,
  explosionLifetime: 600,
  thrustLifetime: 300,
};

export const WAVE = {
  cooldown: 3000,
  scoutCount: (wave: number) => Math.min(3 + wave, 10),
  fighterCount: (wave: number) => Math.max(0, Math.floor(wave / 2) - 1),
  bomberCount: (wave: number) => Math.max(0, Math.floor(wave / 4) - 1),
  bossWave: (wave: number) => wave % 5 === 0 && wave > 0,
  difficultyScale: 0.08,
};

export const COLORS = {
  background: '#060612',
  backgroundDeep: '#020208',
  player: '#00e5ff',
  playerGlow: '#00b8d4',
  playerHighlight: '#80f0ff',
  playerShadow: '#006680',
  bullet: '#00e5ff',
  enemyBullet: '#ff1744',
  shield: '#00e5ff',
  health: '#00e676',
  healthLow: '#ff1744',
  score: '#ffffff',
  wave: '#b388ff',
  combo: '#ffd740',
  powerUp: {
    shield: '#00e5ff',
    rapidFire: '#ff9100',
    multiShot: '#e040fb',
    health: '#00e676',
    score: '#ffd740',
    homing: '#448aff',
    speedBoost: '#ffea00',
    bomb: '#ff5252',
    magnet: '#ff80ab',
  },
  stars: ['#ffffff', '#b0bec5', '#78909c', '#90caf9', '#e1bee7'],
  nebulae: [
    'rgba(30,10,60,0.12)',
    'rgba(10,30,60,0.10)',
    'rgba(60,10,30,0.08)',
    'rgba(10,50,40,0.10)',
    'rgba(40,20,60,0.09)',
  ],
};

export const DEFAULT_SETTINGS: GameSettings = {
  starCount: 120,
  particleQuality: 'high',
  screenShake: true,
  showFPS: false,
  difficulty: 'normal',
  autoFire: true,
  vibration: true,
  visualEffects: 'high',
  soundEffects: true,
};

export const DIFFICULTY_MULTIPLIERS = {
  easy: 0.7,
  normal: 1.0,
  hard: 1.5,
};
