# app.py - Versão FINAL CORRIGIDA, sem a dependência fantasma

import os
import io
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

def call_text_model(prompt):
    """Função para chamar o modelo de texto Gemma via API direta."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    
    model_name = "google/gemma-2b-it"
    api_url = f"{API_BASE_URL}{model_name}"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_TOKEN}"}
    
    # O modelo Gemma espera um formato de prompt específico
    payload = {
        "inputs": f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n",
        "parameters": {"max_new_tokens": 1500}
    }
    
    response = requests.post(api_url, headers=headers, json=payload, timeout=120)
    if response.status_code != 200:
        raise Exception(f"Erro na API da Hugging Face: {response.status_code} {response.text}")
    
    result = response.json()
    # Extrai o texto gerado da resposta da API
    return result[0]['generated_text'].split('<start_of_turn>model\n')[-1].strip()

def process_pdf(file, question):
    """Extrai texto de um PDF e faz uma pergunta sobre ele."""
    text_from_pdf = ""
    with pdfplumber.open(io.BytesIO(file.read())) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_from_pdf += page_text + "\n"
    
    limited_text = text_from_pdf[:8000] # Limita o texto para segurança
    
    prompt = f"""Baseado no seguinte texto extraído de um PDF, responda à pergunta do usuário.
    Se a pergunta for genérica como "resuma", faça um resumo do conteúdo.
    
    Texto do PDF: --- {limited_text} ---
    Pergunta do usuário: {question}"""
    
    return call_text_model(prompt)

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão leve e corrigida) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.form.get('message', '')
        file = request.files.get('file')

        if not file and not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem ou arquivo enviado."}), 400

        bot_response = ""
        if file:
            filename = file.filename.lower()
            if filename.endswith('.pdf'):
                bot_response = process_pdf(file, user_message)
            elif filename.endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # Mantemos a função de imagem desativada por enquanto para garantir estabilidade
                bot_response = "A função de análise de imagem está em manutenção. Por favor, tente mais tarde."
            else:
                bot_response = "Tipo de arquivo não suportado."
        else: # Se não houver arquivo, apenas texto
            prompt = f"Você é a AEMI, uma IA especialista em manutenção industrial. Responda: {user_message}"
            bot_response = call_text_model(prompt)

        return jsonify({"response": bot_response})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
