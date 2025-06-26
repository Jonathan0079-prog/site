const chatbotToggler = document . querySelector ( ".chatbot-toggler" ) ;
const closeBtn = document . querySelector ( ".close-btn" ) ;
const chatbox = documento . querySelector ( ".chatbox" ) ;
const chatInput = document . querySelector ( ".chat-input textarea" ) ;
const sendChatBtn = document . querySelector ( ".chat-input span" ) ;
let userMessage = null ; // Variável para armazenar a mensagem do usuário
const inputInitHeight = chatInput.scrollHeight ;
// Configuração da API
const API_KEY = "AIzaSyCjtiaN0WJaibqKr3N2ApigZlf7MjrKe4c" ; // Sua chave de API aqui
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key= ${API_KEY} ` ;
const createChatLi = ( mensagem, className ) => {  
  // Crie um elemento de bate-papo <li> com a mensagem e o className passados
  const chatLi = documento . createElement ( "li" ) ;
  chatLi.classList.add ( "bate - papo" , ` ${ className } ` ) ;
  deixe chatContent = className === "saída" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>` ;
  chatLi. innerHTML = chatContent;
  chatLi. querySelector ( "p" ) . textContent = mensagem;
  retornar chatLi; // retorna o elemento chat <li>
}
const generateResponse = async ( chatElement ) => {   
  const messageElement = chatElement. querySelector ( "p" ) ;
  // Defina as propriedades e a mensagem para a solicitação da API
  const requestOptions = {
    método: "POST" ,
    cabeçalhos: { "Content-Type" : "application/json" } ,  
    corpo: JSON. stringify ( { 
      conteúdo: [ { 
        função: "usuário" ,
        partes: [ { texto: userMessage } ] 
      } ] 
    } ) ,
  }
  // Envia uma solicitação POST para a API, obtém uma resposta e define a resposta como texto de parágrafo
  tentar { 
    const resposta = await fetch ( API_URL, requestOptions ) ; 
    const data = aguardar resposta. json ( ) ;
    se ( !response. ok ) lançar novo erro ( dados. erro . mensagem ) ;    
    
    // Obtenha o texto de resposta da API e atualize o elemento da mensagem
    messageElement. textContent = dados. candidatos [ 0 ] . conteúdo . partes [ 0 ] . texto . substituir ( /\*\*(.*?)\*\*/g , '$1' ) ;
  } catch ( erro ) {   
    // Lidar com erro
    messageElement. classList . add ( "erro" ) ;
    mensagemElement. textContent = erro. mensagem ;
  } finalmente {  
    caixa de bate-papo. scrollTo ( 0 , caixa de bate-papo. scrollHeight ) ;
  }
}
const handleChat = ( ) => {  
  userMessage = chatInput. value . trim ( ) ; // Obtém a mensagem inserida pelo usuário e remove os espaços em branco extras
  se ( !userMessage ) retornar ;  
  // Limpe a área de texto de entrada e defina sua altura como padrão
  chatInput. valor = "" ;
  chatInput. estilo . altura = ` ${inputInitHeight} px` ;
  // Anexar a mensagem do usuário à caixa de bate-papo
  chatbox. appendChild ( createChatLi ( userMessage, "saída" ) ) ;
  caixa de bate-papo. scrollTo ( 0 , caixa de bate-papo. scrollHeight ) ;
  definirTempoLimite ( ( ) => {  
    // Exibir a mensagem "Pensando..." enquanto aguarda a resposta
    const incomingChatLi = createChatLi ( "Pensando..." , "entrada" ) ;
    caixa de bate-papo. appendChild ( incomingChatLi ) ;
    caixa de bate-papo. scrollTo ( 0 , caixa de bate-papo. scrollHeight ) ;
    gerarResposta ( incomingChatLi ) ;
  } , 600 ) ;
}
chatInput.addEventListener ( "entrada" , ( ) = > {  
  // Ajuste a altura da área de texto de entrada com base em seu conteúdo
  chatInput. estilo . altura = ` ${inputInitHeight} px` ;
  chatInput. estilo . altura = ` ${chatInput.scrollHeight} px` ;
} ) ;
chatInput. addEventListener ( "keydown" , ( e ) => {  
  // Se a tecla Enter for pressionada sem a tecla Shift e a janela
  // largura é maior que 800px, manipula o chat
  if ( e. key === "Enter" && !e. shiftKey && window . innerWidth > 800 ) {  
    e. preventDefault ( ) ;
    handleChat ( ) ;
  }
} ) ;
sendChatBtn. addEventListener ( "clique" , handleChat ) ;
closeBtn. addEventListener ( "clique " , ( ) = > document.body.classList.remove ( " show - chatbot " ) ) ;  
chatbotToggler. addEventListener ( "clique" , ( ) => documento . corpo . lista de classes . alternar ( "mostrar-chatbot" ) ) ;  
