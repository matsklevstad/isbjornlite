import { useState, useEffect, useMemo } from "react";
import { BeerModel } from "./Beer";
import { useFrame } from "@react-three/fiber";
import { arraysEqual } from "@/utils/arrayUtils";

interface BeerSpawnerProps {
    interval: number;
    scale: number;
    gravity: [number, number, number];
    normalGravity: [number, number, number];
}


export const BeerSpawner = ({interval, scale, gravity, normalGravity}: BeerSpawnerProps) => {
    const [beers, setBeers] = useState<JSX.Element[]>([]);
    const [startCounter, setStartCounter] = useState(0);
    const normalVelocity: [number, number, number] = useMemo(() => [0, -15 - 20 * Math.random(), Math.random() * 20], []);
    const noGravityVelocity: [number, number, number] = useMemo(() => [0, Math.random() * -3, 0], []);

    const [velocity, setVelocity] = useState<[number, number, number]>(normalVelocity);
    const startDelay = 250;

    useFrame(() => {
        //console.log(startCounter);
        if (startCounter < startDelay) {
            setStartCounter(startCounter + 1);
        }
    });

    useEffect(() => {
        if(arraysEqual(gravity, normalGravity)) {
            setVelocity(normalVelocity);
        } else {
            setVelocity(noGravityVelocity);
        }
    }, [gravity, normalGravity, noGravityVelocity, normalVelocity]);

    useEffect(() => {
        if (startCounter < startDelay) {
            return;
        }

        const id = setInterval(() => {
            setBeers((prevBeers) => [
                ...prevBeers,
                <BeerModel
                    key={prevBeers.length}
                    position={[(Math.random() * 10 - Math.random() * 10) * scale, 50, -40]}
                    rotation={[Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2]}
                    scale={[scale, scale, scale]}
                    velocity={velocity}
                    angularVelocity={[Math.random(), Math.random() * 0.1  , Math.random() * 0.1]}
                />
            ]);
        }, interval);

        return () => clearInterval(id); // Cleanup interval on component unmount
    }, [interval, startCounter, scale, velocity]);

    return (
        <>
            {beers}
        </>
    );
};