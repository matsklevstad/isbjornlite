import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import {BeerSpawner} from "./BeerSpawner";
import Box from "./Box";
import Ground from "./Ground";
import Title from "./Title";

export default function Scene() {
    return (
        <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, -45, 50]} fov={30} near={1}/>
            <OrbitControls
            enablePan={false}
            enableRotate={false}
            enableZoom={false}
            />
            {/* {BoxSpawner(1000)} */}
            {BeerSpawner(1200)}
            <Title />
            <Box position={[10, 2, 0]}/>
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
            <ambientLight intensity={0.2} color="#ffffff"/>
            <Ground />
        </Suspense>
    );
}