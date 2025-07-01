// Configuração do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyB_yPeyN-_z4JZ4hny8x3neU3InyRl6OEg",
  authDomain: "curso-hidraulica.firebaseapp.com",
  projectId: "curso-hidraulica",
  storageBucket: "curso-hidraulica.firebasestorage.app",
  messagingSenderId: "119186516649",
  appId: "1:119186516649:web:9c10d40022406b525757b8",
  measurementId: "G-0DD784H7E0"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/**
 * PORTEIRO DE SEGURANÇA (Gatekeeper)
 * Verifica se o usuário está logado ANTES de mostrar qualquer conteúdo.
 */
auth.onAuthStateChanged(function(user) {
    if (user) {
        // Usuário está logado. Mostra o conteúdo do curso.
        document.querySelector('.main-container').style.display = 'block';
        document.querySelector('.floating-nav').style.display = 'flex';
        // Inicia a lógica do curso.
        inicializarCurso();
    } else {
        // Usuário NÃO está logado. Redireciona para a página de login.
        console.log('Acesso negado. Redirecionando...');
        window.location.href = 'login.html';
    }
});


/**
 * Função principal que contém toda a lógica do curso.
 * Ela só é chamada se o "porteiro" do Firebase permitir o acesso.
 */
function inicializarCurso() {
    const TEMPO_POR_MODULO_SEGUNDOS = 10;
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    
    let currentModuleIndex = 0;
    let highestUnlockedModule = 0;
    const totalModules = modules.length;
    let countdownInterval = null;

    // Carrega o progresso salvo do aluno
    const savedHighest = parseInt(localStorage.getItem('highestUnlockedModule') || '0', 10);
    highestUnlockedModule = savedHighest;
    const savedCurrent = parseInt(localStorage.getItem('currentModuleIndex') || '0', 10);
    currentModuleIndex = Math.min(savedCurrent, highestUnlockedModule);
    showModule(currentModuleIndex);

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

        if (index === highestUnlockedModule && index < totalModules - 1) {
            nextBtn.disabled = true;
            iniciarTimerDePermanencia(statusBloqueioDiv);
        } else {
            nextBtn.disabled = (index === totalModules - 1);
        }
    }

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
            if (document.hidden) return;
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

    function pausarTimerDePermanencia() {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    function efetuarDesbloqueio(displayElement) {
        if (currentModuleIndex === highestUnlockedModule) {
            highestUnlockedModule++;
            localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
        }
        localStorage.removeItem('timerProgress');
        nextBtn.disabled = false;
        displayElement.style.display = 'block';
        displayElement.textContent = 'Módulo desbloqueado! Você já pode avançar.';
    }

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pausarTimerDePermanencia();
        } else {
            if (currentModuleIndex === highestUnlockedModule && currentModuleIndex < totalModules - 1) {
                const currentModule = modules[currentModuleIndex];
                const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
                iniciarTimerDePermanencia(statusBloqueioDiv);
            }
        }
    });

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
}
