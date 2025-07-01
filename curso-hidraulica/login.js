// Configuração do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyB_yPeyN-_z4JZ4hny8x3neU3InyRl6OEg",
  authDomain: "curso-hidraulica.firebaseapp.com",
  projectId: "curso-hidraulica",
  storageBucket: "curso-hidraulica.firebasestorage.app",
  messagingSenderId: "119186516649",
  appId: "1:119186516649:web:9c10d40022406b525757b8",
  measurementId: "G-0DD784H7E0"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginForm = document.getElementById('login-form');
const mensagemErro = document.getElementById('mensagem-erro');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    mensagemErro.style.display = 'none';

    // Função de Login do Firebase
    auth.signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            // Login bem-sucedido
            console.log('Login bem-sucedido!', userCredential.user);
            window.location.href = 'index.html'; // Redireciona para o curso
        })
        .catch((error) => {
            // Erro no login
            mensagemErro.textContent = 'E-mail ou senha inválidos.';
            mensagemErro.style.display = 'block';
        });
});
