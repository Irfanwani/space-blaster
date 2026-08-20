import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameScreen } from './src/screens/GameScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen as GameScreenType } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<GameScreenType>('menu');
  const [lastScore, setLastScore] = useState(0);
  const [lastWave, setLastWave] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const handlePlay = useCallback(() => {
    setScreen('playing');
  }, []);

  const handleGameOver = useCallback(
    (score: number, wave: number) => {
      setLastScore(score);
      setLastWave(wave);
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

  const handleBack = useCallback(() => {
    setScreen('menu');
  }, []);

  const handleRestart = useCallback(() => {
    setScreen('playing');
  }, []);

  return (
    <>
      <StatusBar style="light" />
      {screen === 'menu' && (
        <MenuScreen onPlay={handlePlay} highScore={highScore} />
      )}
      {screen === 'playing' && (
        <GameScreen onGameOver={handleGameOver} onBack={handleBack} />
      )}
      {screen === 'gameOver' && (
        <GameOverScreen
          score={lastScore}
          wave={lastWave}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onMenu={handleBack}
        />
      )}
    </>
  );
}
