import React from 'react';
import { View } from 'react-native';
import { ParticleEntity } from '../types';

interface ParticleViewProps {
  particle: ParticleEntity;
}

export const ParticleView: React.FC<ParticleViewProps> = ({ particle }) => {
  const opacity = Math.max(0, particle.lifetime / particle.maxLifetime);
  const size = particle.size * (0.3 + opacity * 0.7);
  const isFlash = particle.size > 12;

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
        opacity: opacity * 0.9,
        shadowColor: particle.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isFlash ? opacity * 0.8 : opacity * 0.4,
        shadowRadius: isFlash ? size * 0.6 : size * 0.3,
      }}
    />
  );
};
