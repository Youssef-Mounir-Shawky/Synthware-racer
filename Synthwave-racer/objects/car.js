import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

let carMesh;   
let wheels = [];

export function createCar(scene) {
    const loader = new GLTFLoader();
    loader.load('/Synthwave-racer/models/car.glb', (gltf) => {  
        const car = gltf.scene;
        scene.add(car);

        carMesh = car; 

        wheels = [];
        car.traverse((child) => {
            if (child.isMesh && child.name.toLowerCase().includes('wheel')) {
                wheels.push(child);
            }
        });
    }, 
    (progress) => {
        console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        console.error('Error loading car model:', error);
    });
}

export function updateCar(deltaTime) {
    if (!wheels || wheels.length === 0) return;

    wheels.forEach(wheel => {
        wheel.rotation.x += deltaTime * 5; 
    });
}

export function getCarPosition() {
    if (!carMesh) return new THREE.Vector3();
    return carMesh.position.clone();
}
