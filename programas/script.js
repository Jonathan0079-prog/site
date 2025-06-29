// main-hub.js

// O código só roda depois que toda a página HTML foi carregada.
document.addEventListener('DOMContentLoaded', () => {

    console.log("Página carregada. Script 'main-hub.js' em execução.");

    // Encontra o link da calculadora 4.0 pelo seu ID único.
    const calculadoraLink = document.getElementById('greasePro4WakeUpBtn');

    // Se o botão não for encontrado, o script avisa no console e para.
    if (!calculadoraLink) {
        console.error("ERRO: Botão com ID 'greasePro4WakeUpBtn' não encontrado no HTML.");
        return;
    }
    
    console.log("Botão 'greasePro4WakeUpBtn' encontrado. Adicionando evento de clique.");

    // URL do seu serviço no Render
    const calculadoraUrl = 'https://api-pgp1.onrender.com/';

    // Adiciona o evento de clique ao botão
    calculadoraLink.addEventListener('click', async (event) => {
        // ESSA LINHA É CRUCIAL: Previne que o link (href="#") recarregue a página.
        event.preventDefault();

        console.log("Botão clicado! Iniciando processo para acordar o servidor.");

        // Seleciona os elementos internos do botão para dar feedback visual
        const infoParagraph = calculadoraLink.querySelector('.tool-info p');
        const arrowIcon = calculadoraLink.querySelector('.tool-arrow i');
        
        // Impede cliques múltiplos e dá feedback visual
        calculadoraLink.style.pointerEvents = 'none';
        calculadoraLink.style.opacity = '0.7';
        calculadoraLink.style.cursor = 'wait';

        if (infoParagraph) {
            infoParagraph.textContent = 'Inicializando o servidor, por favor aguarde...';
        }
        if (arrowIcon) {
            arrowIcon.className = 'fas fa-spinner fa-spin';
        }

        try {
            // Envia o "ping" para acordar o servidor.
            await fetch(calculadoraUrl, { method: 'GET', mode: 'no-cors' });
            console.log("Ping para o servidor enviado.");
        
        } catch (error) {
            console.log('Erro no ping (normal com no-cors), continuando com o redirecionamento.');
        } finally {
            // Após o ping, redireciona o usuário para a calculadora.
            console.log('Redirecionando para:', calculadoraUrl);
            window.location.href = calculadoraUrl;
        }
    });
});
