document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO QUIZ E CERTIFICADO (DO SEU CÓDIGO) ---
    const { jsPDF } = window.jspdf;

    let perguntas = [
        { pergunta: "Qual técnica preditiva usa câmeras infravermelhas?", opcoes: ["Análise de Vibração", "Termografia", "Análise de Óleo"], resposta: "Termografia" },
        { pergunta: "Desbalanceamento é tipicamente detectado por qual método?", opcoes: ["Termografia", "Inspeção Visual", "Análise de Vibração"], resposta: "Análise de Vibração" },
        { pergunta: "O que a análise de óleo pode detectar?", opcoes: ["Desgaste de componentes e contaminação", "Apenas a viscosidade do óleo", "Trincas na carcaça"], resposta: "Desgaste de componentes e contaminação" },
        { pergunta: "A manutenção preditiva é uma estratégia...", opcoes: ["Corretiva", "Proativa", "Preventiva baseada no tempo"], resposta: "Proativa" }
    ];

    let perguntaAtual = 0;
    let pontuacao = 0;

    const perguntaTituloEl = document.getElementById('pergunta-titulo');
    const opcoesQuizEl = document.getElementById('opcoes-quiz');
    const feedbackEl = document.getElementById('feedback');
    const proximaPerguntaBtn = document.getElementById('proxima-pergunta-btn');
    const quizContainerEl = document.getElementById('quiz-container');
    const certificadoFormEl = document.getElementById('certificado-form-container');
    const gerarCertificadoBtn = document.getElementById('gerar-certificado-btn');

    function embaralhar(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function proximaPergunta() {
        perguntaAtual++;
        if (perguntaAtual < perguntas.length) {
            mostrarPergunta();
        } else {
            finalizarQuiz();
        }
    }

    function mostrarPergunta() {
        feedbackEl.textContent = '';
        proximaPerguntaBtn.style.display = 'none';
        const p = perguntas[perguntaAtual];
        perguntaTituloEl.textContent = p.pergunta;
        opcoesQuizEl.innerHTML = '';
        const opcoesEmbaralhadas = embaralhar([...p.opcoes]);
        opcoesEmbaralhadas.forEach(opcao => {
            const btn = document.createElement('button');
            btn.textContent = opcao;
            btn.onclick = () => verificarResposta(opcao, p.resposta);
            opcoesQuizEl.appendChild(btn);
        });
    }

    function verificarResposta(opcaoSelecionada, respostaCorreta) {
        const botoes = opcoesQuizEl.querySelectorAll('button');
        let acertou = false;
        if (opcaoSelecionada === respostaCorreta) {
            pontuacao++;
            acertou = true;
        }

        botoes.forEach(btn => {
            btn.disabled = true; // Desabilita todos os botões após a resposta
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correta');
            } else if (btn.textContent === opcaoSelecionada) {
                btn.classList.add('incorreta');
            }
        });

        feedbackEl.textContent = acertou ? '✅ Resposta Correta!' : '❌ Resposta Incorreta.';
        proximaPerguntaBtn.style.display = 'block';
    }

    function finalizarQuiz() {
        quizContainerEl.style.display = 'none'; // Esconde a área do quiz
        const aprovado = (pontuacao / perguntas.length) >= 0.75; // Exige 75% de acerto
        if (aprovado) {
            certificadoFormEl.style.display = 'flex'; // Mostra o formulário para gerar certificado
        } else {
            perguntaTituloEl.parentElement.innerHTML = '<h3>Você não atingiu a pontuação mínima (75%). Estude mais um pouco e tente novamente.</h3> <button onclick="location.reload()">Recomeçar Quiz</button>';
        }
    }
    
    proximaPerguntaBtn.addEventListener('click', proximaPergunta);
    gerarCertificadoBtn.addEventListener('click', gerarCertificadoPDF);

    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        if (nome === "") {
            alert("Por favor, digite seu nome completo.");
            return;
        }

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Design do Certificado
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
        doc.text("concluiu com sucesso o curso de", 148.5, 95, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("MANUTENÇÃO PREDITIVA", 148.5, 110, { align: "center" });
        
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.setFontSize(14);
        doc.text(`Concluído em: ${dataFormatada}`, 148.5, 125, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(100, 160, 200, 160);
        doc.setFontSize(12);
        doc.text("Responsável Técnico - Jonathan da Silva Oliveira", 148.5, 165, { align: "center" });
        doc.text("Manutenção Industrial ARQUIVOS", 148.5, 172, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Este certificado é válido mediante verificação da conclusão do curso e aprovação no exame final.", 148.5, 200, { align: "center" });

        doc.save(`Certificado - ${nome}.pdf`);
    }

    // Inicialização do Quiz ao carregar a página
    perguntas = embaralhar(perguntas);
    mostrarPergunta();

    // --- NAVEGAÇÃO E OUTRAS FUNCIONALIDADES DO TEMPLATE ---
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.module');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.4 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => { sectionObserver.observe(section); });

    const backToTopBtn = document.getElementById('backToTopBtn');
    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };
    backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

});
