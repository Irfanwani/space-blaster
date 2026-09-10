import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameState } from '../types';
import { COLORS } from '../constants';

interface HUDProps {
  state: GameState;
}

export const HUD: React.FC<HUDProps> = ({ state }) => {
  const { player, score, wave, comboCount, comboTimer, settings, fps } = state;

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
      </View>

      <View style={styles.waveContainer}>
        <Text style={styles.waveLabel}>WAVE</Text>
        <Text style={styles.waveValue}>{wave}</Text>
      </View>

      {comboCount > 1 && comboTimer > 0 && (
        <View style={styles.comboContainer}>
          <Text style={styles.comboText}>
            {comboCount}x COMBO!
          </Text>
        </View>
      )}

      <View style={styles.healthContainer}>
        {Array.from({ length: player.maxHealth }, (_, i) => (
          <View
            key={i}
            style={[
              styles.healthPip,
              {
                backgroundColor:
                  i < player.health
                    ? player.health <= 2
                      ? COLORS.healthLow
                      : COLORS.health
                    : '#333',
                shadowColor:
                  i < player.health
                    ? player.health <= 2
                      ? COLORS.healthLow
                      : COLORS.health
                    : 'transparent',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.powerUpContainer}>
        {player.shieldActive && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.shield, backgroundColor: 'rgba(0,229,255,0.1)' }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.shield }]}>SHIELD</Text>
          </View>
        )}
        {player.rapidFire && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.rapidFire, backgroundColor: 'rgba(255,145,0,0.1)' }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.rapidFire }]}>RAPID</Text>
          </View>
        )}
        {player.multiShot && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.multiShot, backgroundColor: 'rgba(224,64,251,0.1)' }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.multiShot }]}>MULTI</Text>
          </View>
        )}
        {player.speedBoost && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.speedBoost, backgroundColor: 'rgba(255,234,0,0.1)' }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.speedBoost }]}>SPEED</Text>
          </View>
        )}
        {player.homingActive && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.homing, backgroundColor: 'rgba(68,138,255,0.1)' }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.homing }]}>HOME</Text>
          </View>
        )}
        {player.magnetActive && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.magnet, backgroundColor: 'rgba(255,128,171,0.1)' }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.magnet }]}>MAG</Text>
          </View>
        )}
      </View>

      {settings.showFPS && (
        <View style={styles.fpsContainer}>
          <Text style={styles.fpsText}>{fps} FPS</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  scoreValue: {
    color: COLORS.score,
    fontSize: 28,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(255,255,255,0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  waveContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'flex-end',
  },
  waveLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  waveValue: {
    color: COLORS.wave,
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: COLORS.wave,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  comboContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  comboText: {
    color: COLORS.combo,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: COLORS.combo,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  healthContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 85,
    left: 20,
    gap: 6,
  },
  healthPip: {
    width: 12,
    height: 12,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  powerUpContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 110,
    left: 20,
    gap: 5,
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  powerUpBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  powerUpText: {
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  fpsContainer: {
    position: 'absolute',
    top: 130,
    right: 20,
  },
  fpsText: {
    color: '#555',
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
});
