import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function BeerModel({ ...props }) {
  const { nodes, materials } = useGLTF('/3d/beer.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, -5, 0]}>
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
