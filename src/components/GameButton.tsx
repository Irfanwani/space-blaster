import React from 'react';
import { View, Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { hexToRgba } from '../utils';

type Variant = 'primary' | 'success' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const VARIANTS: Record<
  Variant,
  {
    gradient: [string, string, string];
    deep: string;
    text: string;
    glow: string;
    subtext: string;
  }
> = {
  primary: {
    gradient: ['#a8f7ff', '#00e5ff', '#0086a8'],
    deep: '#005a73',
    text: '#00303c',
    glow: '#00e5ff',
    subtext: '#004a5e',
  },
  success: {
    gradient: ['#c8ffe0', '#00e676', '#00a152'],
    deep: '#006b37',
    text: '#00301a',
    glow: '#00e676',
    subtext: '#003d1e',
  },
  secondary: {
    gradient: ['#5b6a96', '#2c3552', '#161c31'],
    deep: '#0c1020',
    text: '#e8ecf7',
    glow: '#5b6a96',
    subtext: '#9aa6c8',
  },
  ghost: {
    gradient: ['#222b45', '#12182b', '#0a0e1c'],
    deep: '#03050c',
    text: '#c2c9de',
    glow: '#556290',
    subtext: '#7a86a8',
  },
};

const SIZES: Record<
  Size,
  { padV: number; padH: number; fontSize: number; subFontSize: number }
> = {
  md: { padV: 12, padH: 36, fontSize: 14, subFontSize: 10 },
  lg: { padV: 16, padH: 48, fontSize: 17, subFontSize: 11 },
};

interface GameButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  subText?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const GameButton: React.FC<GameButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  subText,
  disabled,
  loading,
  style,
}) => {
  const colors = VARIANTS[variant];
  const dims = SIZES[size];

  return (
    <View
      style={[
        styles.bevel,
        { backgroundColor: colors.deep, transform: [{ skewX: '-6deg' }] },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => ({
          marginBottom: pressed ? 3 : 7,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: disabled || loading ? 0.7 : 1,
        })}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.gloss} />
          <View
            style={[
              styles.content,
              {
                paddingVertical: dims.padV,
                paddingHorizontal: dims.padH,
                transform: [{ skewX: '6deg' }],
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: dims.fontSize,
                    color: colors.text,
                    textShadowColor: hexToRgba(colors.glow, 0.6),
                  },
                ]}
              >
                {label}
              </Text>
            )}
            {!loading && subText && (
              <Text
                style={[
                  styles.subtext,
                  { fontSize: dims.subFontSize, color: colors.subtext },
                ]}
              >
                {subText}
              </Text>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bevel: {
    borderRadius: 12,
    alignSelf: 'center',
  },
  gradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 4,
    left: 6,
    right: 6,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontWeight: '900',
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtext: {
    fontWeight: '700',
    marginTop: 3,
  },
});