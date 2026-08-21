import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameScreen } from './src/screens/GameScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen as GameScreenType, SavedGameState } from './src/types';
import { initAds, showAppOpenAd } from './src/ads/AdService';

export default function App() {
  const [screen, setScreen] = useState<GameScreenType>('menu');
  const [lastScore, setLastScore] = useState(0);
  const [lastWave, setLastWave] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [savedGameState, setSavedGameState] = useState<SavedGameState | null>(null);
  const appOpenShownRef = useRef(false);

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

  return (
    <>
      <StatusBar style="light" />
      {screen === 'menu' && (
        <MenuScreen onPlay={handlePlay} highScore={highScore} />
      )}
      {screen === 'playing' && (
        <GameScreen
          onGameOver={handleGameOver}
          onBack={handleBack}
          savedState={savedGameState}
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
    </>
  );
}
