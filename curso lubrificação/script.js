document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // --- SEÇÃO 1: NAVEGAÇÃO GERAL ENTRE OS MÓDULOS ---
    // =================================================================================

    const modules = document.querySelectorAll('.module');
    const prevModuleBtn = document.getElementById('prev-module-btn');
    const nextModuleBtn = document.getElementById('next-module-btn');
    const moduleIndicator = document.getElementById('module-indicator');
    const floatingNav = document.querySelector('.floating-nav');
    
    let currentModuleIndex = 0;

    function showModule(index) {
        if (index < 0 || index >= modules.length) {
            return; 
        }
        currentModuleIndex = index;

        modules.forEach(m => m.classList.remove('active'));
        modules[currentModuleIndex].classList.add('active');

        updateNavigationUI();
        window.scrollTo(0, 0); 
    }

    function updateNavigationUI() {
        if (moduleIndicator) {
            moduleIndicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        }
        if (floatingNav) {
            floatingNav.style.display = (currentModuleIndex === modules.length - 1) ? 'none' : 'flex';
        }
        if (prevModuleBtn) {
            prevModuleBtn.disabled = (currentModuleIndex === 0);
        }
        if (nextModuleBtn) {
            nextModuleBtn.disabled = (currentModuleIndex === modules.length - 1);
        }
    }

    if (prevModuleBtn) prevModuleBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
    if (nextModuleBtn) nextModuleBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));


    // =================================================================================
    // --- SEÇÃO 2: FUNCIONALIDADE DA CALCULADORA DE GRAXA (MÓDULO 7) ---
    // =================================================================================
    
    const calcularGraxaBtn = document.getElementById('calcular-graxa-btn');
    
    if (calcularGraxaBtn) {
        calcularGraxaBtn.addEventListener('click', () => {
            const diametroInput = document.getElementById('diametro');
            const larguraInput = document.getElementById('largura');
            const resultadoDiv = document.getElementById('resultado-calculo');

            const D = parseFloat(diametroInput.value);
            const B = parseFloat(larguraInput.value);

            if (isNaN(D) || isNaN(B) || D <= 0 || B <= 0) {
                resultadoDiv.innerHTML = `<p style="color: red;">Por favor, insira valores numéricos válidos e positivos para o diâmetro e a largura.</p>`;
                return;
            }

            const quantidadeGraxa = 0.005 * D * B;
            
            resultadoDiv.innerHTML = `
                <p>Quantidade de Graxa (G) = 0.005 × ${D}mm × ${B}mm</p>
                <p><strong>Resultado: ${quantidadeGraxa.toFixed(2)} gramas</strong></p>
            `;
        });
    }

    // =================================================================================
    // --- SEÇÃO 3: QUIZ INTERATIVO E GERAÇÃO DE CERTIFICADO (MÓDULO 11) ---
    // =================================================================================

    const quizContainerEl = document.getElementById('quiz-container');
    if (quizContainerEl) {
        const { jsPDF } = window.jspdf;

        const perguntas = [
            {
                pergunta: "Qual tipo de desgaste ocorre quando tensões de contato geram trincas após um certo número de ciclos?",
                opcoes: ["Desgaste Adesivo", "Desgaste Abrasivo", "Fadiga Superficial", "Corrosão Química"],
                resposta: "Fadiga Superficial"
            },
            {
                pergunta: "Qual tipo de lubrificação forma uma película espessa que separa completamente as superfícies?",
                opcoes: ["Lubrificação Limite", "Lubrificação Hidrodinâmica", "Lubrificação a Seco", "Lubrificação Mista"],
                resposta: "Lubrificação Hidrodinâmica"
            },
            {
                pergunta: "Qual propriedade dos óleos indica a sua resistência em variar de viscosidade com a mudança de temperatura?",
                opcoes: ["Ponto de Fulgor", "Índice de Viscosidade (IV)", "Demulsibilidade", "Ponto de Névoa"],
                resposta: "Índice de Viscosidade (IV)"
            },
            {
                pergunta: "Qual tipo de graxa é conhecida como 'multipurpose' por ser insolúvel em água e resistir a altas temperaturas?",
                opcoes: ["Graxa de Sabão de Cálcio", "Graxa de Sabão de Sódio", "Graxa de Sabão de Lítio", "Graxa de Sabão de Bário"],
                resposta: "Graxa de Sabão de Lítio"
            },
            {
                pergunta: "Qual método de lubrificação com reaproveitamento é considerado o mais completo, permitindo o uso de filtros e trocadores de calor?",
                opcoes: ["Por Salpico", "Por Anel ou Corrente", "Por Banho de Óleo", "Por Circulação"],
                resposta: "Por Circulação"
            },
            {
                pergunta: "A classificação SAE para óleos de motor (ex: SAE 30, SAE 10W-40) baseia-se em qual propriedade?",
                opcoes: ["Nível de Desempenho (Aditivos)", "Apenas na Viscosidade", "Origem (Mineral ou Sintético)", "Capacidade de Extrema Pressão"],
                resposta: "Apenas na Viscosidade"
            }
        ];

        let perguntaAtual = 0;
        let pontuacao = 0;

        const perguntaTituloEl = document.getElementById('pergunta-titulo');
        const opcoesQuizEl = document.getElementById('opcoes-quiz');
        const feedbackEl = document.getElementById('feedback');
        const certificadoFormEl = document.getElementById('certificado-form-container');
        const reprovadoEl = document.getElementById('reprovado-container');
        const tentarNovamenteBtn = document.getElementById('tentar-novamente-btn');
        const gerarCertificadoBtn = document.getElementById('gerar-certificado-btn');

        function iniciarQuiz() {
            perguntaAtual = 0;
            pontuacao = 0;
            if(feedbackEl) feedbackEl.innerHTML = '';
            if(certificadoFormEl) certificadoFormEl.style.display = 'none';
            if(reprovadoEl) reprovadoEl.style.display = 'none';
            if(quizContainerEl) quizContainerEl.style.display = 'block';
            mostrarPergunta();
        }

        function mostrarPergunta() {
            // Embaralha as PERGUNTAS apenas na primeira vez que o quiz é iniciado.
            if (perguntaAtual === 0) {
                perguntas.sort(() => Math.random() - 0.5);
            }
            
            const p = perguntas[perguntaAtual];
            
            // --- ALTERAÇÃO PRINCIPAL: EMBARALHAR AS OPÇÕES DE RESPOSTA ---
            // Criamos uma cópia do array de opções e a embaralhamos usando o mesmo método.
            // Isso garante que a ordem das respostas seja diferente a cada vez que a pergunta é exibida.
            const opcoesEmbaralhadas = [...p.opcoes].sort(() => Math.random() - 0.5);
            
            perguntaTituloEl.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}: ${p.pergunta}`;
            opcoesQuizEl.innerHTML = '';
            
            // Agora, usamos o novo array de opções embaralhadas para criar os botões.
            opcoesEmbaralhadas.forEach(opcao => {
                const btn = document.createElement('button');
                btn.textContent = opcao;
                // A verificação continua sendo feita contra a resposta correta original.
                btn.onclick = () => verificarResposta(opcao, p.resposta);
                opcoesQuizEl.appendChild(btn);
            });
        }

        function verificarResposta(opcaoSelecionada, respostaCorreta) {
            const botoes = opcoesQuizEl.querySelectorAll('button');
            const acertou = (opcaoSelecionada === respostaCorreta);

            if (acertou) pontuacao++;
            feedbackEl.innerHTML = acertou ? '<p style="color: green;">✅ Resposta Correta!</p>' : '<p style="color: red;">❌ Resposta Incorreta.</p>';
            
            botoes.forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === respostaCorreta) {
                    btn.classList.add('correta');
                } else if (btn.textContent === opcaoSelecionada) {
                    btn.classList.add('incorreta');
                }
            });
            
            setTimeout(() => {
                perguntaAtual++;
                if (perguntaAtual < perguntas.length) {
                    feedbackEl.innerHTML = '';
                    mostrarPergunta();
                } else {
                    finalizarQuiz();
                }
            }, 2000);
        }

        function finalizarQuiz() {
            quizContainerEl.style.display = 'none';
            if (pontuacao === perguntas.length) {
                certificadoFormEl.style.display = 'block';
            } else {
                reprovadoEl.style.display = 'block';
            }
        }

        if (tentarNovamenteBtn) tentarNovamenteBtn.addEventListener('click', iniciarQuiz);
        if (gerarCertificadoBtn) gerarCertificadoBtn.addEventListener('click', gerarCertificadoPDF);
        
        function formatarCPF(cpf) {
            cpf = cpf.replace(/\D/g, ''); 
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
            cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            return cpf;
        }

        function gerarCertificadoPDF() {
            const nomeInput = document.getElementById('nome-aluno');
            const cpfInput = document.getElementById('cpf-aluno');
            const nome = nomeInput.value.trim();
            const cpf = cpfInput.value.trim();

            if (nome === "" || cpf.replace(/\D/g, '').length !== 11) {
                alert("Por favor, preencha seu nome completo e um CPF válido (11 dígitos).");
                return;
            }

            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const LOGO_BASE64 = '';

            doc.setFillColor(230, 240, 255);
            doc.rect(0, 0, 297, 210, 'F');
            doc.setDrawColor(0, 51, 102);
            doc.setLineWidth(2);
            doc.rect(5, 5, 287, 200);

            if (LOGO_BASE64) {
                const imgProps = doc.getImageProperties(LOGO_BASE64);
                const imgWidth = 50;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                doc.addImage(LOGO_BASE64, 'PNG', 20, 15, imgWidth, imgHeight);
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(0, 51, 102);
            doc.text("Manutenção Industrial ARQUIVOS", 148.5, 25, { align: "center" });

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
            doc.setTextColor(50, 50, 50);
            doc.text("Conteúdo Programático:", 20, 125);

            doc.setFont("helvetica", "normal");
            const conteudos = [
                '• Teoria do Desgaste: Adesivo, Abrasivo e Fadiga',
                '• Princípios da Tribologia e Atrito',
                '• Tipos de Lubrificantes: Óleos Minerais e Sintéticos',
                '• Aditivos: Funções e Tipos Principais',
                '• Classificação de Viscosidade: SAE e ISO VG',
                '• Métodos de Aplicação de Óleo: Banho, Salpico e Circulação',
                '• Relação entre Temperatura e Vida Útil do Lubrificante',
                '• Análise de Contaminação e Degradação do Óleo'
            ];
            
            let yPos = 132;
            conteudos.forEach(item => {
                doc.text(item, 20, yPos);
                yPos += 7;
            });

            const agora = new Date();
            const dataHoraFormatada = agora.toLocaleString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            doc.setFontSize(12);
            doc.setDrawColor(50, 50, 50);
            doc.line(90, 185, 205, 185);
            
            doc.setFont("helvetica", "bold");
            doc.text("Jonathan da Silva Oliveira - Instrutor", 147.5, 190, { align: "center" });
            
            doc.setFont("helvetica", "normal");
            doc.text(`Emitido em: ${dataHoraFormatada}`, 147.5, 197, { align: "center" });
            
            doc.save(`Certificado - Lubrificação Industrial - ${nome}.pdf`);
        }

        iniciarQuiz();
    }

    // =================================================================================
    // --- INICIALIZAÇÃO GERAL DO CURSO ---
    // =================================================================================
    
    showModule(0);

});
