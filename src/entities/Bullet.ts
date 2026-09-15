import { BulletEntity, GameState, Vec2 } from '../types';
import { BULLET, SCREEN } from '../constants';
import { generateId, normalize, findNearestEnemy, angleBetween, lerpAngle } from '../utils';

export function createPlayerBullet(
  state: GameState,
  position: { x: number; y: number },
  direction: Vec2,
  multiShot: boolean = false
): BulletEntity[] {
  const bullets: BulletEntity[] = [];
  const isHoming = state.player.homingActive;

  const dir = normalize(direction);
  bullets.push({
    id: generateId(),
    type: 'bullet',
    position: { ...position },
    velocity: { x: dir.x * BULLET.speed, y: dir.y * BULLET.speed },
    active: true,
    damage: state.player.rapidFire ? 2 : 1,
    width: BULLET.width,
    height: BULLET.height,
    isEnemy: false,
    color: state.player.rapidFire ? '#ffab00' : isHoming ? '#448aff' : BULLET.color,
    trail: true,
    homing: isHoming,
    trailPositions: [],
  });

  if (multiShot) {
    const spreadAngle = 0.15;
    bullets.push({
      id: generateId(),
      type: 'bullet',
      position: { x: position.x - 12, y: position.y },
      velocity: {
        x: Math.sin(-spreadAngle) * BULLET.speed,
        y: Math.cos(-spreadAngle) * BULLET.speed,
      },
      active: true,
      damage: state.player.rapidFire ? 2 : 1,
      width: BULLET.width,
      height: BULLET.height,
      isEnemy: false,
      color: '#e040fb',
      trail: true,
      homing: isHoming,
      trailPositions: [],
    });
    bullets.push({
      id: generateId(),
      type: 'bullet',
      position: { x: position.x + 12, y: position.y },
      velocity: {
        x: Math.sin(spreadAngle) * BULLET.speed,
        y: Math.cos(spreadAngle) * BULLET.speed,
      },
      active: true,
      damage: state.player.rapidFire ? 2 : 1,
      width: BULLET.width,
      height: BULLET.height,
      isEnemy: false,
      color: '#e040fb',
      trail: true,
      homing: isHoming,
      trailPositions: [],
    });
  }

  return bullets;
}

export function createEnemyBullet(
  position: { x: number; y: number },
  direction: Vec2,
  isBoss: boolean = false
): BulletEntity {
  const dir = normalize(direction);
  return {
    id: generateId(),
    type: 'bullet',
    position: { ...position },
    velocity: {
      x: dir.x * BULLET.enemySpeed * (isBoss ? 1.3 : 1),
      y: dir.y * BULLET.enemySpeed * (isBoss ? 1.3 : 1),
    },
    active: true,
    damage: isBoss ? 2 : 1,
    width: isBoss ? 8 : BULLET.enemyWidth,
    height: isBoss ? 16 : BULLET.enemyHeight,
    isEnemy: true,
    color: isBoss ? '#e040fb' : BULLET.enemyColor,
    trail: false,
    homing: false,
    trailPositions: [],
  };
}

export function updateBullets(state: GameState): void {
  const dt = state.deltaTime / 1000;
  const margin = 50;

  for (const bullet of state.bullets) {
    if (!bullet.active) continue;

    if (bullet.homing && !bullet.isEnemy) {
      const target = findNearestEnemy(bullet.position, state.enemies);
      if (target) {
        const targetAngle = angleBetween(bullet.position, target.position);
        const currentAngle = Math.atan2(bullet.velocity.y, bullet.velocity.x);
        const newAngle = lerpAngle(currentAngle, targetAngle, Math.min(dt * 5, 1));
        const speed = Math.sqrt(
          bullet.velocity.x * bullet.velocity.x + bullet.velocity.y * bullet.velocity.y
        );
        bullet.velocity.x = Math.cos(newAngle) * speed;
        bullet.velocity.y = Math.sin(newAngle) * speed;
      }
    }

    if (bullet.trail && bullet.trailPositions.length === 0) {
      bullet.trailPositions = [{ ...bullet.position }];
    }

    bullet.position.x += bullet.velocity.x * dt;
    bullet.position.y += bullet.velocity.y * dt;

    if (
      bullet.position.x < -margin ||
      bullet.position.x > SCREEN.width + margin ||
      bullet.position.y < -margin ||
      bullet.position.y > SCREEN.height + margin
    ) {
      bullet.active = false;
    }
  }
}
