document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const dom = {};
    const ids = [
        // ... (lista de ids continua a mesma) ...
        'diagram-card', 'pulley1', 'pulley2', 'beltPath', 'centerLine', 'pulley1_text', 'pulley2_text'
    ];
    ids.forEach(id => dom[id] = document.getElementById(id));

    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;
    let currentMode = 'direct'; // Variável para rastrear o modo atual

    // =======================================================
    // --- NOVA SEÇÃO: ESTADO DO FORMULÁRIO (localStorage) ---
    // =======================================================
    const formStateKey = 'transmissionFormState';
    const formInputIds = [
        'rpmMotor', 'potenciaMotor', 'fatorServico', 'tipoCorreia', 'diametroMotora', 'diametroMovida', 'distanciaEixos',
        'revRpmMotor', 'revRpmFinal', 'revPotenciaMotor', 'revFatorServico'
    ];
    
    function saveFormState() {
        const state = {
            mode: currentMode
        };
        formInputIds.forEach(id => {
            if (dom[id]) {
                state[id] = dom[id].value;
            }
        });
        localStorage.setItem(formStateKey, JSON.stringify(state));
    }

    function loadFormState() {
        const savedState = localStorage.getItem(formStateKey);
        if (!savedState) return;

        const state = JSON.parse(savedState);
        
        // Carrega os valores, mas segura os selects de polia
        formInputIds.forEach(id => {
            if (dom[id] && state[id] !== undefined && id !== 'diametroMotora' && id !== 'diametroMovida') {
                dom[id].value = state[id];
            }
        });
        
        // Define o modo de operação salvo
        setMode(state.mode || 'direct');
        
        // Agora que o perfil da correia foi carregado, atualiza as opções de polia
        updatePulleySelects();
        
        // E finalmente, define os valores salvos para as polias
        if(state.diametroMotora) dom.diametroMotora.value = state.diametroMotora;
        if(state.diametroMovida) dom.diametroMovida.value = state.diametroMovida;
    }

    // --- LÓGICA DE CÁLCULO (SEM ALTERAÇÕES) ---
    function performCalculations(params) { /* ... */ }

    // --- LÓGICA DOS MÓDULOS (SEM ALTERAÇÕES) ---
    function runDirectCalculation() { /* ... */ }
    function runReverseOptimization() { /* ... */ }
    function runDiagnosis() { /* ... */ }
    function runComparison() { /* ... */ }

    // --- ATUALIZAÇÃO DA UI ---
    function setMode(mode) {
        currentMode = mode; // Atualiza o estado do modo
        dom['direct-calculation-module'].style.display = mode === 'direct' ? 'block' : 'none';
        dom['reverse-calculation-module'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['direct-results-container'].style.display = mode === 'direct' ? 'block' : 'none';
        dom['reverse-results-container'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['comparison-results-container'].style.display = mode === 'compare' ? 'block' : 'none';
        dom['tips-card'].style.display = (mode === 'direct' || mode === 'reverse') ? 'block' : 'none';
        dom.modeDirectBtn.classList.toggle('active', mode === 'direct');
        dom.modeReverseBtn.classList.toggle('active', mode === 'reverse');
        resetDiagram(); // Reseta o diagrama ao trocar de modo
    }
    
    // ... (demais funções de UI e Diagrama) ...

    // --- FUNÇÕES DE SETUP E EVENTOS ---
    function setupEventListeners() {
        // Eventos para trocar de modo
        dom.modeDirectBtn.addEventListener('click', () => {
            setMode('direct');
            saveFormState(); // Salva o estado ao trocar de modo
        });
        dom.modeReverseBtn.addEventListener('click', () => {
            setMode('reverse');
            saveFormState(); // Salva o estado ao trocar de modo
        });

        // Eventos dos botões principais
        dom.calcularBtn.addEventListener('click', runDirectCalculation);
        dom.optimizeBtn.addEventListener('click', runReverseOptimization);
        dom.resetBtn.addEventListener('click', resetForm);
        // ... (outros eventos de botões) ...

        // Evento para salvar o estado em QUALQUER alteração de input ou select do formulário
        formInputIds.forEach(id => {
            if (dom[id]) {
                dom[id].addEventListener('change', saveFormState);
            }
        });

        // Eventos específicos que não foram cobertos acima
        dom.diametroMotora.addEventListener('change', suggestDistance);
        dom.diametroMovida.addEventListener('change', suggestDistance);
        dom.tipoCorreia.addEventListener('change', updatePulleySelects); 
        dom.failureType.addEventListener('change', runDiagnosis);
        // ... (resto dos eventos) ...
    }

    function resetForm() {
        // ... (código do resetForm) ...
        // Limpa também o estado salvo
        localStorage.removeItem(formStateKey);
    }
    
    // --- FUNÇÃO DE INICIALIZAÇÃO (ATUALIZADA) ---
    function init() {
        // Primeiro, popula os selects com as opções
        populateBeltProfileSelect();
        populateServiceFactorSelects();
        
        // Depois, carrega o estado salvo (que vai selecionar as opções corretas)
        loadFormState();
        
        // Configura todos os eventos
        setupEventListeners();
        
        // Carrega projetos salvos (localStorage de projetos)
        loadProjects();
    }

    init();
});
