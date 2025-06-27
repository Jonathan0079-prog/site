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
        modules.forEach((module, i) => {
            module.classList.toggle('active', i === index);
        });
        currentModuleIndex = index;
        updateNav();
    }

    function updateNav() {
        indicator.textContent = `${currentModuleIndex + 1} / ${modules.length}`;
        prevBtn.disabled = currentModuleIndex === 0;
        nextBtn.disabled = (currentModuleIndex === modules.length - 1) && !isQuizFinished;

        const currentModuleTitle = modules[currentModuleIndex].querySelector('h2').innerText;
        headerSubtitle.textContent = `Módulo ${currentModuleTitle}`;
    }

    prevBtn.addEventListener('click', () => {
        if (currentModuleIndex > 0) {
            showModule(currentModuleIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentModuleIndex < modules.length - 1) {
            showModule(currentModuleIndex + 1);
        }
    });

    // --- LÓGICA DO SIMULADOR DE TEMPERATURA (CORRIGIDO) ---
    const tempSlider = document.getElementById('tempSlider');
    if (tempSlider) {
        tempSlider.addEventListener('input', function() {
            const baseLife = 8000;
            const temp = parseInt(this.value);
            document.getElementById('tempValue').textContent = temp;
            document.getElementById('baseLife').textContent = baseLife;

            let adjustedLife = baseLife;
            if (temp > 70) {
                const tempDiff = temp - 70;
                // Para cada 15 graus, a vida é dividida por 2.
                adjustedLife = baseLife / Math.pow(2, tempDiff / 15);
            }
            document.getElementById('adjustedLife').textContent = Math.round(adjustedLife);
        });
        // Dispara o evento 'input' para garantir que o valor inicial seja calculado ao carregar a página
        tempSlider.dispatchEvent(new Event('input'));
    }

    // --- LÓGICA DO QUIZ INTERATIVO ---
    const quizContainer = document.getElementById('quiz-container');
    const perguntaTitulo = document.getElementById('pergunta-titulo');
    const opcoesQuiz = document.getElementById('opcoes-quiz');
    const feedback = document.getElementById('feedback');
    const proximaPerguntaBtn = document.getElementById('proxima-pergunta-btn');
    
    const certificadoContainer = document.querySelector('.form-certificado');
    const reprovadoContainer = document.querySelector('.reprovado-container');
    const tentarNovamenteBtn = document.getElementById('tentar-novamente-btn');
    
    let currentQuestionIndex = 0;
    let isQuizFinished = false;
    
    const quizQuestions = [
        {
            question: "1. Qual o principal objetivo da lubrificação elasto-hidrodinâmica (EHL)?",
            options: [
                "Aumentar o atrito para frear o rolamento.",
                "Formar uma película de lubrificante completa que separa as superfícies sob altas pressões.",
                "Depender apenas de aditivos EP para proteção."
            ],
            correctAnswer: 1
        },
        {
            question: "2. Para um ambiente com lavagem por água constante, qual espessante oferece a melhor performance?",
            options: [
                "Argila (Bentone).",
                "Sulfonato de Cálcio.",
                "Complexo de Lítio."
            ],
            correctAnswer: 1
        },
        {
            question: "3. Se for necessário trocar uma graxa de Complexo de Lítio por uma de Poliureia (compatibilidade marginal), qual a ação correta?",
            options: [
                "Apenas misturá-las, pois a compatibilidade é marginal.",
                "O rolamento e o mancal devem ser completamente limpos para remover toda a graxa antiga.",
                "Aumentar a quantidade de graxa nova para purgar a antiga."
            ],
            correctAnswer: 1
        },
        {
            question: "4. Qual é a principal desvantagem de uma estratégia de Manutenção Baseada no Tempo (TBM)?",
            options: [
                "O alto custo de investimento em sensores e software.",
                "Sua ineficiência, pois pode levar a manutenção excessiva ou insuficiente.",
                "A dificuldade de planejar o cronograma."
            ],
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
        // Desabilita todos os botões após a escolha
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
        isQuizFinished = true;
        quizContainer.style.display = 'none';
        
        // Exige 100% de acerto para aprovação
        if (score === quizQuestions.length) {
            certificadoContainer.style.display = 'block';
        } else {
            reprovadoContainer.style.display = 'block';
        }
        updateNav();
    }

    function resetQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        isQuizFinished = false;
        quizContainer.style.display = 'block';
        certificadoContainer.style.display = 'none';
        reprovadoContainer.style.display = 'none';
        proximaPerguntaBtn.textContent = 'Próxima Pergunta';
        loadQuestion(0);
        updateNav();
    }

    tentarNovamenteBtn.addEventListener('click', resetQuiz);

    // --- INICIALIZAÇÃO ---
    showModule(0); // Mostra o primeiro módulo
    loadQuestion(0); // Carrega a primeira pergunta do quiz (que está escondido)
});
