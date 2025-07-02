// ==========================================================
// SCRIPT PARA O MODO: CURSO COMPLETO (APÓS O LANÇAMENTO)
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

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/**
 * Porteiro de Segurança
 */
auth.onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.main-container').style.display = 'block';
        document.querySelector('.floating-nav').style.display = 'flex';
        inicializarCursoCompleto();
    } else {
        window.location.href = 'login.html';
    }
});


/**
 * Função principal que contém toda a lógica do curso COMPLETO.
 */
function inicializarCursoCompleto() {
    // Garante que o contador de lançamento não seja exibido
    const countdownWrapper = document.getElementById('countdown-wrapper');
    if(countdownWrapper) countdownWrapper.style.display = 'none';
    
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
// ==========================================================
// SCRIPT PARA O MODO: CURSO COMPLETO (VERSÃO FINAL UNIFICADA)
// Inclui: Timer de Módulo + Quiz com PDF + Certificado
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
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

    auth.onAuthStateChanged(function(user) {
        if (user) {
            document.querySelector('.main-container').style.display = 'block';
            inicializarCurso();
        } else {
            window.location.href = 'login.html';
        }
    });

    function inicializarCurso() {
        if(document.querySelector('#countdown-wrapper')) document.querySelector('#countdown-wrapper').style.display = 'none';
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut().catch(err => console.error(err)));
    
        const TEMPO_POR_MODULO_SEGUNDOS = 10;
        const modules = document.querySelectorAll('.module');
        const prevBtn = document.getElementById('prev-module-btn');
        const nextBtn = document.getElementById('next-module-btn');
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
            localStorage.setItem('currentModuleIndex', index);
            moduleIndicator.textContent = `${index + 1} / ${modules.length}`;
            prevBtn.disabled = (currentModuleIndex === 0);
            const isQuizOrCert = currentModule.id === 'quiz' || currentModule.id === 'certificado';
            floatingNav.style.display = isQuizOrCert ? 'none' : 'flex';
            const statusBloqueioDiv = currentModule.querySelector('.status-bloqueio');
            if (statusBloqueioDiv) statusBloqueioDiv.style.display = 'none';
            if (index === highestUnlockedModule && !isQuizOrCert) {
                nextBtn.disabled = true;
                iniciarTimerDePermanencia(statusBloqueioDiv);
            } else {
                nextBtn.disabled = (index === highestUnlockedModule);
            }
            if (currentModule.id === 'quiz') iniciarQuiz();
            if (currentModule.id === 'certificado') checkCertificateAccess();
            window.scrollTo(0, 0);
        }
        prevBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
        nextBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));
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
                if (tempoRestante > 0) displayElement.textContent = `Tempo de permanência: ${tempoRestante}s para desbloquear.`;
                else { pausarTimerDePermanencia(); efetuarDesbloqueio(displayElement); }
            }
            if (segundosGastos >= TEMPO_POR_MODULO_SEGUNDOS) efetuarDesbloqueio(displayElement);
            else { perModuleCountdownInterval = setInterval(tick, 1000); tick(); }
        }
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
        document.addEventListener('visibilitychange', () => { if(!document.hidden) showModule(currentModuleIndex); else pausarTimerDePermanencia(); });

        const perguntas = [
            { pergunta: "Qual princípio afirma que a pressão aplicada a um fluido confinado é transmitida integralmente?", opcoes: ["Princípio de Bernoulli", "Lei de Newton", "Lei de Pascal", "Efeito Venturi"], resposta: "Lei de Pascal" },
            { pergunta: "Em um sistema óleo-hidráulico, o que a bomba gera primariamente?", opcoes: ["Pressão", "Vazão (Fluxo)", "Força", "Calor"], resposta: "Vazão (Fluxo)" },
            { pergunta: "Um Número de Reynolds (Re) abaixo de 2000 indica qual tipo de escoamento?", opcoes: ["Turbulento", "De Transição", "Compressível", "Laminar"], resposta: "Laminar" }
        ];
        let perguntaAtual = 0, pontuacao = 0;
        const perguntaTituloEl = document.getElementById('pergunta-titulo'), opcoesQuizEl = document.getElementById('opcoes-quiz'), feedbackEl = document.getElementById('feedback'), quizContainerEl = document.getElementById('quiz-container'), certificadoFormEl = document.getElementById('certificado-form-container'), reprovadoEl = document.getElementById('reprovado-container');
        function iniciarQuiz() {
            perguntaAtual = 0; pontuacao = 0; feedbackEl.textContent = '';
            if(certificadoFormEl) certificadoFormEl.style.display = 'none';
            if(reprovadoEl) reprovadoEl.style.display = 'none';
            if(quizContainerEl) quizContainerEl.style.display = 'block';
            mostrarPergunta();
        }
        function mostrarPergunta() {
            const p = perguntas[perguntaAtual];
            perguntaTituloEl.textContent = `Pergunta ${perguntaAtual + 1}/${perguntas.length}: ${p.pergunta}`;
            opcoesQuizEl.innerHTML = '';
            p.opcoes.forEach(op => { const btn = document.createElement('button'); btn.textContent = op; btn.onclick = () => verificarResposta(op, p.resposta); opcoesQuizEl.appendChild(btn); });
        }
        function verificarResposta(opcao, resposta) {
            const botoes = opcoesQuizEl.querySelectorAll('button');
            botoes.forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === resposta) btn.classList.add('correta');
                else if (btn.textContent === opcao) btn.classList.add('incorreta');
            });
            if (opcao === resposta) { pontuacao++; feedbackEl.textContent = '✅ Correto!'; }
            else { feedbackEl.textContent = '❌ Incorreto.'; }
            setTimeout(() => { perguntaAtual++; if (perguntaAtual < perguntas.length) mostrarPergunta(); else finalizarQuiz(); }, 1500);
        }
        function finalizarQuiz() {
            quizContainerEl.style.display = 'none';
            if ((pontuacao / perguntas.length) >= 0.6) { // 60% para passar
                certificadoFormEl.style.display = 'block';
                localStorage.setItem('quizPassed', 'true');
                if (highestUnlockedModule < modules.length - 1) { highestUnlockedModule = modules.length - 1; localStorage.setItem('highestUnlockedModule', highestUnlockedModule); }
            } else { reprovadoEl.style.display = 'block'; }
        }
        document.getElementById('tentar-novamente-btn').addEventListener('click', iniciarQuiz);
        document.getElementById('gerar-certificado-btn').addEventListener('click', gerarCertificadoPDF);

        function checkCertificateAccess() {
            if (localStorage.getItem('quizPassed') === 'true') {
                document.getElementById('certificado-form-container').style.display = 'block';
                document.getElementById('reprovado-container').style.display = 'none';
            } else {
                document.getElementById('certificado-form-container').style.display = 'none';
                document.getElementById('reprovado-container').style.display = 'block';
            }
        }
        function formatarCPF(cpf) {
            cpf = cpf.replace(/\D/g, '').slice(0, 11);
            if (cpf.length > 9) return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            if (cpf.length > 6) return cpf.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
            if (cpf.length > 3) return cpf.replace(/(\d{3})(\d{3})/, '$1.$2');
            return cpf;
        }
        function gerarCertificadoPDF() {
            const nome = document.getElementById('nome-aluno').value.trim(), documento = document.getElementById('documento-aluno').value.trim(), pais = document.getElementById('pais-aluno').value;
            if (!nome || !documento) return alert("Preencha nome e documento.");
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            doc.setFillColor(230, 240, 255); doc.rect(0, 0, 297, 210, 'F'); doc.setDrawColor(0, 51, 102); doc.setLineWidth(2); doc.rect(5, 5, 287, 200);
            doc.setFont("helvetica", "bold"); doc.setFontSize(30); doc.setTextColor(0, 51, 102); doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 45, { align: "center" });
            doc.setFont("helvetica", "normal"); doc.setFontSize(16); doc.setTextColor(50, 50, 50); doc.text(`Certificamos que`, 148.5, 65, { align: "center" });
            doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(0, 102, 204); doc.text(nome.toUpperCase(), 148.5, 77, { align: "center" });
            doc.setFont("helvetica", "normal"); doc.setFontSize(14); doc.setTextColor(50, 50, 50);
            let docTexto = pais === 'angola' ? `portador(a) do BI nº ${documento}` : `portador(a) do CPF nº ${documento}`;
            doc.text(`${docTexto}, concluiu com aproveitamento o curso de`, 148.5, 87, { align: "center" });
            doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(0, 51, 102); doc.text("HIDRÁULICA E PNEUMÁTICA INDUSTRIAL", 148.5, 99, { align: "center" });
            const data = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            doc.setFontSize(12); doc.line(90, 185, 205, 185);
            doc.setFont("helvetica", "bold"); doc.text("Jonathan da Silva Oliveira - Instrutor", 147.5, 190, { align: "center" });
            doc.setFont("helvetica", "normal"); doc.text(`Emitido em: ${data}`, 147.5, 197, { align: "center" });
            doc.save(`Certificado - ${nome}.pdf`);
        }
        const paisSelect = document.getElementById('pais-aluno'), docLabel = document.getElementById('documento-label'), docInput = document.getElementById('documento-aluno');
        if (paisSelect && docLabel && docInput) {
            paisSelect.addEventListener('change', function() { docLabel.textContent = this.value === 'angola' ? 'Seu BI:' : 'Seu CPF:'; docInput.placeholder = this.value === 'angola' ? 'Digite seu BI' : 'Digite seu CPF'; docInput.value = ''; });
            docInput.addEventListener('input', function() { if (paisSelect.value === 'brasil') this.value = formatarCPF(this.value); });
            paisSelect.dispatchEvent(new Event('change'));
        }
        
        showModule(currentModuleIndex);
    }
});
