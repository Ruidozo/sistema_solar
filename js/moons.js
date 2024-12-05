import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

// Função para criar uma lua
export function createMoon(planet, moonData, mode) {
    const size = mode === 'realistic' ? moonData.realSize : moonData.abstractSize;
    const moonTexture = new THREE.TextureLoader().load(moonData.texture);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const moonGeometry = new THREE.SphereGeometry(size, 16, 16);
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Configura a posição inicial da lua em relação ao planeta
    moon.position.set(moonData.distance, 0, 0);

    // Configuração da velocidade de translação
    moon.userData = {
        center: planet, // O planeta em torno do qual orbita
        distance: moonData.distance,
        speed: 0.05 / moonData.distance, // Velocidade proporcional à distância
        angle: 0 // Ângulo inicial da órbita
    };

    planet.add(moon); // Adiciona a lua como filha do planeta

    return moon;
}
