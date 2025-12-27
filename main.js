// Main imports
import { createScene } from './core/scene.js';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { createComposer } from './core/composer.js';
import { getTime, updateClock, getDelta } from './core/clock.js';

import { createRoad, updateRoad } from './objects/road.js';
import { createCar, updateCar, getCarPosition } from './objects/car.js';
import { createMountains, updateMountains } from './objects/mountains.js';
import { createSun, updateSun } from './objects/sun.js';
import { createSkybox, updateSkybox } from './objects/sky.js';
import { createFlock, updateFlock } from './objects/flock.js';
import { createWater, updateWater } from './objects/water.js';

import { setupLights } from './effects/lights.js';
import { setupFog } from './effects/fog.js';
import { updateCamera } from './animation/cameraFollow.js';
import { setupCarAudio, startEngine } from './audio/carAudio.js';

// Import clean timer UI
import { initClockUI, updateClockUI } from './utils/clockUI.js';

// Initialize core systems
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const composer = createComposer(renderer, scene, camera);

// Init timer (now reliable)
initClockUI();

// Scene setup
createRoad(scene);
createCar(scene);
createMountains(scene);
createWater(scene);
createSun(scene);
createSkybox(scene);
setupLights(scene);
setupFog(scene);

// Audio
const { engineSound, listener } = setupCarAudio(camera, scene.getObjectByName('carObject') || scene);
createFlock(scene, 20, listener);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const delta = updateClock();
    const time = getTime();

    updateRoad(time);
    updateCar(time, delta);
    updateMountains(time);
    updateSun(time);
    updateSkybox(time);
    updateFlock(delta, time);
    updateWater(time);

    const carPos = getCarPosition();
    updateCamera(camera, carPos, time);
    updateClockUI();

    composer.render();
}
animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Audio resume + pointer lock on click
window.addEventListener('click', async () => {
    // Resume audio
    if (listener?.context?.state === 'suspended') {
        await listener.context.resume().catch(e => console.error("Audio resume failed:", e));
        console.log("AudioContext resumed.");
    }
    startEngine();
});