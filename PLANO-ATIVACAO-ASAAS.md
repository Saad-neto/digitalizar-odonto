# 🚀 PLANO DE ATIVAÇÃO - PAGAMENTO ASAAS

## 📋 SITUAÇÃO ATUAL

**Status:** Código pronto, aguardando credenciais e testes

**O que temos:**
- ✅ Integração Asaas completa
- ✅ Página de pagamento (PIX + Cartão até 12x)
- ✅ Webhook para atualização automática
- ✅ Sistema de cupons

**O que falta:**
- ❌ Configurar credenciais do Asaas
- ❌ Conectar briefing → pagamento
- ❌ Testar fluxo completo

---

## 🎯 ETAPAS PARA ATIVAÇÃO

### **ETAPA 1: Criar Conta Asaas (Sandbox para Testes)**

#### 1.1 Criar Conta Sandbox
- [ ] Acessar: https://sandbox.asaas.com
- [ ] Clicar em "Criar conta"
- [ ] Preencher dados (pode usar dados fictícios no sandbox)
- [ ] Confirmar email
- [ ] Fazer login

#### 1.2 Obter API Key (Sandbox)
- [ ] Fazer login no painel sandbox
- [ ] Ir em: **Menu → Configurações → Integrações → API**
- [ ] Copiar a chave de **API** (começa com `$aact_` no sandbox)
- [ ] Guardar essa chave

**Exemplo de chave sandbox:**
```
$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDA
```

---

### **ETAPA 2: Configurar Variáveis de Ambiente**

Editar o arquivo `.env`:

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16
nano .env
```

Atualizar essas linhas (por volta da linha 102):

```bash
# ------------------
# ASAAS (Gateway Principal - PIX + Cartão 12x)
# ------------------
VITE_ASAAS_API_KEY=$aact_SuaChaveAquiCopiada

# Ambiente: 'sandbox' para testes, 'production' para produção
VITE_ASAAS_ENV=sandbox

# Webhook secret do Asaas (deixar vazio por enquanto)
ASAAS_WEBHOOK_SECRET=
```

Salvar e sair (`Ctrl+X`, `Y`, `Enter`)

---

### **ETAPA 3: Conectar Briefing com Página de Pagamento**

Atualmente, ao finalizar o briefing, o sistema NÃO redireciona para pagamento automaticamente.

**Precisamos ajustar** `src/pages/Briefing.tsx` para redirecionar para a página de pagamento após criar o lead.

#### O que fazer:

Vou criar um arquivo patch para você aplicar:

```typescript
// No arquivo Briefing.tsx, na função handleSubmit, após criar o lead:

// Linha ~655 - ATUALMENTE está assim:
alert('Briefing enviado com sucesso! 🎉...');
navigate(`/obrigado?plano=${plano}`);

// MUDAR PARA:
// Se NÃO veio do Hotmart, redirecionar para pagamento
if (!isFromHotmart && lead?.id) {
  navigate(`/pagamento?leadId=${lead.id}`);
} else {
  // Se veio do Hotmart, já pagou - vai direto para obrigado
  alert('Briefing enviado com sucesso! 🎉\n\nEm até 24 horas nossa equipe entrará em contato...');
  navigate(`/obrigado?plano=${plano}`);
}
```

---

### **ETAPA 4: Testar Fluxo Completo (Modo Sandbox)**

#### 4.1 Iniciar servidor de desenvolvimento

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16
npm run dev
```

#### 4.2 Teste PIX

1. Acesse: `http://localhost:8080/briefing`
2. Preencha todo o briefing
3. Clique em "Enviar Briefing"
4. **Deve redirecionar** para `/pagamento?leadId=...`
5. Na página de pagamento:
   - Valor exibido: R$ 997,00
   - Selecione: **PIX**
   - Clique em "Gerar QR Code PIX"
6. Deve aparecer:
   - QR Code (imagem)
   - Código PIX (copia e cola)
   - Botão "Copiar"
7. **Simular pagamento no painel Asaas:**
   - Abra: https://sandbox.asaas.com
   - Vá em: **Cobranças**
   - Encontre a cobrança recém-criada
   - Clique em **"... → Confirmar pagamento"**
8. **Verificar atualização no Supabase:**
   - Tabela `leads`: status deve mudar para `em_producao`
   - Tabela `lead_status_history`: deve ter registro da mudança

#### 4.3 Teste Cartão de Crédito

1. Repita passos 1-4 do teste PIX
2. Selecione: **Cartão de Crédito**
3. Clique em "Pagar com Cartão (até 12x)"
4. Deve abrir nova aba com checkout Asaas
5. Use cartão de teste:
   - **Número:** `5162 3060 1926 1861`
   - **Validade:** `12/2030` (qualquer futura)
   - **CVV:** `123`
   - **Nome:** `TESTE APROVADO`
6. Selecione parcelas (1x, 3x, 6x, 12x)
7. Confirmar pagamento
8. Verificar atualização no Supabase (igual teste PIX)

---

### **ETAPA 5: Configurar Webhook (Opcional para Testes)**

O webhook é necessário para atualizar automaticamente o status do lead quando o pagamento for confirmado.

#### 5.1 Expor localhost (temporário para testes)

**Opção A: Usar ngrok**
```bash
ngrok http 8888
```

**Opção B: Usar localtunnel**
```bash
npx localtunnel --port 8888
```

Copie a URL gerada (ex: `https://abc123.ngrok.io`)

#### 5.2 Configurar no painel Asaas Sandbox

- [ ] Ir em: **Configurações → Webhooks**
- [ ] Clicar em "Adicionar webhook"
- [ ] URL: `https://sua-url-ngrok.ngrok.io/.netlify/functions/asaas-webhook`
- [ ] Selecionar eventos:
  - ✅ PAYMENT_CONFIRMED
  - ✅ PAYMENT_RECEIVED
  - ✅ PAYMENT_OVERDUE
  - ✅ PAYMENT_REFUNDED
- [ ] Salvar

#### 5.3 Testar webhook

1. Fazer um pagamento teste (PIX ou Cartão)
2. Confirmar pagamento no painel Asaas
3. Verificar logs no terminal do `npm run dev`
4. Deve aparecer: `📥 Webhook Asaas recebido: ...`
5. Verificar Supabase: status do lead deve atualizar automaticamente

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após completar todas as etapas, verificar:

- [ ] Página de briefing carrega normalmente
- [ ] Ao finalizar briefing, redireciona para `/pagamento`
- [ ] Página de pagamento exibe valor correto (R$ 997)
- [ ] Botão PIX gera QR Code
- [ ] Botão Cartão abre checkout Asaas
- [ ] Pagamento teste PIX é confirmado no painel
- [ ] Pagamento teste Cartão é aprovado
- [ ] Status do lead atualiza no Supabase
- [ ] Webhook funciona (se configurado)

---

## 🚨 PROBLEMAS COMUNS

### Problema: "Asaas não está configurado"

**Solução:**
- Verificar se `VITE_ASAAS_API_KEY` está preenchida no `.env`
- Reiniciar o servidor (`npm run dev`)
- Variáveis `VITE_*` só são carregadas no build

### Problema: QR Code não aparece

**Solução:**
- Abrir console do navegador (F12)
- Verificar se há erro de API
- Conferir se a chave Asaas está correta
- Verificar se está em modo sandbox

### Problema: Pagamento não atualiza no Supabase

**Solução:**
- Verificar se webhook está configurado
- Ver logs do webhook no painel Asaas
- Conferir se `asaas_payment_id` está salvo no lead

---

## 📱 PRÓXIMOS PASSOS (APÓS TESTES)

Uma vez que os testes em sandbox funcionarem:

1. **Criar conta Asaas PRODUÇÃO:**
   - https://www.asaas.com
   - Enviar documentação
   - Aguardar aprovação (1-2 dias)

2. **Obter chave de PRODUÇÃO:**
   - Mesma API Key, mas do ambiente de produção
   - Começa com `$aact_` também

3. **Atualizar `.env` para produção:**
   ```bash
   VITE_ASAAS_API_KEY=chave_de_producao
   VITE_ASAAS_ENV=production
   ```

4. **Configurar webhook em produção:**
   - URL: `https://odonto.digitalizarmkt.com.br/.netlify/functions/asaas-webhook`

5. **Deploy:**
   ```bash
   ./deploy.sh
   ```

6. **Primeiro pagamento real:**
   - Fazer pedido teste com cartão real
   - Monitorar no painel Asaas
   - Verificar atualização no Supabase

---

## 📞 SUPORTE

**Documentação Asaas:**
- https://docs.asaas.com

**Suporte Asaas:**
- Email: suporte@asaas.com
- WhatsApp: (11) 4950-5251

**Dúvidas sobre o código:**
- Verificar `GUIA-PRODUCAO-ASAAS.md`
- Ver código em `src/lib/asaas.ts`
- Conferir webhook em `netlify/functions/asaas-webhook.ts`

---

**Última atualização:** 06/02/2026

**Status:** Aguardando credenciais Asaas para iniciar testes
