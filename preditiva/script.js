document.addEventListener('DOMContentLoaded', () => {

    const { jsPDF } = window.jspdf;
    const modules = document.querySelectorAll('.module');
    const keyboardNav = document.getElementById('keyboard-nav');
    let currentModuleIndex = 0;

    // --- CRIAÇÃO DOS BOTÕES DE NAVEGAÇÃO ---
    modules.forEach((module, index) => {
        const navButton = document.createElement('button');
        navButton.classList.add('nav-button');
        navButton.textContent = (index + 1);
        if (index === modules.length - 1) {
            navButton.textContent = 'C'; // C de Certificado
            navButton.title = "Certificado";
        } else {
            navButton.title = module.querySelector('h2').textContent;
        }
        navButton.dataset.index = index;
        keyboardNav.appendChild(navButton);

        const navButtonsContainer = document.createElement('div');
        navButtonsContainer.classList.add('module-nav-buttons');

        if (index > 0) {
            const prevButton = document.createElement('button');
            prevButton.textContent = '← Módulo Anterior';
            prevButton.classList.add('nav-btn-module');
            prevButton.addEventListener('click', () => showModule(index - 1));
            navButtonsContainer.appendChild(prevButton);
        }
        
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
    
    keyboardNav.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-button')) {
            const index = parseInt(e.target.dataset.index, 10);
            showModule(index);
        }
    });

    // --- FUNÇÃO PARA MOSTRAR MÓDULO ---
    function showModule(index) {
        if (index < 0 || index >= modules.length) return;
        currentModuleIndex = index;
        modules.forEach(m => m.classList.remove('active'));
        modules[currentModuleIndex].classList.add('active');

        document.querySelectorAll('.nav-button').forEach((btn, i) => {
            btn.classList.toggle('active', i === currentModuleIndex);
        });
        
        window.scrollTo(0, 0);
    }

    // --- LÓGICA DO QUIZ ---
    // Perguntas extraídas do seu HTML e convertidas para o formato necessário
    const perguntas = [
        {
            pergunta: "Para que serve a inspeção em ambientes industriais, mesmo quando os equipamentos aparentam estar funcionando normalmente?",
            opcoes: ["Para garantir que a máquina fique desligada por mais tempo.", "Para acelerar o processo de produção.", "Para detectar sinais de falhas antes que causem paradas inesperadas.", "Para aumentar o custo da manutenção corretiva."],
            resposta: "Para detectar sinais de falhas antes que causem paradas inesperadas."
        },
        {
            pergunta: "Qual o objetivo da inspeção preditiva?",
            opcoes: ["Realizar visitas aleatórias dos técnicos.", "Apenas observar se a máquina está fazendo barulho.", "Analisar dados reais, como vibração e temperatura, para prever falhas futuras.", "Agir somente quando a máquina já apresentou uma falha grave."],
            resposta: "Analisar dados reais, como vibração e temperatura, para prever falhas futuras."
        },
        {
            pergunta: "Qual ferramenta avançada é usada para detectar trincas internas e vazamentos que o ouvido humano não capta?",
            opcoes: ["Analisador de Vibração", "Termografia", "Inspeção por Ultrassom", "Análise de óleo"],
            resposta: "Inspeção por Ultrassom"
        },
        {
            pergunta: "Qual é a principal defesa contra o desgaste de componentes mecânicos?",
            opcoes: ["Aumento da velocidade de operação.", "Uso de materiais mais leves.", "Lubrificação correta.", "Diminuição da frequência de inspeção."],
            resposta: "Lubrificação correta."
        },
        {
            pergunta: "No estudo de caso sobre o motor com vibração anormal, qual é a ação recomendada?",
            opcoes: ["Ignorar, já que o motor está funcionando.", "Registrar como observação para as próximas inspeções.", "Acionar análise de vibração com equipamento portátil no mesmo dia.", "Aguardar até que a vibração seja perceptível ao tato."],
            resposta: "Acionar análise de vibração com equipamento portátil no mesmo dia."
        },
        {
            pergunta: "Qual ferramenta avançada permite visualizar o interior de máquinas e tubulações sem necessidade de desmontagem?",
            opcoes: ["Analisador de Vibração", "Ultrassom Industrial", "Medidor de Espessura Ultrassônico", "Boroscópio (Câmera de Inspeção)"],
            resposta: "Boroscópio (Câmera de Inspeção)"
        },
        {
            pergunta: "Em sistemas pneumáticos, qual é um dos principais impactos de vazamentos de ar comprimido?",
            opcoes: ["Aumento da força nas aplicações.", "Redução do consumo de energia.", "Aumento do consumo de energia elétrica pelo compressor.", "Melhora na eficiência do sistema."],
            resposta: "Aumento do consumo de energia elétrica pelo compressor."
        },
        {
            pergunta: "Qual é o principal objetivo de se criar um Plano de Inspeção?",
            opcoes: ["Aumentar o tempo de parada não programada.", "Reduzir a frequência de calibração das ferramentas.", "Organizar e padronizar as inspeções, garantindo que nenhuma etapa seja esquecida.", "Realizar inspeções apenas quando a máquina já falhou."],
            resposta: "Organizar e padronizar as inspeções, garantindo que nenhuma etapa seja esquecida."
        },
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
        // Embaralha as perguntas no início de cada quiz
        if (perguntaAtual === 0) {
            perguntas.sort(() => Math.random() - 0.5);
        }
        const p = perguntas[perguntaAtual];
        perguntaTituloEl.textContent = `Pergunta ${perguntaAtual + 1}: ${p.pergunta}`;
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

    // --- NOVA FUNÇÃO PARA GERAR O CERTIFICADO PDF ---
    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        const cpf = document.getElementById('cpf-aluno').value.trim();

        if (nome === "" || cpf === "") {
            alert("Por favor, preencha seu nome completo e CPF.");
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // ** ADICIONE SUA LOGO AQUI **
        // 1. Converta sua imagem (PNG com fundo transparente) para o formato Base64.
        //    Use um site como 'base64-image.de'.
        // 2. Cole a string gerada dentro das aspas da constante abaixo.
        const LOGO_BASE64 = ''; // Ex: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...'

        // --- DESIGN DO CERTIFICADO ---
        doc.setFillColor(230, 240, 255);
        doc.rect(0, 0, 297, 210, 'F');
        doc.setDrawColor(0, 51, 102);
        doc.setLineWidth(2);
        doc.rect(5, 5, 287, 200);
        
        // --- LOGO CENTRALIZADA ---
        if (LOGO_BASE64) {
            const imgProps = doc.getImageProperties(LOGO_BASE64);
            const imgWidth = 80; // Largura da logo em mm
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
            const y = 15; // Posição Y (topo)
            doc.addImage(LOGO_BASE64, 'PNG', x, y, imgWidth, imgHeight);
        }

        // --- TÍTULO ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(30);
        doc.setTextColor(0, 51, 102);
        doc.text("CERTIFICADO DE CONCLUSÃO", 148.5, 60, { align: "center" });

        // --- TEXTO PRINCIPAL ---
        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(50, 50, 50);
        const textoPrincipal = `Certificamos que`;
        doc.text(textoPrincipal, 148.5, 80, { align: "center" });

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
        doc.text("INSPEÇÃO DE MÁQUINAS INDUSTRIAIS", 148.5, 112, { align: "center" });
        
        // --- CARGA HORÁRIA ---
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Carga Horária: 2 horas", 148.5, 122, { align: "center" });

        // --- CONTEÚDOS ESTUDADOS ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Conteúdos Estudados:", 20, 135);
        doc.setFont("helvetica", "normal");
        const conteudos = [
            "Introdução e Tipos de Inspeção (Preventiva, Preditiva)", "Inspeção Sensitiva e Instrumentada (Termografia, Vibração)",
            "Procedimentos Padrão e Checklists", "Registro e Análise de Dados de Inspeção",
            "Análise de Falhas Mecânicas (Rolamentos, Acoplamentos)", "Análise de Falhas Elétricas (Motores, Painéis)",
            "Ferramentas Avançadas (Ultrassom, Boroscópio)", "Desgaste, Lubrificação e Vida Útil de Componentes",
            "Inspeção de Sistemas Pneumáticos e Hidráulicos", "Inspeção Estrutural e de Segurança", "Criação de Planos de Inspeção e Melhoria Contínua"
        ];
        // Dividindo em duas colunas para melhor layout
        const col1 = conteudos.slice(0, 6);
        const col2 = conteudos.slice(6);
        let yPos = 140;
        col1.forEach(item => {
            doc.text(`• ${item}`, 20, yPos);
            yPos += 5;
        });
        yPos = 140;
        col2.forEach(item => {
            doc.text(`• ${item}`, 155, yPos);
            yPos += 5;
        });

        // --- ASSINATURA E DATA ---
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.setFontSize(12);
        doc.line(110, 185, 185, 185); // Linha da assinatura
        doc.text("Assinatura do Responsável", 147.5, 190, { align: "center" });
        doc.text(`Emitido em: ${dataFormatada}`, 147.5, 197, { align: "center" });
        
        doc.save(`Certificado - Inspeção Industrial - ${nome}.pdf`);
    }

    // --- INICIALIZAÇÃO ---
    showModule(0);
    iniciarQuiz();

});
