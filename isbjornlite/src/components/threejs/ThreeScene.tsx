import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Scene } from '@/types/Scene';
import SceneContext from '@/contexts/SceneContext';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import React from 'react';

interface ThreeSceneProps {
  children: React.ReactNode;
}

const ThreeScene = ({children}: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0xffffff);
    mount.appendChild(renderer.domElement);

    camera.position.z = 10;
    camera.position.y = 5;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    const animate = () => {
      for (const object of scene.children) {
          object.rotation.y += 0.01;
      }
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    controls.update();

    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <SceneContext.Provider value={sceneRef.current}>
      <div ref={mountRef} />
      {children}
    </SceneContext.Provider>
  );
};

export default ThreeScene;