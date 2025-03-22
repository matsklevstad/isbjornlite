import React from 'react';
import { useGLTF } from '@react-three/drei';
import { BeerBounding } from './boundingBoxes/BeerBounding';

type BeerBoundingProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
};

export function BeerModel({ ...props }: BeerBoundingProps) {
    const { nodes, materials } = useGLTF('/3d/beer.glb')
    const [ref] = BeerBounding({...props});

  const modelHeight = 6.25 + 0.35 + 0.4;
  const modelCenter = modelHeight / 2;

  return (
    <group {...props} dispose={null} ref={ref}>
      <group position={[0, -modelCenter, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Canmodel_obj_1.geometry}
          material={materials.lambert5SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Canmodel_obj_2.geometry}
          material={materials.lambert6SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Canmodel_obj_3.geometry}
          material={materials.lambert4SG}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Canmodel_obj_4.geometry}
          material={materials['Material.001']}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/3d/beer.glb')


