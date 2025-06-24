// Este script adiciona uma animação de fade-in aos cards de PDF
// quando eles se tornam visíveis na tela do usuário.

document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os cards de PDF
    const cards = document.querySelectorAll('.card-pdf');

    // Verifica se a API IntersectionObserver é suportada pelo navegador
    if ('IntersectionObserver' in window) {
        
        // Cria um observador que irá monitorar quando os cards entram na tela
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Se o card está visível (intersecting)
                if (entry.isIntersecting) {
                    // Adiciona a classe 'visible' para ativar a animação CSS
                    entry.target.classList.add('visible');
                    // Para de observar o card que já foi animado para economizar recursos
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Define um 'threshold' de 0.1, o que significa que a animação
            // começa quando pelo menos 10% do card está visível.
            threshold: 0.1
        });

        // Pede ao observador para monitorar cada card
        cards.forEach(card => {
            cardObserver.observe(card);
        });

    } else {
        // Se a API não for suportada, simplesmente torna todos os cards visíveis
        // sem a animação de scroll.
        cards.forEach(card => {
            card.classList.add('visible');
        });
    }

});

