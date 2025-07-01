document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA O MENU HAMBURGER ---
    const menuToggler = document.querySelector('.menu-toggler');
    const mainNav = document.querySelector('#main-nav');

    if (menuToggler && mainNav) {
        menuToggler.addEventListener('click', () => {
            // Adiciona ou remove a classe 'visible' da navegação
            mainNav.classList.toggle('visible');
            // Adiciona ou remove a classe 'open' do botão para a animação de rotação
            menuToggler.classList.toggle('open');
            
            // Troca o ícone de 'menu' para 'fechar'
            const icon = menuToggler.querySelector('.material-icons');
            if (mainNav.classList.contains('visible')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
    }

    // --- LÓGICA PARA ANIMAR OS CARDS AO APARECEREM NA TELA ---
    const cards = document.querySelectorAll('.curso-card-link'); // Observa o link que envolve o card
    if (cards.length > 0) {
        const observerOptions = {
            root: null, // Observa em relação à viewport
            rootMargin: '0px',
            threshold: 0.1 // O gatilho é acionado quando 10% do card está visível
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Para de observar depois que a animação acontece
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            observer.observe(card);
        });
    }
});
