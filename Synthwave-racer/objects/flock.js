import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const storks = [];
const mixers = [];

// Configuration
const FLOCK_SIZE = 15;

export function createFlock(scene, count = FLOCK_SIZE) {
    const loader = new GLTFLoader();
    // Path relative to this file (objects folder)
    const modelPath = new URL('../models/Stork.glb', import.meta.url).href;

    loader.load(modelPath, (gltf) => {
        const originalMesh = gltf.scene;
        const animations = gltf.animations;

        for (let i = 0; i < count; i++) {
            // Clone the mesh
            const mesh = originalMesh.clone();

            // Randomize Scale slightly
            const scale = 0.05 + Math.random() * 0.02;
            mesh.scale.set(scale, scale, scale);

            // Randomize Position (Cloud formation)
            // Spread them out: X: -50 to 50, Y: 10 to 30, Z: -50 to -10
            mesh.position.set(
                (Math.random() - 0.5) * 100,
                10 + Math.random() * 20,
                -20 + (Math.random() - 0.5) * 50
            );

            // Randomize Rotation (y-axis)
            mesh.rotation.y = Math.random() * Math.PI * 2;

            // Custom properties for animation
            mesh.userData = {
                speed: 0.5 + Math.random() * 0.5,
                radius: 10 + Math.random() * 20,
                center: { x: mesh.position.x, z: mesh.position.z }, // Initial center
                offset: Math.random() * Math.PI * 2, // Start at different point in circle
                bobSpeed: 1 + Math.random()
            };

            scene.add(mesh);
            storks.push(mesh);

            // Animation Mixer (Each needs its own mixer)
            const mixer = new THREE.AnimationMixer(mesh);
            if (animations && animations.length > 0) {
                const action = mixer.clipAction(animations[0]);

                // Randomize start time so they don't flap in sync
                action.startAt(Math.random());
                action.play();

                // Randomize speed slightly
                action.timeScale = 0.8 + Math.random() * 0.4;
            }
            mixers.push(mixer);
        }

    }, undefined, (error) => {
        console.error('An error happened loading the Stork Flock:', error);
    });
}

export function updateFlock(delta, time) {
    // Update Animations
    mixers.forEach(mixer => mixer.update(delta));

    // Update Positions (Fly in circles around their center)
    storks.forEach(stork => {
        const data = stork.userData;

        // Circular flight
        const angle = time * data.speed + data.offset;
        stork.position.x = data.center.x + Math.cos(angle) * 10; // 10 radius circle movement
        stork.position.z = data.center.z + Math.sin(angle) * 10;

        // Bobbing up and down
        stork.position.y += Math.sin(time * data.bobSpeed) * 0.02;

        // Orient to face direction of travel
        stork.rotation.y = -angle; // Simple approximation
    });
}
