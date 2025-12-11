import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';

const SPEED = 10;

export const Player = () => {
  const { camera } = useThree();
  const startPos = useGameStore((s) => s.startPos);
  const goalPos = useGameStore((s) => s.goalPos);
  const finishGame = useGameStore((s) => s.finishGame);
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);
  const gameStatus = useGameStore((s) => s.gameStatus);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: startPos,
    fixedRotation: true, // Prevent rolling
    args: [0.8], // Radius
  }));

  // Movement state
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  // Velocity ref
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  // Position ref for goal check
  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveForward.current = true; break;
        case 'KeyS': moveBackward.current = true; break;
        case 'KeyA': moveLeft.current = true; break;
        case 'KeyD': moveRight.current = true; break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
          case 'KeyW': moveForward.current = false; break;
          case 'KeyS': moveBackward.current = false; break;
          case 'KeyA': moveLeft.current = false; break;
          case 'KeyD': moveRight.current = false; break;
        }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const frameCount = useRef(0);

  useFrame(() => {
    if (gameStatus !== 'playing') {
        // Stop movement?
        // Maybe allow, but game won.
    }

    // Sync camera to player
    camera.position.set(pos.current[0], pos.current[1] + 0.8, pos.current[2]);

    // Calculate velocity based on camera direction
    // Direction vector
    // We want to move on XZ plane
    const frontVector = new Vector3(
        0,
        0,
        Number(moveBackward.current) - Number(moveForward.current)
    );
    const sideVector = new Vector3(
        Number(moveLeft.current) - Number(moveRight.current),
        0,
        0
    );

    const direction = new Vector3();
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED);
    
    // Apply camera rotation to direction
    // Camera looks at things, so we need its yaw.
    direction.applyEuler(camera.rotation);

    // Apply velocity, preserving Y (gravity)
    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Goal Check
    const dx = pos.current[0] - goalPos[0];
    const dz = pos.current[2] - goalPos[2];
    const dist = Math.sqrt(dx*dx + dz*dz);
    if (dist < 2 && gameStatus === 'playing') { // 2 units threshold
        finishGame();
    }

    // Update store for minimap (throttle)
    if (frameCount.current++ % 10 === 0) {
        setPlayerPos([pos.current[0], pos.current[1], pos.current[2]]);
    }
  });

  return (
    <>
        <PointerLockControls />
        <mesh ref={ref as any}>
            {/* Visual debugging for player body if needed, currently invisible/inside camera */}
             <sphereGeometry args={[0.8]} />
             <meshStandardMaterial color="orange" transparent opacity={0} />
        </mesh>
    </>
  );
};
