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
            const baseLife = 10000;
            const temp = parseInt(this.value);
            document.getElementById('tempValue').textContent = temp;

            let adjustedLife = baseLife;
            if (temp > 70) {
                const tempDiff = temp - 70;
                adjustedLife = baseLife / Math.pow(2, tempDiff / 15);
            }
            document.getElementById('adjustedLife').textContent = Math.round(adjustedLife);
        });
    }

    // --- INTERAÇÃO 3: JOGO DE COMPATIBILIDADE ---
    const gameContainer = document.querySelector('.compatibility-game-container');
    if (gameContainer) {
        const greases = [
            { id: 'g1', name: 'Graxa de Poliureia', target: 't1' },
            { id: 'g2', name: 'Graxa de Sulf. de Cálcio', target: 't2' },
            { id: 'g3', name: 'Graxa com MoS2', target: 't3' }
        ];
        const applications = [
            { id: 't1', name: 'Motor elétrico (alta rotação, longa vida)' },
            { id: 't2', name: 'Mancal em ambiente com muita água' },
            { id: 't3', name: 'Equipamento de mineração (baixa vel., alta carga)' }
        ];

        const greaseOptionsContainer = document.getElementById('grease-options');
        const appTargetsContainer = document.getElementById('application-targets');

        // Populate game
        greases.forEach(g => {
            greaseOptionsContainer.innerHTML += `<div class="draggable" draggable="true" id="${g.id}" data-target="${g.target}">${g.name}</div>`;
        });
        applications.forEach(a => {
            appTargetsContainer.innerHTML += `<div class="droptarget" id="${a.id}"></div><p class="target-label">${a.name}</p>`;
        });
        
        const draggables = document.querySelectorAll('.draggable');
        const droptargets = document.querySelectorAll('.droptarget');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.style.opacity = '0.5';
            });
            draggable.addEventListener('dragend', () => {
                draggable.style.opacity = '1';
            });
        });

        droptargets.forEach(target => {
            target.addEventListener('dragover', e => {
                e.preventDefault();
                target.classList.add('drag-over');
            });
            target.addEventListener('dragleave', () => {
                target.classList.remove('drag-over');
            });
            target.addEventListener('drop', e => {
                e.preventDefault();
                target.classList.remove('drag-over');
                if (target.children.length === 0) { // Allow drop only if empty
                    const id = e.dataTransfer.getData('text');
                    const draggableElement = document.getElementById(id);
                    target.appendChild(draggableElement);
                }
            });
             // Allow dropping back to the start
            greaseOptionsContainer.addEventListener('dragover', e => e.preventDefault());
            greaseOptionsContainer.addEventListener('drop', e => {
                const id = e.dataTransfer.getData('text');
                const draggableElement = document.getElementById(id);
                greaseOptionsContainer.appendChild(draggableElement);
            });
        });
        
        // Transfer the ID on drag
        document.addEventListener('dragstart', e => {
            if (e.target.classList.contains('draggable')) {
                e.dataTransfer.setData('text/plain', e.target.id);
            }
        });

        document.getElementById('check-game-answers').addEventListener('click', () => {
            let correctCount = 0;
            droptargets.forEach(target => {
                target.classList.remove('correct-drop');
                const dropped = target.querySelector('.draggable');
                if (dropped) {
                    if (dropped.dataset.target === target.id) {
                        target.classList.add('correct-drop');
                        correctCount++;
                    }
                }
            });
            const feedbackEl = document.getElementById('game-feedback');
            feedbackEl.textContent = `Você acertou ${correctCount} de 3!`;
        });
    }


    // --- QUIZ FINAL ---
    const submitButton = document.getElementById('submit-quiz');
    if (!submitButton) return;

    const resultsContainer = document.getElementById('quiz-results');
    const correctAnswers = { q1: 'b', q2: 'c', q3: 'b', q4: 'b' };

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
            resultsContainer.textContent = `Excelente! Você acertou todas as ${totalQuestions} perguntas!`;
            resultsContainer.style.backgroundColor = 'var(--success-color)';
            resultsContainer.style.color = 'var(--success-border)';
        } else {
            resultsContainer.textContent = `Você acertou ${score} de ${totalQuestions}. Revise os módulos para reforçar seu conhecimento!`;
            resultsContainer.style.backgroundColor = 'var(--error-color)';
            resultsContainer.style.color = 'var(--error-border)';
        }
    });

});
