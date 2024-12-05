import * as dat from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm';

export function setupControls(scene, { onSpeedChange, onStarChange }) {
    // Cria uma GUI
    const gui = new dat.GUI();

    // Configuração dos controles
    const controls = {
        speed: 1, // Valor inicial da velocidade
        stars: 500, // Valor inicial do número de estrelas
    };

    // Adiciona controle para a velocidade
    gui.add(controls, 'speed', 0.1, 5, 0.1)
        .name('Velocidade')
        .onChange((value) => {
            onSpeedChange(value); // Atualizar a velocidade
        });

    // Adiciona controle para o número de estrelas
    gui.add(controls, 'stars', 1000, 10000, 1000)
        .name('Estrelas')
        .onChange((value) => {
            onStarChange(value); // Atualiza o número de estrelas 
        });
}
