import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { GameState, SavedGameState, GameSettings } from '../types';
import { COLORS, DEFAULT_SETTINGS, DIFFICULTY_MULTIPLIERS } from '../constants';
import { createPlayer, movePlayer, damagePlayer } from '../entities/Player';
import {
  updateEnemy,
  spawnWave,
  shouldEnemyFire,
  getEnemyFireDirection,
} from '../entities/Enemy';
import { createPlayerBullet, createEnemyBullet, updateBullets } from '../entities/Bullet';
import {
  createExplosion,
  createThrusterParticle,
  createHitSpark,
  createMuzzleFlash,
  createShockwaveRing,
  updateParticles,
} from '../entities/Particle';
import {
  createPowerUp,
  updatePowerUps,
  applyPowerUp,
  shouldDropPowerUp,
} from '../entities/PowerUp';
import { initStars, updateStars, initNebulae, updateNebulae, StarField } from '../rendering/StarField';
import { PlayerShip } from '../rendering/PlayerShip';
import { EnemyShip } from '../rendering/EnemyShip';
import { BulletView } from '../rendering/BulletView';
import { ParticleView } from '../rendering/ParticleView';
import { PowerUpView } from '../rendering/PowerUpView';
import { HUD } from '../rendering/HUD';
import { VignetteOverlay } from '../rendering/VignetteOverlay';
import { checkCollisions } from '../game/collision';
import { shouldShowInterstitial, showInterstitialAd, isInterstitialReady } from '../ads/AdService';
import { playSound } from '../audio/SoundManager';
import { SettingsScreen } from './SettingsScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_PARTICLES = 160;
const MAX_BULLETS = 90;

interface GameScreenProps {
  onGameOver: (score: number, wave: number, savedState: SavedGameState) => void;
  onBack: () => void;
  savedState: SavedGameState | null;
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
}

function createInitialState(saved?: SavedGameState | null, settings?: GameSettings): GameState {
  const player = createPlayer();
  const effectiveSettings = settings || DEFAULT_SETTINGS;
  const nebulaCount =
    effectiveSettings.visualEffects === 'low'
      ? 0
      : effectiveSettings.visualEffects === 'medium'
      ? 3
      : 5;

  if (saved) {
    player.health = saved.playerHealth;
    player.maxHealth = saved.playerMaxHealth;
    player.position = { ...saved.playerPosition };
    player.shieldActive = saved.shieldActive;
    player.rapidFire = saved.rapidFire;
    player.multiShot = saved.multiShot;
    player.speedBoost = saved.speedBoost;
    player.homingActive = saved.homingActive;
    player.magnetActive = saved.magnetActive;
    player.invulnerable = true;
    player.invulnerableTimer = 2000;
  }

  return {
    player,
    enemies: [],
    bullets: [],
    particles: [],
    powerUps: [],
    stars: initStars(effectiveSettings.starCount),
    nebulae: initNebulae(nebulaCount),
    score: saved?.score ?? 0,
    highScore: 0,
    wave: saved?.wave ?? 0,
    waveTimer: 0,
    waveCooldown: 2000,
    gameOver: false,
    paused: false,
    lastTime: performance.now(),
    deltaTime: 16,
    screenShake: { x: 0, y: 0 },
    screenShakeIntensity: 0,
    comboCount: saved?.comboCount ?? 0,
    comboTimer: 0,
    totalEnemiesKilled: saved?.totalEnemiesKilled ?? 0,
    bossActive: false,
    difficultyMultiplier: DIFFICULTY_MULTIPLIERS[effectiveSettings.difficulty],
    settings: effectiveSettings,
    fps: 60,
    fpsTimer: 0,
    fpsCount: 0,
  };
}

function captureSavedState(state: GameState): SavedGameState {
  return {
    score: state.score,
    wave: state.wave,
    playerHealth: state.player.health,
    playerMaxHealth: state.player.maxHealth,
    playerPosition: { ...state.player.position },
    shieldActive: state.player.shieldActive,
    rapidFire: state.player.rapidFire,
    multiShot: state.player.multiShot,
    speedBoost: state.player.speedBoost,
    homingActive: state.player.homingActive,
    magnetActive: state.player.magnetActive,
    comboCount: state.comboCount,
    totalEnemiesKilled: state.totalEnemiesKilled,
  };
}

export const GameScreen: React.FC<GameScreenProps> = ({
  onGameOver,
  onBack,
  savedState,
  settings,
  onUpdateSettings,
}) => {
  const [, forceRender] = useState(0);
  const stateRef = useRef<GameState>(createInitialState(savedState, settings));
  const pausedRef = useRef(false);
  const [showPauseSettings, setShowPauseSettings] = useState(false);
  const targetRef = useRef({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT - 100 });
  const firingRef = useRef(false);
  const lastTimeRef = useRef(performance.now());
  const thrusterTimerRef = useRef(0);
  const autoFireTimerRef = useRef(0);
  const gameOverCalledRef = useRef(false);
  const lastInterstitialWaveRef = useRef(0);
  const rafRef = useRef(0);

  const setPaused = useCallback((value: boolean) => {
    pausedRef.current = value;
    forceRender((n) => n + 1);
  }, []);

  const fireRateFor = (settings: GameSettings) =>
    stateRef.current.player.rapidFire ? 80 : stateRef.current.player.fireRate;

  const lastShotFxRef = useRef(0);

  const firePlayerWeapon = (state: GameState) => {
    const muzzleY = state.player.position.y - state.player.height / 2;
    const newBullets = createPlayerBullet(
      state,
      {
        x: state.player.position.x,
        y: muzzleY,
      },
      { x: 0, y: -1 },
      state.player.multiShot
    );
    state.bullets.push(...newBullets);
    playSound('laser', 70);

    const effectMult =
      state.settings.visualEffects === 'low'
        ? 0
        : state.settings.visualEffects === 'medium'
        ? 1
        : 1.5;

    // Throttle muzzle-flash/ring particles so rapid-fire pairs don't flood the
    // particle list (bullets still fire every shot; only the flash is limited).
    const fxNow = performance.now();
    const showFx = fxNow - lastShotFxRef.current >= 110;
    if (showFx) {
      lastShotFxRef.current = fxNow;
    }

    if (effectMult > 0 && showFx) {
      const gunOffsetX = state.player.width * 0.28;
      state.particles.push(
        ...createMuzzleFlash(
          { x: state.player.position.x + gunOffsetX, y: muzzleY },
          state.player.multiShot ? 3 : 2
        )
      );
      state.particles.push(
        ...createMuzzleFlash(
          { x: state.player.position.x - gunOffsetX, y: muzzleY },
          state.player.multiShot ? 3 : 2
        )
      );
      state.particles.push(
        createShockwaveRing(
          { x: state.player.position.x, y: muzzleY + 2 },
          state.player.speedBoost ? '#ffd600' : '#7df9ff',
          34 * effectMult,
          240
        )
      );
    }
  };

  const gameLoop = useCallback(() => {
    const state = stateRef.current;
    const now = performance.now();

    state.fpsCount++;
    state.fpsTimer += now - (lastTimeRef.current || now);
    if (state.fpsTimer >= 1000) {
      state.fps = state.fpsCount;
      state.fpsCount = 0;
      state.fpsTimer = 0;
    }

    if (pausedRef.current || state.gameOver) {
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const dt = Math.min(now - lastTimeRef.current, 50);
    lastTimeRef.current = now;
    state.deltaTime = dt;

    if (state.settings.screenShake && state.screenShakeIntensity > 0) {
      state.screenShake.x = (Math.random() - 0.5) * state.screenShakeIntensity;
      state.screenShake.y = (Math.random() - 0.5) * state.screenShakeIntensity;
      state.screenShakeIntensity *= 0.9;
      if (state.screenShakeIntensity < 0.5) {
        state.screenShakeIntensity = 0;
        state.screenShake.x = 0;
        state.screenShake.y = 0;
      }
    } else if (!state.settings.screenShake) {
      state.screenShake.x = 0;
      state.screenShake.y = 0;
    }

    movePlayer(state, targetRef.current.x, targetRef.current.y);

    state.waveTimer += dt;
    if (state.enemies.length === 0 && state.waveTimer > state.waveCooldown) {
      state.wave++;
      state.waveTimer = 0;
      spawnWave(state);
      playSound(state.bossActive ? 'bossWave' : 'waveStart');

      if (
        shouldShowInterstitial(state.wave) &&
        isInterstitialReady() &&
        state.wave !== lastInterstitialWaveRef.current
      ) {
        lastInterstitialWaveRef.current = state.wave;
        pausedRef.current = true;
        showInterstitialAd().catch(() => {}).finally(() => {
          pausedRef.current = false;
          lastTimeRef.current = performance.now();
        });
      }
    }

    for (const enemy of state.enemies) {
      if (!enemy.active) continue;
      updateEnemy(enemy, state);

      if (shouldEnemyFire(enemy, now)) {
        enemy.lastFired = now;
        const dir = getEnemyFireDirection(enemy);
        state.bullets.push(
          createEnemyBullet(enemy.position, dir, enemy.enemyType === 'boss')
        );
        playSound('enemyLaser', 40);

        if (enemy.enemyType === 'boss') {
          state.bullets.push(
            createEnemyBullet(enemy.position, { x: -0.3, y: 1 }, true)
          );
          state.bullets.push(
            createEnemyBullet(enemy.position, { x: 0.3, y: 1 }, true)
          );
        }
      }
    }

    if (state.settings.autoFire) {
      autoFireTimerRef.current += dt;
      if (autoFireTimerRef.current >= fireRateFor(state.settings)) {
        autoFireTimerRef.current = 0;
        firePlayerWeapon(state);
      }
    } else if (firingRef.current) {
      autoFireTimerRef.current += dt;
      if (autoFireTimerRef.current >= fireRateFor(state.settings)) {
        autoFireTimerRef.current = 0;
        firePlayerWeapon(state);
      }
    }

    updateBullets(state);
    updateParticles(state);
    updatePowerUps(state);
    updateStars(state.stars, dt / 1000);
    updateNebulae(state.nebulae, dt / 1000);

    thrusterTimerRef.current += dt;
    if (thrusterTimerRef.current > 50) {
      thrusterTimerRef.current = 0;
      const thrustCount =
        state.settings.particleQuality === 'low'
          ? 1
          : state.settings.particleQuality === 'medium'
          ? 2
          : 3;
      for (let i = 0; i < thrustCount; i++) {
        state.particles.push(
          createThrusterParticle(state.player.position, state.player.thrustLevel)
        );
      }
    }

    if (state.comboTimer > 0) {
      state.comboTimer -= dt;
      if (state.comboTimer <= 0) {
        state.comboCount = 0;
      }
    }

    const collisions = checkCollisions(state);

    for (const bulletId of collisions.bulletHits) {
      const bullet = state.bullets.find((b) => b.id === bulletId);
      if (!bullet) continue;
      bullet.active = false;

      if (!bullet.isEnemy) {
        for (const enemy of state.enemies) {
          if (collisions.enemyHits.has(enemy.id) && enemy.active) {
            enemy.health -= bullet.damage;
            state.particles.push(...createHitSpark(bullet.position));
            playSound('hit', 30);

            if (enemy.health <= 0) {
              enemy.active = false;
              state.score += Math.floor(
                enemy.scoreValue * (1 + state.comboCount * 0.1)
              );
              state.comboCount++;
              state.comboTimer = 2000;
              state.totalEnemiesKilled++;

              const particleMult =
                state.settings.particleQuality === 'low'
                  ? 0.5
                  : state.settings.particleQuality === 'medium'
                  ? 0.8
                  : 1;

              state.particles.push(
                ...createExplosion(
                  enemy.position,
                  enemy.enemyType === 'boss'
                    ? Math.floor(30 * particleMult)
                    : Math.floor(12 * particleMult)
                )
              );
              playSound(
                enemy.enemyType === 'boss' ? 'bigExplosion' : 'explosion',
                20
              );
              state.screenShakeIntensity =
                enemy.enemyType === 'boss' ? 15 : 5;

              if (shouldDropPowerUp(enemy.enemyType === 'boss')) {
                state.powerUps.push(createPowerUp(enemy.position));
              }
            }
            break;
          }
        }
      }
    }

    if (collisions.playerHit) {
      const dead = damagePlayer(state, 1);
      playSound('playerHit');
      if (state.settings.vibration) {
        Vibration.vibrate(80);
      }
      if (dead) {
        state.particles.push(
          ...createExplosion(state.player.position, 40, [
            '#00e5ff',
            '#00b8d4',
            '#ffffff',
          ])
        );
        playSound('bigExplosion');
        playSound('gameOver');
        state.gameOver = true;
        if (!gameOverCalledRef.current) {
          gameOverCalledRef.current = true;
          const saved = captureSavedState(state);
          setTimeout(() => onGameOver(state.score, state.wave, saved), 1500);
        }
      }
    }

    for (const puId of collisions.powerUpHits) {
      const pu = state.powerUps.find((p) => p.id === puId);
      if (pu && pu.active) {
        pu.active = false;
        applyPowerUp(state, pu.powerUpType);
        state.particles.push(
          ...createExplosion(pu.position, 8, [COLORS.powerUp[pu.powerUpType]])
        );
        playSound(
          pu.powerUpType === 'shield' ? 'shield' : 'powerUpCollect'
        );

        if (pu.powerUpType === 'bomb') {
          for (const enemy of state.enemies) {
            if (!enemy.active) continue;
            state.particles.push(
              ...createExplosion(
                enemy.position,
                enemy.enemyType === 'boss' ? 30 : 12
              )
            );
          }
          playSound('bigExplosion');
          state.screenShakeIntensity = 20;
        }

        if (state.settings.vibration) {
          Vibration.vibrate(pu.powerUpType === 'bomb' ? 50 : 10);
        }
      }
    }

    state.enemies = state.enemies.filter((e) => e.active);
    state.bullets = state.bullets.filter((b) => b.active).slice(-MAX_BULLETS);
    state.particles = state.particles.filter((p) => p.active).slice(-MAX_PARTICLES);
    state.powerUps = state.powerUps.filter((p) => p.active);

    forceRender((n) => n + 1);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [onGameOver]);

  useEffect(() => {
    stateRef.current = createInitialState(savedState, settings);
    lastTimeRef.current = performance.now();
    gameOverCalledRef.current = false;
    pausedRef.current = false;
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameLoop, savedState, settings]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        targetRef.current = { x: pageX, y: pageY };
        firingRef.current = true;
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        targetRef.current = { x: pageX, y: pageY };
      },
      onPanResponderRelease: () => {
        firingRef.current = false;
      },
      onPanResponderTerminate: () => {
        firingRef.current = false;
      },
    })
  ).current;

  const state = stateRef.current;

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <View
        style={{
          transform: [
            { translateX: state.screenShake.x },
            { translateY: state.screenShake.y },
          ],
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            transform: [
              { scale: 1.12 },
              { translateX: -state.player.velocity.x * 0.045 },
              { translateY: -state.player.velocity.y * 0.045 },
            ],
          }}
        >
          <StarField stars={state.stars} nebulae={state.nebulae} />
        </View>

        {state.player.active && <PlayerShip player={state.player} />}

        {state.enemies.map((enemy) => (
          <EnemyShip key={enemy.id} enemy={enemy} />
        ))}

        {state.bullets.map((bullet) => (
          <BulletView key={bullet.id} bullet={bullet} />
        ))}

        {state.powerUps.map((pu) => (
          <PowerUpView key={pu.id} powerUp={pu} />
        ))}

        {state.particles.map((particle) => (
          <ParticleView key={particle.id} particle={particle} />
        ))}
      </View>

      <VignetteOverlay />
      <HUD state={state} />

      {state.waveTimer < 2000 && state.wave > 0 && (
        <View style={styles.waveAnnounce}>
          <Text style={styles.waveAnnounceText}>
            {state.bossActive ? 'BOSS INCOMING' : `WAVE ${state.wave}`}
          </Text>
          {!state.bossActive && (
            <Text style={styles.waveAnnounceSub}>GET READY</Text>
          )}
        </View>
      )}

      <View style={styles.gameSurface} {...panResponder.panHandlers} />

      {pausedRef.current && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseText}>PAUSED</Text>
          <View style={styles.pauseButtons}>
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={() => setPaused(false)}
            >
              <Text style={styles.resumeButtonText}>RESUME</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => { playSound('select'); setShowPauseSettings(true); }}
            >
              <Text style={styles.settingsButtonText}>SETTINGS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quitButton} onPress={onBack}>
              <Text style={styles.quitButtonText}>QUIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!pausedRef.current && !state.gameOver && (
        <TouchableOpacity
          style={styles.pauseBtn}
          hitSlop={{ top: 10, bottom: 10, left: 14, right: 14 }}
          onPress={() => setPaused(true)}
        >
          <Text style={styles.pauseBtnText}>| |</Text>
        </TouchableOpacity>
      )}

      {pausedRef.current && showPauseSettings && (
        <View style={styles.pauseSettingsOverlay}>
          <SettingsScreen
            settings={settings}
            onSettingsChange={onUpdateSettings}
            onBack={() => setShowPauseSettings(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  waveAnnounce: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  waveAnnounceText: {
    color: COLORS.wave,
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: COLORS.wave,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  waveAnnounceSub: {
    color: '#888',
    fontSize: 14,
    letterSpacing: 4,
    marginTop: 8,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  pauseButtons: {
    marginTop: 40,
    alignItems: 'center',
  },
  resumeButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: COLORS.player,
    borderRadius: 8,
  },
  resumeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  settingsButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: COLORS.player,
    borderRadius: 8,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  settingsButtonText: {
    color: COLORS.player,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  quitButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
  },
  quitButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  pauseBtn: {
    position: 'absolute',
    top: 50,
    right: 80,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pauseSettingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 12,
  },
});
