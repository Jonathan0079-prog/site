# app.py - Versão DEFINITIVA combinando a biblioteca oficial com o modelo Gemma e o wakeup

import os
import io
import time
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

HUGGING_FACE_TOKEN = os.getenv("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")
client = None

# Tenta inicializar o cliente uma vez quando o app liga.
# Se falhar aqui, as rotas terão uma segunda chance.
try:
    if HUGGING_FACE_TOKEN:
        client = InferenceClient(model="google/gemma-2b-it", token=HUGGING_FACE_TOKEN)
        print("Cliente de Inferência inicializado com SUCESSO na partida.")
    else:
        print("AVISO: HF_TOKEN não encontrado na partida.")
except Exception as e:
    print(f"AVISO: Falha ao inicializar o cliente na partida: {e}")

def get_client():
    """Função para garantir que temos um cliente válido."""
    global client
    if client is None:
        if HUGGING_FACE_TOKEN:
            print("Cliente não estava inicializado. Tentando inicializar agora...")
            client = InferenceClient(model="google/gemma-2b-it", token=HUGGING_FACE_TOKEN)
            print("Cliente de Inferência inicializado sob demanda com SUCESSO.")
        else:
            raise ValueError("Token da Hugging Face (HF_TOKEN) é necessário.")
    return client

def process_text_prompt(prompt):
    """Processa uma pergunta usando o modelo de texto (Gemma)."""
    local_client = get_client()
    messages = [
        {"role": "system", "content": "Você é a AEMI, uma IA especialista em manutenção industrial."},
        {"role": "user", "content": prompt}
    ]
    response_generator = local_client.chat_completion(
        messages=messages, max_tokens=1500, stream=False
    )
    return response_generator.choices[0].message.content

# ... (As funções process_pdf e process_image permanecem as mesmas da última versão funcional)

# --- ROTAS DA API ---
@app.route('/')
def index():
    return "Servidor da AEMI (versão definitiva com Gemma) está no ar."

@app.route('/wakeup')
def wakeup():
    """Endpoint que o cron job vai chamar para manter o modelo de IA aquecido."""
    try:
        print("Recebido ping de 'wakeup'. Chamando a IA...")
        # Faz uma chamada muito pequena e rápida, apenas para "acordar" o modelo
        response = process_text_prompt("Olá")
        print(f"Ping de 'wakeup' para a IA executado com sucesso. Resposta: {response}")
        return jsonify({"status": "ok", "message": "Serviço de IA está aquecido."})
    except Exception as e:
        print(f"Erro durante o ping de 'wakeup': {e}")
        return jsonify({"status": "error", "message": f"Erro ao aquecer o serviço: {str(e)}"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.form.get('message', '')
        # ... (O resto da rota /chat permanece o mesmo da última versão)
        # Por simplicidade, vou colar a lógica completa aqui
        file = request.files.get('file')

        if not file and not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem ou arquivo enviado."}), 400

        bot_response = ""
        if file and file.filename:
             # A lógica de PDF e imagem será re-implementada aqui no futuro, quando a base estiver estável
             bot_response = "O processamento de arquivos está temporariamente em manutenção. Por favor, envie apenas texto."
        else:
            bot_response = process_text_prompt(user_message)

        return jsonify({"response": bot_response})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

