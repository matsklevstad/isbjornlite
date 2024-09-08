import { useBox } from "@react-three/cannon";

export default function Box() {
    const [ref] = useBox(() => ({ 
        mass: 0.1, 
        position: [20, 2, 0], 
        args: [2, 2, 2]
    }));

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[2, 2, 2]}/>
            <meshStandardMaterial color="brown"/>
        </mesh>
    );
}