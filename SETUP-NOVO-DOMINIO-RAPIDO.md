# ⚡ Setup Rápido - Novo Domínio

## 🎯 Objetivo

Adicionar `sites-odonto.digitalizarmkt.com.br` como domínio principal, mantendo o antigo funcionando.

---

## 📋 Checklist Rápido

### 1️⃣ Configurar DNS (FAÇA PRIMEIRO)

No painel DNS do seu provedor:

```
Tipo: A
Nome: sites-odonto
Valor: [IP DO SEU SERVIDOR]
TTL: 3600
```

**⏰ Aguarde propagação:** 5 min a 24 horas

---

### 2️⃣ Verificar DNS

```bash
# Deve retornar o IP do servidor
dig sites-odonto.digitalizarmkt.com.br
```

---

### 3️⃣ Deploy (já configurado)

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Update do serviço
docker service update --force digitalizar-odonto_digitalizar-odonto
```

---

### 4️⃣ Testar

Após 1-2 minutos:

```bash
# Teste novo domínio
curl -I https://sites-odonto.digitalizarmkt.com.br

# Teste domínio antigo (deve continuar funcionando)
curl -I https://sites-odonto.digitalizar.space
```

**Abra no navegador:**
- ✅ https://sites-odonto.digitalizarmkt.com.br (NOVO)
- ✅ https://sites-odonto.digitalizar.space (ANTIGO)

---

## ✅ O que já está configurado

- ✅ `docker-compose.yml` atualizado
- ✅ Traefik aceita ambos os domínios
- ✅ SSL automático via Let's Encrypt
- ✅ Redirect HTTP → HTTPS

---

## 🚨 Importante

**Faça nesta ordem:**
1. Configure o DNS PRIMEIRO
2. Aguarde propagação
3. Depois faça o deploy

**Se fizer deploy antes do DNS propagar, o certificado SSL pode falhar!**

---

## 🔍 Verificar Status

```bash
# Ver logs do Traefik (geração de certificado)
docker service logs traefik_traefik -f | grep sites-odonto

# Status do serviço
docker service ps digitalizar-odonto_digitalizar-odonto
```

---

**Pronto! Ambos os domínios funcionarão.** 🎉
