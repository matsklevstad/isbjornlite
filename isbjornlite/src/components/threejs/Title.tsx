import { useEffect, useState } from 'react';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Mesh } from 'three';
import { useBox } from '@react-three/cannon';
import { MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Title() {
    const [font, setFont] = useState(null);
    const [opacityLeft, setOpacityLeft] = useState(0);
    const [opacityRight, setOpacityRight] = useState(0);

    const [opacityDelay, setOpacityDelay] = useState<number>(0);
    const delayFrames = 250;

    const [ref] = useBox(() => ({
        position: [0, -8.5, 8.8],
        // args: [14, 5, 15],
        args: [0, 0, 0],
        rotation: [Math.PI / 8, 0, 0],
        type: 'Static',
    }));

    useEffect(() => {
        const loader = new FontLoader();
        loader.load('/Open-Sans.json', (loadedFont: any) => {
            setFont(loadedFont);
        });
    }, []);

    useFrame(() => {
        if (opacityDelay < delayFrames) {
            setOpacityDelay(opacityDelay + 1);
            return;
        }
        if (opacityLeft < 1) {
            setOpacityLeft(opacityLeft + 0.015);
        } else if (opacityRight < 1) {
            setOpacityRight(opacityRight + 0.015);
        }
    });

    if (!font) {
        return null; // or a loading spinner
    }

    const textGeometryLeft = new TextGeometry('ISBJØRN', {
        font: font,
        size: 1.5,
        height: 0.2,
        depth: 0.2,
    });

    const textGeometryRight = new TextGeometry('LITE', {
        font: font,
        size: 1.5,
        height: 0.2,
        depth: 0.2,
    });

    const materialLeft = new MeshStandardMaterial({color: 0xffffff});
    const materialRight = new MeshStandardMaterial({color: 0x00bfff});

    materialLeft.transparent = true;
    materialRight.transparent = true;

    const meshLeft = new Mesh(textGeometryLeft, materialLeft);
    const meshRight = new Mesh(textGeometryRight, materialRight);

    meshLeft.position.set(-6.8, -10, 15);
    meshLeft.rotation.set(Math.PI / 4, 0, 0);

    meshRight.position.set(2.5, -10, 15);
    meshRight.rotation.set(Math.PI / 4, 0, 0);

    materialLeft.opacity = opacityLeft;
    materialRight.opacity = opacityRight;

    return (
        <>
            <primitive object={meshLeft} ref={ref}/>
            <primitive object={meshRight} ref={ref}/>
            {/* <mesh ref={ref} position={[0, -8.5, 8.8]} rotation={[Math.PI / 8, 0, 0]}>
                <boxGeometry args={[14, 5, 15]}/>
                <meshBasicMaterial color={0x0000ff} opacity={0.5} transparent/>
            </mesh> */}
        </>
        
    );
}