// VERSÃO FINAL COMPLETA - 3 DE JULHO DE 2025 (REVISADA)
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
        const savedStateJSON = localStorage.getItem(formStateKey);
        if (!savedStateJSON) return;
        const state = JSON.parse(savedStateJSON);
        formInputIds.forEach(id => {
            if (dom[id] && state[id] !== undefined && id !== 'diametroMotora' && id !== 'diametroMovida') {
                dom[id].value = state[id];
            }
        });
        setMode(state.mode || 'direct');
        updatePulleySelects();
        if (state.diametroMotora && dom.diametroMotora) dom.diametroMotora.value = state.diametroMotora;
        if (state.diametroMovida && dom.diametroMovida) dom.diametroMovida.value = state.diametroMovida;
    }

    // --- LÓGICA DE CÁLCULO ---
    function performCalculations(params) {
        const { name, rpm, power, fs, d1, d2, c, profile } = params;

        // ATUALIZAÇÃO: Validação mais limpa e robusta.
        if ([rpm, power, fs, d1, d2, c].some(p => p === null || p === undefined || (typeof p === 'number' && p <= 0)) || !profile) {
            return { success: false, error: 'Parâmetros de entrada inválidos ou incompletos.' };
        }
        if (!DB?.powerTables?.[profile] || !DB?.belts?.[profile] || !DB?.lengthFactors?.[profile] || !DB?.beltMass?.[profile]) {
            return { success: false, error: `Dados de referência (DB) para o perfil "${profile}" não encontrados.` };
        }

        const designPower = power * fs;
        const ratio = d2 / d1;
        const powerTable = DB.powerTables[profile];
        
        const nominalBeltPower = (powerTable.baseHp * (rpm / 1750)) + ((ratio > 1) ? ((ratio - 1) * powerTable.ratioFactor) : 0);
        const L = 2 * c + (Math.PI * (d1 + d2) / 2) + (Math.pow(d2 - d1, 2) / (4 * c));
        const angle = 180 - 2 * Math.asin((d2 - d1) / (2 * c)) * (180 / Math.PI);
        if (isNaN(angle)) {
            return { success: false, error: 'Configuração geométrica inválida (verifique diâmetros e distância).' };
        }

        const Ka = (angle < 180) ? 1 - (0.003 * (180 - angle)) : 1.0;
        const beltLengths = DB.belts[profile];
        const avgLength = beltLengths.reduce((a, b) => a + b, 0) / beltLengths.length;
        let Kl = DB.lengthFactors[profile].m;
        if (L < avgLength * 0.75) Kl = DB.lengthFactors[profile].s;
        else if (L > avgLength * 1.25) Kl = DB.lengthFactors[profile].l;

        const correctedBeltPower = nominalBeltPower * Ka * Kl;
        if (correctedBeltPower <= 0) {
            return { success: false, error: 'A potência corrigida da correia é zero ou negativa.' };
        }
        const numBelts = Math.ceil(designPower / correctedBeltPower);

        const rpmFinal = rpm * (d1 / d2);
        const beltSpeed = (d1 * rpm * Math.PI) / 60000;
        if (beltSpeed <= 0) {
            return { success: false, error: 'A velocidade da correia é zero ou negativa.' };
        }

        const shaftLoad = (2 * (designPower * 735.5) / (beltSpeed * numBelts)) / 9.81;
        const vibrationFreq = (1 / (2 * c / 1000)) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]);
        const bestFitBelt = findBestFit(L, beltLengths);
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;

        // ATUALIZAÇÃO: Retorno estruturado em caso de sucesso.
        return { 
            success: true,
            data: { name: name || 'Projeto Atual', rpm, power, fs, designPower, profile, d1, d2, c, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName, bestFitBelt }
        };
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
        const result = performCalculations(params); // ATUALIZAÇÃO: Recebe o objeto de resultado

        if (result.success) {
            currentResults = result.data; // ATUALIZAÇÃO: Extrai os dados
            updateDirectResultsUI(currentResults);
            drawDiagram(currentResults);
            generateTips(currentResults);
        } else {
            // ATUALIZAÇÃO: Usa a mensagem de erro específica
            showModal(`Cálculo falhou: ${result.error}`);
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
                if (d2 <= d1) return;

                const currentRatio = d1 / d2;
                const rpmFinal = rpmMotor * currentRatio;

                if (Math.abs(rpmFinal - targetRpm) / targetRpm <= tolerance) {
                    const c = 2 * (d1 + d2);
                    const result = performCalculations({ name: 'Solução Otimizada', rpm: rpmMotor, power, fs, d1, d2, c, profile });
                    // ATUALIZAÇÃO: Verifica o sucesso e o ângulo dentro do if
                    if (result.success && result.data.angle >= 120) {
                        const cost = (d1 + d2) * DB.costs.pulley + result.data.bestFitBelt * DB.costs.belt;
                        solutions.push({ ...result.data, cost });
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
        if (failure && currentResults && currentResults.rpm) {
            switch (failure) {
                case 'slipping':
                    diagnosis = currentResults.angle < 120
                        ? `Causa provável: Ângulo de abraçamento baixo (${currentResults.angle.toFixed(1)}°). Aumente a distância entre eixos ou use polias maiores.`
                        : "Verifique a tensão da correia e o desgaste das ranhuras das polias.";
                    break;
                case 'noise':
                    diagnosis = "Causas comuns: Desalinhamento entre polias, tensão incorreta (muito alta ou baixa), ou desgaste nos rolamentos dos eixos.";
                    break;
                case 'vibration':
                    diagnosis = currentResults.vibrationFreq > 0 && Math.abs(currentResults.vibrationFreq - (currentResults.rpm / 60)) < 10
                        ? `Causa provável: Risco de ressonância! A frequência de vibração da correia (${currentResults.vibrationFreq.toFixed(1)} Hz) está próxima da frequência de rotação do motor.`
                        : "Verifique o balanceamento das polias e o alinhamento do sistema.";
                    break;
                case 'wear':
                    diagnosis = "Causas comuns: Desalinhamento, tensão excessiva, polias gastas ou contaminação por óleo/graxa.";
                    break;
            }
        }
        dom.diagnosisResult.innerHTML = `<p>${diagnosis}</p>`;
    }

    function runComparison() {
        // ATUALIZAÇÃO: Lendo o localStorage apenas uma vez
        const projectsJSON = localStorage.getItem('pulleyProjects');
        const projects = projectsJSON ? JSON.parse(projectsJSON) : [];
        
        const proj1Data = projects[dom.compareProject1.value];
        const proj2Data = projects[dom.compareProject2.value];
        if (!proj1Data || !proj2Data) { showModal("Selecione dois projetos válidos para comparar."); return; }

        const result1 = performCalculations(proj1Data);
        const result2 = performCalculations(proj2Data);

        // ATUALIZAÇÃO: Tratamento de erro robusto
        if (!result1.success || !result2.success) {
            const errorMsg1 = !result1.success ? `Projeto 1: ${result1.error}` : "";
            const errorMsg2 = !result2.success ? `Projeto 2: ${result2.error}` : "";
            showModal(`Erro ao recalcular projetos para comparação. ${errorMsg1} ${errorMsg2}`);
            return;
        }
        
        const results1 = result1.data;
        const results2 = result2.data;

        const fields = [
            { label: "RPM Final", key: "rpmFinal", unit: " RPM", fixed: 0 },
            { label: "Nº Correias", key: "numBelts", unit: "", fixed: 0 },
            { label: "Velocidade", key: "beltSpeed", unit: " m/s", fixed: 2 },
            { label: "Abraçamento", key: "angle", unit: "°", fixed: 1 },
            { label: "Força no Eixo", key: "shaftLoad", unit: " kgf", fixed: 2 },
            { label: "Freq. Vibração", key: "vibrationFreq", unit: " Hz", fixed: 1 }
        ];

        let tableHTML = `<thead><tr><th>Parâmetro</th><th>${proj1Data.name}</th><th>${proj2Data.name}</th></tr></thead><tbody>`;
        fields.forEach(f => {
            tableHTML += `<tr><td>${f.label}</td><td>${results1[f.key].toFixed(f.fixed)}${f.unit}</td><td>${results2[f.key].toFixed(f.fixed)}${f.unit}</td></tr>`;
        });
        tableHTML += `</tbody>`;
        dom.comparisonTable.innerHTML = tableHTML;
        setMode('compare');
    }
    
    // O restante do seu código (funções de UI, listeners, etc.) continuaria aqui...
});


    // --- ATUALIZAÇÃO DA UI ---
    function setMode(mode) {
        currentMode = mode;
        ['direct-calculation-module', 'reverse-calculation-module', 'reverse-results-container', 'comparison-results-container'].forEach(id => {
            if (dom[id]) dom[id].style.display = 'none';
        });
        if (dom[mode + '-calculation-module']) dom[mode + '-calculation-module'].style.display = 'block';
        if (dom[mode + '-results-container']) dom[mode + '-results-container'].style.display = 'block';

        if (dom['results-card']) dom['results-card'].style.display = (mode === 'direct' || mode === 'compare') ? 'block' : 'none';
        if (dom['tips-card']) dom['tips-card'].style.display = (mode === 'direct' || mode === 'reverse') ? 'block' : 'none';

        if (dom.modeDirectBtn) dom.modeDirectBtn.classList.toggle('active', mode === 'direct');
        if (dom.modeReverseBtn) dom.modeReverseBtn.classList.toggle('active', mode === 'reverse');
        if (mode !== 'direct') resetDiagram();
    }

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
    function drawDiagram(r) {
        if (!r || !dom.transmissionDiagram) return;
        dom['diagram-card'].style.display = 'block';
        const w = 800, h = 300, p = 50, scale = (w - p * 2) / (r.d1 / 2 + r.c + r.d2 / 2);
        const r1 = r.d1 / 2 * scale, r2 = r.d2 / 2 * scale, cs = r.c * scale, cx1 = p + r1, cx2 = cx1 + cs, cy = h / 2;

        dom.pulley1.setAttribute('r', r1); dom.pulley1.setAttribute('cx', cx1); dom.pulley1.setAttribute('cy', cy);
        dom.pulley2.setAttribute('r', r2); dom.pulley2.setAttribute('cx', cx2); dom.pulley2.setAttribute('cy', cy);

        dom.pulley1_text.setAttribute('x', cx1); dom.pulley1_text.setAttribute('y', cy + 5); dom.pulley1_text.textContent = `${r.d1}mm`;
        dom.pulley2_text.setAttribute('x', cx2); dom.pulley2_text.setAttribute('y', cy + 5); dom.pulley2_text.textContent = `${r.d2}mm`;

        const alpha = Math.asin((r2 - r1) / cs);
        const p1x1 = cx1 + r1 * Math.sin(alpha), p1y1 = cy - r1 * Math.cos(alpha), p1x2 = cx1 - r1 * Math.sin(alpha), p1y2 = cy + r1 * Math.cos(alpha);
        const p2x1 = cx2 + r2 * Math.sin(alpha), p2y1 = cy - r2 * Math.cos(alpha), p2x2 = cx2 - r2 * Math.sin(alpha), p2y2 = cy + r2 * Math.cos(alpha);

        dom.beltPath.setAttribute('d', `M ${p1x1} ${p1y1} L ${p2x1} ${p2y1} A ${r2} ${r2} 0 ${Math.PI - 2 * alpha > Math.PI ? 1 : 0} 1 ${p2x2} ${p2y2} L ${p1x2} ${p1y2} A ${r1} ${r1} 0 ${Math.PI - 2 * alpha > Math.PI ? 1 : 0} 1 ${p1x1} ${p1y1}`);
        dom.centerLine.setAttribute('x1', cx1); dom.centerLine.setAttribute('x2', cx2);
    }

    function resetDiagram() {
        if (dom['diagram-card']) dom['diagram-card'].style.display = 'none';
    }

    // --- FUNÇÕES AUXILIARES E DE SETUP ---
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
        if ([...el.options].some(o => o.value == currentValue)) {
            el.value = currentValue;
        }
    }

    function updatePulleySelects() {
        const profile = dom.tipoCorreia.value;
        if (!profile || !DB.pulleys[profile]) return;
        const pulleySizes = DB.pulleys[profile];
        populateSelect(dom.diametroMotora, pulleySizes, (opt) => ({ value: opt, text: `${opt} mm` }));
        populateSelect(dom.diametroMovida, pulleySizes, (opt) => ({ value: opt, text: `${opt} mm` }));
    }

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

    function validateInputs(isDirectMode) {
        let isValid = true;
        const inputsToCheck = isDirectMode
            ? [dom.rpmMotor, dom.potenciaMotor, dom.distanciaEixos]
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

    function suggestDistance() {
        if (!dom.diametroMotora || !dom.diametroMovida) return;
        const d1 = parseFloat(dom.diametroMotora.value);
        const d2 = parseFloat(dom.diametroMovida.value);
        if (d1 > 0 && d2 > 0 && dom.distanciaEixos) {
            dom.distanciaEixos.value = (2 * (d1 + d2)).toFixed(0);
        }
    }

    function resetForm() {
        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(i => i.value = '');
        document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
        updatePulleySelects();
        resetDiagram();
        localStorage.removeItem(formStateKey);
        if (dom.dicasLista) dom.dicasLista.innerHTML = '<li>Preencha os dados e clique em "Calcular".</li>';
        currentResults = {};
    }

    function saveProject() {
        if (!currentResults.rpm) { showModal('Calcule um projeto antes de salvar.'); return; }
        const projectName = dom.projectName.value.trim();
        if (!projectName) { showModal('Por favor, dê um nome ao projeto.'); return; }

        const { rpm, power, fs, profile, d1, d2, c } = currentResults;
        const projectData = { name: projectName, rpm, power, fs, profile, d1, d2, c };

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
    }

    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        populateSelect(dom.compareProject1, projects.map((p, i) => ({ value: i, text: p.name })), (opt) => opt);
        populateSelect(dom.compareProject2, projects.map((p, i) => ({ value: i, text: p.name })), (opt) => opt);

        if (dom.projectList) {
            dom.projectList.innerHTML = '';
            projects.forEach((proj, index) => {
                const item = document.createElement('div');
                item.className = 'project-item';
                item.innerHTML = `<span>${proj.name}</span><button class="delete-project-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>`;
                dom.projectList.appendChild(item);
            });
        }
    }

    function handleProjectListClick(e) {
        const target = e.target;
        const projectItem = target.closest('.project-item');
        if (!projectItem) return;

        const index = projectItem.querySelector('.delete-project-btn').dataset.index;
        if (index === undefined) return;

        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];

        if (target.closest('.delete-project-btn')) {
            showModal(`Tem a certeza que deseja apagar o projeto "${projects[index].name}"?`, 'confirm', () => {
                projects.splice(index, 1);
                localStorage.setItem('pulleyProjects', JSON.stringify(projects));
                loadProjects();
            });
        } else if (target.tagName === 'SPAN') {
            loadSolutionIntoDirectForm(projects[index]);
        }
    }

    function loadSolutionIntoDirectForm(sol) {
        dom.rpmMotor.value = sol.rpm;
        dom.potenciaMotor.value = sol.power;
        dom.fatorServico.value = sol.fs || '1.2';
        dom.tipoCorreia.value = sol.profile;

        updatePulleySelects();

        dom.diametroMotora.value = sol.d1;
        dom.diametroMovida.value = sol.d2;
        dom.distanciaEixos.value = sol.c.toFixed(0);

        setMode('direct');
        runDirectCalculation();
        dom.projectName.value = sol.name;
    }

    function findBestFit(target, options) {
        if (!options || !options.length) return target;
        return options.reduce((p, c) => Math.abs(c - target) < Math.abs(p - target) ? c : p);
    }

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

    function generateTips(r) {
        if (!r || !dom.dicasLista) return;
        dom.dicasLista.innerHTML = '';
        const addTip = (text, type) => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-info-circle"></i> ${text}`;
            li.className = type;
            dom.dicasLista.appendChild(li);
        };
        if (r.ratio > 7) addTip('Relação > 7:1 pode causar deslizamento.', 'warning');
        if (r.beltSpeed > 33) addTip('Velocidade > 33 m/s. Balanceamento dinâmico pode ser necessário.', 'warning');
        if (r.angle < 120) addTip('Ângulo de abraçamento baixo. Considere aumentar a distância entre eixos.', 'danger');
        addTip('Para projetos críticos, sempre consulte os catálogos dos fabricantes.', 'info');
    }

    function showModal(message, type = 'alert', callback = null) {
        if (!dom.modalMessage || !dom.customModal || !dom.modalConfirmBtn || !dom.modalCancelBtn) return;
        dom.modalMessage.textContent = message;
        modalCallback = callback;
        dom.modalConfirmBtn.style.display = type === 'confirm' ? 'inline-block' : 'none';
        dom.modalCancelBtn.textContent = type === 'confirm' ? 'Cancelar' : 'OK';
        dom.customModal.style.display = 'flex';
    }

    function hideModal() {
        if (dom.customModal) dom.customModal.style.display = 'none';
    }

    function importProjects() { if (dom.fileInput) dom.fileInput.click(); }

    function exportProjects() {
        const projects = localStorage.getItem('pulleyProjects');
        if (!projects || projects === '[]') { showModal('Não há projetos salvos para exportar.'); return; }
        const blob = new Blob([projects], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `projetos_polias_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

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
                    localStorage.setItem('pulleyProjects', JSON.stringify([...existingProjects, ...newProjects]));
                    loadProjects();
                    showModal(`${newProjects.length} projetos foram importados com sucesso!`);
                });
            } catch (error) {
                showModal(`Erro ao importar o ficheiro: ${error.message}`);
            } finally {
                dom.fileInput.value = '';
            }
        };
        reader.readAsText(file);
    }

    function init() {
        if (!DB || !DB.pulleys || !DB.serviceFactors) return;
        populateSelect(dom.tipoCorreia, Object.keys(DB.pulleys), (opt) => ({ value: opt, text: opt }));
        const sfOpts = Object.values(DB.serviceFactors);
        populateSelect(dom.fatorServico, sfOpts, (opt) => ({ value: opt.value, text: `FS ${opt.value} - ${opt.text}` }));
        populateSelect(dom.revFatorServico, sfOpts, (opt) => ({ value: opt.value, text: `FS ${opt.value} - ${opt.text}` }));

        updatePulleySelects();
        loadFormState();
        setupEventListeners();
        loadProjects();
    }

    init();
});
