import * as THREE from 'three';
import { Stork } from './strok.js';

let storks = [];
const flockCenter = new THREE.Vector3(0, 25, -200); // Start far ahead
const flockDirection = new THREE.Vector3(0, 0, 1); // Direction (backwards relative to camera)

// Speed settings
const RESPOND_Z = 100;    // Reset when this far behind the car
const START_Z = -300;     // Respawn at this distance ahead
const RELATIVE_SPEED = 0.3; // Speed at which the flock moves back relative to car

export function createFlock(scene, count = 15) {
    storks = [];
    for (let i = 0; i < count; i++) {
        storks.push(new Stork(scene));
    }
}

export function updateFlock(delta, time) {
    // 1. Linearly move the flock center backwards (relative to car)
    // This creates the effect of the car being faster
    flockCenter.z += RELATIVE_SPEED * (delta * 60); // Normalize speed by frame rate (assuming 60fps)

    // Slight side-to-side sway for the whole flock
    flockCenter.x = Math.sin(time * 0.2) * 10;
    flockCenter.y = 25 + Math.sin(time * 0.5) * 5;

    // 2. Respawn Logic
    if (flockCenter.z > RESPOND_Z) {
        flockCenter.z = START_Z;
        // Randomize the formation a bit on respawn?
        storks.forEach(s => {
            s.relativePos.x = (Math.random() - 0.5) * 30;
            s.relativePos.z = (Math.random() - 0.5) * 20;
        });
    }

    // 3. Update individual storks
    storks.forEach(stork => stork.update(delta, time, flockCenter, flockDirection));
}
