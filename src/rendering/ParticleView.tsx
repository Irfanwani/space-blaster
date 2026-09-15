import React from 'react';
import { View } from 'react-native';
import { ParticleEntity } from '../types';
import { hexToRgba } from '../utils';

interface ParticleViewProps {
  particle: ParticleEntity;
}

// Cheap glow ring drawn with two plain Views instead of shadow-based glows
// (Android shadows are very expensive when hundreds of views re-render/frame).
export const ParticleView: React.FC<ParticleViewProps> = ({ particle }) => {
  const progress = 1 - particle.lifetime / particle.maxLifetime;
  const opacity = Math.max(0, particle.lifetime / particle.maxLifetime);
  const size = particle.size * (0.3 + opacity * 0.7);
  const isFlash = particle.size > 12;

  if (particle.isShockwave) {
    const ringSize = size * (0.2 + progress * 0.8);
    return (
      <View
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
          backgroundColor: hexToRgba(particle.color, opacity * 0.12),
        }}
      />
    );
  }

  if (isFlash) {
    return (
      <>
        <View
          style={{
            position: 'absolute',
            left: particle.position.x - size / 2,
            top: particle.position.y - size / 2,
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity: opacity * 0.3,
            backgroundColor: particle.color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: particle.position.x - size * 0.4,
            top: particle.position.y - size * 0.4,
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            opacity: opacity,
            backgroundColor: '#ffffff',
          }}
        />
      </>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: particle.position.x - size / 2,
        top: particle.position.y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        opacity: opacity * 0.9,
        backgroundColor: particle.color,
      }}
    />
  );
};