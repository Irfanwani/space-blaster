import React from 'react';
import { View } from 'react-native';
import { Star } from '../types';
import { SCREEN, COLORS } from '../constants';
import { randomRange } from '../utils';

interface StarFieldProps {
  stars: Star[];
}

function createStar(): Star {
  return {
    x: randomRange(0, SCREEN.width),
    y: randomRange(0, SCREEN.height),
    size: randomRange(0.5, 2.5),
    speed: randomRange(20, 100),
    brightness: randomRange(0.3, 1),
  };
}

export function initStars(count: number = 80): Star[] {
  return Array.from({ length: count }, createStar);
}

export function updateStars(stars: Star[], dt: number): void {
  for (const star of stars) {
    star.y += star.speed * dt;
    if (star.y > SCREEN.height + 5) {
      star.y = -5;
      star.x = randomRange(0, SCREEN.width);
      star.size = randomRange(0.5, 2.5);
      star.speed = randomRange(20, 100);
    }
  }
}

export const StarField: React.FC<StarFieldProps> = ({ stars }) => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, width: SCREEN.width, height: SCREEN.height }}>
      {stars.map((star, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            borderRadius: star.size / 2,
            backgroundColor: COLORS.stars[i % COLORS.stars.length],
            opacity: star.brightness,
          }}
        />
      ))}
    </View>
  );
};
