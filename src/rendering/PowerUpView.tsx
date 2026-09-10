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
  homing: 'H',
  speedBoost: '>',
  bomb: '!',
  magnet: 'U',
};

export const PowerUpView: React.FC<PowerUpViewProps> = ({ powerUp }) => {
  const color = COLORS.powerUp[powerUp.powerUpType];
  const pulse = 0.85 + Math.sin(Date.now() * 0.005 + powerUp.bobPhase) * 0.15;
  const glowPulse = 0.6 + Math.sin(Date.now() * 0.004 + powerUp.bobPhase) * 0.4;

  return (
    <View
      style={{
        position: 'absolute',
        left: powerUp.position.x - POWER_UP.width / 2,
        top: powerUp.position.y - POWER_UP.height / 2,
        width: POWER_UP.width,
        height: POWER_UP.height,
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: -4,
          top: -4,
          width: POWER_UP.width + 8,
          height: POWER_UP.height + 8,
          borderRadius: (POWER_UP.width + 8) / 2,
          backgroundColor: hexToRgba(color, 0.08 * glowPulse),
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4 * glowPulse,
          shadowRadius: 10,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POWER_UP.width,
          height: POWER_UP.height,
          borderRadius: POWER_UP.width / 2,
          backgroundColor: hexToRgba(color, 0.25),
          borderWidth: 2,
          borderColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 8,
          elevation: 8,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: POWER_UP.width * 0.15,
            top: POWER_UP.height * 0.1,
            width: POWER_UP.width * 0.4,
            height: POWER_UP.height * 0.35,
            borderRadius: POWER_UP.width * 0.2,
            backgroundColor: hexToRgba('#ffffff', 0.25 * pulse),
          }}
        />

        <View
          style={{
            position: 'absolute',
            right: POWER_UP.width * 0.1,
            bottom: POWER_UP.height * 0.08,
            width: POWER_UP.width * 0.25,
            height: POWER_UP.height * 0.2,
            borderRadius: POWER_UP.width * 0.12,
            backgroundColor: hexToRgba(color, 0.3),
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          left: POWER_UP.width / 2 - 10,
          top: POWER_UP.height / 2 - 10,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: hexToRgba(color, 0.15),
          transform: [{ scale: pulse }],
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POWER_UP.width,
          height: POWER_UP.height,
          borderRadius: POWER_UP.width / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
            textShadowColor: color,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          }}
        >
          {ICONS[powerUp.powerUpType]}
        </Text>
      </View>
    </View>
  );
};
