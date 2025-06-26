// Ficheiro: script.js

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

const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.textContent = "";

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
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "O servidor respondeu com um erro.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.replace('data: ', '').trim();
                    if (jsonStr) {
                        try {
                            const jsonData = JSON.parse(jsonStr);
                            if (jsonData.candidates && jsonData.candidates[0]) {
                                const textPart = jsonData.candidates[0].content.parts[0].text;
                                fullResponse += textPart;
                                messageElement.innerHTML = fullResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                                chatbox.scrollTo(0, chatbox.scrollHeight);
                            }
                        } catch (e) {
                            // Ignora erros de parsing de JSON
                        }
                    }
                }
            }
        }
    } catch (error) {
        messageElement.classList.add("error");
        messageElement.textContent = `Oops! Ocorreu um erro: ${error.message}`;
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
        const incomingChatLi = createChatLi("...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

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
        chatInput.value = `Arquivo "${file.name}" pronto. Faça uma pergunta sobre ele e clique em Enviar.`;
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
