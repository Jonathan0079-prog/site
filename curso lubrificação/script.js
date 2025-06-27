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
        nextBtn.disabled = (currentModuleIndex === modules.length - 1);

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

    // --- LÓGICA DO SIMULADOR DE TEMPERATURA ---
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
                adjustedLife = baseLife / Math.pow(2, tempDiff / 15);
            }
            document.getElementById('adjustedLife').textContent = Math.round(adjustedLife);
        });
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
    let isQuizFinished = false; // Controle para o estado do quiz
    
    const quizQuestions = [
        {
            question: "1. O que acontece com o intervalo de relubrificação se a temperatura de um mancal sobe de 70°C para 100°C?",
            options: [
                "Permanece o mesmo.",
                "Dobra (aumenta 2x).",
                "É reduzido para um quarto (dividido por 4)."
            ],
            correctAnswer: 2
        },
        {
            question: "2. Qual método de aplicação de lubrificante é mais adequado para um sistema com múltiplos pontos e que exige alta confiabilidade?",
            options: [
                "Lubrificação manual com pistola graxeira.",
                "Sistema de lubrificação por circulação.",
                "Copo conta-gotas."
            ],
            correctAnswer: 1
        },
        {
            question: "3. Qual é a principal função de um aditivo de Extrema Pressão (EP) em uma graxa?",
            options: [
                "Aumentar o índice de viscosidade.",
                "Evitar a microssoldagem das superfícies sob altas cargas.",
                "Melhorar a resistência à oxidação."
            ],
            correctAnswer: 1
        },
        {
            question: "4. A mistura de uma graxa de espessante de Lítio com uma de Poliureia é uma prática recomendada?",
            options: [
                "Sim, são totalmente compatíveis.",
                "Não, a mistura pode destruir a estrutura do espessante.",
                "Sim, desde que a quantidade de graxa de Poliureia seja menor."
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
        
        // Critério de aprovação: 75% (3 de 4)
        if (score >= 3) {
            certificadoContainer.style.display = 'block';
        } else {
            reprovadoContainer.style.display = 'block';
        }
        nextBtn.disabled = true; // Desabilita o botão de avançar ao final do quiz
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

    tentarNovamenteBtn.addEventListener('click', () => {
        showModule(0); // Volta para o primeiro módulo
        resetQuiz();
    });

    // --- INICIALIZAÇÃO ---
    showModule(0); 
    if(quizContainer) {
        loadQuestion(0);
    }
});
