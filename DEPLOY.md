# 🚀 Guia de Deploy - Docker Swarm

## ✅ Setup Atual

- **Plataforma**: Docker Swarm + Traefik
- **Domínio**: sites-odonto.digitalizar.space
- **IP VPS**: 95.217.158.112
- **Deploy**: Instantâneo (10 segundos)

---

## 📋 Como Fazer Deploy

### 1️⃣ Fazer Alterações no Código

```bash
# Edite os arquivos em src/
# Ex: src/components/sections/HeroSection.tsx
```

### 2️⃣ Build da Imagem Docker

```bash
cd /root/projetos/sites-odonto/swift-dent-studio-16

# Build (leva ~1-2 minutos)
docker build -t digitalizar-odonto:latest .
```

### 3️⃣ Deploy no Swarm

```bash
# Opção 1: Stack deploy (recomendado)
docker stack deploy -c docker-compose.yml digitalizar-odonto

# Opção 2: Force update (mais rápido)
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

### 4️⃣ Verificar Deploy

```bash
# Ver status do serviço
docker service ls | grep digitalizar

# Ver logs em tempo real
docker service logs -f digitalizar-odonto_digitalizar-odonto

# Testar site
curl -I -k https://sites-odonto.digitalizar.space
```

---

## 🔥 Deploy Rápido (One-liner)

```bash
cd /root/projetos/sites-odonto/swift-dent-studio-16 && \
docker build -t digitalizar-odonto:latest . && \
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

---

## 🛠️ Comandos Úteis

### Verificar Status
```bash
# Listar serviços
docker service ls

# Ver detalhes do serviço
docker service ps digitalizar-odonto_digitalizar-odonto

# Ver logs (últimas 100 linhas)
docker service logs --tail 100 digitalizar-odonto_digitalizar-odonto
```

### Troubleshooting
```bash
# Reiniciar serviço
docker service scale digitalizar-odonto_digitalizar-odonto=0
docker service scale digitalizar-odonto_digitalizar-odonto=1

# Remover e recriar stack
docker stack rm digitalizar-odonto
# Aguarde 30 segundos
docker stack deploy -c docker-compose.yml digitalizar-odonto
```

### Rebuild Completo (sem cache)
```bash
docker build --no-cache -t digitalizar-odonto:latest .
```

---

## 📊 Comparação: Antes vs Agora

| **Cloudflare Pages (ANTES)** | **Docker Swarm (AGORA)** |
|------------------------------|--------------------------|
| ❌ Cache imprevisível         | ✅ Sem cache             |
| ❌ Deploy 5-10 min            | ✅ Deploy 10s            |
| ❌ Build pode falhar          | ✅ Controle total        |
| ❌ Sem logs                   | ✅ Logs em tempo real    |

---

## 🌐 URLs

- **Produção**: https://sites-odonto.digitalizar.space
- **Por IP**: https://95.217.158.112
- **Dev local**: http://localhost:5173 (npm run dev)

---

## 🔐 SSL/TLS

O Traefik gerencia automaticamente certificados Let's Encrypt:
- **Certresolver**: letsencryptresolver
- **Renovação**: Automática
- **Fallback**: Certificado self-signed temporário

Se o certificado SSL não estiver válido:
1. É temporário (self-signed do Traefik)
2. Let's Encrypt está processando
3. Pode levar minutos a horas
4. Será atualizado automaticamente

---

## ⚠️ Notas Importantes

1. **Variáveis de Ambiente**
   - As variáveis `VITE_*` são embarcadas no build
   - Se alterar `.env`, precisa rebuild da imagem
   - `.dockerignore` está configurado para incluir `.env`

2. **Nginx Config**
   - Configuração customizada em `nginx.conf`
   - Cache desabilitado para SPAs
   - Gzip habilitado
   - History fallback configurado

3. **Traefik Labels**
   - Configuradas no `docker-compose.yml`
   - Domínio: sites-odonto.digitalizar.space
   - Fallback: IP 95.217.158.112
   - HTTPS redirect automático

---

## 📞 Suporte

Em caso de dúvidas:
1. Verificar logs do serviço
2. Verificar logs do Traefik: `docker service logs traefik_traefik`
3. Testar build local: `npm run build`
4. Verificar DNS: `dig sites-odonto.digitalizar.space`

---

**Última atualização**: 2025-12-10
**Commit**: 8fae85a
