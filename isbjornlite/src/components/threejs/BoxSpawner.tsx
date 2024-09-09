import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Box from "./Box";

export function BoxSpawner(interval: number) {
    const [boxes, setBoxes] = useState<JSX.Element[]>([]);
    const [startCounter, setStartCounter] = useState(0);
    const startDelay = 350;

    useFrame(() => {
        console.log(startCounter);
        if (startCounter < startDelay) {
            setStartCounter(startCounter + 1);
        }
    });

    useEffect(() => {
        if (startCounter < startDelay) {
            return;
        }

        const id = setInterval(() => {
            setBoxes((prevBoxes) => [
                ...prevBoxes,
                <Box position={[Math.random() * 10 - 10, 40, -30]} key={prevBoxes.length}/>
            ]);
        }, interval);

        return () => clearInterval(id); // Cleanup interval on component unmount
    }, [interval, startCounter]);

    return (
        <>
            {boxes}
        </>
    );
}