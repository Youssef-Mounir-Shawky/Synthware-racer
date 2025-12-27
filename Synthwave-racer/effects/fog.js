import * as THREE from 'three';

export function setupFog(scene) {
  const fogColor = new THREE.Color(0xf2d9ff); 

  scene.fog = new THREE.FogExp2(
    fogColor,
    0.0005
  );

  scene.background = fogColor;
}
