import { useState, useEffect } from "react";
import { BeerModel } from "./Beer";


export const BeerSpawner = (interval: number) => {
    const [beers, setBeers] = useState<JSX.Element[]>([]);

    useEffect(() => {
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
    }, [interval]);

    return (
        <>
            {beers}
        </>
    );
};