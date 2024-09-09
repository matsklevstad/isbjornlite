import { useBox } from "@react-three/cannon";

interface BoxProps {
    position: [number, number, number];
}

export default function Box({...props}: BoxProps) {
    const [ref] = useBox(() => ({ 
        mass: 0.1, 
        args: [1, 1, 1],
        ...props
    }));

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="#00bfff"/>
        </mesh>
    );
}