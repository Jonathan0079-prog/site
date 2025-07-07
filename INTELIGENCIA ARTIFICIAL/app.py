# -*- coding: utf-8 -*-

import os
from huggingface_hub import InferenceClient
from flask import Flask, request, render_template_string

# Inicializa a aplicação Flask
app = Flask(__name__)

# --- CONFIGURAÇÃO DE SEGURANÇA E API ---
# Pega o token de acesso da Hugging Face a partir das variáveis de ambiente do sistema.
# Esta é a maneira segura de lidar com segredos.
HF_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

# AVISO IMPORTANTE: O programa irá parar se o token não for encontrado.
# Isso evita erros inesperados e garante que a configuração no Render está correta.
if not HF_TOKEN:
    raise ValueError("Variável de ambiente HUGGING_FACE_TOKEN não encontrada! Por favor, configure-a no seu ambiente de hospedagem (ex: Render).")

# Define o modelo que será utilizado
MODEL_ID = "google/gemma-2b-it"

# Inicializa o cliente da API de Inferência da Hugging Face com o modelo e o token
try:
    client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)
except Exception as e:
    # Captura erros na inicialização do cliente (ex: token inválido)
    raise RuntimeError(f"Falha ao inicializar o cliente da Hugging Face: {e}")


# --- TEMPLATE HTML COM CSS EMBUTIDO ---
# Para simplificar, o HTML e o CSS estão todos em uma única string.
# O CSS segue o tema escuro solicitado.
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerador de Texto com Gemma</title>
    <style>
        :root {
            --bg-color: #2c2f33;
            --primary-color: #7289da;
            --secondary-color: #99aab5;
            --text-color: #ffffff;
            --header-color: #ffffff;
            --container-bg: #23272a;
            --input-bg: #40444b;
            --border-color: #7289da;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            width: 100%;
            max-width: 800px;
            background-color: var(--container-bg);
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        h1 {
            color: var(--header-color);
            text-align: center;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 10px;
            margin-bottom: 25px;
        }
        form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        textarea {
            background-color: var(--input-bg);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 15px;
            font-size: 16px;
            min-height: 120px;
            resize: vertical;
        }
        textarea:focus {
            outline: none;
            box-shadow: 0 0 5px var(--primary-color);
        }
        button {
            background-color: var(--primary-color);
            color: var(--text-color);
            border: none;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #677bc4;
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background-color: var(--input-bg);
            border-left: 5px solid var(--primary-color);
            white-space: pre-wrap; /* Mantém a formatação do texto gerado */
            word-wrap: break-word;
        }
        .prompt-text {
            color: var(--secondary-color);
            font-style: italic;
        }
        .error {
            margin-top: 20px;
            padding: 15px;
            background-color: #e53935;
            color: white;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Gerador de Texto - Gemma 2B IT</h1>
        <form action="/" method="post">
            <label for="prompt">Digite seu comando:</label>
            <textarea id="prompt" name="prompt" required>{{ prompt_text or '' }}</textarea>
            <button type="submit">Gerar Resposta</button>
        </form>

        {% if error %}
            <div class="error">
                <strong>Ocorreu um erro:</strong><br>{{ error }}
            </div>
        {% endif %}
        
        {% if generated_text %}
            <div class="result">
                <p class="prompt-text"><strong>Seu comando:</strong> {{ prompt_text }}</p>
                <hr>
                <p>{{ generated_text }}</p>
            </div>
        {% endif %}
    </div>
</body>
</html>
"""

# --- ROTAS DA APLICAÇÃO ---
@app.route("/", methods=["GET", "POST"])
def home():
    # Inicializa as variáveis para evitar erros no template
    generated_text = ""
    prompt_text = ""
    error_message = ""

    # Se o formulário foi enviado (método POST)
    if request.method == "POST":
        prompt_text = request.form.get("prompt")
        
        if prompt_text:
            try:
                # Realiza a chamada para a API da Hugging Face
                response = client.text_generation(
                    prompt=prompt_text,
                    max_new_tokens=512,  # Define um limite de tokens para a resposta
                    temperature=0.7,
                    top_p=0.95,
                )
                generated_text = response.strip()

            except Exception as e:
                # Captura qualquer erro que a API possa retornar (ex: modelo sobrecarregado, timeout)
                # e exibe uma mensagem amigável para o usuário.
                print(f"Erro na API da Hugging Face: {e}")
                error_message = f"Houve um problema ao se comunicar com a API da Hugging Face. Detalhes: {e}"

    # Renderiza a página HTML, passando as variáveis (texto gerado, prompt original e erros)
    return render_template_string(HTML_TEMPLATE, generated_text=generated_text, prompt_text=prompt_text, error=error_message)

# --- INICIALIZAÇÃO DO SERVIDOR ---
# Este bloco permite que a aplicação seja executada tanto localmente quanto no Render
if __name__ == "__main__":
    # O Render define a variável de ambiente PORT. Usamos 8080 como padrão para teste local.
    port = int(os.environ.get("PORT", 8080))
    # '0.0.0.0' torna o servidor acessível na rede, o que é necessário para o Render.
    app.run(host='0.0.0.0', port=port, debug=False)
