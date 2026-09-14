import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameState } from '../types';
import { COLORS } from '../constants';
import { hexToRgba } from '../utils';

interface HUDProps {
  state: GameState;
}

export const HUD: React.FC<HUDProps> = ({ state }) => {
  const { player, score, wave, comboCount, comboTimer, settings, fps } = state;

  const lowHealth = player.health <= 2;
  const healthPulse = lowHealth ? 0.75 + Math.sin(Date.now() * 0.015) * 0.25 : 1;
  const comboScale = 1 + Math.min(0.4, comboCount * 0.04);

  const activePowerUps: Array<{ key: string; label: string; color: string }> = [];
  if (player.shieldActive) activePowerUps.push({ key: 'shield', label: 'SHD', color: COLORS.powerUp.shield });
  if (player.rapidFire) activePowerUps.push({ key: 'rapid', label: 'RPD', color: COLORS.powerUp.rapidFire });
  if (player.multiShot) activePowerUps.push({ key: 'multi', label: 'MLT', color: COLORS.powerUp.multiShot });
  if (player.speedBoost) activePowerUps.push({ key: 'speed', label: 'SPD', color: COLORS.powerUp.speedBoost });
  if (player.homingActive) activePowerUps.push({ key: 'home', label: 'HOM', color: COLORS.powerUp.homing });
  if (player.magnetActive) activePowerUps.push({ key: 'mag', label: 'MAG', color: COLORS.powerUp.magnet });

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={[hexToRgba('#01010a', 0.85), 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topFade}
      />

      {/* top bar */}
      <View style={styles.topBar}>
        {/* score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>

        {/* wave chip */}
        <View style={styles.waveChip}>
          <Text style={styles.waveLabel}>WAVE</Text>
          <Text style={styles.waveValue}>{wave}</Text>
        </View>
      </View>

      {/* health bar */}
      <View style={styles.healthRow}>
        <View style={[styles.healthTrack, { opacity: healthPulse }]}>
          <LinearGradient
            colors={
              lowHealth
                ? ['#ff1744', '#ff8a80']
                : [COLORS.health, '#aaf0c9', hexToRgba(COLORS.health, 0.7)]
            }
            locations={lowHealth ? [0, 1] : [0, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${(player.health / player.maxHealth) * 100}%`, height: '100%', borderRadius: 4 }}
          />
          <View style={styles.healthSheen} />
        </View>
        <View style={styles.healthShards}>
          {Array.from({ length: player.maxHealth }, (_, i) => (
            <View
              key={i}
              style={[
                styles.healthShard,
                {
                  backgroundColor:
                    i < player.health ? (lowHealth ? COLORS.healthLow : COLORS.health) : 'transparent',
                  borderColor: i < player.health ? 'transparent' : '#333',
                },
              ]}
            />
          ))}
        </View>

        {/* combo badge overlays the health bar */}
        {comboCount > 1 && comboTimer > 0 && (
          <View style={styles.comboCenter} pointerEvents="none">
            <View style={[styles.comboBadge, { transform: [{ scale: comboScale }] }]}>
              <Text style={styles.comboText}>{comboCount}x</Text>
              <Text style={styles.comboLabel}>COMBO</Text>
            </View>
          </View>
        )}
      </View>

      {/* active power-ups */}
      {activePowerUps.length > 0 && (
        <View style={styles.powerUpRow}>
          {activePowerUps.map((pu) => (
            <View key={pu.key} style={[styles.powerUpPill, { borderColor: hexToRgba(pu.color, 0.6) }]}>
              <View style={[styles.powerUpDot, { backgroundColor: pu.color, shadowColor: pu.color }]} />
              <Text style={[styles.powerUpText, { color: pu.color }]}>{pu.label}</Text>
            </View>
          ))}
        </View>
      )}

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
    paddingTop: 44,
    paddingHorizontal: 16,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreCard: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(12,18,38,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreLabel: {
    color: '#7a86a8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(125,249,255,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  waveChip: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(12,18,38,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  waveLabel: {
    color: '#7a86a8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  waveValue: {
    color: COLORS.wave,
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: COLORS.wave,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  healthRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  healthTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  healthSheen: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  healthShards: {
    flexDirection: 'row',
    marginLeft: 10,
    gap: 4,
  },
  healthShard: {
    width: 7,
    height: 8,
    borderRadius: 2,
    borderWidth: 1,
  },
  powerUpRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 6,
    flexWrap: 'wrap',
  },
  powerUpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(10,16,34,0.6)',
    borderWidth: 1,
  },
  powerUpDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  powerUpText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  comboCenter: {
    position: 'absolute',
    top: -34,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  comboBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(4,8,20,0.85)',
    borderWidth: 1,
    borderColor: hexToRgba(COLORS.combo, 0.7),
    shadowColor: COLORS.combo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  comboText: {
    color: COLORS.combo,
    fontSize: 28,
    fontWeight: '800',
    textShadowColor: COLORS.combo,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  comboLabel: {
    color: hexToRgba(COLORS.combo, 0.7),
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginLeft: 8,
  },
  fpsContainer: {
    position: 'absolute',
    top: 130,
    right: 16,
  },
  fpsText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
});