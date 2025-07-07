# app.py - Versão com Múltiplas Conversas e Menu Lateral

import os
import uuid
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from huggingface_hub import InferenceClient
from tinydb import TinyDB, Query

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "outra_chave_secreta_super_segura_e_diferente")
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")

# --- BANCO DE DADOS E CLIENTE IA ---
db = TinyDB('conversations_db.json') # Armazenará todas as conversas
Conversation = Query()
text_client = None # Vamos inicializar o cliente uma vez para reuso

def get_text_client():
    """Inicializa o cliente da Hugging Face de forma otimizada (lazy loading)."""
    global text_client
    if text_client is None:
        if not HUGGING_FACE_TOKEN:
            raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
        text_client = InferenceClient(model="meta-llama/Meta-Llama-3-70B-Instruct", token=HUGGING_FACE_TOKEN)
    return text_client

def generate_title_for_conversation(user_message):
    """Gera um título curto para a conversa baseado na primeira mensagem."""
    try:
        client = get_text_client()
        title_prompt = f"Crie um título muito curto, com no máximo 4 palavras, para uma conversa que começa com a seguinte pergunta: '{user_message}'"
        title = client.text_generation(title_prompt, max_new_tokens=10).strip()
        return title
    except Exception:
        # Em caso de erro, usa um título genérico
        return user_message[:30] + "..."


# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão com Menu de Conversas) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    """
    Rota principal de chat. Agora lida com conversas novas ou existentes.
    """
    try:
        if 'user_id' not in session:
            session['user_id'] = str(uuid.uuid4())
        user_id = session['user_id']

        data = request.json
        user_message = data.get('message', '')
        conversation_id = data.get('conversation_id') # ID da conversa atual

        if not user_message.strip():
            return jsonify({"error": "Mensagem vazia."}), 400

        history = []
        is_new_conversation = not conversation_id

        if is_new_conversation:
            # É uma conversa nova, cria o histórico inicial
            print("Iniciando nova conversa...")
            conversation_id = str(uuid.uuid4())
            title = generate_title_for_conversation(user_message)
            history = [
                {"role": "system", "content": "Você é a AEMI, uma IA especialista em manutenção industrial, direta e objetiva. Responda apenas a perguntas relacionadas a este domínio. Se o assunto for outro, recuse educadamente."},
            ]
        else:
            # É uma conversa existente, carrega o histórico do DB
            convo_data = db.get((Conversation.conversation_id == conversation_id) & (Conversation.user_id == user_id))
            if convo_data:
                history = convo_data['history']
                title = convo_data['title']
            else:
                return jsonify({"error": "Conversa não encontrada."}), 404

        history.append({"role": "user", "content": user_message})

        client = get_text_client()
        response_generator = client.chat_completion(messages=history, max_tokens=1500, stream=False)
        bot_response = response_generator.choices[0].message.content
        history.append({"role": "assistant", "content": bot_response})

        # Salva a conversa completa no banco de dados
        db.upsert({
            'user_id': user_id,
            'conversation_id': conversation_id,
            'title': title,
            'history': history,
            'timestamp': uuid.uuid4().time # Apenas para ordenação futura
        }, (Conversation.conversation_id == conversation_id))
        
        # Para conversas novas, retorna o ID e o título para o frontend
        return jsonify({"response": bot_response, "conversation_id": conversation_id, "title": title if is_new_conversation else None})

    except Exception as e:
        print(f"ERRO GERAL na rota /chat: {e}")
        return jsonify({"error": "Erro inesperado no servidor."}), 500


@app.route('/conversations', methods=['GET'])
def get_conversations():
    """
    NOVA ROTA: Retorna uma lista de todas as conversas de um usuário.
    """
    if 'user_id' not in session:
        return jsonify([]) # Retorna lista vazia se não houver usuário

    user_id = session['user_id']
    user_conversations = db.search(Conversation.user_id == user_id)
    
    # Retorna apenas o necessário para o menu, para ser mais rápido
    summary_list = [{"id": c['conversation_id'], "title": c['title']} for c in user_conversations]
    
    return jsonify(summary_list)


@app.route('/conversations/<conversation_id>', methods=['GET'])
def get_conversation_history(conversation_id):
    """
    NOVA ROTA: Retorna o histórico completo de uma conversa específica.
    """
    if 'user_id' not in session:
        return jsonify({"error": "Não autorizado."}), 401

    user_id = session['user_id']
    convo_data = db.get((Conversation.conversation_id == conversation_id) & (Conversation.user_id == user_id))

    if convo_data:
        return jsonify({"history": convo_data['history']})
    else:
        return jsonify({"error": "Conversa não encontrada."}), 404


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)

