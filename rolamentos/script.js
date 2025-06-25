document.addEventListener('DOMContentLoaded', () => {

    const { jsPDF } = window.jspdf;
    const modules = document.querySelectorAll('.module');
    let currentModuleIndex = 0;

    const prevModuleBtn = document.getElementById('prev-module-btn');
    const nextModuleBtn = document.getElementById('next-module-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    const floatingNav = document.querySelector('.floating-nav');

    function showModule(index) {
        if (index < 0 || index >= modules.length) return;
        
        currentModuleIndex = index;
        modules.forEach(m => m.classList.remove('active'));
        modules[currentModuleIndex].classList.add('active');

        moduleIndicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        prevModuleBtn.disabled = (currentModuleIndex === 0);
        nextModuleBtn.disabled = (currentModuleIndex === modules.length - 1);
        
        floatingNav.classList.toggle('hidden', currentModuleIndex === modules.length - 1);
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
            pergunta: "Qual é um dos erros mais frequentes que pode comprometer a montagem de um componente?",
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

    // --- FUNÇÃO DE GERAR O CERTIFICADO ATUALIZADA ---
    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        const cpf = document.getElementById('cpf-aluno').value.trim();
        if (nome === "" || cpf === "") {
            alert("Por favor, preencha seu nome completo e CPF.");
            return;
        }

        // --- ATUALIZAÇÃO DA LOGO ---
        // Coloque o caminho para sua logo aqui. 
        // Pode ser um arquivo local (ex: 'logo.png') ou um link da internet.
        // Lembre-se: para arquivos locais, use o Live Server.
        const logoUrl = 'https://ibb.co/hFHgykrs'; 

        const criarPDF = (logoCarregada = null) => {
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            // Design do certificado
            doc.setFillColor(230, 240, 255);
            doc.rect(0, 0, 297, 210, 'F');
            doc.setDrawColor(0, 51, 102);
            doc.setLineWidth(2);
            doc.rect(5, 5, 287, 200);
            
            // Adiciona a logo se ela foi carregada com sucesso
            if (logoCarregada) {
                const imgWidth = 50; // Largura da logo no PDF
                const imgHeight = (logoCarregada.height * imgWidth) / logoCarregada.width;
                const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
                doc.addImage(logoCarregada, 'PNG', x, 15, imgWidth, imgHeight);
            }

            // Títulos
            doc.setFont("helvetica", "bold");
            doc.setFontSize(30);
            doc.setTextColor(0, 51, 102);
            doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 55, { align: "center" });

            // Corpo do texto
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.setTextColor(50, 50, 50);
            doc.text(`Certificamos que`, 148.5, 75, { align: "center" });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(0, 102, 204);
            doc.text(nome.toUpperCase(), 148.5, 87, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(14);
            doc.setTextColor(50, 50, 50);
            doc.text(`portador(a) do CPF nº ${formatarCPF(cpf)}, concluiu com aproveitamento o curso de`, 148.5, 97, { align: "center" });
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(0, 51, 102);
            doc.text("MONTAGEM DE ROLAMENTOS", 148.5, 107, { align: "center" });
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(14);
            doc.text("Carga Horária: 2 horas", 148.5, 117, { align: "center" });

            // Conteúdos Estudados
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("Conteúdos Estudados:", 20, 130);
            doc.setFont("helvetica", "normal");
            const conteudos = [
                "Módulo 1: O Olhar Clínico: Inspeção Visual e Dimensional",
                "Módulo 2: Preparando o Terreno: Limpeza Impecável dos Componentes",
                "Módulo 3: O Arsenal do Montador: As Ferramentas Certas para o Trabalho",
                "Módulo 4: Frio ou Quente? A Decisão Estratégica da Montagem",
                "Módulo 5: Mãos à Obra: O Cuidado em Cada Etapa da Montagem",
                "Módulo 6: As \"Pegadinhas\" da Montagem e Como Fugir Delas"
            ];
            
            let yPos = 137;
            conteudos.forEach(item => {
                doc.text(`• ${item}`, 20, yPos);
                yPos += 6;
            });

            const hoje = new Date();
            const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            doc.setFontSize(12);

            // Assinatura e Escola
            doc.line(105, 180, 190, 180); 
            doc.setFont("helvetica", "bold");
            doc.text("JONATHAN DA SILVA OLIVEIRA", 147.5, 187, { align: "center" });
            doc.setFont("helvetica", "normal");
            doc.text("Escola Manutenção Industrial ARQUIVOS", 147.5, 193, { align: "center" });
            doc.text(`Emitido em: ${dataFormatada}`, 147.5, 200, { align: "center" });
            
            doc.save(`Certificado - Montagem de Rolamentos - ${nome}.pdf`);
        };

        // Lógica para carregar a imagem ANTES de criar o PDF
        if (logoUrl) {
            const logo = new Image();
            logo.src = logoUrl;
            // Habilita o carregamento de imagens de outros domínios, se eles permitirem (CORS)
            logo.crossOrigin = 'Anonymous'; 

            // Se a imagem carregar com sucesso, cria o PDF com ela
            logo.onload = () => {
                criarPDF(logo);
            };
            // Se der erro ao carregar a imagem, cria o PDF sem ela
            logo.onerror = () => {
                alert("Não foi possível carregar a imagem da logo. Verifique o caminho ou link. O certificado será gerado sem ela.");
                criarPDF(null);
            };
        } else {
            // Se não houver URL de logo, cria o PDF diretamente
            criarPDF(null);
        }
    }

    // --- INICIALIZAÇÃO ---
    showModule(0);
    iniciarQuiz();
});
