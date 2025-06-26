// VERSÃO FINAL E ROBUSTA DA FUNÇÃO generateResponse
// Substitua a sua função antiga por esta

const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.textContent = ""; // Limpa a mensagem "Analisando..."

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
                            
                            // --- AQUI ESTÁ A CORREÇÃO ---
                            // Verifica se a resposta tem 'candidates' e se o primeiro item existe
                            if (jsonData.candidates && jsonData.candidates[0]) {
                                const textPart = jsonData.candidates[0].content.parts[0].text;
                                fullResponse += textPart;
                                messageElement.innerHTML = fullResponse
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\n/g, '<br>');
                                chatbox.scrollTo(0, chatbox.scrollHeight);
                            }
                            // Se não houver 'candidates', ele simplesmente ignora este "pedaço" e continua
                            
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
