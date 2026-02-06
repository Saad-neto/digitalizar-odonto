# 🔍 Verificar Configuração DNS no Cloudflare

## ❌ Status Atual

O DNS do subdomínio `sites-odonto.digitalizarmkt.com.br` ainda **não está respondendo**.

Isso pode acontecer por:
1. ⏰ **Propagação em andamento** (aguarde 1-5 minutos)
2. ⚠️ **Configuração incorreta** no Cloudflare
3. 🔴 **Proxy status ligado** (deve estar desligado)

---

## ✅ Checklist de Verificação

Por favor, verifique no Cloudflare se o registro está **exatamente assim**:

### No Cloudflare Dashboard

1. Acesse: https://dash.cloudflare.com
2. Domínio: `digitalizarmkt.com.br`
3. DNS → Records
4. Procure o registro: `sites-odonto`

### ✓ Deve Estar Assim:

| Campo | Valor Correto | Status |
|-------|---------------|--------|
| **Type** | `A` | ✓ |
| **Name** | `sites-odonto` | ✓ |
| **Content (IP)** | `95.217.158.112` | ✓ |
| **Proxy status** | 🟤 **DNS only** (nuvem CINZA) | ⚠️ **IMPORTANTE** |
| **TTL** | `Auto` ou `300` | ✓ |

---

## 🚨 Problemas Comuns

### 1. Proxy Status LIGADO (Laranja)

❌ **ERRADO:**
```
sites-odonto   95.217.158.112   🟠 Proxied   Auto
                                (nuvem laranja)
```

✅ **CORRETO:**
```
sites-odonto   95.217.158.112   🟤 DNS only   Auto
                                (nuvem cinza)
```

**Como corrigir:**
- Clique na nuvem laranja
- Ela deve ficar **cinza**
- Salve novamente

---

### 2. Nome do Registro Errado

❌ **ERRADO:**
- `sites-odonto.digitalizarmkt.com.br` (nome completo)
- `sitesodonto` (sem hífen)
- `sites_odonto` (underscore)

✅ **CORRETO:**
- `sites-odonto` (apenas o subdomínio)

---

### 3. IP Errado

❌ **ERRADO:**
- IP do Cloudflare (104.x.x.x, 172.x.x.x)
- IP local (192.168.x.x, 10.x.x.x)

✅ **CORRETO:**
- `95.217.158.112` (IP público do servidor Docker)

---

## 🧪 Teste Você Mesmo

### No Windows (PowerShell):

```powershell
nslookup sites-odonto.digitalizarmkt.com.br
```

**Resultado esperado:**
```
Name:    sites-odonto.digitalizarmkt.com.br
Address: 95.217.158.112
```

### No Windows (CMD):

```cmd
ping sites-odonto.digitalizarmkt.com.br
```

**Deve mostrar:**
```
Fazendo ping em sites-odonto.digitalizarmkt.com.br [95.217.158.112]
```

---

## 🔄 Se Ainda Não Funcionar

### Opção 1: Aguardar Mais

Às vezes o DNS demora até **5-10 minutos** para propagar.

Aguarde e teste novamente.

---

### Opção 2: Limpar Cache DNS (Windows)

```cmd
ipconfig /flushdns
```

Depois teste novamente.

---

### Opção 3: Verificar no Cloudflare

Verifique se o registro aparece na lista:

```
DNS Records
Type   Name           Content            Proxy status
A      sites-odonto   95.217.158.112    DNS only ✓
```

Se não aparecer, **adicione novamente**.

---

## 📸 Print do Cloudflare

**Deve aparecer assim:**

```
┌──────────────────────────────────────────────────┐
│ DNS Records                                      │
├────────┬──────────────┬────────────────┬─────────┤
│ Type   │ Name         │ Content        │ Proxy   │
├────────┼──────────────┼────────────────┼─────────┤
│ A      │ sites-odonto │ 95.217.158.112 │ DNS only│
│        │              │                │ (cinza) │
└────────┴──────────────┴────────────────┴─────────┘
```

---

## ✅ Quando Funcionar

Quando o `nslookup` retornar o IP correto, me avise que faço o deploy!

Ou execute:

```bash
# No servidor
docker service update --force digitalizar-odonto_digitalizar-odonto
```

---

## 📞 Precisa de Ajuda?

Se verificou tudo e ainda não funciona:

1. Tire um **print** da tela do Cloudflare mostrando o registro DNS
2. Me envie
3. Vou analisar o que pode estar errado

---

**Aguardando confirmação que o registro está correto! 🚀**
