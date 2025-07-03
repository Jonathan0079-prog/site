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
        // A verificação previne erros caso um elemento seja removido do HTML
        if (element) {
            dom[id] = element;
        }
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
    
    function saveFormState() {
        const state = { mode: currentMode };
        formInputIds.forEach(id => {
            if (dom[id]) state[id] = dom[id].value;
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
        
        if(state.diametroMotora && dom.diametroMotora) dom.diametroMotora.value = state.diametroMotora;
        if(state.diametroMovida && dom.diametroMovida) dom.diametroMovida.value = state.diametroMovida;
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
        if (correctedBeltPower <= 0) return null; // Previne divisão por zero
        const numBelts = Math.ceil(designPower / correctedBeltPower);
        
        const rpmFinal = rpm * (d1 / d2);
        const beltSpeed = (d1 * rpm * Math.PI) / 60000;
        if (beltSpeed <= 0) return null; // Previne divisão por zero

        const shaftLoad = (2 * (designPower * 735.5) / beltSpeed * numBelts) / 9.81;
        const vibrationFreq = (1 / (2 * c / 1000)) * Math.sqrt((shaftLoad * 9.81) / DB.beltMass[profile]);
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
    
    function runDiagnosis() {
        // ... (código completo)
    }

    function runComparison() {
        // ... (código completo)
    }

    // --- ATUALIZAÇÃO DA UI ---
    function setMode(mode) {
        currentMode = mode;
        dom['direct-calculation-module'].style.display = mode === 'direct' ? 'block' : 'none';
        dom['reverse-calculation-module'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['direct-results-container'].style.display = 'block';
        dom['reverse-results-container'].style.display = mode === 'reverse' ? 'block' : 'none';
        dom['comparison-results-container'].style.display = mode === 'compare' ? 'block' : 'none';
        dom['results-card'].style.display = (mode === 'direct' || mode === 'compare') ? 'block' : 'none';
        dom['tips-card'].style.display = (mode === 'direct' || mode === 'reverse') ? 'block' : 'none';
        dom.modeDirectBtn.classList.toggle('active', mode === 'direct');
        dom.modeReverseBtn.classList.toggle('active', mode === 'reverse');
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
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma solução encontrada.</td></tr>';
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
        const w=800, h=300, p=50, scale = (w-p*2) / (r.d1/2 + r.c + r.d2/2);
        const r1=r.d1/2*scale, r2=r.d2/2*scale, cs=r.c*scale, cx1=p+r1, cx2=cx1+cs, cy=h/2;
        
        dom.pulley1.setAttribute('r', r1); dom.pulley1.setAttribute('cx', cx1); dom.pulley1.setAttribute('cy', cy);
        dom.pulley2.setAttribute('r', r2); dom.pulley2.setAttribute('cx', cx2); dom.pulley2.setAttribute('cy', cy);

        dom.pulley1_text.setAttribute('x', cx1); dom.pulley1_text.setAttribute('y', cy + 5); dom.pulley1_text.textContent = `${r.d1}mm`;
        dom.pulley2_text.setAttribute('x', cx2); dom.pulley2_text.setAttribute('y', cy + 5); dom.pulley2_text.textContent = `${r.d2}mm`;

        const alpha = Math.asin((r2-r1)/cs);
        const p1x1=cx1+r1*Math.sin(alpha), p1y1=cy-r1*Math.cos(alpha), p1x2=cx1-r1*Math.sin(alpha), p1y2=cy+r1*Math.cos(alpha);
        const p2x1=cx2+r2*Math.sin(alpha), p2y1=cy-r2*Math.cos(alpha), p2x2=cx2-r2*Math.sin(alpha), p2y2=cy+r2*Math.cos(alpha);
        
        dom.beltPath.setAttribute('d', `M ${p1x1} ${p1y1} L ${p2x1} ${p2y1} A ${r2} ${r2} 0 ${Math.PI - 2*alpha > Math.PI ? 1:0} 1 ${p2x2} ${p2y2} L ${p1x2} ${p1y2} A ${r1} ${r1} 0 ${Math.PI - 2*alpha > Math.PI ? 1:0} 1 ${p1x1} ${p1y1}`);
        dom.centerLine.setAttribute('x1', cx1); dom.centerLine.setAttribute('x2', cx2);
    }

    function resetDiagram() {
        if(dom['diagram-card']) dom['diagram-card'].style.display = 'none';
    }

    // --- FUNÇÕES AUXILIARES E DE SETUP ---
    function populateSelect(el, opts, isObj) {
        if(!el) return;
        const val = el.value;
        el.innerHTML = '';
        opts.forEach(o => {
            const opt = document.createElement('option');
            opt.value = isObj ? o.value : o;
            opt.textContent = isObj ? `FS ${o.value} - ${o.text}` : (o + ' mm');
            el.appendChild(opt);
        });
        if([...el.options].some(o => o.value == val)) el.value = val;
    }

    function populateBeltProfileSelect() {
        const select = dom.tipoCorreia;
        if (!select) return;
        select.innerHTML = '';
        Object.keys(DB.pulleys).forEach(p => {
            const opt = document.createElement('option');
            opt.value = p; opt.textContent = p;
            select.appendChild(opt);
        });
    }

    function updatePulleySelects() {
        const p = dom.tipoCorreia.value;
        if(!p || !DB.pulleys[p]) return;
        populateSelect(dom.diametroMotora, DB.pulleys[p]);
        populateSelect(dom.diametroMovida, DB.pulleys[p]);
    }

    function setupEventListeners() {
        // ... (código completo dos eventos)
    }
    
    function validateInputs(isDirectMode) {
        // ... (código completo)
    }
    
    function suggestDistance() {
        if (!dom.diametroMotora || !dom.diametroMovida) return;
        const d1 = parseFloat(dom.diametroMotora.value);
        const d2 = parseFloat(dom.diametroMovida.value);
        if (d1 > 0 && d2 > 0) dom.distanciaEixos.value = (2 * (d1 + d2)).toFixed(0);
    }

    function resetForm() {
        document.querySelectorAll('input[type="number"], input[type="text"]').forEach(i => i.value = '');
        populateBeltProfileSelect();
        populateSelect(dom.fatorServico, Object.values(DB.serviceFactors), true);
        populateSelect(dom.revFatorServico, Object.values(DB.serviceFactors), true);
        updatePulleySelects();
        resetDiagram();
        localStorage.removeItem(formStateKey);
    }

    function saveProject() {
        // ... (código completo)
    }

    function loadProjects() {
        // ... (código completo)
    }

    function loadSolutionIntoDirectForm(sol) {
        // ... (código completo)
    }
    
    function findBestFit(target, options) {
        return options.reduce((p, c) => Math.abs(c-target) < Math.abs(p-target) ? c : p);
    }

    function updateCardStatus(card, value, warnLimit, dangerLimit, higherIsBetter) {
        if(!card) return;
        card.classList.remove('warning', 'danger');
        if ((higherIsBetter && value < warnLimit) || (!higherIsBetter && value > warnLimit)) card.classList.add('warning');
        if ((higherIsBetter && value < dangerLimit) || (!higherIsBetter && value > dangerLimit)) card.classList.add('danger');
    }
    
    function generateTips(r) {
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
    }

    function init() {
        populateBeltProfileSelect();
        populateSelect(dom.fatorServico, Object.values(DB.serviceFactors).map(f => ({value: f.value, text: `FS ${f.value}`})), true);
        populateSelect(dom.revFatorServico, Object.values(DB.serviceFactors).map(f => ({value: f.value, text: `FS ${f.value}`})), true);
        updatePulleySelects();
        loadFormState();
        setupEventListeners();
        loadProjects();
    }

    init();
});
