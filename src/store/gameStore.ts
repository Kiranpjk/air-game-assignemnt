import { create } from 'zustand';
import { generateMaze } from '../utils/mazeGenerator';

interface GameState {
  gameStatus: 'idle' | 'playing' | 'won';
  maze: number[][]; // 0: path, 1: wall
  startPos: [number, number, number];
  goalPos: [number, number, number];
  playerPos: [number, number, number];
  startTime: number;
  endTime: number;
  
  startGame: () => void;
  finishGame: () => void;
  resetGame: () => void;
  setPlayerPos: (pos: [number, number, number]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameStatus: 'idle',
  maze: [],
  startPos: [0, 0, 0],
  goalPos: [0, 0, 0],
  playerPos: [0, 0, 0],
  startTime: 0,
  endTime: 0,

  startGame: () => {
    const width = 10;
    const height = 10;
    const maze = generateMaze(width, height);
    
    // Find start (1,1) in grid coordinates
    // Assuming cell size 2 (handled in components), we store basic grid coords or 3D?
    // Let's store logic grid coords here if possible, but 3D is easier for placement.
    // Let's stick to Grid indices logic here, convert to 3D in components or here.
    // Start is always (1, 1) in the maze array (top-left)
    const gridSize = 3; // 3 units per block
    const startX = 1 * gridSize;
    const startZ = 1 * gridSize;
    
    // Find absolute farthest point or just bottom right: (rows-2, cols-2)
    const rows = maze.length;
    const cols = maze[0].length;
    const goalIndX = cols - 2;
    const goalIndY = rows - 2;
    
    // Ensure goal is 0 (it should be if maze logic is good, but maze ends at odd/odd)
    // The generator guarantees odd indices are cells.
    const goalX = goalIndX * gridSize;
    const goalZ = goalIndY * gridSize;

    set({
      gameStatus: 'playing',
      maze,
      startPos: [startX, 2, startZ], // y=2 for player height/drop
      goalPos: [goalX, 1, goalZ],
      startTime: Date.now(),
      endTime: 0,
    });
  },

  setPlayerPos: (pos) => set({ playerPos: pos }),

  finishGame: () => {
    set((state) => {
        if (state.gameStatus !== 'playing') return {};
        return {
            gameStatus: 'won',
            endTime: Date.now()
        };
    });
  },

  resetGame: () => {
    set({ gameStatus: 'idle', maze: [], startTime: 0, endTime: 0 });
  }
}));
