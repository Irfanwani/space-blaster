import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    velocity,
    width,
    height,
    thrustLevel,
  } = player;

  const blinkOn = !invulnerable || Math.floor(Date.now() / 100) % 2 === 0;
  const tiltDeg = (visualAngle * 180) / Math.PI;

  const bankY = Math.max(-16, Math.min(16, -velocity.x * 0.055));
  const bankX = Math.max(-14, Math.min(14, velocity.y * 0.04));
  const bankZ = Math.max(-14, Math.min(14, tiltDeg * 0.5));

  const sideShearX = Math.max(-5, Math.min(5, velocity.x * 0.012));
  const sideShearY = Math.max(-4, Math.min(4, -velocity.y * 0.012));

  const flicker =
    0.8 + Math.sin(Date.now() * 0.05) * 0.2 + Math.sin(Date.now() * 0.117) * 0.1;
  const flameH = (12 + 8 * thrustLevel) * flicker;
  const flameW = 3.5 + (speedBoost ? 1.5 : 0);

  const shipColor = speedBoost ? '#ffea00' : COLORS.player;
  const shipGlow = speedBoost ? '#ffd600' : COLORS.playerGlow;
  const shipHighlight = speedBoost ? '#ffffff' : COLORS.playerHighlight;
  const shipShadow = speedBoost ? '#b8a000' : COLORS.playerShadow;
  const wingOuter = speedBoost ? '#fff9c4' : '#b3f6ff';

  const nosePulse = 0.65 + Math.sin(Date.now() * 0.02) * 0.35;

  return (
    <View
      style={{
        position: 'absolute',
        left: position.x - width / 2,
        top: position.y - height / 2,
        width,
        height,
        opacity: blinkOn ? 1 : 0.3,
        transform: [
          { perspective: 400 },
          { rotateY: `${bankY}deg` },
          { rotateX: `${bankX}deg` },
          { rotateZ: `${bankZ}deg` },
          { skewX: `${sideShearX}deg` },
          { skewY: `${sideShearY}deg` },
        ],
      }}
    >
      {shieldActive && (
        <>
          <View
            style={{
              position: 'absolute',
              left: -16,
              top: -16,
              width: width + 32,
              height: height + 32,
              borderRadius: (width + 32) / 2,
              borderWidth: 2.5,
              borderColor: COLORS.shield,
              backgroundColor: hexToRgba(COLORS.shield, 0.08),
              shadowColor: COLORS.shield,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 16,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: -10,
              top: -10,
              width: width + 20,
              height: height + 20,
              borderRadius: (width + 20) / 2,
              borderWidth: 1,
              borderColor: hexToRgba('#ffffff', 0.7),
              opacity: 0.5 + Math.sin(Date.now() * 0.02) * 0.3,
            }}
          />
        </>
      )}

      {/* engine heat glow */}
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 14,
          top: height - 14,
          width: 28,
          height: 16,
          borderRadius: 14,
          opacity: 0.55,
          shadowColor: shipGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 12,
        }}
      />

      {/* left wing (lower layer, behind fuselage) */}
      <LinearGradient
        colors={[shipShadow, shipColor, wingOuter]}
        locations={[0, 0.55, 1]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={{
          position: 'absolute',
          left: 4,
          top: 12,
          width: 17,
          height: 34,
          borderRadius: 4,
          transform: [{ skewY: '-24deg' }],
          shadowColor: shipGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      />
      {/* left wing trailing edge light */}
      <View
        style={{
          position: 'absolute',
          left: 1,
          top: height - 11,
          width: 5,
          height: 12,
          borderRadius: 3,
          backgroundColor: wingOuter,
          opacity: 0.5 + nosePulse * 0.3,
          shadowColor: wingOuter,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }}
      />

      {/* right wing */}
      <LinearGradient
        colors={[shipShadow, shipColor, wingOuter]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          position: 'absolute',
          left: width - 21,
          top: 12,
          width: 17,
          height: 34,
          borderRadius: 4,
          transform: [{ skewY: '24deg' }],
          shadowColor: shipGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      />
      {/* right wing trailing edge light */}
      <View
        style={{
          position: 'absolute',
          right: 1,
          top: height - 11,
          width: 5,
          height: 12,
          borderRadius: 3,
          backgroundColor: wingOuter,
          opacity: 0.5 + nosePulse * 0.3,
          shadowColor: wingOuter,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }}
      />

      {/* wing tip gun cannons */}
      <LinearGradient
        colors={[shipHighlight, shipGlow, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: 1,
          top: 8,
          width: 4,
          height: 16,
          borderRadius: 2,
          opacity: 0.9,
        }}
      />
      <LinearGradient
        colors={[shipHighlight, shipGlow, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          right: 1,
          top: 8,
          width: 4,
          height: 16,
          borderRadius: 2,
          opacity: 0.9,
        }}
      />

      {/* fuselage body */}
      <LinearGradient
        colors={[shipHighlight, shipColor, shipShadow]}
        locations={[0, 0.4, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: width / 2 - 7,
          top: 4,
          width: 14,
          height: 40,
          borderRadius: 7,
          shadowColor: shipGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
        }}
      />
      {/* fuselage spine highlight */}
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', hexToRgba(shipColor, 0.2), 'transparent']}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: width / 2 - 1.5,
          top: 8,
          width: 3,
          height: 30,
          borderRadius: 1.5,
          opacity: 0.8,
        }}
      />

      {/* nose tip */}
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 5,
          top: -3,
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderBottomWidth: 9,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: shipHighlight,
          opacity: 0.55 + nosePulse * 0.45,
          shadowColor: shipHighlight,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 4,
        }}
      />

      {/* cockpit canopy */}
      <LinearGradient
        colors={['#ffffff', '#a8ecff', hexToRgba(shipGlow, 0.35)]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: width / 2 - 4,
          top: 8,
          width: 8,
          height: 13,
          borderRadius: 4,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.5)',
          shadowColor: '#ffffff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 4,
        }}
      />
      {/* canopy glint */}
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 2,
          top: 9,
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: '#ffffff',
          opacity: 0.9,
        }}
      />

      {/* left engine nacelle */}
      <LinearGradient
        colors={[shipShadow, shipColor, shipGlow]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: width / 2 - 10,
          top: height - 16,
          width: 8,
          height: 12,
          borderRadius: 4,
        }}
      />
      {/* right engine nacelle */}
      <LinearGradient
        colors={[shipShadow, shipColor, shipGlow]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: width / 2 + 2,
          top: height - 16,
          width: 8,
          height: 12,
          borderRadius: 4,
        }}
      />

      {/* engine flames */}
      {!speedBoost && (
        <>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', shipColor, 'transparent']}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 - 10 + 2,
              top: height - 4,
              width: flameW,
              height: flameH,
              borderRadius: flameW / 2,
              opacity: 0.95,
            }}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', shipColor, 'transparent']}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 + 2 + 2,
              top: height - 4,
              width: flameW,
              height: flameH,
              borderRadius: flameW / 2,
              opacity: 0.95,
            }}
          />
          <LinearGradient
            colors={[hexToRgba(shipGlow, 0.6), 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 - 10,
              top: height - 2,
              width: 8,
              height: flameH * 0.7,
              borderRadius: 4,
              opacity: 0.5,
            }}
          />
          <LinearGradient
            colors={[hexToRgba(shipGlow, 0.6), 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 + 2,
              top: height - 2,
              width: 8,
              height: flameH * 0.7,
              borderRadius: 4,
              opacity: 0.5,
            }}
          />
        </>
      )}

      {speedBoost && (
        <>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', '#ff9100', shipGlow, 'transparent']}
            locations={[0, 0.4, 0.7, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 - 11,
              top: height - 4,
              width: 8,
              height: flameH * 1.5,
              borderRadius: 4,
              opacity: 0.95,
            }}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', '#ff9100', shipGlow, 'transparent']}
            locations={[0, 0.4, 0.7, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 + 3,
              top: height - 4,
              width: 8,
              height: flameH * 1.5,
              borderRadius: 4,
              opacity: 0.95,
            }}
          />
          <LinearGradient
            colors={[hexToRgba('#ff9100', 0.5), 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              left: width / 2 - 12,
              top: height - 2,
              width: 24,
              height: flameH * 0.9,
              borderRadius: 12,
              opacity: 0.6,
            }}
          />
        </>
      )}

      {rapidFire && (
        <View
          style={{
            position: 'absolute',
            left: width / 2 - 1,
            top: -2,
            width: 2,
            height: 3,
            borderRadius: 1,
            backgroundColor: '#ffffff',
            opacity: Math.sin(Date.now() * 0.08) + 0.4,
            shadowColor: '#ffffff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 3,
          }}
        />
      )}

      {multiShot && (
        <>
          <View style={[styles.badgeDot, { left: -5, top: height * 0.3, backgroundColor: '#e040fb', shadowColor: '#e040fb' }]} />
          <View style={[styles.badgeDot, { right: -5, top: height * 0.3, backgroundColor: '#e040fb', shadowColor: '#e040fb' }]} />
        </>
      )}

      {homingActive && (
        <View style={[styles.badgeDot, { left: width / 2 - 4, top: -7, backgroundColor: '#448aff', shadowColor: '#448aff' }]} />
      )}

      {magnetActive && (
        <>
          <View style={[styles.badgeDot, { left: -8, top: height * 0.52, backgroundColor: '#ff80ab', shadowColor: '#ff80ab' }]} />
          <View style={[styles.badgeDot, { right: -8, top: height * 0.52, backgroundColor: '#ff80ab', shadowColor: '#ff80ab' }]} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
});