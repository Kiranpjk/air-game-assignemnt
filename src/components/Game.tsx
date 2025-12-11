import { Physics } from '@react-three/cannon';
import { Stars } from '@react-three/drei';
import { Player } from './Player';
import { Map } from './Map';
import { Goal } from './Goal';
import { useGameStore } from '../store/gameStore';

export const Game = () => {
    const gameStatus = useGameStore(s => s.gameStatus);

    if (gameStatus === 'idle') return null;

    return (
        <Physics gravity={[0, -10, 0]}>
            <Stars />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            <Player />
            <Map />
            <Goal />
        </Physics>
    );
};
