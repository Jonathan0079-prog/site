const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const fileUploadInput = document.querySelector("#file-upload");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// --- URLs DAS APIS ---
// Esta é a API principal do seu chatbot (Gemini)
const CHAT_API_URL = "https://api-oqfw.onrender.com/chat";
// Esta é a URL da sua API de RECONHECIMENTO DE ARQUIVOS (Docker no Render)
const RECOGNITION_API_URL = "https://dockerfile-u20q.onrender.com/reconhecer";

// Função para criar o elemento de chat
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message;
    return chatLi;
};

// Função de resposta do Chat (envia texto para o Gemini)
const generateChatResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    const requestBody = {
        contents: [{
            parts: [{ text: userMessage }]
        }]
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(CHAT_API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        const formattedResponse = data.candidates[0].content.parts[0].text
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br>');
        messageElement.innerHTML = formattedResponse;

    } catch (error) {
        messageElement.textContent = `Desculpe, ocorreu um erro: ${error.message}`;
        messageElement.classList.add("error");
        console.error(error);
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

// Função principal de Chat
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("A pensar...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateChatResponse(incomingChatLi);
    }, 600);
};

// Lógica de Upload de Arquivo
fileUploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const statusChatLi = createChatLi(`Analisando o arquivo "${file.name}"...`, "incoming");
    chatbox.appendChild(statusChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    const statusMessageElement = statusChatLi.querySelector("p");

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(RECOGNITION_API_URL, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Não foi possível ler o arquivo.');
        }

        const extractedText = data.conteudo_extraido;
        statusMessageElement.textContent = `Arquivo lido com sucesso!`;

        chatInput.value = `Com base no seguinte conteúdo que extraí do arquivo "${file.name}", responda às minhas próximas perguntas. Se eu não perguntar nada específico, faça um resumo.\n\nCONTEÚDO:\n"""\n${extractedText}\n"""`;

        chatInput.style.height = "auto";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
        chatInput.focus();

    } catch (error) {
        statusMessageElement.innerHTML = `Erro ao analisar: ${error.message}`;
        console.error("Erro ao chamar a API de reconhecimento:", error);
    } finally {
        event.target.value = '';
    }
});

// Ouvintes de eventos
chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);

