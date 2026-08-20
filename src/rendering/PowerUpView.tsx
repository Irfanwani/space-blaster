import React from 'react';
import { View, Text } from 'react-native';
import { PowerUpEntity } from '../types';
import { COLORS, POWER_UP } from '../constants';
import { hexToRgba } from '../utils';

interface PowerUpViewProps {
  powerUp: PowerUpEntity;
}

const ICONS: Record<string, string> = {
  shield: 'S',
  rapidFire: 'R',
  multiShot: 'M',
  health: '+',
  score: '$',
};

export const PowerUpView: React.FC<PowerUpViewProps> = ({ powerUp }) => {
  const color = COLORS.powerUp[powerUp.powerUpType];

  return (
    <View
      style={{
        position: 'absolute',
        left: powerUp.position.x - POWER_UP.width / 2,
        top: powerUp.position.y - POWER_UP.height / 2,
        width: POWER_UP.width,
        height: POWER_UP.height,
        borderRadius: POWER_UP.width / 2,
        backgroundColor: hexToRgba(color, 0.3),
        borderWidth: 2,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 6,
      }}
    >
      <Text
        style={{
          color: color,
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {ICONS[powerUp.powerUpType]}
      </Text>
    </View>
  );
};
