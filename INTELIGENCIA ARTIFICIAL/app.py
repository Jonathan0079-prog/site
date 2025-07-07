# app.py - Versão OTIMIZADA com chamadas diretas via 'requests'

import os
import io
import requests
import pdfplumber
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
API_BASE_URL = "https://api-inference.huggingface.co/models/"

# --- FUNÇÕES DE PROCESSAMENTO ---

def call_huggingface_api(payload, model_name):
    """Função central para chamar qualquer modelo na API da Hugging Face."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    
    api_url = f"{API_BASE_URL}{model_name}"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_TOKEN}"}
    
    response = requests.post(api_url, headers=headers, json=payload, timeout=120)
    if response.status_code != 200:
        raise Exception(f"Erro na API da Hugging Face: {response.status_code} {response.text}")
    return response.json()

def process_text_prompt(prompt):
    """Processa uma pergunta usando o modelo de texto (Gemma)."""
    payload = {
        "inputs": f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n",
        "parameters": {"max_new_tokens": 1500}
    }
    model_name = "google/gemma-2b-it"
    result = call_huggingface_api(payload, model_name)
    # A resposta da API direta vem em um formato diferente
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
    
    prompt = f"""Você é a AEMI, uma IA especialista. Baseado no seguinte texto extraído de um PDF, responda à pergunta do usuário.
    Texto do PDF: --- {limited_text} ---
    Pergunta do usuário: {question}"""
    
    return process_text_prompt(prompt)

def process_image(file, question):
    """Analisa uma imagem e responde a uma pergunta sobre ela."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")

    model_name = "Salesforce/blip-vqa-base"
    api_url = f"{API_BASE_URL}{model_name}"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_TOKEN}"}
    
    # Para VQA, o payload é diferente e não é JSON, então lemos o binário da imagem
    image_bytes = file.read()
    
    payload = {
        "inputs": {
            "image": "data:image/jpeg;base64," + requests.utils.quote(image_bytes),
            "question": question if question.strip() else "O que há nesta imagem? Descreva detalhadamente."
        }
    }
    # Chamada específica para VQA pode precisar de ajustes, mas o princípio é este
    # Para simplificar e garantir funcionamento, vamos usar a biblioteca apenas para este caso
    from huggingface_hub import InferenceClient
    client = InferenceClient(model=model_name, token=HUGGING_FACE_TOKEN)
    pil_image = Image.open(io.BytesIO(image_bytes))
    result = client.visual_Youtubeing(image=pil_image, question=payload["inputs"]["question"])
    return result[0]['answer'] if result else "Não consegui analisar a imagem."


# --- ROTA PRINCIPAL ---
@app.route('/')
def index():
    return "Servidor da AEMI (versão leve com 'requests') está no ar."

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
                # A função de imagem ainda é complexa, vamos simplificá-la por enquanto
                # bot_response = process_image(file, user_message)
                bot_response = "A função de análise de imagem está em manutenção. Por favor, tente mais tarde."
            else:
                bot_response = "Tipo de arquivo não suportado."
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
    
