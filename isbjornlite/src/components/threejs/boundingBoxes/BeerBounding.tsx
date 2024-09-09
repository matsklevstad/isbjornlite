import { useCompoundBody } from "@react-three/cannon";

interface BeerBoundingProps {
    position: [number, number, number];
    rotation: [number, number, number];
}

export function BeerBounding({ ...props }: BeerBoundingProps) {

    const [ref, api] = useCompoundBody(() => ({
        mass: 1, // Set the mass of the object
        shapes: [
          { type: 'Cylinder', position: [0, 0, 0], args: [1.38, 1.38, 6.25, 16]},
          { type: 'Cylinder', position: [0, -3.3, 0], args: [1.38, 1.1, 0.35, 8] },
          { type: 'Cylinder', position: [0, 3.4, 0], args: [1.38, 1.38, 0.4, 8] },
        ],
        ...props
      }));

    return [ref, api];
}