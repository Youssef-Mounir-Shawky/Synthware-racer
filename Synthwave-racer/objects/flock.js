import { Stork } from './strok.js';

let storks = [];

export function createFlock(scene, count = 15) {
    // Clear existing if any
    storks = [];

    for (let i = 0; i < count; i++) {
        const config = {
            center: {
                x: (Math.random() - 0.5) * 100,
                z: -50 + (Math.random() - 0.5) * 100
            },
            y: 10 + Math.random() * 20,
            speed: 0.3 + Math.random() * 0.4,
            radius: 5 + Math.random() * 15
        };

        storks.push(new Stork(scene, config));
    }
}

export function updateFlock(delta, time) {
    storks.forEach(stork => stork.update(delta, time));
}
