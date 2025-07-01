document.addEventListener('DOMContentLoaded', () => {

    // --- MENU HAMBURGER ---
    const menuToggler = document.querySelector('.menu-toggler');
    const mainNav = document.querySelector('#main-nav');

    if (menuToggler && mainNav) {
        menuToggler.addEventListener('click', () => {
            mainNav.classList.toggle('visible');
            const icon = menuToggler.querySelector('.material-icons');
            if (mainNav.classList.contains('visible')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
        // Também fecha o menu ao clicar em qualquer link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('visible');
                const icon = menuToggler.querySelector('.material-icons');
                if (icon) icon.textContent = 'menu';
            });
        });
    }

    // --- ANIMAÇÃO DOS CARDS ---
    const cards = document.querySelectorAll('.curso-card');
    if (cards.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cards.forEach(card => observer.observe(card));
    } else {
        cards.forEach(card => card.classList.add('visible'));
    }

    // --- CARD INTEIRO CLICÁVEL PARA O CURSO ---
    // Torna o card inteiro clicável caso tenha atributo data-href
    document.querySelectorAll('.curso-card[data-href]').forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener('click', function (event) {
            window.location.href = this.getAttribute('data-href');
        });
        // Acessibilidade: permite abrir com Enter/Espaço
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function (e) {
            if (e.key === "Enter" || e.key === " ") {
                window.location.href = this.getAttribute('data-href');
            }
        });
    });

});
