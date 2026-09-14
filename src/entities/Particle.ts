import { ParticleEntity, GameState, Vec2 } from '../types';
import { COLORS } from '../constants';
import { generateId, randomRange, randomColor } from '../utils';

export function createExplosion(
  position: Vec2,
  count: number = 12,
  colors?: string[]
): ParticleEntity[] {
  const particles: ParticleEntity[] = [];
  const palette = colors || ['#ff6b35', '#ff9a3c', '#ffcc02', '#ff4757', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + randomRange(-0.3, 0.3);
    const speed = randomRange(80, 250);
    const lifetime = randomRange(300, 600);

    particles.push({
      id: generateId(),
      type: 'particle',
      position: { x: position.x, y: position.y },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      active: true,
      lifetime,
      maxLifetime: lifetime,
      color: randomColor(palette),
      size: randomRange(2, 6),
      decay: 1,
    });
  }

  for (let i = 0; i < 3; i++) {
    particles.push({
      id: generateId(),
      type: 'particle',
      position: { x: position.x, y: position.y },
      velocity: { x: 0, y: 0 },
      active: true,
      lifetime: 400,
      maxLifetime: 400,
      color: '#ffffff',
      size: randomRange(15, 30),
      decay: 2,
    });
  }

  particles.push(createShockwaveRing(position, palette[0], randomRange(50, 65), 350));

  return particles;
}

export function createThrusterParticle(
  position: Vec2,
  thrustLevel: number
): ParticleEntity {
  return {
    id: generateId(),
    type: 'particle',
    position: {
      x: position.x + randomRange(-4, 4),
      y: position.y + 20,
    },
    velocity: {
      x: randomRange(-15, 15),
      y: randomRange(60, 120) * thrustLevel,
    },
    active: true,
    lifetime: 200,
    maxLifetime: 200,
    color: randomColor([COLORS.player, COLORS.playerGlow, '#00bcd4']),
    size: randomRange(2, 4),
    decay: 1.5,
  };
}

export function createHitSpark(position: Vec2, count: number = 5): ParticleEntity[] {
  const particles: ParticleEntity[] = [];

  for (let i = 0; i < count; i++) {
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(50, 150);

    particles.push({
      id: generateId(),
      type: 'particle',
      position: { x: position.x, y: position.y },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      active: true,
      lifetime: 200,
      maxLifetime: 200,
      color: '#ffffff',
      size: randomRange(1, 3),
      decay: 2,
    });
  }

  return particles;
}

export function createMuzzleFlash(
  position: Vec2,
  count: number = 3,
  colors?: string[]
): ParticleEntity[] {
  const palette = colors || ['#ffffff', '#7df9ff', '#00e5ff'];
  const particles: ParticleEntity[] = [];

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + randomRange(-0.35, 0.35);
    const speed = randomRange(150, 300);

    particles.push({
      id: generateId(),
      type: 'particle',
      position: { x: position.x, y: position.y },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      active: true,
      lifetime: randomRange(80, 150),
      maxLifetime: 150,
      color: randomColor(palette),
      size: randomRange(1.5, 3.5),
      decay: 2.5,
    });
  }

  particles.push({
    id: generateId(),
    type: 'particle',
    position: { x: position.x, y: position.y },
    velocity: { x: randomRange(-10, 10), y: randomRange(-10, -30) },
    active: true,
    lifetime: 100,
    maxLifetime: 100,
    color: '#ffffff',
    size: randomRange(10, 16),
    decay: 3,
  });

  return particles;
}

export function createShockwaveRing(
  position: Vec2,
  color: string = '#7df9ff',
  maxRadius: number = 40,
  lifetime: number = 300
): ParticleEntity {
  return {
    id: generateId(),
    type: 'particle',
    position: { x: position.x, y: position.y },
    velocity: { x: 0, y: 0 },
    active: true,
    lifetime,
    maxLifetime: lifetime,
    color,
    size: maxRadius,
    decay: 1,
    isShockwave: true,
  };
}

export function updateParticles(state: GameState): void {
  const dt = state.deltaTime / 1000;

  for (const particle of state.particles) {
    if (!particle.active) continue;

    particle.position.x += particle.velocity.x * dt;
    particle.position.y += particle.velocity.y * dt;

    particle.velocity.x *= 0.98;
    particle.velocity.y *= 0.98;

    particle.lifetime -= state.deltaTime;

    if (particle.lifetime <= 0) {
      particle.active = false;
    }
  }
}
