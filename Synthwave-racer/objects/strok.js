import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

let mixer;
let storkMesh;

export function createStork(scene) {
    // Use absolute path or module-relative to ensure it loads
    const loader = new GLTFLoader();
    const modelPath = new URL('../models/Stork.glb', import.meta.url).href;

    loader.load(modelPath, (gltf) => {
        storkMesh = gltf.scene;
        // Scale and Position it
        storkMesh.scale.set(0.05, 0.05, 0.05); // Adjust scale as needed
        storkMesh.position.set(5, 5, -10); // To the right and ahead
        storkMesh.rotation.y = Math.PI; // Face the camera? Or away? Let's check.
        // Usually models face +Z or -Z. 

        scene.add(storkMesh);

        // Animation Mixer
        mixer = new THREE.AnimationMixer(storkMesh);
        if (gltf.animations && gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }
    });
}

export function updateStork(delta, time) {
    if (mixer) {
        mixer.update(delta);
    }
    if (storkMesh) {
        // Optional: Make it fly alongside the car or in a circle
        // Simple circle movement
        storkMesh.position.z = -10 + Math.sin(time) * 5;
        storkMesh.position.y = 5 + Math.cos(time) * 1;
    }
}
