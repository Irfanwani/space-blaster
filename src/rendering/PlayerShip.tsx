import React from 'react';
import { View } from 'react-native';
import { PlayerEntity } from '../types';
import { COLORS } from '../constants';
import { hexToRgba } from '../utils';

interface PlayerShipProps {
  player: PlayerEntity;
}

export const PlayerShip: React.FC<PlayerShipProps> = ({ player }) => {
  const {
    position,
    shieldActive,
    invulnerable,
    rapidFire,
    multiShot,
    speedBoost,
    homingActive,
    magnetActive,
    visualAngle,
    width,
    height,
  } = player;
  const blinkOn = !invulnerable || Math.floor(Date.now() / 100) % 2 === 0;
  const tiltDeg = (visualAngle * 180) / Math.PI;

  const shipColor = speedBoost ? '#ffea00' : COLORS.player;
  const shipGlow = speedBoost ? '#ffd600' : COLORS.playerGlow;
  const shipHighlight = speedBoost ? '#ffffff' : COLORS.playerHighlight;
  const shipShadow = speedBoost ? '#b8a000' : COLORS.playerShadow;

  return (
    <View
      style={{
        position: 'absolute',
        left: position.x - width / 2,
        top: position.y - height / 2,
        width,
        height,
        opacity: blinkOn ? 1 : 0.3,
        transform: [{ rotate: `${tiltDeg}deg` }],
      }}
    >
      {shieldActive && (
        <View
          style={{
            position: 'absolute',
            left: -12,
            top: -12,
            width: width + 24,
            height: height + 24,
            borderRadius: (width + 24) / 2,
            borderWidth: 2.5,
            borderColor: COLORS.shield,
            backgroundColor: hexToRgba(COLORS.shield, 0.12),
            shadowColor: COLORS.shield,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
          }}
        />
      )}

      <View
        style={{
          position: 'absolute',
          left: 4,
          top: height * 0.32,
          width: 16,
          height: height * 0.48,
          backgroundColor: shipShadow,
          borderRadius: 5,
          transform: [{ skewY: '12deg' }],
          opacity: 0.6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 4,
          top: height * 0.32,
          width: 16,
          height: height * 0.48,
          backgroundColor: shipShadow,
          borderRadius: 5,
          transform: [{ skewY: '-12deg' }],
          opacity: 0.6,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: width / 2 - 7,
          top: -1,
          width: 14,
          height: height + 2,
          backgroundColor: shipColor,
          borderRadius: 7,
          shadowColor: shipColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: width / 2 - 5,
          top: 2,
          width: 10,
          height: height - 6,
          backgroundColor: shipHighlight,
          borderRadius: 5,
          opacity: 0.35,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: -1,
          top: height * 0.3,
          width: 19,
          height: height * 0.48,
          backgroundColor: shipGlow,
          borderRadius: 5,
          transform: [{ skewY: '10deg' }],
          shadowColor: shipGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 1,
          top: height * 0.32,
          width: 12,
          height: height * 0.35,
          backgroundColor: shipHighlight,
          borderRadius: 4,
          transform: [{ skewY: '10deg' }],
          opacity: 0.3,
        }}
      />

      <View
        style={{
          position: 'absolute',
          right: -1,
          top: height * 0.3,
          width: 19,
          height: height * 0.48,
          backgroundColor: shipGlow,
          borderRadius: 5,
          transform: [{ skewY: '-10deg' }],
          shadowColor: shipGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 1,
          top: height * 0.32,
          width: 12,
          height: height * 0.35,
          backgroundColor: shipHighlight,
          borderRadius: 4,
          transform: [{ skewY: '-10deg' }],
          opacity: 0.3,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: width / 2 - 6,
          top: height * 0.12,
          width: 12,
          height: 16,
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          opacity: 0.95,
          shadowColor: '#ffffff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 3,
          top: height * 0.14,
          width: 6,
          height: 6,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          opacity: 0.6,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: width / 2 - 5,
          bottom: -3,
          width: 10,
          height: 14 * player.thrustLevel,
          backgroundColor: rapidFire ? '#ff9100' : shipColor,
          borderRadius: 5,
          opacity: 0.9,
          shadowColor: rapidFire ? '#ff9100' : shipColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.7,
          shadowRadius: 6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 3,
          bottom: -1,
          width: 6,
          height: 8 * player.thrustLevel,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          opacity: 0.6,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 4,
          bottom: -2,
          width: 6,
          height: 9 * player.thrustLevel,
          backgroundColor: '#00bcd4',
          borderRadius: 3,
          opacity: 0.75,
          shadowColor: '#00bcd4',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 4,
          bottom: -2,
          width: 6,
          height: 9 * player.thrustLevel,
          backgroundColor: '#00bcd4',
          borderRadius: 3,
          opacity: 0.75,
          shadowColor: '#00bcd4',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}
      />

      {multiShot && (
        <>
          <View
            style={{
              position: 'absolute',
              left: -4,
              top: height * 0.28,
              width: 7,
              height: 7,
              backgroundColor: '#e040fb',
              borderRadius: 4,
              shadowColor: '#e040fb',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -4,
              top: height * 0.28,
              width: 7,
              height: 7,
              backgroundColor: '#e040fb',
              borderRadius: 4,
              shadowColor: '#e040fb',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
        </>
      )}

      {homingActive && (
        <View
          style={{
            position: 'absolute',
            left: width / 2 - 4,
            top: -6,
            width: 8,
            height: 8,
            backgroundColor: '#448aff',
            borderRadius: 4,
            shadowColor: '#448aff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 6,
          }}
        />
      )}

      {magnetActive && (
        <>
          <View
            style={{
              position: 'absolute',
              left: -8,
              top: height * 0.5,
              width: 5,
              height: 5,
              backgroundColor: '#ff80ab',
              borderRadius: 3,
              shadowColor: '#ff80ab',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -8,
              top: height * 0.5,
              width: 5,
              height: 5,
              backgroundColor: '#ff80ab',
              borderRadius: 3,
              shadowColor: '#ff80ab',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
            }}
          />
        </>
      )}
    </View>
  );
};
