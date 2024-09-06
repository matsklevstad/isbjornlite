import { Canvas } from "@react-three/fiber";
import { BeerModel } from "@/components/threejs/Beer";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, useCylinder, usePlane } from "@react-three/cannon";


export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Canvas>
        <OrbitControls />
        
        {/* <directionalLight color="white" position={[50, 50, -50]} intensity={5} />
        <directionalLight color="white" position={[0, 50, 0]} intensity={5} />
        <directionalLight color="white" position={[-50, 50, -50]} intensity={5} />
        <directionalLight color="white" position={[-50, -50, -50]} intensity={5} />
        <BeerModel /> */}
        <Physics >
        <ambientLight intensity={0.5} />
        <directionalLight color="white" position={[0, 50, 50]} intensity={8} />
          <Plane />
          <Cylinder />
          <BeerModel />
        </Physics>
      </Canvas>
    </div>
  );
}

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  )
}

function Cylinder(props: any) {
  const [ref] = useCylinder(() => ({ mass: 1, position: [10, 150, 10], rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 4], ...props }))
  return (
    <mesh ref={ref} position={[10, 800, 0]}>
      <cylinderGeometry args={[1, 1, 10, 32]}/>
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
