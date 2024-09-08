import { usePlane } from "@react-three/cannon";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import { TextureLoader } from "three";

export default function Ground() {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 4, 0, 0] ,
        type: "Static",
        }));

    const gridMap = useLoader(
        TextureLoader,
        "/grid.png"
    )

    const alphaMap = useLoader(
        TextureLoader,
        "/alpha-map.png"
    )

    useEffect(() => {
        gridMap.anisotropy = 16;
    }, [gridMap]);

    return (
        <>
            <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, 0.01, 0]}>
                <planeGeometry args={[50, 100]}/>
                <meshBasicMaterial
                map={gridMap}
                opacity={0.375}
                alphaMap={gridMap}
                transparent
                />
            </mesh>

            <mesh ref={ref}>
                <planeGeometry args={[150, 200]}/>
                <MeshReflectorMaterial
                    alphaMap={alphaMap}
                    mixBlur={3} // Adjust these values as needed
                    blur={[500, 500]}
                    mixStrength={0.1}
                    color="#e4ebf0"
                    mirror={1}
                    hasBlur={true}
                    minDepthThreshold={0.9}
                    maxDepthThreshold={1}
                    depthScale={0}
                    depthToBlurRatioBias={0}
                    distortion={0}
                    mixContrast={1}
                />
            </mesh>

            <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 50, -69]}>
                <planeGeometry args={[50, 100]}/>
                <meshBasicMaterial
                map={gridMap}
                opacity={0.2}
                alphaMap={gridMap}
                transparent
                color="#fff"
                />
            </mesh>

            <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 50, -70]}>
                <planeGeometry args={[200, 200]}/>
                <MeshReflectorMaterial
                    alphaMap={alphaMap}
                    mixBlur={3} // Adjust these values as needed
                    blur={[500, 500]}
                    mixStrength={0.1}
                    color="#e4ebf0"
                    mirror={1}
                    hasBlur={true}
                    minDepthThreshold={0.9}
                    maxDepthThreshold={1}
                    depthScale={0}
                    depthToBlurRatioBias={0}
                    distortion={0}
                    mixContrast={1}
                />
            </mesh>
        </>
    )
}