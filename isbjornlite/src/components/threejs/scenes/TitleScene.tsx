import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { BeerSpawner } from "../BeerSpawner";
import Box from "../Box";
import Ground from "../Ground";
import Title from "../Title";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
//import ScrollDownBtn from "@/components/buttons/ScrollDownBtn";

export default function TitleScene() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if(width < 1920) {
        setScale(1 - ((1920 - width) / 1920) * 0.5);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <Suspense fallback={null}>
      <div className="w-full h-screen">
        <Canvas className="bg-black " frameloop="demand" id="titleCanvas">
          <Physics gravity={[0, -13, 0]}>
            <PerspectiveCamera
              makeDefault
              position={[0, -40, 50]}
              fov={25}
              near={1}
            />
            <OrbitControls
              enablePan={false}
              enableRotate={false}
              enableZoom={false}
            />
            {/* {BoxSpawner(1000)} */}
            <BeerSpawner interval={1200} scale={scale}/>
            <Title scale={scale}/>
            <Box position={[10, 2, 0]} />
            {/* <directionalLight 
                    position={[200, 100, 70]}
                    intensity={0.4}
                    color="#e4ebf0"
                    /> */}
            <pointLight
              position={[0, 20, 60]}
              intensity={15000}
              color="#ffffff"
              distance={65}
            />
            <spotLight
              position={[0, 30, 70]}
              intensity={13000}
              color="#ffffff"
              distance={100}
            />
            <ambientLight intensity={1} color="#ffffff" />
            <Ground scale={scale}/>
          </Physics>
        </Canvas>
      </div>
      {/* <ScrollDownBtn /> */}
    </Suspense>
  );
}
