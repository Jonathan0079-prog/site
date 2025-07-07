# app.py - Versão FINAL e OTIMIZADA para PDF e Imagens no Render

import os
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

# Pega o token de acesso que colocamos no "cofre" do Render
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")

# --- FUNÇÕES DE PROCESSAMENTO SOB DEMANDA ---

def get_text_client():
    """Cria e retorna um cliente para o modelo de linguagem de texto."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    return InferenceClient(model="microsoft/Phi-3-mini-4k-instruct", token=HUGGING_FACE_TOKEN)

def get_vqa_client():
    """Cria e retorna um cliente para o modelo de visão (Visual Question Answering)."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    return InferenceClient(model="Salesforce/blip-vqa-base", token=HUGGING_FACE_TOKEN)

def process_text_prompt(prompt):
    """Processa uma pergunta usando o modelo de texto."""
    client = get_text_client()
    response_generator = client.chat_completion(
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500, stream=False
    )
    return response_generator.choices[0].message.content

def process_pdf(file, question):
    """Extrai texto de um PDF e faz uma pergunta sobre ele."""
    import pdfplumber
    
    text_from_pdf = ""
    # Usamos um buffer de memória para abrir o arquivo sem salvá-lo em disco
    with pdfplumber.open(io.BytesIO(file.read())) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_from_pdf += page_text + "\n"
    
    # Limita o texto para não estourar o limite de tokens do modelo
    limited_text = text_from_pdf[:8000]
    
    prompt = f"""Baseado no seguinte texto extraído de um documento PDF, responda à pergunta do usuário.
    Se a pergunta for genérica como "resuma" ou "do que se trata", faça um resumo do conteúdo.
    
    Texto do PDF:
    ---
    {limited_text}
    ---
    Pergunta do usuário: {question}
    """
    return process_text_prompt(prompt)

def process_image(file, question):
    """Analisa uma imagem e responde a uma pergunta sobre ela."""
    from PIL import Image

    client = get_vqa_client()
    image = Image.open(file.stream)
    
    # Se a pergunta estiver vazia, usamos uma pergunta padrão.
    if not question or not question.strip():
        question = "O que há nesta imagem? Descreva com o máximo de detalhes possível."
    
    # O modelo BLIP retorna um dicionário, então pegamos o primeiro resultado.
    result = client.visual_Youtubeing(image=image, question=question)
    return result[0]['answer'] if result else "Não consegui analisar a imagem."

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão Multimodal Otimizada) está no ar."

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
                print("Processando um arquivo PDF...")
                bot_response = process_pdf(file, user_message)
            elif filename.endswith(('.png', '.jpg', '.jpeg', '.webp')):
                print("Processando um arquivo de Imagem...")
                bot_response = process_image(file, user_message)
            else:
                bot_response = "Tipo de arquivo não suportado. Por favor, envie um PDF ou uma imagem (PNG, JPG, WEBP)."
        else: # Se não houver arquivo, apenas texto
            print("Processando uma mensagem de texto...")
            prompt = f"Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda à seguinte pergunta: {user_message}"
            bot_response = process_text_prompt(prompt)

        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc() # Imprime o stack trace completo do erro no log
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
