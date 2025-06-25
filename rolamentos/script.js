document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidade dos Quizzes (sem alteração) ---
    const quizContainers = document.querySelectorAll('.quiz-container');
    quizContainers.forEach(container => {
        const submitBtn = container.querySelector('.quiz-submit-btn');
        const resultDiv = container.querySelector('.quiz-result');
        const radioButtons = container.querySelectorAll('input[type="radio"]');
        const answers = { 'q1': 'b', 'q2': 'c' };
        
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
                    if (selectedAnswer === answers[questionName]) {
                        resultDiv.textContent = 'Resposta Correta! Ótimo trabalho!';
                        resultDiv.classList.add('correct');
                    } else {
                        resultDiv.textContent = 'Resposta Incorreta. Tente novamente.';
                        resultDiv.classList.add('incorrect');
                    }
                } else {
                    resultDiv.textContent = 'Por favor, selecione uma opção.';
                }
            });
        }
    });

    // --- Navegação Ativa na Barra Lateral (sem alteração) ---
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.module');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.4 };
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
    sections.forEach(section => { sectionObserver.observe(section); });

    // --- Botão "Voltar ao Topo" (sem alteração) ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };
    backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // --- NOVA FUNCIONALIDADE DE GERAÇÃO DE CERTIFICADO ---

    const gerarBtn = document.getElementById('gerar-certificado-btn');
    const imprimirBtn = document.getElementById('imprimir-certificado-btn');
    const certificadoContainer = document.getElementById('certificado-container');
    const nomeInput = document.getElementById('nome-aluno');
    const cpfInput = document.getElementById('cpf-aluno');

    gerarBtn.addEventListener('click', () => {
        const nomeAluno = nomeInput.value.trim();
        const cpfAluno = cpfInput.value.trim();

        if (nomeAluno === '' || cpfAluno === '') {
            alert('Por favor, preencha seu nome completo e CPF para gerar o certificado.');
            return;
        }

        // Popula os dados no certificado
        document.getElementById('certificado-nome').textContent = nomeAluno.toUpperCase();
        document.getElementById('certificado-cpf').textContent = formatarCPF(cpfAluno);
        
        // Gera data e hora atuais
        const agora = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const dataFormatada = agora.toLocaleDateString('pt-BR', options);
        document.getElementById('certificado-data').textContent = dataFormatada;

        // Exibe o certificado e o botão de imprimir
        certificadoContainer.style.display = 'block';
        imprimirBtn.style.display = 'inline-block';
        
        // Rola a página para o certificado
        certificadoContainer.scrollIntoView({ behavior: 'smooth' });
    });

    imprimirBtn.addEventListener('click', () => {
        window.print();
    });

    // Função para formatar o CPF para exibição
    function formatarCPF(cpf) {
        // Remove qualquer caractere que não seja número
        cpf = cpf.replace(/\D/g, '');
        // Aplica a máscara
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
});
