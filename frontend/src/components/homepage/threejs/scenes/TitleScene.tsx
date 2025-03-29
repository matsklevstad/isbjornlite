import {
  OrbitControls,
  PerspectiveCamera,
  useProgress,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { BeerSpawner } from "../BeerSpawner";
import Ground from "../Ground";
import Title from "../Title";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { BeerModel } from "../Beer";
import ScrollDownBtn from "../../buttons/ScrollDownBtn";
import classes from "@/styles/TitleScene.module.css";

interface TitleSceneProps {
  setIsLoading: (isLoading: boolean) => void;
  loadingProgass: number;
  setLoadingProgass: (progress: number) => void;
}

function LoadingTracker({
  setIsLoading,
  loadingProgass,
  setLoadingProgass,
}: TitleSceneProps) {
  const { progress } = useProgress();

  useEffect(() => {
    // Update loading progress
    if (progress > loadingProgass) {
      setLoadingProgass(progress);
    }

    if (progress === 100) {
      // Add small delay for smoother transition
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [progress, setIsLoading, setLoadingProgass, loadingProgass]);

  return null;
}

export default function TitleScene({
  setIsLoading,
  loadingProgass,
  setLoadingProgass,
}: TitleSceneProps) {
  const [scale, setScale] = useState(1);
  const normalGravity: [number, number, number] = [0, -13, 0];
  const noGravity: [number, number, number] = [0, -3, 3];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1920) {
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
    <>
      <LoadingTracker
        setIsLoading={setIsLoading}
        loadingProgass={loadingProgass}
        setLoadingProgass={setLoadingProgass}
      />
      <Suspense fallback={null}>
        <div className={classes.container}>
          {/* <GravityShift
          setGravity={setGravity}
          gravity={gravity}
          normalGravity={normalGravity}
          noGravity={noGravity}
        /> */}
          <ScrollDownBtn targetId="scrollTarget" />
          <Canvas className="bg-black " frameloop="demand" id="titleCanvas">
            <Physics gravity={noGravity}>
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
              <BeerSpawner
                interval={1200}
                scale={scale}
                gravity={noGravity}
                normalGravity={normalGravity}
              />
              <Title scale={scale} />

              <BeerModel
                position={[0, 110, -110]}
                rotation={[0, 0, Math.PI / 2]}
                scale={[scale, scale, scale]}
              />
              {/* <directionalLight 
                    position={[200, 100, 70]}
                    intensity={2.4}
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
              <Ground scale={scale} />
            </Physics>
          </Canvas>
        </div>
      </Suspense>
    </>
  );
}
