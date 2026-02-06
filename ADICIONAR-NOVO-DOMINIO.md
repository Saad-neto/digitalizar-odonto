# 🌐 Configuração de Múltiplos Domínios

## ✅ Domínios Configurados

O site agora responde em **dois domínios**:

1. **Domínio principal (novo):** `sites-odonto.digitalizarmkt.com.br`
2. **Domínio secundário (antigo):** `sites-odonto.digitalizar.space`

Ambos funcionam simultaneamente com SSL/HTTPS automático via Let's Encrypt.

---

## 📋 Passo a Passo para Ativar

### PASSO 1: Configurar DNS do Novo Domínio

Você precisa apontar o domínio `sites-odonto.digitalizarmkt.com.br` para o servidor onde o Docker Swarm está rodando.

**No painel DNS do seu provedor (Registro.br, Cloudflare, etc.):**

#### Opção 1: Registro A (Recomendado)

```
Tipo: A
Nome: sites-odonto
Valor: [IP-DO-SEU-SERVIDOR]
TTL: 3600 (1 hora)
```

**Exemplo:**
```
A    sites-odonto    192.168.1.100
```

#### Opção 2: Registro CNAME (se já tem outro domínio apontado)

```
Tipo: CNAME
Nome: sites-odonto
Valor: sites-odonto.digitalizar.space
TTL: 3600
```

**⚠️ IMPORTANTE:** Aguarde a propagação do DNS (pode levar de 5 minutos a 24 horas).

---

### PASSO 2: Verificar Propagação do DNS

Antes de fazer o deploy, verifique se o DNS já está apontando:

```bash
# Verificar DNS
dig sites-odonto.digitalizarmkt.com.br

# Ou usando nslookup
nslookup sites-odonto.digitalizarmkt.com.br

# Ou ping
ping sites-odonto.digitalizarmkt.com.br
```

**Deve retornar o IP do seu servidor!**

---

### PASSO 3: Fazer Deploy com Novo Domínio

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Update do serviço com novas configurações
docker service update \
  --force \
  digitalizar-odonto_digitalizar-odonto

# Ou recriar o stack
docker stack rm digitalizar-odonto
sleep 10
docker stack deploy -c docker-compose.yml digitalizar-odonto
```

---

### PASSO 4: Verificar Certificado SSL

O Traefik vai **automaticamente**:
1. Detectar o novo domínio
2. Solicitar certificado SSL do Let's Encrypt
3. Configurar HTTPS

**Acompanhar geração do certificado:**

```bash
# Ver logs do Traefik
docker service logs traefik_traefik -f | grep -i sites-odonto

# Ver todos os certificados emitidos
docker exec $(docker ps -q -f name=traefik) cat /letsencrypt/acme.json | grep -i sites-odonto
```

---

## 🧪 Testar os Domínios

### 1. Testar Domínio Novo

```bash
# HTTP deve redirecionar para HTTPS
curl -I http://sites-odonto.digitalizarmkt.com.br

# HTTPS deve retornar 200
curl -I https://sites-odonto.digitalizarmkt.com.br
```

### 2. Testar Domínio Antigo

```bash
# Deve continuar funcionando
curl -I https://sites-odonto.digitalizar.space
```

### 3. Abrir no Navegador

- ✅ https://sites-odonto.digitalizarmkt.com.br
- ✅ https://sites-odonto.digitalizar.space

**Ambos devem:**
- ✅ Carregar o site
- ✅ Ter cadeado verde (SSL válido)
- ✅ Redirecionar HTTP → HTTPS automaticamente

---

## 🔍 Como Funciona

### Traefik Configuration

O `docker-compose.yml` foi atualizado com:

```yaml
# Aceita requisições de ambos os domínios
- "traefik.http.routers.digitalizar-odonto.rule=Host(`sites-odonto.digitalizar.space`) || Host(`sites-odonto.digitalizarmkt.com.br`)"
```

**O operador `||` significa "OR"** - aceita qualquer um dos dois domínios.

### Certificados SSL

O Traefik gera **certificados separados** para cada domínio:
- Um certificado para `sites-odonto.digitalizar.space`
- Outro certificado para `sites-odonto.digitalizarmkt.com.br`

Ambos via **Let's Encrypt** (gratuito e renovação automática a cada 90 dias).

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────┐
│  Cliente (Browser)                      │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
   Domínio 1      Domínio 2
sites-odonto.   sites-odonto.
digitalizar     digitalizarmkt
.space          .com.br
        │             │
        └──────┬──────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│  Traefik (Reverse Proxy)                │
│  - Detect Host header                   │
│  - SSL/TLS termination                  │
│  - Redirect HTTP → HTTPS                │
└──────────────┬──────────────────────────┘
               │ HTTP
               ▼
┌─────────────────────────────────────────┐
│  Container: digitalizar-odonto          │
│  - Nginx                                │
│  - Porta 80                             │
└─────────────────────────────────────────┘
```

---

## 🎯 Checklist Completo

### DNS
- [ ] Registro A ou CNAME criado no DNS
- [ ] Propagação do DNS verificada (`dig` ou `nslookup`)
- [ ] Ping responde com IP correto

### Deploy
- [ ] `docker-compose.yml` atualizado com ambos os domínios
- [ ] Deploy/update realizado no Swarm
- [ ] Serviço está `Running`

### SSL/HTTPS
- [ ] Certificado SSL gerado automaticamente (aguarde até 2 minutos)
- [ ] HTTPS funciona no novo domínio
- [ ] HTTP redireciona para HTTPS
- [ ] Cadeado verde aparece no navegador

### Testes
- [ ] Novo domínio acessível: https://sites-odonto.digitalizarmkt.com.br
- [ ] Domínio antigo continua funcionando: https://sites-odonto.digitalizar.space
- [ ] Agendamento funciona em ambos
- [ ] Admin acessível em ambos

---

## 🔧 Troubleshooting

### Problema: "Site não acessível" no novo domínio

**Causa:** DNS ainda não propagou

**Solução:**
```bash
# Verificar DNS
dig sites-odonto.digitalizarmkt.com.br

# Se não retornar o IP correto, aguarde propagação
# Ou force clear do cache DNS local
```

### Problema: "Certificado inválido"

**Causa:** Traefik ainda não gerou o certificado

**Solução:**
```bash
# Ver logs do Traefik
docker service logs traefik_traefik -f

# Aguardar até 2 minutos
# Let's Encrypt pode ter rate limit se você testou muito
```

### Problema: ERR_SSL_VERSION_OR_CIPHER_MISMATCH

**Causa:** Certificado ainda sendo gerado

**Solução:** Aguarde 1-2 minutos e recarregue a página.

### Problema: "Too many certificates already issued"

**Causa:** Rate limit do Let's Encrypt (5 certificados/semana por domínio)

**Solução:**
- Use o ambiente de staging do Let's Encrypt para testes
- Aguarde 1 semana para resetar o rate limit
- Ou use certificado wildcard

---

## 🎨 Opcional: Redirecionar Domínio Antigo para Novo

Se quiser que `sites-odonto.digitalizar.space` **redirecione automaticamente** para `sites-odonto.digitalizarmkt.com.br`:

```yaml
# Adicionar middleware de redirect
- "traefik.http.middlewares.redirect-to-new-domain.redirectregex.regex=^https://sites-odonto\\.digitalizar\\.space/(.*)"
- "traefik.http.middlewares.redirect-to-new-domain.redirectregex.replacement=https://sites-odonto.digitalizarmkt.com.br/$${1}"
- "traefik.http.middlewares.redirect-to-new-domain.redirectregex.permanent=true"
- "traefik.http.routers.digitalizar-odonto.middlewares=redirect-to-new-domain"
```

**⚠️ Não faça isso agora!** Mantenha ambos funcionando primeiro.

---

## 📝 Atualizar Variáveis de Ambiente (Opcional)

Se você tiver URLs hardcoded no código (emails, notificações, etc.), atualize:

```env
# .env
VITE_APP_URL=https://sites-odonto.digitalizarmkt.com.br
```

Depois faça rebuild e deploy:
```bash
npm run build
docker build -t digitalizar-odonto:latest .
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

---

## ✅ Resumo

**O que foi feito:**
- ✅ `docker-compose.yml` atualizado para aceitar 2 domínios
- ✅ Traefik configurado para gerar SSL para ambos
- ✅ Redirect HTTP → HTTPS para ambos

**O que você precisa fazer:**
1. Configurar DNS do novo domínio
2. Aguardar propagação (5min - 24h)
3. Fazer deploy: `docker service update --force digitalizar-odonto_digitalizar-odonto`
4. Testar ambos os domínios

---

**Ambos os domínios funcionarão perfeitamente! 🎉**
