document.addEventListener('DOMContentLoaded', () => {

    const { jsPDF } = window.jspdf;
    const modules = document.querySelectorAll('.module');
    let currentModuleIndex = 0;

    const prevModuleBtn = document.getElementById('prev-module-btn');
    const nextModuleBtn = document.getElementById('next-module-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    const floatingNav = document.querySelector('.floating-nav');

    function showModule(index) {
        if (index < 0 || index >= modules.length) {
            return;
        }
        currentModuleIndex = index;

        modules.forEach(m => {
            m.classList.remove('active');
        });

        modules[currentModuleIndex].classList.add('active');

        moduleIndicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        prevModuleBtn.disabled = (currentModuleIndex === 0);
        nextModuleBtn.disabled = (currentModuleIndex === modules.length - 1);
        
        if (currentModuleIndex === modules.length - 1) {
            floatingNav.classList.add('hidden');
        } else {
            floatingNav.classList.remove('hidden');
        }

        window.scrollTo(0, 0);
    }

    prevModuleBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
    nextModuleBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));

    const perguntas = [
        {
            pergunta: "Ao montar um rolamento no eixo com interferência (montagem a frio), onde a força deve ser aplicada?",
            opcoes: ["No anel externo", "Na gaiola", "No anel interno", "Nos corpos rolantes"],
            resposta: "No anel interno"
        },
        {
            pergunta: "Qual é a temperatura máxima segura geralmente recomendada para aquecer um rolamento durante a montagem a quente?",
            opcoes: ["80°C", "120°C", "180°C", "250°C"],
            resposta: "120°C"
        },
        {
            pergunta: "Qual método de limpeza é mais indicado para componentes sensíveis e de alta precisão, como rolamentos?",
            opcoes: ["Limpeza com jateamento", "Limpeza manual com escova de aço", "Limpeza ultrassônica", "Limpeza com solventes fortes"],
            resposta: "Limpeza ultrassônica"
        },
        {
            pergunta: "De acordo com o curso, qual é um dos erros mais frequentes que pode comprometer a montagem de um componente?",
            opcoes: ["Usar luvas de proteção", "Realizar a montagem em local silencioso", "Falha na limpeza e preparação das peças", "Consultar o manual do fabricante"],
            resposta: "Falha na limpeza e preparação das peças"
        },
        {
            pergunta: "Qual ferramenta é a mais adequada e segura para montagem a quente de rolamentos de médio e grande porte?",
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
        if (perguntaAtual === 0) {
            perguntas.sort(() => Math.random() - 0.5);
        }
        const p = perguntas[perguntaAtual];
        perguntaTituloEl.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}: ${p.pergunta}`;
        opcoesQuizEl.innerHTML = '';
        p.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.textContent = opcao;
            btn.onclick = () => verificarResposta(opcao, p.resposta);
            opcoesQuizEl.appendChild(btn);
        });
    }

    function verificarResposta(opcaoSelecionada, respostaCorreta) {
        const botoes = opcoesQuizEl.querySelectorAll('button');
        let acertou = (opcaoSelecionada === respostaCorreta);

        if (acertou) pontuacao++;
        feedbackEl.textContent = acertou ? '✅ Correto!' : '❌ Incorreto.';
        
        botoes.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === respostaCorreta) btn.classList.add('correta');
            else if (btn.textContent === opcaoSelecionada) btn.classList.add('incorreta');
        });
        
        setTimeout(() => {
            perguntaAtual++;
            if (perguntaAtual < perguntas.length) {
                feedbackEl.textContent = '';
                mostrarPergunta();
            } else {
                finalizarQuiz();
            }
        }, 1500);
    }

    function finalizarQuiz() {
        quizContainerEl.style.display = 'none';
        if (pontuacao === perguntas.length) {
            certificadoFormEl.style.display = 'block';
        } else {
            reprovadoEl.style.display = 'block';
        }
    }

    document.getElementById('tentar-novamente-btn').addEventListener('click', iniciarQuiz);
    document.getElementById('gerar-certificado-btn').addEventListener('click', gerarCertificadoPDF);

    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return cpf;
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        const cpf = document.getElementById('cpf-aluno').value.trim();
        if (nome === "" || cpf === "") {
            alert("Por favor, preencha seu nome completo e CPF.");
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const LOGO_BASE64 = 'data:image/png;base64,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'; // Cole sua logo Base64 aqui

        doc.setFillColor(230, 240, 255);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(2);
        doc.rect(5, 5, 287, 200);
        
        if (LOGO_BASE64) {
            const imgProps = doc.getImageProperties(LOGO_BASE64);
            const imgWidth = 80;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            doc.addImage(LOGO_BASE64, 'PNG', (doc.internal.pageSize.getWidth() - imgWidth) / 2, 15, imgWidth, imgHeight);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(30);
        doc.setTextColor(0, 51, 102);
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 60, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(50, 50, 50);
        doc.text(`Certificamos que`, 148.5, 80, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 102, 204);
        doc.text(nome.toUpperCase(), 148.5, 92, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text(`portador(a) do CPF nº ${formatarCPF(cpf)}, concluiu com aproveitamento o curso de`, 148.5, 102, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("MONTAGEM DE ROLAMENTOS", 148.5, 112, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Carga Horária: 2 horas", 148.5, 122, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Conteúdos Estudados:", 20, 135);
        doc.setFont("helvetica", "normal");
        const conteudos = [
            "Inspeção Visual e Dimensional de Peças",
            "Limpeza e Preparação de Componentes",
            "Ferramentas Básicas para Montagem",
            "Técnicas de Montagem a Frio e a Quente",
            "Cuidados Essenciais Durante a Montagem",
            "Erros Comuns e Como Evitá-los"
        ];
        
        let yPos = 140;
        conteudos.forEach(item => {
            doc.text(`• ${item}`, 20, yPos);
            yPos += 7;
        });

        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.setFontSize(12);
        doc.line(110, 185, 185, 185);
        doc.text("Assinatura do Responsável", 147.5, 190, { align: "center" });
        doc.text(`Emitido em: ${dataFormatada}`, 147.5, 197, { align: "center" });
        
        doc.save(`Certificado - Montagem de Rolamentos - ${nome}.pdf`);
    }

    // --- INICIALIZAÇÃO ---
    showModule(0);
    iniciarQuiz();

});
