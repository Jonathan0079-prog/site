// ==========================================================
// SCRIPT PARA O MODO: ACESSO ANTECIPADO (ANTES DO LANÇAMENTO)
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

const RELEASE_DATE = new Date(2025, 6, 22, 9, 0, 0);

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let releaseCountdownInterval = null;

/**
 * Porteiro de Segurança
 */
auth.onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.main-container').style.display = 'block';
        inicializarModoAcessoAntecipado();
    } else {
        window.location.href = 'login.html';
    }
});

/**
 * Configura a página para o modo de acesso antecipado.
 */
function inicializarModoAcessoAntecipado() {
    // Esconde a navegação principal, pois não será usada
    document.querySelector('.floating-nav').style.display = 'none';

    // Mostra apenas a Aula 1
    const modules = document.querySelectorAll('.module');
    modules.forEach((module, index) => {
        if (index === 0) {
            module.classList.add('active');
        } else {
            module.style.display = 'none'; // Apenas esconde as outras
        }
    });

    // Inicia o contador regressivo para o lançamento
    iniciarContadorRegressivo();
}


/**
 * Inicia e atualiza o contador regressivo na tela.
 */
function iniciarContadorRegressivo() {
    const countdownWrapper = document.getElementById('countdown-wrapper');
    countdownWrapper.style.display = 'block';

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const agora = new Date().getTime();
        const distancia = RELEASE_DATE.getTime() - agora;

        if (distancia < 0) {
            clearInterval(releaseCountdownInterval);
            // Quando o tempo acabar, recarregar a página fará o "script inteligente"
            // carregar o arquivo do curso completo automaticamente.
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
    updateTimer(); // Chama uma vez imediatamente
}
