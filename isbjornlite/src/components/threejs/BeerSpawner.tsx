import { useState, useEffect } from "react";
import { BeerModel } from "./Beer";
import { useFrame } from "@react-three/fiber";


export const BeerSpawner = (interval: number) => {
    const [beers, setBeers] = useState<JSX.Element[]>([]);
    const [startCounter, setStartCounter] = useState(0);
    const startDelay = 250;

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
            setBeers((prevBeers) => [
                ...prevBeers,
                <BeerModel
                    key={prevBeers.length}
                    position={[Math.random() * 10 - 10, 100, -30]}
                    rotation={[Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2]}
                />
            ]);
        }, interval);

        return () => clearInterval(id); // Cleanup interval on component unmount
    }, [interval, startCounter]);

    return (
        <>
            {beers}
        </>
    );
};