# app.py - Versão com Layout Refinado e Limpeza de Chat

import os
import sys
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- CONFIGURAÇÃO INICIAL E BOAS PRÁTICAS ---

FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
if not FLASK_SECRET_KEY:
    print("ERRO CRÍTICO: A variável de ambiente FLASK_SECRET_KEY não foi definida.")
    sys.exit(1)

HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")
if not HUGGING_FACE_TOKEN:
    print("ERRO CRÍTICO: A variável de ambiente HF_TOKEN não foi definida.")
    sys.exit(1)

app = Flask(__name__)
CORS(app)
app.secret_key = FLASK_SECRET_KEY

try:
    TEXT_CLIENT = InferenceClient(model="meta-llama/Meta-Llama-3-8B-Instruct", token=HUGGING_FACE_TOKEN)
except Exception as e:
    print(f"ERRO CRÍTICO: Falha ao inicializar o InferenceClient da Hugging Face. Detalhes: {e}")
    sys.exit(1)

MAX_HISTORY_LENGTH = 20

# --- FUNÇÕES DE PROCESSAMENTO ---

def process_text_with_history(messages):
    try:
        response_generator = TEXT_CLIENT.chat_completion(
            messages=messages,
            max_tokens=1500,
            stream=False
        )
        return response_generator.choices[0].message.content
    except Exception as e:
        print(f"ERRO ao chamar a API da Hugging Face: {e}")
        return "Desculpe, não consegui processar sua mensagem no momento. Tente novamente mais tarde."

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão com Layout Refinado) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.form.get('message', '')
        if not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem enviada."}), 400

        if 'conversation_history' not in session:
            session['conversation_history'] = [
                {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda apenas a perguntas relacionadas a este domínio. Se a pergunta não for sobre manutenção industrial, diga que você só pode ajudar com tópicos relacionados à manutenção industrial."}
            ]
            
        current_history = session['conversation_history']
        current_history.append({"role": "user", "content": user_message})

        bot_response = process_text_with_history(current_history)
        
        current_history.append({"role": "assistant", "content": bot_response})

        if len(current_history) > MAX_HISTORY_LENGTH: 
            system_prompt = current_history[0]
            recent_history = current_history[-MAX_HISTORY_LENGTH+1:]
            session['conversation_history'] = [system_prompt] + recent_history
        else:
            session['conversation_history'] = current_history

        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500

# MELHORIA: Endpoint para limpar o histórico da conversa na sessão
@app.route('/clear-session', methods=['POST'])
def clear_session():
    try:
        session.pop('conversation_history', None) # Remove o histórico da sessão
        return jsonify({"status": "success", "message": "Sessão limpa."}), 200
    except Exception as e:
        print(f"ERRO ao limpar a sessão: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
