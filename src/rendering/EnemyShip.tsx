import React from 'react';
import { View } from 'react-native';
import { EnemyEntity } from '../types';
import { ENEMIES, COLORS } from '../constants';
import { hexToRgba } from '../utils';

interface EnemyShipProps {
  enemy: EnemyEntity;
}

export const EnemyShip: React.FC<EnemyShipProps> = ({ enemy }) => {
  const config = ENEMIES[enemy.enemyType];
  const healthPercent = enemy.health / enemy.maxHealth;

  if (enemy.enemyType === 'boss') {
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
        <View
          style={{
            position: 'absolute',
            left: enemy.width / 2 - 15,
            top: 0,
            width: 30,
            height: enemy.height,
            backgroundColor: config.color,
            borderRadius: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 24,
            height: enemy.height * 0.6,
            backgroundColor: '#9c27b0',
            borderRadius: 6,
            transform: [{ skewY: '-15deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 10,
            width: 24,
            height: enemy.height * 0.6,
            backgroundColor: '#9c27b0',
            borderRadius: 6,
            transform: [{ skewY: '15deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: enemy.width / 2 - 8,
            top: enemy.height * 0.25,
            width: 16,
            height: 16,
            backgroundColor: '#ff1744',
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#ffffff',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: -10,
            top: -12,
            width: enemy.width + 20,
            height: 4,
            backgroundColor: '#333',
            borderRadius: 2,
          }}
        >
          <View
            style={{
              width: `${healthPercent * 100}%`,
              height: '100%',
              backgroundColor: healthPercent > 0.5 ? '#e040fb' : '#ff1744',
              borderRadius: 2,
            }}
          />
        </View>
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
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 8,
          top: 0,
          width: 16,
          height: enemy.height * 0.7,
          backgroundColor: config.color,
          borderRadius: 4,
          transform: [{ rotate: '180deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: enemy.height * 0.2,
          width: 14,
          height: enemy.height * 0.4,
          backgroundColor: hexToRgba(config.color, 0.7),
          borderRadius: 3,
          transform: [{ rotate: '180deg' }, { skewY: '-10deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: enemy.height * 0.2,
          width: 14,
          height: enemy.height * 0.4,
          backgroundColor: hexToRgba(config.color, 0.7),
          borderRadius: 3,
          transform: [{ rotate: '180deg' }, { skewY: '10deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: enemy.width / 2 - 4,
          top: enemy.height * 0.15,
          width: 8,
          height: 8,
          backgroundColor: '#ffffff',
          borderRadius: 4,
        }}
      />
    </View>
  );
};
