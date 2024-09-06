import { createContext, useContext } from 'react';
import { Scene } from '@/types/Scene';

const SceneContext = createContext<Scene | null>(null); 

export const useScene = () => useContext(SceneContext);

export default SceneContext;
