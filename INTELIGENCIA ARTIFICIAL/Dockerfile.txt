# Dockerfile - Versão Otimizada para Multimodalidade

# Usamos uma imagem "bullseye" que tem mais dependências de sistema pré-instaladas
FROM python:3.10-bullseye

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências primeiro
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto do código do projeto
COPY . .

# Expõe a porta que o app vai usar
EXPOSE 10000

# Comando para iniciar o servidor de produção
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "--workers", "1", "--timeout", "120", "app:app"]
