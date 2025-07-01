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

    // --- NAVEGAÇÃO DOS BOTÕES DE CURSO ---
    const courseButtons = document.querySelectorAll('.btn');
    courseButtons.forEach(button => {
        // Suporte a click e touch, sem navegação duplicada
        function navigate(event) {
            // Aceita tanto <a> quanto <button data-href="">
            const targetPage = button.getAttribute('href') || button.dataset.href;
            if (targetPage && (targetPage.includes('curso-') || targetPage.includes('curso '))) {
                event.preventDefault();
                window.location.href = targetPage;
            }
        }
        button.addEventListener('click', navigate, false);
        button.addEventListener('touchend', navigate, false);
    });

});
