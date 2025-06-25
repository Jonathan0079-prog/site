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
        const LOGO_BASE64 = ''; // Cole sua logo Base64 aqui

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
            "Módulo 1: O Olhar Clínico: Inspeção Visual e Dimensional",
            "Módulo 2: Preparando o Terreno: Limpeza Impecável dos Componentes",
            "Módulo 3: O Arsenal do Montador: As Ferramentas Certas para o Trabalho",
            "Módulo 4: Frio ou Quente? A Decisão Estratégica da Montagem",
            "Módulo 5: Mãos à Obra: O Cuidado em Cada Etapa da Montagem",
            "Módulo 6: As "Pegadinhas" da Montagem e Como Fugir Delas"
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
        doc.text("Jonathan Oliveira - Instrutor", 147.5, 190, { align: "center" });
        doc.text(`Emitido em: ${dataFormatada}`, 147.5, 197, { align: "center" });
        
        doc.save(`Certificado - Montagem de Rolamentos - ${nome}.pdf`);
    }

    // --- INICIALIZAÇÃO ---
    showModule(0);
    iniciarQuiz();

});
