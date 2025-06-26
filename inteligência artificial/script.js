document.addEventListener('DOMContentLoaded', () => {

    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector("#send-btn");
    const fileUploadInput = document.querySelector("#file-upload");

    let userMessage = null;
    let uploadedFileData = null; // NOVO: Variável para armazenar os dados do arquivo
    const inputInitHeight = chatInput.scrollHeight;

    // Lembre-se de colocar sua chave de API real aqui
    const API_KEY = "COLE_SUA_CHAVE_DE_API_AQUI";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").innerHTML = message; // Usar innerHTML para renderizar quebras de linha
        return chatLi;
    };

    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector("p");

        // --- LÓGICA DE ENVIO ATUALIZADA ---
        // Constrói as 'parts' da requisição. Começa sempre com o texto.
        const requestParts = [{ text: userMessage }];

        // Se houver um arquivo, adiciona os dados dele às 'parts'
        if (uploadedFileData) {
            requestParts.push({
                inline_data: {
                    mime_type: uploadedFileData.mimeType,
                    data: uploadedFileData.data
                }
            });
            // Limpa os dados do arquivo após o envio
            uploadedFileData = null;
        }

        const requestBody = {
            contents: [{ parts: requestParts }],
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
                throw new Error(errorData.error.message || "Erro desconhecido na API.");
            }
            const data = await response.json();
            // Formata a resposta para respeitar quebras de linha e negrito
            const formattedResponse = data.candidates[0].content.parts[0].text
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\n/g, '<br>');
            messageElement.innerHTML = formattedResponse;
        } catch (error) {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Algo deu errado. Verifique sua chave de API/conexão e o tamanho do arquivo.";
            console.error(error);
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    };

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage && !uploadedFileData) return; // Não envia se não houver texto nem arquivo

        // Se só enviou um arquivo sem texto, cria uma mensagem padrão
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
    
    // --- LÓGICA DE LEITURA DE ARQUIVO ATUALIZADA ---
    fileUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file); // Lê o arquivo como Data URL (contém Base64)

        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Pega apenas a parte do código Base64
            
            // Armazena os dados do arquivo para serem enviados com a próxima mensagem
            uploadedFileData = {
                name: file.name,
                mimeType: file.type,
                data: base64String
            };

            // Avisa ao usuário que o arquivo está pronto
            chatInput.value = `Arquivo "${file.name}" pronto para ser analisado. Faça uma pergunta sobre ele e clique em Enviar.`;
            chatInput.focus();
        };

        reader.onerror = (error) => {
            console.error("Erro ao ler o arquivo:", error);
            chatInput.value = "Houve um erro ao tentar ler o arquivo.";
        };

        // Limpa a seleção para poder selecionar o mesmo arquivo novamente
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
