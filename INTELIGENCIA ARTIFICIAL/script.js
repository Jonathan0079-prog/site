// script.js - Versão atualizada para UPLOAD de arquivos

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");
    const fileUpload = document.getElementById("file-upload");
    const uploadIcon = document.getElementById("upload-icon");

    const BACKEND_URL = "https://aemi.onrender.com";
    let userMessage;
    let userFile = null;

    // Abre o seletor de arquivos ao clicar no ícone
    uploadIcon.addEventListener('click', () => fileUpload.click());

    // Guarda o arquivo selecionado
    fileUpload.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            userFile = event.target.files[0];
            // Avisa o usuário que um arquivo foi selecionado
            chatInput.placeholder = `Arquivo selecionado: ${userFile.name}`;
        }
    });

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    };

    const generateResponse = (incomingChatLi) => {
        const API_URL = `${BACKEND_URL}/chat`;
        const messageElement = incomingChatLi.querySelector("p");

        // FormData é necessário para enviar arquivos
        const formData = new FormData();
        formData.append("message", userMessage);
        if (userFile) {
            formData.append("file", userFile);
        }

        // As opções do fetch mudam um pouco para FormData
        const requestOptions = {
            method: "POST",
            body: formData, // Não definimos Content-Type, o navegador faz isso por nós com FormData
        };

        fetch(API_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.response) {
                    messageElement.textContent = data.response;
                } else {
                    messageElement.textContent = `Erro do servidor: ${data.error || "Resposta inválida."}`;
                }
            })
            .catch((error) => {
                console.error("Erro de fetch:", error);
                messageElement.textContent = "Oops! Algo deu errado. Não foi possível conectar ao servidor da AEMI.";
            })
            .finally(() => {
                chatbox.scrollTo(0, chatbox.scrollHeight);
                // Limpa o arquivo e o placeholder após o envio
                userFile = null;
                fileUpload.value = ""; // Limpa o input de arquivo
                chatInput.placeholder = "Digite uma mensagem...";
            });
    };

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage && !userFile) return;

        const messageToSend = userMessage || `Analise o arquivo: ${userFile.name}`;
        chatbox.appendChild(createChatLi(messageToSend, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        chatInput.value = "";
        
        setTimeout(() => {
            const incomingChatLi = createChatLi("Analisando...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    };

    sendChatBtn.addEventListener("click", handleChat);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});
