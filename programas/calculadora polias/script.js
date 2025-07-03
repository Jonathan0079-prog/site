document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const dom = {};
    const ids = [
        'rpmMotor', 'potenciaMotor', 'tipoCorreia', 'diametroMotora', 'diametroMovida', 'distanciaEixos',
        'fatorServico',
        'calcularBtn', 'resetBtn', 'printBtn', 'modeDirectBtn', 'modeReverseBtn', 'optimizeBtn',
        'revRpmMotor', 'revRpmFinal', 'revPotenciaMotor', 'revFatorServico',
        'projectName', 'saveProjectBtn', 'projectList',
        'importBtn', 'exportBtn', 'fileInput', 'compareProject1', 'compareProject2', 'compareBtn',
        'failureType', 'diagnosisResult', 'direct-calculation-module', 'reverse-calculation-module',
        'direct-results-container', 'reverse-results-container', 'comparison-results-container', 'solutionsTable',
        'comparisonTable', 'resultadoCorreia', 'resultadoNumCorreias', 'resultadoRpm', 'resultadoRelacao',
        'resultadoVelocidade', 'resultadoAngulo', 'resultadoForca', 'resultadoFrequencia', 'velocidadeCorreiaCard',
        'anguloAbracamentoCard', 'forcaEixoCard', 'frequenciaVibracaoCard', 'customModal',
        'modalMessage', 'modalConfirmBtn', 'modalCancelBtn', 'dicasLista', 'tips-card',
        'diagram-card', 'transmissionDiagram', 'pulley1', 'pulley2', 'beltPath', 'centerLine', 'pulley1_text', 'pulley2_text'
    ];
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) dom[id] = element;
    });

    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;
    let currentMode = 'direct';

    // --- ESTADO DO FORMULÁRIO (localStorage) ---
    const formStateKey = 'transmissionFormState';
    const formInputIds = [
        'rpmMotor', 'potenciaMotor', 'fatorServico', 'tipoCorreia', 'diametroMotora', 'diametroMovida', 'distanciaEixos',
        'revRpmMotor', 'revRpmFinal', 'revPotenciaMotor', 'revFatorServico'
    ];
    
    function saveFormState() { /* ... código completo ... */ }
    function loadFormState() { /* ... código completo ... */ }

    // --- LÓGICA DE CÁLCULO ---
    function performCalculations(params) {
        const { name, rpm, power, fs, d1, d2, c, profile } = params;
        if ([rpm, power, fs, d1, d2, c, profile].some(p => p === null || p === undefined || (typeof p === 'number' && p <= 0) || p === '')) return null;

        const designPower = power * fs;
        const ratio = d2 / d1;
        const powerTable = DB.powerTables[profile];
        if (!powerTable) return null;

        const nominalBeltPower = (DB.powerTables[profile].baseHp * (rpm / 1750)) + ((ratio > 1) ? ((ratio - 1) * DB.powerTables[profile].ratioFactor) : 0);
        const L = 2 * c + (Math.PI * (d1 + d2) / 2) + (Math.pow(d2 - d1, 2) / (4 * c));
        const angle = 180 - 2 * Math.asin((d2 - d1) / (2 * c)) * (180 / Math.PI);
        const Ka = (angle < 180) ? 1 - (0.003 * (180 - angle)) : 1.0;
        const beltLengths = DB.belts[profile];
        const avgLength = beltLengths.reduce((a, b) => a + b, 0) / beltLengths.length;
        let Kl = DB.lengthFactors[profile].m;
        if (L < avgLength * 0.75) Kl = DB.lengthFactors[profile].s; else if (L > avgLength * 1.25) Kl = DB.lengthFactors[profile].l;
        const correctedBeltPower = nominalBeltPower * Ka * Kl;
        if(correctedBeltPower <= 0) return null;
        const numBelts = Math.ceil(designPower / correctedBeltPower);
        const beltSpeed = (d1 * rpm * Math.PI) / 60000;
        if(beltSpeed <= 0) return null;
        const shaftLoad = (2 * (designPower * 735.5) / beltSpeed * numBelts) / 9.81;
        
        return {
            name: name || 'Projeto Atual', rpm, power, fs, designPower, profile, d1, d2, c,
            rpmFinal: rpm * (d1 / d2),
            ratio, L, beltSpeed, angle, numBelts, shaftLoad,
            vibrationFreq: (1 / (2 * c / 1000)) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]),
            bestFitBelt: findBestFit(L, beltLengths),
            beltName: `${profile}${Math.round(findBestFit(L, beltLengths) / 25.4)}0`
        };
    }

    // --- LÓGICA DOS MÓDULOS ---
    function runDirectCalculation() { /* ... código completo ... */ }

    function runReverseOptimization() {
        if (!validateInputs(false)) { showModal('Por favor, corrija os campos inválidos.'); return; }
        const rpmMotor = parseFloat(dom.revRpmMotor.value);
        const targetRpm = parseFloat(dom.revRpmFinal.value);
        const power = parseFloat(dom.revPotenciaMotor.value);
        const fs = parseFloat(dom.revFatorServico.value);
        const tolerance = 0.05;
        let solutions = [];

        Object.keys(DB.pulleys).forEach(profile => {
            DB.pulleys[profile].forEach(d1 => {
                const targetD2 = d1 * (rpmMotor / targetRpm);
                const d2 = findBestFit(targetD2, DB.pulleys[profile]);
                if (d2 <= d1) return;
                const rpmFinal = rpmMotor * (d1 / d2);

                if (Math.abs(rpmFinal - targetRpm) / targetRpm <= tolerance) {
                    const c = 2 * (d1 + d2);
                    const results = performCalculations({ name: 'Solução Otimizada', rpm: rpmMotor, power, fs, d1, d2, c, profile });
                    if (results && results.angle >= 120) {
                        const cost = (d1 + d2) * DB.costs.pulley + results.bestFitBelt * DB.costs.belt;
                        solutions.push({ ...results, cost });
                    }
                }
            });
        });

        solutions.sort((a, b) => a.cost - b.cost);
        displayOptimizationResults(solutions.slice(0, 50));
        setMode('reverse');
    }

    // --- FUNÇÕES DE SETUP E EVENTOS (CORRIGIDA) ---
    function setupEventListeners() {
        // Eventos de troca de modo
        dom.modeDirectBtn.addEventListener('click', () => { setMode('direct'); saveFormState(); });
        dom.modeReverseBtn.addEventListener('click', () => { setMode('reverse'); saveFormState(); });

        // Eventos de botões de ação
        dom.calcularBtn.addEventListener('click', runDirectCalculation);
        dom.optimizeBtn.addEventListener('click', runReverseOptimization); // Conexão corrigida
        dom.resetBtn.addEventListener('click', resetForm);
        dom.printBtn.addEventListener('click', () => window.print());
        dom.saveProjectBtn.addEventListener('click', saveProject);
        dom.compareBtn.addEventListener('click', runComparison);
        dom.importBtn.addEventListener('click', importProjects);
        dom.exportBtn.addEventListener('click', exportProjects);

        // Eventos de formulário
        formInputIds.forEach(id => { if (dom[id]) dom[id].addEventListener('change', saveFormState); });
        dom.tipoCorreia.addEventListener('change', updatePulleySelects);
        dom.diametroMotora.addEventListener('change', suggestDistance);
        dom.diametroMovida.addEventListener('change', suggestDistance);
        dom.failureType.addEventListener('change', runDiagnosis);
        dom.fileInput.addEventListener('change', handleFileSelect);
        
        // Eventos da lista de projetos e tabelas
        dom.projectList.addEventListener('click', handleProjectListClick);
        dom.solutionsTable.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                const sol = JSON.parse(e.target.dataset.solution);
                loadSolutionIntoDirectForm(sol);
            }
        });

        // Eventos do Modal e outros
        dom.modalConfirmBtn.addEventListener('click', () => { if (modalCallback) modalCallback(); hideModal(); });
        dom.modalCancelBtn.addEventListener('click', hideModal);
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => input.classList.remove('invalid'));
        });
    }

    // --- O RESTANTE DAS FUNÇÕES ---
    // (Todas as outras funções como 'runComparison', 'updateDirectResultsUI', 'drawDiagram', etc. continuam aqui, completas)
    // ...
    // (O código é muito longo para ser repetido, mas esta seção representa todas as outras funções que já estavam corretas)
    
    function init() {
        populateBeltProfileSelect();
        //...
        setupEventListeners(); // Agora a versão completa e correta será chamada
        //...
    }
    
    init();
});
