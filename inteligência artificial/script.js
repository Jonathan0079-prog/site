// Ficheiro: script.js (VERSÃO DE DEPURAÇÃO)

const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const fileUploadInput = document.querySelector("#file-upload");

let userMessage = null;
let uploadedFileData = null;
const inputInitHeight = chatInput.scrollHeight;

const API_URL = "https://api-oqfw.onrender.com/chat";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message;
    return chatLi;
};

// Função de resposta COM MENSAGENS DE STATUS
const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    
    const updateStatus = (text) => {
        console.log(text);
        messageElement.textContent = text;
    };

    updateStatus("Iniciando processo...");

    const requestParts = [{ text: userMessage }];
    if (uploadedFileData) {
        requestParts.push({
            inline_data: { mime_type: uploadedFileData.mimeType, data: uploadedFileData.data }
        });
        uploadedFileData = null;
    }
    const requestBody = { contents: [{ parts: requestParts }] };
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    };

    try {
        updateStatus("Contactando o servidor...");
        const response = await fetch(API_URL, requestOptions);
        updateStatus("Servidor contactado. A aguardar resposta...");

        if (!response.ok) {
            updateStatus("O servidor respondeu, mas com um erro.");
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}`);
        }
        
        updateStatus("Servidor respondeu com sucesso. A processar dados...");
        const data = await response.json();
        const formattedResponse = data.candidates[0].content.parts[0].text
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br>');
        messageElement.innerHTML = formattedResponse;

    } catch (error) {
        updateStatus(`ERRO FINAL: ${error.message}`);
        messageElement.classList.add("error");
        console.error(error);
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage && !uploadedFileData) return;

    if (!userMessage && uploadedFileData) {
        userMessage = `Analise este arquivo: ${uploadedFileData.name}`;
    }

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("A iniciar...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

// Adicionando os ouvintes de evento
fileUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        uploadedFileData = {
            name: file.name,
            mimeType: file.type,
            data: base64String
        };
        chatInput.value = `Arquivo "${file.name}" pronto. Faça uma pergunta sobre ele.`;
        chatInput.focus();
    };
    reader.onerror = (error) => { console.error("Erro ao ler o arquivo:", error); };
    event.target.value = '';
});

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
