import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnemyEntity } from '../types';
import { ENEMIES } from '../constants';
import { hexToRgba } from '../utils';

interface EnemyShipProps {
  enemy: EnemyEntity;
}

export const EnemyShip: React.FC<EnemyShipProps> = ({ enemy }) => {
  const config = ENEMIES[enemy.enemyType];
  const healthPercent = enemy.health / enemy.maxHealth;
  const tiltDeg = (enemy.visualAngle * 180) / Math.PI;
  const bankY = Math.max(-16, Math.min(16, enemy.velocity.x * 0.12));
  const pulse = enemy.enemyType === 'boss' ? 0.85 + Math.sin(Date.now() * 0.006) * 0.15 : 1;

  const baseTransform: Array<{ perspective: number } | { rotateY: string } | { rotateZ: string }> = [
    { perspective: 600 },
    { rotateY: `${bankY}deg` },
    { rotateZ: `${tiltDeg}deg` },
  ];

  if (enemy.enemyType === 'boss') {
    const hpColor =
      healthPercent > 0.5
        ? config.color
        : healthPercent > 0.25
        ? '#ff9100'
        : '#ff1744';

    return (
      <View
        style={{
          position: 'absolute',
          left: enemy.position.x - enemy.width / 2,
          top: enemy.position.y - enemy.height / 2,
          width: enemy.width,
          height: enemy.height,
        }}
      >
        <View style={{ position: 'absolute', left: 0, top: 0, width: enemy.width, height: enemy.height, transform: baseTransform }}>
          <LinearGradient
            colors={['#4a148c', '#7b1fa2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              left: enemy.width / 2 - 16,
              top: -1,
              width: 32,
              height: enemy.height + 2,
              borderRadius: 8,
              shadowColor: config.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 10,
            }}
          />
          <LinearGradient
            colors={['#9c27b0', '#6a1b9a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 10,
              width: 26,
              height: enemy.height * 0.62,
              borderRadius: 7,
              transform: [{ skewY: '-15deg' }],
              shadowColor: '#9c27b0',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
            }}
          />
          <LinearGradient
            colors={['#9c27b0', '#6a1b9a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 10,
              width: 26,
              height: enemy.height * 0.62,
              borderRadius: 7,
              transform: [{ skewY: '15deg' }],
              shadowColor: '#9c27b0',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: enemy.width / 2 - 12,
              top: 3,
              width: 14,
              height: enemy.height - 8,
              backgroundColor: hexToRgba('#ffffff', 0.12),
              borderRadius: 6,
            }}
          />

          <View
            style={{
              position: 'absolute',
              left: enemy.width / 2 - 10,
              top: enemy.height * 0.22,
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2.5,
              borderColor: '#ffffff',
              backgroundColor: '#ff1744',
              shadowColor: '#ff1744',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.9,
              shadowRadius: 10,
              transform: [{ scale: pulse }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: enemy.width / 2 - 5,
              top: enemy.height * 0.27,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#ffffff',
              opacity: 0.85,
            }}
          />

          <LinearGradient
            colors={['#e040fb', '#7b1fa2', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: enemy.width / 2 - 8,
              bottom: -10,
              width: 16,
              height: 22,
              borderRadius: 8,
              opacity: 0.8,
            }}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            left: -12,
            top: -14,
            width: enemy.width + 24,
            height: 5,
            borderRadius: 3,
            backgroundColor: '#222',
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[hpColor, hpColor, hexToRgba(hpColor, 0.5)]}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${healthPercent * 100}%`,
              height: '100%',
              borderRadius: 3,
            }}
          />
        </View>
      </View>
    );
  }

  const hpColor = config.color;

  return (
    <View
      style={{
        position: 'absolute',
        left: enemy.position.x - enemy.width / 2,
        top: enemy.position.y - enemy.height / 2,
        width: enemy.width,
        height: enemy.height,
        transform: baseTransform,
      }}
    >
      <LinearGradient
        colors={['#7b1fa2', config.color, hexToRgba(config.color, 0.6)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 9,
          top: -1,
          width: 18,
          height: enemy.height * 0.78,
          borderRadius: 5,
          transform: [{ rotate: '180deg' }],
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 7,
        }}
      />
      <LinearGradient
        colors={[hexToRgba(config.color, 0.35), hexToRgba(config.color, 0.8)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          top: enemy.height * 0.18,
          width: 15,
          height: enemy.height * 0.4,
          borderRadius: 3,
          transform: [{ rotate: '180deg' }, { skewY: '-11deg' }],
        }}
      />
      <LinearGradient
        colors={[hexToRgba(config.color, 0.35), hexToRgba(config.color, 0.8)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          right: 0,
          top: enemy.height * 0.18,
          width: 15,
          height: enemy.height * 0.4,
          borderRadius: 3,
          transform: [{ rotate: '180deg' }, { skewY: '11deg' }],
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 6,
          top: 2,
          width: 8,
          height: enemy.height * 0.55,
          borderRadius: 4,
          backgroundColor: hexToRgba('#ffffff', 0.25),
          transform: [{ rotate: '180deg' }],
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 5,
          top: enemy.height * 0.12,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#ffffff',
          shadowColor: '#ffffff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 4,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 3,
          top: -5,
          width: 6,
          height: 10,
          borderRadius: 3,
          backgroundColor: hpColor,
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 5,
        }}
      />
    </View>
  );
};