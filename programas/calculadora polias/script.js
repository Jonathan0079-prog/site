alert("Script iniciado!");

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
        'diagram-card', 'pulley1', 'pulley2', 'beltPath', 'centerLine', 'pulley1_text', 'pulley2_text'
    ];
    ids.forEach(id => dom[id] = document.getElementById(id));
    
    console.log('dom.saveProjectBtn:', dom.saveProjectBtn);


    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;
    let currentMode = 'direct'; // Variável para rastrear o modo atual

    // --- ESTADO DO FORMULÁRIO (localStorage) ---
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
        
        formInputIds.forEach(id => {
            if (dom[id] && state[id] !== undefined && id !== 'diametroMotora' && id !== 'diametroMovida') {
                dom[id].value = state[id];
            }
        });
        
        setMode(state.mode || 'direct');
        
        updatePulleySelects();
        
        if(state.diametroMotora) dom.diametroMotora.value = state.diametroMotora;
        if(state.diametroMovida) dom.diametroMovida.value = state.diametroMovida;
    }

    // --- LÓGICA DE CÁLCULO ---
    function performCalculations(params) {
        const { name, rpm, power, fs, d1, d2, c, profile } = params;
        if ([rpm, power, fs, d1, d2, c, profile].some(p => p === null || p === undefined || (typeof p === 'number' && p <= 0) || p === '')) return null;

        const designPower = power * fs;
        const ratio = d2 / d1;
        
        const powerTable = DB.powerTables[profile];
        if (!powerTable) return null;

        const powerForRpm = powerTable.baseHp * (rpm / 1750);
        const powerFromRatio = (ratio > 1) ? ((ratio - 1) * powerTable.ratioFactor) : 0;
        const nominalBeltPower = powerForRpm + powerFromRatio;

        const L = 2 * c + (Math.PI * (d1 + d2) / 2) + (Math.pow(d2 - d1, 2) / (4 * c));
        const angle = 180 - 2 * Math.asin((d2 - d1) / (2 * c)) * (180 / Math.PI);
        
        const Ka = (angle < 180) ? 1 - (0.003 * (180 - angle)) : 1.0;
        
        const beltLengths = DB.belts[profile];
        const avgLength = beltLengths.reduce((a, b) => a + b, 0) / beltLengths.length;
        let Kl = DB.lengthFactors[profile].m;
        if (L < avgLength * 0.75) Kl = DB.lengthFactors[profile].s;
        else if (L > avgLength * 1.25) Kl = DB.lengthFactors[profile].l;
        
        const correctedBeltPower = nominalBeltPower * Ka * Kl;
        
        const numBelts = Math.ceil(designPower / correctedBeltPower);
        
        const rpmFinal = rpm * (d1 / d2);
        const beltSpeed = (d1 * rpm * Math.PI) / (60 * 1000);
        const shaftLoad = (2 * (designPower * 735.5 / beltSpeed) * numBelts) / 9.81;
        const vibrationFreq = (1 / (2 * (c / 1000))) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]);

        const bestFitBelt = findBestFit(L, beltLengths);
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;
        
        return { name: name || 'Projeto Atual', rpm, power, fs, designPower, profile, d1, d2, c, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName, bestFitBelt };
    }

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
            drawDiagram(currentResults);
            generateTips(currentResults);
        }
    }

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
                const rpmFinal = rpmMotor * (d1 / d2);

                if (Math.abs(rpmFinal - targetRpm) / targetRpm <= tolerance) {
                    const c = 2 * (d1 + d2);
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

    function runDiagnosis() {
        const failure = dom.failureType.value;
        let diagnosis = "Selecione um problema para analisar ou calcule um projeto primeiro.";
        if (failure && currentResults.rpm) {
            switch (failure) {
                case 'slipping': diagnosis = currentResults.angle < 120 ? `Causa provável: Ângulo de abraçamento baixo (${currentResults.angle.toFixed(1)}°). Aumente a distância entre eixos ou use polias maiores.` : "Verifique a tensão da correia e o desgaste das ranhuras das polias."; break;
                case 'noise': diagnosis = "Causas comuns: Desalinhamento entre polias, tensão incorreta (muito alta ou baixa), ou desgaste nos rolamentos dos eixos."; break;
                case 'vibration': diagnosis = currentResults.vibrationFreq > 0 && Math.abs(currentResults.vibrationFreq - (currentResults.rpm / 60)) < 10 ? `Causa provável: Risco de ressonância! A frequência de vibração da correia (${currentResults.vibrationFreq.toFixed(1)} Hz) está próxima da frequência de rotação do motor.` : "Verifique o balanceamento das polias e o alinhamento do sistema."; break;
                case 'wear': diagnosis = "Causas comuns: Desalinhamento, tensão excessiva, polias gastas ou contaminação por óleo/graxa."; break;
            }
        }
        dom.diagnosisResult.innerHTML = `<p>${diagnosis}</p>`;
    }

    function runComparison() {
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        const proj1Data = projects[dom.compareProject1.value];
        const proj2Data = projects[dom.compareProject2.value];
        if (!proj1Data || !proj2Data) { showModal("Selecione dois projetos válidos para comparar."); return; }

        const results1 = performCalculations(proj1Data);
        const results2 = performCalculations(proj2Data);

        const fields = [
            { label: "RPM Final", key: "rpmFinal", unit: " RPM" }, { label: "Nº Correias", key: "numBelts", unit: "" },
            { label: "Velocidade", key: "beltSpeed", unit: " m/s" }, { label: "Abraçamento", key: "angle", unit: "°" },
            { label: "Força no Eixo", key: "shaftLoad", unit: " kgf" }, { label: "Freq. Vibração", key: "vibrationFreq", unit: " Hz" }
        ];

        let tableHTML = `<thead><tr><th>Parâmetro</th><th>${proj1Data.name}</th><th>${proj2Data.name}</th></tr></thead><tbody>`;
        fields.forEach(f => {
            tableHTML += `<tr><td>${f.label}</td><td>${results1[f.key].toFixed(2)}${f.unit}</td><td>${results2[f.key].toFixed(2)}${f.unit}</td></tr>`;
        });
        tableHTML += `</tbody>`;
        dom.comparisonTable.innerHTML = tableHTML;
        setMode('compare');
    }

    // --- ATUALIZAÇÃO DA UI ---
    function setMode(mode) {
        currentMode = mode;
        dom['direct-calculation-module'].style.display = mode === 'direct' ? 'block' : 'none';
        dom['reverse-calculation-module'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['direct-results-container'].style.display = (mode === 'direct' || mode === 'compare') ? 'block' : 'none';
        dom['reverse-results-container'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['comparison-results-container'].style.display = mode === 'compare' ? 'block' : 'none';
        dom['tips-card'].style.display = (mode === 'direct' || mode === 'reverse') ? 'block' : 'none';
        dom.modeDirectBtn.classList.toggle('active', mode === 'direct');
        dom.modeReverseBtn.classList.toggle('active', mode === 'reverse');
        resetDiagram();
    }

    function updateDirectResultsUI(results) {
        dom.resultadoRpm.textContent = results.rpmFinal.toFixed(0);
        dom.resultadoRelacao.textContent = results.ratio.toFixed(2);
        dom.resultadoCorreia.textContent = `${results.beltName} (${results.bestFitBelt.toFixed(0)} mm)`;
        dom.resultadoNumCorreias.textContent = results.numBelts;
        dom.resultadoVelocidade.textContent = results.beltSpeed.toFixed(2);
        dom.resultadoAngulo.textContent = results.angle.toFixed(2);
        dom.resultadoForca.textContent = results.shaftLoad.toFixed(2);
        dom.resultadoFrequencia.textContent = results.vibrationFreq.toFixed(1);

        updateCardStatus(dom.velocidadeCorreiaCard, results.beltSpeed, 30, 35);
        updateCardStatus(dom.anguloAbracamentoCard, results.angle, 120, 100, false);
        updateCardStatus(dom.forcaEixoCard, results.shaftLoad, 500, 1000);
        updateCardStatus(dom.frequenciaVibracaoCard, Math.abs(results.vibrationFreq - (results.rpm / 60)), 20, 10, false);
    }

    function displayOptimizationResults(solutions) {
        const tbody = dom.solutionsTable.querySelector('tbody');
        tbody.innerHTML = '';
        if (solutions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma solução encontrada com os critérios definidos.</td></tr>';
            return;
        }
        solutions.forEach(sol => {
            const row = `
                <tr>
                    <td>${sol.profile}</td>
                    <td>${sol.d1} mm</td>
                    <td>${sol.d2} mm</td>
                    <td>${sol.beltName}</td>
                    <td>R$ ${sol.cost.toFixed(2)}</td>
                    <td><button class="action-button" data-solution='${JSON.stringify(sol)}'>Usar</button></td>
                </tr>`;
            tbody.innerHTML += row;
        });
    }

    // --- DIAGRAMA ---
    function drawDiagram(results) {
        const { d1, d2, c } = results;
        if (!d1 || !d2 || !c) return;
        
        dom['diagram-card'].style.display = 'block';

        const svgWidth = 800;
        const svgHeight = 300;
        const padding = 50;

        const totalWidth = d1 / 2 + c + d2 / 2;
        const scale = (svgWidth - padding * 2) / totalWidth;

        const r1 = (d1 / 2) * scale;
        const r2 = (d2 / 2) * scale;
        const c_scaled = c * scale;

        const cy = svgHeight / 2;
        const cx1 = padding + r1;
        const cx2 = cx1 + c_scaled;
        
        dom.pulley1.setAttribute('r', r1);
        dom.pulley1.setAttribute('cx', cx1);
        dom.pulley1.setAttribute('cy', cy);

        dom.pulley2.setAttribute('r', r2);
        dom.pulley2.setAttribute('cx', cx2);
        dom.pulley2.setAttribute('cy', cy);

        dom.pulley1_text.setAttribute('x', cx1);
        dom.pulley1_text.setAttribute('y', cy + 5);
        dom.pulley1_text.textContent = `${d1}mm`;
        
        dom.pulley2_text.setAttribute('x', cx2);
        dom.pulley2_text.setAttribute('y', cy + 5);
        dom.pulley2_text.textContent = `${d2}mm`;

        const delta_r = r2 - r1;
        const alpha = Math.asin(delta_r / c_scaled);

        const p1_x1 = cx1 + r1 * Math.sin(alpha);
        const p1_y1 = cy - r1 * Math.cos(alpha);
        const p1_x2 = cx1 - r1 * Math.sin(alpha);
        const p1_y2 = cy + r1 * Math.cos(alpha);

        const p2_x1 = cx2 + r2 * Math.sin(alpha);
        const p2_y1 = cy - r2 * Math.cos(alpha);
        const p2_x2 = cx2 - r2 * Math.sin(alpha);
        const p2_y2 = cy + r2 * Math.cos(alpha);

        const largeArcFlag = (Math.PI - 2 * alpha) > Math.PI ? 1 : 0;
        
        const pathData = [
            `M ${p1_x1} ${p1_y1}`,
            `L ${p2_x1} ${p2_y1}`,
            `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${p2_x2} ${p2_y2}`,
            `L ${p1_x2} ${p1_y2}`,
            `A ${r1} ${r1} 0 ${largeArcFlag} 1 ${p1_x1} ${p1_y1}`,
        ].join(' ');

        dom.beltPath.setAttribute('d', pathData);
        
        dom.centerLine.setAttribute('x1', cx1);
        dom.centerLine.setAttribute('x2', cx2);
    }

    function resetDiagram() {
        if(dom['diagram-card']) {
            dom['diagram-card'].style.display = 'none';
        }
    }

    // --- FUNÇÕES AUXILIARES E DE SETUP ---
    function populateSelect(selectElement, options, isObject = false) {
        if (!selectElement) { console.warn('populateSelect chamada com elemento nulo.'); return; }
        console.log('Chamada para populateSelect. Elemento:', selectElement, '| Opções:', options);
        const currentValue = selectElement.value;
        selectElement.innerHTML = '';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = isObject ? opt.value : opt;
            option.textContent = isObject ? opt.text : (opt + ' mm');
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
        const selectElement = dom.tipoCorreia;
        console.log('Populando perfis de correia.');
        selectElement.innerHTML = '';
        if (!DB.pulleys) {
            console.error('DB.pulleys is not defined or empty.');
            selectElement.innerHTML = '<option value="">Erro ao carregar perfis.</option>';
            return;
        }

        selectElement.innerHTML = '';
        Object.keys(DB.pulleys).forEach(profile => {
            const option = document.createElement('option');
            option.value = profile;
            option.textContent = profile;
            selectElement.appendChild(option);
        });
        console.log('Conteúdo de DB.pulleys:', DB.pulleys);
    }
    
    function updatePulleySelects() {
        console.log('Atualizando selects de polia.');
        const profile = dom.tipoCorreia.value;

        if (!profile || !DB.pulleys || !DB.pulleys[profile] || !Array.isArray(DB.pulleys[profile])) {
            console.warn('Perfil da correia inválido ou DB.pulleys incompleto.');
            dom.diametroMotora.innerHTML = '<option value="">Selecione um perfil válido primeiro.</option>';
            dom.diametroMovida.innerHTML = '<option value="">Selecione um perfil válido primeiro.</option>';
            suggestDistance(); // Chamar suggestDistance mesmo com selects vazios
            return;
        }


        const pulleySizes = DB.pulleys[profile];
        populateSelect(dom.diametroMotora, pulleySizes);
        populateSelect(dom.diametroMovida, pulleySizes);

        if (dom.diametroMotora.options.length > 1) {
            dom.diametroMotora.selectedIndex = Math.floor(dom.diametroMotora.options.length / 4);
        }
        if (dom.diametroMovida.options.length > 1) {
             dom.diametroMovida.selectedIndex = Math.floor(dom.diametroMovida.options.length / 2);
        }
        suggestDistance();
    }
    
    // --- IMPORT/EXPORT, MODAL, PROJETOS, etc. ---
    function exportProjects() { /* ... */ }
    function importProjects() { /* ... */ }
    function handleFileSelect(event) { /* ... */ }
    function showModal(message, type = 'alert', callback = null) { /* ... */ }
    function hideModal() { /* ... */ }
    function setupEventListeners() {
 console.log('Configurando event listeners.');
 if (dom.modeDirectBtn) dom.modeDirectBtn.addEventListener('click', () => { setMode('direct'); saveFormState(); });
 if (dom.modeReverseBtn) dom.modeReverseBtn.addEventListener('click', () => { setMode('reverse'); saveFormState(); });


        formInputIds.forEach(id => { if (dom[id]) dom[id].addEventListener('change', saveFormState); });
        
 if (dom.tipoCorreia) dom.tipoCorreia.addEventListener('change', updatePulleySelects);
 if (dom.diametroMotora) dom.diametroMotora.addEventListener('change', suggestDistance);
 if (dom.diametroMovida) dom.diametroMovida.addEventListener('change', suggestDistance); // Ensure this has a check

 if (dom.calcularBtn) dom.calcularBtn.addEventListener('click', runDirectCalculation);
 console.log('Configurando listener para optimizeBtn:', dom.optimizeBtn);
 if (dom.optimizeBtn) dom.optimizeBtn.addEventListener('click', runReverseOptimization);
 console.log('Configurando listener para resetBtn:', dom.resetBtn);
 if (dom.resetBtn) dom.resetBtn.addEventListener('click', resetForm);
 console.log('Configurando listener para printBtn:', dom.printBtn);
 if (dom.printBtn) dom.printBtn.addEventListener('click', () => window.print());

 if (dom.saveProjectBtn) dom.saveProjectBtn.addEventListener('click', saveProject);
 console.log('Adicionando listener para:', 'projectList', dom.projectList);
 if (dom.projectList) dom.projectList.addEventListener('click', handleProjectListClick);
        dom.compareBtn.addEventListener('click', runComparison);
        dom.failureType.addEventListener('change', runDiagnosis);
        dom.importBtn.addEventListener('click', importProjects);
        dom.exportBtn.addEventListener('click', exportProjects);
        dom.fileInput.addEventListener('change', handleFileSelect);
        
        dom.modalConfirmBtn.addEventListener('click', () => { if (modalCallback) modalCallback(); hideModal(); });
        dom.modalCancelBtn.addEventListener('click', hideModal);
        
        document.querySelectorAll('input[type="number"]').forEach(input => { input.addEventListener('input', () => input.classList.remove('invalid')); });
        
        dom.solutionsTable.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                const sol = JSON.parse(e.target.dataset.solution);
                loadSolutionIntoDirectForm(sol);
            }
        });
    }

    function validateInputs(isDirectMode) {
        let isValid = true;
        const inputsToCheck = isDirectMode ? 
            [dom.rpmMotor, dom.potenciaMotor, dom.distanciaEixos] :
            [dom.revRpmMotor, dom.revRpmFinal, dom.revPotenciaMotor];
        
        inputsToCheck.forEach(input => {
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
    
    function suggestDistance() { /* ... */ }
    function resetForm() {
        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        
        populateBeltProfileSelect();
        populateServiceFactorSelects();
        updatePulleySelects();
        
        const resultFields = ['resultadoRpm', 'resultadoRelacao', 'resultadoCorreia', 'resultadoNumCorreias', 'resultadoVelocidade', 'resultadoAngulo', 'resultadoForca', 'resultadoFrequencia'];
        resultFields.forEach(id => dom[id] ? dom[id].textContent = '--' : null);
        
        const resultCards = ['velocidadeCorreiaCard', 'anguloAbracamentoCard', 'forcaEixoCard', 'frequenciaVibracaoCard'];
        resultCards.forEach(id => dom[id] ? dom[id].classList.remove('warning', 'danger') : null);
        
        dom.dicasLista.innerHTML = '<li>Preencha os dados e clique em "Calcular".</li>';
        currentResults = {};
        resetDiagram();
        localStorage.removeItem(formStateKey);
    }
    function saveProject() { /* ... */ }
    function loadProjects() { /* ... */ }
    function handleProjectListClick(e) { /* ... */ }
    function loadSolutionIntoDirectForm(sol) { /* ... */ }
    function findBestFit(target, options) { return options.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev); }
    function updateCardStatus(card, value, warnLimit, dangerLimit, higherIsBetter = true) { /* ... */ }
    function generateTips(results) { /* ... */ }
    
    // --- FUNÇÃO DE INICIALIZAÇÃO ---
    function init() {
 console.log('Iniciando init');
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
            'diagram-card', 'pulley1', 'pulley2', 'beltPath', 'centerLine', 'pulley1_text', 'pulley2_text'
        ];
        ids.forEach(id => dom[id] = document.getElementById(id));

        console.log('dom.saveProjectBtn:', dom.saveProjectBtn);
        console.log('dom.diametroMotora:', dom.diametroMotora);
        console.log('dom.diametroMovida:', dom.diametroMovida);

        populateBeltProfileSelect();

 // Tenta selecionar um perfil padrão se nenhum estiver selecionado
        if (!dom.tipoCorreia.value && dom.tipoCorreia.options.length > 0) {
            dom.tipoCorreia.value = dom.tipoCorreia.options[0].value;
        }
 updatePulleySelects(); // Chamar updatePulleySelects após tentar definir o perfil padrão
        populateServiceFactorSelects();
        loadFormState();
 setupEventListeners(); 
        loadProjects(); // Make sure loadProjects also uses checks for dom.projectList
    }

    init();
});
