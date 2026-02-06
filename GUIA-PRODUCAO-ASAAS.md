# 🚀 GUIA COMPLETO: MIGRAÇÃO PARA PRODUÇÃO COM ASAAS

## 📋 RESUMO DO SISTEMA

Você tem **2 fluxos de pagamento**:

1. **Fluxo Principal (Asaas)** - Para vendas diretas
   - Homepage normal → Briefing → Pagamento Asaas
   - PIX + Cartão até 12x sem juros
   - Webhooks automáticos

2. **Fluxo Afiliados (Hotmart)** - Para vendas via afiliados
   - Página especial ou cupom de desconto
   - Hotmart gerencia comissões
   - Sistema de tracking integrado

---

## ✅ O QUE JÁ FOI FEITO

### 1. **Código de Integração Asaas**
- ✅ `src/lib/asaas.ts` - Biblioteca completa de integração
- ✅ `src/pages/Payment.tsx` - Página de pagamento configurada
- ✅ Suporte a PIX e Cartão de Crédito

### 2. **Webhook Handler Criado**
- ✅ `netlify/functions/asaas-webhook.ts` - Processa eventos do Asaas
- ✅ Atualiza status do lead automaticamente
- ✅ Registra histórico de pagamentos

### 3. **Sistema de Cupons**
- ✅ `supabase/cupons-afiliados-setup.sql` - Schema do banco
- ✅ Funções no `src/lib/supabase.ts` para gerenciar cupons
- ✅ Tabelas: `cupons`, `cupons_uso`
- ✅ Trigger automático para contar usos

### 4. **Variáveis de Ambiente**
- ✅ `.env` atualizado com seção Asaas
- ✅ Documentação completa

---

## 🎯 CHECKLIST PRÉ-PRODUÇÃO

### **PASSO 1: Configurar Conta Asaas Produção**

#### 1.1 Criar Conta
- [ ] Acessar: https://www.asaas.com
- [ ] Completar cadastro (CNPJ/CPF)
- [ ] Enviar documentação exigida
- [ ] Aguardar aprovação (1-2 dias úteis)

#### 1.2 Obter API Key de Produção
- [ ] Login no painel Asaas
- [ ] Ir em: **Configurações → Integrações → API**
- [ ] Copiar a chave de **PRODUÇÃO** (começa com `$aact_`)
- [ ] Guardar em local seguro

#### 1.3 Configurar Webhook
- [ ] No painel Asaas, ir em: **Configurações → Webhooks**
- [ ] Adicionar novo webhook
- [ ] URL: `https://odonto.digitalizarmkt.com.br/.netlify/functions/asaas-webhook`
- [ ] Selecionar eventos:
  - ✅ PAYMENT_RECEIVED
  - ✅ PAYMENT_CONFIRMED
  - ✅ PAYMENT_OVERDUE
  - ✅ PAYMENT_REFUNDED
  - ✅ PAYMENT_UPDATED
- [ ] Copiar o **Access Token** gerado
- [ ] Salvar configuração

---

### **PASSO 2: Atualizar Variáveis de Ambiente**

Editar o arquivo `.env` no servidor de produção:

```bash
# ASAAS - PRODUÇÃO
VITE_ASAAS_API_KEY=$aact_SUACHAVEDEPRODUCAO
VITE_ASAAS_ENV=production
ASAAS_WEBHOOK_SECRET=seu_token_do_webhook
```

**IMPORTANTE:** No ambiente de produção (Docker), você precisa:
1. Editar o `.env` no servidor
2. Fazer rebuild: `npm run build`
3. Reconstruir a imagem Docker
4. Atualizar o serviço

---

### **PASSO 3: Configurar Banco de Dados (Supabase)**

#### 3.1 Executar SQL de Cupons

Acesse: **Supabase Dashboard → SQL Editor**

Execute o arquivo: `supabase/cupons-afiliados-setup.sql`

Isso criará:
- Tabela `cupons`
- Tabela `cupons_uso`
- Trigger automático para contar usos
- Cupons de exemplo (remover depois!)

#### 3.2 Verificar Colunas na Tabela `leads`

O SQL também adiciona estas colunas em `leads`:
- `cupom_usado` - Código do cupom usado
- `cupom_desconto` - Valor do desconto em reais
- `afiliado_ref` - Referência do afiliado
- `origem_pagamento` - 'asaas' ou 'hotmart'
- `asaas_customer_id` - ID do cliente no Asaas
- `asaas_payment_id` - ID do pagamento no Asaas
- `asaas_invoice_url` - URL da fatura
- `asaas_billing_type` - Tipo de pagamento

---

### **PASSO 4: Testar em Modo SANDBOX**

#### 4.1 Configurar Sandbox

```bash
# No .env
VITE_ASAAS_API_KEY=sua_chave_sandbox_asaas
VITE_ASAAS_ENV=sandbox
```

#### 4.2 Testes Obrigatórios

**Teste 1: Pagamento PIX (Sandbox)**
- [ ] Preencher briefing completo
- [ ] Selecionar PIX
- [ ] Verificar QR Code gerado
- [ ] Copiar código PIX (testar botão)
- [ ] No painel Asaas Sandbox: Confirmar pagamento manualmente
- [ ] Verificar atualização no Supabase:
  - Status do lead = "em_producao"
  - Campo `asaas_payment_id` preenchido
  - Histórico de status criado

**Teste 2: Cartão de Crédito (Sandbox)**
- [ ] Preencher briefing
- [ ] Selecionar Cartão
- [ ] Usar cartão teste: `5162 3060 1926 1861`
- [ ] Validade: qualquer futura (ex: 12/2030)
- [ ] CVV: 123
- [ ] Nome: TESTE APROVADO
- [ ] Testar parcelamento (1x, 3x, 6x, 12x)
- [ ] Verificar aprovação
- [ ] Verificar atualização no banco

**Teste 3: Cupom de Desconto**
- [ ] Criar cupom de teste no Supabase
- [ ] Aplicar cupom no briefing
- [ ] Verificar desconto aplicado
- [ ] Finalizar pagamento
- [ ] Verificar registro em `cupons_uso`
- [ ] Verificar contador incrementado

**Teste 4: Webhook**
- [ ] Usar ferramenta como ngrok para expor localhost
- [ ] Configurar webhook no Asaas Sandbox
- [ ] Fazer pagamento teste
- [ ] Verificar logs do webhook
- [ ] Confirmar atualização automática do lead

---

### **PASSO 5: Criar Página para Afiliados Hotmart**

Você tem 2 opções:

#### **OPÇÃO A: Página Separada com Redirecionamento**

Criar uma rota: `/pagamento-hotmart`
- Exibe as mesmas informações
- Botão redireciona para Hotmart
- URL já configurada: `VITE_HOTMART_PRODUTO_997`

#### **OPÇÃO B: Sistema de Cupons Inteligente**

- URL com parâmetro: `/?ref=AFILIADO_JOAO`
- Frontend detecta o parâmetro
- Aplica cupom automaticamente
- Rastreia afiliado no Supabase
- Pagamento via Asaas com desconto

**Recomendação:** Use a OPÇÃO B - mais flexível e rastreável!

---

### **PASSO 6: Migrar para Produção**

#### 6.1 Checklist Final

- [ ] Conta Asaas aprovada
- [ ] API Key de produção obtida
- [ ] Webhook configurado e testado
- [ ] Todos os testes em sandbox passaram
- [ ] `.env` atualizado com chaves de produção
- [ ] SQL de cupons executado no banco de produção
- [ ] Backup do banco realizado

#### 6.2 Deploy

No servidor de produção:

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# 1. Atualizar .env com chaves de produção
nano .env
# Trocar:
# VITE_ASAAS_ENV=sandbox → VITE_ASAAS_ENV=production
# VITE_ASAAS_API_KEY=chave_sandbox → VITE_ASAAS_API_KEY=chave_producao

# 2. Deploy automatizado
./deploy.sh

# 3. Verificar logs
docker service logs digitalizar-odonto_digitalizar-odonto -f
```

#### 6.3 Primeiro Pagamento Real

- [ ] Fazer um pedido teste com cartão real
- [ ] Monitorar no painel Asaas
- [ ] Verificar webhook chegando
- [ ] Confirmar atualização no Supabase
- [ ] Validar email de confirmação (se configurado)

---

## 🎓 SISTEMA DE CUPONS - GUIA RÁPIDO

### Como Criar Cupons

**Via SQL (Supabase):**
```sql
INSERT INTO cupons (codigo, descricao, tipo, valor, ativo, afiliado_nome, afiliado_comissao)
VALUES
  ('LANCAMENTO', 'Desconto de lançamento - 15%', 'percentual', 15, true, NULL, NULL),
  ('NATAL2026', 'Promoção Natal - R$ 100 OFF', 'fixo', 100, true, NULL, NULL),
  ('AFILIADO_PEDRO', 'Cupom Pedro Silva - 10% OFF', 'percentual', 10, true, 'Pedro Silva', 15);
```

**Via Código (futuro admin):**
```typescript
import { criarCupom } from '@/lib/supabase';

await criarCupom({
  codigo: 'PRIMEIRACOMPRA',
  descricao: 'Desconto primeira compra',
  tipo: 'percentual',
  valor: 10,
  ativo: true,
  usos_maximos: 100,
});
```

### Como Validar Cupons no Frontend

```typescript
import { validarCupom, calcularDesconto } from '@/lib/supabase';

// 1. Validar cupom
const resultado = await validarCupom('LANCAMENTO');

if (resultado.valido && resultado.cupom) {
  // 2. Calcular desconto
  const valorOriginal = 997; // R$ 997
  const { desconto, valorFinal } = calcularDesconto(valorOriginal, resultado.cupom);

  console.log(`Desconto: R$ ${desconto}`);
  console.log(`Valor final: R$ ${valorFinal}`);

  // 3. Aplicar no pagamento
  // ... criar pagamento com valorFinal
}
```

---

## 🔐 SEGURANÇA

### Checklist de Segurança

- [ ] **NUNCA** expor `ASAAS_API_KEY` no frontend
- [ ] **SEMPRE** validar webhook signature
- [ ] **SEMPRE** validar cupons no backend (não confiar no frontend)
- [ ] **NUNCA** commitar `.env` no Git
- [ ] Usar HTTPS em produção (já configurado via Traefik)
- [ ] Limitar rate de validação de cupons
- [ ] Monitorar uso fraudulento de cupons

---

## 📊 MONITORAMENTO

### Métricas Importantes

1. **Painel Asaas:**
   - Taxa de conversão
   - Valor médio do ticket
   - Taxa de rejeição de cartão
   - Tempo médio de aprovação PIX

2. **Supabase:**
   - Número de leads por status
   - Cupons mais usados
   - Taxa de conversão com cupom vs sem cupom
   - Afiliados com melhor performance

3. **Logs:**
```bash
# Ver logs do webhook
docker service logs digitalizar-odonto_digitalizar-odonto -f | grep webhook

# Ver logs do Asaas
docker service logs digitalizar-odonto_digitalizar-odonto -f | grep Asaas
```

---

## 🆘 TROUBLESHOOTING

### Problema: Webhook não está funcionando

**Sintomas:** Pagamento aprovado no Asaas, mas lead não atualiza no Supabase

**Soluções:**
1. Verificar URL do webhook no painel Asaas
2. Verificar logs do webhook: `docker service logs ... | grep asaas-webhook`
3. Testar webhook manualmente com curl
4. Verificar se `ASAAS_WEBHOOK_SECRET` está correto

### Problema: Pagamento recusado

**Sintomas:** Cartão recusado no Asaas

**Soluções:**
1. Verificar se conta Asaas está 100% aprovada
2. Verificar limites de transação
3. Pedir cliente usar outro cartão
4. Oferecer PIX como alternativa

### Problema: Cupom não aplica desconto

**Sintomas:** Cupom validado, mas desconto não é aplicado no pagamento

**Soluções:**
1. Verificar se o cupom está ativo: `SELECT * FROM cupons WHERE codigo = 'CODIGO'`
2. Verificar se atingiu uso máximo
3. Verificar se código está em MAIÚSCULAS
4. Limpar cache do browser

---

## 📞 SUPORTE

### Asaas
- 📧 Email: suporte@asaas.com
- 📱 WhatsApp: (11) 4950-5251
- 📚 Docs: https://docs.asaas.com

### Urgências
- Problemas de pagamento: Abrir ticket no painel Asaas
- Problemas técnicos: Verificar logs primeiro
- Webhook não funciona: Testar com Postman/curl

---

## ✅ CHECKLIST FINAL PRÉ-LANÇAMENTO

- [ ] Conta Asaas 100% aprovada
- [ ] API Keys de produção configuradas
- [ ] Webhook configurado e testado
- [ ] SQL de cupons executado
- [ ] Todos os testes em sandbox OK
- [ ] Deploy em produção realizado
- [ ] Primeiro pagamento teste realizado
- [ ] Emails de confirmação funcionando
- [ ] Backup do banco realizado
- [ ] Monitoramento configurado
- [ ] Documentação lida e entendida

---

🎉 **PRONTO PARA VENDER!**

Após completar todos os passos acima, seu sistema estará 100% operacional para receber pagamentos reais via Asaas!
