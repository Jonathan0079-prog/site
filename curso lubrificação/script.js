document.addEventListener('DOMContentLoaded', function() {
    // --- VARIÁVEIS GLOBAIS DE CONTROLE ---
    const modules = document.querySelectorAll('.module');
    const prevBtn = document.getElementById('prev-module-btn');
    const nextBtn = document.getElementById('next-module-btn');
    const indicator = document.getElementById('module-indicator');
    const headerSubtitle = document.getElementById('header-subtitle');
    
    let currentModuleIndex = 0;
    let score = 0;

    // --- LÓGICA DE NAVEGAÇÃO DOS MÓDULOS ---
    function showModule(index) {
        if (index < 0 || index >= modules.length) return; // Segurança

        modules.forEach((module, i) => {
            module.classList.toggle('active', i === index);
        });
        currentModuleIndex = index;
        updateNavControls();
        
        // *** COMANDO DE SCROLL CORRIGIDO E MAIS ROBUSTO ***
        document.body.scrollTop = 0; // Para Safari
        document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE e Opera
    }

    // Função única e centralizada para controlar os botões
    function updateNavControls() {
        const activeModule = modules[currentModuleIndex];
        if (activeModule) {
            const currentModuleTitle = activeModule.querySelector('h2').innerText;
            headerSubtitle.textContent = `Módulo ${currentModuleTitle}`;
        }
        
        indicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        prevBtn.disabled = currentModuleIndex === 0;
        nextBtn.disabled = currentModuleIndex === modules.length - 1;
    }

    prevBtn.addEventListener('click', () => showModule(currentModuleIndex - 1));
    nextBtn.addEventListener('click', () => showModule(currentModuleIndex + 1));

    // --- LÓGICA DO SIMULADOR DE TEMPERATURA ---
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

    // --- LÓGICA DO QUIZ INTERATIVO ---
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const perguntaTitulo = document.getElementById('pergunta-titulo');
        const opcoesQuiz = document.getElementById('opcoes-quiz');
        const feedback = document.getElementById('feedback');
        const proximaPerguntaBtn = document.getElementById('proxima-pergunta-btn');
        
        const certificadoContainer = document.querySelector('.form-certificado');
        const reprovadoContainer = document.querySelector('.reprovado-container');
        const tentarNovamenteBtn = document.getElementById('tentar-novamente-btn');
        
        let currentQuestionIndex = 0;
        
        const quizQuestions = [
            {
                question: "1. De acordo com a teoria apresentada, qual o desgaste caracterizado pela transferência de material da superfície mais macia para a mais dura?",
                options: ["Desgaste Abrasivo", "Desgaste Adesivo", "Fadiga Superficial"],
                correctAnswer: 1
            },
            {
                question: "2. Qual a principal vantagem de um óleo sintético sobre um mineral?",
                options: ["Baixo custo", "Maior oleosidade natural", "Excelente performance em temperaturas extremas"],
                correctAnswer: 2
            },
            {
                question: "3. Qual método de aplicação de óleo é o mais completo, permitindo filtragem e controle de temperatura?",
                options: ["Por Salpico", "Por Banho de Óleo", "Por Circulação"],
                correctAnswer: 2
            },
            {
                question: "4. Qual classificação de óleo de motor é baseada exclusivamente na viscosidade?",
                options: ["API", "SAE", "AGMA"],
                correctAnswer: 1
            }
        ];

        function loadQuestion(index) {
            const questionData = quizQuestions[index];
            perguntaTitulo.textContent = questionData.question;
            opcoesQuiz.innerHTML = '';
            feedback.innerHTML = '';
            proximaPerguntaBtn.style.display = 'none';

            questionData.options.forEach((option, i) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => checkAnswer(i, questionData.correctAnswer, button));
                opcoesQuiz.appendChild(button);
            });
        }

        function checkAnswer(selectedIndex, correctIndex, buttonElement) {
            opcoesQuiz.querySelectorAll('button').forEach(btn => btn.disabled = true);
            
            if (selectedIndex === correctIndex) {
                buttonElement.classList.add('correta');
                feedback.textContent = "Resposta Correta!";
                feedback.style.color = 'var(--cor-sucesso)';
                score++;
            } else {
                buttonElement.classList.add('incorreta');
                opcoesQuiz.children[correctIndex].classList.add('correta');
                feedback.textContent = "Resposta Incorreta.";
                feedback.style.color = 'var(--cor-erro)';
            }

            proximaPerguntaBtn.style.display = 'block';
            if (currentQuestionIndex === quizQuestions.length - 1) {
                proximaPerguntaBtn.textContent = 'Finalizar Quiz';
            }
        }

        proximaPerguntaBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                loadQuestion(currentQuestionIndex);
            } else {
                endQuiz();
            }
        });

        function endQuiz() {
            quizContainer.style.display = 'none';
            // Critério de aprovação: 75% (3 de 4)
            if (score >= 3) {
                certificadoContainer.style.display = 'block';
            } else {
                reprovadoContainer.style.display = 'block';
            }
        }

        function resetQuiz() {
            score = 0;
            currentQuestionIndex = 0;
            quizContainer.style.display = 'block';
            certificadoContainer.style.display = 'none';
            reprovadoContainer.style.display = 'none';
            proximaPerguntaBtn.textContent = 'Próxima Pergunta';
            loadQuestion(0);
        }

        tentarNovamenteBtn.addEventListener('click', () => {
            resetQuiz();
            showModule(modules.length - 1); // Garante que permaneça no módulo do quiz
        });

        // Inicializa a primeira pergunta do quiz
        loadQuestion(0);
    }

    // --- INICIALIZAÇÃO GERAL DO CURSO ---
    showModule(0); 
});
