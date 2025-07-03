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
        'modalMessage', 'modalConfirmBtn', 'modalCancelBtn', 'dicasLista', 'tips-card'
    ];
    ids.forEach(id => dom[id] = document.getElementById(id));

    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;

    // --- LÓGICA DE CÁLCULO (SEM ALTERAÇÕES NESTE PASSO) ---
    function performCalculations(params) {
        const { name, rpm, power, fs, d1, d2, c, profile } = params;
        if ([rpm, power, fs, d1, d2, c, profile].some(p => p === null || p === undefined || (typeof p === 'number' && p <= 0) || p === '')) return null;

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
        
        const numBelts = Math.ceil(designPower / correctedPower);
        const shaftLoad = (2 * (designPower * 735.5 / beltSpeed) * numBelts) / 9.81;
        const vibrationFreq = (1 / (2 * (c / 1000))) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]);

        const bestFitBelt = findBestFit(L, beltLengths);
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;
        
        return { name: name || 'Projeto Atual', rpm, power, fs, designPower, profile, d1, d2, c, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName, bestFitBelt };
    }

    // --- LÓGICA DOS MÓDULOS (SEM ALTERAÇÕES NESTE PASSO) ---
    // ... runDirectCalculation, runReverseOptimization, etc ...

    // --- ATUALIZAÇÃO DA UI ---
    
    // ... setMode, updateDirectResultsUI, etc ...
    
    function populateSelect(selectElement, options, isObject = false) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = '';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = isObject ? opt.value : opt;
            option.textContent = isObject ? opt.text : (opt + ' mm'); // Adiciona ' mm' para polias
            selectElement.appendChild(option);
        });
        if (Array.from(selectElement.options).some(opt => opt.value == currentValue)) {
            selectElement.value = currentValue;
        }
    }

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
            if(selectElement.querySelector('option[value="1.2"]')) {
                selectElement.value = '1.2';
            }
        });
    }

    function populateBeltProfileSelect() {
        // Altera a função populateSelect para não adicionar ' mm' no final
        const selectElement = dom.tipoCorreia;
        selectElement.innerHTML = '';
        Object.keys(DB.pulleys).forEach(opt => {
             const option = document.createElement('option');
             option.value = opt;
             option.textContent = opt;
             selectElement.appendChild(option);
        });
    }
    
    // FUNÇÃO NOVA PARA POPULAR OS SELETORES DE POLIA
    function updatePulleySelects() {
        const profile = dom.tipoCorreia.value;
        if (!profile || !DB.pulleys[profile]) return;

        const pulleySizes = DB.pulleys[profile];
        // Usamos a função 'populateSelect' que já tínhamos!
        populateSelect(dom.diametroMotora, pulleySizes);
        populateSelect(dom.diametroMovida, pulleySizes);

        // Define um valor padrão para a polia movida, se possível um maior que a motora
        if (dom.diametroMotora.options.length > 1) {
            dom.diametroMotora.selectedIndex = Math.floor(dom.diametroMotora.options.length / 4); // Pega uma polia menor
        }
        if (dom.diametroMovida.options.length > 1) {
             dom.diametroMovida.selectedIndex = Math.floor(dom.diametroMovida.options.length / 2); // Pega uma polia intermediária
        }
        // Sugere a distância inicial
        suggestDistance();
    }
    
    // ... O resto das funções (import/export, modal, etc.) continua igual ...

    // --- FUNÇÕES DE SETUP E EVENTOS (ATUALIZADA) ---
    function setupEventListeners() {
        dom.modeDirectBtn.addEventListener('click', () => setMode('direct'));
        dom.modeReverseBtn.addEventListener('click', () => setMode('reverse'));
        dom.calcularBtn.addEventListener('click', runDirectCalculation);
        dom.optimizeBtn.addEventListener('click', runReverseOptimization);
        dom.resetBtn.addEventListener('click', resetForm);
        dom.printBtn.addEventListener('click', () => window.print());
        
        // EVENTOS ATUALIZADOS/ADICIONADOS
        dom.tipoCorreia.addEventListener('change', updatePulleySelects); // <-- NOVO EVENTO
        dom.diametroMotora.addEventListener('change', suggestDistance);
        dom.diametroMovida.addEventListener('change', suggestDistance);

        dom.saveProjectBtn.addEventListener('click', saveProject);
        // ... resto dos eventos ...
    }

    function resetForm() {
        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        
        // Lógica de reset atualizada
        populateBeltProfileSelect();
        populateServiceFactorSelects();
        updatePulleySelects(); // <-- Adicionado aqui para resetar as polias
        
        const resultFields = ['resultadoRpm', 'resultadoRelacao', 'resultadoCorreia', 'resultadoNumCorreias', 'resultadoVelocidade', 'resultadoAngulo', 'resultadoForca', 'resultadoFrequencia'];
        resultFields.forEach(id => dom[id] ? dom[id].textContent = '--' : null);
        
        const resultCards = ['velocidadeCorreiaCard', 'anguloAbracamentoCard', 'forcaEixoCard', 'frequenciaVibracaoCard'];
        resultCards.forEach(id => dom[id] ? dom[id].classList.remove('warning', 'danger') : null);
        
        dom.dicasLista.innerHTML = '<li>Preencha os dados e clique em "Calcular".</li>';
        currentResults = {};
    }

    // --- FUNÇÃO DE INICIALIZAÇÃO (ATUALIZADA) ---
    function init() {
        setupEventListeners();
        populateBeltProfileSelect();
        populateServiceFactorSelects();
        updatePulleySelects(); // <-- Adicionado aqui para popular na inicialização
        loadProjects();
        // resetForm(); // O reset já é chamado pelas funções acima
    }

    init();

    // Restante do seu script... (todas as outras funções que não foram alteradas)
    // runDirectCalculation, runReverseOptimization, runDiagnosis, runComparison
    // setMode, updateDirectResultsUI, displayOptimizationResults
    // exportProjects, importProjects, handleFileSelect
    // showModal, hideModal
    // validateInputs, suggestDistance, saveProject, loadProjects, handleProjectListClick
    // loadSolutionIntoDirectForm, findBestFit, updateCardStatus, generateTips
});
