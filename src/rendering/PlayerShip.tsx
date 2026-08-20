import React from 'react';
import { View } from 'react-native';
import { PlayerEntity } from '../types';
import { COLORS } from '../constants';
import { hexToRgba } from '../utils';

interface PlayerShipProps {
  player: PlayerEntity;
}

export const PlayerShip: React.FC<PlayerShipProps> = ({ player }) => {
  const { position, shieldActive, invulnerable, rapidFire, multiShot } = player;
  const blinkOn = !invulnerable || Math.floor(Date.now() / 100) % 2 === 0;

  return (
    <View
      style={{
        position: 'absolute',
        left: position.x - player.width / 2,
        top: position.y - player.height / 2,
        width: player.width,
        height: player.height,
        opacity: blinkOn ? 1 : 0.3,
      }}
    >
      {shieldActive && (
        <View
          style={{
            position: 'absolute',
            left: -8,
            top: -8,
            width: player.width + 16,
            height: player.height + 16,
            borderRadius: (player.width + 16) / 2,
            borderWidth: 2,
            borderColor: COLORS.shield,
            backgroundColor: hexToRgba(COLORS.shield, 0.15),
          }}
        />
      )}

      <View
        style={{
          position: 'absolute',
          left: player.width / 2 - 6,
          top: 0,
          width: 12,
          height: player.height,
          backgroundColor: COLORS.player,
          borderRadius: 6,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          top: player.height * 0.35,
          width: 18,
          height: player.height * 0.45,
          backgroundColor: COLORS.playerGlow,
          borderRadius: 4,
          transform: [{ skewY: '10deg' }],
        }}
      />

      <View
        style={{
          position: 'absolute',
          right: 0,
          top: player.height * 0.35,
          width: 18,
          height: player.height * 0.45,
          backgroundColor: COLORS.playerGlow,
          borderRadius: 4,
          transform: [{ skewY: '-10deg' }],
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: player.width / 2 - 5,
          top: player.height * 0.15,
          width: 10,
          height: 14,
          backgroundColor: '#ffffff',
          borderRadius: 5,
          opacity: 0.9,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: player.width / 2 - 4,
          bottom: -2,
          width: 8,
          height: 10 * player.thrustLevel,
          backgroundColor: rapidFire ? '#ff9100' : '#00e5ff',
          borderRadius: 4,
          opacity: 0.8,
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: 4,
          bottom: -1,
          width: 5,
          height: 7 * player.thrustLevel,
          backgroundColor: '#00bcd4',
          borderRadius: 3,
          opacity: 0.7,
        }}
      />

      <View
        style={{
          position: 'absolute',
          right: 4,
          bottom: -1,
          width: 5,
          height: 7 * player.thrustLevel,
          backgroundColor: '#00bcd4',
          borderRadius: 3,
          opacity: 0.7,
        }}
      />

      {multiShot && (
        <>
          <View
            style={{
              position: 'absolute',
              left: -3,
              top: player.height * 0.3,
              width: 6,
              height: 6,
              backgroundColor: '#e040fb',
              borderRadius: 3,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: -3,
              top: player.height * 0.3,
              width: 6,
              height: 6,
              backgroundColor: '#e040fb',
              borderRadius: 3,
            }}
          />
        </>
      )}
    </View>
  );
};
