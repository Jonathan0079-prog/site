// script.js

// O código só roda depois que toda a página HTML foi carregada.
document.addEventListener('DOMContentLoaded', () => {

    console.log("PÁGINA CARREGADA. O script.js está a ser executado.");

    // Seleciona TODOS os botões que precisam de "acordar" um servidor.
    const wakeUpButtons = document.querySelectorAll('.wake-up-button');

    // Se nenhum botão for encontrado, avisa no console.
    if (wakeUpButtons.length === 0) {
        console.warn("AVISO: Nenhum botão com a classe 'wake-up-button' foi encontrado na página.");
        return;
    }

    // Para cada botão encontrado, adiciona a funcionalidade.
    wakeUpButtons.forEach(button => {
        // Pega o ID do botão para o log, ou 'sem ID' se não tiver.
        const buttonId = button.id || 'sem ID';
        console.log(`Botão encontrado: [${buttonId}]. A adicionar evento de clique.`);

        button.addEventListener('click', async (event) => {
            // Previne a ação padrão do link (que seria recarregar a página por causa do href="#")
            event.preventDefault();

            console.log(`CLIQUE DETETADO no botão: [${buttonId}]`);

            // Pega a URL do servidor do atributo 'data-url' do botão que foi clicado
            const targetUrl = button.dataset.url;
            if (!targetUrl || targetUrl === "") {
                console.error(`ERRO FATAL: O botão [${buttonId}] não tem um atributo 'data-url' válido.`);
                alert("Erro de configuração: o URL de destino para este botão não foi encontrado.");
                return;
            }

            console.log(`URL de destino: ${targetUrl}`);

            // Seleciona os elementos internos do botão para dar feedback visual
            const infoParagraph = button.querySelector('.tool-info p');
            const arrowIcon = button.querySelector('.tool-arrow i');
            
            // Impede cliques múltiplos e dá feedback visual
            button.style.pointerEvents = 'none';
            button.style.opacity = '0.7';
            button.style.cursor = 'wait';

            if (infoParagraph) {
                infoParagraph.textContent = 'A inicializar o servidor, por favor aguarde...';
            }
            if (arrowIcon) {
                // Troca o ícone de seta por um ícone de "spinner" (usando Font Awesome)
                arrowIcon.className = 'fas fa-spinner fa-spin';
            }

            try {
                // Envia o "ping" para acordar o servidor específico daquele botão.
                console.log(`A enviar ping para acordar ${targetUrl}...`);
                await fetch(targetUrl, { method: 'GET', mode: 'no-cors' });
                console.log(`Ping enviado com sucesso para ${targetUrl}.`);
            
            } catch (error) {
                // Erros são esperados e normais ao usar 'no-cors', então nós os ignoramos e continuamos.
                console.warn(`Ping para ${targetUrl} enviado. O erro a seguir é esperado e pode ser ignorado:`, error.message);
            } finally {
                // Após o ping, redireciona o utilizador para a calculadora.
                console.log(`A redirecionar agora para: ${targetUrl}`);
                window.location.href = targetUrl;
            }
        });
    });
});
