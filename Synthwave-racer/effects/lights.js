import * as THREE from 'three';

export function setupLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);

    scene.add(ambientLight, directionalLight);
}
