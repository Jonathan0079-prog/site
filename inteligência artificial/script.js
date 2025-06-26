// ATENÇÃO: Este é o novo código para o SEU NAVEGADOR (front-end)

document.addEventListener('DOMContentLoaded', () => {
    // ... (todos os seletores continuam os mesmos: chatbox, chatInput, etc.)
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");
    
    // ATUALIZADO: A URL agora aponta para o seu próprio servidor.
    // Use a URL do seu app no Render. Se estiver testando localmente, pode ser 'http://localhost:3000/chat'
    const MEU_SERVIDOR_URL = "https://seu-app.onrender.com/chat"; // <<< MUDE PARA A URL DO SEU SERVIDOR

    // ... (a função createChatLi continua a mesma)
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
        chatLi.innerHTML = chatContent;
        return chatLi;
    };


    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");
        const userMessage = chatElement.previousElementSibling.querySelector("p").innerText;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }), // Envia apenas a mensagem
        };

        try {
            // ATUALIZADO: A chamada é para o nosso servidor, não para o Google
            const response = await fetch(MEU_SERVIDOR_URL, requestOptions);
            if (!response.ok) throw new Error("Erro ao contatar o servidor.");
            
            const data = await response.json();
            messageElement.innerHTML = data.reply; // Pega a resposta que nosso servidor nos deu
        } catch (error) {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Não foi possível obter uma resposta do servidor. Tente novamente.";
            console.error(error);
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    };
    
    // A função handleChat continua praticamente a mesma, só não precisa mais da chave
    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            const incomingChatLi = createChatLi("Analisando...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    };

    sendChatBtn.addEventListener("click", handleChat);
    // ... (os outros event listeners continuam os mesmos)
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});
