// Ficheiro: script.js (VERSÃO COMPLETA E CORRIGIDA)

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

// Função para criar o elemento de chat (sem alterações)
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message; // Usamos innerHTML para renderizar o negrito/quebras de linha
    return chatLi;
};

// --- FUNÇÃO DE RESPOSTA DO CHAT (SEM ALTERAÇÕES) ---
// Esta função envia o texto para a API do Gemini e já está correta.
const generateChatResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    
    // O corpo da requisição para a API de Chat (Gemini)
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


// --- FUNÇÃO PRINCIPAL DE CHAT (LIGEIRAMENTE SIMPLIFICADA) ---
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return; // Se não há mensagem, não faz nada

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Adiciona a mensagem do usuário na tela
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Adiciona a bolha de "pensando..." e chama a API do Chat
    setTimeout(() => {
        const incomingChatLi = createChatLi("A pensar...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateChatResponse(incomingChatLi);
    }, 600);
};


// --- LÓGICA DE UPLOAD DE ARQUIVO (A PARTE MAIS IMPORTANTE) ---
fileUploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Adiciona uma mensagem de status na tela
    const statusChatLi = createChatLi(`Analisando o arquivo "${file.name}"...`, "incoming");
    chatbox.appendChild(statusChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    const statusMessageElement = statusChatLi.querySelector("p");

    // Usa FormData para enviar o arquivo, que é o método correto para arquivos
    const formData = new FormData();
    formData.append('file', file);

    try {
        // 1. CHAMA A SUA API DE RECONHECIMENTO PRIMEIRO!
        const response = await fetch(RECOGNITION_API_URL, {
            method: 'POST',
            body: formData // Não precisa de headers, o navegador define automaticamente com FormData
        });

        const data = await response.json();

        if (!response.ok) {
            // Se a API de reconhecimento deu erro, avisa o usuário
            throw new Error(data.erro || 'Não foi possível ler o arquivo.');
        }

        // 2. SUCESSO! PEGA O TEXTO EXTRAÍDO
        const extractedText = data.conteudo_extraido;
        statusMessageElement.textContent = `Arquivo lido com sucesso!`;

        // 3. PREPARA A PERGUNTA PARA A AIME COM O CONTEÚDO
        // Agora, nós automaticamente colocamos o texto extraído na caixa de texto
        // e adicionamos uma instrução para a AIME.
        chatInput.value = `Com base no seguinte conteúdo que extraí do arquivo "${file.name}", responda às minhas próximas perguntas. Se eu não perguntar nada específico, faça um resumo.\n\nCONTEÚDO:\n"""\n${extractedText}\n"""`;

        // Ajusta a altura da caixa de texto e foca nela
        chatInput.style.height = "auto";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
        chatInput.focus();

    } catch (error) {
        statusMessageElement.textContent = `Erro ao analisar: ${error.message}`;
        console.error("Erro ao chamar a API de reconhecimento:", error);
    } finally {
        // Limpa o input de arquivo para permitir o envio do mesmo arquivo novamente
        event.target.value = '';
    }
});


// --- OUVINTES DE EVENTOS (sem alterações) ---
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
