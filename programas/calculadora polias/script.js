document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const dom = {};
    // IDS NOVOS ADICIONADOS
    const ids = [
        'rpmMotor', 'potenciaMotor', 'tipoCorreia', 'diametroMotora', 'diametroMovida', 'distanciaEixos',
        'fatorServico', // <-- NOVO
        'calcularBtn', 'resetBtn', 'printBtn', 'modeDirectBtn', 'modeReverseBtn', 'optimizeBtn',
        'revRpmMotor', 'revRpmFinal', 'revPotenciaMotor', 'revFatorServico', // <-- NOVO
        'projectName', 'saveProjectBtn', 'projectList',
        'importBtn', 'exportBtn', 'fileInput', 'compareProject1', 'compareProject2', 'compareBtn',
        'failureType', 'diagnosisResult', 'direct-calculation-module', 'reverse-calculation-module',
        'direct-results-container', 'reverse-results-container', 'comparison-results-container', 'solutionsTable',
        'comparisonTable', 'resultadoCorreia', 'resultadoNumCorreias', 'resultadoRpm', 'resultadoRelacao',
        'resultadoVelocidade', 'resultadoAngulo', 'resultadoForca', 'resultadoFrequencia', 'velocidadeCorreiaCard',
        'anguloAbracamentoCard', 'forcaEixoCard', 'frequenciaVibracaoCard', 'customModal',
        'modalMessage', 'modalConfirmBtn', 'modalCancelBtn', 'dicasLista', 'tips-card'
    ];
    ids.forEach(id => dom[id] = document.getElementById(id));

    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;

    // --- LÓGICA DE CÁLCULO (ATUALIZADA) ---
    function performCalculations(params) {
        // 'fs' (Fator de Serviço) foi adicionado aos parâmetros
        const { name, rpm, power, fs, d1, d2, c, profile } = params;
        if ([rpm, power, fs, d1, d2, c, profile].some(p => p === null || p === undefined || (typeof p === 'number' && p <= 0))) return null;

        // 1. CALCULAR A POTÊNCIA DE PROJETO
        const designPower = power * fs;

        const rpmFinal = rpm * (d1 / d2);
        const ratio = d2 / d1;
        const L = 2 * c + (Math.PI * (d1 + d2) / 2) + (Math.pow(d2 - d1, 2) / (4 * c));
        const beltSpeed = (d1 * rpm * Math.PI) / (60 * 1000);
        const angle = 180 - 2 * Math.asin((d2 - d1) / (2 * c)) * (180 / Math.PI);

        let Ka = (angle < 180) ? 1 - (0.003 * (180 - angle)) : 1.0;
        const beltLengths = DB.belts[profile];
        const avgLength = beltLengths.reduce((a, b) => a + b, 0) / beltLengths.length;
        let Kl = DB.lengthFactors[profile].m;
        if (L < avgLength * 0.75) Kl = DB.lengthFactors[profile].s;
        else if (L > avgLength * 1.25) Kl = DB.lengthFactors[profile].l;
        const correctedPower = DB.basePower[profile] * Ka * Kl;
        
        // 2. USAR A POTÊNCIA DE PROJETO PARA CALCULAR O NÚMERO DE CORREIAS
        const numBelts = Math.ceil(designPower / correctedPower);

        // 3. USAR A POTÊNCIA DE PROJETO PARA CALCULAR A CARGA NO EIXO
        const shaftLoad = (2 * (designPower * 735.5 / beltSpeed) * numBelts) / 9.81;
        const vibrationFreq = (1 / (2 * (c / 1000))) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]);

        const bestFitBelt = findBestFit(L, beltLengths);
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;

        // Retornar os novos dados também
        return { name: name || 'Projeto Atual', rpm, power, fs, designPower, profile, d1, d2, c, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName, bestFitBelt };
    }

    // --- LÓGICA DOS MÓDULOS (ATUALIZADA) ---
    function runDirectCalculation() {
        if (!validateInputs(true)) { showModal('Por favor, corrija os campos inválidos.'); return; }
        const params = {
            rpm: parseFloat(dom.rpmMotor.value),
            power: parseFloat(dom.potenciaMotor.value),
            fs: parseFloat(dom.fatorServico.value), // <-- NOVO
            d1: parseFloat(dom.diametroMotora.value),
            d2: parseFloat(dom.diametroMovida.value),
            c: parseFloat(dom.distanciaEixos.value),
            profile: dom.tipoCorreia.value
        };
        currentResults = performCalculations(params);
        if (currentResults) {
            updateDirectResultsUI(currentResults);
        }
    }

    function runReverseOptimization() {
        if (!validateInputs(false)) { showModal('Por favor, corrija os campos inválidos.'); return; }
        const rpmMotor = parseFloat(dom.revRpmMotor.value);
        const targetRpm = parseFloat(dom.revRpmFinal.value);
        const power = parseFloat(dom.revPotenciaMotor.value);
        const fs = parseFloat(dom.revFatorServico.value); // <-- NOVO
        const tolerance = 0.05;
        let solutions = [];

        Object.keys(DB.pulleys).forEach(profile => {
            DB.pulleys[profile].forEach(d1 => {
                const targetD2 = d1 * (rpmMotor / targetRpm);
                const d2 = findBestFit(targetD2, DB.pulleys[profile]);
                const rpmFinal = rpmMotor * (d1 / d2);

                if (Math.abs(rpmFinal - targetRpm) / targetRpm <= tolerance) {
                    const c = 2 * (d1 + d2);
                    // Passando o 'fs' para o cálculo
                    const results = performCalculations({ rpm: rpmMotor, power, fs, d1, d2, c, profile });
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

    //... As funções runDiagnosis e runComparison continuam iguais por enquanto ...
    // ... mas runComparison vai se beneficiar da mudança no 'performCalculations' automaticamente!
    
    // --- ATUALIZAÇÃO DA UI (SEM MUDANÇAS VISÍVEIS DIRETAS, MAS USA OS NOVOS DADOS) ---

    // --- FUNÇÃO NOVA PARA POPULAR OS SELECTS DE FATOR DE SERVIÇO ---
    function populateServiceFactorSelects() {
        const selects = [dom.fatorServico, dom.revFatorServico];
        selects.forEach(selectElement => {
            if (!selectElement) return;
            selectElement.innerHTML = '';
            for (const key in DB.serviceFactors) {
                const factor = DB.serviceFactors[key];
                const option = document.createElement('option');
                option.value = factor.value;
                option.textContent = `FS ${factor.value} - ${factor.text}`;
                selectElement.appendChild(option);
            }
            // Definir um valor padrão, por exemplo, o de Serviço Normal
            if(selectElement.querySelector('option[value="1.2"]')) {
                selectElement.value = '1.2';
            }
        });
    }

    function populateBeltProfileSelect() {
        populateSelect(dom.tipoCorreia, Object.keys(DB.pulleys));
    }

    // ... O resto do script (import/export, modal, eventos, etc.) continua o mesmo ...

    // --- FUNÇÃO DE INICIALIZAÇÃO (ATUALIZADA) ---
    function init() {
        setupEventListeners();
        populateBeltProfileSelect();
        populateServiceFactorSelects(); // <-- CHAMADA DA NOVA FUNÇÃO
        loadProjects();
        resetForm();
    }

    init();
});
