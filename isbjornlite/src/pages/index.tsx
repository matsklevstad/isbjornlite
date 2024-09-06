import { Canvas } from "@react-three/fiber";
import { BeerModel } from "@/components/threejs/Beer";
import { OrbitControls } from "@react-three/drei";


export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={1} color="white"/>
        <directionalLight color="white" position={[0, 100, 50]} intensity={10} />
        <BeerModel />
      </Canvas>
    </div>
  );
}
