import * as THREE from 'three';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export type Scene = typeof scene;
export type Renderer = typeof renderer;
export type Camera = typeof camera;