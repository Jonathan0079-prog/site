// =================================================================
// SCRIPT PARA O MODO: CURSO COMPLETO (VERSÃO FINAL COM INICIALIZAÇÃO ROBUSTA)
// =================================================================

const { jsPDF } = window.jspdf;
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

// Porteiro de Segurança: só inicializa o curso se o usuário estiver logado
auth.onAuthStateChanged(function(user) {
    if (user) {
        // Garante que o DOM está pronto antes de manipular
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', inicializarCurso);
        } else {
            inicializarCurso();
        }
    } else {
        window.location.href = 'login.html';
    }
});

// Função principal que organiza toda a lógica
function inicializarCurso() {
    // Garante que a função só rode uma vez
    if (window.cursoInicializado) return;
    window.cursoInicializado = true;

    document.querySelector('.main-container').style.display = 'block';
    if(document.querySelector('#countdown-wrapper')) document.querySelector('#countdown-wrapper').style.display = 'none';
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut().catch(err => console.error(err)));

    const TEMPO_POR_MODULO_SEGUNDOS = 10;
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    const floatingNav = document.querySelector('.floating-nav');
    
    let currentModuleIndex = 0;
    let highestUnlockedModule = parseInt(localStorage.getItem('highestUnlockedModule') || '0', 10);
    currentModuleIndex = Math.min(parseInt(localStorage.getItem('currentModuleIndex') || '0', 10), highestUnlockedModule);
    let perModuleCountdownInterval = null;

    function showModule(index) {
        if (index < 0 || index > highestUnlockedModule) return;
        currentModuleIndex = index;
        pausarTimerDePermanencia();
        
        modules.forEach(m => m.classList.remove('active'));
        const currentModule = modules[currentModuleIndex];
        currentModule.classList.add('active');
        localStorage.setItem('currentModuleIndex', String(index));

        if(moduleIndicator) moduleIndicator.textContent = `${index + 1} / ${modules.length}`;
        if(prevBtn) prevBtn.disabled = (currentModuleIndex === 0);

        const isQuizOrCert = currentModule.id === 'quiz' || currentModule.id === 'certificado';
        if(floatingNav) floatingNav.style.display = isQuizOrCert ? 'none' : 'flex';
        
        const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
        if (statusBloqueioDiv) statusBloqueioDiv.style.display = 'none';

        if (index === highestUnlockedModule && !isQuizOrCert) {
            if(nextBtn) nextBtn.disabled = true;
            iniciarTimerDePermanencia(statusBloqueioDiv);
        } else {
            if(nextBtn) nextBtn.disabled = (index >= highestUnlockedModule);
        }
        
        if (currentModule.id === 'quiz') iniciarQuiz();
        if (currentModule.id === 'certificado') checkCertificateAccess();
        window.scrollTo(0, 0);
    }

    if(prevBtn) prevBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
    if(nextBtn) nextBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));
    
    function iniciarTimerDePermanencia(displayElement) {
        if(!displayElement) return;
        pausarTimerDePermanencia();
        displayElement.style.display = 'block';
        let progresso = JSON.parse(localStorage.getItem('timerProgress') || '{"moduleIndex":-1,"segundosGastos":0}');
        if (progresso.moduleIndex !== currentModuleIndex) progresso = { moduleIndex: currentModuleIndex, segundosGastos: 0 };
        let segundosGastos = progresso.segundosGastos;
        function tick() {
            if (document.hidden) return;
            segundosGastos++;
            localStorage.setItem('timerProgress', JSON.stringify({ moduleIndex: currentModuleIndex, segundosGastos: segundosGastos }));
            let tempoRestante = TEMPO_POR_MODULO_SEGUNDOS - segundosGastos;
            if (tempoRestante > 0) { displayElement.textContent = `Tempo de permanência: ${tempoRestante}s para desbloquear.`; }
            else { pausarTimerDePermanencia(); efetuarDesbloqueio(displayElement); }
        }
        if (segundosGastos >= TEMPO_POR_MODULO_SEGUNDOS) { efetuarDesbloqueio(displayElement); }
        else { perModuleCountdownInterval = setInterval(tick, 1000); tick(); }
    }
    function pausarTimerDePermanencia() { clearInterval(perModuleCountdownInterval); perModuleCountdownInterval = null; }
    
    function efetuarDesbloqueio(displayElement) {
        if(!displayElement) return;
        if (currentModuleIndex === highestUnlockedModule) {
            highestUnlockedModule++;
            localStorage.setItem('highestUnlockedModule', String(highestUnlockedModule));
        }
        localStorage.removeItem('timerProgress');
        if(nextBtn) nextBtn.disabled = false;
        displayElement.textContent = 'Módulo desbloqueado! Você já pode avançar.';
    }
    document.addEventListener('visibilitychange', () => { if(!document.hidden) { showModule(currentModuleIndex); } else { pausarTimerDePermanencia(); } });

    // --- LÓGICA DO QUIZ ---
    const perguntas = [
        { pergunta: "Qual princípio afirma que a pressão aplicada a um fluido confinado é transmitida integralmente?", opcoes: ["Princípio de Bernoulli", "Lei de Newton", "Lei de Pascal", "Efeito Venturi"], resposta: "Lei de Pascal" },
        { pergunta: "Em um sistema óleo-hidráulico, o que a bomba gera primariamente?", opcoes: ["Pressão", "Vazão (Fluxo)", "Força", "Calor"], resposta: "Vazão (Fluxo)" },
        { pergunta: "Um Número de Reynolds (Re) abaixo de 2000 indica qual tipo de escoamento?", opcoes: ["Turbulento", "De Transição", "Compressível", "Laminar"], resposta: "Laminar" }
    ];
    let perguntaAtual = 0, pontuacao = 0;
    const perguntaTituloEl = document.getElementById('pergunta-titulo'), opcoesQuizEl = document.getElementById('opcoes-quiz'), feedbackEl = document.getElementById('feedback'), quizContainerEl = document.getElementById('quiz-container'), certificadoFormEl = document.getElementById('certificado-form-container'), reprovadoEl = document.getElementById('reprovado-container');
    
    function iniciarQuiz() { /* ... código ... */ }
    function mostrarPergunta() { /* ... código ... */ }
    function verificarResposta(opcao, resposta) { /* ... código ... */ }
    function finalizarQuiz() { /* ... código ... */ }
    const tentarNovamenteBtn = document.getElementById('tentar-novamente-btn');
    const gerarCertificadoBtn = document.getElementById('gerar-certificado-btn');
    if(tentarNovamenteBtn) tentarNovamenteBtn.addEventListener('click', iniciarQuiz);
    if(gerarCertificadoBtn) gerarCertificadoBtn.addEventListener('click', gerarCertificadoPDF);

    // --- LÓGICA DO CERTIFICADO ---
    function checkCertificateAccess() { /* ... código ... */ }
    function formatarCPF(cpf) { /* ... código ... */ }
    function gerarCertificadoPDF() { /* ... código ... */ }
    const paisSelect = document.getElementById('pais-aluno'), docLabel = document.getElementById('documento-label'), docInput = document.getElementById('documento-aluno');
    if (paisSelect && docLabel && docInput) { /* ... código ... */ }
    
    showModule(currentModuleIndex);
}

// Para manter a resposta legível, abreviei as funções do Quiz e Certificado
// que já funcionavam. O código completo delas está nas respostas anteriores.
// A mudança principal está na forma como `inicializarCurso` é chamado.
