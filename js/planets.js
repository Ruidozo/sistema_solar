import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { createMoon } from './moons.js';
export const orbits = [];

export function createPlanets(scene, mode = 'realistic') {
    const textures = {
        sun: 'assets/textures/sun.jpg',
        mercury: 'assets/textures/mercury.jpg',
        venus: 'assets/textures/venus.jpg',
        earth: 'assets/textures/earth.jpg',
        mars: 'assets/textures/mars.jpg',
        jupiter: 'assets/textures/jupiter.jpg',
        saturn: 'assets/textures/saturn.jpg',
        uranus: 'assets/textures/uranus.jpg',
        neptune: 'assets/textures/neptune.jpg',
    };

    const planetsData = [
        { name: 'Sun', realSize: 5, abstractSize: 5, texture: textures.sun, distance: 0, orbitalPeriod: 0, rotationPeriod: 0 },
        { name: 'Mercury', realSize: 0.0035 * 5, abstractSize: 0.0035 * 5 * 15, texture: textures.mercury, distance: 8, orbitalPeriod: 87.97, rotationPeriod: 1407.6 },
        { name: 'Venus', realSize: 0.0087 * 5, abstractSize: 0.0087 * 5 * 15, texture: textures.venus, distance: 12, orbitalPeriod: 224.70, rotationPeriod: -5832.5 },
        { 
            name: 'Earth', 
            realSize: 0.0092 * 5, 
            abstractSize: 0.0092 * 5 * 15, 
            texture: textures.earth, 
            distance: 16, 
            orbitalPeriod: 365.26, 
            rotationPeriod: 23.93,
            moons: [
                { name: 'Moon', realSize: 0.0027 * 5, abstractSize: 0.0027 * 5 * 10, texture: 'assets/textures/moon.jpg', distance: 1 }
            ]
        },
        {
            name: 'Mars', 
            realSize: 0.0049 * 5, 
            abstractSize: 0.0049 * 5 * 15, 
            texture: textures.mars, 
            distance: 20, 
            orbitalPeriod: 686.98, 
            rotationPeriod: 24.62,
            moons: [
                { name: 'Phobos', realSize: 0.0002 * 5, abstractSize: 0.0002 * 5 * 50, texture: 'assets/textures/phobos.jpg', distance: 0.5 },
                { name: 'Deimos', realSize: 0.0001 * 5, abstractSize: 0.0001 * 5 * 50, texture: 'assets/textures/deimos.jpg', distance: 1 }
            ]
        },
        { 
            name: 'Jupiter', 
            realSize: 0.1005 * 5, 
            abstractSize: 0.1005 * 5 * 5, 
            texture: textures.jupiter, 
            distance: 30, 
            orbitalPeriod: 4332.59, 
            rotationPeriod: 9.93,
            moons: [
                { name: 'Io', realSize: 0.0025 * 5, abstractSize: 0.0025 * 5 * 10, texture: 'assets/textures/io.jpg', distance: 3 },
                { name: 'Europa', realSize: 0.0022 * 5, abstractSize: 0.0022 * 5 * 10, texture: 'assets/textures/europa.jpg', distance: 4 },
                { name: 'Ganymede', realSize: 0.004 * 5, abstractSize: 0.004 * 5 * 10, texture: 'assets/textures/ganymede.jpg', distance: 5 },
                { name: 'Callisto', realSize: 0.0038 * 5, abstractSize: 0.0038 * 5 * 10, texture: 'assets/textures/callisto.jpg', distance: 6 }
            ]
        },
        { 
            name: 'Saturn', 
            realSize: 0.0837 * 5, 
            abstractSize: 0.0837 * 5 * 5, 
            texture: textures.saturn, 
            distance: 40, 
            orbitalPeriod: 10759.22, 
            rotationPeriod: 10.7,
            ring: { 
                innerRadius: 0.09 * 5, 
                outerRadius: 0.17 * 5,
                abstractInnerRadius: 0.09 * 5 * 5,
                abstractOuterRadius: 0.17 * 5 * 5,
                texture: 'assets/textures/saturn_ring.jpg'
            },
        },
        { name: 'Uranus', realSize: 0.0365 * 5, abstractSize: 0.0365 * 5 * 5, texture: textures.uranus, distance: 50, orbitalPeriod: 30688.5, rotationPeriod: -17.24 },
        { name: 'Neptune', realSize: 0.0354 * 5, abstractSize: 0.0354 * 5 * 5, texture: textures.neptune, distance: 60, orbitalPeriod: 60182.0, rotationPeriod: 16.11 },
    ];

    const planets = [];

    planetsData.forEach(data => {
        const size = mode === 'abstract' && data.name !== 'Sun' ? data.abstractSize : data.realSize;
    
        // Cria a geometria do planeta
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        

        // Material com textura e brilho
        const material = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(data.texture), // Textura do Sol
        emissive: data.name === 'Sun' ? new THREE.Color(0xffcc00) : new THREE.Color(0x000000), // Luz emitida pelo Sol
        emissiveMap: data.name === 'Sun' ? new THREE.TextureLoader().load(data.texture) : null, // Aplica a textura no brilho
        emissiveIntensity: data.name === 'Sun' ? 1 : 0, // Intensidade do brilho
        roughness: 1, // Rugosidade
        metalness: 0, // Sem brilho metálico
        });
    
        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);
    
        // Adiciona o Sol como fonte de luz
        if (data.name !== 'Sun') { // Criar órbitas para todos os planetas, exceto o Sol
            const segments = 128;
            const orbitVertices = [];
        
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2; // Ângulo ao longo do círculo
                const x = data.distance * Math.cos(theta); // Coordenada X
                const z = data.distance * Math.sin(theta); // Coordenada Z
                orbitVertices.push(x, 0, z); // Adicionar pontos no plano XZ (y = 0)
            }
        
            const orbitGeometry = new THREE.BufferGeometry();
            orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
        
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5, // Deixe as órbitas semitransparentes
            });
        
            const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
            orbit.rotation.x = 0; 
            orbit.visible = true; //Orbitas Inicialmente invisíveis
            scene.add(orbit);
        
            orbits.push(orbit);
        }
        
                    
            // Adiciona um "halo" de luz ao Sol
            const haloMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.1,
            });
            const haloGeometry = new THREE.SphereGeometry(size * 1.02, 32, 32); // Um pouco maior que o Sol
            const halo = new THREE.Mesh(haloGeometry, haloMaterial);
            planet.add(halo);
        
            if (data.moons) {
                data.moons.forEach((moonData) => {
                    createMoon(planet, moonData, mode); // Utiliza a função do módulo moons.js
                });
            }
    
        // Adicionar anéis, se existirem
        if (data.ring) {
            const innerRadius = mode === 'abstract' ? data.ring.abstractInnerRadius : data.ring.innerRadius;
            const outerRadius = mode === 'abstract' ? data.ring.abstractOuterRadius : data.ring.outerRadius;

            // Criar a geometria e o material do anel
            const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(data.ring.texture),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2; // Inclinar o anel no eixo X
            ring.rotation.z = THREE.MathUtils.degToRad(26.7); // Inclinação específica para Saturno

            // Criar um grupo para o anel
            const ringGroup = new THREE.Group();
            ringGroup.add(ring); // Adicionar o anel ao grupo
            ringGroup.position.set(0, 0, 0); // Centraliza o grupo no planeta
            planet.add(ringGroup); // Adiciona o grupo ao planeta

        }

        // Armazena o planeta
        planets.push({
            mesh: planet,
            data,
            update: (speed, rotationMultiplier) => {
                if (planet && data.rotationPeriod !== 0) {
                    const rotationSpeed = (2 * Math.PI) / (data.rotationPeriod * 3600);
                    planet.rotation.y += speed * rotationSpeed * rotationMultiplier;
                }
            },
        });
    });


    return planets;
}

export function togglePlanetSizes(scene, planets, mode) {
    // Remove planetas com tamanhos reais
    planets.forEach(planet => {
        scene.remove(planet.mesh);
    });

    // Recria planetas com o modo atualizado
    return createPlanets(scene, mode);
}

export function updatePlanetOrbits(planets, time) {
    planets.forEach((planet) => {
        if (planet.data.name !== 'Sun') {
            const angularSpeed = (2 * Math.PI) / planet.data.orbitalPeriod; // Velocidade angular (orbital)
            const angle = time * angularSpeed; // Ângulo atual da órbita

            // Atualiza posição orbital do planeta em relação ao Sol
            planet.mesh.position.x = planet.data.distance * Math.cos(angle);
            planet.mesh.position.z = planet.data.distance * Math.sin(angle);
        }

        // Atualiza luas
        if (planet.data.moons) {
            planet.mesh.children.forEach((moon) => {
                if (moon.userData) {
                    moon.userData.angle += moon.userData.speed; // Atualiza ângulo
                    moon.position.x = Math.cos(moon.userData.angle) * moon.userData.distance;
                    moon.position.z = Math.sin(moon.userData.angle) * moon.userData.distance;
                }
            });
        }
    });
}

export function toggleOrbitsVisibility() {
    const areOrbitsVisible = orbits.length > 0 && orbits[0].visible;
    orbits.forEach(orbit => orbit.visible = !areOrbitsVisible);
}

