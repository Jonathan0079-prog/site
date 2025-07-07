document.addEventListener("DOMContentLoaded", () => {
    // --- Seletores do DOM ---
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatList = document.querySelector("#chat-list");
    const newChatBtn = document.querySelector("#new-chat-btn");

    // --- Constantes e Variáveis de Estado ---
    const API_BASE_URL = "https://aemi.onrender.com"; // Altere se o seu URL for diferente
    let userMessage = null;
    let currentConversationId = null;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    };

    const showTypingAnimation = () => {
        const html = `
            <li class="chat incoming">
                <span class="material-symbols-outlined">smart_toy</span>
                <div class="typing-animation">
                    <span></span><span></span><span></span>
                </div>
            </li>`;
        chatbox.insertAdjacentHTML("beforeend", html);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return chatbox.lastChild;
    };

    const handleOutgoingChat = async () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.disabled = true;
        sendChatBtn.style.visibility = 'hidden';

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        const typingLi = showTypingAnimation();

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    conversation_id: currentConversationId
                })
            });

            if (!response.ok) {
                throw new Error("A requisição falhou.");
            }

            const data = await response.json();
            
            typingLi.remove();
            chatbox.appendChild(createChatLi(data.response, "incoming"));

            // Se for uma nova conversa, atualiza a lista de chats
            if (data.is_new_conversation || !currentConversationId) {
                currentConversationId = data.conversation_id;
                await loadChatList();
            }
            updateActiveChatItem(currentConversationId);

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            const errorLi = createChatLi("Oops! Algo deu errado. Tente novamente.", "incoming");
            errorLi.querySelector("p").classList.add("error");
            typingLi.replaceWith(errorLi);
        } finally {
            chatInput.disabled = false;
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    };
    
    const loadChatList = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/conversations`);
            if (!response.ok) throw new Error("Falha ao buscar conversas.");
            const conversations = await response.json();

            chatList.innerHTML = ""; // Limpa a lista antiga
            conversations.forEach(convo => {
                const li = document.createElement("li");
                li.dataset.id = convo.id;
                li.textContent = convo.title;
                li.addEventListener("click", () => loadConversation(convo.id));
                chatList.appendChild(li);
            });
            updateActiveChatItem(currentConversationId);
        } catch (error) {
            console.error("Erro ao carregar lista de chats:", error);
        }
    };

    const loadConversation = async (conversationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`);
            if (!response.ok) throw new Error("Falha ao carregar conversa.");
            const data = await response.json();

            chatbox.innerHTML = ""; // Limpa o chatbox
            data.history.forEach(message => {
                if (message.role === "user") {
                    chatbox.appendChild(createChatLi(message.content, "outgoing"));
                } else if (message.role === "assistant") {
                    chatbox.appendChild(createChatLi(message.content, "incoming"));
                }
            });
            currentConversationId = conversationId;
            updateActiveChatItem(conversationId);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        }
    };

    const startNewChat = () => {
        currentConversationId = null;
        chatbox.innerHTML = `
            <li class="chat incoming">
                <span class="material-symbols-outlined">smart_toy</span>
                <p>Olá! Como posso te ajudar hoje?</p>
            </li>`;
        updateActiveChatItem(null);
    };

    const updateActiveChatItem = (activeId) => {
        const items = chatList.querySelectorAll("li");
        items.forEach(item => {
            if (item.dataset.id === activeId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });
    };


    // --- Event Listeners ---
    sendChatBtn.addEventListener("click", handleOutgoingChat);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleOutgoingChat();
        }
    });
    chatInput.addEventListener("input", () => {
        sendChatBtn.style.visibility = chatInput.value.trim() ? 'visible' : 'hidden';
    });
    newChatBtn.addEventListener("click", startNewChat);

    // Carrega a lista de chats ao iniciar a página
    loadChatList();
});
