import React, { useMemo, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Nebula } from '../types';
import { SCREEN, COLORS } from '../constants';
import { randomRange } from '../utils';

interface StarFieldProps {
  stars: Star[];
  nebulae: Nebula[];
}

// Static layer: the full-screen background gradient never changes, so it is
// memoized to avoid repainting it (and re-diffing it) on every game frame.
const StarBG = memo(() => (
  <LinearGradient
    colors={['#03030c', COLORS.backgroundDeep, '#0a0a24']}
    locations={[0, 0.55, 1]}
    style={StyleSheet.absoluteFill}
  />
));

function createStar(layer: number = 0): Star {
  const layerConfigs = [
    { sizeMin: 0.3, sizeMax: 0.8, speedMin: 8, speedMax: 25, brightMin: 0.15, brightMax: 0.35 },
    { sizeMin: 0.6, sizeMax: 1.5, speedMin: 20, speedMax: 60, brightMin: 0.3, brightMax: 0.7 },
    { sizeMin: 1.2, sizeMax: 2.8, speedMin: 50, speedMax: 120, brightMin: 0.6, brightMax: 1.0 },
    { sizeMin: 2.0, sizeMax: 3.5, speedMin: 80, speedMax: 160, brightMin: 0.8, brightMax: 1.0 },
  ];
  const cfg = layerConfigs[Math.min(layer, layerConfigs.length - 1)];

  return {
    x: randomRange(0, SCREEN.width),
    y: randomRange(0, SCREEN.height),
    size: randomRange(cfg.sizeMin, cfg.sizeMax),
    speed: randomRange(cfg.speedMin, cfg.speedMax),
    brightness: randomRange(cfg.brightMin, cfg.brightMax),
    layer,
    twinklePhase: randomRange(0, Math.PI * 2),
  };
}

function createNebula(): Nebula {
  return {
    x: randomRange(-100, SCREEN.width + 100),
    y: randomRange(-200, SCREEN.height),
    width: randomRange(200, 400),
    height: randomRange(150, 350),
    color: randomColor(COLORS.nebulae),
    speed: randomRange(5, 18),
    opacity: randomRange(0.4, 1.0),
    rotation: randomRange(0, 360),
  };
}

function randomColor(colors: string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function initStars(count: number = 120): Star[] {
  const stars: Star[] = [];
  const layers = [0.4, 0.3, 0.2, 0.1];
  for (let layer = 0; layer < 4; layer++) {
    const layerCount = Math.floor(count * layers[layer]);
    for (let i = 0; i < layerCount; i++) {
      stars.push(createStar(layer));
    }
  }
  return stars;
}

export function initNebulae(count: number = 5): Nebula[] {
  return Array.from({ length: count }, createNebula);
}

export function updateStars(stars: Star[], dt: number): void {
  for (const star of stars) {
    star.y += star.speed * dt;
    star.twinklePhase += dt * 2;
    if (star.y > SCREEN.height + 5) {
      star.y = -5;
      star.x = randomRange(0, SCREEN.width);
    }
  }
}

export function updateNebulae(nebulae: Nebula[], dt: number): void {
  for (const nebula of nebulae) {
    nebula.y += nebula.speed * dt;
    nebula.rotation += dt * 3;
    if (nebula.y > SCREEN.height + nebula.height) {
      nebula.y = -nebula.height - randomRange(50, 200);
      nebula.x = randomRange(-100, SCREEN.width + 100);
      nebula.color = randomColor(COLORS.nebulae);
    }
  }
}

export const StarField: React.FC<StarFieldProps> = ({ stars, nebulae }) => {
  const sortedStars = useMemo(() => {
    return [...stars].sort((a, b) => a.layer - b.layer);
  }, [stars]);

  return (
    <View style={styles.container}>
      <StarBG />

      {nebulae.map((nebula, i) => {
        const core = nebula.color.replace(/[\d.]+\)$/, '0.22)');
        return (
          <LinearGradient
            key={`neb-${i}`}
            colors={[core, nebula.color, 'transparent']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              left: nebula.x - nebula.width / 2,
              top: nebula.y - nebula.height / 2,
              width: nebula.width,
              height: nebula.height,
              borderRadius: nebula.width / 2,
              opacity: nebula.opacity,
              transform: [{ rotate: `${nebula.rotation}deg` }],
            }}
          />
        );
      })}

      {sortedStars.map((star, i) => {
        const twinkle =
          star.layer >= 2
            ? 0.8 + Math.sin(star.twinklePhase) * 0.2
            : 1;
        const starColor =
          star.layer === 0
            ? '#556688'
            : star.layer === 1
            ? COLORS.stars[i % COLORS.stars.length]
            : star.layer === 2
            ? COLORS.stars[(i + 1) % COLORS.stars.length]
            : '#ffffff';

        const isNear = star.layer >= 3;
        const streak = isNear ? star.size * 2.4 : star.size;
        const size = isNear ? star.size * 1.25 : star.size;

        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: star.x - size / 2,
              top: star.y - size / 2,
              width: size,
              height: streak,
              borderRadius: isNear ? 1.5 : size / 2,
              backgroundColor: starColor,
              opacity: star.brightness * twinkle,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN.width,
    height: SCREEN.height,
    backgroundColor: COLORS.backgroundDeep,
  },
});