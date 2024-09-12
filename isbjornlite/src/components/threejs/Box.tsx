import { useBox } from "@react-three/cannon";

interface BoxProps {
    scale: number;
}

export default function Box({ scale}: BoxProps) {
    const [ref] = useBox(() => ({ 
        mass: 0.1, 
        args: [1, 1, 1],
        position: [8 * scale, 2, 0]
    }));

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="#00bfff"/>
        </mesh>
    );
}