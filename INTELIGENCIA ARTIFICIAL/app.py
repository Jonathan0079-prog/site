# app.py - Versão FINAL com modelo TinyLlama, que respeita o limite de 2GB

import os
import io
import time
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
    """Função central para chamar a API da Hugging Face, com lógica de retentativa."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    
    api_url = f"{API_BASE_URL}{model_name}"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_TOKEN}"}
    
    for attempt in range(3):
        print(f"Tentativa {attempt + 1} de chamar a API para o modelo {model_name}...")
        response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        
        if response.status_code == 200:
            print("Sucesso! API respondeu.")
            return response.json()
        
        if response.status_code in [503, 404] and "loading" in response.text.lower():
            wait_time = 20
            print(f"Modelo está carregando. Esperando {wait_time} segundos para a tentativa {attempt + 2}...")
            time.sleep(wait_time)
            continue
        
        raise Exception(f"Erro na API da Hugging Face: {response.status_code} {response.text}")
        
    raise Exception("O modelo não conseguiu carregar após múltiplas tentativas.")

def process_text_prompt(prompt):
    """Processa uma pergunta usando o modelo de texto (TinyLlama)."""
    # A MUDANÇA ESTÁ AQUI:
    model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    
    # O TinyLlama usa o mesmo formato de chat que o Gemma
    payload = {
        "inputs": f"<|system|>\nVocê é a AEMI, uma assistente de IA especialista em manutenção industrial.</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n",
        "parameters": {"max_new_tokens": 1024}
    }
    
    result = call_huggingface_api(payload, model_name)
    return result[0]['generated_text'].split('<|assistant|>\n')[-1].strip()

def process_pdf(file, question):
    """Extrai texto de um PDF e faz uma pergunta sobre ele."""
    text_from_pdf = ""
    with pdfplumber.open(io.BytesIO(file.read())) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_from_pdf += page_text + "\n"
    
    limited_text = text_from_pdf[:7000]
    
    prompt = f"""Baseado no seguinte texto de um PDF, responda à pergunta do usuário.
    Texto: --- {limited_text} ---
    Pergunta: {question}"""
    
    return process_text_prompt(prompt)

# --- ROTAS DA API ---
@app.route('/')
def index():
    return "Servidor da AEMI (versão com TinyLlama) está no ar."

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
            bot_response = process_text_prompt(user_message)

        return jsonify({"response": bot_response})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
