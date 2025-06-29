// script.js

// O código só roda depois que toda a página HTML foi carregada.
document.addEventListener('DOMContentLoaded', () => {

    console.log("Página carregada. Script de inicialização em execução.");

    // Seleciona TODOS os botões que precisam "acordar" um servidor.
    const wakeUpButtons = document.querySelectorAll('.wake-up-button');

    // Se nenhum botão for encontrado, não faz nada.
    if (wakeUpButtons.length === 0) {
        console.log("Nenhum botão 'wake-up' encontrado na página.");
        return;
    }

    // Para cada botão encontrado, adiciona a funcionalidade.
    wakeUpButtons.forEach(button => {
        console.log(`Botão encontrado: ${button.id}. Adicionando evento de clique.`);

        button.addEventListener('click', async (event) => {
            // Previne a ação padrão do link (que seria navegar para "#")
            event.preventDefault();

            // Pega a URL do servidor do atributo 'data-url' do botão que foi clicado
            const targetUrl = button.dataset.url;
            if (!targetUrl) {
                console.error("Erro: O botão não tem o atributo 'data-url' com o endereço do servidor.");
                return;
            }

            // Seleciona os elementos internos do botão para dar feedback visual
            const infoParagraph = button.querySelector('.tool-info p');
            const arrowIcon = button.querySelector('.tool-arrow i');
            
            // Impede cliques múltiplos e dá feedback visual
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.7';
            button.style.cursor = 'wait';

            if (infoParagraph) {
                infoParagraph.textContent = 'Inicializando o servidor, por favor aguarde...';
            }
            if (arrowIcon) {
                // Troca o ícone de seta por um ícone de "spinner" (usando Font Awesome)
                arrowIcon.className = 'fas fa-spinner fa-spin';
            }

            try {
                // Envia o "ping" para acordar o servidor específico daquele botão.
                await fetch(targetUrl, { method: 'GET', mode: 'no-cors' });
                console.log(`Ping enviado com sucesso para ${targetUrl}.`);
            
            } catch (error) {
                // Erros são esperados e normais ao usar 'no-cors', então nós os ignoramos e continuamos.
                console.log(`Ping para ${targetUrl} enviado. O erro a seguir é esperado:`, error);
            } finally {
                // Após o ping, redireciona o usuário para a calculadora.
                console.log(`Redirecionando para: ${targetUrl}`);
                window.location.href = targetUrl;
            }
        });
    });
});
