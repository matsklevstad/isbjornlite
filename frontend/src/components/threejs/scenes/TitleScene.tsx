import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useState, useRef } from "react";
import { BeerSpawner } from "../BeerSpawner";
import Box from "../Box";
import Ground from "../Ground";
import Title from "../Title";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { BeerModel } from "../Beer";
import GravityShift from "@/components/buttons/GravityShift";
import ScrollDownBtn from "@/components/buttons/ScrollDownBtn";
import classes from "@/styles/TitleScene.module.css";

// Context recovery component
function ContextLossHandler() {
  const { gl } = useThree();
  
  useEffect(() => {
    // Set up event listeners for WebGL context loss and recovery
    const canvas = gl.domElement;
    
    interface IContextLostEvent extends Event {}

    const handleContextLost = (event: IContextLostEvent): void => {
      event.preventDefault();
      console.warn("WebGL context lost. Trying to recover...");
    };
    
    const handleContextRestored = () => {
      console.log("WebGL context restored!");
      gl.setSize(gl.domElement.width, gl.domElement.height); // Force resize
    };
    
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    
    // Cleanup
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);
  
  return null;
}

export default function TitleScene() {
  const [scale, setScale] = useState(1);
  const normalGravity: [number, number, number] = [0, -13, 0];
  const noGravity: [number, number, number] = [0, -3, 3];
  const [gravity, setGravity] = useState<[number, number, number]>(normalGravity);
  const [rendererFailed, setRendererFailed] = useState(false);
  const canvasRef = useRef(null);

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

  // Handle errors
  const handleCanvasCreationError = (event: React.SyntheticEvent): void => {
    console.error("Failed to create WebGL context:", event);
    setRendererFailed(true);
  };

  // Fallback content if WebGL fails
  if (rendererFailed) {
    return (
      <div className={classes.container}>
        <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4 text-center">
          <h1 className="text-4xl mb-4">Isbjørn Lite</h1>
          <p>3D visualization could not load. Your device might not support WebGL or has limited graphics capabilities.</p>
          <a href="/dashboard" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Continue to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading 3D scene...</div>
      </div>
    }>
      <div className={classes.container}>
        <GravityShift
          setGravity={setGravity}
          gravity={gravity}
          normalGravity={normalGravity}
          noGravity={noGravity}
        />
        <ScrollDownBtn />
        <Canvas 
          ref={canvasRef}
          className="bg-black"
          frameloop="demand" 
          id="titleCanvas"
          onCreated={(state) => {
            // Set performance related settings
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            
            // Optimize for performance
            state.gl.shadowMap.enabled = false; // Disable shadows for performance
          }}
          onError={handleCanvasCreationError}
        >
          {/* Add context recovery component */}
          <ContextLossHandler />
          
          {/* Use lower precision physics */}
          <Physics 
            gravity={gravity}
            defaultContactMaterial={{ 
              friction: 0.2,
              restitution: 0.3 
            }}
            iterations={5} // Lower physics iterations for better performance
          >
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
            
            {/* Increase spawn interval to reduce stress */}
            <BeerSpawner
              interval={2000} // Increased from 1200 to 2000ms
              scale={scale}
              gravity={gravity}
              normalGravity={normalGravity}
            />
            
            <Title scale={scale} />

            <BeerModel
              position={[0, 110, -110]}
              rotation={[0, 0, Math.PI / 2]}
              scale={[scale, scale, scale]}
            />
            
            <Box scale={scale} />
            
            {/* Reduced light intensity for better performance */}
            <pointLight
              position={[0, 20, 60]}
              intensity={5000} // Reduced from 1500
              color="#ffffff"
              distance={65}
            />
            
            <spotLight
              position={[0, 30, 70]}
              intensity={5000} // Reduced from 13000
              color="#ffffff"
              distance={100}
            />
            
            <ambientLight intensity={1} color="#ffffff" />
            <Ground scale={scale} />
          </Physics>
        </Canvas>
      </div>
    </Suspense>
  );
}