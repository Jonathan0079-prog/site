// ==========================================================
// SCRIPT PARA O MODO: ACESSO ANTECIPADO (APENAS CONTADOR)
// ==========================================================

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

// A constante RELEASE_DATE é definida no index.html e fica disponível globalmente para este script.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let releaseCountdownInterval = null;

/**
 * Porteiro de Segurança
 */
auth.onAuthStateChanged(function(user) {
    if (user) {
        // Mostra o container principal para que o contador possa aparecer
        document.querySelector('.main-container').style.display = 'block';
        inicializarModoAcessoAntecipado();
    } else {
        window.location.href = 'login.html';
    }
});

/**
 * Configura a página para o modo de acesso antecipado (APENAS CONTADOR).
 */
function inicializarModoAcessoAntecipado() {
    // Esconde a navegação principal
    document.querySelector('.floating-nav').style.display = 'none';

    // ======================= MUDANÇA PRINCIPAL AQUI =======================
    // Itera sobre todos os módulos e garante que TODOS fiquem escondidos.
    const modules = document.querySelectorAll('.module');
    modules.forEach((module) => {
        module.style.display = 'none'; 
    });
    // ====================================================================

    // Inicia o contador regressivo para o lançamento
    iniciarContadorRegressivo();

    // Lógica do botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch((error) => {
                console.error('Erro ao fazer logout:', error);
            });
        });
    }
}

/**
 * Inicia e atualiza o contador regressivo na tela.
 */
function iniciarContadorRegressivo() {
    const countdownWrapper = document.getElementById('countdown-wrapper');
    if (!countdownWrapper) {
        console.error("ERRO: Elemento com id 'countdown-wrapper' não foi encontrado no HTML.");
        return;
    }
    countdownWrapper.style.display = 'block';

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const agora = new Date().getTime();
        // A variável RELEASE_DATE vem do escopo do index.html
        const distancia = RELEASE_DATE.getTime() - agora;

        if (distancia < 0) {
            clearInterval(releaseCountdownInterval);
            alert("O curso completo foi liberado! A página será atualizada.");
            window.location.reload(); 
            return;
        }

        const days = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distancia % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    releaseCountdownInterval = setInterval(updateTimer, 1000);
    updateTimer();
}
