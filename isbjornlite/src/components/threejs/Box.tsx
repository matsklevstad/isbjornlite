import { useBox } from "@react-three/cannon";

export default function Box() {
    const [ref] = useBox(() => ({ 
        mass: 0.1, 
        position: [10, 2, 0], 
        args: [2, 2, 2]
    }));

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[2, 2, 2]}/>
            <meshBasicMaterial color="#0066ff"/>
        </mesh>
    );
}