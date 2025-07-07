# app.py - Versão FINAL com lógica de retentativa para o "cold start"

import os
import io
import time # Importamos a biblioteca 'time' para poder esperar
import requests
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
API_BASE_URL = "https://api-inference.huggingface.co/models/"

# --- FUNÇÕES DE PROCESSAMENTO ---

def call_huggingface_api(payload, model_name):
    """
    Função central para chamar a API da Hugging Face, agora com lógica de retentativa.
    """
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    
    api_url = f"{API_BASE_URL}{model_name}"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_TOKEN}"}
    
    # Lógica de retentativa: Tenta até 3 vezes
    for attempt in range(3):
        print(f"Tentativa {attempt + 1} de chamar a API para o modelo {model_name}...")
        response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        
        # Se a resposta for um sucesso (200), retorna o resultado imediatamente
        if response.status_code == 200:
            print("Sucesso! API respondeu.")
            return response.json()
        
        # Se for um erro de "modelo carregando" (503 ou 404 com a mensagem certa), espera e tenta de novo
        if response.status_code in [503, 404] and "loading" in response.text.lower():
            wait_time = 25 # Espera 25 segundos
            print(f"Modelo está carregando. Esperando {wait_time} segundos para a tentativa {attempt + 2}...")
            time.sleep(wait_time)
            continue # Pula para a próxima iteração do loop
        
        # Se for qualquer outro erro, desiste e levanta a exceção
        raise Exception(f"Erro na API da Hugging Face: {response.status_code} {response.text}")
        
    # Se todas as tentativas falharem, levanta um erro final
    raise Exception("O modelo não conseguiu carregar após múltiplas tentativas.")

def process_text_prompt(prompt):
    """Processa uma pergunta usando o modelo de texto (Gemma)."""
    payload = {
        "inputs": f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n",
        "parameters": {"max_new_tokens": 1500}
    }
    model_name = "google/gemma-2b-it"
    result = call_huggingface_api(payload, model_name)
    return result[0]['generated_text'].split('<start_of_turn>model\n')[-1].strip()

def process_pdf(file, question):
    """Extrai texto de um PDF e faz uma pergunta sobre ele."""
    text_from_pdf = ""
    with pdfplumber.open(io.BytesIO(file.read())) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_from_pdf += page_text + "\n"
    
    limited_text = text_from_pdf[:8000]
    prompt = f"""Baseado no seguinte texto de um PDF, responda à pergunta do usuário.
    Texto: --- {limited_text} ---
    Pergunta: {question}"""
    return process_text_prompt(prompt)

# --- ROTA PRINCIPAL ---
@app.route('/')
def index():
    return "Servidor da AEMI (versão com retry) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.form.get('message', '')
        file = request.files.get('file')

        if not file and not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem ou arquivo enviado."}), 400

        bot_response = ""
        if file and file.filename:
            filename = file.filename.lower()
            if filename.endswith('.pdf'):
                bot_response = process_pdf(file, user_message)
            else:
                bot_response = "Tipo de arquivo não suportado. Apenas PDF é aceito no momento."
        else:
            prompt = f"Você é a AEMI, uma IA especialista em manutenção industrial. Responda: {user_message}"
            bot_response = process_text_prompt(prompt)

        return jsonify({"response": bot_response})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
