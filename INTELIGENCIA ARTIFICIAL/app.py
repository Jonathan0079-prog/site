# app.py - Versão FINAL e ESTÁVEL usando a API Oficial da Hugging Face com Token

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO DA API HUGGING FACE COM TOKEN ---
# 1. Pega o token de acesso que colocamos no "cofre" do Render
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
client = None

# 2. Verifica se o token foi encontrado e inicializa o cliente com ele
if not HUGGING_FACE_TOKEN:
    print("ERRO CRÍTICO: A variável de ambiente 'HF_TOKEN' não foi encontrada.")
else:
    try:
        client = InferenceClient(model="HuggingFaceH4/zephyr-7b-beta", token=HUGGING_FACE_TOKEN)
        print("Cliente de Inferência da Hugging Face inicializado com SUCESSO usando o token.")
    except Exception as e:
        print(f"ERRO CRÍTICO ao inicializar o cliente de inferência: {e}")

@app.route('/')
def index():
    return "Servidor da AEMI (versão API Hugging Face com Token) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "O serviço de IA não foi inicializado corretamente no servidor. Verifique a variável de ambiente HF_TOKEN."}), 503

    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    try:
        response_generator = client.chat_completion(
            messages=[
                {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1024,
            stream=False,
        )
        bot_response = response_generator.choices[0].message.content
        return jsonify({"response": bot_response})
        
    except Exception as e:
        print(f"ERRO ao chamar a API da Hugging Face: {e}")
        return jsonify({"error": f"Ocorreu um erro ao comunicar com a API da Hugging Face. Isso pode ser um 'cold start' (o modelo está 'acordando'). Por favor, tente novamente em um minuto. Detalhes: {e}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
