import { useCompoundBody } from "@react-three/cannon";
import { useEffect, useState } from "react";

interface BeerBoundingProps {
    position: [number, number, number];
    rotation: [number, number, number];
}

export function BeerBounding({ ...props }: BeerBoundingProps) {
    const [isOutOfView, setIsOutOfView] = useState(false);

    const [ref, api] = useCompoundBody(() => ({
        mass: 1, // Set the mass of the object
        shapes: [
          { type: 'Cylinder', position: [0, 0, 0], args: [1.38, 1.38, 6.25, 16]},
          { type: 'Cylinder', position: [0, -3.3, 0], args: [1.38, 1.1, 0.35, 8] },
          { type: 'Cylinder', position: [0, 3.4, 0], args: [1.38, 1.38, 0.4, 8] },
        ],
        ...props
      }));

      // Continuously log the position
      useEffect(() => {
        const unsubscribe = api.position.subscribe((position) => {
            if (position[1] < -5) {
                setIsOutOfView(true);
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [api]);

    return [ref, api];
}