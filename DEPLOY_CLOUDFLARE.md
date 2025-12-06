# 🚀 Deploy no Cloudflare Pages - Guia Rápido

## ✅ PRÉ-REQUISITOS CONCLUÍDOS

- ✅ Código adaptado para Cloudflare Workers
- ✅ Push para GitHub completo
- ✅ Supabase configurado
- ✅ Stripe (modo teste) pronto

---

## 📋 PASSO A PASSO - DEPLOY

### 1. ACESSAR CLOUDFLARE PAGES

1. Acesse: **https://dash.cloudflare.com/**
2. Login com sua conta
3. No menu lateral esquerdo, clique em **"Workers & Pages"**
4. Clique no botão **"Create application"**
5. Selecione a aba **"Pages"**
6. Clique em **"Connect to Git"**

---

### 2. CONECTAR GITHUB

1. Clique em **"Connect GitHub"**
2. Autorize o Cloudflare a acessar seus repositórios
3. Selecione o repositório: **`digitalizar-odonto`**
4. Clique em **"Begin setup"**

---

### 3. CONFIGURAR BUILD

Na tela de configuração, preencha:

**Project name:**
```
digitalizar-odonto
```
(ou escolha outro nome)

**Production branch:**
```
main
```

**Framework preset:**
```
Vite
```
(Cloudflare deve detectar automaticamente)

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

---

### 4. CONFIGURAR VARIÁVEIS DE AMBIENTE

**MUITO IMPORTANTE!** Role para baixo até a seção **"Environment variables"**

Clique em **"Add variable"** e adicione UMA POR UMA:

#### Variável 1:
```
Nome: VITE_SUPABASE_URL
Valor: https://hkvybshytzgzcrbqngdh.supabase.co
```

#### Variável 2:
```
Nome: VITE_SUPABASE_ANON_KEY
Valor: [COPIE DO SEU ARQUIVO .env]
```

#### Variável 3:
```
Nome: VITE_STRIPE_PUBLIC_KEY
Valor: [SUA CHAVE pk_test_...]
```

#### Variável 4:
```
Nome: STRIPE_SECRET_KEY
Valor: [SUA CHAVE sk_test_...]
```

#### Variável 5:
```
Nome: VITE_PRICE_TOTAL
Valor: 49700
```

#### Variável 6:
```
Nome: VITE_PRICE_ENTRADA
Valor: 24850
```

#### Variável 7:
```
Nome: VITE_PRICE_SALDO
Valor: 24850
```

#### Variável 8 (OPCIONAL):
```
Nome: VITE_N8N_WEBHOOK_URL
Valor: https://n8n.isaai.online/webhook/odonto_form
```

**Nota:** STRIPE_WEBHOOK_SECRET não precisa adicionar agora (configuramos depois)

---

### 5. FAZER O DEPLOY!

1. Após adicionar todas as variáveis, clique em **"Save and Deploy"**

2. Cloudflare vai:
   - ✅ Clonar o repositório
   - ✅ Instalar dependências (2-3 minutos)
   - ✅ Buildar o projeto
   - ✅ Fazer deploy dos Workers
   - ✅ Publicar o site

3. Você verá logs em tempo real

4. Quando terminar:
   ```
   ✅ Success! Deployed to https://digitalizar-odonto.pages.dev
   ```

---

### 6. CONFIGURAR WEBHOOK DO STRIPE

**IMPORTANTE:** Stripe precisa saber onde enviar notificações.

1. Copie a URL do seu site Cloudflare (ex: `https://digitalizar-odonto.pages.dev`)

2. Acesse: **https://dashboard.stripe.com/test/webhooks**

3. Clique em **"Add endpoint"**

4. Configure:
   ```
   Endpoint URL: https://SEU-SITE.pages.dev/api/stripe-webhook

   Description: Webhook pagamentos Digitalizar Odonto

   Events to send:
   ✓ checkout.session.completed
   ✓ payment_intent.succeeded
   ✓ payment_intent.payment_failed
   ```

5. Clique em **"Add endpoint"**

6. Stripe gera um **Signing secret** (começa com `whsec_...`)

7. **COPIE ESSE SECRET!**

8. Volte ao Cloudflare Pages:
   - **Workers & Pages** → Seu projeto
   - Aba **"Settings"** → **"Environment variables"**
   - Clique **"Add variable"**
   - Nome: `STRIPE_WEBHOOK_SECRET`
   - Valor: Cole o secret do Stripe
   - Clique **"Save"**

9. Faça **redeploy**:
   - Aba **"Deployments"**
   - Clique nos 3 pontinhos do último deployment
   - **"Retry deployment"**

✅ **WEBHOOK CONFIGURADO!**

---

## 🧪 TESTAR O FLUXO COMPLETO

1. Acesse: `https://SEU-SITE.pages.dev`

2. Clique em **"Fazer Briefing"**

3. Preencha as 8 seções

4. Clique em **"Finalizar"**

5. Deve:
   - ✅ Salvar no Supabase
   - ✅ Redirecionar para `/pagamento`
   - ✅ Mostrar "R$ 248,50"

6. Clique em **"Pagar com Cartão"**

7. Deve abrir **Stripe Checkout**

8. Use cartão de teste:
   ```
   Número: 4242 4242 4242 4242
   Data: 12/25 (qualquer futura)
   CVC: 123
   Nome: Teste
   ```

9. Deve:
   - ✅ Processar pagamento
   - ✅ Webhook atualiza Supabase
   - ✅ Redirecionar para `/obrigado`

10. Verificar no Supabase:
    - **Table Editor** → `leads` → Status: **"pago_50"**
    - **Table Editor** → `payments` → Status: **"succeeded"**

---

## 🎉 PRONTO!

Seu sistema está completo no Cloudflare Pages:
- ✅ Briefing funciona
- ✅ Salva no Supabase
- ✅ Pagamento via Stripe
- ✅ Webhook atualiza status
- ✅ Site no ar (Cloudflare)

---

## 🌐 DOMÍNIO PERSONALIZADO (OPCIONAL)

Para usar `odonto.digitalizarmkt.com.br`:

1. No Cloudflare Pages, vá em **"Custom domains"**
2. Clique **"Set up a custom domain"**
3. Digite: `odonto.digitalizarmkt.com.br`
4. Cloudflare vai mostrar os registros DNS necessários
5. Adicione na Hostinger:
   - Tipo: CNAME
   - Name: odonto
   - Target: digitalizar-odonto.pages.dev
6. Aguarde propagação (5-30 minutos)
7. ✅ Site em `https://odonto.digitalizarmkt.com.br`

---

## 🐛 TROUBLESHOOTING

### Erro: "Failed to build"
- Verifique se todas as variáveis de ambiente foram adicionadas
- Veja os logs de build

### Erro: "Worker failed"
- Confira se STRIPE_SECRET_KEY está correta
- Veja logs do Worker em "Real-time Logs"

### Webhook não funciona
- Verifique se STRIPE_WEBHOOK_SECRET está configurado
- Teste o webhook no Stripe Dashboard
- Veja logs do Worker stripe-webhook

### Pagamento não atualiza Supabase
- Verifique credenciais Supabase
- Veja logs do webhook
- Confira tabelas no Supabase

---

## 💡 VANTAGENS DO CLOUDFLARE PAGES

- ✅ **500k requests/mês** grátis (4x mais que Netlify!)
- ✅ **Bandwidth ilimitado** grátis
- ✅ **Performance superior** (CDN global)
- ✅ **DDoS protection** incluso
- ✅ **Mais barato** no longo prazo

---

**Tudo pronto! Agora é só testar! 🚀**
