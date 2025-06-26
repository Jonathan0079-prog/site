document.addEventListener('DOMContentLoaded', () => {

    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');

    // --- LÓGICA DA IA (SIMULADA) ---
    // Esta função define as respostas da IA com base em palavras-chave.
    function getAiResponse(question) {
        const q = question.toLowerCase();

        // Respostas baseadas em palavras-chave
        if (q.includes('olá') || q.includes('oi') || q.includes('bom dia')) {
            return "Olá! Como posso ser útil hoje?";
        }
        if (q.includes('torque') && q.includes('parafuso')) {
            return "Para cálculos de torque, preciso do diâmetro do parafuso (ex: M12), a classe de resistência (ex: 8.8) e se a rosca está seca ou lubrificada. Você pode usar a 'Calculadora de Torque' para isso!";
        }
        if (q.includes('rolamento')) {
            return "Tenho bastante informação sobre rolamentos. Você precisa de ajuda com seleção, cálculo de folga, procedimento de montagem ou diagnóstico de falha?";
        }
        if (q.includes('engrenagem') || q.includes('relação')) {
            return "Para calcular a relação de engrenagens, preciso do número de dentes da engrenagem motora (Z1) e da movida (Z2). A 'Calculadora de Engrenagens' pode fazer isso e ainda mostrar uma animação.";
        }
        if (q.includes('segurança') || q.includes('epi')) {
            return "Segurança em primeiro lugar! Antes de qualquer intervenção, lembre-se de desenergizar completamente o equipamento (LOTO) e utilizar todos os EPIs necessários, como luvas, óculos de segurança e calçados adequados.";
        }
        if (q.includes('manutenção') && q.includes('preventiva')) {
            return "A manutenção preventiva é chave para a confiabilidade. Um bom plano inclui inspeções periódicas, lubrificação, limpeza e substituição de peças com desgaste conhecido. Sobre qual tipo de equipamento você gostaria de criar um plano?";
        }
        if (q.includes('obrigado') || q.includes('valeu')) {
            return "De nada! Se precisar de mais alguma coisa, é só perguntar.";
        }

        // Resposta padrão caso nenhuma palavra-chave seja encontrada
        return "Não tenho certeza de como responder a isso. Você poderia reformular a pergunta? Sou especialista em tópicos como componentes mecânicos (rolamentos, engrenagens), normas técnicas, procedimentos de manutenção e diagnóstico de falhas.";
    }


    // --- FUNÇÕES DO CHAT ---

    // Adiciona uma mensagem à janela de chat
    function addMessage(content, sender) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
        
        let messageHtml = '';
        if (sender === 'ai') {
            messageHtml += '<i class="fas fa-robot message-avatar"></i>';
        }
        messageHtml += `<div class="message-content"><p>${content}</p></div>`;

        messageWrapper.innerHTML = messageHtml;
        messagesContainer.appendChild(messageWrapper);

        // Rola para a mensagem mais recente
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Lida com o envio do formulário
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        const userText = userInput.value.trim();

        if (userText) {
            // Adiciona a mensagem do usuário à tela
            addMessage(userText, 'user');
            userInput.value = ''; // Limpa o campo de input

            // Simula a "digitação" da IA e obtém a resposta
            setTimeout(() => {
                const aiText = getAiResponse(userText);
                addMessage(aiText, 'ai');
            }, 1000 + Math.random() * 500); // Adiciona um pequeno delay aleatório
        }
    });

});
