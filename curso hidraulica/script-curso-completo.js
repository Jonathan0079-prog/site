// ==========================================================
// SCRIPT PARA O MODO: CURSO COMPLETO (VERSÃO FINAL CORRIGIDA)
// Unifica: Timer de Módulo + Quiz com PDF + Certificado
// ==========================================================

// A lógica principal é envolvida em DOMContentLoaded para garantir que o HTML foi carregado.
document.addEventListener('DOMContentLoaded', () => {

    // Inicializa a biblioteca jsPDF para o certificado
    const { jsPDF } = window.jspdf;

    // Configuração do Firebase (padrão)
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
            document.querySelector('.main-container').style.display = 'block';
            inicializarCurso();
        } else {
            window.location.href = 'login.html';
        }
    });

    // Função principal que organiza toda a lógica do curso
    function inicializarCurso() {
        // Garante que o contador de lançamento não apareça
        if(document.querySelector('#countdown-wrapper')) document.querySelector('#countdown-wrapper').style.display = 'none';
        
        // Configura o botão de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut().catch(err => console.error(err)));
    
        // --- VARIÁVEIS E ELEMENTOS DO DOM ---
        const TEMPO_POR_MODULO_SEGUNDOS = 10;
        const modules = document.querySelectorAll('.module');
        const prevBtn = document.getElementById('prev-btn'); // NOME CORRIGIDO
        const nextBtn = document.getElementById('next-btn'); // NOME CORRIGIDO
        const moduleIndicator = document.getElementById('module-indicator');
        const floatingNav = document.querySelector('.floating-nav');
        
        let currentModuleIndex = 0;
        let highestUnlockedModule = parseInt(localStorage.getItem('highestUnlockedModule') || '0', 10);
        currentModuleIndex = Math.min(parseInt(localStorage.getItem('currentModuleIndex') || '0', 10), highestUnlockedModule);
        let perModuleCountdownInterval = null;

        // --- LÓGICA DE NAVEGAÇÃO E EXIBIÇÃO DE MÓDULO (UNIFICADA) ---
        function showModule(index) {
            if (index < 0 || index > highestUnlockedModule) return; // Regra de bloqueio principal

            currentModuleIndex = index;
            pausarTimerDePermanencia(); // Sempre pausa o timer ao mudar de módulo
            
            modules.forEach(m => m.classList.remove('active'));
            const currentModule = modules[currentModuleIndex];
            currentModule.classList.add('active');
            localStorage.setItem('currentModuleIndex', index);

            moduleIndicator.textContent = `${index + 1} / ${modules.length}`;
            prevBtn.disabled = (currentModuleIndex === 0);

            const isQuizOrCert = currentModule.id === 'quiz' || currentModule.id === 'certificado';
            floatingNav.style.display = isQuizOrCert ? 'none' : 'flex'; // Esconde a navegação no quiz/certificado

            const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
            if (statusBloqueioDiv) statusBloqueioDiv.style.display = 'none';

            // Lógica de desbloqueio com timer (APENAS para aulas, não para quiz/certificado)
            if (index === highestUnlockedModule && !isQuizOrCert) {
                nextBtn.disabled = true;
                iniciarTimerDePermanencia(statusBloqueioDiv);
            } else {
                nextBtn.disabled = (index === highestUnlockedModule);
            }
            
            // Lógicas específicas por módulo
            if (currentModule.id === 'quiz') iniciarQuiz();
            if (currentModule.id === 'certificado') checkCertificateAccess();

            window.scrollTo(0, 0);
        }

        prevBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
        nextBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));
        
        // --- FUNÇÕES DO TIMER DE PERMANÊNCIA ---
        function iniciarTimerDePermanencia(displayElement) { /* ... (código mantido) ... */ }
        function pausarTimerDePermanencia() { clearInterval(perModuleCountdownInterval); perModuleCountdownInterval = null; }
        function efetuarDesbloqueio(displayElement) {
            if(!displayElement) return;
            if (currentModuleIndex === highestUnlockedModule) {
                highestUnlockedModule++;
                localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
            }
            localStorage.removeItem('timerProgress');
            nextBtn.disabled = false;
            displayElement.textContent = 'Módulo desbloqueado! Você já pode avançar.';
        }
        document.addEventListener('visibilitychange', () => { /* ... (código mantido) ... */ });

        // --- LÓGICA DO QUIZ (COMO VOCÊ FORNECEU) ---
        const perguntas = [
            { pergunta: "Qual princípio afirma que a pressão aplicada a um fluido confinado é transmitida integralmente?", opcoes: ["Princípio de Bernoulli", "Lei de Newton", "Lei de Pascal", "Efeito Venturi"], resposta: "Lei de Pascal" },
            { pergunta: "Em um sistema óleo-hidráulico, o que a bomba gera primariamente?", opcoes: ["Pressão", "Vazão (Fluxo)", "Força", "Calor"], resposta: "Vazão (Fluxo)" },
            { pergunta: "Um Número de Reynolds (Re) abaixo de 2000 indica qual tipo de escoamento?", opcoes: ["Turbulento", "De Transição", "Compressível", "Laminar"], resposta: "Laminar" }
        ];
        let perguntaAtual = 0, pontuacao = 0;
        const perguntaTituloEl = document.getElementById('pergunta-titulo'), opcoesQuizEl = document.getElementById('opcoes-quiz'), feedbackEl = document.getElementById('feedback'), quizContainerEl = document.getElementById('quiz-container'), certificadoFormEl = document.getElementById('certificado-form-container'), reprovadoEl = document.getElementById('reprovado-container');
        
        function iniciarQuiz() { /* ... (código do quiz que você forneceu) ... */ }
        function mostrarPergunta() { /* ... */ }
        function verificarResposta(opcao, resposta) { /* ... */ }
        function finalizarQuiz() {
            quizContainerEl.style.display = 'none';
            // A pontuação para passar é 60%
            if ((pontuacao / perguntas.length) >= 0.6) {
                certificadoFormEl.style.display = 'block';
                localStorage.setItem('quizPassed', 'true');
                // Desbloqueia o módulo do certificado
                if (highestUnlockedModule < modules.length - 1) {
                    highestUnlockedModule = modules.length - 1;
                    localStorage.setItem('highestUnlockedModule', highestUnlockedModule);
                }
            } else {
                reprovadoEl.style.display = 'block';
            }
        }
        document.getElementById('tentar-novamente-btn').addEventListener('click', iniciarQuiz);
        document.getElementById('gerar-certificado-btn').addEventListener('click', gerarCertificadoPDF);

        // --- LÓGICA DO CERTIFICADO (COMO VOCÊ FORNECEU) ---
        function checkCertificateAccess() {
            if (localStorage.getItem('quizPassed') === 'true') {
                document.getElementById('certificate-gate').style.display = 'none';
                document.getElementById('certificado-form-container').style.display = 'block';
            } else {
                document.getElementById('certificate-gate').style.display = 'block';
                document.getElementById('certificado-form-container').style.display = 'none';
            }
        }
        function formatarCPF(cpf) { /* ... */ }
        function gerarCertificadoPDF() { /* ... */ }
        const paisSelect = document.getElementById('pais-aluno'), docLabel = document.getElementById('documento-label'), docInput = document.getElementById('documento-aluno');
        if (paisSelect && docLabel && docInput) { /* ... (lógica do seletor de país) ... */ }
        
        // --- INICIALIZAÇÃO ---
        showModule(currentModuleIndex);
    }

    // Cole aqui as funções completas que foram abreviadas com /*...*/
    // Elas são as mesmas que você me forneceu, estou apenas omitindo para não deixar a resposta gigante
});
