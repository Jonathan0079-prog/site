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
        'diagram-card', 'transmissionDiagram', 'pulley1', 'pulley2', 'beltPath', 'centerLine', 'pulley1_text', 'pulley2_text',
        'results-card'
    ];
    // ATUALIZAÇÃO: Usando for...of para maior segurança e clareza.
    for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
            dom[id] = element;
        }
    }

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

    function saveFormState() {
        const state = { mode: currentMode };
        formInputIds.forEach(id => {
            if (dom[id]) state[id] = dom[id].value;
        });
        localStorage.setItem(formStateKey, JSON.stringify(state));
    }

    function loadFormState() {
        try {
            const savedState = JSON.parse(localStorage.getItem(formStateKey));
            if (savedState) {
                formInputIds.forEach(id => {
                    if (dom[id] && savedState[id]) {
                        dom[id].value = savedState[id];
                    }
                });
                setMode(savedState.mode || 'direct');
            } else {
                setMode('direct'); // Default mode
            }
        } catch (e) {
            console.error("Failed to load form state:", e);
            setMode('direct');
        }
    }
    
    function runComparison() {
        setMode('compare');
    }

    // --- ATUALIZAÇÃO DA UI ---
/**
 * Altera o modo de operação da interface (Cálculo Direto, Reverso, etc.).
 * @param {string} mode - O modo a ser ativado ('direct', 'reverse', 'compare').
 */
function setMode(mode) {
    currentMode = mode;
    // Esconde todos os módulos principais
    ['direct-calculation-module', 'reverse-calculation-module', 'reverse-results-container', 'comparison-results-container'].forEach(id => {
        if (dom[id]) dom[id].style.display = 'none';
    });
    // Mostra o módulo e o container de resultados do modo ativo
    if (dom[mode + '-calculation-module']) dom[mode + '-calculation-module'].style.display = 'block';
    if (dom[mode + '-results-container']) dom[mode + '-results-container'].style.display = 'block';

    // Controla a visibilidade dos cards de resultados e dicas
    if (dom['results-card']) dom['results-card'].style.display = (mode === 'direct' || mode === 'compare') ? 'block' : 'none';
    if (dom['tips-card']) dom['tips-card'].style.display = (mode === 'direct' || mode === 'reverse') ? 'block' : 'none';

    // Atualiza o estado visual dos botões de modo
    if (dom.modeDirectBtn) dom.modeDirectBtn.classList.toggle('active', mode === 'direct');
    if (dom.modeReverseBtn) dom.modeReverseBtn.classList.toggle('active', mode === 'reverse');
    
    // Reseta o diagrama se o modo não for o direto
    if (mode !== 'direct') resetDiagram();
}

/**
 * Atualiza os campos de resultado na interface do modo de cálculo direto.
 * @param {object} r - O objeto de resultados do cálculo.
 */
function updateDirectResultsUI(r) {
    if (!r) return;
    dom.resultadoRpm.textContent = r.rpmFinal.toFixed(0);
    dom.resultadoRelacao.textContent = r.ratio.toFixed(2);
    dom.resultadoCorreia.textContent = `${r.beltName} (${r.bestFitBelt.toFixed(0)} mm)`;
    dom.resultadoNumCorreias.textContent = r.numBelts;
    dom.resultadoVelocidade.textContent = r.beltSpeed.toFixed(2);
    dom.resultadoAngulo.textContent = r.angle.toFixed(1);
    dom.resultadoForca.textContent = r.shaftLoad.toFixed(2);
    dom.resultadoFrequencia.textContent = r.vibrationFreq.toFixed(1);

    updateCardStatus(dom.velocidadeCorreiaCard, r.beltSpeed, 30, 35, false);
    updateCardStatus(dom.anguloAbracamentoCard, r.angle, 120, 100, true);
}

/**
 * Exibe os resultados da otimização na tabela.
 * @param {Array<object>} solutions - Uma lista de soluções encontradas.
 */
function displayOptimizationResults(solutions) {
    const tbody = dom.solutionsTable.querySelector('tbody');
    tbody.innerHTML = '';
    if (solutions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhuma solução encontrada com os critérios definidos.</td></tr>';
        return;
    }
    solutions.forEach(sol => {
        const row = `<tr><td>${sol.profile}</td><td>${sol.d1} mm</td><td>${sol.d2} mm</td><td>${sol.beltName}</td><td>R$ ${sol.cost.toFixed(2)}</td><td><button class="action-button" data-solution='${JSON.stringify(sol)}'>Usar</button></td></tr>`;
        tbody.innerHTML += row;
    });
}

// --- DIAGRAMA ---

/**
 * Desenha ou atualiza o diagrama de transmissão SVG.
 * @param {object} r - O objeto de resultados contendo as dimensões (d1, d2, c).
 */
function drawDiagram(r) {
    if (!r || !dom.transmissionDiagram || r.d1 <= 0 || r.d2 <= 0 || r.c <= 0) {
        resetDiagram();
        return;
    }
    dom['diagram-card'].style.display = 'block';
    const w = 800, h = 300, p = 50; // Largura, Altura, Padding
    const scale = (w - p * 2) / (r.d1 / 2 + r.c + r.d2 / 2);
    const r1 = r.d1 / 2 * scale, r2 = r.d2 / 2 * scale, cs = r.c * scale;
    const cx1 = p + r1, cx2 = cx1 + cs, cy = h / 2;

    dom.pulley1.setAttribute('r', r1); dom.pulley1.setAttribute('cx', cx1); dom.pulley1.setAttribute('cy', cy);
    dom.pulley2.setAttribute('r', r2); dom.pulley2.setAttribute('cx', cx2); dom.pulley2.setAttribute('cy', cy);

    dom.pulley1_text.setAttribute('x', cx1); dom.pulley1_text.setAttribute('y', cy + 5); dom.pulley1_text.textContent = `${r.d1}mm`;
    dom.pulley2_text.setAttribute('x', cx2); dom.pulley2_text.setAttribute('y', cy + 5); dom.pulley2_text.textContent = `${r.d2}mm`;

    const alpha = Math.asin((r2 - r1) / cs);
    const p1x1 = cx1 + r1 * Math.sin(alpha), p1y1 = cy - r1 * Math.cos(alpha);
    const p1x2 = cx1 - r1 * Math.sin(alpha), p1y2 = cy + r1 * Math.cos(alpha);
    const p2x1 = cx2 + r2 * Math.sin(alpha), p2y1 = cy - r2 * Math.cos(alpha);
    const p2x2 = cx2 - r2 * Math.sin(alpha), p2y2 = cy + r2 * Math.cos(alpha);

    const largeArcFlag = Math.PI - 2 * alpha > Math.PI ? 1 : 0;
    dom.beltPath.setAttribute('d', `M ${p1x1} ${p1y1} L ${p2x1} ${p2y1} A ${r2} ${r2} 0 ${largeArcFlag} 1 ${p2x2} ${p2y2} L ${p1x2} ${p1y2} A ${r1} ${r1} 0 ${largeArcFlag} 1 ${p1x1} ${p1y1}`);
    dom.centerLine.setAttribute('x1', cx1); dom.centerLine.setAttribute('x2', cx2);
}

/**
 * Esconde o card do diagrama.
 */
function resetDiagram() {
    if (dom['diagram-card']) dom['diagram-card'].style.display = 'none';
}

// --- FUNÇÕES AUXILIARES E DE SETUP ---

/**
 * Popula um elemento <select> com opções.
 * @param {HTMLElement} el - O elemento <select>.
 * @param {Array} options - Os dados para as opções.
 * @param {Function} formatter - Uma função que formata cada opção em {value, text}.
 */
function populateSelect(el, options, formatter) {
    if (!el) return;
    const currentValue = el.value;
    el.innerHTML = '';
    options.forEach(optData => {
        const option = document.createElement('option');
        const formatted = formatter(optData);
        option.value = formatted.value;
        option.textContent = formatted.text;
        el.appendChild(option);
    });
    // Tenta restaurar o valor anterior, se ainda existir nas novas opções
    if ([...el.options].some(o => o.value == currentValue)) {
        el.value = currentValue;
    }
}

/**
 * Atualiza os selects de diâmetro de polia com base no perfil de correia selecionado.
 */
function updatePulleySelects() {
    const profile = dom.tipoCorreia.value;
    if (!profile || !DB.pulleys[profile]) return;
    const pulleySizes = DB.pulleys[profile];
    populateSelect(dom.diametroMotora, pulleySizes, (opt) => ({ value: opt, text: `${opt} mm` }));
    populateSelect(dom.diametroMovida, pulleySizes, (opt) => ({ value: opt, text: `${opt} mm` }));
}

/**
 * Configura todos os event listeners da aplicação.
 */
function setupEventListeners() {
    if (dom.modeDirectBtn) dom.modeDirectBtn.addEventListener('click', () => { setMode('direct'); saveFormState(); });
    if (dom.modeReverseBtn) dom.modeReverseBtn.addEventListener('click', () => { setMode('reverse'); saveFormState(); });

    if (dom.calcularBtn) dom.calcularBtn.addEventListener('click', runDirectCalculation);
    if (dom.optimizeBtn) dom.optimizeBtn.addEventListener('click', runReverseOptimization);
    if (dom.resetBtn) dom.resetBtn.addEventListener('click', resetForm);
    if (dom.printBtn) dom.printBtn.addEventListener('click', () => window.print());
    if (dom.saveProjectBtn) dom.saveProjectBtn.addEventListener('click', saveProject);
    if (dom.compareBtn) dom.compareBtn.addEventListener('click', runComparison);
    if (dom.importBtn) dom.importBtn.addEventListener('click', importProjects);
    if (dom.exportBtn) dom.exportBtn.addEventListener('click', exportProjects);

    formInputIds.forEach(id => { if (dom[id]) dom[id].addEventListener('change', saveFormState); });
    if (dom.tipoCorreia) dom.tipoCorreia.addEventListener('change', updatePulleySelects);
    if (dom.diametroMotora) dom.diametroMotora.addEventListener('change', suggestDistance);
    if (dom.diametroMovida) dom.diametroMovida.addEventListener('change', suggestDistance);
    if (dom.failureType) dom.failureType.addEventListener('change', runDiagnosis);
    if (dom.fileInput) dom.fileInput.addEventListener('change', handleFileSelect);

    if (dom.projectList) dom.projectList.addEventListener('click', handleProjectListClick);
    if (dom.solutionsTable) dom.solutionsTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-button')) {
            const sol = JSON.parse(e.target.dataset.solution);
            loadSolutionIntoDirectForm(sol);
        }
    });

    if (dom.modalConfirmBtn) dom.modalConfirmBtn.addEventListener('click', () => { if (modalCallback) modalCallback(); hideModal(); });
    if (dom.modalCancelBtn) dom.modalCancelBtn.addEventListener('click', hideModal);

    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('invalid'));
    });
}

/**
 * Valida os inputs numéricos essenciais para os cálculos.
 * @param {boolean} isDirectMode - True se estiver no modo direto, false para o modo reverso.
 * @returns {boolean} - Retorna true se os inputs forem válidos.
 */
function validateInputs(isDirectMode) {
    let isValid = true;
    // ATUALIZAÇÃO: Incluída a validação dos diâmetros no modo direto.
    const inputsToCheck = isDirectMode
        ? [dom.rpmMotor, dom.potenciaMotor, dom.distanciaEixos, dom.diametroMotora, dom.diametroMovida]
        : [dom.revRpmMotor, dom.revRpmFinal, dom.revPotenciaMotor];

    inputsToCheck.forEach(input => {
        if (!input) return;
        const value = parseFloat(input.value);
        if (isNaN(value) || value <= 0) {
            input.classList.add('invalid');
            isValid = false;
        } else {
            input.classList.remove('invalid');
        }
    });
    return isValid;
}

/**
 * Sugere uma distância entre eixos com base nos diâmetros das polias.
 */
function suggestDistance() {
    if (!dom.diametroMotora || !dom.diametroMovida || !dom.distanciaEixos) return;
    const d1 = parseFloat(dom.diametroMotora.value);
    const d2 = parseFloat(dom.diametroMovida.value);
    if (d1 > 0 && d2 > 0) {
        // Fórmula comum para uma boa distância inicial: 2 * (d1 + d2)
        dom.distanciaEixos.value = (2 * (d1 + d2)).toFixed(0);
        // ATUALIZAÇÃO: Salva o estado do formulário após a sugestão automática.
        saveFormState();
    }
}

/**
 * Reseta todos os campos do formulário para os valores padrão.
 */
function resetForm() {
    if (dom['direct-calculation-module']) {
        dom['direct-calculation-module'].querySelector('form').reset();
    }
     // Limpa todos os inputs e selects
    document.querySelectorAll('input[type="number"], input[type="text"], select').forEach(el => {
        if (el.tagName === 'SELECT') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });
    updatePulleySelects();
    resetDiagram();
    localStorage.removeItem(formStateKey);
    if (dom.dicasLista) dom.dicasLista.innerHTML = '<li>Preencha os dados e clique em "Calcular".</li>';
    if (dom.resultadoRpm) updateDirectResultsUI({ rpmFinal: 0, ratio: 0, beltName: '-', bestFitBelt: 0, numBelts: 0, beltSpeed: 0, angle: 0, shaftLoad: 0, vibrationFreq: 0 });
    currentResults = {};
}

/**
 * Salva o cálculo atual como um projeto no localStorage.
 */
function saveProject() {
    if (!currentResults || !currentResults.rpm) { showModal('Calcule um projeto antes de salvar.'); return; }
    const projectName = dom.projectName.value.trim();
    if (!projectName) { showModal('Por favor, dê um nome ao projeto.'); return; }

    const { rpm, power, fs, profile, d1, d2, c } = currentResults;
    const projectData = { name: projectName, rpm, power, fs, profile, d1, d2, c };

    try {
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        const existingIndex = projects.findIndex(p => p.name === projectName);

        if (existingIndex > -1) {
            showModal(`Já existe um projeto com o nome "${projectName}". Deseja sobrescrevê-lo?`, 'confirm', () => {
                projects[existingIndex] = projectData;
                localStorage.setItem('pulleyProjects', JSON.stringify(projects));
                loadProjects();
            });
        } else {
            projects.push(projectData);
            localStorage.setItem('pulleyProjects', JSON.stringify(projects));
            dom.projectName.value = '';
            loadProjects();
        }
    } catch (e) {
        showModal(`Erro ao salvar projeto: ${e.message}`);
    }
}

/**
 * Carrega a lista de projetos salvos do localStorage para a interface.
 */
function loadProjects() {
    try {
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        populateSelect(dom.compareProject1, projects.map((p, i) => ({ value: i, text: p.name })), (opt) => opt);
        populateSelect(dom.compareProject2, projects.map((p, i) => ({ value: i, text: p.name })), (opt) => opt);

        if (dom.projectList) {
            dom.projectList.innerHTML = '';
            projects.forEach((proj, index) => {
                const item = document.createElement('div');
                item.className = 'project-item';
                item.innerHTML = `<span>${proj.name}</span><button class="delete-project-btn" data-index="${index}" title="Apagar projeto"><i class="fas fa-trash-alt"></i></button>`;
                dom.projectList.appendChild(item);
            });
        }
    } catch (e) {
        showModal(`Erro ao carregar projetos: ${e.message}`);
    }
}

/**
 * Gerencia cliques na lista de projetos (carregar ou apagar).
 * @param {Event} e - O objeto do evento de clique.
 */
function handleProjectListClick(e) {
    const target = e.target;
    const projectItem = target.closest('.project-item');
    if (!projectItem) return;

    const index = projectItem.querySelector('.delete-project-btn')?.dataset.index;
    if (index === undefined) return;

    const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
    const projectToDelete = projects[index];

    if (target.closest('.delete-project-btn')) {
        showModal(`Tem a certeza que deseja apagar o projeto "${projectToDelete.name}"?`, 'confirm', () => {
            projects.splice(index, 1);
            localStorage.setItem('pulleyProjects', JSON.stringify(projects));
            loadProjects();
        });
    } else if (target.tagName === 'SPAN') {
        loadSolutionIntoDirectForm(projectToDelete);
    }
}

/**
 * Preenche o formulário de cálculo direto com os dados de uma solução ou projeto salvo.
 * @param {object} sol - O objeto da solução/projeto.
 */
function loadSolutionIntoDirectForm(sol) {
    if (!sol) return;
    dom.rpmMotor.value = sol.rpm;
    dom.potenciaMotor.value = sol.power;
    dom.fatorServico.value = sol.fs || '1.2';
    dom.tipoCorreia.value = sol.profile;

    // Dispara a atualização dos selects de polia
    updatePulleySelects();

    // ATUALIZAÇÃO: Adicionado um delay para garantir que os selects sejam
    // populados antes de definir seus valores, evitando uma condição de corrida.
    setTimeout(() => {
        dom.diametroMotora.value = sol.d1;
        dom.diametroMovida.value = sol.d2;
        dom.distanciaEixos.value = sol.c.toFixed(0);
        
        setMode('direct');
        runDirectCalculation();
        if (sol.name) dom.projectName.value = sol.name;
    }, 100);
}

/**
 * Encontra o valor em uma lista que é mais próximo de um valor alvo.
 * @param {number} target - O valor alvo.
 * @param {Array<number>} options - A lista de opções.
 * @returns {number} - O valor mais próximo encontrado.
 */
function findBestFit(target, options) {
    if (!options || !options.length) return target;
    return options.reduce((p, c) => Math.abs(c - target) < Math.abs(p - target) ? c : p);
}

/**
 * Atualiza a cor de um card de status (success, warning, danger).
 * @param {HTMLElement} card - O elemento do card.
 * @param {number} value - O valor a ser verificado.
 * @param {number} warnLimit - O limite para aviso (amarelo).
 * @param {number} dangerLimit - O limite para perigo (vermelho).
 * @param {boolean} higherIsBetter - True se valores mais altos forem melhores.
 */
function updateCardStatus(card, value, warnLimit, dangerLimit, higherIsBetter) {
    if (!card) return;
    card.classList.remove('warning', 'danger', 'success');
    if ((higherIsBetter && value < dangerLimit) || (!higherIsBetter && value > dangerLimit)) {
        card.classList.add('danger');
    } else if ((higherIsBetter && value < warnLimit) || (!higherIsBetter && value > warnLimit)) {
        card.classList.add('warning');
    } else {
        card.classList.add('success');
    }
}

/**
 * Gera e exibe dicas com base nos resultados do cálculo.
 * @param {object} r - O objeto de resultados.
 */
function generateTips(r) {
    if (!r || !dom.dicasLista) return;
    dom.dicasLista.innerHTML = '';
    const addTip = (text, type) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-info-circle"></i> ${text}`;
        li.className = type;
        dom.dicasLista.appendChild(li);
    };
    if (r.ratio > 7) addTip('Relação > 7:1 pode causar deslizamento e exigir polias especiais.', 'warning');
    if (r.beltSpeed > 33) addTip('Velocidade > 33 m/s. Balanceamento dinâmico das polias é recomendado.', 'warning');
    if (r.angle < 120) addTip('Ângulo de abraçamento baixo (< 120°). Considere aumentar a distância entre eixos ou usar um esticador.', 'danger');
    addTip('Para projetos críticos, sempre consulte os catálogos técnicos dos fabricantes para obter dados precisos.', 'info');
}

/**
 * Exibe um modal de diálogo para o usuário.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - 'alert' (padrão) ou 'confirm'.
 * @param {Function} callback - A função a ser executada se o usuário confirmar.
 */
function showModal(message, type = 'alert', callback = null) {
    if (!dom.modalMessage || !dom.customModal || !dom.modalConfirmBtn || !dom.modalCancelBtn) return;
    dom.modalMessage.textContent = message;
    modalCallback = callback;
    dom.modalConfirmBtn.style.display = type === 'confirm' ? 'inline-block' : 'none';
    dom.modalCancelBtn.textContent = type === 'confirm' ? 'Cancelar' : 'OK';
    dom.customModal.style.display = 'flex';
}

/**
 * Esconde o modal.
 */
function hideModal() {
    if (dom.customModal) dom.customModal.style.display = 'none';
}

function importProjects() { if (dom.fileInput) dom.fileInput.click(); }

function exportProjects() {
    try {
        const projects = localStorage.getItem('pulleyProjects');
        if (!projects || projects === '[]') {
            showModal('Não há projetos salvos para exportar.');
            return;
        }
        const blob = new Blob([projects], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `projetos_polias_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        showModal(`Ocorreu um erro ao exportar os projetos: ${e.message}`);
    }
}

/**
 * Processa o arquivo JSON de projetos selecionado pelo usuário.
 * @param {Event} event - O evento de mudança do input de arquivo.
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedProjects = JSON.parse(e.target.result);
            if (!Array.isArray(importedProjects)) throw new Error("O ficheiro não contém uma lista de projetos válida.");
            
            showModal('Isto irá adicionar os projetos do ficheiro à sua lista. Projetos com nomes duplicados serão ignorados. Deseja continuar?', 'confirm', () => {
                const existingProjects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
                const existingNames = new Set(existingProjects.map(p => p.name));
                const newProjects = importedProjects.filter(p => p.name && !existingNames.has(p.name));
                
                if (newProjects.length > 0) {
                    const updatedProjects = [...existingProjects, ...newProjects];
                    localStorage.setItem('pulleyProjects', JSON.stringify(updatedProjects));
                    loadProjects();
                    showModal(`${newProjects.length} novo(s) projeto(s) importado(s) com sucesso!`);
                } else {
                    showModal('Nenhum projeto novo para importar. Os projetos do ficheiro já existem.');
                }
            });
        } catch (error) {
            showModal(`Erro ao ler o ficheiro: ${error.message}`);
        }
    };
    reader.readAsText(file);
}


    // --- INICIALIZAÇÃO ---
    loadFormState();
    loadProjects();
    setupEventListeners();
    updatePulleySelects(); // Garante que as polias do perfil salvo sejam carregadas
});
