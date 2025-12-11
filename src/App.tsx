import { Canvas } from '@react-three/fiber';
import { Game } from './components/Game';
import { UI } from './components/UI';
import './App.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      <Canvas>
        <Game />
      </Canvas>
      <UI />
    </div>
  );
}

export default App;
