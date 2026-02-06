#!/bin/bash

# =============================================
# DEPLOY AUTOMATIZADO - DOCKER SWARM
# Sites Odonto - Digitalizar
# =============================================

set -e

echo "🚀 Iniciando deploy no Docker Swarm..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navegar para o diretório do projeto
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

echo -e "${BLUE}📦 Passo 1: Build da aplicação...${NC}"
npm run build

echo -e "${BLUE}🐳 Passo 2: Build da imagem Docker...${NC}"
docker build -t digitalizar-odonto:latest .

echo -e "${BLUE}📋 Passo 3: Verificando serviço existente...${NC}"
if docker service ls | grep -q digitalizar-odonto_digitalizar-odonto; then
    echo -e "${YELLOW}   Serviço encontrado. Fazendo update...${NC}"
    docker service update \
        --image digitalizar-odonto:latest \
        --force \
        digitalizar-odonto_digitalizar-odonto
else
    echo -e "${YELLOW}   Serviço não encontrado. Fazendo deploy inicial...${NC}"
    docker stack deploy -c docker-compose.yml digitalizar-odonto
fi

echo -e "${BLUE}⏳ Passo 4: Aguardando serviço convergir...${NC}"
sleep 5

echo -e "${BLUE}📊 Passo 5: Status do serviço${NC}"
docker service ps digitalizar-odonto_digitalizar-odonto --no-trunc

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "🌐 Acesse: https://sites-odonto.digitalizar.space"
echo ""
echo "📝 Para verificar logs:"
echo "   docker service logs digitalizar-odonto_digitalizar-odonto -f"
echo ""
