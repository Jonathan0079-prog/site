// script.js - Versão final para Upload de Arquivos

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatbox = document.querySelector(".chatbox");
    const fileUpload = document.getElementById("file-upload");
    const uploadIcon = document.getElementById("upload-icon");

    const BACKEND_URL = "https://aemi.onrender.com";
    let userFile = null;

    if (uploadIcon) {
        uploadIcon.addEventListener('click', () => fileUpload.click());
    }

    if (fileUpload) {
        fileUpload.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                userFile = event.target.files[0];
                chatInput.placeholder = `Arquivo selecionado: ${userFile.name}. Digite uma pergunta ou clique em enviar.`;
            }
        });
    }

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    };

    const generateResponse = (formData, incomingChatLi) => {
        const API_URL = `${BACKEND_URL}/chat`;
        const messageElement = incomingChatLi.querySelector("p");

        const requestOptions = {
            method: "POST",
            body: formData,
        };

        fetch(API_URL, requestOptions)
            .then(res => {
                if (!res.ok) {
                    // Se a resposta não for OK (ex: erro 500), tenta ler o erro como JSON
                    return res.json().then(errorData => Promise.reject(errorData));
                }
                return res.json();
            })
            .then(data => {
                messageElement.textContent = data.response || "Recebi uma resposta vazia do servidor.";
            })
            .catch(error => {
                console.error("Erro de fetch ou de servidor:", error);
                // Exibe a mensagem de erro que vem do servidor, se existir
                messageElement.textContent = `Oops! Algo deu errado. ${error.error || 'Não foi possível conectar ao servidor da AEMI.'}`;
            })
            .finally(() => {
                chatbox.scrollTo(0, chatbox.scrollHeight);
                userFile = null;
                fileUpload.value = "";
                chatInput.placeholder = "Digite uma mensagem...";
            });
    };

    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage && !userFile) return;

        const formData = new FormData();
        formData.append("message", userMessage);
        if (userFile) {
            formData.append("file", userFile);
        }

        const displayMessage = userMessage || `Analisando arquivo: ${userFile.name}`;
        chatbox.appendChild(createChatLi(displayMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        
        chatInput.value = "";
        
        setTimeout(() => {
            const incomingChatLi = createChatLi("Analisando...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(formData, incomingChatLi);
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
