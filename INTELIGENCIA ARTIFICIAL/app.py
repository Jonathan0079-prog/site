# app.py - Versão FINAL com modelo Gemma para máxima compatibilidade

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# Inicializa o aplicativo Flask
app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO DA API HUGGING FACE ---
# 1. Pega o token de acesso que colocamos no "cofre" do Render
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
client = None

# 2. Verifica se o token foi encontrado e inicializa o cliente
if not HUGGING_FACE_TOKEN:
    print("ERRO CRÍTICO: A variável de ambiente 'HF_TOKEN' não foi encontrada.")
else:
    try:
        # A MUDANÇA FINAL: Usamos o modelo Gemma do Google, que tem excelente suporte
        # na infraestrutura gratuita da Hugging Face.
        client = InferenceClient(
            model="google/gemma-2b-it", # "it" significa "instruction-tuned" (ótimo para chat)
            token=HUGGING_FACE_TOKEN
        )
        print("Cliente de Inferência da Hugging Face inicializado com SUCESSO usando o modelo Gemma.")
    except Exception as e:
        print(f"ERRO CRÍTICO ao inicializar o cliente de inferência: {e}")

@app.route('/')
def index():
    return "Servidor da AEMI (versão estável com Gemma) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "O serviço de IA não foi inicializado corretamente no servidor. Verifique a variável de ambiente HF_TOKEN."}), 503

    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    try:
        # Monta a conversa para o modelo de chat
        messages = [
            {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, útil e objetiva."},
            {"role": "user", "content": user_message}
        ]
        
        # O método .chat_completion é o correto para modelos de instrução/chat como o Gemma
        response_generator = client.chat_completion(
            messages=messages,
            max_tokens=1500,
            stream=False,
        )
        bot_response = response_generator.choices[0].message.content
        return jsonify({"response": bot_response})
        
    except Exception as e:
        print(f"ERRO ao chamar a API da Hugging Face: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro ao comunicar com a API da Hugging Face. O modelo pode estar em 'cold start'. Por favor, tente novamente em um minuto. Detalhes: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
