# app.py - Versão ESTÁVEL usando a API Gratuita Oficial da Hugging Face

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# Inicializa o aplicativo Flask
app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO DA API HUGGING FACE (NÍVEL GRATUITO) ---
# Não precisamos de chave de API. A biblioteca usará o acesso público.
# Escolhemos um modelo popular e gratuito diretamente da plataforma.
# O "Zephyr-7B-Beta" é um excelente modelo de 7 bilhões de parâmetros.
try:
    client = InferenceClient(model="HuggingFaceH4/zephyr-7b-beta")
    print("Cliente de Inferência da Hugging Face inicializado com sucesso.")
except Exception as e:
    client = None
    print(f"ERRO CRÍTICO ao inicializar o cliente de inferência: {e}")


@app.route('/')
def index():
    return "Servidor da AEMI (versão API Hugging Face Gratuita) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "O serviço de IA não foi inicializado corretamente no servidor."}), 503

    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    try:
        # A estrutura da chamada é um pouco diferente para modelos de chat da Hugging Face
        # Usamos o método 'chat_completion'
        response_generator = client.chat_completion(
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
            max_tokens=1024, # Limite de tokens para a resposta
            stream=False,   # 'stream=False' para receber a resposta completa de uma vez
        )
        bot_response = response_generator.choices[0].message.content
        return jsonify({"response": bot_response})
        
    except Exception as e:
        print(f"ERRO ao chamar a API da Hugging Face: {e}")
        # Retorna uma mensagem de erro clara, mencionando o "cold start"
        return jsonify({"error": f"Ocorreu um erro ao comunicar com a API da Hugging Face. Isso pode ser um 'cold start' (o modelo está 'acordando'), o que pode demorar até 60 segundos. Por favor, tente enviar sua mensagem novamente em um minuto. Detalhes: {e}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

