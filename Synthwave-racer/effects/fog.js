import * as THREE from 'three';

export function setupFog(scene) {
    const fogColor = scene.background instanceof THREE.Color
        ? scene.background
        : new THREE.Color(0x0c0c2c);

    scene.fog = new THREE.Fog(fogColor, 50, 400);
}
