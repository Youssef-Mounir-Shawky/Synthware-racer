//clock.js
import * as THREE from 'three';

const clock = new THREE.Clock();

export function getTime() {
    return clock.getElapsedTime();
}

export function getDelta() {
    return clock.getDelta();
}