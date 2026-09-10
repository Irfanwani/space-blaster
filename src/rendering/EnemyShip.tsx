import React from 'react';
import { View } from 'react-native';
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

  if (enemy.enemyType === 'boss') {
    return (
      <View
        style={{
          position: 'absolute',
          left: enemy.position.x - enemy.width / 2,
          top: enemy.position.y - enemy.height / 2,
          width: enemy.width,
          height: enemy.height,
          transform: [{ rotate: `${tiltDeg}deg` }],
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: -8,
            top: 14,
            width: 26,
            height: enemy.height * 0.65,
            backgroundColor: '#7b1fa2',
            borderRadius: 6,
            transform: [{ skewY: '-16deg' }],
            opacity: 0.7,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: -8,
            top: 14,
            width: 26,
            height: enemy.height * 0.65,
            backgroundColor: '#7b1fa2',
            borderRadius: 6,
            transform: [{ skewY: '16deg' }],
            opacity: 0.7,
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: enemy.width / 2 - 16,
            top: -1,
            width: 32,
            height: enemy.height + 2,
            backgroundColor: config.color,
            borderRadius: 8,
            shadowColor: config.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
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
            left: 0,
            top: 10,
            width: 26,
            height: enemy.height * 0.62,
            backgroundColor: '#9c27b0',
            borderRadius: 7,
            transform: [{ skewY: '-15deg' }],
            shadowColor: '#9c27b0',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 10,
            width: 26,
            height: enemy.height * 0.62,
            backgroundColor: '#9c27b0',
            borderRadius: 7,
            transform: [{ skewY: '15deg' }],
            shadowColor: '#9c27b0',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: enemy.width / 2 - 10,
            top: enemy.height * 0.22,
            width: 20,
            height: 20,
            backgroundColor: '#ff1744',
            borderRadius: 10,
            borderWidth: 2.5,
            borderColor: '#ffffff',
            shadowColor: '#ff1744',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: enemy.width / 2 - 5,
            top: enemy.height * 0.27,
            width: 10,
            height: 10,
            backgroundColor: '#ffffff',
            borderRadius: 5,
            opacity: 0.85,
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: -12,
            top: -14,
            width: enemy.width + 24,
            height: 5,
            backgroundColor: '#222',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${healthPercent * 100}%`,
              height: '100%',
              backgroundColor:
                healthPercent > 0.5
                  ? config.color
                  : healthPercent > 0.25
                  ? '#ff9100'
                  : '#ff1744',
              borderRadius: 3,
              shadowColor:
                healthPercent > 0.5
                  ? config.color
                  : healthPercent > 0.25
                  ? '#ff9100'
                  : '#ff1744',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            left: enemy.width / 2 - 6,
            bottom: -4,
            width: 12,
            height: 10,
            backgroundColor: '#e040fb',
            borderRadius: 6,
            opacity: 0.7,
            shadowColor: '#e040fb',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 5,
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        left: enemy.position.x - enemy.width / 2,
        top: enemy.position.y - enemy.height / 2,
        width: enemy.width,
        height: enemy.height,
        transform: [{ rotate: `${tiltDeg}deg` }],
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: 2,
          top: enemy.height * 0.18,
          width: 14,
          height: enemy.height * 0.38,
          backgroundColor: hexToRgba(config.color, 0.5),
          borderRadius: 3,
          transform: [{ rotate: '180deg' }, { skewY: '-11deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 2,
          top: enemy.height * 0.18,
          width: 14,
          height: enemy.height * 0.38,
          backgroundColor: hexToRgba(config.color, 0.5),
          borderRadius: 3,
          transform: [{ rotate: '180deg' }, { skewY: '11deg' }],
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 9,
          top: -1,
          width: 18,
          height: enemy.height * 0.72,
          backgroundColor: config.color,
          borderRadius: 5,
          transform: [{ rotate: '180deg' }],
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 6,
          top: 2,
          width: 8,
          height: enemy.height * 0.55,
          backgroundColor: hexToRgba('#ffffff', 0.2),
          borderRadius: 4,
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
          backgroundColor: '#ffffff',
          borderRadius: 5,
          shadowColor: '#ffffff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 3,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 3,
          top: -4,
          width: 6,
          height: 6,
          backgroundColor: hexToRgba(config.color, 0.8),
          borderRadius: 3,
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 4,
        }}
      />
    </View>
  );
};
