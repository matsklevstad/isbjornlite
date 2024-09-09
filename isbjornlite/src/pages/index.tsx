import { Canvas } from "@react-three/fiber";
import { Physics} from "@react-three/cannon";
import Scene from "@/components/threejs/Scene";


export default function Home() {

  return (
    <div className="w-screen h-screen">
      <Canvas className="bg-black" frameloop="demand">
        <Physics gravity={[0, -13, 0]}>
          <Scene />
        </Physics>
      </Canvas>
    </div>
  );
}


