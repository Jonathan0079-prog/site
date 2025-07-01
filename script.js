document.addEventListener('DOMContentLoaded', () => {
    // --- Menu Hamburguer ---
    const menuToggler = document.querySelector('.menu-toggler');
    const mainNav = document.querySelector('#main-nav');

    if (menuToggler && mainNav) {
        menuToggler.addEventListener('click', () => {
            mainNav.classList.toggle('visible');
            // Troca o ícone de menu/fechar
            const icon = menuToggler.querySelector('.material-icons');
            if (mainNav.classList.contains('visible')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
        // Opcional: Fecha o menu ao clicar em algum link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('visible');
                menuToggler.querySelector('.material-icons').textContent = 'menu';
            });
        });
    }

    // --- Animação dos cards do curso ---
    const cards = document.querySelectorAll('.curso-card');
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
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // --- Código bônus para os botões dos cursos ---
    const courseButtons = document.querySelectorAll('.btn');
    courseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetPage = button.getAttribute('href');
            if (targetPage && targetPage.includes('curso-')) {
                event.preventDefault(); 
                window.location.href = targetPage;
            }
        });
    });
});
