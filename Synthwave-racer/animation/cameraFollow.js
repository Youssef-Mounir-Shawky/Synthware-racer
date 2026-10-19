export function updateCamera(camera, carPosition) {
    camera.position.set(
        carPosition.x,
        carPosition.y + 4,
        carPosition.z + 10
    );
    camera.lookAt(carPosition);
}
