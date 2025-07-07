# app.py - Versão Otimizada para Chat de Texto com Llama 3 70B Instruct (Hugging Face Direto)

import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- CONFIGURAÇÃO INICIAL ---
app = Flask(__name__)
CORS(app)

# Chave secreta para gerenciar sessões do Flask (MUITO IMPORTANTE para produção!)
# Altere isso para uma string longa e aleatória em um ambiente real.
app.secret_key = os.getenv("FLASK_SECRET_KEY", "sua_chave_secreta_muito_segura_e_aleatoria_aqui")

# Pega o token de acesso da Hugging Face
HUGGING_FACE_TOKEN = os.getenv("HF_TOKEN")

# --- FUNÇÕES DE PROCESSAMENTO ---

def get_text_client():
    """Cria e retorna um cliente para o modelo de linguagem de texto (Llama 3 70B Instruct via HF Direto)."""
    if not HUGGING_FACE_TOKEN:
        raise ValueError("Token da Hugging Face (HF_TOKEN) não encontrado.")
    # MODELO ALTERADO AQUI PARA O Llama 3 70B Instruct
    return InferenceClient(model="meta-llama/Meta-Llama-3-70B-Instruct", token=HUGGING_FACE_TOKEN)

def process_text_with_history(messages):
    """
    Processa uma conversa usando o modelo de texto, incluindo o histórico.
    'messages' deve ser uma lista de dicionários no formato [{"role": "user", "content": "..."}]
    ou [{"role": "assistant", "content": "..."}].
    """
    client = get_text_client()
    # Usa o método chat_completion, que é o padrão para modelos instruct na Hugging Face Inference API
    response_generator = client.chat_completion(
        messages=messages, # Passa o histórico completo de mensagens
        max_tokens=1500,
        stream=False
    )
    return response_generator.choices[0].message.content

# --- ROTAS DA API ---

@app.route('/')
def index():
    return "Servidor da AEMI (versão Otimizada para Chat de Texto com Llama 3 70B Instruct) está no ar."

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.form.get('message', '')

        if not user_message.strip():
            return jsonify({"error": "Nenhuma mensagem enviada."}), 400

        bot_response = ""

        # --- Gerenciamento do Histórico de Conversa ---
        if 'conversation_history' not in session:
            session['conversation_history'] = []
            # Adiciona a instrução inicial para o modelo (persona da AEMI)
            session['conversation_history'].append({"role": "system", "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial, direta e objetiva. Responda apenas a perguntas relacionadas a este domínio. Se a pergunta não for sobre manutenção industrial, diga que você só pode ajudar com tópicos relacionados à manutenção industrial."})
            
        current_history = session['conversation_history']

        # Adiciona a nova mensagem do usuário ao histórico
        current_history.append({"role": "user", "content": user_message})

        print("Processando uma mensagem de texto com histórico...")
        
        # Chama a função que processa o texto com o histórico completo
        bot_response = process_text_with_history(current_history)
        
        # Adiciona a resposta da AEMI ao histórico
        current_history.append({"role": "assistant", "content": bot_response})

        # --- Limpeza e Persistência do Histórico ---
        # Limita o tamanho do histórico para evitar estouro de token e uso excessivo de memória.
        # O Llama 3 70B tem uma janela de contexto de 8k tokens. 20 mensagens (10 pares) é um bom ponto de partida.
        # Você pode ajustar o '20' se quiser mais ou menos contexto, mas esteja ciente do impacto no custo/latência.
        if len(current_history) > 20: 
            system_prompt = current_history[0]
            recent_history = current_history[-19:] 
            session['conversation_history'] = [system_prompt] + recent_history
        else:
            session['conversation_history'] = current_history 

        return jsonify({"response": bot_response})

    except Exception as e:
        print(f"ERRO GERAL na rota /chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocorreu um erro inesperado no servidor. Detalhes: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
