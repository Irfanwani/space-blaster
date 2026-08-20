import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

export const PLAYER = {
  width: 44,
  height: 48,
  speed: 320,
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
};

export const POWER_UP = {
  width: 28,
  height: 28,
  speed: 80,
  lifetime: 8000,
  shieldDuration: 5000,
  rapidFireDuration: 6000,
  multiShotDuration: 8000,
  dropChance: 0.15,
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
  background: '#0a0a1a',
  player: '#00e5ff',
  playerGlow: '#00b8d4',
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
  },
  stars: ['#ffffff', '#b0bec5', '#78909c', '#90caf9'],
};
