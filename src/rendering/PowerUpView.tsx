import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const spin = (Date.now() * 0.004 + powerUp.bobPhase) % 360;

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
          left: -6,
          top: -6,
          width: POWER_UP.width + 12,
          height: POWER_UP.height + 12,
          borderRadius: (POWER_UP.width + 12) / 2,
          opacity: glowPulse,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 16,
        }}
      />

      <LinearGradient
        colors={['transparent', hexToRgba(color, 0.35 * glowPulse), 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: POWER_UP.width / 2 - POWER_UP.width,
          top: POWER_UP.height / 2 - POWER_UP.height / 2,
          width: POWER_UP.width * 2,
          height: POWER_UP.height,
          borderRadius: POWER_UP.width,
          opacity: glowPulse,
        }}
      />

      <LinearGradient
        colors={[hexToRgba('#ffffff', 0.55), color, hexToRgba(color, 0.4)]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POWER_UP.width,
          height: POWER_UP.height,
          borderRadius: POWER_UP.width / 2,
          borderWidth: 2,
          borderColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 8,
          elevation: 8,
          overflow: 'hidden',
          transform: [{ perspective: 200 }, { rotateY: `${spin * 0.2}deg` }],
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
            backgroundColor: hexToRgba('#ffffff', 0.3 * pulse),
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
            backgroundColor: '#ffffff',
            opacity: 0.35,
          }}
        />
      </LinearGradient>

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