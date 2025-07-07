# Dockerfile

# Use uma imagem base oficial do Python
FROM python:3.10-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências listadas no requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia todos os outros arquivos do projeto (app.py) para o diretório de trabalho
COPY . .

# Expõe a porta que o Flask vai usar (o Render vai gerenciar isso)
EXPOSE 10000

# O comando para iniciar o aplicativo quando o contêiner for executado
CMD ["python", "app.py"]
