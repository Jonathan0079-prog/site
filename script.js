document.addEventListener('DOMContentLoaded', () => {

    // --- NOVA LÓGICA PARA O MENU HAMBURGER ---
    const menuToggler = document.querySelector('.menu-toggler');
    const mainNav = document.querySelector('#main-nav');

    if (menuToggler && mainNav) {
        menuToggler.addEventListener('click', () => {
            // Adiciona ou remove a classe 'visible' da navegação
            mainNav.classList.toggle('visible');
            
            // Bônus: Troca o ícone de 'menu' para 'fechar'
            const icon = menuToggler.querySelector('.material-icons');
            if (mainNav.classList.contains('visible')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
    }

    // --- SEU CÓDIGO EXISTENTE PARA ANIMAR OS CARDS ---
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
    
    // Seu código bônus para os botões foi mantido
    const courseButtons = document.querySelectorAll('.btn');
    courseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetPage = event.target.getAttribute('href');
            if (targetPage.includes('curso-')) {
                event.preventDefault(); 
                window.location.href = targetPage;
            }
        });
    });

});
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
    
    // Seu código bônus para os botões foi mantido
    const courseButtons = document.querySelectorAll('.btn');
    courseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetPage = event.target.getAttribute('href');
            if (targetPage.includes('curso-')) {
                event.preventDefault(); 
                window.location.href = targetPage;
            }
        });
    });

});
