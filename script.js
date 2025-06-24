document.addEventListener('DOMContentLoaded', () => {

    // Efeito de "Fade-in" para os cards dos cursos ao rolar a página
    const cards = document.querySelectorAll('.curso-card');

    const observerOptions = {
        root: null, // Observa em relação à viewport
        rootMargin: '0px',
        threshold: 0.1 // O gatilho é acionado quando 10% do card está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se o card está entrando na viewport
            if (entry.isIntersecting) {
                // Adiciona a classe 'visible' para ativar a animação do CSS
                entry.target.classList.add('visible');
                // Para de observar o card para a animação não repetir
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Inicia a observação para cada card
    cards.forEach(card => {
        observer.observe(card);
    });

    // Bônus: Alerta para o usuário sobre os links dos cursos (opcional)
    const courseButtons = document.querySelectorAll('.btn');
    courseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Pega o destino do link
            const targetPage = event.target.getAttribute('href');
            // Verifica se a página de destino ainda é um exemplo
            if (targetPage.includes('curso-')) {
                // Previne o link de abrir imediatamente
                event.preventDefault(); 
                alert(`Este é um exemplo. Para funcionar, crie o arquivo HTML chamado "${targetPage}" e coloque o conteúdo do seu curso nele.`);
                // Após o alerta, redireciona para a página
                window.location.href = targetPage;
            }
        });
    });

});
