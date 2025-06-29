// main-hub.js

// Espera o documento HTML ser completamente carregado antes de executar o script.
// Isso garante que o botão com o ID 'calculadoraWakeUpBtn' já exista na página.
document.addEventListener('DOMContentLoaded', () => {

    // Encontra o link da calculadora pelo ID que definimos no HTML
    const calculadoraLink = document.getElementById('calculadoraWakeUpBtn');

    // Se o elemento foi encontrado na página, continua...
    if (calculadoraLink) {
        
        // URL do seu serviço no Render que queremos "acordar"
        const calculadoraUrl = 'https://api-pgp1.onrender.com/';

        // Adiciona um "ouvinte" de evento de clique ao link
        calculadoraLink.addEventListener('click', async (event) => {
            
            // Previne a ação padrão do link, que seria navegar para o topo da página (por causa do href="#")
            event.preventDefault();

            // Seleciona os elementos internos do botão para que possamos dar um feedback visual ao usuário
            const infoParagraph = calculadoraLink.querySelector('.tool-info p');
            const arrowIcon = calculadoraLink.querySelector('.tool-arrow i');
            
            // Impede cliques múltiplos enquanto o processo está em andamento e muda o cursor
            calculadoraLink.style.pointerEvents = 'none';
            calculadoraLink.style.opacity = '0.7';
            calculadoraLink.style.cursor = 'wait';

            // Altera o texto de descrição para informar ao usuário o que está acontecendo
            if (infoParagraph) {
                infoParagraph.textContent = 'Inicializando o servidor, por favor aguarde...';
            }

            // Troca o ícone de seta por um ícone de "spinner" giratório para um feedback visual mais forte
            // (Isso assume que você está usando Font Awesome)
            if (arrowIcon) {
                arrowIcon.className = 'fas fa-spinner fa-spin';
            }

            try {
                // Esta é a parte principal: envia uma requisição 'ping' para acordar o servidor.
                // Usamos 'no-cors' porque não precisamos ler a resposta, apenas garantir que a requisição seja enviada.
                await fetch(calculadoraUrl, { method: 'GET', mode: 'no-cors' });
            
            } catch (error) {
                // Erros são esperados e normais ao usar 'no-cors', então nós os ignoramos e continuamos.
                // O importante é que a requisição foi despachada.
                console.log('Ping para o servidor enviado. O erro a seguir é esperado e pode ser ignorado:', error);
            } finally {
                // Após enviar o ping (com sucesso ou erro esperado), o script continua para o redirecionamento.
                console.log('Redirecionando para a calculadora...');
                
                // Redireciona o navegador do usuário para a página da calculadora.
                // Neste ponto, o servidor do Render já recebeu a requisição e está no processo de "acordar".
                window.location.href = calculadoraUrl;
            }
        });
    }
});
