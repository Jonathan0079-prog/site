document.addEventListener('DOMContentLoaded', function() {

    // --- INTERAÇÃO 1: "CLIQUE PARA REVELAR" ---
    const revealToggles = document.querySelectorAll('.reveal-toggle');
    revealToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('i');
            content.classList.toggle('show');
            if (content.classList.contains('show')) {
                icon.classList.remove('fa-circle-plus');
                icon.classList.add('fa-circle-minus');
            } else {
                icon.classList.remove('fa-circle-minus');
                icon.classList.add('fa-circle-plus');
            }
        });
    });

    // --- INTERAÇÃO 2: SIMULADOR DE TEMPERATURA ---
    const tempSlider = document.getElementById('tempSlider');
    if (tempSlider) {
        tempSlider.addEventListener('input', function() {
            const baseLife = 8000; // Valor base para o exemplo
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
        // Trigger a a anipulação inicial
        tempSlider.dispatchEvent(new Event('input'));
    }
    
    // --- QUIZ FINAL ATUALIZADO ---
    const submitButton = document.getElementById('submit-quiz');
    if (!submitButton) return;

    const resultsContainer = document.getElementById('quiz-results');
    // Respostas corretas para o novo quiz
    const correctAnswers = { 
        q1: 'b', // EHL
        q2: 'b', // Sulfonato de Cálcio
        q3: 'b', // Limpeza completa
        q4: 'c'  // Ineficiência da TBM
    };

    submitButton.addEventListener('click', () => {
        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;
        resultsContainer.innerHTML = '';
        resultsContainer.className = '';
        document.querySelectorAll('.question-item label').forEach(label => {
            label.classList.remove('correct', 'incorrect');
        });

        for (const question in correctAnswers) {
            const userAnswerNode = document.querySelector(`input[name="${question}"]:checked`);
            if (userAnswerNode) {
                const questionLabel = userAnswerNode.parentElement;
                if (userAnswerNode.value === correctAnswers[question]) {
                    score++;
                    questionLabel.classList.add('correct');
                } else {
                    questionLabel.classList.add('incorrect');
                }
            }
        }

        if (score === totalQuestions) {
            resultsContainer.textContent = `Excelente! Você acertou todas as ${totalQuestions} perguntas! Conhecimento consolidado.`;
            resultsContainer.style.backgroundColor = 'var(--success-color)';
            resultsContainer.style.color = 'var(--success-border)';
        } else {
            resultsContainer.textContent = `Você acertou ${score} de ${totalQuestions}. Revise os módulos para reforçar seu conhecimento!`;
            resultsContainer.style.backgroundColor = 'var(--error-color)';
            resultsContainer.style.color = 'var(--error-border)';
        }
    });

});
