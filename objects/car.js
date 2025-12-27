/**
 * Car object with keyboard controls and shadows
 * 
 * Fixes applied:
 * - Changed Three.js import to `from 'three'` to match import map in index.html
 * - Added a placeholder `carMesh` at origin to prevent `getCarPosition()` from returning null
 * - Ensures camera always has a valid target, even while model is loading
 * - Wheels rotate using global `time` (not deltaTime) for smooth, deterministic animation
 * - Model path is now relative: `./models/car.glb` (no leading slash)
 * - Added keyboard controls for left/right movement (A/D keys)
 * - Added shadow casting and receiving
 * 
 * Note: GLTFLoader uses CDN URL — valid for browser modules.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

// Placeholder always exists at origin (0,0,0)
let carMesh = new THREE.Object3D();
carMesh.name = 'carObject';
let wheels = [];

// Movement variables
let targetX = 0;
const moveSpeed = 0.5;
const lerpSpeed = 5;
const maxX = 5;
const minX = -5;

// Keyboard state
const keys = {
    a: false,
    d: false
};

// Only A/D key listeners — no debug spam
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'd') {
        keys[key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'd') {
        keys[key] = false;
    }
});

export function createCar(scene) {
    scene.add(carMesh);

    const loader = new GLTFLoader();
    loader.load('./models/car.glb', (gltf) => {
        const loadedCar = gltf.scene;
        carMesh.scale.set(2, 2, 2);
        loadedCar.rotation.set(0, Math.PI, 0);

        // Clear placeholder children
        while (carMesh.children.length > 0) {
            carMesh.remove(carMesh.children[0]);
        }

        carMesh.add(loadedCar);

        // Enable shadows and collect wheels
        loadedCar.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.name.toLowerCase().includes('wheel')) {
                    wheels.push(child);
                }
            }
        });
    }, undefined, (error) => {
        console.error('Error loading car model:', error);
    });
}

export function updateCar(time, delta) {
    // Handle A/D input
    if (keys.a) targetX -= moveSpeed * delta * 10;
    if (keys.d) targetX += moveSpeed * delta * 10;

    // Clamp and lerp position
    targetX = Math.max(minX, Math.min(maxX, targetX));
    carMesh.position.x += (targetX - carMesh.position.x) * lerpSpeed * delta;

    // Animate wheels
    wheels.forEach(wheel => {
        wheel.rotation.x = time * 20;
    });
}

export function getCarPosition() {
    return carMesh.position.clone();
}