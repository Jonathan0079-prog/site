document.addEventListener('DOMContentLoaded', () => {

    const { jsPDF } = window.jspdf;
    const modules = document.querySelectorAll('.module');
    const keyboardNav = document.getElementById('keyboard-nav');
    let currentModuleIndex = 0;

    // --- CRIAÇÃO DOS BOTÕES DE NAVEGAÇÃO ---
    modules.forEach((module, index) => {
        // Cria botão no teclado superior
        const navButton = document.createElement('button');
        navButton.classList.add('nav-button');
        navButton.textContent = (index + 1);
        if (index === modules.length - 1) {
            navButton.textContent = 'C'; // C de Certificado
        }
        navButton.dataset.index = index;
        keyboardNav.appendChild(navButton);

        // Cria botões de avançar/retornar no final do módulo
        const navButtonsContainer = document.createElement('div');
        navButtonsContainer.classList.add('module-nav-buttons');

        if (index > 0) {
            const prevButton = document.createElement('button');
            prevButton.textContent = '← Módulo Anterior';
            prevButton.classList.add('nav-btn-module');
            prevButton.addEventListener('click', () => showModule(index - 1));
            navButtonsContainer.appendChild(prevButton);
        }
        
        // Espaçador para alinhar o botão direito quando só existe ele
        if (index === 0) {
            const spacer = document.createElement('div');
            navButtonsContainer.appendChild(spacer);
        }

        if (index < modules.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Próximo Módulo →';
            nextButton.classList.add('nav-btn-module');
            nextButton.addEventListener('click', () => showModule(index + 1));
            navButtonsContainer.appendChild(nextButton);
        }
        
        module.appendChild(navButtonsContainer);
    });
    
    // Adiciona evento de clique aos botões do teclado
    keyboardNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-button')) {
            const index = parseInt(e.target.dataset.index, 10);
            showModule(index);
        }
    });

    // --- FUNÇÃO PARA MOSTRAR MÓDULO ---
    function showModule(index) {
        // Garante que o índice está nos limites
        if (index < 0 || index >= modules.length) return;

        currentModuleIndex = index;

        // Esconde todos os módulos
        modules.forEach(m => m.classList.remove('active'));
        // Mostra o módulo atual
        modules[currentModuleIndex].classList.add('active');

        // Atualiza a classe 'active' no teclado de navegação
        document.querySelectorAll('.nav-button').forEach((btn, i) => {
            btn.classList.toggle('active', i === currentModuleIndex);
        });
        
        window.scrollTo(0, 0);
    }


    // --- LÓGICA DO QUIZ ---
    const perguntas = [
        {
            pergunta: "Ao montar um rolamento no eixo com interferência (montagem a frio), onde a força deve ser aplicada?",
            opcoes: ["No anel externo", "Na gaiola", "No anel interno", "Nos corpos rolantes"],
            resposta: "No anel interno"
        },
        {
            pergunta: "Qual é a temperatura máxima segura geralmente recomendada para aquecer um rolamento em um aquecedor de indução?",
            opcoes: ["80°C", "120°C", "180°C", "250°C"],
            resposta: "120°C"
        },
        {
            pergunta: "O que o sufixo '2RS' na designação de um rolamento significa?",
            opcoes: ["Duas fileiras de esferas", "Folga interna C2", "Vedação de borracha em ambos os lados", "Blindagem de metal em ambos os lados"],
            resposta: "Vedação de borracha em ambos os lados"
        },
        {
            pergunta: "A sobrelubrificação (excesso de graxa) em um mancal pode causar qual problema?",
            opcoes: ["Melhor proteção contra corrosão", "Redução do ruído", "Superaquecimento", "Aumento da capacidade de carga"],
            resposta: "Superaquecimento"
        },
        {
            pergunta: "Qual ferramenta é a mais adequada e segura para montagem a quente de rolamentos de médio porte?",
            opcoes: ["Maçarico", "Banho de óleo quente", "Prensa hidráulica", "Aquecedor por indução"],
            resposta: "Aquecedor por indução"
        }
    ];

    let perguntaAtual = 0;
    let pontuacao = 0;
    
    const perguntaTituloEl = document.getElementById('pergunta-titulo');
    const opcoesQuizEl = document.getElementById('opcoes-quiz');
    const feedbackEl = document.getElementById('feedback');
    const quizContainerEl = document.getElementById('quiz-container');
    const certificadoFormEl = document.getElementById('certificado-form-container');
    const reprovadoEl = document.getElementById('reprovado-container');
    
    function iniciarQuiz() {
        perguntaAtual = 0;
        pontuacao = 0;
        feedbackEl.textContent = '';
        certificadoFormEl.style.display = 'none';
        reprovadoEl.style.display = 'none';
        quizContainerEl.style.display = 'block';
        mostrarPergunta();
    }

    function mostrarPergunta() {
        const p = perguntas[perguntaAtual];
        perguntaTituloEl.textContent = `Pergunta ${perguntaAtual + 1}: ${p.pergunta}`;
        opcoesQuizEl.innerHTML = '';
        p.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.textContent = opcao;
            btn.onclick = () => verificarResposta(opcao, p.resposta, p.opcoes);
            opcoesQuizEl.appendChild(btn);
        });
    }

    function verificarResposta(opcaoSelecionada, respostaCorreta) {
        const botoes = opcoesQuizEl.querySelectorAll('button');
        let acertou = (opcaoSelecionada === respostaCorreta);

        if (acertou) {
            pontuacao++;
        }

        feedbackEl.textContent = acertou ? '✅ Correto!' : '❌ Incorreto.';
        
        botoes.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correta');
            } else if (btn.textContent === opcaoSelecionada) {
                btn.classList.add('incorreta');
            }
        });
        
        // Avança para a próxima pergunta ou finaliza o quiz
        setTimeout(() => {
            perguntaAtual++;
            if (perguntaAtual < perguntas.length) {
                feedbackEl.textContent = '';
                mostrarPergunta();
            } else {
                finalizarQuiz();
            }
        }, 1500); // Espera 1.5 segundos antes de avançar
    }

    function finalizarQuiz() {
        quizContainerEl.style.display = 'none';
        if (pontuacao === perguntas.length) { // 100% de acerto
            certificadoFormEl.style.display = 'block';
        } else {
            reprovadoEl.style.display = 'block';
        }
    }

    document.getElementById('tentar-novamente-btn').addEventListener('click', iniciarQuiz);
    document.getElementById('gerar-certificado-btn').addEventListener('click', gerarCertificadoPDF);

    // --- GERAÇÃO DE PDF ---
    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        if (nome === "") {
            alert("Por favor, digite seu nome completo.");
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        doc.setFillColor(230, 240, 255);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(2);
        doc.rect(5, 5, 287, 200);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(30);
        doc.setTextColor(0, 51, 102);
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 40, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(50, 50, 50);
        doc.text("Certificamos que", 148.5, 65, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 102, 204);
        doc.text(nome.toUpperCase(), 148.5, 80, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(50, 50, 50);
        doc.text("concluiu com aproveitamento o curso de", 148.5, 95, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("MONTAGEM DE ROLAMENTOS", 148.5, 110, { align: "center" });
        
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.setFontSize(14);
        doc.text(`Concluído em: ${dataFormatada}, às ${hoje.toLocaleTimeString('pt-BR')}`, 148.5, 125, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(100, 160, 200, 160);
        doc.setFontSize(12);
        doc.text("Jonathan da Silva Oliveira", 148.5, 165, { align: "center" });
        doc.text("Manutenção Industrial ARQUIVOS", 148.5, 172, { align: "center" });

        doc.save(`Certificado - Montagem de Rolamentos - ${nome}.pdf`);
    }

    // --- INICIALIZAÇÃO ---
    showModule(0); // Mostra o primeiro módulo ao carregar
    iniciarQuiz(); // Prepara o quiz no módulo final

});
