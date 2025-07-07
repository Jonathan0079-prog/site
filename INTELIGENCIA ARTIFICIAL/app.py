# app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importante para permitir a comunicação entre front-end e back-end
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env (para teste local)
load_dotenv()

# Inicializa o aplicativo Flask
app = Flask(__name__)

# Habilita o CORS para permitir que seu site no GitHub se comunique com este servidor
CORS(app)

# --- CONFIGURAÇÃO DA API NOVITA/HUGGING FACE ---

# Pega a chave da API da variável de ambiente.
# Este nome ('NOVITA_HF_TOKEN') deve ser o mesmo que você configurou no Render.
API_KEY = os.getenv("NOVITA_HF_TOKEN")

# Verificação de segurança: Garante que a chave da API foi carregada
if not API_KEY:
    # Esta mensagem aparecerá nos logs do Render se a chave não for encontrada
    print("ERRO CRÍTICO: A variável de ambiente 'NOVITA_HF_TOKEN' não foi configurada.")
    # Em um ambiente real, você poderia levantar um erro para impedir a execução
    # raise ValueError("A chave da API 'NOVITA_HF_TOKEN' não foi encontrada.")

# Inicializa o cliente da API de forma segura
# Colocamos dentro de um bloco 'try' para lidar com o caso da chave não existir
try:
    client = InferenceClient(
        provider="novita",
        api_key=API_KEY,
    )
except Exception as e:
    print(f"Falha ao inicializar o InferenceClient: {e}")
    client = None

# --- DEFINIÇÃO DAS ROTAS DA API ---

# Rota de verificação para saber se o servidor está no ar
@app.route('/')
def index():
    return "Servidor da AEMI está no ar e pronto para receber requisições."

# Rota principal para o chat
@app.route('/chat', methods=['POST'])
def chat():
    # Verifica se o cliente da API foi inicializado corretamente
    if not client:
        return jsonify({"error": "O serviço de IA não está configurado corretamente no servidor."}), 503

    # Pega os dados JSON enviados pelo front-end
    data = request.get_json()
    user_message = data.get('message')

    # Validação da mensagem recebida
    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    try:
        # --- CHAMADA PARA A IA ---
        # Aqui montamos a requisição para o modelo Llama
        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.2-3B-Instruct",  # Modelo que você escolheu
            messages=[
                {
                    "role": "system",
                    "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial e rolamentos, criada por Jonathan da Silva Oliveira para o canal Manutenção Industrial ARQUIVOS."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            max_tokens=1024,  # Aumentei para permitir respostas mais longas e completas
            temperature=0.7,
            stream=False, # Importante: stream=False para obter a resposta completa de uma vez
        )

        # Extrai o conteúdo da resposta da IA
        bot_response = completion.choices[0].message.content

        # Envia a resposta de volta para o front-end no formato JSON
        return jsonify({"response": bot_response})

    except Exception as e:
        # Captura qualquer erro que possa ocorrer durante a chamada à API
        print(f"ERRO ao chamar a API da Hugging Face: {e}")
        return jsonify({"error": "Desculpe, ocorreu um erro ao processar sua
