import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BulletEntity } from '../types';
import { hexToRgba } from '../utils';

interface BulletViewProps {
  bullet: BulletEntity;
}

const TRAIL_LENGTH = 34;

// Each bullet is a single stretched gradient that fades behind its travel
// direction — this replaces the old multi-view trail (5 trail copies + glow +
// core per bullet) with one native view, which is what dominates cost when the
// player spams many streams of bullets.
export const BulletView: React.FC<BulletViewProps> = ({ bullet }) => {
  const speed = Math.hypot(bullet.velocity.x, bullet.velocity.y) || 1;
  const dx = bullet.velocity.x / speed;
  const dy = bullet.velocity.y / speed;

  const length = bullet.height + TRAIL_LENGTH;
  const width = bullet.width + 2;

  const cx = bullet.position.x - dx * (length / 2);
  const cy = bullet.position.y - dy * (length / 2);

  return (
    <>
      <LinearGradient
        colors={[hexToRgba(bullet.color, 0.06), bullet.color, '#ffffff']}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5 - dx * 0.5, y: 0.5 - dy * 0.5 }}
        end={{ x: 0.5 + dx * 0.5, y: 0.5 + dy * 0.5 }}
        style={{
          position: 'absolute',
          left: cx - width / 2,
          top: cy - length / 2,
          width,
          height: length,
          borderRadius: width / 2,
        }}
      />
      {bullet.homing && (
        <View
          style={{
            position: 'absolute',
            left: bullet.position.x - 4,
            top: bullet.position.y - 4,
            width: 8,
            height: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: hexToRgba('#448aff', 0.6),
            backgroundColor: hexToRgba('#448aff', 0.25),
          }}
        />
      )}
    </>
  );
};