import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import {BeerSpawner} from "./BeerSpawner";
import Box from "./Box";
import Ground from "./Ground";

export default function Scene() {
    return (
        <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, -40, 50]} fov={30} near={1}/>
            <OrbitControls />
            {BeerSpawner(1200)}
            <Box />
            <directionalLight position={[20, 20, 50]} intensity={2.5} castShadow color="#e4ebf0"/>
            <directionalLight position={[-20, 20, 50]} intensity={2.5} castShadow color="#e4ebf0"/>
            <ambientLight intensity={5}/>
            <Ground />
        </Suspense>
    );
}