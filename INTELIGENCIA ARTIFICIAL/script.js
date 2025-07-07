// script.js - VERSÃO CORRIGIDA E COMPLETA

document.addEventListener("DOMContentLoaded", () => {
    // Seletores dos elementos do DOM (HTML)
    const chatInput = document.querySelector(".chat-input textarea");
    // CORREÇÃO IMPORTANTE: Selecionando o botão pelo seu ID único para maior precisão
    const sendChatBtn = document.querySelector("#send-btn"); 
    const chatbox = document.querySelector(".chatbox");

    // A URL do seu servidor no Render.com que já está funcionando
    const BACKEND_URL = "https://aemi.onrender.com";

    let userMessage; // Variável para guardar a mensagem do usuário

    // Função para criar um novo balão de chat (<li>)
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        
        // Define a estrutura do balão de chat (bot ou usuário)
        let chatContent = className === "outgoing" 
            ? `<p></p>` 
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
            
        chatLi.innerHTML = chatContent;
        // Usa textContent para inserir a mensagem, prevenindo problemas de segurança (injeção de HTML)
        chatLi.querySelector("p").textContent = message; 
        return chatLi;
    }

    // Função para gerar a resposta do bot fazendo a chamada ao back-end
    const generateResponse = (incomingChatLi) => {
        const API_URL = `${BACKEND_URL}/chat`; // A rota que criamos no Flask
        const messageElement = incomingChatLi.querySelector("p");

        // Configurações da requisição para o nosso servidor
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: userMessage // Envia a mensagem do usuário no corpo da requisição
            })
        };

        // Faz a chamada de rede para o nosso back-end
        fetch(API_URL, requestOptions)
            .then(res => res.json()) // Converte a resposta do servidor para JSON
            .then(data => {
                // Atualiza o balão de chat do bot com a resposta da IA
                if (data.response) {
                    messageElement.textContent = data.response;
                } else {
                    // Se o servidor retornar um erro conhecido
                    messageElement.textContent = `Erro do servidor: ${data.error || "Resposta inválida."}`;
                    console.error("Erro na resposta da API:", data);
                }
            })
            .catch((error) => {
                // Em caso de erro de rede (ex: servidor fora do ar, URL errada)
                messageElement.textContent = "Oops! Algo deu errado. Não foi possível conectar ao servidor da AEMI. Verifique a URL do back-end e o status do serviço no Render.";
                console.error("Erro de fetch:", error);
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight)); // Rola o chat para o final
    }

    // Função principal que lida com o envio da mensagem
    const handleChat = () => {
        userMessage = chatInput.value.trim(); // Pega a mensagem e remove espaços em branco
        if (!userMessage) return; // Se a mensagem estiver vazia, não faz nada

        chatInput.value = ""; // Limpa o campo de texto

        // Adiciona a mensagem do usuário à tela
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        // Aguarda um instante para dar a impressão de que a IA está "pensando"
        setTimeout(() => {
            const incomingChatLi = createChatLi("Pensando...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            
            // Chama a função que vai buscar a resposta real no back-end
            generateResponse(incomingChatLi);
        }, 600);
    }

    // --- ADIÇÃO DOS EVENT LISTENERS ---
    // A parte crucial para fazer o botão funcionar

    // 1. Evento de clique no botão de enviar
    sendChatBtn.addEventListener("click", handleChat);

    // 2. Evento de pressionar "Enter" no teclado para enviar
    chatInput.addEventListener("keydown", (e) => {
        // Se a tecla for "Enter" e a tecla "Shift" NÃO estiver pressionada
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Impede que uma nova linha seja criada no textarea
            handleChat();
        }
    });
});
