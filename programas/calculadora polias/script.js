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

    // --- LÓGICA DE CÁLCULO ---
    function performCalculations(params) {
        const { rpm, power, fs, d1, d2, c, profile } = params;
        if ([rpm, power, fs, d1, d2, c].some(p => !p || p <= 0) || !profile || !DB?.powerTables?.[profile] || !DB?.belts?.[profile]) {
            return { success: false, error: 'Parâmetros ou dados de DB inválidos.' };
        }
        const designPower = power * fs;
        const ratio = d2 / d1;
        const powerTable = DB.powerTables[profile];
        const nominalBeltPower = (powerTable.baseHp * (rpm / 1750)) + ((ratio > 1) ? ((ratio - 1) * powerTable.ratioFactor) : 0);
        const L = 2 * c + (Math.PI * (d1 + d2) / 2) + ((d2 - d1) ** 2) / (4 * c);
        const angle = 180 - 2 * Math.asin((d2 - d1) / (2 * c)) * (180 / Math.PI);
        if (isNaN(angle)) return { success: false, error: 'Geometria inválida.' };
        const Ka = angle < 180 ? 1 - (0.003 * (180 - angle)) : 1.0;
        const bestFitBelt = findBestFit(L, DB.belts[profile]);
        const correctedBeltPower = nominalBeltPower * Ka;
        if (correctedBeltPower <= 0) return { success: false, error: 'Potência corrigida inválida.' };
        const numBelts = Math.ceil(designPower / correctedBeltPower);
        const rpmFinal = rpm * (d1 / d2);
        const beltSpeed = (d1 * rpm * Math.PI) / 60000;
        const shaftLoad = (2 * (designPower * 735.5) / beltSpeed) / 9.81;
        const vibrationFreq = beltSpeed / (L / 1000);
        const beltName = `${profile}${Math.round(bestFitBelt / 25.4)}0`;
        return {
            success: true,
            data: { name: params.name || 'Projeto', rpm, power, fs, d1, d2, c, profile, rpmFinal, ratio, L, beltSpeed, angle, numBelts, shaftLoad, vibrationFreq, beltName }
        };
    }

    // --- LÓGICA DOS MÓDULOS ---
    function runDirectCalculation() {
        if (!validateInputs(true)) return showModal('Por favor, corrija os campos inválidos.');
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
        if (!validateInputs(false)) return showModal('Por favor, corrija os campos inválidos.');
        const params = {
            rpmMotor: parseFloat(dom.revRpmMotor.value),
            targetRpm: parseFloat(dom.revRpmFinal.value),
            power: parseFloat(dom.revPotenciaMotor.value),
            fs: parseFloat(dom.revFatorServico.value)
        };
        const solutions = [];
        Object.keys(DB.pulleys).forEach(profile => {
            DB.pulleys[profile].forEach(d1 => {
                const targetD2 = d1 * (params.rpmMotor / params.targetRpm);
                const d2 = findBestFit(targetD2, DB.pulleys[profile]);
                if (d2 <= d1) return;
                const rpmFinal = params.rpmMotor * (d1 / d2);
                if (Math.abs(rpmFinal - params.targetRpm) / params.targetRpm <= 0.05) {
                    const c = 2 * (d1 + d2);
                    const result = performCalculations({ rpm: params.rpmMotor, power: params.power, fs: params.fs, d1, d2, c, profile });
                    if (result.success && result.data.angle >= 120) {
                        solutions.push({ ...result.data, cost: (d1 + d2) * 2 + result.data.L * 0.1 });
                    }
                }
            });
        });
        solutions.sort((a, b) => a.cost - b.cost);
        displayOptimizationResults(solutions.slice(0, 50));
    }

    // --- ATUALIZAÇÃO DA UI ---
    function updateDirectResultsUI(r) {
        if (!r) return resetResults();

        // Mapeia os dados do resultado para os elementos do DOM
        const resultsMap = {
            beltName: dom.resultadoCorreia,
            numBelts: dom.resultadoNumCorreias,
            rpmFinal: dom.resultadoRpm,
            ratio: dom.resultadoRelacao,
            beltSpeed: dom.resultadoVelocidade,
            angle: dom.resultadoAngulo,
            shaftLoad: dom.resultadoForca,
            vibrationFreq: dom.resultadoFrequencia,
        };

        for (const key in resultsMap) {
            if (resultsMap[key] && r[key] !== undefined) {
                const value = r[key];
                if (typeof value === 'number' && key !== 'numBelts') {
                    resultsMap[key].textContent = value.toFixed(2);
                } else {
                    resultsMap[key].textContent = value;
                }
            }
        }
        
        updateCardStatus(dom.velocidadeCorreiaCard, r.beltSpeed, 30, 35, false);
        updateCardStatus(dom.anguloAbracamentoCard, r.angle, 120, 100, true);

        if (dom['results-card']) dom['results-card'].style.display = 'block';
        if (dom['diagram-card']) dom['diagram-card'].style.display = 'block';
    }


    function displayOptimizationResults(solutions) {
        const tbody = dom.solutionsTable.querySelector('tbody');
        tbody.innerHTML = solutions.length === 0 ? '<tr><td colspan="6">Nenhuma solução encontrada.</td></tr>' :
            solutions.map(sol => `<tr>
                <td>${sol.profile}</td><td>${sol.d1} mm</td><td>${sol.d2} mm</td>
                <td>${sol.beltName}</td><td>R$ ${sol.cost.toFixed(2)}</td>
                <td><button class="action-button" data-solution='${JSON.stringify(sol)}'>Usar</button></td>
            </tr>`).join('');
    }

    // --- DIAGRAMA ---
    function drawDiagram(r) {
        const svg = dom.transmissionDiagram;
        if (!svg || !r || !r.d1 || !r.d2 || !r.c) return;
        const w = svg.clientWidth, h = svg.clientHeight, p = 50;
        const totalWidth = r.d1 / 2 + r.c + r.d2 / 2;
        const scale = (w - p * 2) / totalWidth;
        const r1 = r.d1 / 2 * scale, r2 = r.d2 / 2 * scale, cs = r.c * scale;
        const cx1 = p + r1, cx2 = cx1 + cs, cy = h / 2;
        const alpha = Math.asin((r2 - r1) / cs);
        svg.innerHTML = `<line x1="${cx1}" y1="${cy}" x2="${cx2}" y2="${cy}" class="center-line" /><path d="M ${cx1+r1*Math.sin(alpha)} ${cy-r1*Math.cos(alpha)} L ${cx2+r2*Math.sin(alpha)} ${cy-r2*Math.cos(alpha)} A ${r2} ${r2} 0 ${Math.PI-2*alpha > Math.PI?1:0} 1 ${cx2-r2*Math.sin(alpha)} ${cy+r2*Math.cos(alpha)} L ${cx1-r1*Math.sin(alpha)} ${cy+r1*Math.cos(alpha)} A ${r1} ${r1} 0 ${Math.PI-2*alpha > Math.PI?1:0} 1 ${cx1+r1*Math.sin(alpha)} ${cy-r1*Math.cos(alpha)}" class="belt" /><circle cx="${cx1}" cy="${cy}" r="${r1}" class="pulley" /><circle cx="${cx2}" cy="${cy}" r="${r2}" class="pulley" /><text x="${cx1}" y="${cy}" class="diagram-text">${r.d1}mm</text><text x="${cx2}" y="${cy}" class="diagram-text">${r.d2}mm</text>`;
    }

    // --- PROJETOS SALVOS ---
    function saveProject() {
        if (!currentResults.rpmFinal) {
            return showModal('Calcule um projeto antes de salvar.');
        }
        const projectName = dom.projectName.value.trim();
        if (!projectName) {
            return showModal('Por favor, insira um nome para o projeto.');
        }
        
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        const projectData = { ...currentResults, name: projectName };
        
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
            loadProjects();
            showModal(`Projeto "${projectName}" salvo com sucesso!`);
        }
    }

    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem('pulleyProjects')) || [];
        const projectList = dom.projectList;
        if (!projectList) return;
        
        projectList.innerHTML = '';
        if (projects.length === 0) {
            projectList.innerHTML = '<p>Nenhum projeto salvo.</p>';
            return;
        }
        
        projects.forEach((proj, index) => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = `<span>${proj.name}</span> <button class="delete-project-btn" data-index="${index}"><i class="fas fa-trash"></i></button>`;
            item.addEventListener('click', () => loadSolutionIntoDirectForm(proj));
            projectList.appendChild(item);
        });
    }

    // --- FUNÇÕES AUXILIARES E DE SETUP ---
    function setupEventListeners() {
        dom.calcularBtn?.addEventListener('click', runDirectCalculation);
        dom.optimizeBtn?.addEventListener('click', runReverseOptimization);
        dom.resetBtn?.addEventListener('click', resetForm);
        dom.printBtn?.addEventListener('click', () => window.print());
        dom.saveProjectBtn?.addEventListener('click', saveProject);

        dom.tipoCorreia?.addEventListener('change', updatePulleySelects);

        if (dom['floating-menu-button']) {
            dom['floating-menu-button'].addEventListener('click', (event) => {
                event.stopPropagation();
                const menu = dom['floating-menu'];
                if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
        }

        document.querySelectorAll('#floating-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const optionId = e.currentTarget.id;
                const targetModuleId = optionId.replace('-option', '-module');
                switchView(targetModuleId);
                if (dom['floating-menu']) dom['floating-menu'].style.display = 'none';
            });
        });
        
        document.addEventListener('click', (event) => {
            const menu = dom['floating-menu'];
            const button = dom['floating-menu-button'];
            if (menu && button && menu.style.display === 'block' && !menu.contains(event.target) && !button.contains(event.target)) {
                menu.style.display = 'none';
            }
        });
        
        dom.solutionsTable?.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                loadSolutionIntoDirectForm(JSON.parse(e.target.dataset.solution));
            }
        });
        
        dom.modalConfirmBtn?.addEventListener('click', () => { modalCallback?.(); hideModal(); });
        dom.modalCancelBtn?.addEventListener('click', hideModal);
    }

    function validateInputs(isDirect) {
        const ids = isDirect ? ['rpmMotor', 'potenciaMotor', 'distanciaEixos', 'diametroMotora', 'diametroMovida'] : ['revRpmMotor', 'revRpmFinal', 'revPotenciaMotor'];
        let isValid = true;
        ids.forEach(id => {
            const el = dom[id];
            if (!el || !el.value || parseFloat(el.value) <= 0) {
                el?.classList.add('invalid');
                isValid = false;
            } else {
                el.classList.remove('invalid');
            }
        });
        return isValid;
    }

    function resetForm() {
        ['direct-calculation-module', 'reverse-calculation-module'].forEach(id => dom[id]?.querySelector('form')?.reset());
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        resetResults();
        if(dom["diagram-card"]) dom["diagram-card"].style.display = 'none';
        currentResults = {};
    }
    
    function resetResults() {
        if(dom["results-card"]) dom["results-card"].style.display = 'none';
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
        return options.reduce((p, c) => Math.abs(c - target) < Math.abs(p - target) ? c : p);
    }

    function updateCardStatus(card, value, warn, danger, higherIsBetter) {
        if (!card) return;
        card.classList.remove('warning', 'danger', 'success');
        const isDanger = higherIsBetter ? value < danger : value > danger;
        const isWarning = higherIsBetter ? value < warn : value > warn;
        if (isDanger) card.classList.add('danger');
        else if (isWarning) card.classList.add('warning');
        else card.classList.add('success');
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
        ['direct-calculation-module', 'reverse-calculation-module', 'saved-projects-module'].forEach(id => {
            if(dom[id]) dom[id].style.display = id === targetModuleId ? 'block' : 'none';
        });
        const isDirect = targetModuleId === 'direct-calculation-module';
        dom['direct-results-container'].style.display = isDirect ? 'block' : 'none';
        dom['reverse-results-container'].style.display = targetModuleId === 'reverse-calculation-module' ? 'block' : 'none';
        if (isDirect) {
            if (currentResults.rpmFinal) updateDirectResultsUI(currentResults);
            else resetResults();
        }
    }

    function init() {
        if (typeof DB === 'undefined') return showModal("Erro crítico: A base de dados não foi carregada.");
        
        const formatter = (opt) => ({ value: opt.value, text: `FS ${opt.value} - ${opt.text}` });
        populateSelect(dom.tipoCorreia, Object.keys(DB.pulleys), (opt) => ({ value: opt, text: opt }));
        populateSelect(dom.fatorServico, Object.values(DB.serviceFactors || {}), formatter);
        populateSelect(dom.revFatorServico, Object.values(DB.serviceFactors || {}), formatter);
        
        updatePulleySelects();
        setupEventListeners();
        switchView('direct-calculation-module');
        loadProjects();
    }
    
    function updatePulleySelects() {
        const profile = dom.tipoCorreia.value;
        if (!profile || !DB.pulleys[profile]) return;
        const formatter = (opt) => ({ value: opt, text: `${opt} mm` });
        const currentMotor = dom.diametroMotora.value;
        const currentMovida = dom.diametroMovida.value;
        populateSelect(dom.diametroMotora, DB.pulleys[profile], formatter);
        populateSelect(dom.diametroMovida, DB.pulleys[profile], formatter);
        dom.diametroMotora.value = currentMotor;
        dom.diametroMovida.value = currentMovida;
    }

    function populateSelect(el, options, formatter) {
        if (!el) return;
        const currentValue = el.value;
        el.innerHTML = '';
        options.forEach(opt => {
            const option = formatter(opt);
            el.add(new Option(option.text, option.value))
        });
        el.value = currentValue;
    }

    init();
});