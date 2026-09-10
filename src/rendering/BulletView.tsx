import React from 'react';
import { View } from 'react-native';
import { BulletEntity } from '../types';

interface BulletViewProps {
  bullet: BulletEntity;
}

export const BulletView: React.FC<BulletViewProps> = ({ bullet }) => {
  return (
    <>
      {bullet.trail &&
        bullet.trailPositions.map((pos, i) => {
          const trailOpacity = (i + 1) / (bullet.trailPositions.length + 2) * 0.4;
          const trailSize = (i + 1) / (bullet.trailPositions.length + 2);
          return (
            <View
              key={`trail-${i}`}
              style={{
                position: 'absolute',
                left: pos.x - (bullet.width * trailSize) / 2,
                top: pos.y - (bullet.height * trailSize * 0.6) / 2,
                width: bullet.width * trailSize,
                height: bullet.height * trailSize * 0.6,
                backgroundColor: bullet.color,
                borderRadius: bullet.width * trailSize / 2,
                opacity: trailOpacity,
              }}
            />
          );
        })}

      <View
        style={{
          position: 'absolute',
          left: bullet.position.x - bullet.width / 2 - 2,
          top: bullet.position.y - bullet.height / 2 - 2,
          width: bullet.width + 4,
          height: bullet.height + 4,
          borderRadius: (bullet.width + 4) / 2,
          backgroundColor: bullet.color,
          opacity: 0.15,
          shadowColor: bullet.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: bullet.position.x - bullet.width / 2,
          top: bullet.position.y - bullet.height / 2,
          width: bullet.width,
          height: bullet.height,
          backgroundColor: '#ffffff',
          borderRadius: bullet.width / 2,
          opacity: 0.7,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: bullet.position.x - bullet.width / 2 + 0.5,
          top: bullet.position.y - bullet.height / 2,
          width: bullet.width - 1,
          height: bullet.height,
          backgroundColor: bullet.color,
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
            backgroundColor: '#448aff',
            opacity: 0.3,
            shadowColor: '#448aff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 6,
          }}
        />
      )}
    </>
  );
};
