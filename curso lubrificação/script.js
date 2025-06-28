document.addEventListener('DOMContentLoaded', () => {

    // --- DEPENDÊNCIA PARA GERAR O PDF ---
    // Certifique-se de que a biblioteca jsPDF está carregada no seu HTML
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    const { jsPDF } = window.jspdf;

    // --- VARIÁVEIS E CONTROLES GLOBAIS DOS MÓDULOS ---
    const modules = document.querySelectorAll('.module');
    let currentModuleIndex = 0;

    const prevModuleBtn = document.getElementById('prev-module-btn');
    const nextModuleBtn = document.getElementById('next-module-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    const floatingNav = document.querySelector('.floating-nav'); // Assumindo que você tem uma nav flutuante com esta classe

    // --- LÓGICA DE NAVEGAÇÃO DOS MÓDULOS (ESTILO ATUALIZADO) ---
    function showModule(index) {
        if (index < 0 || index >= modules.length) {
            return; // Segurança para não navegar para um módulo inexistente
        }
        currentModuleIndex = index;

        // Remove a classe 'active' de todos os módulos
        modules.forEach(m => {
            m.classList.remove('active');
        });

        // Adiciona a classe 'active' apenas ao módulo atual
        modules[currentModuleIndex].classList.add('active');

        // Atualiza os controles de navegação
        if (moduleIndicator) moduleIndicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        if (prevModuleBtn) prevModuleBtn.disabled = (currentModuleIndex === 0);
        if (nextModuleBtn) nextModuleBtn.disabled = (currentModuleIndex === modules.length - 1);
        
        // Esconde a navegação flutuante no último módulo (onde está o quiz)
        if (floatingNav) {
            if (currentModuleIndex === modules.length - 1) {
                floatingNav.classList.add('hidden');
            } else {
                floatingNav.classList.remove('hidden');
            }
        }
        
        // Rola a página para o topo ao trocar de módulo
        window.scrollTo(0, 0);
    }

    if (prevModuleBtn) prevModuleBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
    if (nextModuleBtn) nextModuleBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));
    
    // --- LÓGICA DO SIMULADOR DE TEMPERATURA (MANTIDA DO CÓDIGO ORIGINAL) ---
    const tempSlider = document.getElementById('tempSlider');
    if (tempSlider) {
        tempSlider.addEventListener('input', function() {
            const baseLife = 8000;
            const temp = parseInt(this.value, 10);
            document.getElementById('tempValue').textContent = temp;
            document.getElementById('baseLife').textContent = baseLife;

            let adjustedLife = baseLife;
            if (temp > 70) {
                const tempDiff = temp - 70;
                adjustedLife = baseLife / Math.pow(2, tempDiff / 15);
            }
            document.getElementById('adjustedLife').textContent = Math.round(adjustedLife);
        });
        tempSlider.dispatchEvent(new Event('input'));
    }

    // --- LÓGICA DO QUIZ INTERATIVO (ESTRUTURA ATUALIZADA) ---
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
    
    const perguntaTituloEl = document.getElementById('pergunta-titulo');
    const opcoesQuizEl = document.getElementById('opcoes-quiz');
    const feedbackEl = document.getElementById('feedback');
    const quizContainerEl = document.getElementById('quiz-container');
    const certificadoFormEl = document.getElementById('certificado-form-container'); // O container do formulário
    const reprovadoEl = document.getElementById('reprovado-container'); // O container de reprovação
    
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
        // Embaralha as perguntas apenas na primeira vez
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
        feedbackEl.textContent = acertou ? '✅ Resposta Correta!' : '❌ Resposta Incorreta.';
        
        botoes.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === respostaCorreta) btn.classList.add('correta');
            else if (btn.textContent === opcaoSelecionada) btn.classList.add('incorreta');
        });
        
        // Avança para a próxima pergunta automaticamente após 1.5 segundos
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
        // Critério de aprovação: 100% de acerto
        if (pontuacao >= (perguntas.length * 0.75)) { // ou pontuacao === perguntas.length se quiser 100%
            certificadoFormEl.style.display = 'block';
        } else {
            reprovadoEl.style.display = 'block';
        }
    }

    const tentarNovamenteBtn = document.getElementById('tentar-novamente-btn');
    const gerarCertificadoBtn = document.getElementById('gerar-certificado-btn');

    if (tentarNovamenteBtn) tentarNovamenteBtn.addEventListener('click', iniciarQuiz);
    if (gerarCertificadoBtn) gerarCertificadoBtn.addEventListener('click', gerarCertificadoPDF);

    // --- LÓGICA DE GERAÇÃO DO CERTIFICADO PDF ---
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (cpf.length !== 11) return cpf; // Retorna o valor se não for um CPF completo
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        const cpf = document.getElementById('cpf-aluno').value.trim();
        if (nome === "" || cpf === "") {
            alert("Por favor, preencha seu nome completo e CPF para gerar o certificado.");
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        
        // Insira sua logo em formato Base64 aqui. Deixe em branco se não tiver.
        // Você pode converter uma imagem em Base64 em sites como 'base64-image.de'
        const LOGO_BASE64 = ''; 

        // Design do certificado (cores, bordas)
        doc.setFillColor(230, 240, 255); // Fundo azul claro
        doc.rect(0, 0, 297, 210, 'F');
        doc.setDrawColor(0, 51, 102); // Borda azul escura
        doc.setLineWidth(2);
        doc.rect(5, 5, 287, 200); // Retângulo da borda interna
        
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

        // --- NOME DA EMPRESA/ESCOLA ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("ARQUIVOS DE TREINAMENTO INDUSTRIAL", 148.5, 25, { align: "center" });

        // --- TÍTULO PRINCIPAL ---
        doc.setFontSize(30);
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 45, { align: "center" });

        // --- TEXTO DO CERTIFICADO ---
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
        doc.text("FUNDAMENTOS DA LUBRIFICAÇÃO E TRIBOLOGIA", 148.5, 99, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Carga Horária: 1 hora", 148.5, 109, { align: "center" });

        // --- CONTEÚDOS ESTUDADOS (ADAPTADO PARA O CURSO DE LUBRIFICAÇÃO) ---
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

        // --- DATA, HORA E ASSINATURA ---
        const agora = new Date();
        const dataHoraFormatada = agora.toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        doc.setFontSize(12);
        doc.line(90, 185, 205, 185); // Linha da assinatura
        doc.setFont("helvetica", "bold");
        doc.text("Instrutor Responsável", 147.5, 190, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.text(`Emitido em: ${dataHoraFormatada}`, 147.5, 197, { align: "center" });
        
        doc.save(`Certificado - Lubrificação - ${nome}.pdf`);
    }

    // --- INICIALIZAÇÃO GERAL DO CURSO ---
    showModule(0);
    if(quizContainerEl) {
       iniciarQuiz();
    }
});
