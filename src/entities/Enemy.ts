import { EnemyEntity, EnemyType, GameState, Vec2 } from '../types';
import { ENEMIES, SCREEN, WAVE } from '../constants';
import { generateId, randomRange, randomInt } from '../utils';

export function createEnemy(type: EnemyType, wave: number): EnemyEntity {
  const config = ENEMIES[type];
  const difficulty = 1 + wave * WAVE.difficultyScale;

  let x: number;
  let y: number;

  if (type === 'boss') {
    x = SCREEN.width / 2;
    y = -60;
  } else {
    x = randomRange(config.width / 2, SCREEN.width - config.width / 2);
    y = randomRange(-80, -config.height);
  }

  const patterns: Array<'straight' | 'zigzag' | 'swoop'> = ['straight', 'zigzag', 'swoop'];

  return {
    id: generateId(),
    type: 'enemy',
    position: { x, y },
    velocity: { x: 0, y: config.speed * Math.min(difficulty, 2.0) },
    active: true,
    enemyType: type,
    health: Math.ceil(config.health * difficulty),
    maxHealth: Math.ceil(config.health * difficulty),
    width: config.width,
    height: config.height,
    fireRate: Math.max(400, config.fireRate / Math.min(difficulty, 1.5)),
    lastFired: Date.now() + randomRange(0, 1000),
    scoreValue: Math.ceil(config.scoreValue * difficulty),
    movePattern: type === 'boss' ? 'zigzag' : patterns[randomInt(0, 2)],
    patternTimer: 0,
    patternPhase: randomRange(0, Math.PI * 2),
  };
}

export function updateEnemy(enemy: EnemyEntity, state: GameState): void {
  const dt = state.deltaTime / 1000;

  enemy.patternTimer += state.deltaTime;

  switch (enemy.movePattern) {
    case 'straight':
      enemy.position.y += enemy.velocity.y * dt;
      break;

    case 'zigzag': {
      enemy.position.y += enemy.velocity.y * dt;
      const zigAmplitude = enemy.enemyType === 'boss' ? 120 : 60;
      const zigFreq = enemy.enemyType === 'boss' ? 0.002 : 0.003;
      enemy.position.x += Math.sin(enemy.patternTimer * zigFreq + enemy.patternPhase) * zigAmplitude * dt;
      break;
    }

    case 'swoop': {
      const swoopPhase = enemy.patternTimer / 1000;
      if (swoopPhase < 2) {
        enemy.position.y += enemy.velocity.y * dt * 1.5;
      } else {
        enemy.position.y += enemy.velocity.y * dt * 0.3;
        const swoopX = Math.sin(swoopPhase * 2) * 200 * dt;
        enemy.position.x += swoopX;
      }
      break;
    }
  }

  if (enemy.enemyType === 'boss') {
    enemy.position.x = Math.max(
      enemy.width / 2 + 20,
      Math.min(SCREEN.width - enemy.width / 2 - 20, enemy.position.x)
    );
    if (enemy.position.y < 80) {
      enemy.position.y += 60 * dt;
    }
  }

  enemy.position.x = Math.max(
    enemy.width / 2,
    Math.min(SCREEN.width - enemy.width / 2, enemy.position.x)
  );

  if (enemy.position.y > SCREEN.height + 100) {
    enemy.active = false;
  }
}

export function spawnWave(state: GameState): void {
  const { wave } = state;
  state.waveCooldown = WAVE.cooldown;
  state.waveTimer = 0;
  state.bossActive = WAVE.bossWave(wave);

  if (state.bossActive) {
    state.enemies.push(createEnemy('boss', wave));
    return;
  }

  const scouts = WAVE.scoutCount(wave);
  const fighters = WAVE.fighterCount(wave);
  const bombers = WAVE.bomberCount(wave);

  for (let i = 0; i < scouts; i++) {
    setTimeout(() => {
      if (!state.gameOver) {
        state.enemies.push(createEnemy('scout', wave));
      }
    }, i * 300);
  }

  for (let i = 0; i < fighters; i++) {
    setTimeout(() => {
      if (!state.gameOver) {
        state.enemies.push(createEnemy('fighter', wave));
      }
    }, 500 + i * 400);
  }

  for (let i = 0; i < bombers; i++) {
    setTimeout(() => {
      if (!state.gameOver) {
        state.enemies.push(createEnemy('bomber', wave));
      }
    }, 1000 + i * 600);
  }
}

export function shouldEnemyFire(enemy: EnemyEntity, now: number): boolean {
  if (now - enemy.lastFired < enemy.fireRate) return false;
  if (enemy.position.y < 0) return false;
  if (enemy.enemyType === 'boss') return enemy.position.y >= 60;
  return enemy.position.y < SCREEN.height * 0.7;
}

export function getEnemyFireDirection(enemy: EnemyEntity): Vec2 {
  if (enemy.enemyType === 'boss') {
    const spread = randomRange(-0.3, 0.3);
    return { x: spread, y: 1 };
  }
  return { x: 0, y: 1 };
}
