document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidade dos Quizzes ---
    const quizContainers = document.querySelectorAll('.quiz-container');

    quizContainers.forEach(container => {
        const submitBtn = container.querySelector('.quiz-submit-btn');
        const resultDiv = container.querySelector('.quiz-result');
        const radioButtons = container.querySelectorAll('input[type="radio"]');

        // Respostas corretas para cada quiz (poderia vir de um objeto mais complexo)
        // Usamos o 'name' do input para identificar a pergunta
        const answers = {
            'q1': 'b', // Resposta para a pergunta do módulo 9
            'q2': 'c'  // Resposta para a pergunta do módulo 13
        };
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                let selectedAnswer = null;
                const questionName = radioButtons[0].name;

                for (const radioButton of radioButtons) {
                    if (radioButton.checked) {
                        selectedAnswer = radioButton.value;
                        break;
                    }
                }

                resultDiv.textContent = '';
                resultDiv.classList.remove('correct', 'incorrect');

                if (selectedAnswer) {
                    const correctAnswer = answers[questionName];
                    if (selectedAnswer === correctAnswer) {
                        resultDiv.textContent = 'Resposta Correta! Excelente! A sobrelubrificação causa agitação da graxa, gerando calor e aumentando a pressão interna, o que pode danificar as vedações e o rolamento.';
                        resultDiv.classList.add('correct');
                    } else {
                        // Fornece um feedback mais educativo
                        let feedback = 'Resposta Incorreta. ';
                        if (questionName === 'q2' && selectedAnswer === 'a') {
                            feedback += 'O uso de maçarico é extremamente perigoso, pois causa aquecimento localizado e descontrolado, podendo alterar a estrutura do aço do rolamento.';
                        } else if (questionName === 'q2' && selectedAnswer === 'b') {
                            feedback += 'O banho de óleo já foi usado, mas apresenta riscos de contaminação do óleo e de segurança (fogo).';
                        } else {
                           feedback += 'Tente novamente para reforçar o conhecimento.';
                        }
                        resultDiv.textContent = feedback;
                        resultDiv.classList.add('incorrect');
                    }
                } else {
                    resultDiv.textContent = 'Por favor, selecione uma opção para verificar.';
                    resultDiv.classList.add('incorrect');
                }
            });
        }
    });

    // --- Navegação Ativa na Barra Lateral ---
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.module');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Botão "Voltar ao Topo" ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
