const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variável para armazenar a mensagem do usuário
const inputInitHeight = chatInput.scrollHeight;

// Configuração da API
const API_KEY = "AIzaSyCjMoRczct7hyer1Xz0bd_kbtXz9P2pRiE"; // Substitua com sua chave de API real
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Exibe a resposta do chatbot na tela
    messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    // Rola para o final da caixa de chat
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Obtém a mensagem inserida pelo usuário e remove os espaços em branco extras
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`; // Restaura a altura da área de texto

  // Adiciona a mensagem do usuário na caixa de bate-papo
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Exibe a mensagem "Pensando..." enquanto aguarda a resposta
    const incomingChatLi = createChatLi("Pensando...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi); // Gera a resposta do chatbot
  }, 600);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`; // Ajusta a altura da área de texto conforme o conteúdo
});

chatInput.addEventListener("keydown", (e) => {
  // Se a tecla Enter for pressionada sem a tecla Shift e a largura da janela for maior que 800px
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);

closeBtn.addEventListener("click", () => {
  // Fecha o chatbot
  document.body.classList.remove("show-chatbot");
});

chatbotToggler.addEventListener("click", () => {
  // Exibe ou esconde o chatbot
  document.body.classList.toggle("show-chatbot");
});
