import React, { useMemo } from 'react';
import { useBox, usePlane } from '@react-three/cannon';
import { useGameStore } from '../store/gameStore';

const CELL_SIZE = 3;
const WALL_HEIGHT = 4;

const Wall = ({ position }: { position: [number, number, number] }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [CELL_SIZE, WALL_HEIGHT, CELL_SIZE], 
  }));

  return (
    <mesh ref={ref as any}>
      <boxGeometry args={[CELL_SIZE, WALL_HEIGHT, CELL_SIZE]} />
      <meshStandardMaterial color="#333333" roughness={0.1} metalness={0.5} />
    </mesh>
  );
};

const Floor = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
    }));

    return (
        <mesh ref={ref as any} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#eeeeee" roughness={0.8} metalness={0.2} />
        </mesh>
    );
}

export const Map = () => {
  const maze = useGameStore((state) => state.maze);
  
  // Memoize walls to avoid re-calculating on every render if store updates unrelated things
  const walls = useMemo(() => {
    const list: React.ReactElement[] = [];
    maze.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === 1) {
                // Wall
                const x = c * CELL_SIZE;
                const z = r * CELL_SIZE;
                const y = WALL_HEIGHT / 2;
                list.push(<Wall key={`${r}-${c}`} position={[x, y, z]} />);
            }
        });
    });
    return list;
  }, [maze]);

  return (
    <group>
      <Floor />
      {walls}
    </group>
  );
};
