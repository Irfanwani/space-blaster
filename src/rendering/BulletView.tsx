import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BulletEntity } from '../types';
import { hexToRgba } from '../utils';

interface BulletViewProps {
  bullet: BulletEntity;
}

export const BulletView: React.FC<BulletViewProps> = ({ bullet }) => {
  return (
    <>
      {bullet.trail &&
        bullet.trailPositions.map((pos, i) => {
          const trailOpacity = (i + 1) / (bullet.trailPositions.length + 2) * 0.45;
          const trailSize = (i + 1) / (bullet.trailPositions.length + 2);
          return (
            <LinearGradient
              key={`trail-${i}`}
              colors={[bullet.color, hexToRgba(bullet.color, 0.2)]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                position: 'absolute',
                left: pos.x - (bullet.width * trailSize) / 2,
                top: pos.y - (bullet.height * trailSize * 0.6) / 2,
                width: bullet.width * trailSize + 2,
                height: bullet.height * trailSize * 0.6,
                borderRadius: (bullet.width * trailSize + 2) / 2,
                opacity: trailOpacity,
              }}
            />
          );
        })}

      <LinearGradient
        colors={[bullet.color, hexToRgba(bullet.color, 0.1)]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: bullet.position.x - bullet.width / 2 - 3,
          top: bullet.position.y - bullet.height / 2 - 3,
          width: bullet.width + 6,
          height: bullet.height + 6,
          borderRadius: (bullet.width + 6) / 2,
          opacity: 0.35,
          shadowColor: bullet.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
        }}
      />

      <LinearGradient
        colors={['#ffffff', bullet.color, hexToRgba(bullet.color, 0.3)]}
        locations={[0, 0.7, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: bullet.position.x - bullet.width / 2,
          top: bullet.position.y - bullet.height / 2,
          width: bullet.width,
          height: bullet.height,
          borderRadius: bullet.width / 2,
          shadowColor: bullet.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 5,
          elevation: 5,
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
            backgroundColor: hexToRgba('#448aff', 0.4),
            opacity: 0.5,
            shadowColor: '#448aff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 7,
          }}
        />
      )}
    </>
  );
};