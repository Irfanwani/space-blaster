import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameScreen } from './src/screens/GameScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { GameScreenType, SavedGameState, GameSettings } from './src/types';
import { DEFAULT_SETTINGS } from './src/constants';
import { initAds, showAppOpenAd } from './src/ads/AdService';
import { soundManager } from './src/audio/SoundManager';
import {
  loadSettings,
  saveSettings,
  loadHighScore,
  saveHighScore,
} from './src/storage';

export default function App() {
  const [screen, setScreen] = useState<GameScreenType>('menu');
  const [lastScore, setLastScore] = useState(0);
  const [lastWave, setLastWave] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [savedGameState, setSavedGameState] = useState<SavedGameState | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const appOpenShownRef = useRef(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    soundManager.initialize();
    return () => soundManager.release();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedSettings, storedHighScore] = await Promise.all([
        loadSettings(),
        loadHighScore(),
      ]);
      if (cancelled) return;
      if (storedSettings) setSettings(storedSettings);
      if (storedHighScore > 0) setHighScore(storedHighScore);
      hydratedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    soundManager.setEnabled(settings.soundEffects);
  }, [settings.soundEffects]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    saveHighScore(highScore);
  }, [highScore]);

  useEffect(() => {
    initAds().then(() => {
      if (!appOpenShownRef.current) {
        appOpenShownRef.current = true;
        setTimeout(() => {
          showAppOpenAd();
        }, 2000);
      }
    });
  }, []);

  const handlePlay = useCallback(() => {
    setSavedGameState(null);
    setScreen('playing');
  }, []);

  const handleGameOver = useCallback(
    (score: number, wave: number, stateToSave: SavedGameState) => {
      setLastScore(score);
      setLastWave(wave);
      setSavedGameState(stateToSave);
      if (score > highScore) {
        setHighScore(score);
        setIsNewHighScore(true);
      } else {
        setIsNewHighScore(false);
      }
      setScreen('gameOver');
    },
    [highScore]
  );

  const handleContinue = useCallback(() => {
    setScreen('playing');
  }, []);

  const handleBack = useCallback(() => {
    setSavedGameState(null);
    setScreen('menu');
  }, []);

  const handleRestart = useCallback(() => {
    setSavedGameState(null);
    setScreen('playing');
  }, []);

  const handleSettings = useCallback(() => {
    setScreen('settings');
  }, []);

  const handleSettingsBack = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleSettingsChange = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      {screen === 'menu' && (
        <MenuScreen onPlay={handlePlay} onSettings={handleSettings} highScore={highScore} />
      )}
      {screen === 'playing' && (
        <GameScreen
          onGameOver={handleGameOver}
          onBack={handleBack}
          savedState={savedGameState}
          settings={settings}
          onUpdateSettings={handleSettingsChange}
        />
      )}
      {screen === 'gameOver' && (
        <GameOverScreen
          score={lastScore}
          wave={lastWave}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          savedGameState={savedGameState}
          onContinue={handleContinue}
          onRestart={handleRestart}
          onMenu={handleBack}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onBack={handleSettingsBack}
        />
      )}
    </>
  );
}
