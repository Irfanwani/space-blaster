import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ParticleEntity } from '../types';
import { hexToRgba } from '../utils';

interface ParticleViewProps {
  particle: ParticleEntity;
}

export const ParticleView: React.FC<ParticleViewProps> = ({ particle }) => {
  const progress = 1 - particle.lifetime / particle.maxLifetime;
  const opacity = Math.max(0, particle.lifetime / particle.maxLifetime);
  const size = particle.size * (0.3 + opacity * 0.7);
  const isFlash = particle.size > 12;

  if (particle.isShockwave) {
    const ringSize = size * (0.2 + progress * 0.8);
    return (
      <LinearGradient
        colors={[
          hexToRgba(particle.color, 0),
          hexToRgba(particle.color, opacity),
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: particle.position.x - ringSize / 2,
          top: particle.position.y - ringSize / 2,
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          opacity,
          borderWidth: 2,
          borderColor: hexToRgba(particle.color, Math.min(1, opacity * 1.5)),
          shadowColor: particle.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: opacity,
          shadowRadius: ringSize * 0.15,
        }}
      />
    );
  }

  if (isFlash) {
    return (
      <LinearGradient
        colors={['#ffffff', particle.color, hexToRgba(particle.color, 0.1)]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: particle.position.x - size / 2,
          top: particle.position.y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: opacity,
          shadowColor: particle.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: opacity * 0.9,
          shadowRadius: size * 0.6,
        }}
      />
    );
  }

  return (
    <LinearGradient
      colors={[particle.color, hexToRgba(particle.color, 0.15)]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 0.5, y: 1 }}
      style={{
        position: 'absolute',
        left: particle.position.x - size / 2,
        top: particle.position.y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        opacity: opacity * 0.9,
        shadowColor: particle.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: opacity * 0.5,
        shadowRadius: size * 0.35,
      }}
    />
  );
};