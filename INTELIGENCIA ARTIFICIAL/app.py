# app.py - Versão com o TERCEIRO endpoint da API gratuita

import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- ATUALIZAÇÃO DA API GRATUITA ---
# Trocamos a URL 'api.liaobots.com' que também estava fora do ar.
# Terceira tentativa com um novo provedor.
FREE_API_URL = "https://api.get-req.com/v1/chat/completions"

@app.route('/')
def index():
    return "Servidor da AEMI (versão API gratuita - v3) está no ar."

# ... o resto do código permanece exatamente o mesmo ...
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida do usuário."}), 400

    payload = {
        "model": "gpt-3.5-turbo",
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

    headers = { "Content-Type": "application/json" }

    try:
        response = requests.post(FREE_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        api_data = response.json()
        bot_response = api_data['choices'][0]['message']['content']
        return jsonify({"response": bot_response})

    except requests.exceptions.RequestException as e:
        print(f"ERRO ao chamar a API gratuita: {e}")
        return jsonify({"error": f"Não foi possível conectar à API de IA. O serviço pode estar temporariamente fora do ar. Detalhes: {e}"}), 500
    except (KeyError, IndexError) as e:
        print(f"ERRO ao processar a resposta da API: {e}")
        return jsonify({"error": "A resposta da API de IA veio em um formato inesperado e não pôde ser lida."}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
