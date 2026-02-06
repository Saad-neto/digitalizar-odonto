FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --omit=dev

# Copiar código fonte
COPY index.js ./

# Expor porta
EXPOSE 3001

# Rodar servidor
CMD ["node", "index.js"]
