# 🚀 Guia de Deploy - Sites Odonto 24H

## 📋 Informações do Ambiente

- **Plataforma**: Docker Swarm + Traefik (Reverse Proxy)
- **Servidor**: VPS - 95.217.158.112
- **Domínio**: sites-odonto.digitalizar.space
- **Serviço Principal**: `digitalizar-odonto_digitalizar-odonto`
- **Tempo de Deploy**: ~30 segundos

---

## 🔧 Pré-requisitos

- Acesso SSH ao servidor VPS (95.217.158.112)
- Docker Swarm configurado e ativo
- Traefik configurado como reverse proxy
- Repositório clonado no servidor

---

## 📦 Como Fazer Deploy

### 1️⃣ Acesse o Servidor

```bash
ssh root@95.217.158.112
```

### 2️⃣ Navegue até o Diretório do Projeto

```bash
cd /root/projetos/sites-odonto/projeto-principal/swift-dent-studio-16
```

### 3️⃣ Atualize o Código (se necessário)

```bash
# Pull das últimas alterações do Git
git pull origin main
```

### 4️⃣ Build da Imagem Docker

```bash
docker build -t digitalizar-odonto:latest .
```

**Tempo estimado**: 20-30 segundos

**O que acontece**:
- Build multi-stage (Node 20 + Nginx Alpine)
- Instala dependências com `npm ci`
- Executa `npm run build` (compila React + Vite)
- Copia o build para imagem Nginx otimizada
- Copia configuração customizada do Nginx

### 5️⃣ Atualizar Serviço no Swarm

```bash
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

**Tempo estimado**: 10-15 segundos

**O que acontece**:
- Puxa a nova imagem
- Para o container antigo
- Inicia novo container com a imagem atualizada
- Aguarda 5 segundos para verificar estabilidade
- Marca como "converged" (estável)

### 6️⃣ Verificar Deploy

```bash
# Verificar status do serviço
docker service ls | grep digitalizar

# Ver logs em tempo real
docker service logs -f digitalizar-odonto_digitalizar-odonto --tail 50

# Verificar se o site está respondendo
curl -I https://sites-odonto.digitalizar.space
```

---

## ⚡ Deploy Rápido (One-liner)

Para deployar tudo de uma vez:

```bash
cd /root/projetos/sites-odonto/projeto-principal/swift-dent-studio-16 && \
git pull origin main && \
docker build -t digitalizar-odonto:latest . && \
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto && \
docker service logs --tail 20 digitalizar-odonto_digitalizar-odonto
```

---

## 🔍 Verificações Importantes

### ✅ Verificar se o serviço está rodando

```bash
docker service ps digitalizar-odonto_digitalizar-odonto
```

**Saída esperada**:
```
ID            NAME                                  NODE      DESIRED STATE   CURRENT STATE
abc123...     digitalizar-odonto_digitalizar-...   manager1  Running         Running 2 minutes ago
```

### ✅ Verificar se o gateway NÃO está interferindo

**⚠️ IMPORTANTE**: Existe um serviço chamado `sites-odonto-gateway_gateway` que usa o mesmo domínio e pode causar conflito.

```bash
# Verificar se o gateway está desligado
docker service ls | grep sites-odonto-gateway
```

**Saída esperada**:
```
sites-odonto-gateway_gateway   replicated   0/0   ...
```

Se estiver com `1/1`, desligue-o:

```bash
docker service scale sites-odonto-gateway_gateway=0
```

### ✅ Testar site em produção

```bash
# Teste de conectividade
curl -I https://sites-odonto.digitalizar.space

# Verificar se está servindo a aplicação React correta
curl -s https://sites-odonto.digitalizar.space | grep "Sites Odonto 24H"
```

---

## 🛠️ Comandos Úteis

### Logs e Debugging

```bash
# Ver logs em tempo real
docker service logs -f digitalizar-odonto_digitalizar-odonto

# Ver últimas 100 linhas de log
docker service logs --tail 100 digitalizar-odonto_digitalizar-odonto

# Ver logs com timestamps
docker service logs -t digitalizar-odonto_digitalizar-odonto
```

### Gerenciamento de Serviços

```bash
# Listar todos os serviços
docker service ls

# Ver detalhes do serviço
docker service inspect digitalizar-odonto_digitalizar-odonto

# Ver réplicas em execução
docker service ps digitalizar-odonto_digitalizar-odonto

# Escalar serviço (adicionar mais réplicas)
docker service scale digitalizar-odonto_digitalizar-odonto=2
```

### Rebuild Completo (sem cache)

Se houver problemas de cache ou dependências:

```bash
docker build --no-cache -t digitalizar-odonto:latest .
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

### Reiniciar Serviço

```bash
# Método 1: Scale down e up
docker service scale digitalizar-odonto_digitalizar-odonto=0
sleep 5
docker service scale digitalizar-odonto_digitalizar-odonto=1

# Método 2: Force update (recomendado)
docker service update --force digitalizar-odonto_digitalizar-odonto
```

---

## 🐛 Troubleshooting

### Problema: Site não carrega ou mostra página errada

**Causa**: Serviço `sites-odonto-gateway_gateway` está ativo e interceptando requisições

**Solução**:
```bash
docker service scale sites-odonto-gateway_gateway=0
```

### Problema: Deploy falha no build

**Causa**: Erro de compilação ou dependências

**Solução**:
1. Verifique os logs do build
2. Teste localmente: `npm run build`
3. Verifique se o `.env` está presente
4. Tente rebuild sem cache: `docker build --no-cache ...`

### Problema: Container inicia mas morre logo depois

**Causa**: Nginx não consegue iniciar ou configuração inválida

**Solução**:
```bash
# Ver logs de erro
docker service logs digitalizar-odonto_digitalizar-odonto

# Verificar configuração do Nginx
cat nginx.conf

# Testar Nginx localmente
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx:alpine nginx -t
```

### Problema: SSL/HTTPS não funciona

**Causa**: Traefik não gerou certificado Let's Encrypt

**Solução**:
1. Certificado pode demorar minutos/horas para ser emitido
2. Verifique logs do Traefik: `docker service logs traefik_traefik`
3. Verifique DNS: `dig sites-odonto.digitalizar.space`
4. Aguarde - certificado é renovado automaticamente

### Problema: Alterações não aparecem no site

**Causa**: Cache do navegador

**Solução**:
1. Limpe cache do navegador (Ctrl + Shift + R)
2. Teste em navegador anônimo
3. Verifique se o build realmente tem as alterações:
   ```bash
   docker exec <container-id> cat /usr/share/nginx/html/index.html
   ```

---

## 📊 Arquitetura do Deploy

```
[GitHub] → [VPS: /root/projetos/sites-odonto/...]
                    ↓
            [Docker Build]
                    ↓
        [Imagem: digitalizar-odonto:latest]
                    ↓
            [Docker Swarm]
                    ↓
         [Container: Nginx + Build React]
                    ↓
      [Traefik Reverse Proxy]
                    ↓
    [SSL/TLS: Let's Encrypt Auto]
                    ↓
  [sites-odonto.digitalizar.space]
```

---

## 🔐 Configurações de Segurança

### Traefik Labels (docker-compose.yml)

O serviço possui labels Traefik configuradas para:
- ✅ Roteamento por domínio (`sites-odonto.digitalizar.space`)
- ✅ Redirecionamento HTTP → HTTPS automático
- ✅ SSL/TLS via Let's Encrypt
- ✅ Remoção de `www.` do domínio

### Nginx

- ✅ Configuração customizada em `nginx.conf`
- ✅ Gzip compression habilitado
- ✅ Cache desabilitado para SPAs (evita problemas de atualização)
- ✅ History API fallback (todas rotas → index.html)

---

## 🔄 Processo de CI/CD Manual

1. **Desenvolvimento Local**
   ```bash
   npm run dev
   ```

2. **Commit e Push**
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

3. **Deploy no Servidor**
   ```bash
   ssh root@95.217.158.112
   cd /root/projetos/sites-odonto/projeto-principal/swift-dent-studio-16
   git pull origin main
   docker build -t digitalizar-odonto:latest .
   docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
   ```

4. **Verificação**
   - Acesse https://sites-odonto.digitalizar.space
   - Limpe cache (Ctrl + Shift + R)
   - Teste a funcionalidade

---

## ⚙️ Variáveis de Ambiente

As variáveis `VITE_*` são **embarcadas no build** (hardcoded no JavaScript compilado).

Se alterar variáveis de ambiente:
1. Edite o arquivo `.env`
2. Rebuild a imagem Docker (`docker build`)
3. Update o serviço

**⚠️ Importante**: Variáveis de ambiente não podem ser alteradas sem rebuild!

---

## 📞 Contato e Suporte

Em caso de problemas:

1. ✅ Verifique os logs do serviço
2. ✅ Verifique se o gateway está desligado
3. ✅ Teste build local
4. ✅ Verifique status do Traefik
5. ✅ Contate o administrador do servidor

---

## 📝 Changelog

### 2024-12-23
- ✅ Atualização da documentação de deploy
- ✅ Correção de conflito com serviço gateway
- ✅ Remoção da questão "tipo de negócio" do briefing

### 2024-12-10
- ✅ Configuração inicial Docker Swarm
- ✅ Migração do Cloudflare Pages para VPS
- ✅ Configuração Traefik + Let's Encrypt

---

**Última atualização**: 23 de Dezembro de 2024
