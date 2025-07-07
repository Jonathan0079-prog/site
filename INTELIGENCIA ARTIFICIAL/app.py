# app.py - Versão com Memória Persistente (TinyDB)

import os
import uuid  # Para gerar IDs de usuário únicos
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from huggingface_hub import InferenceClient
from tinydb import TinyDB, Query

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

# Chave secreta para gerenciar sessões do Flask (MUITO IMPORTANTE)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "uma_chave_secreta_muito_segura_e_diferente")

# Pega o token de acesso da Hugging Face
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
# Inicializa o TinyDB. Ele vai criar e gerenciar um arquivo chamado 'conversations_db.json'
db = TinyDB('conversations_db.json')
Conversation = Query()

# --- FUNÇÕES DE PROCESSAMENTO ---

def get_text_client():
    """Cria e retorna um cliente para o modelo de linguagem de texto."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    return InferenceClient(model="meta-llama/Meta-Llama-3-70B-Instruct", token=HUGGING_FACE_TOKEN)

def process_text_with_history(messages):
    """Processa uma conversa usando o modelo de texto, incluindo o histórico."""
    client = get_text_client()
    response_generator = client.chat_completion(
        messages=messages,
        max_tokens=1500,
        stream=False
    )
    return response_generator.choices[0].message.content

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão com Memória Persistente) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # --- NOVO: Gerenciamento de Usuário e Histórico Persistente ---
        # 1. Verifica se o usuário já tem um ID na sessão. Se não, cria um.
        if 'user_id' not in session:
            session['user_id'] = str(uuid.uuid4())
            print(f"Novo usuário conectado. ID: {session['user_id']}")

        user_id = session['user_id']
        
        # 2. Procura o histórico de conversa deste usuário no banco de dados.
        user_data = db.get(Conversation.user_id == user_id)
        
        if user_data:
            # Se encontrou, carrega o histórico
            current_history = user_data['history']
        else:
            # Se não encontrou, é a primeira conversa. Cria o histórico inicial.
            print(f"Criando novo histórico para o usuário {user_id}")
            current_history = [
                {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda apenas a perguntas relacionadas a este domínio. Se a pergunta não for sobre manutenção industrial, diga que você só pode ajudar com tópicos relacionados à manutenção industrial."}
            ]

        # --- Lógica de Chat (praticamente a mesma de antes) ---
        user_message = request.form.get('message', '')
        if not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem enviada."}), 400

        # Adiciona a nova mensagem do usuário ao histórico
        current_history.append({"role": "user", "content": user_message})

        print(f"Processando mensagem para o usuário {user_id}...")
        
        # Chama a IA com o histórico carregado
        bot_response = process_text_with_history(current_history)
        
        # Adiciona a resposta da AEMI ao histórico
        current_history.append({"role": "assistant", "content": bot_response})

        # --- NOVO: Limpeza e Persistência do Histórico no DB ---
        # Limita o tamanho do histórico para evitar custos e lentidão
        if len(current_history) > 20: 
            # Mantém a mensagem de sistema e as 19 mensagens mais recentes
            system_prompt = current_history[0]
            recent_history = current_history[-19:] 
            current_history = [system_prompt] + recent_history
        
        # 3. Salva (ou atualiza) o registro do usuário com a conversa completa no banco de dados.
        # O 'upsert' é perfeito: ele insere se for novo, ou atualiza se já existir.
        db.upsert({'user_id': user_id, 'history': current_history}, Conversation.user_id == user_id)
        print(f"Histórico do usuário {user_id} salvo no banco de dados.")

        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500

@app.route('/clear-session', methods=['POST'])
def clear_chat_history():
    """
    NOVO: Rota para limpar o histórico de um usuário específico no banco de dados.
    """
    if 'user_id' in session:
        user_id = session['user_id']
        # Remove o registro do usuário do banco de dados
        removed_count = db.remove(Conversation.user_id == user_id)
        if removed_count > 0:
            print(f"Histórico do usuário {user_id} removido do banco de dados.")
            # Opcional: remover o user_id da sessão para forçar a criação de um novo na próxima mensagem
            # session.pop('user_id', None)
            return jsonify({"status": "success", "message": "Histórico limpo."})
        else:
            return jsonify({"status": "not_found", "message": "Nenhum histórico para limpar."})
    
    return jsonify({"status": "no_session", "message": "Nenhuma sessão ativa para limpar."})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
