import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

export function createBackgroundStars(scene, count) {
    // Remove todas as estrelas existentes
    const starsToRemove = scene.children.filter(child => child.name === 'backgroundStar');
    starsToRemove.forEach(star => scene.remove(star));

    // Cria nova geometria de estrelas
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,  // Cor das estrelas
        size: 0.5,        // Tamanho das estrelas
        sizeAttenuation: true,
    });

    const starPositions = [];

    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2000; // Posição maior para o fundo
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;

        starPositions.push(x, y, z);
    }

    starGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = 'backgroundStar'; // Nome para identificar estrelas no fundo

    scene.add(stars);
}


export function createAsteroidBelt(scene) {
    const asteroidGroup = new THREE.Group(); // Agrupa asteroides para fácil manipulação
    const asteroidCount = 1000; 
    const innerRadius = 22; // Raio interno do cinturão
    const outerRadius = 25; // Raio externo do cinturão

    const asteroidGeometry = new THREE.IcosahedronGeometry(0.1, 0); // Geometria dos asteroides
    const asteroidMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.9,
        metalness: 0.3,
    });

    for (let i = 0; i < asteroidCount; i++) {
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

        // Gerar posição aleatória no raio do cinturão
        const distance = THREE.MathUtils.randFloat(innerRadius, outerRadius);
        const angle = Math.random() * Math.PI * 2; // Ângulo aleatório

        asteroid.position.x = distance * Math.cos(angle); // Coordenada X
        asteroid.position.z = distance * Math.sin(angle); // Coordenada Z
        asteroid.position.y = THREE.MathUtils.randFloat(-0.5, 0.5); // Pequena variação em Y

        // Rotação aleatória do asteroide
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;

        // Adicionar asteroide ao grupo
        asteroidGroup.add(asteroid);
    }

    // Adicionar o grupo de asteroides à cena
    scene.add(asteroidGroup);
}