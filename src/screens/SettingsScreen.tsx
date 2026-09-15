import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { COLORS } from '../constants';
import { GameSettings } from '../types';
import { initStars, updateStars, initNebulae, StarField } from '../rendering/StarField';
import { Star } from '../types';
import { hexToRgba } from '../utils';
import { playSound } from '../audio/SoundManager';

interface SettingsScreenProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onBack: () => void;
}

function ToggleRow({
  label,
  value,
  onToggle,
  description,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  description: string;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={() => { playSound('select'); onToggle(); }} activeOpacity={0.7}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View
        style={[
          styles.toggleTrack,
          { backgroundColor: value ? COLORS.player : '#2a3350' },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            { transform: [{ translateX: value ? 20 : 0 }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

function OptionRow({
  label,
  options,
  selected,
  onSelect,
  description,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  description: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.optionRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionButton,
              selected === opt && styles.optionButtonActive,
            ]}
            onPress={() => { playSound('select'); onSelect(opt); }}
          >
            <Text
              style={[
                styles.optionText,
                selected === opt && styles.optionTextActive,
              ]}
            >
              {opt.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onSettingsChange,
  onBack,
}) => {
  const starsRef = useRef<Star[]>(initStars(60));
  const nebulaeRef = useRef(initNebulae(3));
  const [tick, setTick] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    let frame: number;
    let step = 0;
    const animate = () => {
      updateStars(starsRef.current, 1 / 60);
      if (step++ % 2 === 0) {
        setTick((t) => t + 1);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const update = (partial: Partial<GameSettings>) => {
    onSettingsChange({ ...settings, ...partial });
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StarField stars={starsRef.current} nebulae={nebulaeRef.current} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => { playSound('select'); onBack(); }}>
            <Text style={styles.backButtonText}>{"< BACK"}</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>SETTINGS</Text>
            <Text style={styles.subtitle}>CONFIGURATION CONSOLE</Text>
          </View>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>GAMEPLAY</Text>
            <OptionRow
              label="Difficulty"
              options={['easy', 'normal', 'hard']}
              selected={settings.difficulty}
              onSelect={(v) => update({ difficulty: v as GameSettings['difficulty'] })}
              description="Affects enemy speed, health, and fire rate"
            />
            <ToggleRow
              label="Auto Fire"
              value={settings.autoFire}
              onToggle={() => update({ autoFire: !settings.autoFire })}
              description="Automatically fire projectiles"
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>VISUALS</Text>
            <OptionRow
              label="Visual Effects"
              options={['low', 'medium', 'high']}
              selected={settings.visualEffects}
              onSelect={(v) => update({ visualEffects: v as GameSettings['visualEffects'] })}
              description="Glow, particles, and background detail"
            />
            <OptionRow
              label="Star Density"
              options={['60', '120', '200']}
              selected={String(settings.starCount)}
              onSelect={(v) => update({ starCount: parseInt(v) })}
              description="Background stars (more = deeper space)"
            />
            <OptionRow
              label="Particle Quality"
              options={['low', 'medium', 'high']}
              selected={settings.particleQuality}
              onSelect={(v) => update({ particleQuality: v as GameSettings['particleQuality'] })}
              description="Explosion and thruster particle count"
            />
            <ToggleRow
              label="Screen Shake"
              value={settings.screenShake}
              onToggle={() => update({ screenShake: !settings.screenShake })}
              description="Camera shake on explosions and hits"
            />
            <ToggleRow
              label="Show FPS"
              value={settings.showFPS}
              onToggle={() => update({ showFPS: !settings.showFPS })}
              description="Display frames per second counter"
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>HAPTICS</Text>
            <ToggleRow
              label="Vibration"
              value={settings.vibration}
              onToggle={() => update({ vibration: !settings.vibration })}
              description="Vibrate on damage and explosions"
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>AUDIO</Text>
            <ToggleRow
              label="Sound Effects"
              value={settings.soundEffects}
              onToggle={() => update({ soundEffects: !settings.soundEffects })}
              description="Laser, explosion, and power-up sounds"
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>POWER-UPS GUIDE</Text>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.shield }]} />
              <Text style={styles.guideText}>Shield - Temporary invulnerability</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.rapidFire }]} />
              <Text style={styles.guideText}>Rapid Fire - Faster shooting, 2x damage</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.multiShot }]} />
              <Text style={styles.guideText}>Multi-Shot - 3-way spread fire</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.homing }]} />
              <Text style={styles.guideText}>Homing - Bullets track enemies</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.speedBoost }]} />
              <Text style={styles.guideText}>Speed Boost - 50% faster movement</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.bomb }]} />
              <Text style={styles.guideText}>Bomb - Destroy all enemies on screen</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.magnet }]} />
              <Text style={styles.guideText}>Magnet - Auto-collect nearby power-ups</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.health }]} />
              <Text style={styles.guideText}>Health - Restore 1 HP</Text>
            </View>
            <View style={styles.guideRow}>
              <View style={[styles.guideDot, { backgroundColor: COLORS.powerUp.score }]} />
              <Text style={styles.guideText}>Score - +1000 points</Text>
            </View>
          </View>
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  headerCenter: {
    alignItems: 'center',
  },
  backButton: {
    width: 80,
  },
  backButtonText: {
    color: COLORS.player,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: hexToRgba(COLORS.player, 0.5),
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: '#5a6a8a',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3.5,
    marginTop: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  sectionCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(14,20,40,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    color: COLORS.player,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 14,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: '#e8ecf7',
    fontSize: 15,
    fontWeight: '700',
  },
  settingDescription: {
    color: '#7a86a8',
    fontSize: 11,
    marginTop: 3,
    lineHeight: 14,
  },
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
    backgroundColor: '#2a3350',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: COLORS.player,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  optionButtonActive: {
    backgroundColor: hexToRgba(COLORS.player, 0.16),
    borderColor: COLORS.player,
    shadowColor: COLORS.player,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  optionText: {
    color: '#7a86a8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionTextActive: {
    color: COLORS.player,
  },
  powerUpGuide: {
    marginTop: 6,
    paddingBottom: 10,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
    gap: 10,
  },
  guideDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  guideText: {
    color: '#9aa6c8',
    fontSize: 12,
    fontWeight: '500',
  },
});
