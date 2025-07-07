# app.py - Versão Corrigida para MySQL com SQLAlchemy

import os
import json
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from huggingface_hub import InferenceClient
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "uma_chave_secreta_muito_segura_e_diferente")

# --- CONFIGURAÇÃO DO BANCO DE DADOS (A PARTE MAIS IMPORTANTE) ---

# 1. Pega a URL do banco de dados que o Render injeta automaticamente
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("A variável de ambiente DATABASE_URL não foi encontrada. Verifique se o banco de dados está linkado ao serviço no Render.")

# O PyMySQL não é o padrão para o SQLAlchemy, então ajustamos a URL
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

try:
    # 2. Cria o "engine" do SQLAlchemy com a CORREÇÃO do timeout
    engine = create_engine(
        DATABASE_URL,
        pool_recycle=3600,  # Recicla conexões a cada hora para evitar o "MySQL has gone away"
        pool_pre_ping=True  # Verifica se a conexão está viva antes de usar
    )

    # 3. Define a estrutura da nossa tabela de conversas
    Base = declarative_base()
    class Conversation(Base):
        __tablename__ = 'conversations'
        id = Column(Integer, primary_key=True)
        user_id = Column(String(36), unique=True, nullable=False)
        history = Column(Text, nullable=False) # Armazena o histórico como um texto JSON

    # 4. Cria a tabela no banco de dados, se ela não existir
    Base.metadata.create_all(engine)

    # 5. Cria a sessão para interagir com o banco de dados
    Session = sessionmaker(bind=engine)
    db_session = Session()

except OperationalError as e:
    # Captura erros de conexão na inicialização para facilitar o debug
    raise RuntimeError(f"Não foi possível conectar ao banco de dados MySQL. Verifique a DATABASE_URL. Erro: {e}")


# --- FUNÇÕES DE PROCESSAMENTO DA IA ---
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")

def get_text_client():
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    return InferenceClient(model="meta-llama/Meta-Llama-3-70B-Instruct", token=HUGGING_FACE_TOKEN)

def process_text_with_history(messages):
    client = get_text_client()
    response_generator = client.chat_completion(
        messages=messages,
        max_tokens=1500,
        stream=False
    )
    return response_generator.choices[0].message.content


# --- ROTAS DA API (Adaptadas para SQLAlchemy) ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão com MySQL) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    db_session = Session() # Pega uma nova sessão do pool
    try:
        if 'user_id' not in session:
            # Usando a sessão do Flask para gerar um ID único para o navegador do usuário
            session.permanent = True 
            session['user_id'] = os.urandom(16).hex()
            print(f"Novo usuário conectado. ID: {session['user_id']}")

        user_id = session['user_id']
        
        # Procura o histórico de conversa deste usuário no banco de dados
        user_data = db_session.query(Conversation).filter_by(user_id=user_id).first()
        
        if user_data:
            current_history = json.loads(user_data.history) # Converte o texto JSON de volta para lista
        else:
            print(f"Criando novo histórico para o usuário {user_id}")
            current_history = [
                {"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda apenas a perguntas relacionadas a este domínio. Se a pergunta não for sobre manutenção industrial, diga que você só pode ajudar com tópicos relacionados à manutenção industrial."}
            ]

        user_message = request.form.get('message', '')
        if not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem enviada."}), 400

        current_history.append({"role": "user", "content": user_message})
        print(f"Processando mensagem para o usuário {user_id}...")
        
        bot_response = process_text_with_history(current_history)
        current_history.append({"role": "assistant", "content": bot_response})

        # Limpeza do histórico
        if len(current_history) > 20: 
            system_prompt = current_history[0]
            recent_history = current_history[-19:]
            current_history = [system_prompt] + recent_history
        
        # Salva (ou atualiza) o registro no banco de dados
        history_json = json.dumps(current_history) # Converte a lista para texto JSON
        if user_data:
            user_data.history = history_json
        else:
            new_user_data = Conversation(user_id=user_id, history=history_json)
            db_session.add(new_user_data)
        
        db_session.commit()
        print(f"Histórico do usuário {user_id} salvo no banco de dados MySQL.")

        return jsonify({"response": bot_response})

    except Exception as e:
        db_session.rollback() # Desfaz qualquer mudança no banco em caso de erro
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500
    finally:
        db_session.close() # Libera a conexão de volta para o pool

@app.route('/clear-session', methods=['POST'])
def clear_chat_history():
    db_session = Session()
    try:
        if 'user_id' in session:
            user_id = session['user_id']
            # Remove o registro do usuário do banco de dados
            user_to_delete = db_session.query(Conversation).filter_by(user_id=user_id).first()
            if user_to_delete:
                db_session.delete(user_to_delete)
                db_session.commit()
                print(f"Histórico do usuário {user_id} removido do banco de dados.")
                return jsonify({"status": "success", "message": "Histórico limpo."})
            else:
                return jsonify({"status": "not_found", "message": "Nenhum histórico para limpar."})
        
        return jsonify({"status": "no_session", "message": "Nenhuma sessão ativa para limpar."})
    except Exception as e:
        db_session.rollback()
        print(f"ERRO ao limpar sessão: {e}")
        return jsonify({"error": "Erro ao limpar histórico."}), 500
    finally:
        db_session.close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
