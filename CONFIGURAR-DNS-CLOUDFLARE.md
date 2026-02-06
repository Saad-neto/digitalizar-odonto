# ☁️ Configurar DNS no Cloudflare - Passo a Passo

## ✅ Confirmação

O domínio `digitalizarmkt.com.br` **está no Cloudflare** ✓

Mas o subdomínio `sites-odonto` ainda **não foi criado**.

---

## 📋 Passo a Passo Detalhado

### 1️⃣ Acessar Cloudflare

1. Abra: https://dash.cloudflare.com
2. Faça login com sua conta
3. Na lista de domínios, clique em: **`digitalizarmkt.com.br`**

---

### 2️⃣ Ir para DNS

Na barra lateral esquerda, clique em:
- **DNS** → **Records**

Você verá uma tabela com os registros DNS existentes.

---

### 3️⃣ Adicionar Novo Registro

Clique no botão azul: **+ Add record**

---

### 4️⃣ Preencher o Formulário

**Preencha assim:**

| Campo | Valor |
|-------|-------|
| **Type** | `A` |
| **Name** | `sites-odonto` |
| **IPv4 address** | `[IP DO SERVIDOR]` |
| **Proxy status** | 🔴 **Clique na nuvem para DESLIGAR** (deve ficar CINZA) |
| **TTL** | `Auto` |

**⚠️ ATENÇÃO NO PROXY STATUS:**
- ❌ **NÃO DEIXE LARANJA** (Proxied)
- ✅ **DEVE FICAR CINZA** (DNS only)

Para desligar, clique na nuvem laranja até ela ficar cinza.

---

### 5️⃣ Descobrir o IP do Servidor

Se você não sabe qual é o IP do servidor Docker, execute no servidor:

```bash
# Descobrir IP público
curl -4 ifconfig.me
```

**Use esse IP no campo "IPv4 address"!**

---

### 6️⃣ Salvar

Clique no botão azul: **Save**

---

### 7️⃣ Aguardar Propagação

⏰ **Tempo de espera:** 1 a 5 minutos (Cloudflare é rápido!)

---

## 🧪 Verificar se Funcionou

### No seu computador (Windows):

**Método 1: CMD**
```cmd
nslookup sites-odonto.digitalizarmkt.com.br
```

**Deve retornar:**
```
Name:    sites-odonto.digitalizarmkt.com.br
Address: [IP DO SEU SERVIDOR]
```

**Método 2: PowerShell**
```powershell
Resolve-DnsName sites-odonto.digitalizarmkt.com.br
```

---

### No servidor Linux:

```bash
dig +short sites-odonto.digitalizarmkt.com.br
```

**Deve retornar:**
```
[IP DO SEU SERVIDOR]
```

---

## ✅ Checklist Visual

Quando terminar, o registro deve aparecer assim na tabela do Cloudflare:

```
Type   Name           Content            Proxy status   TTL
A      sites-odonto   [SEU-IP]          DNS only       Auto
                                        (nuvem cinza)
```

---

## 🚫 Erro Comum

### Proxy Status LIGADO (laranja)

❌ **ERRADO:**
```
A   sites-odonto   [IP]   Proxied (nuvem laranja)   Auto
```

✅ **CORRETO:**
```
A   sites-odonto   [IP]   DNS only (nuvem cinza)   Auto
```

**Por que desligar o proxy?**
- Você está usando Traefik para SSL/TLS
- O proxy do Cloudflare conflita com o Traefik
- Deixe o Traefik gerenciar o SSL

---

## 📞 Exemplo Completo

**Exemplo com IP fictício 192.168.1.100:**

```
Type: A
Name: sites-odonto
IPv4 address: 192.168.1.100
Proxy status: DNS only (nuvem cinza)
TTL: Auto
```

**Resultado:**
```
sites-odonto.digitalizarmkt.com.br → 192.168.1.100
```

---

## 🔄 Depois que Propagar

Quando o `nslookup` retornar o IP correto, execute no servidor:

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Update do serviço
docker service update --force digitalizar-odonto_digitalizar-odonto

# Aguardar Traefik gerar certificado SSL (1-2 minutos)
sleep 120

# Testar
curl -I https://sites-odonto.digitalizarmkt.com.br
```

---

## 📸 Resumo Visual

```
Cloudflare Dashboard
  └── digitalizarmkt.com.br
       └── DNS
            └── Records
                 └── [+ Add record]
                      ├── Type: A
                      ├── Name: sites-odonto
                      ├── IPv4: [SEU-IP]
                      ├── Proxy: DESLIGADO (cinza)
                      └── [Save]
```

---

## ❓ Precisa de Ajuda?

Se não souber o IP do servidor, me avise que eu ajudo a descobrir!

Se já configurou e ainda não funciona, aguarde 5 minutos e teste novamente.

---

**Quando adicionar o DNS, me avise que faço o deploy! 🚀**
