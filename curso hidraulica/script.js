document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURAÇÃO ---
    const TEMPO_POR_MODULO_SEGUNDOS = 10; // Tempo mínimo de permanência ATIVA em cada módulo.

    // --- ELEMENTOS DA INTERFACE ---
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    
    // --- VARIÁVEIS DE ESTADO ---
    let currentModuleIndex = 0;
    let highestUnlockedModule = 0;
    const totalModules = modules.length;
    let countdownInterval = null; // Variável para controlar o timer

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Inicia o curso, carregando o progresso salvo do aluno.
     */
    function inicializarCurso() {
        const savedHighest = parseInt(localStorage.getItem('highestUnlockedModule') || '0', 10);
        highestUnlockedModule = savedHighest;
        const savedCurrent = parseInt(localStorage.getItem('currentModuleIndex') || '0', 10);
        currentModuleIndex = Math.min(savedCurrent, highestUnlockedModule);
        showModule(currentModuleIndex);
    }

    /**
     * Exibe um módulo específico e gerencia o estado da interface.
     * @param {number} index - O índice do módulo a ser exibido.
     */
    function showModule(index) {
        pausarTimerDePermanencia();
        modules.forEach(module => module.classList.remove('active'));
        const currentModule = modules[index];
        currentModule.classList.add('active');
        localStorage.setItem('currentModuleIndex', index);
        moduleIndicator.textContent = `${index + 1} / ${totalModules}`;
        prevBtn.disabled = (index === 0);
        const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
        statusBloqueioDiv.style.display = 'none';

        // Verifica se o módulo é o mais recente para iniciar o bloqueio por tempo
        if (index === highestUnlockedModule && index < totalModules - 1) {
            nextBtn.disabled = true;
            iniciarTimerDePermanencia(statusBloqueioDiv);
        } else {
            nextBtn.disabled = (index === totalModules - 1);
        }
    }

    /**
     * Inicia ou retoma o contador de tempo de permanência ativa na página.
     * @param {HTMLElement} displayElement - Onde exibir a mensagem do timer.
     */
    function iniciarTimerDePermanencia(displayElement) {
        pausarTimerDePermanencia();
        displayElement.style.display = 'block';
        let progressoJSON = localStorage.getItem('timerProgress');
        let progresso = progressoJSON ? JSON.parse(progressoJSON) : { moduleIndex: -1, segundosGastos: 0 };
        if (progresso.moduleIndex !== currentModuleIndex) {
            progresso = { moduleIndex: currentModuleIndex, segundosGastos: 0 };
        }
        let segundosGastos = progresso.segundosGastos;

        function tick() {
            if (document.hidden) return; // Pausa a contagem se a aba não estiver visível
            segundosGastos++;
            localStorage.setItem('timerProgress', JSON.stringify({ moduleIndex: currentModuleIndex, segundosGastos: segundosGastos }));
            let tempoRestante = TEMPO_POR_MODULO_SEGUNDOS - segundosGastos;
            if (tempoRestante > 0) {
                displayElement.textContent = `Tempo de permanência na página: ${tempoRestante} segundos restantes para desbloquear.`;
            } else {
                pausarTimerDePermanencia();
                efetuarDesbloqueio(displayElement);
            }
        }

        if (segundosGastos >= TEMPO_POR_MODULO_SEGUNDOS) {
            efetuarDesbloqueio(displayElement);
        } else {
            countdownInterval = setInterval(tick, 1000);
            let tempoRestanteInicial = TEMPO_POR_MODULO_SEGUNDOS - segundosGastos;
            displayElement.textContent = `Tempo de permanência na página: ${tempoRestanteInicial} segundos restantes para desbloquear.`;
        }
    }

    /**
     * Para o contador de tempo (usado ao mudar de módulo ou aba).
     */
    function pausarTimerDePermanencia() {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    /**
     * Executa as ações de desbloqueio de um módulo.
     * @param {HTMLElement} displayElement - O elemento que mostra o status.
     */
    function efetuarDesbloqueio(displayElement) {
        // Garante que o desbloqueio só aconteça uma vez por módulo
        if (currentModuleIndex === highestUnlockedModule) {
            highestUnlockedModule++;
            localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
        }
        localStorage.removeItem('timerProgress');
        nextBtn.disabled = false;
        displayElement.style.display = 'block';
        displayElement.textContent = 'Módulo desbloqueado! Você já pode avançar.';
    }

    // --- EVENT LISTENERS ---

    /**
     * Gerencia o timer quando o usuário muda de aba ou minimiza o navegador.
     */
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pausarTimerDePermanencia();
        } else {
            // Apenas retoma o timer se estivermos no módulo mais recente e bloqueado
            if (currentModuleIndex === highestUnlockedModule && currentModuleIndex < totalModules - 1) {
                const currentModule = modules[currentModuleIndex];
                const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
                iniciarTimerDePermanencia(statusBloqueioDiv);
            }
        }
    });

    /**
     * (CÓDIGO RESTAURADO) Adiciona a funcionalidade ao botão "Próximo".
     */
    nextBtn.addEventListener('click', function() {
        if (currentModuleIndex < totalModules - 1) {
            currentModuleIndex++;
            showModule(currentModuleIndex);
        }
    });

    /**
     * (CÓDIGO RESTAURADO) Adiciona a funcionalidade ao botão "Anterior".
     */
    prevBtn.addEventListener('click', function() {
        if (currentModuleIndex > 0) {
            currentModuleIndex--;
            showModule(currentModuleIndex);
        }
    });

    // --- PONTO DE PARTIDA ---
    inicializarCurso();
});
