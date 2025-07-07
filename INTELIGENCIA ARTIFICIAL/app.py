# app.py

import os
from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env (bom para teste local)
load_dotenv()

app = Flask(__name__)

# Pega a chave da API da variável de ambiente. 
# Usaremos o nome 'NOVITA_HF_TOKEN' para ser mais específico.
API_KEY = os.getenv("NOVITA_HF_TOKEN")

# Verifica se a chave foi configurada
if not API_KEY:
    raise ValueError("A chave da API 'NOVITA_HF_TOKEN' não foi encontrada nas variáveis de ambiente.")

# Inicializa o cliente da API
# Note que passamos a chave diretamente aqui, em vez de depender da variável global do Hugging Face.
client = InferenceClient(
    provider="novita",
    api_key=API_KEY,
)

@app.route('/chat', methods=['POST'])
def chat():
    # Pega a mensagem do usuário que veio do front-end
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "Nenhuma mensagem recebida."}), 400

    try:
        # Monta a requisição para a API
        completion = client.chat.completions.create(
            # Você pode mudar o modelo aqui se desejar
            model="meta-llama/Llama-3.2-3B-Instruct", 
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            # Parâmetros opcionais para controlar a geração
            max_tokens=500,
            temperature=0.7,
        )

        # Extrai a resposta da IA
        bot_response = completion.choices[0].message.content

        # Retorna a resposta para o front-end
        return jsonify({"response": bot_response})

    except Exception as e:
        # Em caso de erro na API, retorna uma mensagem clara
        print(f"Erro ao chamar a API: {e}")
        return jsonify({"error": "Desculpe, ocorreu um erro ao me comunicar com a IA."}), 500

if __name__ == '__main__':
    # Usa a porta definida pelo Render ou 5000 para teste local
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

