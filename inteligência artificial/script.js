// Apenas a função generateResponse precisa de ser atualizada. 
// O resto do seu script (handleChat, createChatLi, etc.) pode continuar igual.

const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.textContent = ""; // Limpa a mensagem "Analisando..."

    // O corpo do pedido continua igual
    const requestParts = [{ text: userMessage }];
    if (uploadedFileData) {
        requestParts.push({
            inline_data: {
                mime_type: uploadedFileData.mimeType,
                data: uploadedFileData.data
            }
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
        // A chamada fetch continua a mesma
        const response = await fetch(API_URL, requestOptions);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "O servidor respondeu com um erro.");
        }

        // --- NOVA LÓGICA DE STREAMING ---
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            // Às vezes a API envia múltiplos pedaços de dados juntos
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.replace('data: ', '').trim();
                    if (jsonStr) {
                        try {
                            const jsonData = JSON.parse(jsonStr);
                            const textPart = jsonData.candidates[0].content.parts[0].text;
                            fullResponse += textPart;
                            // Atualiza o balão de chat em tempo real, já formatado
                            messageElement.innerHTML = fullResponse
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br>');
                            chatbox.scrollTo(0, chatbox.scrollHeight); // Mantém o scroll em baixo
                        } catch (e) {
                            // Ignora erros de parsing de JSON que podem acontecer entre os chunks
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
