# 🚀 Deploy no Cloudflare Pages - Mercado Pago

## ✅ Alterações Implementadas (Dezembro 2024)

- ✅ Migração do **Stripe** para **Mercado Pago**
- ✅ Código atualizado em `Payment.tsx`
- ✅ Biblioteca `mercadopago.ts` implementada
- ✅ Dependências do Stripe removidas
- ✅ Push para GitHub concluído

---

## 📋 CHECKLIST DE DEPLOY

### 1. ✅ Variáveis de Ambiente Configuradas

Acesse: **Cloudflare Dashboard** → **Workers & Pages** → Seu projeto → **Settings** → **Environment variables**

**Variáveis Obrigatórias:**

```
✅ VITE_SUPABASE_URL
   https://hkvybshytzgzcrbqngdh.supabase.co

✅ VITE_SUPABASE_ANON_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✅ VITE_MERCADOPAGO_ACCESS_TOKEN
   APP_USR-697737809529351-120917-4e1d1109201b69bc293daebaf32ed94d-3053019637

✅ VITE_PRICE_TOTAL
   49700

✅ VITE_PRICE_ENTRADA
   24850

✅ VITE_PRICE_SALDO
   24850

✅ NPM_FLAGS
   --legacy-peer-deps
```

**Variáveis Antigas do Stripe (podem permanecer ou remover):**
```
⚠️ VITE_STRIPE_PUBLIC_KEY (não usado mais)
⚠️ STRIPE_SECRET_KEY (não usado mais)
⚠️ STRIPE_WEBHOOK_SECRET (não usado mais)
```

---

### 2. 🔄 Status do Deploy

O Cloudflare Pages faz **build automático** a cada push no GitHub.

**Para verificar o status:**
1. Acesse: **Workers & Pages** → Seu projeto
2. Clique na aba **"Deployments"**
3. Veja o último deployment:
   - 🟢 **Success** = Deploy funcionando
   - 🟡 **Building** = Em progresso (aguarde 2-5 min)
   - 🔴 **Failed** = Erro (clique para ver logs)

**Último push:**
- Commit: `feat: migrar página de pagamento do Stripe para Mercado Pago`
- Status: Aguardando build automático

---

### 3. 🧪 Como Testar o Fluxo Completo

#### A) Testar Briefing
1. Acesse: `https://digitalizar-odonto.pages.dev`
2. Clique em **"Fazer Briefing"**
3. Preencha as 8 seções
4. Clique em **"Finalizar"**
5. ✅ Deve salvar no Supabase
6. ✅ Deve redirecionar para `/pagamento?leadId=xxx`

#### B) Testar Pagamento
1. Na página de pagamento, verifique:
   - ✅ Mostra "R$ 248,50"
   - ✅ Mostra "até 12x de R$ 20,71"
   - ✅ Mostra "Pagamento 100% seguro via Mercado Pago"
2. Clique em **"Pagar com Cartão"**
3. ✅ Deve redirecionar para checkout do Mercado Pago
4. Use **cartão de teste** (se estiver em modo teste):
   ```
   Número: 5031 4332 1540 6351
   Validade: 11/25
   CVV: 123
   Nome: APRO (para aprovação)
   ```
5. ✅ Após pagar, deve redirecionar para `/obrigado`

#### C) Verificar no Supabase
1. Acesse: **Supabase** → **Table Editor** → `leads`
2. Encontre o lead criado
3. Verifique:
   - ✅ Campo `mercadopago_preference_id` preenchido
   - ✅ Campo `mercadopago_payment_url` preenchido
   - ✅ Status atualizado após pagamento

---

## 🐛 TROUBLESHOOTING

### Erro: "Mercado Pago não está configurado"
**Causa:** Variável `VITE_MERCADOPAGO_ACCESS_TOKEN` não está no Cloudflare

**Solução:**
1. Vá em **Settings** → **Environment variables**
2. Adicione a variável com o token de acesso
3. Clique em **"Save"**
4. Force redeploy: **Deployments** → 3 pontinhos → **"Retry deployment"**

---

### Erro: "Failed to build" no Cloudflare
**Causa:** Alguma dependência faltando ou erro de compilação

**Solução:**
1. Clique no deployment com erro
2. Veja os logs de build
3. Procure por:
   - `Module not found` → falta dependência
   - `Type error` → erro TypeScript
4. Se necessário, rode localmente:
   ```bash
   npm install
   npm run build
   ```

---

### Erro: CORS ao criar pagamento
**Causa:** API do Mercado Pago bloqueando requisições do frontend

**Solução:**
O código atual já faz a requisição corretamente usando `fetch` com headers adequados.
Se persistir, pode ser necessário:
1. Verificar se o token de acesso está correto
2. Confirmar se o token não expirou
3. Gerar um novo token no painel do Mercado Pago

---

### Pagamento criado, mas não redireciona
**Causa:** URL de retorno não está configurada corretamente

**Solução:**
Verifique no `src/lib/mercadopago.ts` linha 75-78:
```typescript
back_urls: {
  success: `${window.location.origin}/obrigado`,
  failure: `${window.location.origin}/pagamento-erro`,
  pending: `${window.location.origin}/pagamento-pendente`,
}
```

---

## 🔐 Segurança

### Tokens em Produção vs Teste

**Atualmente:** Usando tokens de TESTE
```
VITE_MERCADOPAGO_ACCESS_TOKEN = APP_USR-697737809529351-...
```

**Para Produção:**
1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá na aba **"Credenciais de produção"**
3. Copie o novo **Access Token**
4. Atualize no Cloudflare Pages
5. Force redeploy

⚠️ **NUNCA** commite tokens de produção no Git!

---

## 📊 Webhook do Mercado Pago (Futuro)

Atualmente, o código tem a URL de webhook configurada:
```typescript
notification_url: `${window.location.origin}/.netlify/functions/mercadopago-webhook`
```

**Para implementar:**
1. Criar função serverless no Cloudflare Workers
2. Configurar no painel do Mercado Pago
3. Atualizar status do lead automaticamente após pagamento

**Arquivo necessário:** `functions/api/mercadopago-webhook.ts` (não implementado ainda)

---

## ✅ DEPLOY COMPLETO - CHECKLIST FINAL

Antes de considerar o deploy completo, verifique:

- [ ] Build do Cloudflare passou sem erros
- [ ] Site abre em `https://digitalizar-odonto.pages.dev`
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Briefing salva no Supabase
- [ ] Página de pagamento abre corretamente
- [ ] Mostra "Mercado Pago" (não "Stripe")
- [ ] Botão "Pagar" redireciona para Mercado Pago
- [ ] Teste de pagamento funciona (modo teste)
- [ ] Campos `mercadopago_*` salvos no Supabase

---

## 🎉 PRÓXIMOS PASSOS

1. **Testar pagamento real** (com cartão de teste)
2. **Implementar webhook** para atualização automática de status
3. **Configurar tokens de produção** quando for lançar
4. **Adicionar domínio customizado** (ex: odonto.digitalizarmkt.com.br)
5. **Monitorar logs** no Cloudflare para identificar erros

---

## 📞 Suporte

Se tiver problemas:
1. Verifique logs do Cloudflare Pages
2. Verifique console do navegador (F12)
3. Verifique tabela `leads` no Supabase
4. Teste localmente com `npm run dev`

**Última atualização:** 10/12/2024
**Status:** ✅ Migração para Mercado Pago completa
