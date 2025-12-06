# 🚀 Digitalizar Odonto - Implementação Sistema de Pagamentos

## 📊 Status da Implementação

### ✅ Concluído (FASE 1 - Parte 1)

1. **Configuração Supabase**
   - ✅ Dependências instaladas (`@supabase/supabase-js`)
   - ✅ Arquivo de configuração criado (`src/lib/supabase.ts`)
   - ✅ Script SQL criado (`supabase/setup.sql`)
   - ✅ Funções auxiliares (createLead, getLeadById, updateLeadStatus, etc.)
   - ✅ Arquivo `.env` configurado com credenciais

2. **Página de Pagamento**
   - ✅ Componente criado (`src/pages/Payment.tsx`)
   - ✅ Design simples e direto (Opção A aprovada)
   - ✅ Integração com Stripe Checkout
   - ✅ Rota `/pagamento` adicionada ao router

3. **Formulário de Briefing**
   - ✅ Atualizado para salvar no Supabase
   - ✅ Redireciona para `/pagamento?leadId={id}`
   - ✅ Backup opcional para n8n mantido
   - ✅ Tratamento de erros melhorado

---

## ⏳ Pendente (FASE 1 - Parte 2)

### 1. Executar Setup do Supabase

**📋 Instruções:**

Acesse: https://hkvybshytzgzcrbqngdh.supabase.co

**Passo 1: Executar SQL**
- SQL Editor → New query
- Copiar todo o conteúdo de `supabase/setup.sql`
- Colar e clicar em "Run"
- Verificar em "Table Editor" se as tabelas `leads` e `payments` foram criadas

**Passo 2: Criar Storage Buckets**
- Storage → New bucket
- Criar 3 buckets públicos:
  - `logos`
  - `fotos`
  - `depoimentos`

### 2. Configurar Stripe (Modo TESTE)

**📋 Obter chaves do Stripe:**

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - **Publishable key** (começa com `pk_test_...`)
   - **Secret key** (começa com `sk_test_...`)

3. Adicione no arquivo `.env`:
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### 3. Criar Backend para Stripe

**Problema:** Stripe Checkout precisa de um backend para criar a sessão de pagamento.

**Soluções possíveis:**

#### Opção A: Netlify Functions (Recomendado)
- Deploy do site no Netlify
- Criar serverless functions
- Integra automaticamente com o projeto

#### Opção B: Vercel Edge Functions
- Similar ao Netlify
- Deploy no Vercel

#### Opção C: Backend separado (Node.js/Express)
- Hospedar em Render, Railway ou Heroku
- Mais controle, mas mais complexo

**Qual você prefere?** (Recomendo Opção A - Netlify)

### 4. Implementar Webhooks Stripe

Após configurar backend, precisamos:
- Endpoint `/api/webhook/stripe`
- Validar eventos do Stripe
- Atualizar status no Supabase quando pagamento for confirmado
- Enviar emails via Resend

### 5. Configurar Resend (Emails)

1. Criar conta: https://resend.com
2. Adicionar domínio `digitalizarmkt.com.br`
3. Configurar DNS (Hostinger)
4. Obter API Key
5. Adicionar no `.env`:
   ```
   RESEND_API_KEY=re_...
   ```

---

## 🧪 Testando o que já está pronto

### Testar Fluxo: Briefing → Supabase

**Antes de rodar, execute o SQL no Supabase!**

```bash
cd swift-dent-studio-16
npm run dev
```

1. Acesse: http://localhost:5173
2. Clique em "Fazer Briefing"
3. Preencha as 8 seções
4. Clique em "Finalizar"
5. Deve:
   - Salvar no Supabase
   - Redirecionar para `/pagamento?leadId={uuid}`
   - Mostrar página de pagamento

6. Verificar no Supabase:
   - Table Editor → `leads`
   - Deve aparecer o novo lead com status "novo"

**Se o botão de pagamento não funcionar:**
- É esperado! Ainda precisa configurar Stripe backend

---

## 📁 Estrutura de Arquivos Criada

```
swift-dent-studio-16/
├── .env                           # ✅ Variáveis de ambiente
├── .env.example                   # ✅ Template de variáveis
├── SETUP_SUPABASE.md             # ✅ Guia setup Supabase
├── README_IMPLEMENTACAO.md        # ✅ Este arquivo
│
├── supabase/
│   └── setup.sql                  # ✅ Script criação tabelas
│
├── src/
│   ├── lib/
│   │   └── supabase.ts            # ✅ Config + funções Supabase
│   │
│   ├── pages/
│   │   ├── Briefing.tsx           # ✅ Atualizado (salva Supabase)
│   │   └── Payment.tsx            # ✅ Nova página pagamento
│   │
│   └── components/
│       └── RouterProvider.tsx     # ✅ Atualizado (rota /pagamento)
```

---

## 🎯 Próximos Passos Imediatos

1. **Você:**
   - [ ] Executar SQL no Supabase (5 min)
   - [ ] Criar storage buckets (2 min)
   - [ ] Obter chaves Stripe teste (5 min)
   - [ ] Decidir: Netlify, Vercel ou backend separado?

2. **Eu (próxima etapa):**
   - [ ] Criar backend para Stripe (Netlify Functions)
   - [ ] Implementar webhook Stripe
   - [ ] Configurar Resend + templates de email
   - [ ] Testar fluxo completo end-to-end

---

## 💡 Dúvidas Frequentes

**P: O site ainda funciona sem configurar Stripe?**
R: Sim! O briefing e salvamento no Supabase já funcionam. Apenas o pagamento fica desabilitado.

**P: Posso testar sem pagar de verdade?**
R: Sim! O modo TEST do Stripe permite testar com cartões falsos sem cobranças reais.

**P: Preciso domínio próprio agora?**
R: Não! Pode testar tudo em localhost ou GitHub Pages. Domínio é só para produção.

**P: Quanto custa?**
R: Fase de validação é GRÁTIS:
- Supabase: Grátis (500MB)
- Stripe: Grátis (modo teste)
- Netlify: Grátis (100k requests/mês)
- Resend: Grátis (3.000 emails/mês)

---

## 📞 Próximos Passos

**Me avise quando:**
1. Executar o SQL no Supabase
2. Decidir: Netlify, Vercel ou backend separado
3. Pronto para continuar a implementação!

---

## 🐛 Problemas?

**Erro ao salvar no Supabase:**
- Verifique se executou o SQL
- Confira as credenciais no `.env`
- Veja o console do navegador (F12)

**Erro ao redirecionar para /pagamento:**
- Verifique se a rota foi adicionada
- Limpe o cache do navegador
- Reinicie o servidor dev (Ctrl+C → `npm run dev`)

**Outros problemas:**
- Abra o console (F12)
- Veja os erros em vermelho
- Me passe a mensagem de erro completa
