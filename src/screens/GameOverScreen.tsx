import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants';
import { initStars, updateStars, StarField } from '../rendering/StarField';
import { Star } from '../types';

interface GameOverScreenProps {
  score: number;
  wave: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  wave,
  highScore,
  isNewHighScore,
  onRestart,
  onMenu,
}) => {
  const starsRef = useRef<Star[]>(initStars(40));
  const [tick, setTick] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    let frame: number;
    const animate = () => {
      updateStars(starsRef.current, 1 / 60);
      setTick((t) => t + 1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StarField stars={starsRef.current} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Game Over Title */}
        <Text style={styles.gameOverText}>MISSION FAILED</Text>
        <View style={styles.divider} />

        {/* Score */}
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>FINAL SCORE</Text>
          <Text style={styles.statValue}>{score.toLocaleString()}</Text>
        </View>

        {/* Wave reached */}
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>WAVE REACHED</Text>
          <Text style={[styles.statValue, { color: COLORS.wave }]}>{wave}</Text>
        </View>

        {/* New high score */}
        {isNewHighScore && (
          <View style={styles.newHighScore}>
            <Text style={styles.newHighScoreText}>NEW HIGH SCORE!</Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={onRestart}>
            <Text style={styles.retryButtonText}>RETRY</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
            <Text style={styles.menuButtonText}>MENU</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: COLORS.healthLow,
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: COLORS.healthLow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  divider: {
    width: 160,
    height: 2,
    backgroundColor: COLORS.healthLow,
    opacity: 0.4,
    marginTop: 20,
    marginBottom: 40,
  },
  statContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  statValue: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  newHighScore: {
    marginBottom: 30,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,215,64,0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.combo,
  },
  newHighScoreText: {
    color: COLORS.combo,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  buttonContainer: {
    gap: 16,
    alignItems: 'center',
  },
  retryButton: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    backgroundColor: COLORS.player,
    borderRadius: 12,
    shadowColor: COLORS.player,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  menuButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 12,
  },
  menuButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});

GameOverScreen.displayName = 'GameOverScreen';
