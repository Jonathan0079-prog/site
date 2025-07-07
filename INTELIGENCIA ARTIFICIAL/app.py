# app.py - Versão atualizada para usar uma API pública gratuita no Render

import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Inicializa o aplicativo Flask
app = Flask(__name__)
# Permite que o seu site no GitHub se comunique com este servidor no Render
CORS(app)

# --- CONFIGURAÇÃO DA API GRATUITA ---
# URL do endpoint da API gratuita, escolhida da lista.
# AVISO: Este endpoint pode se tornar instável ou mudar.
# Se parar de funcionar, será necessário encontrar um novo na lista 'free-ai-apis' e atualizar esta linha.
FREE_API_URL = "https://api.vcfun.com/v1/chat/completions"

# --- ROTA DE VERIFICAÇÃO (PARA SABER SE O SERVIDOR ESTÁ NO AR) ---
@app.route('/')
def index():
    return "Servidor da AEMI (versão API gratuita) está no ar."

# --- ROTA PRINCIPAL DO CHAT ---
@app.route('/chat', methods=['POST'])
def chat():
    # Pega a mensagem do usuário que veio do front-end
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    # Monta o corpo da requisição (payload) no formato que a API espera (padrão OpenAI)
    payload = {
        "model": "gpt-3.5-turbo", # O modelo que a API gratuita suporta
        "messages": [
            {
                "role": "system",
                "content": "Você é a AEMI, uma assistente de IA especialista em manutenção industrial e rolamentos, criada por Jonathan da Silva Oliveira para o canal Manutenção Industrial ARQUIVOS."
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        "stream": False
    }

    # Define os cabeçalhos da requisição
    headers = {
        "Content-Type": "application/json"
    }

    try:
        # Envia a requisição para a API gratuita usando a biblioteca 'requests'
        response = requests.post(FREE_API_URL, headers=headers, json=payload, timeout=30) # Timeout de 30s
        
        # Levanta um erro se a resposta da API indicar um problema (ex: erro 404, 500)
        response.raise_for_status()

        # Extrai os dados JSON da resposta
        api_data = response.json()
        
        # Pega o conteúdo da mensagem da IA de dentro da resposta
        bot_response = api_data['choices'][0]['message']['content']

        # Retorna a resposta para o front-end
        return jsonify({"response": bot_response})

    except requests.exceptions.RequestException as e:
        # Captura erros de rede, timeout, etc.
        print(f"ERRO ao chamar a API gratuita: {e}")
        return jsonify({"error": f"Não foi possível conectar à API de IA. O serviço pode estar temporariamente fora do ar. Detalhes: {e}"}), 500
    except (KeyError, IndexError) as e:
        # Captura erros caso a resposta da API venha em um formato inesperado
        print(f"ERRO ao processar a resposta da API: {e}")
        print(f"Resposta recebida que causou o erro: {api_data}")
        return jsonify({"error": "A resposta da API de IA veio em um formato inesperado e não pôde ser lida."}), 500

# --- EXECUÇÃO DO SERVIDOR (GERENCIADO PELO RENDER) ---
if __name__ == '__main__':
    # O Gunicorn (que está no requirements.txt) será usado pelo Render para rodar o app
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
