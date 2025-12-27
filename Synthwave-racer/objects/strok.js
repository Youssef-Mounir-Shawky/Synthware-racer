import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Stork {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.mesh = null;
        this.mixer = null;

        // Configuration
        this.speed = config.speed || 0.5 + Math.random() * 0.5;
        this.radius = config.radius || 10 + Math.random() * 20;
        this.offset = config.offset || Math.random() * Math.PI * 2;
        this.bobSpeed = config.bobSpeed || 1 + Math.random();
        this.center = config.center || { x: 0, z: -10 };
        this.baseY = config.y || 5 + Math.random() * 10;

        const loader = new GLTFLoader();
        const modelPath = new URL('../models/Stork.glb', import.meta.url).href;

        loader.load(modelPath, (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.05, 0.05, 0.05);
            this.mesh.position.set(this.center.x, this.baseY, this.center.z);
            this.scene.add(this.mesh);

            this.mixer = new THREE.AnimationMixer(this.mesh);
            if (gltf.animations.length > 0) {
                const action = this.mixer.clipAction(gltf.animations[0]);
                action.startAt(Math.random());
                action.play();
                action.timeScale = 0.8 + Math.random() * 0.4;
            }
        });
    }

    update(delta, time) {
        if (this.mixer) {
            this.mixer.update(delta);
        }

        if (this.mesh) {
            // Circular flight around center
            const angle = time * this.speed + this.offset;
            this.mesh.position.x = this.center.x + Math.cos(angle) * this.radius;
            this.mesh.position.z = this.center.z + Math.sin(angle) * this.radius;

            // Bobbing
            this.mesh.position.y = this.baseY + Math.sin(time * this.bobSpeed) * 1.5;

            // Look in direction of travel
            this.mesh.rotation.y = -angle + Math.PI / 2;
        }
    }
}
