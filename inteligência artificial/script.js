// Arquivo JavaScript do Front-end (ex: script.js)

// --- SELETORES DE ELEMENTOS HTML ---
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const fileUploadInput = document.querySelector("#file-upload");

// --- ESTADO DA APLICAÇÃO ---
let userMessage = null;
let fileContext = null; // Armazena o texto do último arquivo lido para contextualizar a próxima pergunta
const inputInitHeight = chatInput.scrollHeight;

// --- URLs DAS APIS (ATUALIZADO) ---
// Agora temos uma única API principal com duas rotas.
const API_BASE_URL = "https://api-pgp1.onrender.com"; // Sua URL base do Render
const CHAT_API_URL = `${API_BASE_URL}/chat`; // Rota para texto e pesquisa na web
const RECOGNITION_API_URL = `${API_BASE_URL}/reconhecer`; // Rota para análise de arquivos

// --- FUNÇÕES AUXILIARES ---

// Cria um item na lista do chat (balão de mensagem)
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    // Usamos innerHTML para renderizar tags HTML como <strong> e <br> que vêm da API
    chatLi.querySelector("p").innerHTML = message; 
    return chatLi;
};

// Formata a resposta do bot para exibir corretamente no HTML
const formatBotResponse = (text) => {
    // Converte **negrito** para <strong>negrito</strong>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Converte quebras de linha \n para <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    return formattedText;
};


// --- FUNÇÕES PRINCIPAIS ---

// Envia mensagem de texto para a API /chat
const generateChatResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    let messageToSend = userMessage;

    // Se houver contexto de um arquivo, anexa-o à mensagem
    if (fileContext) {
        messageToSend = `Com base neste conteúdo de um arquivo que analisei:\n\n---\n${fileContext}\n---\n\nPor favor, responda à seguinte pergunta: "${userMessage}"`;
        fileContext = null; // Limpa o contexto após o uso
    }

    // Corpo da requisição (simplificado para a nova API)
    const requestBody = {
        message: messageToSend 
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(CHAT_API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || `Erro ${response.status}`);
        }
        
        // A resposta agora vem em `data.response`
        const formattedResponse = formatBotResponse(data.response);
        messageElement.innerHTML = formattedResponse;

    } catch (error) {
        messageElement.textContent = `Desculpe, ocorreu um erro: ${error.message}`;
        messageElement.classList.add("error");
        console.error("Erro na chamada de chat:", error);
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

// Lida com o envio da mensagem do usuário
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Adiciona o balão de "pensando..."
    setTimeout(() => {
        const incomingChatLi = createChatLi("A pensar...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateChatResponse(incomingChatLi); // Chama a função que fala com a API
    }, 600);
};

// Lida com o upload e análise de um arquivo
const handleFileUpload = async (event) => {
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
        fileContext = extractedText; // Salva o texto para a próxima pergunta

        const botResponseHTML = `
            Consegui ler o arquivo <strong>"${file.name}"</strong>. Aqui está o conteúdo que extraí:
            <blockquote class="file-content">
                <pre>${extractedText}</pre>
            </blockquote>
            Agora você pode me fazer perguntas sobre este documento ou pedir um resumo.`;
        
        statusMessageElement.innerHTML = botResponseHTML;

    } catch (error) {
        statusMessageElement.innerHTML = `Erro ao analisar: ${error.message}`;
        console.error("Erro ao chamar a API de reconhecimento:", error);
        fileContext = null; // Limpa o contexto em caso de erro
    } finally {
        event.target.value = '';
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

// --- OUVINTES DE EVENTOS ---
sendChatBtn.addEventListener("click", handleChat);
fileUploadInput.addEventListener('change', handleFileUpload);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
