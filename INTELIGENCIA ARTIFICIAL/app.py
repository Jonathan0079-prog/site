# app.py - Versão FINAL com rota /wakeup para manter a IA "quente"

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
client = None

if not HUGGING_FACE_TOKEN:
    print("ERRO CRÍTICO: A variável de ambiente 'HF_TOKEN' não foi encontrada.")
else:
    try:
        # Inicializamos o cliente uma vez para reuso
        client = InferenceClient(model="google/gemma-2b-it", token=HUGGING_FACE_TOKEN)
        print("Cliente de Inferência da Hugging Face inicializado com SUCESSO usando o modelo Gemma.")
    except Exception as e:
        print(f"ERRO CRÍTICO ao inicializar o cliente de inferência: {e}")

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI está no ar."

# ROTA NOVA E ESPECIAL PARA O CRON JOB CHAMAR
@app.route('/wakeup')
def wakeup():
    """
    Endpoint leve que o cron job vai chamar para manter o modelo de IA aquecido.
    """
    if not client:
        return jsonify({"status": "error", "message": "Cliente de IA não inicializado."}), 500
    
    try:
        # Faz uma chamada muito pequena e rápida, apenas para "acordar" o modelo
        client.chat_completion(messages=[{"role": "user", "content": "Olá"}], max_tokens=5)
        print("Ping de 'wakeup' para a IA executado com sucesso.")
        return jsonify({"status": "ok", "message": "Serviço de IA está aquecido."})
    except Exception as e:
        print(f"Erro durante o ping de 'wakeup': {e}")
        return jsonify({"status": "error", "message": f"Erro ao aquecer o serviço: {str(e)}"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "O serviço de IA não foi inicializado."}), 503

    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida."}), 400

    try:
        messages = [
            {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, útil e objetiva."},
            {"role": "user", "content": user_message}
        ]
        
        response_generator = client.chat_completion(
            messages=messages, max_tokens=1500, stream=False
        )
        bot_response = response_generator.choices[0].message.content
        return jsonify({"response": bot_response})
        
    except Exception as e:
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

