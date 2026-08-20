export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Entity {
  id: string;
  position: Vec2;
  velocity: Vec2;
  active: boolean;
}

export interface PlayerEntity extends Entity {
  type: 'player';
  health: number;
  maxHealth: number;
  width: number;
  height: number;
  fireRate: number;
  lastFired: number;
  shieldActive: boolean;
  shieldTimer: number;
  multiShot: boolean;
  multiShotTimer: number;
  rapidFire: boolean;
  rapidFireTimer: number;
  invulnerable: boolean;
  invulnerableTimer: number;
  thrustLevel: number;
}

export type EnemyType = 'scout' | 'fighter' | 'bomber' | 'boss';

export interface EnemyEntity extends Entity {
  type: 'enemy';
  enemyType: EnemyType;
  health: number;
  maxHealth: number;
  width: number;
  height: number;
  fireRate: number;
  lastFired: number;
  scoreValue: number;
  movePattern: 'straight' | 'zigzag' | 'swoop';
  patternTimer: number;
  patternPhase: number;
}

export interface BulletEntity extends Entity {
  type: 'bullet';
  damage: number;
  width: number;
  height: number;
  isEnemy: boolean;
  color: string;
  trail: boolean;
}

export interface ParticleEntity extends Entity {
  type: 'particle';
  lifetime: number;
  maxLifetime: number;
  color: string;
  size: number;
  decay: number;
}

export type PowerUpType = 'shield' | 'rapidFire' | 'multiShot' | 'health' | 'score';

export interface PowerUpEntity extends Entity {
  type: 'powerup';
  powerUpType: PowerUpType;
  width: number;
  height: number;
  lifetime: number;
  bobPhase: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export interface GameState {
  player: PlayerEntity;
  enemies: EnemyEntity[];
  bullets: BulletEntity[];
  particles: ParticleEntity[];
  powerUps: PowerUpEntity[];
  stars: Star[];
  score: number;
  highScore: number;
  wave: number;
  waveTimer: number;
  waveCooldown: number;
  gameOver: boolean;
  paused: boolean;
  lastTime: number;
  deltaTime: number;
  screenShake: Vec2;
  screenShakeIntensity: number;
  comboCount: number;
  comboTimer: number;
  totalEnemiesKilled: number;
  bossActive: boolean;
  difficultyMultiplier: number;
}

export type GameScreen = 'menu' | 'playing' | 'gameOver';
