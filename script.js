document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA ORIGINAL DO SEU MENU HAMBURGER ---
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

    // --- LÓGICA ORIGINAL PARA ANIMAR OS CARDS ---
    const cards = document.querySelectorAll('.curso-card-link');
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


    // =============================================================
    //      LÓGICA ADICIONADA PARA O BOTÃO DE INSTALAÇÃO DO PWA
    // =============================================================
    
    let deferredPrompt; // Esta variável irá guardar o evento de instalação
    const installLi = document.getElementById('install-pwa-li');
    const installButton = document.getElementById('install-pwa-button');

    // O navegador dispara este evento se o site for "instalável"
    window.addEventListener('beforeinstallprompt', (e) => {
        // Previne que o mini-infobar padrão apareça
        e.preventDefault();
        
        // Guarda o evento para que possamos acioná-lo mais tarde
        deferredPrompt = e;
        
        // Mostra o nosso botão de instalação personalizado que está no menu
        if (installLi) {
            console.log('App é instalável. A mostrar o botão de instalação.');
            installLi.style.display = 'block';
        }
    });

    // Adiciona o ouvinte de clique ao nosso botão de instalação
    if (installButton) {
        installButton.addEventListener('click', async (e) => {
            e.preventDefault(); // Previne a ação padrão do link
            
            // Esconde o nosso botão, pois ele só pode ser usado uma vez
            if (installLi) {
                installLi.style.display = 'none';
            }
            
            // Mostra a janela de instalação nativa do navegador
            if (deferredPrompt) {
                deferredPrompt.prompt();
                
                // Espera pela escolha do utilizador
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Ação do utilizador: ${outcome}`);
                
                // Limpa a variável, pois o prompt não pode ser usado novamente
                deferredPrompt = null;
            }
        });
    }

    // Opcional: Ouve quando a app é instalada com sucesso
    window.addEventListener('appinstalled', () => {
        console.log('Obrigado por instalar a nossa aplicação!');
        // Esconde o botão de instalação caso ainda esteja visível
        if (installLi) {
            installLi.style.display = 'none';
        }
        deferredPrompt = null;
    });

});
