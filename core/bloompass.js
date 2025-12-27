import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export function createBloomPass(strength, radius, threshold) {
    return new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), strength, radius, threshold);
}
