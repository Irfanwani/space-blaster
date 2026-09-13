import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Platform } from 'react-native';
import { COLORS } from '../constants';
import { initStars, updateStars, StarField } from '../rendering/StarField';
import { Star } from '../types';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../ads/adConfig';
import { isValidAdUnitId } from '../ads/adConfig';

const logoImage = require('../../assets/icon.png');

const BANNER_UNIT_ID = AD_UNIT_IDS.banner;

interface MenuScreenProps {
  onPlay: () => void;
  highScore: number;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ onPlay, highScore }) => {
  const starsRef = useRef<Star[]>(initStars(60));
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
      setTick((t) => t + 1);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StarField stars={starsRef.current} />

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
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {highScore > 0 && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreLabel}>HIGH SCORE</Text>
            <Text style={styles.highScoreValue}>{highScore.toLocaleString()}</Text>
          </View>
        )}

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.playButton} onPress={onPlay}>
            <Text style={styles.playButtonText}>LAUNCH</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>DRAG TO MOVE</Text>
          <Text style={styles.instructionDot}>•</Text>
          <Text style={styles.instructionText}>AUTO FIRE</Text>
          <Text style={styles.instructionDot}>•</Text>
          <Text style={styles.instructionText}>COLLECT POWER-UPS</Text>
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
    marginBottom: 50,
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 48,
  },
  highScoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  highScoreLabel: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  highScoreValue: {
    color: COLORS.combo,
    fontSize: 32,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  playButton: {
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
  playButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    gap: 10,
  },
  instructionText: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },
  instructionDot: {
    color: '#333',
    fontSize: 8,
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
