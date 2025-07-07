// script.js

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const chatbox = document.querySelector(".chatbox");

    // IMPORTANTE: Substitua esta URL pela URL do seu back-end no Render.com
    // Você obterá essa URL depois de criar o serviço no Render.
    // Exemplo: "https://seu-app-aemi.onrender.com"
    const BACKEND_URL = "https://seu-app-aemi.onrender.com"; // <-- MUDE AQUI QUANDO TIVER A URL

    let userMessage;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    const generateResponse = (incomingChatLi) => {
        const API_URL = `${BACKEND_URL}/chat`;
        const messageElement = incomingChatLi.querySelector("p");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: userMessage
            })
        }

        // Envia a mensagem do usuário para o seu back-end
        fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
            // Atualiza o balão de chat do bot com a resposta recebida
            if (data.response) {
                messageElement.textContent = data.response;
            } else {
                messageElement.textContent = "Desculpe, não consegui obter uma resposta. Verifique se o servidor está funcionando corretamente.";
                console.error("Erro na resposta da API:", data.error);
            }
        }).catch((error) => {
            // Em caso de erro de rede (ex: servidor fora do ar)
            messageElement.textContent = "Oops! Algo deu errado. Não foi possível conectar ao servidor da AEMI. Verifique a URL do back-end e o status do serviço no Render.";
            console.error("Erro de fetch:", error);
        }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if(!userMessage) return;
        chatInput.value = "";

        // Adiciona a mensagem do usuário ao chat
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        setTimeout(() => {
            // Cria um balão de "pensando..." para o bot
            const incomingChatLi = createChatLi("Pensando...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            // Chama a função que vai buscar a resposta no back-end
            generateResponse(incomingChatLi);
        }, 600);
    }

    sendChatBtn.addEventListener("click", handleChat);
    chatInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});
