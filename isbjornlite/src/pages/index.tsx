import { Canvas } from "@react-three/fiber";
import { BeerModel } from "@/components/threejs/Beer";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, useCylinder, usePlane } from "@react-three/cannon";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(true);

  const values = [
    { name: "Mats", timestamp: "2022-01-01 10:00:00", location: "Oslo" },
    { name: "Ola", timestamp: "2022-01-02 12:30:00", location: "Bergen" },
    { name: "Bjørn", timestamp: "2022-01-03 15:45:00", location: "Trondheim" },
  ];

  return (
    <div className="relative w-screen h-screen">
      {/* Canvas in the background */}
      <Canvas className="absolute top-0 left-0 w-full h-full">
        <OrbitControls />
        <Physics>
          <ambientLight intensity={0.5} />
          <directionalLight
            color="white"
            position={[0, 50, 50]}
            intensity={8}
          />
          <Plane />
          <Cylinder />
          <BeerModel />
        </Physics>
      </Canvas>

      {/* Overlay above the canvas */}
      <button
        className="absolute z-20 top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowOverlay(!showOverlay)}
      >
        {showOverlay
          ? "Jeg vil leke med 3D-isbjørnen"
          : "Jeg vil ikke leke lenger"}
      </button>
      {showOverlay && (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col bg-blue-200 bg-opacity-50 p-4">
          <h1 className="text-white text-center text-5xl mb-4 font-bold">
            Isbjorn Lite
          </h1>

          <div className="flex flex-col items-center text-center mb-4">
            <p className="text-white mb-2">Antall isbjørn: {values.length}</p>
            {values.map((value, index) => (
              <div
                className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-4"
                key={index}
              >
                <img
                  src="https://www.mack.no/img/_productMedium/Mack_Isbjorn_LITE_050can.png"
                  alt="Isbjorn"
                  width={80}
                  height={80}
                  className="w-20 h-24 rounded-full border border-gray-600"
                />
                <div className="ml-4 text-white">
                  <p className="font-semibold">{value.name}</p>
                  <p className="text-gray-400">{value.timestamp}</p>
                  <p className="text-gray-400">{value.location}</p>
                </div>
              </div>
            ))}
          </div>

          <iframe
            src="https://www.yr.no/nb/innhold/2-6697173/card.html"
            height="300px"
            className="w-full"
            style={{ border: "none", opacity: 0.9 }}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
}

function Cylinder(props: any) {
  const [ref] = useCylinder(() => ({
    mass: 1,
    position: [10, 150, 10],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 4],
    ...props,
  }));
  return (
    <mesh ref={ref} position={[10, 800, 0]}>
      <cylinderGeometry args={[1, 1, 10, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
