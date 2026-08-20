import { PowerUpEntity, PowerUpType, GameState } from '../types';
import { POWER_UP, SCREEN, COLORS } from '../constants';
import { generateId, randomRange } from '../utils';

const POWER_UP_TYPES: PowerUpType[] = ['shield', 'rapidFire', 'multiShot', 'health', 'score'];

export function createPowerUp(position: { x: number; y: number }): PowerUpEntity {
  const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];

  return {
    id: generateId(),
    type: 'powerup',
    position: { ...position },
    velocity: { x: 0, y: POWER_UP.speed },
    active: true,
    powerUpType: type,
    width: POWER_UP.width,
    height: POWER_UP.height,
    lifetime: POWER_UP.lifetime,
    bobPhase: randomRange(0, Math.PI * 2),
  };
}

export function updatePowerUps(state: GameState): void {
  const dt = state.deltaTime / 1000;

  for (const pu of state.powerUps) {
    if (!pu.active) continue;

    pu.position.y += pu.velocity.y * dt;
    pu.position.x += Math.sin(pu.bobPhase + Date.now() * 0.003) * 0.5;
    pu.lifetime -= state.deltaTime;

    if (pu.position.y > SCREEN.height + 50 || pu.lifetime <= 0) {
      pu.active = false;
    }
  }
}

export function applyPowerUp(state: GameState, powerUpType: PowerUpType): void {
  const { player } = state;

  switch (powerUpType) {
    case 'shield':
      player.shieldActive = true;
      player.shieldTimer = POWER_UP.shieldDuration;
      break;
    case 'rapidFire':
      player.rapidFire = true;
      player.rapidFireTimer = POWER_UP.rapidFireDuration;
      player.fireRate = 80;
      break;
    case 'multiShot':
      player.multiShot = true;
      player.multiShotTimer = POWER_UP.multiShotDuration;
      break;
    case 'health':
      player.health = Math.min(player.health + 1, player.maxHealth);
      break;
    case 'score':
      state.score += 1000;
      break;
  }
}

export function shouldDropPowerUp(): boolean {
  return Math.random() < POWER_UP.dropChance;
}
