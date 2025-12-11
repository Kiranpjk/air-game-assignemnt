import { useMemo } from 'react';
import { useBox, usePlane } from '@react-three/cannon';
import { useGameStore } from '../store/gameStore';

const CELL_SIZE = 3;
const WALL_HEIGHT = 4;

const Wall = ({ position }: { position: [number, number, number] }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [CELL_SIZE, WALL_HEIGHT, CELL_SIZE], // args is half-extent? No, args is [width, height, depth] for BoxGeometry? 
    // Canon useBox args are [width, height, depth] (full extent) matching Three's BoxGeometry args?
    // Wait, Canon args are usually half-extents for some shapes, but for Box it mirrors Three.js Geometry args (full width).
    // Let's verify: default is [1, 1, 1].
    // If I pass args: [w, h, d], physics body matches that.
  }));

  return (
    <mesh ref={ref as any}>
      <boxGeometry args={[CELL_SIZE, WALL_HEIGHT, CELL_SIZE]} />
      <meshStandardMaterial color="#556677" roughness={0.1} metalness={0.5} />
    </mesh>
  );
};

const Floor = () => {
    // Infinite floor or just large enough?
    // Large enough.
    // Rotate x -90 deg
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
    }));

    return (
        <mesh ref={ref as any} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#223344" roughness={0.8} metalness={0.2} />
        </mesh>
    );
}

export const Map = () => {
  const maze = useGameStore((state) => state.maze);
  
  // Memoize walls to avoid re-calculating on every render if store updates unrelated things
  const walls = useMemo(() => {
    const list: JSX.Element[] = [];
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
