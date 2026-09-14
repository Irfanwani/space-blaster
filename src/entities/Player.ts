import { PlayerEntity, GameState } from '../types';
import { PLAYER, SCREEN } from '../constants';
import { generateId, clamp, smoothStep } from '../utils';

export function createPlayer(): PlayerEntity {
  const startX = SCREEN.width / 2;
  const startY = SCREEN.height - 100;
  return {
    id: generateId(),
    type: 'player',
    position: { x: startX, y: startY },
    velocity: { x: 0, y: 0 },
    active: true,
    health: PLAYER.maxHealth,
    maxHealth: PLAYER.maxHealth,
    width: PLAYER.width,
    height: PLAYER.height,
    fireRate: PLAYER.fireRate,
    lastFired: 0,
    shieldActive: false,
    shieldTimer: 0,
    multiShot: false,
    multiShotTimer: 0,
    rapidFire: false,
    rapidFireTimer: 0,
    invulnerable: false,
    invulnerableTimer: 0,
    thrustLevel: 1,
    speedBoost: false,
    speedBoostTimer: 0,
    homingActive: false,
    homingTimer: 0,
    magnetActive: false,
    magnetTimer: 0,
    visualAngle: 0,
    smoothX: startX,
    smoothY: startY,
  };
}

export function movePlayer(
  state: GameState,
  targetX: number,
  targetY: number
): void {
  const { player } = state;
  const dt = state.deltaTime / 1000;
  const speed = player.speedBoost ? PLAYER.speedBoostSpeed : PLAYER.speed;

  const dx = targetX - player.position.x;
  const dy = targetY - player.position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 1) {
    const moveSpeed = Math.min(speed * dt, dist);
    player.position.x += (dx / dist) * moveSpeed;
    player.position.y += (dy / dist) * moveSpeed;
  }

  const prevX = player.smoothX;
  const prevY = player.smoothY;
  if (dt > 0) {
    const vx = (player.position.x - prevX) / dt;
    const vy = (player.position.y - prevY) / dt;
    player.velocity.x = smoothStep(player.velocity.x, vx, Math.min(dt * 10, 1));
    player.velocity.y = smoothStep(player.velocity.y, vy, Math.min(dt * 10, 1));
  }
  player.smoothX = player.position.x;
  player.smoothY = player.position.y;

  const targetAngle = clamp(dx * 0.02, -0.25, 0.25);
  player.visualAngle = smoothStep(player.visualAngle, targetAngle, Math.min(dt * 8, 1));

  const halfW = player.width / 2;
  const halfH = player.height / 2;
  player.position.x = clamp(player.position.x, halfW, SCREEN.width - halfW);
  player.position.y = clamp(player.position.y, halfH, SCREEN.height - halfH);

  if (player.invulnerable) {
    player.invulnerableTimer -= state.deltaTime;
    if (player.invulnerableTimer <= 0) {
      player.invulnerable = false;
    }
  }

  if (player.shieldActive) {
    player.shieldTimer -= state.deltaTime;
    if (player.shieldTimer <= 0) {
      player.shieldActive = false;
    }
  }

  if (player.rapidFire) {
    player.rapidFireTimer -= state.deltaTime;
    if (player.rapidFireTimer <= 0) {
      player.rapidFire = false;
      player.fireRate = PLAYER.fireRate;
    }
  }

  if (player.multiShot) {
    player.multiShotTimer -= state.deltaTime;
    if (player.multiShotTimer <= 0) {
      player.multiShot = false;
    }
  }

  if (player.speedBoost) {
    player.speedBoostTimer -= state.deltaTime;
    if (player.speedBoostTimer <= 0) {
      player.speedBoost = false;
    }
  }

  if (player.homingActive) {
    player.homingTimer -= state.deltaTime;
    if (player.homingTimer <= 0) {
      player.homingActive = false;
    }
  }

  if (player.magnetActive) {
    player.magnetTimer -= state.deltaTime;
    if (player.magnetTimer <= 0) {
      player.magnetActive = false;
    }
  }

  player.thrustLevel = clamp(
    0.8 + Math.sin(Date.now() * 0.01) * 0.2,
    0.6,
    1.0
  );
}

export function damagePlayer(state: GameState, damage: number = 1): boolean {
  const { player } = state;
  if (player.invulnerable || player.shieldActive) {
    if (player.shieldActive) {
      player.shieldActive = false;
      player.shieldTimer = 0;
    }
    return false;
  }

  player.health -= damage;
  player.invulnerable = true;
  player.invulnerableTimer = PLAYER.invulnerableDuration;

  state.screenShakeIntensity = 8;

  if (player.health <= 0) {
    player.health = 0;
    player.active = false;
    return true;
  }
  return false;
}
