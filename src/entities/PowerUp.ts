import { PowerUpEntity, PowerUpType, GameState } from '../types';
import { POWER_UP, SCREEN } from '../constants';
import { generateId, randomRange } from '../utils';

const POWER_UP_WEIGHTS: Record<PowerUpType, number> = {
  shield: 12,
  rapidFire: 12,
  multiShot: 10,
  health: 15,
  score: 15,
  homing: 10,
  speedBoost: 10,
  bomb: 8,
  magnet: 8,
};

function weightedRandomType(): PowerUpType {
  const totalWeight = Object.values(POWER_UP_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  for (const [type, weight] of Object.entries(POWER_UP_WEIGHTS)) {
    roll -= weight;
    if (roll <= 0) return type as PowerUpType;
  }
  return 'health';
}

export function createPowerUp(position: { x: number; y: number }): PowerUpEntity {
  const type = weightedRandomType();

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
    glowIntensity: 1,
  };
}

export function updatePowerUps(state: GameState): void {
  const dt = state.deltaTime / 1000;

  for (const pu of state.powerUps) {
    if (!pu.active) continue;

    pu.position.y += pu.velocity.y * dt;
    pu.position.x += Math.sin(pu.bobPhase + Date.now() * 0.003) * 0.5;
    pu.lifetime -= state.deltaTime;
    pu.glowIntensity = 0.6 + Math.sin(Date.now() * 0.006 + pu.bobPhase) * 0.4;

    if (state.player.magnetActive && state.player.active) {
      const dx = state.player.position.x - pu.position.x;
      const dy = state.player.position.y - pu.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < POWER_UP.magnetRange && dist > 5) {
        const pullSpeed = 300 * dt;
        pu.position.x += (dx / dist) * pullSpeed;
        pu.position.y += (dy / dist) * pullSpeed;
      }
    }

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
    case 'homing':
      player.homingActive = true;
      player.homingTimer = POWER_UP.homingDuration;
      break;
    case 'speedBoost':
      player.speedBoost = true;
      player.speedBoostTimer = POWER_UP.speedBoostDuration;
      break;
    case 'bomb':
      for (const enemy of state.enemies) {
        if (enemy.active) {
          enemy.active = false;
          state.score += Math.floor(
            enemy.scoreValue * (1 + state.comboCount * 0.1)
          );
          state.comboCount++;
          state.comboTimer = 2000;
          state.totalEnemiesKilled++;
        }
      }
      state.screenShakeIntensity = 20;
      break;
    case 'magnet':
      player.magnetActive = true;
      player.magnetTimer = POWER_UP.magnetDuration;
      break;
  }
}

export function shouldDropPowerUp(isBoss: boolean = false): boolean {
  if (isBoss) return true;
  return Math.random() < POWER_UP.dropChance;
}
