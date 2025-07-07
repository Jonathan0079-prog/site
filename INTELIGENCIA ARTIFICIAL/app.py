# app_sem_memoria.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

# A chave secreta do Flask não é mais estritamente necessária se não usarmos sessões,
# mas é uma boa prática mantê-la.
app.secret_key = os.getenv("FLASK_SECRET_KEY", "uma_chave_secreta_muito_segura_e_diferente")

# Pega o token de acesso da Hugging Face
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")

# --- FUNÇÕES DE PROCESSAMENTO ---

def get_text_client():
    """Cria e retorna um cliente para o modelo de linguagem de texto."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    return InferenceClient(model="meta-llama/Meta-Llama-3-70B-Instruct", token=HUGGING_FACE_TOKEN)

def process_text_without_history(user_message):
    """
    Processa uma ÚNICA mensagem de usuário usando o modelo de texto.
    O histórico é construído do zero a cada chamada.
    """
    client = get_text_client()
    
    # O histórico agora é simples: apenas a instrução de sistema e a mensagem atual do usuário.
    messages = [
        {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda apenas a perguntas relacionadas a este domínio. Se a pergunta não for sobre manutenção industrial, diga que você só pode ajudar com tópicos relacionados à manutenção industrial."},
        {"role": "user", "content": user_message}
    ]
    
    response_generator = client.chat_completion(
        messages=messages,
        max_tokens=1500,
        stream=False  # Mantido como False por enquanto, veja a discussão abaixo.
    )
    return response_generator.choices[0].message.content

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão SEM Memória) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.form.get('message', '')
        if not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem enviada."}), 400

        print("Processando nova mensagem (sem histórico)...")
        
        # Chama a IA apenas com a mensagem atual
        bot_response = process_text_without_history(user_message)
        
        print("Resposta da IA gerada.")

        return jsonify({"response": bot_response})

    except Exception as e:
        # Este bloco de tratamento de erro é agora AINDA MAIS IMPORTANTE.
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc() # Isso imprimirá o traceback completo no log, como na sua imagem.
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500

# A rota '/clear-session' foi removida pois não há mais sessão ou banco de dados para limpar.

if __name__ == '__main__':
    # A porta padrão para serviços web como a Render é frequentemente 10000.
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

