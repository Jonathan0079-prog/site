// script.js - Versão com URL de Backend Dinâmica

document.addEventListener("DOMContentLoaded", () => {
    // --- Seletores do DOM ---
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");
    const clearChatBtn = document.querySelector("#clear-btn");

    // --- MELHORIA: Configuração Dinâmica da URL do Backend ---
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    // Define a URL do backend com base no ambiente (local ou produção)
    const BACKEND_URL = isLocal ? "http://127.0.0.1:10000" : "https://aemi.onrender.com";
    
    console.log(`Backend configurado para: ${BACKEND_URL}`); // Ajuda a depurar qual URL está em uso

    const API_URL_CHAT = `${BACKEND_URL}/chat`;
    // Nota: A rota /clear-session não existe no app.py atual. A lógica do frontend está preparada para quando for implementada.
    const API_URL_CLEAR = `${BACKEND_URL}/clear-session`; 

    let userMessage = null;

    /**
     * Cria um novo elemento de lista de chat (<li>) para exibir na tela.
     */
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        
        let chatContent;
        if (className === "incoming" && message === "typing") {
            chatContent = `<span class="material-symbols-outlined">smart_toy</span><div class="typing-animation"><span></span><span></span><span></span></div>`;
        } else {
            const icon = className === "outgoing" ? "" : `<span class="material-symbols-outlined">smart_toy</span>`;
            chatContent = `${icon}<p></p>`;
        }
        
        chatLi.innerHTML = chatContent;
        
        if (message !== "typing") {
            chatLi.querySelector("p").textContent = message;
        }
        
        return chatLi;
    };

    /**
     * Envia a mensagem para a API do backend e atualiza a UI com a resposta.
     */
    const generateResponse = (incomingChatLi) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ message: userMessage })
        };

        const typingElement = incomingChatLi.querySelector(".typing-animation");

        fetch(API_URL_CHAT, requestOptions)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                const pElement = document.createElement("p");
                pElement.textContent = data.response || "Desculpe, não recebi uma resposta válida.";
                
                // Substitui a animação de "digitando" pela resposta final
                if (typingElement) {
                    typingElement.replaceWith(pElement);
                }
            })
            .catch(() => {
                const errorPElement = document.createElement("p");
                errorPElement.classList.add("error");
                errorPElement.textContent = "Oops! Algo deu errado. Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.";
                
                // Substitui a animação pelo erro
                if (typingElement) {
                    typingElement.replaceWith(errorPElement);
                }
            })
            .finally(() => {
                chatInput.disabled = false;
                sendChatBtn.disabled = false;
                chatbox.scrollTo(0, chatbox.scrollHeight);
            });
    };

    /**
     * Controla o fluxo de envio da mensagem do usuário.
     */
    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.disabled = true;
        sendChatBtn.disabled = true;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        setTimeout(() => {
            const incomingChatLi = createChatLi("typing", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    };

    /**
     * Limpa a tela de chat e tenta limpar a sessão no backend.
     */
    const clearChat = () => {
        if (confirm("Você tem certeza que deseja limpar o histórico desta conversa?")) {
            const welcomeMessage = `
                <li class="chat incoming">
                    <span class="material-symbols-outlined">smart_toy</span>
                    <p>Olá. Sou AEMI, uma IA da Manutenção Industrial. Envie uma mensagem para começarmos.</p>
                </li>`;
            chatbox.innerHTML = welcomeMessage;

            // Tenta limpar a sessão no backend (não vai falhar se a rota não existir)
            fetch(API_URL_CLEAR, { method: "POST" })
                .catch(err => console.error("Ocorreu um erro ao tentar limpar a sessão no backend (a rota pode não estar implementada).", err));
        }
    };

    // --- Event Listeners ---
    sendChatBtn.addEventListener("click", handleChat);
    clearChatBtn.addEventListener("click", clearChat);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});
