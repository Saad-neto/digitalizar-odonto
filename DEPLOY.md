# 🚀 Guia de Deploy - Sites Odonto

## 📋 Informações do Ambiente

- **Plataforma**: Docker Swarm + Traefik (Reverse Proxy)
- **Servidor**: VPS - 95.217.158.112
- **Domínios**:
  - sites-odonto.digitalizar.space (principal)
  - clinicanaweb.digitalizarmkt.com.br
  - sites-odonto.digitalizarmkt.com.br
  - odonto.digitalizarmkt.com.br
- **Serviço Docker**: `digitalizar-odonto_digitalizar-odonto`
- **Tempo de Deploy**: ~2-3 minutos

---

## ✅ Método Recomendado: Script Automatizado

### Deploy Completo (Automático)

```bash
# 1. Navegar para o diretório do projeto
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# 2. Atualizar código (opcional, se houver mudanças no Git)
git pull origin main

# 3. Executar script de deploy
./deploy.sh
```

### O que o script faz:

1. ✅ **Build da aplicação** (`npm run build`)
   - Compila React + Vite + TypeScript
   - Gera arquivos otimizados em `dist/`
   - Tempo: ~25 segundos

2. ✅ **Build da imagem Docker**
   - Multi-stage build (Node 20 + Nginx Alpine)
   - Copia build para imagem Nginx
   - Tag: `digitalizar-odonto:latest`

3. ✅ **Update no Docker Swarm**
   - Atualiza serviço com nova imagem
   - Zero-downtime deployment
   - Aguarda convergência (5 segundos)

4. ✅ **Exibe status**
   - Mostra status do serviço
   - Lista últimas réplicas

### Saída esperada:

```
🚀 Iniciando deploy no Docker Swarm...
📦 Passo 1: Build da aplicação...
✓ built in 25s

🐳 Passo 2: Build da imagem Docker...
Successfully tagged digitalizar-odonto:latest

📋 Passo 3: Verificando serviço existente...
   Serviço encontrado. Fazendo update...
verify: Service digitalizar-odonto_digitalizar-odonto converged

⏳ Passo 4: Aguardando serviço convergir...

📊 Passo 5: Status do serviço
ID          NAME                                  IMAGE                     NODE      DESIRED STATE   CURRENT STATE
abc123...   digitalizar-odonto_digitalizar-...   digitalizar-odonto:latest  manager1  Running         Running 10 seconds ago

✅ Deploy concluído com sucesso!

🌐 Acesse: https://sites-odonto.digitalizar.space
```

---

## 🔧 Método Manual (Passo a Passo)

Se preferir fazer deploy manual ou se o script falhar:

### 1. Build da aplicação

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16
npm run build
```

### 2. Build da imagem Docker

```bash
docker build -t digitalizar-odonto:latest .
```

### 3. Update do serviço

**Se o serviço já existe (update):**

```bash
docker service update \
  --image digitalizar-odonto:latest \
  --force \
  digitalizar-odonto_digitalizar-odonto
```

**Se é o primeiro deploy:**

```bash
docker stack deploy -c docker-compose.yml digitalizar-odonto
```

### 4. Verificar status

```bash
docker service ps digitalizar-odonto_digitalizar-odonto
```

---

## 🔍 Verificações e Comandos Úteis

### Verificar se o site está no ar

```bash
# Teste de conectividade
curl -I https://sites-odonto.digitalizar.space

# Deve retornar: HTTP/2 200
```

### Ver logs do serviço

```bash
# Últimas 50 linhas
docker service logs digitalizar-odonto_digitalizar-odonto --tail 50

# Seguir logs em tempo real
docker service logs -f digitalizar-odonto_digitalizar-odonto
```

### Listar serviços ativos

```bash
docker service ls | grep digitalizar
```

### Verificar réplicas

```bash
docker service ps digitalizar-odonto_digitalizar-odonto --no-trunc
```

---

## 🐛 Troubleshooting

### Problema: Site não atualiza após deploy

**Causa**: Cache do navegador ou Docker não atualizou

**Solução**:
```bash
# 1. Limpar cache do navegador (Ctrl + Shift + R / Cmd + Shift + R)

# 2. Forçar rebuild sem cache
docker build --no-cache -t digitalizar-odonto:latest .
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto

# 3. Verificar se a nova imagem está sendo usada
docker service ps digitalizar-odonto_digitalizar-odonto
```

### Problema: Build falha

**Causa**: Erro de compilação ou dependências

**Solução**:
```bash
# 1. Verificar logs do build
npm run build

# 2. Limpar node_modules e reinstalar
rm -rf node_modules dist
npm install
npm run build

# 3. Verificar se .env existe
ls -la .env
```

### Problema: Container não inicia

**Causa**: Erro no Nginx ou configuração inválida

**Solução**:
```bash
# Ver logs de erro
docker service logs digitalizar-odonto_digitalizar-odonto --tail 100

# Ver detalhes do serviço
docker service inspect digitalizar-odonto_digitalizar-odonto

# Verificar se porta 80 está exposta
docker service inspect digitalizar-odonto_digitalizar-odonto | grep -A 5 Ports
```

### Problema: Serviço conflitante (gateway)

**Causa**: Existe um serviço `sites-odonto-gateway_gateway` que pode causar conflito

**Solução**:
```bash
# Verificar se o gateway está ativo
docker service ls | grep gateway

# Desligar o gateway se estiver ativo
docker service scale sites-odonto-gateway_gateway=0
```

### Problema: Mudanças no .env não aparecem

**Causa**: Variáveis `VITE_*` são embutidas no código durante o build

**Solução**:
```bash
# 1. Editar .env com as novas variáveis
nano .env

# 2. Rebuild completo
npm run build
docker build -t digitalizar-odonto:latest .
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

---

## 🔐 Variáveis de Ambiente

As variáveis de ambiente com prefixo `VITE_*` são **embutidas no código JavaScript** durante o build.

**Importante**: Para mudar variáveis de ambiente:

1. Edite o arquivo `.env`
2. Faça novo build: `npm run build`
3. Rebuild Docker: `docker build -t digitalizar-odonto:latest .`
4. Update serviço: `docker service update --force ...`

Variáveis backend (como `STRIPE_SECRET_KEY`) são usadas apenas em Netlify Functions e não afetam o build Docker.

---

## 📊 Arquitetura de Deploy

```
┌─────────────────────────────────────────┐
│  GitHub Repository                      │
│  (código-fonte)                         │
└──────────────┬──────────────────────────┘
               │ git pull
               ▼
┌─────────────────────────────────────────┐
│  VPS: /root/projetos/sites/...          │
│  - npm run build                        │
│  - docker build                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Imagem Docker                          │
│  digitalizar-odonto:latest              │
│  (Nginx + Build React)                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Docker Swarm                           │
│  Service: digitalizar-odonto_...        │
│  Réplicas: 1                            │
│  Porta: 80                              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Traefik (Reverse Proxy)                │
│  - SSL/TLS (Let's Encrypt)              │
│  - Roteamento por domínio               │
│  - HTTPS automático                     │
└──────────────┬──────────────────────────┘
               │ HTTPS (443)
               ▼
┌─────────────────────────────────────────┐
│  Usuários / Internet                    │
│  https://sites-odonto.digitalizar.space │
└─────────────────────────────────────────┘
```

---

## 📝 Checklist de Deploy

### Antes do Deploy
- [ ] Código testado localmente (`npm run dev`)
- [ ] Build local sem erros (`npm run build`)
- [ ] Mudanças commitadas no Git (recomendado)

### Durante o Deploy
- [ ] Executar `./deploy.sh` OU seguir passos manuais
- [ ] Aguardar mensagem "✅ Deploy concluído com sucesso!"
- [ ] Verificar status do serviço

### Após o Deploy
- [ ] Site acessível via HTTPS
- [ ] Limpar cache do navegador (Ctrl + Shift + R)
- [ ] Testar funcionalidade alterada
- [ ] Verificar logs se houver problemas

---

## 🎯 Comandos de Emergência

### Rollback (voltar para versão anterior)

```bash
docker service rollback digitalizar-odonto_digitalizar-odonto
```

### Reiniciar serviço

```bash
docker service update --force digitalizar-odonto_digitalizar-odonto
```

### Remover serviço completamente

```bash
docker stack rm digitalizar-odonto

# Aguardar 10 segundos

# Redeployar
docker stack deploy -c docker-compose.yml digitalizar-odonto
```

---

## 📞 Informações de Contato

- **URL Principal**: https://sites-odonto.digitalizar.space
- **Servidor**: 95.217.158.112
- **Diretório**: `/root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16`

---

## 🔄 Workflow Recomendado

### Para mudanças pequenas (correções de bug, ajustes de texto):

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16
git pull origin main
./deploy.sh
```

### Para mudanças grandes (novas features, refactoring):

1. Testar localmente: `npm run dev`
2. Build local: `npm run build`
3. Verificar `dist/` gerado corretamente
4. Commit no Git
5. Deploy: `./deploy.sh`
6. Testar em produção
7. Monitorar logs por alguns minutos

---

**Última atualização**: 24 de Janeiro de 2025

**Versão da documentação**: 2.0 (consolidada e simplificada)
