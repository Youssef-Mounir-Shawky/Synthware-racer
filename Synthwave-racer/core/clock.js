//clock.js
import * as THREE from 'three';

const clock = new THREE.Clock();
let lastDelta = 0;

export function getTime() {
    return clock.getElapsedTime();
}

export function getDelta() {
    return clock.getDelta();
}

// Better architectural fix: update a frame state
export function updateClock() {
    lastDelta = clock.getDelta();
    return lastDelta;
}

export function getFrameDelta() {
    return lastDelta;
}