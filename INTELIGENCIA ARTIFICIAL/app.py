# app.py - Versão com capacidade de ler PDFs e ver Imagens

import os
import io
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
from PIL import Image

app = Flask(__name__)
CORS(app)

# --- CONFIGURAÇÃO DOS CLIENTES DE IA ---
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
text_client = None
vqa_client = None # VQA = Visual Question Answering

if not HUGGING_FACE_TOKEN:
    print("ERRO CRÍTICO: A variável de ambiente 'HF_TOKEN' não foi encontrada.")
else:
    try:
        # Cliente para o modelo de LINGUAGEM (ler texto, PDFs)
        text_client = InferenceClient(model="microsoft/Phi-3-mini-4k-instruct", token=HUGGING_FACE_TOKEN)
        print("Cliente de Texto (Phi-3-mini) inicializado com SUCESSO.")
        
        # Cliente para o modelo de VISÃO (ver imagens)
        vqa_client = InferenceClient(model="Salesforce/blip-vqa-base", token=HUGGING_FACE_TOKEN)
        print("Cliente de Visão (BLIP VQA) inicializado com SUCESSO.")

    except Exception as e:
        print(f"ERRO CRÍTICO ao inicializar os clientes de inferência: {e}")

# --- FUNÇÕES AUXILIARES ---
def process_text_prompt(client, prompt):
    response_generator = client.chat_completion(
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024, stream=False
    )
    return response_generator.choices[0].message.content

def process_pdf(client, file, question):
    text_from_pdf = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text_from_pdf += page.extract_text() + "\n"
    
    prompt = f"""Baseado no seguinte texto extraído de um documento PDF, responda à pergunta abaixo.
    
    Texto do PDF:
    ---
    {text_from_pdf[:4000]}
    ---
    Pergunta: {question}
    """
    return process_text_prompt(client, prompt)

def process_image(client, file, question):
    image = Image.open(file.stream)
    # Se a pergunta estiver vazia, usamos uma pergunta padrão.
    if not question or question.strip() == '':
        question = "O que há nesta imagem? Descreva detalhadamente."
    
    return client.visual_Youtubeing(image=image, question=question)

# --- ROTA PRINCIPAL DO CHAT ---
@app.route('/chat', methods=['POST'])
def chat():
    if not text_client or not vqa_client:
        return jsonify({"error": "Um ou mais serviços de IA não foram inicializados."}), 503

    user_message = request.form.get('message', '') # Pega a mensagem de um campo de formulário
    file = request.files.get('file') # Pega o arquivo

    if not file and not user_message.strip():
        return jsonify({"error": "Nenhuma mensagem ou arquivo enviado."}), 400

    try:
        bot_response = ""
        if file:
            filename = file.filename.lower()
            if filename.endswith('.pdf'):
                bot_response = process_pdf(text_client, file, user_message)
            elif filename.endswith(('.png', '.jpg', '.jpeg', '.webp')):
                bot_response = process_image(vqa_client, file, user_message)
            else:
                bot_response = "Tipo de arquivo não suportado. Por favor, envie um PDF ou uma imagem."
        else: # Se não houver arquivo, apenas texto
            prompt = f"Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda à seguinte pergunta: {user_message}"
            bot_response = process_text_prompt(text_client, prompt)

        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"ERRO durante o processamento da requisição: {e}")
        return jsonify({"error": f"Ocorreu um erro ao processar sua solicitação. Detalhes: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
