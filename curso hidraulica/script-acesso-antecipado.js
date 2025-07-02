// ==========================================================
// SCRIPT PARA O MODO: ACESSO ANTECIPADO (APENAS CONTADOR)
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

// A constante RELEASE_DATE é definida no index.html e fica disponível globalmente para este script.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let releaseCountdownInterval = null;

auth.onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.main-container').style.display = 'block';
        inicializarModoAcessoAntecipado();
    } else {
        window.location.href = 'login.html';
    }
});

function inicializarModoAcessoAntecipado() {
    document.querySelector('.floating-nav').style.display = 'none';
    const modules = document.querySelectorAll('.module');
    modules.forEach((module) => {
        module.style.display = 'none';
    });
    const countdownWrapper = document.getElementById('countdown-wrapper');
    if (countdownWrapper) countdownWrapper.style.display = 'block';
    iniciarContadorRegressivo();
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch((error) => console.error('Erro ao fazer logout:', error));
        });
    }
}

function iniciarContadorRegressivo() {
    const countdownWrapper = document.getElementById('countdown-wrapper');
    if (!countdownWrapper) return;
    const daysEl = document.getElementById('days'), hoursEl = document.getElementById('hours'), minutesEl = document.getElementById('minutes'), secondsEl = document.getElementById('seconds');
    function updateTimer() {
        const agora = new Date().getTime();
        const distancia = RELEASE_DATE.getTime() - agora;
        if (distancia < 0) {
            clearInterval(releaseCountdownInterval);
            alert("O curso completo foi liberado! A página será atualizada.");
            window.location.reload(); 
            return;
        }
        const days = Math.floor(distancia / 86400000), hours = Math.floor((distancia % 86400000) / 3600000), minutes = Math.floor((distancia % 3600000) / 60000), seconds = Math.floor((distancia % 60000) / 1000);
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    releaseCountdownInterval = setInterval(updateTimer, 1000);
    updateTimer();
}
