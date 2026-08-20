import { GameState, Rect } from '../types';
import { aabbCollision } from '../utils';

function getEntityRect(
  entity: { position: { x: number; y: number } },
  width: number,
  height: number
): Rect {
  return {
    x: entity.position.x - width / 2,
    y: entity.position.y - height / 2,
    width,
    height,
  };
}

export function checkCollisions(state: GameState): {
  playerHit: boolean;
  enemyHits: Set<string>;
  bulletHits: Set<string>;
  powerUpHits: Set<string>;
} {
  const playerHit = false;
  const enemyHits = new Set<string>();
  const bulletHits = new Set<string>();
  const powerUpHits = new Set<string>();

  const playerRect = getEntityRect(state.player, state.player.width, state.player.height);

  for (const bullet of state.bullets) {
    if (!bullet.active) continue;
    const bulletRect = getEntityRect(bullet, bullet.width, bullet.height);

    if (!bullet.isEnemy) {
      for (const enemy of state.enemies) {
        if (!enemy.active || enemyHits.has(enemy.id)) continue;
        const enemyRect = getEntityRect(enemy, enemy.width, enemy.height);

        if (aabbCollision(bulletRect, enemyRect)) {
          bulletHits.add(bullet.id);
          enemyHits.add(enemy.id);
          break;
        }
      }
    } else {
      if (!state.player.invulnerable && !state.player.shieldActive) {
        if (aabbCollision(bulletRect, playerRect)) {
          bulletHits.add(bullet.id);
          return { playerHit: true, enemyHits, bulletHits, powerUpHits };
        }
      }
    }
  }

  if (!state.player.invulnerable) {
    for (const enemy of state.enemies) {
      if (!enemy.active || enemyHits.has(enemy.id)) continue;
      const enemyRect = getEntityRect(enemy, enemy.width, enemy.height);

      if (aabbCollision(playerRect, enemyRect)) {
        enemyHits.add(enemy.id);
        return { playerHit: true, enemyHits, bulletHits, powerUpHits };
      }
    }
  }

  for (const powerUp of state.powerUps) {
    if (!powerUp.active) continue;
    const puRect = getEntityRect(powerUp, powerUp.width, powerUp.height);

    if (aabbCollision(playerRect, puRect)) {
      powerUpHits.add(powerUp.id);
    }
  }

  return { playerHit, enemyHits, bulletHits, powerUpHits };
}
