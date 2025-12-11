import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Minimap } from './Minimap';

export const UI = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const startTime = useGameStore((s) => s.startTime);
  const endTime = useGameStore((s) => s.endTime);

  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (gameStatus === 'won') {
        setTime(Math.floor((endTime - startTime) / 1000));
    } else {
        setTime(0);
    }
    return () => clearInterval(interval);
  }, [gameStatus, startTime, endTime]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {gameStatus === 'playing' && (
        <>
            <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '24px', fontFamily: 'sans-serif' }}>
                Time: {time}s
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', fontFamily: 'sans-serif' }}>
                WASD to Move, Mouse to Look. Reach the Gold octahedron!
            </div>
            {/* Minimap handles its own positioning */}
            <div style={{pointerEvents: 'auto'}}>
                 <Minimap />
            </div>
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                color: 'rgba(255,255,255,0.3)', fontSize: '20px'
            }}>
                +
            </div>
        </>
      )}

      {gameStatus === 'idle' && (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto'
        }}>
            <h1 style={{ color: 'white', fontSize: '48px', marginBottom: '20px' }}>3D Maze Navigator</h1>
            <p style={{ color: '#ccc', marginBottom: '40px' }}>Find your way to the goal.</p>
            <button
                onClick={startGame}
                style={{
                    padding: '15px 40px', fontSize: '24px', cursor: 'pointer',
                    backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px'
                }}
            >
                Start Game
            </button>
        </div>
      )}

      {gameStatus === 'won' && (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto'
        }}>
            <h1 style={{ color: 'gold', fontSize: '48px', marginBottom: '20px' }}>You Won!</h1>
            <p style={{ color: 'white', fontSize: '24px', marginBottom: '40px' }}>Time: {time}s</p>
            <button
                onClick={() => { resetGame(); startGame(); }}
                style={{
                    padding: '15px 40px', fontSize: '24px', cursor: 'pointer',
                    backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px'
                }}
            >
                Play Again
            </button>
        </div>
      )}
    </div>
  );
};
