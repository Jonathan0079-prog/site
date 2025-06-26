document.addEventListener('DOMContentLoaded', () => {

    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const fileUploadInput = document.querySelector("#file-upload");

    let userMessage = null;
    let uploadedFileData = null;
    const inputInitHeight = chatInput.scrollHeight;

    // Lembre-se de colocar sua chave de API real aqui
    const API_KEY = "SUA_CHAVE_API_AQUI"; // <<-- COLOQUE SUA CHAVE AQUI
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // NOVO: Definição da personalidade do AEMI para ser enviada à API
    const systemInstruction = {
        role: "user",
        parts: [{
            text: `Assuma a seguinte persona: Você é AEMI (Assistente de Manutenção Industrial), uma IA especialista em rolamentos e manutenção industrial em geral. Você foi desenvolvida por Jonathan da Silva Oliveira para o canal "Manutenção Industrial ARQUIVOS". Sempre se apresente e responda seguindo essa identidade. Seja técnico, preciso e prestativo. Nunca quebre o personagem.`
        }]
    };
    const personaConfirmation = {
        role: "model",
        parts: [{
            text: `Entendido. Eu sou AEMI, uma IA especialista em rolamentos e manutenção industrial. Estou pronta para ajudar.`
        }]
    };


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

        // ATUALIZADO: Constrói as 'parts' da requisição com o texto do usuário
        const userParts = [{ text: userMessage }];

        if (uploadedFileData) {
            userParts.push({
                inline_data: {
                    mime_type: uploadedFileData.mimeType,
                    data: uploadedFileData.data
                }
            });
            uploadedFileData = null;
        }

        // ATUALIZADO: Monta o corpo da requisição incluindo a instrução de personalidade
        const requestBody = {
            // A conversa sempre começa com a instrução do sistema e a confirmação do modelo
            contents: [
                systemInstruction,
                personaConfirmation,
                { role: "user", parts: userParts }
            ],
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            if (!response.ok) {
                const errorData = await response.json();
                // Tenta fornecer uma mensagem de erro mais clara da API
                let errorMessage = "Oops! Algo deu errado.";
                if (errorData.error && errorData.error.message) {
                   errorMessage = `Erro da API: ${errorData.error.message}`;
                }
                if (errorData.error && errorData.error.message.includes('API key not valid')) {
                   errorMessage = "Erro: A chave de API não é válida. Verifique a chave no seu código.";
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();

            // Formata a resposta para respeitar quebras de linha, negrito, etc.
            const formattedResponse = data.candidates[0].content.parts[0].text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*/g, '• ') // Converte asteriscos de lista em marcadores
                .replace(/\n/g, '<br>');

            messageElement.innerHTML = formattedResponse;
        } catch (error) {
            messageElement.classList.add("error");
            messageElement.textContent = error.message; // Exibe a mensagem de erro formatada
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
            chatInput.value = `Arquivo "${file.name}" pronto para análise. Faça uma pergunta sobre ele.`;
            chatInput.focus();
        };

        reader.onerror = (error) => {
            console.error("Erro ao ler o arquivo:", error);
            chatInput.value = "Houve um erro ao tentar ler o arquivo.";
        };

        event.target.value = '';
    });

    // Event Listeners (sem alterações)
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
