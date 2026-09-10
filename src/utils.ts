import { Vec2, Rect } from './types';

let idCounter = 0;
export function generateId(): string {
  return `entity_${++idCounter}_${Date.now()}`;
}

export function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(v: Vec2): Vec2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 1 };
  return { x: v.x / len, y: v.y / len };
}

export function aabbCollision(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

export function randomColor(colors: string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function smoothStep(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function angleBetween(from: Vec2, to: Vec2): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

export function findNearestEnemy(
  position: Vec2,
  enemies: Array<{ position: Vec2; active: boolean }>
): { position: Vec2 } | null {
  let nearest: { position: Vec2 } | null = null;
  let minDist = Infinity;

  for (const enemy of enemies) {
    if (!enemy.active) continue;
    const d = distance(position, enemy.position);
    if (d < minDist) {
      minDist = d;
      nearest = enemy;
    }
  }

  return nearest;
}

export function lerpAngle(current: number, target: number, t: number): number {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * t;
}
