import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameState } from '../types';
import { COLORS } from '../constants';

interface HUDProps {
  state: GameState;
}

export const HUD: React.FC<HUDProps> = ({ state }) => {
  const { player, score, wave, comboCount, comboTimer } = state;

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
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.powerUpContainer}>
        {player.shieldActive && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.shield }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.shield }]}>SHIELD</Text>
          </View>
        )}
        {player.rapidFire && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.rapidFire }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.rapidFire }]}>RAPID</Text>
          </View>
        )}
        {player.multiShot && (
          <View style={[styles.powerUpBadge, { borderColor: COLORS.powerUp.multiShot }]}>
            <Text style={[styles.powerUpText, { color: COLORS.powerUp.multiShot }]}>MULTI</Text>
          </View>
        )}
      </View>
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
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  scoreValue: {
    color: COLORS.score,
    fontSize: 28,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  waveContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'flex-end',
  },
  waveLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  waveValue: {
    color: COLORS.wave,
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  powerUpContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 110,
    left: 20,
    gap: 6,
  },
  powerUpBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  powerUpText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
