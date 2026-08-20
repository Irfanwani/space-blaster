import { PlayerEntity, GameState } from '../types';
import { PLAYER, SCREEN } from '../constants';
import { generateId, clamp } from '../utils';

export function createPlayer(): PlayerEntity {
  return {
    id: generateId(),
    type: 'player',
    position: { x: SCREEN.width / 2, y: SCREEN.height - 100 },
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
  };
}

export function movePlayer(
  state: GameState,
  targetX: number,
  targetY: number
): void {
  const { player } = state;
  const dt = state.deltaTime / 1000;
  const speed = PLAYER.speed;

  const dx = targetX - player.position.x;
  const dy = targetY - player.position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 2) {
    const moveSpeed = Math.min(speed * dt, dist);
    player.position.x += (dx / dist) * moveSpeed;
    player.position.y += (dy / dist) * moveSpeed;
  }

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
