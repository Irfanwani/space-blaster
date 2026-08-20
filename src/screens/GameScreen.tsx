import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GameState } from '../types';
import { SCREEN, COLORS } from '../constants';
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
  updateParticles,
} from '../entities/Particle';
import {
  createPowerUp,
  updatePowerUps,
  applyPowerUp,
  shouldDropPowerUp,
} from '../entities/PowerUp';
import { initStars, updateStars, StarField } from '../rendering/StarField';
import { PlayerShip } from '../rendering/PlayerShip';
import { EnemyShip } from '../rendering/EnemyShip';
import { BulletView } from '../rendering/BulletView';
import { ParticleView } from '../rendering/ParticleView';
import { PowerUpView } from '../rendering/PowerUpView';
import { HUD } from '../rendering/HUD';
import { checkCollisions } from '../game/collision';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GameScreenProps {
  onGameOver: (score: number, wave: number) => void;
  onBack: () => void;
}

function createInitialState(): GameState {
  return {
    player: createPlayer(),
    enemies: [],
    bullets: [],
    particles: [],
    powerUps: [],
    stars: initStars(80),
    score: 0,
    highScore: 0,
    wave: 0,
    waveTimer: 0,
    waveCooldown: 2000,
    gameOver: false,
    paused: false,
    lastTime: performance.now(),
    deltaTime: 16,
    screenShake: { x: 0, y: 0 },
    screenShakeIntensity: 0,
    comboCount: 0,
    comboTimer: 0,
    totalEnemiesKilled: 0,
    bossActive: false,
    difficultyMultiplier: 1,
  };
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onBack }) => {
  const [, forceRender] = useState(0);
  const stateRef = useRef<GameState>(createInitialState());
  const pausedRef = useRef(false);
  const targetRef = useRef({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT - 100 });
  const lastTimeRef = useRef(performance.now());
  const thrusterTimerRef = useRef(0);
  const autoFireTimerRef = useRef(0);
  const waveSpawnTimerRef = useRef(0);
  const gameOverCalledRef = useRef(false);
  const rafRef = useRef(0);

  const setPaused = useCallback((value: boolean) => {
    pausedRef.current = value;
    forceRender((n) => n + 1);
  }, []);

  const gameLoop = useCallback(() => {
    const state = stateRef.current;
    const now = performance.now();

    if (pausedRef.current || state.gameOver) {
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const dt = Math.min(now - lastTimeRef.current, 50);
    lastTimeRef.current = now;
    state.deltaTime = dt;

    // --- Screen shake ---
    if (state.screenShakeIntensity > 0) {
      state.screenShake.x = (Math.random() - 0.5) * state.screenShakeIntensity;
      state.screenShake.y = (Math.random() - 0.5) * state.screenShakeIntensity;
      state.screenShakeIntensity *= 0.9;
      if (state.screenShakeIntensity < 0.5) {
        state.screenShakeIntensity = 0;
        state.screenShake.x = 0;
        state.screenShake.y = 0;
      }
    }

    // --- Player movement ---
    movePlayer(state, targetRef.current.x, targetRef.current.y);

    // --- Wave spawning ---
    state.waveTimer += dt;
    const activeEnemies = state.enemies.filter((e) => e.active);
    if (activeEnemies.length === 0 && state.waveTimer > state.waveCooldown) {
      state.wave++;
      state.waveTimer = 0;
      spawnWave(state);
    }

    // --- Enemy update + firing ---
    for (const enemy of state.enemies) {
      if (!enemy.active) continue;
      updateEnemy(enemy, state);

      if (shouldEnemyFire(enemy, now)) {
        enemy.lastFired = now;
        const dir = getEnemyFireDirection(enemy);
        state.bullets.push(
          createEnemyBullet(enemy.position, dir, enemy.enemyType === 'boss')
        );

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

    // --- Auto-fire ---
    autoFireTimerRef.current += dt;
    const fireRate = state.player.rapidFire ? 80 : state.player.fireRate;
    if (autoFireTimerRef.current >= fireRate) {
      autoFireTimerRef.current = 0;
      const newBullets = createPlayerBullet(
        state,
        {
          x: state.player.position.x,
          y: state.player.position.y - state.player.height / 2,
        },
        { x: 0, y: -1 },
        state.player.multiShot
      );
      state.bullets.push(...newBullets);
    }

    // --- Update subsystems ---
    updateBullets(state);
    updateParticles(state);
    updatePowerUps(state);
    updateStars(state.stars, dt / 1000);

    // --- Thruster particles ---
    thrusterTimerRef.current += dt;
    if (thrusterTimerRef.current > 50) {
      thrusterTimerRef.current = 0;
      state.particles.push(
        createThrusterParticle(state.player.position, state.player.thrustLevel)
      );
    }

    // --- Combo timer ---
    if (state.comboTimer > 0) {
      state.comboTimer -= dt;
      if (state.comboTimer <= 0) {
        state.comboCount = 0;
      }
    }

    // --- Collisions ---
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

            if (enemy.health <= 0) {
              enemy.active = false;
              state.score += Math.floor(
                enemy.scoreValue * (1 + state.comboCount * 0.1)
              );
              state.comboCount++;
              state.comboTimer = 2000;
              state.totalEnemiesKilled++;

              state.particles.push(
                ...createExplosion(
                  enemy.position,
                  enemy.enemyType === 'boss' ? 30 : 12
                )
              );
              state.screenShakeIntensity =
                enemy.enemyType === 'boss' ? 15 : 5;

              if (shouldDropPowerUp()) {
                state.powerUps.push(createPowerUp(enemy.position));
              }
            }
            break;
          }
        }
      }
    }

    // --- Player hit ---
    if (collisions.playerHit) {
      const dead = damagePlayer(state, 1);
      if (dead) {
        state.particles.push(
          ...createExplosion(state.player.position, 40, [
            '#00e5ff',
            '#00b8d4',
            '#ffffff',
          ])
        );
        state.gameOver = true;
        if (!gameOverCalledRef.current) {
          gameOverCalledRef.current = true;
          setTimeout(() => onGameOver(state.score, state.wave), 1500);
        }
      }
    }

    // --- Power-up collection ---
    for (const puId of collisions.powerUpHits) {
      const pu = state.powerUps.find((p) => p.id === puId);
      if (pu && pu.active) {
        pu.active = false;
        applyPowerUp(state, pu.powerUpType);
        state.particles.push(
          ...createExplosion(pu.position, 8, [COLORS.powerUp[pu.powerUpType]])
        );
      }
    }

    // --- Cleanup ---
    state.enemies = state.enemies.filter((e) => e.active);
    state.bullets = state.bullets.filter((b) => b.active);
    state.particles = state.particles.filter((p) => p.active);
    state.powerUps = state.powerUps.filter((p) => p.active);

    // --- Render ---
    forceRender((n) => n + 1);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [onGameOver]);

  useEffect(() => {
    stateRef.current = createInitialState();
    lastTimeRef.current = performance.now();
    gameOverCalledRef.current = false;
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameLoop]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        targetRef.current = { x: pageX, y: pageY };
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        targetRef.current = { x: pageX, y: pageY };
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const state = stateRef.current;

  return (
    <View
      style={[styles.container, { backgroundColor: COLORS.background }]}
      {...panResponder.panHandlers}
    >
      <View
        style={{
          transform: [
            { translateX: state.screenShake.x },
            { translateY: state.screenShake.y },
          ],
        }}
      >
        <StarField stars={state.stars} />

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

      {pausedRef.current && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseText}>PAUSED</Text>
          <TouchableOpacity
            style={styles.resumeButton}
            onPress={() => setPaused(false)}
          >
            <Text style={styles.resumeButtonText}>RESUME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quitButton} onPress={onBack}>
            <Text style={styles.quitButtonText}>QUIT</Text>
          </TouchableOpacity>
        </View>
      )}

      {!pausedRef.current && !state.gameOver && (
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setPaused(true)}
        >
          <Text style={styles.pauseBtnText}>| |</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  resumeButton: {
    marginTop: 40,
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
});
