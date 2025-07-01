document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURAÇÃO ---
    // Defina aqui o tempo mínimo (em segundos) que o aluno deve ficar em cada módulo.
    // Para testar, você pode usar um valor baixo como 5 segundos. Para o curso real, 60 ou 120 seria um bom começo.
    const TEMPO_POR_MODULO_SEGUNDOS = 10; 

    // --- ELEMENTOS DA INTERFACE ---
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    
    // --- VARIÁVEIS DE ESTADO ---
    let currentModuleIndex = 0;
    let highestUnlockedModule = 0; // O módulo mais alto que o usuário pode acessar.
    const totalModules = modules.length;

    // Variáveis para controlar os temporizadores
    let unlockTimer = null; // Armazena o setTimeout principal
    let countdownInterval = null; // Armazena o setInterval do contador visual

    /**
     * INICIALIZAÇÃO DO CURSO
     * - Carrega o progresso salvo no localStorage.
     * - Se não houver progresso, começa do zero.
     */
    function inicializarCurso() {
        // Tenta carregar o módulo mais alto desbloqueado. Se não existir, o valor é 0.
        const savedHighest = parseInt(localStorage.getItem('highestUnlockedModule') || '0', 10);
        highestUnlockedModule = savedHighest;

        // Tenta carregar o último módulo visitado para o usuário continuar de onde parou.
        const savedCurrent = parseInt(localStorage.getItem('currentModuleIndex') || '0', 10);
        // Garante que o usuário não pule para um módulo ainda não desbloqueado.
        currentModuleIndex = Math.min(savedCurrent, highestUnlockedModule);

        // Exibe o módulo correto na tela.
        showModule(currentModuleIndex);
    }

    /**
     * FUNÇÃO PRINCIPAL: MOSTRA UM MÓDULO E CONTROLA O ESTADO DE BLOQUEIO
     * @param {number} index - O índice do módulo a ser exibido.
     */
    function showModule(index) {
        // Limpa qualquer temporizador anterior para evitar acúmulo
        clearTimeout(unlockTimer);
        clearInterval(countdownInterval);

        // Esconde todos os módulos
        modules.forEach(module => module.classList.remove('active'));

        // Mostra o módulo atual e salva a posição
        const currentModule = modules[index];
        currentModule.classList.add('active');
        localStorage.setItem('currentModuleIndex', index);

        // Atualiza o indicador "1 / 19"
        moduleIndicator.textContent = `${index + 1} / ${totalModules}`;

        // Habilita/desabilita os botões de navegação
        prevBtn.disabled = (index === 0);
        
        // --- LÓGICA DE BLOQUEIO ---
        const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
        statusBloqueioDiv.style.display = 'none'; // Esconde a mensagem por padrão

        // Se o módulo atual é o mais avançado que o usuário já alcançou E não é o último
        if (index === highestUnlockedModule && index < totalModules - 1) {
            nextBtn.disabled = true; // Bloqueia o botão "próximo"
            statusBloqueioDiv.style.display = 'block'; // Mostra a caixa de mensagem
            
            // Inicia o cronômetro para desbloquear
            iniciarContador(TEMPO_POR_MODULO_SEGUNDOS, statusBloqueioDiv, function() {
                // Função a ser chamada quando o tempo acabar
                highestUnlockedModule++;
                localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
                nextBtn.disabled = false; // Desbloqueia o botão
                statusBloqueioDiv.textContent = 'Módulo desbloqueado! Você já pode avançar.';
            });
        } else {
            // Se o módulo já foi visitado ou é o último, o botão "próximo" fica habilitado
            nextBtn.disabled = (index === totalModules - 1);
        }
    }

    /**
     * Inicia o cronômetro visual e o temporizador de desbloqueio.
     * @param {number} segundos - Duração do contador.
     * @param {HTMLElement} displayElement - Onde mostrar a contagem regressiva.
     * @param {Function} callback - Função a ser executada no final.
     */
    function iniciarContador(segundos, displayElement, callback) {
        let tempoRestante = segundos;

        function atualizarDisplay() {
            displayElement.textContent = `Tempo mínimo neste módulo: ${tempoRestante} segundos para desbloquear o próximo.`;
            tempoRestante--;
        }

        atualizarDisplay(); // Mostra o tempo inicial
        countdownInterval = setInterval(atualizarDisplay, 1000); // Atualiza a cada segundo

        // Define o temporizador principal para o desbloqueio
        unlockTimer = setTimeout(function() {
            clearInterval(countdownInterval); // Para o contador visual
            callback(); // Executa a função de desbloqueio
        }, segundos * 1000);
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
