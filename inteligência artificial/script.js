// script.js - VERSÃO FINAL E COMPLETA

document.addEventListener('DOMContentLoaded', () => {

    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const fileUploadInput = document.querySelector("#file-upload");

    let userMessage = null;
    let uploadedFileData = null;
    const inputInitHeight = chatInput.scrollHeight;

    // O URL aponta para o SEU servidor seguro no Render, que faz a ponte para a API do Google.
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

        // Constrói o corpo do pedido para a API
        const requestParts = [{ text: userMessage }];
        if (uploadedFileData) {
            requestParts.push({
                inline_data: {
                    mime_type: uploadedFileData.mimeType,
                    data: uploadedFileData.data
                }
            });
            uploadedFileData = null; // Limpa o arquivo após o uso
        }

        const requestBody = {
            contents: [{ parts: requestParts }],
        };
        
        // Configurações do pedido para o nosso servidor
        // Nenhuma chave de API aqui, pois ela está segura no servidor
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        };

        try {
            // A chamada 'fetch' é feita para o nosso servidor seguro
            const response = await fetch(API_URL, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "O servidor respondeu com um erro.");
            }
            const data = await response.json();
            
            // Formata a resposta da Google para mostrar negrito e quebras de linha
            const formattedResponse = data.candidates[0].content.parts[0].text
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\n/g, '<br>');
            messageElement.innerHTML = formattedResponse;
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
            const incomingChatLi = createChatLi("Analisando...", "incoming");
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
            chatInput.value = `Arquivo "${file.name}" pronto. Faça uma pergunta sobre ele.`;
            chatInput.focus();
        };
        reader.onerror = (error) => {
            console.error("Erro ao ler o arquivo:", error);
        };
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
});
