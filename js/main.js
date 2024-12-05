import * as dat from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm';
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { createPlanets, toggleOrbitsVisibility, togglePlanetSizes, updatePlanetOrbits } from './planets.js';
import { createAsteroidBelt, createBackgroundStars } from './stars.js';

let scene, camera, renderer, controls;
let planets = [];
let mode = 'abstract'; // Modo inicial
let globalSpeed = 1;
let rotationMultiplier = 10; // Escala inicial da rotação própria
let currentStarCount = 10000; // Quantidade inicial de estrelas
let time = 0;

function init() {

    // Configuração básica
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 50);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Configurar o canvas para ocupar toda a janela
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';

    // Ajustar o tamanho do renderizador ao redimensionar a janela
    window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Atualiza a proporção da câmera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Ajusta o tamanho do renderizador
    renderer.setSize(width, height);
    });

    // Adiciona luz ambiente fraca
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Suaviza sombras
    scene.add(ambientLight);

    // Adiciona controles de órbita
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.enablePan = false;

    // Cria planetas no modo inicial
    planets = createPlanets(scene, mode);

    // Configura luz do Sol
    createSunLight(scene);

    // Cria estrelas de fundo
    createBackgroundStars(scene, currentStarCount);

    // Cria cinturão de asteroides
    createAsteroidBelt(scene);

    // Configura o GUI
    setupGUI();

    animate();
    
}

function animate() {
    requestAnimationFrame(animate);

    // Incrementa tempo para órbitas com base na velocidade global
    time += 0.1 * globalSpeed;

    // Atualiza órbitas dos planetas
    updatePlanetOrbits(planets, time);

    // Atualiza rotações dos planetas com a escala ajustada
    planets.forEach(planet => planet.update(globalSpeed, rotationMultiplier));

    renderer.render(scene, camera);
}

function createSunLight(scene) {
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000); // Luz branca, intensidade 1.5
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

function setupGUI() {
    const gui = new dat.GUI();

    // Controle de Velocidade
    gui.add({ speed: globalSpeed }, 'speed', 0.1, 5, 0.1)
        .name('Velocidade')
        .onChange((value) => {
            globalSpeed = value;
            rotationMultiplier = value * 10; // Ajusta o multiplicador de rotação
        });

    // Controle de Estrelas
    gui.add({ stars: currentStarCount }, 'stars', 1000, 10000, 1000)
        .name('Estrelas')
        .onChange((value) => {
            if (value !== currentStarCount) {
                currentStarCount = value;
                createBackgroundStars(scene, currentStarCount); // Atualiza estrelas
            }
        });

    // Controle de Modo Abstrato/Realista
    gui.add({ mode: 'Modo Abstrato' }, 'mode', ['Modo Abstrato', 'Modo Realista'])
        .name('Modo de Visualização')
        .onChange((value) => {
            mode = value === 'Modo Realista' ? 'realistic' : 'abstract';
            planets = togglePlanetSizes(scene, planets, mode); // Atualiza planetas
        });

    // Controle para Órbitas
    gui.add({ showOrbits: true }, 'showOrbits')
        .name('Mostrar Órbitas')
        .onChange(() => {
            toggleOrbitsVisibility();
        });
        
}



init();
