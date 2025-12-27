/**
 * Dual Camera System
 * 
 * Mode 1: 'follow' — default chase cam behind car
 * Mode 2: 'orbit'  — Rocket League style free camera around car
 * 
 * Toggle: Press 'C'
 * Orbit Controls:
 *   - Mouse: look around (when pointer locked)
 *   - Arrow Keys: move camera (↑ ↓ ← →)
 *   - Shift: move up | Space: move down
 */

import * as THREE from 'three';

// === Chase Mode ===
const offset = new THREE.Vector3(0, 4, 10);
const smoothness = 0.1;

// === Orbit Mode State ===
let cameraMode = 'follow';
let velocity = new THREE.Vector3();
let keyState = {
    up: false,
    down: false,
    left: false,
    right: false,
    shift: false,
    space: false
};

let yaw = 0;
let pitch = 0;

// Keyboard handling
window.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
        toggleCameraMode();
        e.preventDefault();
        return;
    }

    // Only handle movement keys in orbit mode
    if (cameraMode !== 'orbit') return;

    if (e.key === 'ArrowUp') {
        keyState.up = true;
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        keyState.down = true;
        e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
        keyState.left = true;
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        keyState.right = true;
        e.preventDefault();
    } else if (e.key === 'Shift') {
        keyState.shift = true;
        e.preventDefault();
    } else if (e.key === ' ') {
        keyState.space = true;
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    if (cameraMode !== 'orbit') return;

    if (e.key === 'ArrowUp') keyState.up = false;
    else if (e.key === 'ArrowDown') keyState.down = false;
    else if (e.key === 'ArrowLeft') keyState.left = false;
    else if (e.key === 'ArrowRight') keyState.right = false;
    else if (e.key === 'Shift') keyState.shift = false;
    else if (e.key === ' ') keyState.space = false;
});

// Mouse movement (only in orbit mode + pointer locked)
window.addEventListener('mousemove', (e) => {
    if (cameraMode !== 'orbit') return;
    if (document.pointerLockElement !== document.body) return;

    const sensitivity = 0.002;
    yaw -= e.movementX * sensitivity;
    pitch -= e.movementY * sensitivity;
    pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));
});

// Toggle pointer lock on click (only in orbit mode)
window.addEventListener('click', () => {
    if (cameraMode === 'orbit') {
        document.body.requestPointerLock();
    }
});

// ================================
// EXPORTED FUNCTIONS
// ================================

export function toggleCameraMode() {
    cameraMode = cameraMode === 'follow' ? 'orbit' : 'follow';
    if (cameraMode === 'orbit') {
        document.body.requestPointerLock();
    } else {
        document.exitPointerLock();
    }
    console.log('Camera mode:', cameraMode);
}

// Expose globally for debugging (optional)
window.toggleCameraMode = toggleCameraMode;

export function updateCamera(camera, carPosition, time) {
    if (cameraMode === 'orbit') {
        updateOrbitCamera(camera, carPosition);
    } else {
        updateFollowCamera(camera, carPosition, time);
    }
}

function updateFollowCamera(camera, carPosition, time) {
    if (!carPosition) return;
    const sway = Math.sin(time * 1.2) * 0.15;
    const desired = new THREE.Vector3(
        carPosition.x + sway,
        carPosition.y + offset.y,
        carPosition.z + offset.z
    );
    camera.position.lerp(desired, smoothness);
    camera.lookAt(carPosition.x, carPosition.y + 1, carPosition.z);
}

function updateOrbitCamera(camera, carPosition) {
    const center = carPosition || new THREE.Vector3(0, 0, 0);

    // Reset rotation and apply yaw/pitch
    camera.rotation.set(0, 0, 0);
    camera.rotateY(yaw);
    camera.rotateX(pitch);

    // Get forward/right vectors (flat on XZ plane)
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    // Build movement vector using arrow keys
    velocity.set(0, 0, 0);
    if (keyState.up) velocity.add(forward);
    if (keyState.down) velocity.sub(forward);
    if (keyState.right) velocity.add(right);
    if (keyState.left) velocity.sub(right);
    if (keyState.shift) velocity.y += 1;
    if (keyState.space) velocity.y -= 1;

    // Apply movement
    const speed = 0.3;
    camera.position.add(velocity.clone().multiplyScalar(speed));

    // Always look at the car
    camera.lookAt(center);
}