# app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
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
API_KEY = os.getenv("NOVITA_HF_TOKEN")

# Verificação de segurança: Garante que a chave da API foi carregada
if not API_KEY:
    print("ERRO CRÍTICO: A variável de ambiente 'NOVITA_HF_TOKEN' não foi encontrada.")
    client = None
else:
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
    if not client:
        return jsonify({"error": "O serviço de IA não está configurado corretamente no servidor."}), 503

    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    try:
        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.2-3B-Instruct",
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
            max_tokens=1024,
            temperature=0.7,
            stream=False,
        )

        bot_response = completion.choices[0].message.content
        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"ERRO ao chamar a API da Hugging Face: {e}")
        return jsonify({"error": "Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente."}), 500

# --- EXECUÇÃO DO SERVIDOR ---

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

