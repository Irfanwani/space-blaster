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
  speedBoost: boolean;
  speedBoostTimer: number;
  homingActive: boolean;
  homingTimer: number;
  magnetActive: boolean;
  magnetTimer: number;
  visualAngle: number;
  smoothX: number;
  smoothY: number;
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
  visualAngle: number;
}

export interface BulletEntity extends Entity {
  type: 'bullet';
  damage: number;
  width: number;
  height: number;
  isEnemy: boolean;
  color: string;
  trail: boolean;
  homing: boolean;
  trailPositions: Vec2[];
}

export interface ParticleEntity extends Entity {
  type: 'particle';
  lifetime: number;
  maxLifetime: number;
  color: string;
  size: number;
  decay: number;
}

export type PowerUpType =
  | 'shield'
  | 'rapidFire'
  | 'multiShot'
  | 'health'
  | 'score'
  | 'homing'
  | 'speedBoost'
  | 'bomb'
  | 'magnet';

export interface PowerUpEntity extends Entity {
  type: 'powerup';
  powerUpType: PowerUpType;
  width: number;
  height: number;
  lifetime: number;
  bobPhase: number;
  glowIntensity: number;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
  layer: number;
  twinklePhase: number;
}

export interface Nebula {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  opacity: number;
  rotation: number;
}

export interface GameSettings {
  starCount: number;
  particleQuality: 'low' | 'medium' | 'high';
  screenShake: boolean;
  showFPS: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  autoFire: boolean;
  vibration: boolean;
  visualEffects: 'low' | 'medium' | 'high';
}

export interface GameState {
  player: PlayerEntity;
  enemies: EnemyEntity[];
  bullets: BulletEntity[];
  particles: ParticleEntity[];
  powerUps: PowerUpEntity[];
  stars: Star[];
  nebulae: Nebula[];
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
  settings: GameSettings;
  fps: number;
  fpsTimer: number;
  fpsCount: number;
}

export type GameScreenType = 'menu' | 'playing' | 'gameOver' | 'settings';

export interface SavedGameState {
  score: number;
  wave: number;
  playerHealth: number;
  playerMaxHealth: number;
  playerPosition: Vec2;
  shieldActive: boolean;
  rapidFire: boolean;
  multiShot: boolean;
  speedBoost: boolean;
  homingActive: boolean;
  magnetActive: boolean;
  comboCount: number;
  totalEnemiesKilled: number;
}
