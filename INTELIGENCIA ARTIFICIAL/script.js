// script.js - Versão com Layout Refinado e Limpeza de Chat

document.addEventListener("DOMContentLoaded", () => {
    // --- Seletores do DOM ---
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");
    const clearChatBtn = document.querySelector("#clear-btn"); // Botão de limpar

    // --- Constantes ---
    const BACKEND_URL = "https://aemi.onrender.com";
    const API_URL_CHAT = `${BACKEND_URL}/chat`;
    const API_URL_CLEAR = `${BACKEND_URL}/clear-session`; // Novo endpoint

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

        fetch(API_URL_CHAT, requestOptions)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                const p = document.createElement('p');
                p.textContent = data.response || "Desculpe, não recebi uma resposta válida.";
                incomingChatLi.querySelector(".typing-animation").parentElement.replaceWith(createChatLi(data.response, "incoming"));
            })
            .catch(() => {
                const errorLi = createChatLi("Oops! Algo deu errado. Não foi possível conectar ao servidor. Tente novamente.", "incoming");
                errorLi.querySelector("p").classList.add("error");
                incomingChatLi.parentElement.replaceChild(errorLi, incomingChatLi);
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
     * MELHORIA: Limpa a tela de chat e a sessão no backend.
     */
    const clearChat = () => {
        if (confirm("Você tem certeza que deseja limpar o histórico desta conversa?")) {
            // Limpa a tela
            const welcomeMessage = `
                <li class="chat incoming">
                    <span class="material-symbols-outlined">smart_toy</span>
                    <p>Olá. Sou AEMI, uma IA da Manutenção Industrial. Envie uma mensagem para começarmos.</p>
                </li>`;
            chatbox.innerHTML = welcomeMessage;

            // Limpa a sessão no backend
            fetch(API_URL_CLEAR, { method: "POST" })
                .then(res => {
                    if (!res.ok) console.error("Falha ao limpar a sessão no servidor.");
                })
                .catch(err => console.error("Erro ao tentar limpar a sessão:", err));
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
