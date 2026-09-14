import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';
import { SavedGameState } from '../types';
import { initStars, updateStars, initNebulae, updateNebulae, StarField } from '../rendering/StarField';
import { Star, Nebula } from '../types';
import { showRewardedAd, preloadRewarded } from '../ads/AdService';
import { playSound } from '../audio/SoundManager';
import { hexToRgba } from '../utils';
import { GameButton } from '../components/GameButton';

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
        <View style={styles.titleBlock}>
          <LinearGradient
            colors={[hexToRgba(COLORS.healthLow, 0.25), 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.gameOverText}>MISSION FAILED</Text>
          <Text style={styles.waveReached}>YOU SURVIVED {wave} WAVE{wave !== 1 ? 'S' : ''}</Text>
        </View>

        {isNewHighScore && (
          <View style={styles.newHighScore}>
            <Text style={styles.newHighScoreText}>★ NEW HIGH SCORE ★</Text>
          </View>
        )}

        <View style={styles.scoreCard}>
          <LinearGradient
            colors={['rgba(16,24,48,0.85)', 'rgba(8,12,26,0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
          />
          <Text style={styles.statLabel}>FINAL SCORE</Text>
          <Text style={styles.statValue}>{score.toLocaleString()}</Text>
          <View style={styles.scoreFooter}>
            <Text style={styles.statLabel}>HIGH SCORE</Text>
            <Text style={styles.highScoreCompare}>{highScore.toLocaleString()}</Text>
          </View>
        </View>

        {savedGameState && (
          <View style={styles.continueSpacing}>
            <GameButton
              label={adLoading ? 'LOADING...' : 'WATCH AD TO CONTINUE'}
              variant="success"
              size="lg"
              subText={`Resume from wave ${savedGameState.wave}`}
              loading={adLoading}
              disabled={adLoading}
              onPress={handleWatchAd}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <GameButton
            label="RETRY"
            variant="primary"
            size="lg"
            onPress={() => { playSound('select'); onRestart(); }}
          />
          <View style={styles.buttonGap} />
          <GameButton
            label="MENU"
            variant="ghost"
            size="md"
            onPress={() => { playSound('select'); onMenu(); }}
          />
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
    paddingHorizontal: 24,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: hexToRgba(COLORS.healthLow, 0.3),
    overflow: 'hidden',
  },
  gameOverText: {
    color: COLORS.healthLow,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 5,
    textShadowColor: COLORS.healthLow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  waveReached: {
    color: '#ff8a80',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginTop: 8,
  },
  newHighScore: {
    marginBottom: 28,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: 'rgba(255,215,64,0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: hexToRgba(COLORS.combo, 0.7),
    shadowColor: COLORS.combo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
  newHighScoreText: {
    color: COLORS.combo,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scoreCard: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    paddingVertical: 26,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  statLabel: {
    color: '#7a86a8',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
  },
  statValue: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    marginTop: 4,
    textShadowColor: hexToRgba(COLORS.player, 0.5),
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  scoreFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    gap: 10,
  },
  highScoreCompare: {
    color: COLORS.combo,
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  continueSpacing: {
    marginBottom: 24,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonGap: {
    height: 16,
  },
});
