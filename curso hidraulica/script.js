document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURAÇÃO ---
    const TEMPO_POR_MODULO_SEGUNDOS = 10; // Tempo mínimo em cada módulo

    // --- ELEMENTOS DA INTERFACE ---
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    
    // --- VARIÁVEIS DE ESTADO ---
    let currentModuleIndex = 0;
    let highestUnlockedModule = 0;
    const totalModules = modules.length;

    // Variáveis para controlar os temporizadores
    let unlockTimer = null;
    let countdownInterval = null;

    /**
     * INICIALIZAÇÃO DO CURSO
     */
    function inicializarCurso() {
        const savedHighest = parseInt(localStorage.getItem('highestUnlockedModule') || '0', 10);
        highestUnlockedModule = savedHighest;

        const savedCurrent = parseInt(localStorage.getItem('currentModuleIndex') || '0', 10);
        currentModuleIndex = Math.min(savedCurrent, highestUnlockedModule);

        showModule(currentModuleIndex);
    }

    /**
     * FUNÇÃO PRINCIPAL: MOSTRA UM MÓDULO E CONTROLA O ESTADO DE BLOQUEIO
     * @param {number} index - O índice do módulo a ser exibido.
     */
    function showModule(index) {
        clearTimeout(unlockTimer);
        clearInterval(countdownInterval);

        modules.forEach(module => module.classList.remove('active'));

        const currentModule = modules[index];
        currentModule.classList.add('active');
        localStorage.setItem('currentModuleIndex', index);

        moduleIndicator.textContent = `${index + 1} / ${totalModules}`;
        prevBtn.disabled = (index === 0);
        
        const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
        statusBloqueioDiv.style.display = 'none';

        if (index === highestUnlockedModule && index < totalModules - 1) {
            nextBtn.disabled = true;
            verificarEstadoDoTimer(index, statusBloqueioDiv);
        } else {
            nextBtn.disabled = (index === totalModules - 1);
        }
    }

    /**
     * NOVA LÓGICA: Verifica se já existe um timer ativo no localStorage.
     * @param {number} index - O índice do módulo atual.
     * @param {HTMLElement} displayElement - Onde exibir a mensagem.
     */
    function verificarEstadoDoTimer(index, displayElement) {
        const timerStateJSON = localStorage.getItem('timerState');
        const agora = Date.now();

        if (timerStateJSON) {
            const timerState = JSON.parse(timerStateJSON);
            // Verifica se o timer salvo é para o módulo atual
            if (timerState.moduleIndex === index) {
                const tempoRestanteMs = timerState.unlockTimestamp - agora;

                if (tempoRestanteMs <= 0) {
                    // O tempo já passou enquanto o usuário estava fora. Desbloqueia imediatamente.
                    efetuarDesbloqueio(displayElement);
                    return;
                } else {
                    // Continua o timer com o tempo restante.
                    iniciarContador(tempoRestanteMs, displayElement, () => efetuarDesbloqueio(displayElement));
                    return;
                }
            }
        }
        
        // Se não há timer salvo ou é para outro módulo, inicia um novo.
        const unlockTimestamp = agora + (TEMPO_POR_MODULO_SEGUNDOS * 1000);
        localStorage.setItem('timerState', JSON.stringify({ moduleIndex: index, unlockTimestamp: unlockTimestamp }));
        iniciarContador(TEMPO_POR_MODULO_SEGUNDOS * 1000, displayElement, () => efetuarDesbloqueio(displayElement));
    }

    /**
     * Inicia o cronômetro visual e o temporizador de desbloqueio.
     * @param {number} milissegundos - Duração do contador em milissegundos.
     * @param {HTMLElement} displayElement - Onde mostrar a contagem regressiva.
     * @param {Function} callback - Função a ser executada no final.
     */
    function iniciarContador(milissegundos, displayElement, callback) {
        displayElement.style.display = 'block';
        let tempoRestanteSegundos = Math.ceil(milissegundos / 1000);

        function atualizarDisplay() {
            if (tempoRestanteSegundos > 0) {
                displayElement.textContent = `Tempo mínimo neste módulo: ${tempoRestanteSegundos} segundos para desbloquear o próximo.`;
                tempoRestanteSegundos--;
            }
        }

        atualizarDisplay();
        countdownInterval = setInterval(atualizarDisplay, 1000);
        unlockTimer = setTimeout(() => {
            clearInterval(countdownInterval);
            callback();
        }, milissegundos);
    }

    /**
     * Executa as ações de desbloqueio de um módulo.
     * @param {HTMLElement} displayElement - O elemento que mostra o status.
     */
    function efetuarDesbloqueio(displayElement) {
        highestUnlockedModule++;
        localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
        localStorage.removeItem('timerState'); // Limpa o timer do localStorage

        nextBtn.disabled = false;
        displayElement.style.display = 'block';
        displayElement.textContent = 'Módulo desbloqueado! Você já pode avançar.';
    }

    // --- EVENT LISTENERS PARA OS BOTÕES ---
    nextBtn.addEventListener('click', function() {
        if (currentModuleIndex < totalModules - 1) {
            currentModuleIndex++;
            showModule(currentModuleIndex);
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentModuleIndex > 0) {
            currentModuleIndex--;
            showModule(currentModuleIndex);
        }
    });

    // --- PONTO DE PARTIDA ---
    inicializarCurso();
});
