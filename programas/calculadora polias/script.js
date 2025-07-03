document.addEventListener('DOMContentLoaded', () => {

    // --- BANCOS DE DADOS INTERNOS E CONSTANTES (AGORA EM DATABASE.JS)---

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const dom = {};
    const ids = [
        'rpmMotor', 'potenciaMotor', 'tipoCorreia', 'diametroMotora', 'diametroMovida', 'distanciaEixos',
        'calcularBtn', 'resetBtn', 'printBtn', 'modeDirectBtn', 'modeReverseBtn', 'optimizeBtn',
        'revRpmMotor', 'revRpmFinal', 'revPotenciaMotor', 'projectName', 'saveProjectBtn', 'projectList',
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

    // --- LÓGICA DE CÁLCULO ---
    function performCalculations(params) {
        const { name, rpm, power, d1, d2, c, profile } = params;
        if ([rpm, power, d1, d2, c, profile].some(p => p === null || p === undefined || (typeof p === 'number' && p <= 0))) return null;

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
        const numBelts = Math.ceil(power / correctedPower);

        const shaftLoad = (2 * (power * 735.5 / beltSpeed) * numBelts) / 9.81;
        const vibrationFreq = (1 / (2 * (c / 1000))) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]);

        const bestFitBelt = findBestFit(L, beltLengths);
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;

        return { name: name || 'Projeto Atual', rpm, power, profile, d1, d2, c, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName, bestFitBelt };
    }

    // --- LÓGICA DOS MÓDULOS ---

    function runDirectCalculation() {
        if (!validateInputs(true)) { showModal('Por favor, corrija os campos inválidos.'); return; }
        const params = {
            rpm: parseFloat(dom.rpmMotor.value), power: parseFloat(dom.potenciaMotor.value),
            d1: parseFloat(dom.diametroMotora.value), d2: parseFloat(dom.diametroMovida.value),
            c: parseFloat(dom.distanciaEixos.value), profile: dom.tipoCorreia.value
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
        const tolerance = 0.05;
        let solutions = [];

        Object.keys(DB.pulleys).forEach(profile => {
            DB.pulleys[profile].forEach(d1 => {
                const targetD2 = d1 * (rpmMotor / targetRpm);
                const d2 = findBestFit(targetD2, DB.pulleys[profile]);
                const rpmFinal = rpmMotor * (d1 / d2);

                if (Math.abs(rpmFinal - targetRpm) / targetRpm <= tolerance) {
                    const c = 2 * (d1 + d2);
                    const results = performCalculations({ rpm: rpmMotor, power, d1, d2, c, profile });
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
        let diagnosis = "Selecione um problema para analisar.";
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
        dom['direct-calculation-module'].style.display = mode === 'direct' ? 'block' : 'none';
        dom['reverse-calculation-module'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['direct-results-container'].style.display = mode === 'direct' ? 'block' : 'none';
        dom['reverse-results-container'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['comparison-results-container'].style.display = mode === 'compare' ? 'block' : 'none';
        dom['tips-card'].style.display = (mode === 'direct' || mode === 'reverse') ? 'block' : 'none';
        dom.modeDirectBtn.classList.toggle('active', mode === 'direct');
        dom.modeReverseBtn.classList.toggle('active', mode === 'reverse');
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

    function populateSelect(selectElement, options, isObject = false) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = '';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = isObject ? opt.value : opt;
            option.textContent = isObject ? opt.text : opt;
            selectElement.appendChild(option);
        });
        if (Array.from(selectElement.options).some(opt => opt.value == currentValue)) {
            selectElement.value = currentValue;
        }
    }

    function populateBeltProfileSelect() {
        populateSelect(dom.tipoCorreia, Object.keys(DB.pulleys));
    }

    // --- IMPORTAÇÃO E EXPORTAÇÃO ---
    function exportProjects() {
        const projects = localStorage.getItem('pulleyProjects');
        if (!projects || projects === '[]') {
            showModal('Não há projetos salvos para exportar.');
            return;
        }
        const blob = new Blob([projects], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `projetos_polias_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importProjects() { dom.fileInput.click(); }

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
                    const mergedProjects = [...existingProjects, ...newProjects];
                    localStorage.setItem('pulleyProjects', JSON.stringify(mergedProjects));
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

    // --- MODAL PERSONALIZADO ---
    function showModal(message, type = 'alert', callback = null) {
        dom.modalMessage.textContent = message;
        modalCallback = callback;
        if (type === 'confirm') {
            dom.modalConfirmBtn.style.display = 'inline-block';
            dom.modalCancelBtn.textContent = 'Cancelar';
        } else {
            dom.modalConfirmBtn.style.display = 'none';
            dom.modalCancelBtn.textContent = 'OK';
        }
        dom.customModal.style.display = 'flex';
    }

    function hideModal() { dom.customModal.style.display = 'none'; }

    // --- FUNÇÕES DE SETUP E EVENTOS ---
    function setupEventListeners() {
        dom.modeDirectBtn.addEventListener('click', () => setMode('direct'));
        dom.modeReverseBtn.addEventListener('click', () => setMode('reverse'));
        dom.calcularBtn.addEventListener('click', runDirectCalculation);
        dom.optimizeBtn.addEventListener('click', runReverseOptimization);
        dom.resetBtn.addEventListener('click', resetForm);
        dom.printBtn.addEventListener('click', () => window.print());
        dom.diametroMotora.addEventListener('change', suggestDistance);
        dom.diametroMovida.addEventListener('change', suggestDistance);
        dom.saveProjectBtn.addEventListener('click', saveProject);
        dom.projectList.addEventListener('click', handleProjectListClick);
        dom.compareBtn.addEventListener('click', runComparison);
        dom.failureType.addEventListener('change', runDiagnosis);
        dom.importBtn.addEventListener('click', importProjects);
        dom.exportBtn.addEventListener('click', exportProjects);
        dom.fileInput.addEventListener('change', handleFileSelect);
        dom.modalConfirmBtn.addEventListener('click', () => {
            if (modalCallback) modalCallback();
            hideModal();
        });
        dom.modalCancelBtn.addEventListener('click', hideModal);
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => input.classList.remove('invalid'));
        });
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
            [dom.rpmMotor, dom.potenciaMotor, dom.distanciaEixos, dom.diametroMotora, dom.diametroMovida] :
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

    function suggestDistance() {
        if (dom.diametroMotora.value && dom.diametroMovida.value) {
            const d1 = parseFloat(dom.diametroMotora.value);
            const d2 = parseFloat(dom.diametroMovida.value);
            if (d1 > 0 && d2 > 0) {
                dom.distanciaEixos.value = (2 * (d1 + d2)).toFixed(0);
            }
        }
    }

    function resetForm() {
        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => input.value = '');
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        populateBeltProfileSelect();

        const resultFields = ['resultadoRpm', 'resultadoRelacao', 'resultadoCorreia', 'resultadoNumCorreias', 'resultadoVelocidade', 'resultadoAngulo', 'resultadoForca', 'resultadoFrequencia'];
        resultFields.forEach(id => dom[id] ? dom[id].textContent = '--' : null);

        const resultCards = ['velocidadeCorreiaCard', 'anguloAbracamentoCard', 'forcaEixoCard', 'frequenciaVibracaoCard'];
        resultCards.forEach(id => dom[id] ? dom[id].classList.remove('warning', 'danger') : null);

        dom.dicasLista.innerHTML = '<li>Preencha os dados e clique em "Calcular".</li>';
        currentResults = {};
    }

    function saveProject() {
        if (!currentResults.rpm) { showModal('Calcule um projeto antes de salvar.'); return; }
        const projectName = dom.projectName.value.trim();
        if (!projectName) { showModal('Por favor, dê um nome ao projeto.'); return; }
        const { rpm, power, profile, d1, d2, c } = currentResults;
        const projectData = { name: projectName, rpm, power, profile, d1, d2, c };
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        projects.push(projectData);
        localStorage.setItem('pulleyProjects', JSON.stringify(projects));
        dom.projectName.value = '';
        loadProjects();
    }

    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        const options = projects.map((p, i) => ({ value: i, text: p.name }));
        populateSelect(dom.compareProject1, options, true);
        populateSelect(dom.compareProject2, options, true);
        dom.projectList.innerHTML = '';
        projects.forEach((proj, index) => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = `<span data-index="${index}">${proj.name}</span><button class="delete-project-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>`;
            dom.projectList.appendChild(item);
        });
    }

    function handleProjectListClick(e) {
        const index = e.target.dataset.index;
        if (index === undefined) return;
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        if (e.target.closest('.delete-project-btn')) {
            showModal(`Tem a certeza que deseja apagar o projeto "${projects[index].name}"?`, 'confirm', () => {
                projects.splice(index, 1);
                localStorage.setItem('pulleyProjects', JSON.stringify(projects));
                loadProjects();
            });
        } else if (e.target.tagName === 'SPAN') {
            loadSolutionIntoDirectForm(projects[index]);
        }
    }

    function loadSolutionIntoDirectForm(sol) {
        dom.rpmMotor.value = sol.rpm;
        dom.potenciaMotor.value = sol.power;
        dom.tipoCorreia.value = sol.profile;
        dom.diametroMotora.value = sol.d1;
        dom.diametroMovida.value = sol.d2;
        dom.distanciaEixos.value = sol.c.toFixed(0);
        setMode('direct');
        runDirectCalculation();
    }

    function findBestFit(target, options) {
        return options.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
    }

    function updateCardStatus(card, value, warnLimit, dangerLimit, higherIsBetter = true) {
        card.classList.remove('warning', 'danger');
        if (higherIsBetter) {
            if (value >= dangerLimit) card.classList.add('danger');
            else if (value >= warnLimit) card.classList.add('warning');
        } else {
            if (value <= dangerLimit) card.classList.add('danger');
            else if (value <= warnLimit) card.classList.add('warning');
        }
    }

    function generateTips({ velocidadeCorreia, angulo, relacao }) {
        dom.dicasLista.innerHTML = '';
        const addTip = (text, type = 'info') => {
            const li = document.createElement('li');
            li.textContent = text;
            li.className = type;
            dom.dicasLista.appendChild(li);
        };
        if (relacao > 7) addTip('Relações de transmissão muito altas (>7:1) podem causar deslizamento e exigir polias especiais.', 'warning');
        if (velocidadeCorreia > 33) addTip('Velocidade da correia acima de 33 m/s. Polias podem precisar de balanceamento dinâmico.', 'warning');
        if (angulo < 120) addTip('Ângulo de abraçamento baixo. A capacidade de transmissão de potência é reduzida. Considere aumentar a distância entre eixos.', 'danger');
        addTip('Para projetos críticos, sempre consulte os catálogos técnicos dos fabricantes de correias para obter os dados completos.');
    }

    function init() {
        setupEventListeners();
        populateBeltProfileSelect();
        loadProjects();
        resetForm();
    }

    init();
});
