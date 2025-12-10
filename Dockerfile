# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci --ignore-scripts

# Copiar código fonte
COPY . .

# Copiar arquivo .env para build (Vite usa em build-time)
# Nota: As variáveis VITE_* são embarcadas no código JS durante o build
COPY .env .env

# Build da aplicação (Vite vai ler o .env automaticamente)
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copiar build do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
