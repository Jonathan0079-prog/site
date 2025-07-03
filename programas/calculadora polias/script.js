document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const dom = {};
    const ids = [
        // ... todos os IDs anteriores ...
        'dicasLista', 'tips-card',
        // IDs NOVOS PARA O DIAGRAMA
        'diagram-card', 'pulley1', 'pulley2', 'beltPath', 'centerLine', 'pulley1_text', 'pulley2_text'
    ];
    ids.forEach(id => dom[id] = document.getElementById(id));

    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;

    // --- LÓGICA DE CÁLCULO (SEM ALTERAÇÕES) ---
    function performCalculations(params) { /* ... */ }

    // --- LÓGICA DOS MÓDULOS ---
    function runDirectCalculation() {
        if (!validateInputs(true)) { showModal('Por favor, corrija os campos inválidos.'); return; }
        const params = {
            rpm: parseFloat(dom.rpmMotor.value),
            power: parseFloat(dom.potenciaMotor.value),
            fs: parseFloat(dom.fatorServico.value),
            d1: parseFloat(dom.diametroMotora.value),
            d2: parseFloat(dom.diametroMovida.value),
            c: parseFloat(dom.distanciaEixos.value),
            profile: dom.tipoCorreia.value
        };
        currentResults = performCalculations(params);
        if (currentResults) {
            updateDirectResultsUI(currentResults);
            drawDiagram(currentResults); // <-- CHAMADA PARA DESENHAR O DIAGRAMA
        }
    }
    // ... outras funções de módulos ...

    // --- ATUALIZAÇÃO DA UI ---
    function updateDirectResultsUI(results) { /* ... */ }

    // =======================================================
    // --- NOVA SEÇÃO: LÓGICA DO DIAGRAMA ---
    // =======================================================
    function drawDiagram(results) {
        const { d1, d2, c } = results;
        if (!d1 || !d2 || !c) return;
        
        dom['diagram-card'].style.display = 'block';

        const svgWidth = 800;
        const svgHeight = 300;
        const padding = 50;

        // Escala: (largura total do sistema) -> (largura do SVG - paddings)
        const totalWidth = d1 / 2 + c + d2 / 2;
        const scale = (svgWidth - padding * 2) / totalWidth;

        const r1 = (d1 / 2) * scale;
        const r2 = (d2 / 2) * scale;
        const c_scaled = c * scale;

        const cy = svgHeight / 2;
        const cx1 = padding + r1;
        const cx2 = cx1 + c_scaled;
        
        // Atualiza polias
        dom.pulley1.setAttribute('r', r1);
        dom.pulley1.setAttribute('cx', cx1);
        dom.pulley1.setAttribute('cy', cy);

        dom.pulley2.setAttribute('r', r2);
        dom.pulley2.setAttribute('cx', cx2);
        dom.pulley2.setAttribute('cy', cy);

        // Atualiza textos
        dom.pulley1_text.setAttribute('x', cx1);
        dom.pulley1_text.setAttribute('y', cy + 5);
        dom.pulley1_text.textContent = `${d1}mm`;
        
        dom.pulley2_text.setAttribute('x', cx2);
        dom.pulley2_text.setAttribute('y', cy + 5);
        dom.pulley2_text.textContent = `${d2}mm`;

        // Lógica da Correia (Trigonometria)
        const delta_r = r2 - r1;
        const alpha = Math.asin(delta_r / c_scaled);

        // Pontos de tangência na polia 1 (motora)
        const p1_x1 = cx1 + r1 * Math.sin(alpha);
        const p1_y1 = cy - r1 * Math.cos(alpha);
        const p1_x2 = cx1 - r1 * Math.sin(alpha);
        const p1_y2 = cy + r1 * Math.cos(alpha);

        // Pontos de tangência na polia 2 (movida)
        const p2_x1 = cx2 + r2 * Math.sin(alpha);
        const p2_y1 = cy - r2 * Math.cos(alpha);
        const p2_x2 = cx2 - r2 * Math.sin(alpha);
        const p2_y2 = cy + r2 * Math.cos(alpha);

        // Grande arco na polia 2 (movida)
        const largeArcFlag = (Math.PI - 2 * alpha) > Math.PI ? 1 : 0;
        
        // Monta o caminho (path) do SVG para a correia
        const pathData = [
            `M ${p1_x1} ${p1_y1}`, // Ponto de partida
            `L ${p2_x1} ${p2_y1}`, // Linha reta superior
            `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${p2_x2} ${p2_y2}`, // Arco na polia 2
            `L ${p1_x2} ${p1_y2}`, // Linha reta inferior
            `A ${r1} ${r1} 0 ${largeArcFlag} 1 ${p1_x1} ${p1_y1}`, // Arco na polia 1
        ].join(' ');

        dom.beltPath.setAttribute('d', pathData);
        
        // Atualiza linha de centro
        dom.centerLine.setAttribute('x1', cx1);
        dom.centerLine.setAttribute('x2', cx2);
    }

    function resetDiagram() {
        if(dom['diagram-card']) {
            dom['diagram-card'].style.display = 'none';
        }
    }

    // ... restante das funções de UI ...

    // --- FUNÇÕES DE SETUP E EVENTOS ---
    function setupEventListeners() { /* ... */ }

    function resetForm() {
        // ... código do resetForm ...
        resetDiagram(); // <-- CHAMADA PARA ESCONDER O DIAGRAMA
        // ... resto do código ...
    }

    function init() { /* ... */ }

    init();
});
