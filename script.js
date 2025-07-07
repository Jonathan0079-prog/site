// script.js - VERSÃO FINAL COMBINADA

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA ORIGINAL DO SEU MENU HAMBURGER ---
    const menuToggler = document.querySelector('.menu-toggler');
    const mainNav = document.querySelector('#main-nav');

    if (menuToggler && mainNav) {
        menuToggler.addEventListener('click', () => {
            mainNav.classList.toggle('visible');
            menuToggler.classList.toggle('open');
            
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
            root: null,
            rootMargin: '0px',
            threshold: 0.1
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

    // --- LÓGICA ORIGINAL PARA O BOTÃO DE INSTALAÇÃO DO PWA ---
    let deferredPrompt;
    const installLi = document.getElementById('install-pwa-li');
    const installButton = document.getElementById('install-pwa-button');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installLi) {
            console.log('App é instalável. Mostrando o botão de instalação.');
            installLi.style.display = 'block'; // Mostra o botão no menu
        }
    });

    if (installButton) {
        installButton.addEventListener('click', async (e) => {
            e.preventDefault();
            if (installLi) {
                installLi.style.display = 'none'; // Esconde o botão após o clique
            }
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Ação do usuário: ${outcome}`);
                deferredPrompt = null;
            }
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('Obrigado por instalar nosso aplicativo!');
        if (installLi) {
            installLi.style.display = 'none';
        }
        deferredPrompt = null;
    });

    // =============================================================
    //      NOVA LÓGICA ADICIONADA PARA ACORDAR O SERVIDOR DA AEMI
    // =============================================================
    
    // Seleciona o botão da AEMI pelo ID que está no seu HTML
    const aemiWakeupButton = document.querySelector('#aemi-wakeup-btn');

    if (aemiWakeupButton) {
        // Adiciona o "ouvinte" de clique
        aemiWakeupButton.addEventListener('click', (event) => {
            // 1. Previne a navegação imediata para a página do chat
            event.preventDefault(); 
            
            const linkTextSpan = aemiWakeupButton.querySelector('span');
            const chatPageUrl = aemiWakeupButton.href; // URL para onde vamos navegar
            const backendUrl = 'https://aemi.onrender.com'; // URL do servidor para "acordar"

            // 2. Fornece feedback visual ao usuário
            if (linkTextSpan) {
                linkTextSpan.textContent = 'Acordando AEMI...';
            }

            // 3. Envia a requisição "ping" para o servidor em segundo plano
            // Não nos importamos com a resposta, apenas em enviar a requisição.
            fetch(backendUrl, { mode: 'no-cors' }).catch(err => console.log('Ping para o servidor enviado.'));

            // 4. Aguarda um instante e depois redireciona o usuário
            setTimeout(() => {
                window.location.href = chatPageUrl;
            }, 700); // 700 milissegundos de delay
        });
    }

});
