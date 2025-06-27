const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const fileUploadInput = document.querySelector("#file-upload");

let userMessage = null;
// NOVO: Variável para armazenar o contexto do último arquivo lido.
let fileContext = null; 
const inputInitHeight = chatInput.scrollHeight;

// --- URLs DAS APIS ---
const CHAT_API_URL = "https://api-oqfw.onrender.com/chat";
const RECOGNITION_API_URL = "https://dockerfile-u20q.onrender.com/reconhecer";

// Função para criar o elemento de chat (sem alterações)
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message;
    return chatLi;
};

// Função de resposta do Chat (ATUALIZADA)
const generateChatResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // ATUALIZADO: Verifica se há um contexto de arquivo para enviar junto com a mensagem.
    // Isso faz com que o bot saiba sobre o conteúdo do arquivo ao responder sua pergunta.
    let finalMessage = userMessage;
    if (fileContext) {
        finalMessage = `Com base no seguinte CONTEÚDO que foi extraído de um arquivo:
---
${fileContext}
---
Responda à seguinte pergunta do usuário: "${userMessage}"`;
        
        // Limpa o contexto após usá-lo uma vez para não interferir nas próximas perguntas.
        fileContext = null; 
    }

    const requestBody = {
        contents: [{
            parts: [{ text: finalMessage }]
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

// Função principal de Chat (sem alterações)
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

// --- Lógica de Upload de Arquivo (PRINCIPAL MUDANÇA) ---
fileUploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Cria a mensagem de status "Analisando..." que será atualizada com o resultado.
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
        
        // ATUALIZADO: Armazena o texto extraído na variável de contexto.
        fileContext = extractedText;

        // ATUALIZADO: Cria uma resposta rica em HTML para a AEMI mostrar no chat.
        // O conteúdo do arquivo é colocado dentro de uma tag <pre> para manter a formatação.
        const botResponseHTML = `
            Consegui ler o arquivo <strong>"${file.name}"</strong>. Aqui está o conteúdo que extraí:
            <blockquote class="file-content">
                <pre>${extractedText}</pre>
            </blockquote>
            Agora você pode me fazer perguntas sobre este documento ou pedir um resumo.`;
        
        // Atualiza a mensagem de "Analisando..." com o resultado final.
        statusMessageElement.innerHTML = botResponseHTML;

    } catch (error) {
        statusMessageElement.innerHTML = `Erro ao analisar: ${error.message}`;
        console.error("Erro ao chamar a API de reconhecimento:", error);
        fileContext = null; // Garante que o contexto seja nulo em caso de erro.
    } finally {
        // Limpa o input de arquivo para permitir o upload do mesmo arquivo novamente.
        event.target.value = '';
        // Garante que o chat role até o final para ver a mensagem completa.
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
});


// Ouvintes de eventos (sem alterações)
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
