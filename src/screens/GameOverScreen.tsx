import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants';
import { SavedGameState } from '../types';
import { initStars, updateStars, initNebulae, updateNebulae, StarField } from '../rendering/StarField';
import { Star, Nebula } from '../types';
import { showRewardedAd, preloadRewarded } from '../ads/AdService';

interface GameOverScreenProps {
  score: number;
  wave: number;
  highScore: number;
  isNewHighScore: boolean;
  savedGameState: SavedGameState | null;
  onContinue: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  wave,
  highScore,
  isNewHighScore,
  savedGameState,
  onContinue,
  onRestart,
  onMenu,
}) => {
  const starsRef = useRef<Star[]>(initStars(45));
  const nebulaeRef = useRef<Nebula[]>(initNebulae(3));
  const [tick, setTick] = useState(0);
  const [adLoading, setAdLoading] = useState(false);
  const [adReady, setAdReady] = useState(false);
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

    if (savedGameState) {
      preloadRewarded();
      const checkReady = setInterval(() => {
        setAdReady(true);
        clearInterval(checkReady);
      }, 1500);
    }

    let frame: number;
    const animate = () => {
      updateStars(starsRef.current, 1 / 60);
      updateNebulae(nebulaeRef.current, 1 / 60);
      setTick((t) => t + 1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [savedGameState]);

  const handleWatchAd = useCallback(async () => {
    setAdLoading(true);
    const earned = await showRewardedAd();
    setAdLoading(false);
    if (earned) {
      onContinue();
    }
  }, [onContinue]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StarField stars={starsRef.current} nebulae={nebulaeRef.current} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.gameOverText}>MISSION FAILED</Text>
        <View style={styles.divider} />

        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>FINAL SCORE</Text>
          <Text style={styles.statValue}>{score.toLocaleString()}</Text>
        </View>

        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>WAVE REACHED</Text>
          <Text style={[styles.statValue, { color: COLORS.wave }]}>{wave}</Text>
        </View>

        {isNewHighScore && (
          <View style={styles.newHighScore}>
            <Text style={styles.newHighScoreText}>NEW HIGH SCORE!</Text>
          </View>
        )}

        {savedGameState && (
          <TouchableOpacity
            style={[styles.continueButton, adLoading && styles.continueButtonDisabled]}
            onPress={handleWatchAd}
            disabled={adLoading}
          >
            {adLoading ? (
              <View style={styles.continueLoading}>
                <ActivityIndicator color="#000" size="small" />
                <Text style={[styles.continueButtonText, { marginLeft: 10 }]}>
                  LOADING...
                </Text>
              </View>
            ) : (
              <Text style={styles.continueButtonText}>WATCH AD TO CONTINUE</Text>
            )}
            <Text style={styles.continueSubtext}>
              Resume from wave {savedGameState.wave}
            </Text>
          </TouchableOpacity>
        )}

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
  continueButton: {
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#00e676',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  continueSubtext: {
    color: '#000',
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },
  continueLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
