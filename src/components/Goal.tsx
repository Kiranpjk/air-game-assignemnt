import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { Mesh } from 'three';

export const Goal = () => {
  const goalPos = useGameStore((s) => s.goalPos);
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y += 0.02;
        ref.current.position.y = goalPos[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={goalPos}>
        <mesh ref={ref}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="gold" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
        <pointLight distance={5} intensity={5} color="gold" />
    </group>
  );
};
