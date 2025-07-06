document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const dom = {};
    const ids = [
        'rpmMotor', 'potenciaMotor', 'fatorServico', 'tipoCorreia', 'diametroMotora', 'diametroMovida', 'distanciaEixos',
        'calcularBtn', 'resetBtn', 'printBtn', 'optimizeBtn', 'saveProjectBtn', 'importBtn', 'exportBtn', 'fileInput',
        'revRpmMotor', 'revRpmFinal', 'revPotenciaMotor', 'revFatorServico',
        'projectName', 'projectList',
        'direct-calculation-module', 'reverse-calculation-module', 'saved-projects-module',
        'direct-results-container', 'reverse-results-container',
        'results-card', 'diagram-card', 'solutionsTable',
        'resultadoCorreia', 'resultadoNumCorreias', 'resultadoRpm', 'resultadoRelacao', 'resultadoVelocidade',
        'resultadoAngulo', 'resultadoForca', 'resultadoFrequencia',
        'velocidadeCorreiaCard', 'anguloAbracamentoCard', 'forcaEixoCard', 'frequenciaVibracaoCard',
        'transmissionDiagram',
        'floating-menu-button', 'floating-menu',
        'customModal', 'modalMessage', 'modalConfirmBtn', 'modalCancelBtn'
    ];
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            dom[id] = element;
        }
    });

    // --- ESTADO DA APLICAÇÃO ---
    let currentResults = {};
    let modalCallback = null;
    const formStateKey = 'pulleyAppFormState';

    // --- LÓGICA DE CÁLCULO (função performCalculations mantida como antes) ---
    function performCalculations(params) {
        const { rpm, power, fs, d1, d2, c, profile } = params;

        if ([rpm, power, fs, d1, d2, c].some(p => !p || p <= 0) || !profile) {
            return { success: false, error: 'Parâmetros inválidos.' };
        }
        if (!DB?.powerTables?.[profile] || !DB?.belts?.[profile]) {
            return { success: false, error: `Dados para o perfil "${profile}" não encontrados.` };
        }

        const designPower = power * fs;
        const ratio = d2 / d1;
        const powerTable = DB.powerTables[profile];
        const nominalBeltPower = (powerTable.baseHp * (rpm / 1750)) + ((ratio > 1) ? ((ratio - 1) * powerTable.ratioFactor) : 0);
        
        const L = 2 * c + (Math.PI * (d1 + d2) / 2) + ((d2 - d1) ** 2) / (4 * c);
        const angle = 180 - 2 * Math.asin((d2 - d1) / (2 * c)) * (180 / Math.PI);
        if (isNaN(angle)) {
            return { success: false, error: 'Geometria inválida.' };
        }

        const Ka = angle < 180 ? 1 - (0.003 * (180 - angle)) : 1.0;
        const beltLengths = DB.belts[profile];
        const bestFitBelt = findBestFit(L, beltLengths);
        
        // Simulação simplificada de Kl
        const Kl = 1.0; 
        
        const correctedBeltPower = nominalBeltPower * Ka * Kl;
        if (correctedBeltPower <= 0) {
            return { success: false, error: 'Potência corrigida é zero ou negativa.' };
        }
        const numBelts = Math.ceil(designPower / correctedBeltPower);
        const rpmFinal = rpm * (d1 / d2);
        const beltSpeed = (d1 * rpm * Math.PI) / 60000;
        const shaftLoad = (2 * (designPower * 735.5) / (beltSpeed * numBelts)) / 9.81;
        const vibrationFreq = (beltSpeed / (L / 1000));
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;

        return {
            success: true,
            data: { name: params.name || 'Projeto', rpm, power, fs, d1, d2, c, profile, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName }
        };
    }


    // --- LÓGICA DOS MÓDULOS ---
    function runDirectCalculation() {
        if (!validateInputs(true)) {
            showModal('Por favor, corrija os campos inválidos.');
            return;
        }
        const params = {
            rpm: parseFloat(dom.rpmMotor.value),
            power: parseFloat(dom.potenciaMotor.value),
            fs: parseFloat(dom.fatorServico.value),
            d1: parseFloat(dom.diametroMotora.value),
            d2: parseFloat(dom.diametroMovida.value),
            c: parseFloat(dom.distanciaEixos.value),
            profile: dom.tipoCorreia.value
        };
        const result = performCalculations(params);

        if (result.success) {
            currentResults = result.data;
            updateDirectResultsUI(currentResults);
            drawDiagram(currentResults);
        } else {
            showModal(`Cálculo falhou: ${result.error}`);
            resetResults();
        }
    }

    function runReverseOptimization() {
        if (!validateInputs(false)) {
            showModal('Por favor, corrija os campos inválidos.');
            return;
        }
        const params = {
            rpmMotor: parseFloat(dom.revRpmMotor.value),
            targetRpm: parseFloat(dom.revRpmFinal.value),
            power: parseFloat(dom.revPotenciaMotor.value),
            fs: parseFloat(dom.revFatorServico.value)
        };
        const tolerance = 0.05;
        let solutions = [];

        Object.keys(DB.pulleys).forEach(profile => {
            DB.pulleys[profile].forEach(d1 => {
                const targetD2 = d1 * (params.rpmMotor / params.targetRpm);
                const d2 = findBestFit(targetD2, DB.pulleys[profile]);
                if (d2 <= d1) return;

                const rpmFinal = params.rpmMotor * (d1 / d2);

                if (Math.abs(rpmFinal - params.targetRpm) / params.targetRpm <= tolerance) {
                    const c = 2 * (d1 + d2);
                    const result = performCalculations({ rpm: params.rpmMotor, power: params.power, fs: params.fs, d1, d2, c, profile });
                    if (result.success && result.data.angle >= 120) {
                        const cost = (d1 + d2) * 2 + result.data.L * 0.1; // Custo simplificado
                        solutions.push({ ...result.data, cost });
                    }
                }
            });
        });

        solutions.sort((a, b) => a.cost - b.cost);
        displayOptimizationResults(solutions.slice(0, 50));
    }


    // --- ATUALIZAÇÃO DA UI ---
    function updateDirectResultsUI(r) {
        if (!r) {
            resetResults();
            return;
        }
        Object.keys(r).forEach(key => {
            const el = dom[`resultado${key.charAt(0).toUpperCase() + key.slice(1)}`];
            if (el) {
                const value = r[key];
                if (typeof value === 'number') {
                    el.textContent = value.toFixed(key === 'ratio' || key === 'beltSpeed' ? 2 : (key === 'angle' || key === 'vibrationFreq' ? 1 : 0));
                } else {
                    el.textContent = value;
                }
            }
        });
        
        dom.resultadoCorreia.textContent = r.beltName;
        dom.resultadoNumCorreias.textContent = r.numBelts;
        
        updateCardStatus(dom.velocidadeCorreiaCard, r.beltSpeed, 30, 35, false);
        updateCardStatus(dom.anguloAbracamentoCard, r.angle, 120, 100, true);

        if (dom.results-card) dom.results-card.style.display = 'block';
        if (dom.diagram-card) dom.diagram-card.style.display = 'block';
    }

    function displayOptimizationResults(solutions) {
        const tbody = dom.solutionsTable.querySelector('tbody');
        tbody.innerHTML = '';
        if (solutions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma solução encontrada.</td></tr>';
            return;
        }
        solutions.forEach(sol => {
            const row = `<tr>
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
    function drawDiagram(r) {
        const svg = dom.transmissionDiagram;
        if (!svg || !r || !r.d1 || !r.d2 || !r.c) return;

        const w = svg.clientWidth;
        const h = svg.clientHeight;
        const p = 50; // Padding

        const totalWidth = r.d1 / 2 + r.c + r.d2 / 2;
        const scale = (w - p * 2) / totalWidth;

        const r1 = r.d1 / 2 * scale;
        const r2 = r.d2 / 2 * scale;
        const cs = r.c * scale;

        const cx1 = p + r1;
        const cx2 = cx1 + cs;
        const cy = h / 2;

        const alpha = Math.asin((r2 - r1) / cs);

        svg.innerHTML = `
            <line x1="${cx1}" y1="${cy}" x2="${cx2}" y2="${cy}" class="center-line" />
            <path d="M ${cx1 + r1 * Math.sin(alpha)} ${cy - r1 * Math.cos(alpha)} 
                     L ${cx2 + r2 * Math.sin(alpha)} ${cy - r2 * Math.cos(alpha)} 
                     A ${r2} ${r2} 0 ${Math.PI - 2 * alpha > Math.PI ? 1:0} 1 ${cx2 - r2*Math.sin(alpha)} ${cy + r2*Math.cos(alpha)}
                     L ${cx1 - r1 * Math.sin(alpha)} ${cy + r1 * Math.cos(alpha)}
                     A ${r1} ${r1} 0 ${Math.PI - 2 * alpha > Math.PI ? 1:0} 1 ${cx1 + r1*Math.sin(alpha)} ${cy - r1*Math.cos(alpha)}"
                  class="belt" />
            <circle cx="${cx1}" cy="${cy}" r="${r1}" class="pulley" />
            <circle cx="${cx2}" cy="${cy}" r="${r2}" class="pulley" />
            <text x="${cx1}" y="${cy}" class="diagram-text">${r.d1}mm</text>
            <text x="${cx2}" y="${cy}" class="diagram-text">${r.d2}mm</text>
        `;
    }

    // --- FUNÇÕES AUXILIARES E DE SETUP ---
    function populateSelect(el, options, formatter) {
        if (!el) return;
        el.innerHTML = '';
        options.forEach(optData => {
            const { value, text } = formatter(optData);
            el.add(new Option(text, value));
        });
    }

    function setupEventListeners() {
        dom.calcularBtn?.addEventListener('click', runDirectCalculation);
        dom.optimizeBtn?.addEventListener('click', runReverseOptimization);
        dom.resetBtn?.addEventListener('click', resetForm);
        dom.printBtn?.addEventListener('click', () => window.print());

        dom.tipoCorreia?.addEventListener('change', updatePulleySelects);

        // Menu flutuante
        dom['floating-menu-button']?.addEventListener('click', () => {
            const menu = dom['floating-menu'];
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        document.querySelectorAll('#floating-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const optionId = e.currentTarget.id;
                const targetModuleId = optionId.replace('-option', '-module');
                switchView(targetModuleId);
                dom['floating-menu'].style.display = 'none';
            });
        });
        
        dom.solutionsTable?.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                const sol = JSON.parse(e.target.dataset.solution);
                loadSolutionIntoDirectForm(sol);
                switchView('direct-calculation-module');
            }
        });
        
        dom.modalConfirmBtn?.addEventListener('click', () => { modalCallback?.(); hideModal(); });
        dom.modalCancelBtn?.addEventListener('click', hideModal);
    }

    function validateInputs(isDirectMode) {
        let isValid = true;
        const inputs = isDirectMode
            ? ['rpmMotor', 'potenciaMotor', 'distanciaEixos', 'diametroMotora', 'diametroMovida']
            : ['revRpmMotor', 'revRpmFinal', 'revPotenciaMotor'];

        inputs.forEach(id => {
            const el = dom[id];
            if (el && (!el.value || parseFloat(el.value) <= 0)) {
                el.classList.add('invalid');
                isValid = false;
            } else if (el) {
                el.classList.remove('invalid');
            }
        });
        return isValid;
    }

    function resetForm() {
        const form = dom['direct-calculation-module'].querySelector('form') || dom['reverse-calculation-module'].querySelector('form');
        form?.reset();
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        resetResults();
        if (dom.diagram-card) dom.diagram-card.style.display = 'none';
        currentResults = {};
    }
    
    function resetResults() {
        if (dom.results-card) dom.results-card.style.display = 'none';
        Object.keys(dom).filter(k => k.startsWith('resultado')).forEach(id => dom[id].textContent = '--');
    }
    
    function loadSolutionIntoDirectForm(sol) {
        if (!sol) return;
        switchView('direct-calculation-module');
        
        dom.rpmMotor.value = sol.rpm;
        dom.potenciaMotor.value = sol.power;
        dom.fatorServico.value = sol.fs;
        dom.tipoCorreia.value = sol.profile;
        updatePulleySelects();

        setTimeout(() => {
            dom.diametroMotora.value = sol.d1;
            dom.diametroMovida.value = sol.d2;
            dom.distanciaEixos.value = sol.c.toFixed(0);
            runDirectCalculation();
        }, 100); 
    }
    
    function findBestFit(target, options) {
        return options.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
    }

    function updateCardStatus(card, value, warn, danger, higherIsBetter) {
        card.classList.remove('warning', 'danger', 'success');
        if ((higherIsBetter && value < danger) || (!higherIsBetter && value > danger)) {
            card.classList.add('danger');
        } else if ((higherIsBetter && value < warn) || (!higherIsBetter && value > warn)) {
            card.classList.add('warning');
        } else {
            card.classList.add('success');
        }
    }
    
    function showModal(message, type = 'alert', callback = null) {
        dom.modalMessage.textContent = message;
        modalCallback = callback;
        dom.modalConfirmBtn.style.display = type === 'confirm' ? 'inline-block' : 'none';
        dom.modalCancelBtn.textContent = type === 'confirm' ? 'Cancelar' : 'OK';
        dom.customModal.style.display = 'flex';
    }

    function hideModal() {
        dom.customModal.style.display = 'none';
    }

    function switchView(targetModuleId) {
        const modules = ['direct-calculation-module', 'reverse-calculation-module', 'saved-projects-module'];
        modules.forEach(id => {
            const el = dom[id];
            if (el) {
                el.style.display = id === targetModuleId ? 'block' : 'none';
            }
        });

        const isDirect = targetModuleId === 'direct-calculation-module';
        dom['direct-results-container'].style.display = isDirect ? 'block' : 'none';
        dom['reverse-results-container'].style.display = targetModuleId === 'reverse-calculation-module' ? 'block' : 'none';
        
        if (isDirect && currentResults.rpmFinal) {
             updateDirectResultsUI(currentResults);
        } else if (isDirect) {
            resetResults();
        }
    }

    function init() {
        if (typeof DB === 'undefined') {
            showModal("Erro crítico: A base de dados não foi carregada.");
            return;
        }

        populateSelect(dom.tipoCorreia, Object.keys(DB.pulleys), (opt) => ({ value: opt, text: opt }));
        const sfOpts = Object.values(DB.serviceFactors || {});
        populateSelect(dom.fatorServico, sfOpts, (opt) => ({ value: opt.value, text: `FS ${opt.value} - ${opt.text}` }));
        populateSelect(dom.revFatorServico, sfOpts, (opt) => ({ value: opt.value, text: `FS ${opt.value} - ${opt.text}` }));
        
        updatePulleySelects();
        setupEventListeners();
        switchView('direct-calculation-module');
    }
    
    function updatePulleySelects() {
        const profile = dom.tipoCorreia.value;
        if (!profile || !DB.pulleys[profile]) return;
        const pulleySizes = DB.pulleys[profile];
        const currentMotor = dom.diametroMotora.value;
        const currentMovida = dom.diametroMovida.value;
        
        populateSelect(dom.diametroMotora, pulleySizes, (opt) => ({ value: opt, text: `${opt} mm` }));
        populateSelect(dom.diametroMovida, pulleySizes, (opt) => ({ value: opt, text: `${opt} mm` }));

        dom.diametroMotora.value = currentMotor;
        dom.diametroMovida.value = currentMovida;
    }

    init();
});