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

    // Variável para o nosso contador de segundos (o "timer")
    let countdownInterval = null;

    /**
     * INICIALIZAÇÃO DO CURSO
     * Carrega o progresso salvo do aluno.
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
        // Para qualquer timer que esteja rodando antes de mudar de página
        pausarTimerDePermanencia();

        modules.forEach(module => module.classList.remove('active'));

        const currentModule = modules[index];
        currentModule.classList.add('active');
        localStorage.setItem('currentModuleIndex', index);

        moduleIndicator.textContent = `${index + 1} / ${totalModules}`;
        prevBtn.disabled = (index === 0);
        
        const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
        statusBloqueioDiv.style.display = 'none';

        // LÓGICA DE BLOQUEIO: Só se aplica se estivermos no módulo mais avançado
        if (index === highestUnlockedModule && index < totalModules - 1) {
            nextBtn.disabled = true;
            // Inicia o processo de verificação de tempo para este módulo
            iniciarTimerDePermanencia(statusBloqueioDiv);
        } else {
            nextBtn.disabled = (index === totalModules - 1);
        }
    }

    /**
     * Inicia ou retoma o contador de tempo de permanência ativa.
     * @param {HTMLElement} displayElement - Onde exibir a mensagem.
     */
    function iniciarTimerDePermanencia(displayElement) {
        // Garante que não haja timers duplicados rodando
        pausarTimerDePermanencia();

        displayElement.style.display = 'block';

        // Carrega o progresso de tempo já gasto neste módulo
        let progressoJSON = localStorage.getItem('timerProgress');
        let progresso = progressoJSON ? JSON.parse(progressoJSON) : { moduleIndex: -1, segundosGastos: 0 };

        // Se o progresso salvo não for do módulo atual, reseta.
        if (progresso.moduleIndex !== currentModuleIndex) {
            progresso = { moduleIndex: currentModuleIndex, segundosGastos: 0 };
        }

        let segundosGastos = progresso.segundosGastos;

        // Função que roda a cada segundo (o "tick" do relógio)
        function tick() {
            // Se a página não estiver visível, não faz nada.
            if (document.hidden) {
                return;
            }

            segundosGastos++;
            
            // Salva o progresso a cada segundo. Essencial para persistência.
            localStorage.setItem('timerProgress', JSON.stringify({ moduleIndex: currentModuleIndex, segundosGastos: segundosGastos }));

            let tempoRestante = TEMPO_POR_MODULO_SEGUNDOS - segundosGastos;

            if (tempoRestante > 0) {
                displayElement.textContent = `Tempo de permanência na página: ${tempoRestante} segundos restantes para desbloquear.`;
            } else {
                // TEMPO CONCLUÍDO!
                pausarTimerDePermanencia();
                efetuarDesbloqueio(displayElement);
            }
        }

        // Verifica se o tempo já foi concluído antes de iniciar o timer
        if (segundosGastos >= TEMPO_POR_MODULO_SEGUNDOS) {
            efetuarDesbloqueio(displayElement);
        } else {
            // Inicia o timer, que vai chamar a função tick a cada 1000ms (1 segundo)
            countdownInterval = setInterval(tick, 1000);
            // Executa uma vez imediatamente para mostrar a mensagem inicial
            let tempoRestanteInicial = TEMPO_POR_MODULO_SEGUNDOS - segundosGastos;
            displayElement.textContent = `Tempo de permanência na página: ${tempoRestanteInicial} segundos restantes para desbloquear.`;
        }
    }

    /**
     * Pausa o contador de tempo.
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
        highestUnlockedModule++;
        localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
        
        // Limpa o progresso do timer, pois não é mais necessário para este módulo
        localStorage.removeItem('timerProgress');

        nextBtn.disabled = false;
        displayElement.style.display = 'block';
        displayElement.textContent = 'Módulo desbloqueado! Você já pode avançar.';
    }

    // --- EVENT LISTENER PARA VISIBILIDADE DA PÁGINA ---
    // Este é o núcleo da nova funcionalidade.
    // O navegador dispara este evento sempre que o usuário muda de aba ou minimiza a janela.
    document.addEventListener('visibilitychange', function() {
        // Se a página ficou oculta, pausamos o timer.
        if (document.hidden) {
            pausarTimerDePermanencia();
        } else {
            // Se a página voltou a ficar visível, retomamos o processo do timer.
            // A função showModule já contém a lógica para iniciar/retomar o timer,
            // então podemos chamá-la para reavaliar o estado atual.
            showModule(currentModuleIndex);
        }
    });

    // --- PONTO DE PARTIDA ---
    inicializarCurso();
});
