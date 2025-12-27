//sky.js
import * as THREE from 'three';

let skyMesh;

export function createSkybox(scene) {
    // Use Sphere for seamless sky
    const geometry = new THREE.SphereGeometry(3000, 64, 64);

    // Load the texture
    const textureLoader = new THREE.TextureLoader();
    const texturePath = new URL('../textures/sky.png', import.meta.url).href;
    const texture = textureLoader.load(texturePath);
    // Default 1x1 mapping often looks best for a single "face", 
    // but if the user wants tiling we can uncomment these:
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(3, 3);

    // Use BasicMaterial so it's not affected by lighting (it emits its own color)
    // BackSide renders the inside of the sphere
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });

    skyMesh = new THREE.Mesh(geometry, material);

    // Rotate to align nicely if needed


    scene.add(skyMesh);
    return skyMesh;
}

export function updateSkybox(time) {
    if (skyMesh) {
        // Very slow rotation to make the world feel alive
        skyMesh.rotation.y = time * 0.02;
    }
}