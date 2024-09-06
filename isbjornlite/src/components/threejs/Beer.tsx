import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useBox, useCompoundBody } from '@react-three/cannon';

export function BeerModel({ ...props }) {
  const { nodes, materials } = useGLTF('/3d/beer.glb');
  
  // Create a physics-enabled compound body with mass
  const [ref] = useCompoundBody(() => ({
    mass: 1, // Set the mass of the object
    shapes: [
      { type: 'Cylinder', position: [0, 3.55, 0], args: [1.4, 1.4, 7.1, 64] } // Adjust args to match your model
    ],
    position: [0, 80, 0], // Initial position
  }));

  return (
    <group {...props} dispose={null}>
      <group ref={ref}>
        {/* Visualize the physics shapes
        <mesh position={[0, 3.55, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 7.1, 16]} />
          <meshBasicMaterial color="red" wireframe />
        </mesh> */}

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
  );
}

useGLTF.preload('/3d/beer.glb');