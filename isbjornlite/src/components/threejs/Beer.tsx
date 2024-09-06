import { useEffect, useState } from 'react';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useScene } from '@/contexts/SceneContext';

export default function Beer() {
    const scene = useScene();
    const [loadedGLTF, setLoadedGLTF] = useState<GLTF | null>(null);

    useEffect(() => {
        if (!scene) return;

        const loader = new GLTFLoader();

        loader.load('/3d/beer.glb', (gltf: GLTF) => {
            setLoadedGLTF(gltf);
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, -10);

            scene.add(model);
        });

        return () => {
            if (loadedGLTF) {
                scene.remove(loadedGLTF.scene);
            }
        };
    }, [scene]);

    useEffect(() => {
        if (loadedGLTF && scene) {
            const model = loadedGLTF.scene;
            scene.add(model);

            return () => {
                scene.remove(model);
            };
        }
    }, [loadedGLTF, scene]);

    return null;
}