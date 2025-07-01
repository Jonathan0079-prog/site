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
            opcoes: ["No anel externo", "Na gaiola", "Nos corpos rolantes", "No anel interno"],
            resposta: "No anel interno"
        },
        {
            pergunta: "Qual é a temperatura máxima segura geralmente recomendada para aquecer um rolamento durante a montagem a quente?",
            opcoes: ["80°C", "120°C", "180°C", "250°C"],
            resposta: "120°C"
        },
        {
            pergunta: "Qual método de limpeza é mais indicado para componentes sensíveis e de alta precisão, como rolamentos?",
            opcoes: ["Limpeza com jateamento", "Limpeza ultrassônica", "Limpeza manual com escova de aço", "Limpeza com solventes fortes"],
            resposta: "Limpeza ultrassônica"
        },
        {
            pergunta: "De acordo com o curso, qual é um dos erros mais frequentes que pode comprometer a montagem de um componente?",
            opcoes: ["Usar luvas de proteção", "Realizar a montagem em local silencioso", "Falha na limpeza e preparação das peças", "Consultar o manual do fabricante"],
            resposta: "Falha na limpeza e preparação das peças"
        },
        {
            pergunta: "Qual ferramenta é a mais adequada e segura para montagem a quente de rolamentos de médio e grande porte?",
            opcoes: ["Aquecedor por indução", "Maçarico", "Banho de óleo quente", "Prensa hidráulica"],
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

    // Elementos para seleção de país e documento
    const paisSelect = document.getElementById('pais-aluno');
    const documentoLabel = document.getElementById('documento-label');
    const documentoInput = document.getElementById('documento-aluno');
    
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
            // Embaralha as perguntas apenas na primeira vez
            perguntas.sort(() => Math.random() - 0.5);
        }
        const p = perguntas[perguntaAtual];
        perguntaTituloEl.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}: ${p.pergunta}`;
        opcoesQuizEl.innerHTML = '';

        // Embaralha as opções de resposta para cada pergunta
        const opcoesEmbaralhadas = [...p.opcoes].sort(() => Math.random() - 0.5);
        
        opcoesEmbaralhadas.forEach(opcao => {
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

    // Função para formatar CPF (apenas para CPF)
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (cpf.length === 11) {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpf; 
    }

    function gerarCertificadoPDF() {
        const nome = document.getElementById('nome-aluno').value.trim();
        const documento = documentoInput.value.trim(); // Pega o valor do input de documento
        const pais = paisSelect.value; // Pega o país selecionado

        // Validação de preenchimento e tipo de documento
        if (nome === "" || documento === "") {
            alert("Por favor, preencha seu nome completo e documento.");
            return;
        }

        // Validação específica para CPF (11 dígitos numéricos após remoção de máscara)
        if (pais === 'brasil' && documento.replace(/\D/g, '').length !== 11) {
            alert("Por favor, insira um CPF válido (11 dígitos numéricos).");
            return;
        }
        // Você pode adicionar uma validação mais específica para BI aqui se souber o padrão exato
        // Ex: else if (pais === 'angola' && !/^[A-Za-z0-9]{14}$/.test(documento)) {
        //     alert("Por favor, insira um BI válido (ex: 001185821LA032).");
        //     return;
        // }


        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const LOGO_BASE64 = ''; // Se tiver uma logo, cole o Base64 aqui

        // Design do certificado
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

        // --- NOME DA ESCOLA ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("Manutenção Industrial ARQUIVOS", 148.5, 25, { align: "center" });

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
        
        // Lógica para exibir CPF ou BI no certificado
        let documentoTextoCertificado = '';
        if (pais === 'angola') {
            documentoTextoCertificado = `portador(a) do BI nº ${documento},`;
        } else { // Presume-se Brasil ou outro que use CPF
            documentoTextoCertificado = `portador(a) do CPF nº ${formatarCPF(documento)},`;
        }
        doc.text(`${documentoTextoCertificado} concluiu com aproveitamento o curso de`, 148.5, 87, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102);
        doc.text("TÉCNICAS DE MONTAGEM DE ROLAMENTOS", 148.5, 99, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Carga Horária: 1 hora", 148.5, 109, { align: "center" });

        // --- CONTEÚDO PROGRAMÁTICO (NOVO) ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Conteúdo Programático:", 20, 125);
        doc.setFont("helvetica", "normal");
        const conteudos = [
            "Módulo 1: O Olhar Clínico: Inspeção Visual e Dimensional",
            "Módulo 2: Preparando o Terreno: Limpeza Impecável dos Componentes",
            "Módulo 3: O Arsenal do Montador: As Ferramentas Certas para o Trabalho",
            "Módulo 4: Frio ou Quente? A Decisão Estratégica da Montagem",
            "Módulo 5: Mãos à Obra: O Cuidado em Cada Etapa da Montagem",
            "Módulo 6: As \"Pegadinhas\" da Montagem e Como Fugir Delas",
            "Módulo Final: Quiz e Certificação"
        ];
        
        let yPos = 132;
        conteudos.forEach(item => {
            doc.text(`• ${item}`, 20, yPos);
            yPos += 7;
        });

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
        doc.text("Jonathan da Silva Oliveira - Instrutor", 147.5, 190, { align: "center" });
        
        doc.setFont("helvetica", "normal");
        doc.text(`Emitido em: ${dataHoraFormatada}`, 147.5, 197, { align: "center" });
        
        doc.save(`Certificado - Montagem de Rolamentos - ${nome}.pdf`);
    }

    // --- Lógica para o campo de documento (BI/CPF) ---
    // Verifica se os elementos existem antes de adicionar event listeners
    if (paisSelect && documentoLabel && documentoInput) {
        paisSelect.addEventListener('change', function() {
            const paisSelecionado = paisSelect.value;

            if (paisSelecionado === 'angola') {
                documentoLabel.textContent = 'Seu BI:';
                documentoInput.placeholder = 'Digite seu BI (Bilhete de Identidade)';
                documentoInput.maxLength = 14; // Ex: 001185821LA032
                documentoInput.setAttribute('pattern', '[A-Za-z0-9]+'); // Permite letras e números
                documentoInput.inputMode = 'text'; // Garante teclado completo em mobile
            } else { // Assume que é CPF para o Brasil
                documentoLabel.textContent = 'Seu CPF:';
                documentoInput.placeholder = 'Digite seu CPF (apenas números)';
                documentoInput.maxLength = 14; // Comprimento para CPF formatado (XXX.XXX.XXX-XX)
                documentoInput.setAttribute('pattern', '[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}'); // Padrão para CPF
                documentoInput.inputMode = 'numeric'; // Otimiza teclado para números em mobile
            }

            documentoInput.value = ''; // Limpa o campo ao mudar o tipo de documento
            // Dispara o evento 'input' para aplicar formatação inicial se houver algum valor padrão
            // ou para garantir que o inputMode seja aplicado.
            documentoInput.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Adiciona um evento para formatar o CPF enquanto o usuário digita (não afeta BI)
        documentoInput.addEventListener('input', function() {
            const paisSelecionado = paisSelect.value;
            let valor = this.value;

            if (paisSelecionado !== 'angola') { // Se for CPF, aplica formatação e limpa não-dígitos
                valor = valor.replace(/\D/g, ''); // Remove tudo que não é dígito APENAS para CPF
                if (valor.length > 3 && valor.length <= 6) {
                    valor = `${valor.slice(0, 3)}.${valor.slice(3)}`;
                } else if (valor.length > 6 && valor.length <= 9) {
                    valor = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6)}`;
                } else if (valor.length > 9) {
                    valor = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9, 11)}`;
                }
            } 
            // Para BI, o valor é mantido como está, pois pode conter letras.
            this.value = valor;
        });

        // Garante que o estado inicial do campo de documento esteja correto ao carregar a página
        paisSelect.dispatchEvent(new Event('change'));

    } else {
        console.error('Algum elemento do formulário de documento (país, label ou input) não foi encontrado.');
    }

    // --- INICIALIZAÇÃO ---
    showModule(0);
    iniciarQuiz();

});
