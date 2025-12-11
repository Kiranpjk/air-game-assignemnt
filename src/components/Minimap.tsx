import { useGameStore } from '../store/gameStore';

const CELL_SIZE = 3; // Game world scale

export const Minimap = () => {
  const maze = useGameStore((state) => state.maze);
  const playerPos = useGameStore((state) => state.playerPos);
  const goalPos = useGameStore((state) => state.goalPos);
  
  if (!maze.length) return null;

  const rows = maze.length;
  const cols = maze[0].length;
  
  // Minimap scale
  const mScale = 10; // pixels per cell

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      width: cols * mScale,
      height: rows * mScale,
      backgroundColor: 'rgba(0,0,0,0.5)',
      border: '2px solid white',
    }}>
      {/* Walls */}
      {maze.map((row, r) => 
        row.map((cell, c) => {
           if (cell === 1) {
             return (
               <div key={`${r}-${c}`} style={{
                 position: 'absolute',
                 top: r * mScale,
                 left: c * mScale,
                 width: mScale,
                 height: mScale,
                 backgroundColor: '#8899aa'
               }} />
             );
           }
           return null;
        })
      )}
      
      {/* Player */}
      <div style={{
        position: 'absolute',
        top: (playerPos[2] / CELL_SIZE) * mScale,
        left: (playerPos[0] / CELL_SIZE) * mScale,
        width: mScale,
        height: mScale,
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)' // Center on position
      }} />

      {/* Goal */}
       <div style={{
        position: 'absolute',
        top: (goalPos[2] / CELL_SIZE) * mScale,
        left: (goalPos[0] / CELL_SIZE) * mScale,
        width: mScale,
        height: mScale,
        backgroundColor: 'gold',
        transform: 'translate(-50%, -50%)'
      }} />
    </div>
  );
};
