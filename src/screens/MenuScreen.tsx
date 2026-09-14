import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';
import { initStars, updateStars, initNebulae, updateNebulae, StarField } from '../rendering/StarField';
import { Star, Nebula } from '../types';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../ads/adConfig';
import { isValidAdUnitId } from '../ads/adConfig';
import { playSound } from '../audio/SoundManager';
import { hexToRgba } from '../utils';
import { GameButton } from '../components/GameButton';

const logoImage = require('../../assets/icon.png');

const BANNER_UNIT_ID = AD_UNIT_IDS.banner;

interface MenuScreenProps {
  onPlay: () => void;
  onSettings: () => void;
  highScore: number;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onPlay, onSettings, highScore }) => {
  const starsRef = useRef<Star[]>(initStars(80));
  const nebulaeRef = useRef<Nebula[]>(initNebulae(4));
  const bannerRef = useRef<BannerAd>(null);
  const [tick, setTick] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    let frame: number;
    const animate = () => {
      updateStars(starsRef.current, 1 / 60);
      updateNebulae(nebulaeRef.current, 1 / 60);
      setTick((t) => t + 1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StarField stars={starsRef.current} nebulae={nebulaeRef.current} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoGlow}>
            <Image source={logoImage} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>SPACE BLASTER</Text>
          <Text style={styles.subtitle}>DELTA FORCE PROTOCOL</Text>
        </Animated.View>

        {highScore > 0 && (
          <View style={styles.highScoreContainer}>
            <LinearGradient
              colors={['rgba(255,215,64,0.16)', 'rgba(255,215,64,0.04)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.highScoreCard}
            >
              <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
              <Text style={styles.highScoreValue}>{highScore.toLocaleString()}</Text>
            </LinearGradient>
          </View>
        )}

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <GameButton
            label="LAUNCH MISSION"
            variant="primary"
            size="lg"
            onPress={() => { playSound('select'); onPlay(); }}
          />
        </Animated.View>

        <View style={styles.settingsSpacing}>
          <GameButton
            label="SETTINGS"
            variant="secondary"
            size="md"
            onPress={() => { playSound('select'); onSettings(); }}
          />
        </View>

        <View style={styles.instructions}>
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>DRAG</Text>
          </View>
          <Text style={styles.instructionGap}>→</Text>
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>AUTO FIRE</Text>
          </View>
          <Text style={styles.instructionGap}>•</Text>
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>COLLECT POWER-UPS</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.bannerContainer}>
        {isValidAdUnitId(BANNER_UNIT_ID) ? (
          <BannerAd
            ref={bannerRef}
            unitId={BANNER_UNIT_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        ) : null}
      </View>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 44,
  },
  logoGlow: {
    width: 150,
    height: 150,
    borderRadius: 36,
    backgroundColor: 'rgba(0,229,255,0.08)',
    shadowColor: COLORS.player,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    padding: 6,
  },
  logo: {
    width: 138,
    height: 138,
    borderRadius: 30,
  },
  title: {
    marginTop: 18,
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 5,
    textShadowColor: hexToRgba(COLORS.player, 0.8),
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    marginTop: 6,
    color: '#8ab8c2',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 4.5,
  },
  highScoreContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  highScoreCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: hexToRgba(COLORS.combo, 0.35),
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  highScoreLabel: {
    color: hexToRgba(COLORS.combo, 0.7),
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: '700',
  },
  highScoreValue: {
    color: COLORS.combo,
    fontSize: 30,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    textShadowColor: COLORS.combo,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  settingsSpacing: {
    marginTop: 20,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  instructionPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  instructionText: {
    color: '#7a86a8',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  instructionGap: {
    color: '#3a4a6a',
    fontSize: 10,
  },
  bannerContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  version: {
    position: 'absolute',
    bottom: 30,
    color: '#333',
    fontSize: 12,
  },
});

MenuScreen.displayName = 'MenuScreen';
