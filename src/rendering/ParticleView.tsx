import React from 'react';
import { View } from 'react-native';
import { ParticleEntity } from '../types';

interface ParticleViewProps {
  particle: ParticleEntity;
}

export const ParticleView: React.FC<ParticleViewProps> = ({ particle }) => {
  const opacity = Math.max(0, particle.lifetime / particle.maxLifetime);
  const size = particle.size * (0.5 + opacity * 0.5);

  return (
    <View
      style={{
        position: 'absolute',
        left: particle.position.x - size / 2,
        top: particle.position.y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: particle.color,
        opacity,
      }}
    />
  );
};
