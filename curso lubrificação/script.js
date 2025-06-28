document.addEventListener('DOMContentLoaded', () => {

    // --- DEPENDÊNCIA PARA GERAR O PDF ---
    // Pré-requisito: A biblioteca jsPDF deve estar carregada no seu arquivo HTML.
    // Exemplo: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    const { jsPDF } = window.jspdf;

    // =================================================================================
    // --- SEÇÃO 1: NAVEGAÇÃO ENTRE MÓDULOS ---
    // =================================================================================

    const modules = document.querySelectorAll('.module');
    const prevModuleBtn = document.getElementById('prev-module-btn');
    const nextModuleBtn = document.getElementById('next-module-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    
    let currentModuleIndex = 0;

    /**
     * Função central que controla a exibição dos módulos do curso.
     * @param {number} index - O índice do módulo a ser exibido.
     */
    function showModule(index) {
        // Validação para garantir que o índice está dentro dos limites existentes.
        if (index < 0 || index >= modules.length) {
            console.warn(`Tentativa de navegar para um módulo inválido: ${index}`);
            return;
        }
        currentModuleIndex = index;

        // Itera sobre todos os módulos, removendo a classe 'active' de todos.
        modules.forEach(m => {
            m.classList.remove('active');
        });

        // Adiciona a classe 'active' apenas ao módulo que deve ser exibido.
        modules[currentModuleIndex].classList.add('active');

        // Atualiza a interface de navegação (número do módulo e estado dos botões).
        updateNavigationControls();
        
        // Garante que o usuário comece no topo do novo módulo.
        window.scrollTo(0, 0);
    }

    /**
     * Atualiza os elementos visuais da navegação, como o indicador de página
     * e o estado de ativação/desativação dos botões.
     */
    function updateNavigationControls() {
        if (moduleIndicator) {
            moduleIndicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        }
        if (prevModuleBtn) {
            prevModuleBtn.disabled = (currentModuleIndex === 0);
        }
        if (nextModuleBtn) {
            // Desabilita o botão "Próximo" no último módulo.
            nextModuleBtn.disabled = (currentModuleIndex === modules.length - 1);
        }
    }

    // Adiciona os "escutadores de evento" aos botões de navegação.
    // A verificação 'if (botao)' garante que o código não quebre se o botão não existir no HTML.
    if (prevModuleBtn) {
        prevModuleBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
    } else {
        console.warn("Elemento com id 'prev-module-btn' não foi encontrado no HTML.");
    }

    if (nextModuleBtn) {
        nextModuleBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));
    } else {
        console.warn("Elemento com id 'next-module-btn' não foi encontrado no HTML.");
    }

    // =================================================================================
    // --- SEÇÃO 2: SIMULADOR DE TEMPERATURA E VIDA ÚTIL ---
    // =================================================================================
    
    const tempSlider = document.getElementById('tempSlider');
    if (tempSlider) {
        tempSlider.addEventListener('input', function() {
            const baseLife = 8000;
            const temp = parseInt(this.value, 10);
            
            // Busca os elementos de exibição dentro do evento para garantir que existam
            const tempValueEl = document.getElementById('tempValue');
            const baseLifeEl = document.getElementById('baseLife');
            const adjustedLifeEl = document.getElementById('adjustedLife');

            if (tempValueEl) tempValueEl.textContent = temp;
            if (baseLifeEl) baseLifeEl.textContent = baseLife;

            let adjustedLife = baseLife;
            // A fórmula só se aplica para temperaturas acima de 70.
            if (temp > 70) {
                const tempDiff = temp - 70;
                adjustedLife = baseLife / Math.pow(2, tempDiff / 15);
            }
            
            if (adjustedLifeEl) adjustedLifeEl.textContent = Math.round(adjustedLife);
        });
        
        // Dispara o evento 'input' uma vez no carregamento para inicializar os valores.
        tempSlider.dispatchEvent(new Event('input'));
    }

    // =================================================================================
    // --- SEÇÃO 3: QUIZ INTERATIVO E GERAÇÃO DE CERTIFICADO ---
    // =================================================================================

    const perguntas = [
        {
            pergunta: "De acordo com a teoria apresentada, qual o desgaste caracterizado pela transferência de material da superfície mais macia para a mais dura?",
            opcoes: ["Desgaste Abrasivo", "Desgaste Adesivo", "Fadiga Superficial", "Corrosão"],
            resposta: "Desgaste Adesivo"
        },
        {
            pergunta: "Qual a principal vantagem de um óleo sintético sobre um mineral?",
            opcoes: ["Baixo custo", "Maior oleosidade natural", "Excelente performance em temperaturas extremas", "Maior disponibilidade"],
            resposta: "Excelente performance em temperaturas extremas"
        },
        {
            pergunta: "Qual método de aplicação de óleo é o mais completo, permitindo filtragem e controle de temperatura?",
            opcoes: ["Por Salpico", "Por Banho de Óleo", "Por Circulação", "Manualmente"],
            resposta: "Por Circulação"
        },
        {
            pergunta: "Qual classificação de óleo de motor é baseada exclusivamente na viscosidade?",
            opcoes: ["API", "SAE", "AGMA", "ISO VG"],
            resposta: "SAE"
        }
    ];

    let perguntaAtual = 0;
    let pontuacao = 0;
    
    // Elementos da interface do Quiz
    const quizContainerEl = document.getElementById('quiz-container');
    const perguntaTituloEl = document.getElementById('pergunta-titulo');
    const opcoesQuizEl = document.getElementById('opcoes-quiz');
    const feedbackEl = document.getElementById('feedback');
    const certificadoFormEl = document.getElementById('certificado-form-container');
    const reprovadoEl = document.getElementById('reprovado-container');
    
    function iniciarQuiz() {
        perguntaAtual = 0;
        pontuacao = 0;
        if(feedbackEl) feedbackEl.textContent = '';
        if(certificadoFormEl) certificadoFormEl.style.display = 'none';
        if(reprovadoEl) reprovadoEl.style.display = 'none';
        if(quizContainerEl) quizContainerEl.style.display = 'block';
        mostrarPergunta();
    }

    function mostrarPergunta() {
        if (perguntaAtual === 0) {
            perguntas.sort(() => Math.random() - 0.5); // Embaralha as perguntas no início.
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
        const acertou = (opcaoSelecionada === respostaCorreta);

        if (acertou) pontuacao++;
        feedbackEl.textContent = acertou ? '✅ Resposta Correta!' : '❌ Resposta Incorreta.';
        
        botoes.forEach(btn => {
            btn.disabled = true; // Desabilita todos os botões após a resposta.
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correta');
            } else if (btn.textContent === opcaoSelecionada) {
                btn.classList.add('incorreta');
            }
        });
        
        setTimeout(() => {
            perguntaAtual++;
            if (perguntaAtual < perguntas.length) {
                feedbackEl.textContent = '';
                mostrarPergunta();
            } else {
                finalizarQuiz();
            }
        }, 1500); // Espera 1.5s antes de avançar.
    }

    function finalizarQuiz() {
        if (!quizContainerEl || !certificadoFormEl || !reprovadoEl) return;

        quizContainerEl.style.display = 'none';
        const aproveitamento = (pontuacao / perguntas.length);
        
        // Critério de aprovação: 75% ou mais (3 de 4, no caso).
        if (aproveitamento >= 0.75) {
            certificadoFormEl.style.display = 'block';
        } else {
            reprovadoEl.style.display = 'block';
        }
    }

    const tentarNovamenteBtn = document.getElementById('tentar-novamente-btn');
    const gerarCertificadoBtn = document.getElementById('gerar-certificado-btn');

    if (tentarNovamenteBtn) tentarNovamenteBtn.addEventListener('click', iniciarQuiz);
    if (gerarCertificadoBtn) gerarCertificadoBtn.addEventListener('click', gerarCertificadoPDF);

    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return cpf;
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function gerarCertificadoPDF() {
        const nomeEl = document.getElementById('nome-aluno');
        const cpfEl = document.getElementById('cpf-aluno');
        
        const nome = nomeEl ? nomeEl.value.trim() : '';
        const cpf = cpfEl ? cpfEl.value.trim() : '';
        
        if (nome === "" || cpf === "") {
            alert("Por favor, preencha seu nome completo e CPF para gerar o certificado.");
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const LOGO_BASE64 = ''; // Cole sua logo Base64 aqui, se tiver.

        // Design do certificado
        doc.setFillColor(230, 240, 255);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(2);
        doc.rect(5, 5, 287, 200);
        
        if (LOGO_BASE64) {
            try {
                const imgProps = doc.getImageProperties(LOGO_BASE64);
                const imgWidth = 50;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                doc.addImage(LOGO_BASE64, 'PNG', 20, 15, imgWidth, imgHeight);
            } catch (e) {
                console.error("Erro ao adicionar a imagem do logo. Verifique o Base64.", e);
            }
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("MANUTENÇÃO INDUSTRIAL ARQUIVOS", 148.5, 25, { align: "center" });
        doc.setFontSize(30);
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 45, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(50, 50, 50);
        doc.text(`Certificamos que`, 148.5, 65, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 102, 204);
        doc.text(nome.toUpperCase(), 148.5, 77, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text(`portador(a) do CPF nº ${formatarCPF(cpf)}, concluiu com aproveitamento o curso de`, 148.5, 87, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("Curso Completo de Lubrificação Industrial", 148.5, 99, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Carga Horária: 2 horas", 148.5, 109, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Conteúdos Estudados:", 20, 125);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const conteudos = [
            "Teoria do Desgaste: Adesivo, Abrasivo e Fadiga", "Princípios da Tribologia e Atrito",
            "Tipos de Lubrificantes: Óleos Minerais e Sintéticos", "Aditivos: Funções e Tipos Principais",
            "Classificação de Viscosidade: SAE e ISO VG", "Métodos de Aplicação de Óleo: Banho, Salpico e Circulação",
            "Relação entre Temperatura e Vida Útil do Lubrificante", "Análise de Contaminação e Degradação do Óleo"
        ];
        
        const col1 = conteudos.slice(0, 4);
        const col2 = conteudos.slice(4);
        let yPos = 132;
        col1.forEach(item => { doc.text(`• ${item}`, 20, yPos); yPos += 6; });
        yPos = 132;
        col2.forEach(item => { doc.text(`• ${item}`, 155, yPos); yPos += 6; });

        const agora = new Date();
        const dataHoraFormatada = agora.toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        doc.setFontSize(12);
        doc.line(90, 185, 205, 185);
        doc.setFont("helvetica", "bold");
        doc.text("Instrutor Responsável", 147.5, 190, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text(`Emitido em: ${dataHoraFormatada}`, 147.5, 197, { align: "center" });
        
        doc.save(`Certificado - Lubrificação - ${nome}.pdf`);
    }

    // =================================================================================
    // --- INICIALIZAÇÃO GERAL ---
    // =================================================================================
    
    // Garante que o primeiro módulo seja exibido ao carregar a página.
    showModule(0);

    // Inicia o quiz se os elementos do quiz existirem na página.
    if (quizContainerEl) {
       iniciarQuiz();
    }
});
