// ==========================================================
// SCRIPT PARA O MODO: CURSO COMPLETO (APÓS O LANÇAMENTO)
// ==========================================================

const firebaseConfig = {
  apiKey: "AIzaSyB_yPeyN-_z4JZ4hny8x3neU3InyRl6OEg",
  authDomain: "curso-hidraulica.firebaseapp.com",
  projectId: "curso-hidraulica",
  storageBucket: "curso-hidraulica.firebasestorage.app",
  messagingSenderId: "119186516649",
  appId: "1:119186516649:web:9c10d40022406b525757b8",
  measurementId: "G-0DD784H7E0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.main-container').style.display = 'block';
        document.querySelector('.floating-nav').style.display = 'flex';
        inicializarCursoCompleto();
    } else {
        window.location.href = 'login.html';
    }
});

function inicializarCursoCompleto() {
    const countdownWrapper = document.getElementById('countdown-wrapper');
    if(countdownWrapper) countdownWrapper.style.display = 'none';
    
    // Lógica do botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch((error) => {
                console.error('Erro ao fazer logout:', error);
            });
        });
    }

    const TEMPO_POR_MODULO_SEGUNDOS = 10;
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    let currentModuleIndex = 0;
    let highestUnlockedModule = 0;
    const totalModules = modules.length;
    let countdownInterval = null;

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
// ==========================================================
// SCRIPT PARA O MODO: CURSO COMPLETO (APÓS O LANÇAMENTO)
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyB_yPeyN-_z4JZ4hny8x3neU3InyRl6OEg",
  authDomain: "curso-hidraulica.firebaseapp.com",
  projectId: "curso-hidraulica",
  storageBucket: "curso-hidraulica.firebasestorage.app",
  messagingSenderId: "119186516649",
  appId: "1:119186516649:web:9c10d40022406b525757b8",
  measurementId: "G-0DD784H7E0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.main-container').style.display = 'block';
        document.querySelector('.floating-nav').style.display = 'flex';
        inicializarCursoCompleto();
    } else {
        window.location.href = 'login.html';
    }
});

function inicializarCursoCompleto() {
    const countdownWrapper = document.getElementById('countdown-wrapper');
    if(countdownWrapper) countdownWrapper.style.display = 'none';
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch((error) => console.error('Erro ao fazer logout:', error));
        });
    }
    const TEMPO_POR_MODULO_SEGUNDOS = 10;
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    let currentModuleIndex = 0;
    let highestUnlockedModule = 0;
    const totalModules = modules.length;
    let countdownInterval = null;
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
        if(!displayElement) return;
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
        if(!displayElement) return;
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

