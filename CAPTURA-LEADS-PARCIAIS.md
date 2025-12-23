# Captura Automática de Leads Parciais

## Visão Geral

Sistema de captura automática de leads que abandonam o formulário de briefing após preencher apenas a página 1 (Informações Essenciais).

### Objetivo
Capturar leads para remarketing mesmo quando o usuário desiste de completar todo o formulário.

## Como Funciona

### Fluxo de Captura

1. **Usuário preenche Página 1:**
   - Nome do consultório
   - Nome pessoal
   - WhatsApp
   - E-mail

2. **Usuário clica em "Próximo" (Página 1 → 2):**
   - ✅ Sistema cria automaticamente um lead com status `lead_parcial`
   - ✅ LeadId salvo no `localStorage` para evitar duplicação
   - ✅ Captura totalmente silenciosa (usuário não é notificado)

3. **Dois cenários possíveis:**

   **Cenário A - Abandono:**
   - Usuário fecha a página ou desiste
   - Lead permanece com status `lead_parcial`
   - Disponível para remarketing no admin

   **Cenário B - Conclusão:**
   - Usuário completa todo o formulário
   - Lead é atualizado de `lead_parcial` → `novo`
   - Todos os dados do briefing são salvos
   - `localStorage` é limpo

## Implementação Técnica

### 1. Novo Status no Banco de Dados

**Arquivo:** `supabase/migration-add-lead-parcial-status.sql`

**Status adicionado:** `lead_parcial`

**Todos os status:**
```
- lead_parcial      → Abandonou após página 1
- novo              → Completou formulário mas não pagou
- pago_50           → Pagou 50% de entrada
- em_producao       → Site em desenvolvimento
- em_aprovacao      → Site aguardando aprovação
- pago_100          → Pagou os 100%
- concluido         → Projeto finalizado
```

### 2. Novas Funções no Supabase

**Arquivo:** `src/lib/supabase.ts`

#### `createPartialLead()`
Cria lead com status `lead_parcial` contendo apenas dados básicos:
- Nome
- E-mail
- WhatsApp
- Nome do consultório
- Data de captura

#### `updateLeadToComplete()`
Atualiza lead parcial para completo:
- Muda status para `novo`
- Adiciona todos os dados do briefing
- Mantém o mesmo `id` do lead

### 3. Modificações no Briefing

**Arquivo:** `src/pages/Briefing.tsx`

#### `handleNext()` - Captura Automática
```typescript
- Detecta mudança seção 0 → 1
- Verifica localStorage ('partial_lead_id')
- Se não existir, cria lead parcial
- Salva leadId no localStorage
- Log silencioso no console
```

#### `handleSubmit()` - Finalização
```typescript
- Verifica localStorage ('partial_lead_id')
- Se existir: atualiza lead parcial
- Se não existir: cria novo lead
- Limpa localStorage após sucesso
```

## Migração do Banco de Dados

### ⚠️ IMPORTANTE: Execute ANTES do deploy

1. Acesse seu projeto no Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo de `supabase/migration-add-lead-parcial-status.sql`
4. Clique em **Run**
5. Verifique se executou sem erros

### Script da Migração
```sql
-- Remover constraint antiga
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;

-- Adicionar nova constraint com 'lead_parcial'
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN (
    'lead_parcial',
    'novo',
    'pago_50',
    'em_producao',
    'em_aprovacao',
    'pago_100',
    'concluido'
  ));
```

## Como Testar

### 1. Teste de Captura de Lead Parcial

1. **Acesse o briefing:**
   ```
   https://seu-site.com/briefing
   ```

2. **Preencha apenas a Página 1:**
   - Nome do consultório: "Teste Clínica"
   - Seu nome: "Dr. Teste"
   - WhatsApp: "(11) 99999-9999"
   - E-mail: "teste@email.com"

3. **Clique em "Próximo"**

4. **Abra o Console do Navegador (F12):**
   ```
   ✅ Lead parcial capturado: [uuid]
   ```

5. **Verifique o localStorage:**
   ```javascript
   localStorage.getItem('partial_lead_id')
   // Deve retornar o UUID do lead
   ```

6. **Feche a página (simule abandono)**

7. **Verifique no Admin:**
   - Acesse `/admin/leads`
   - Filtre por status: `lead_parcial`
   - Deve aparecer o lead "Dr. Teste"

### 2. Teste de Atualização de Lead

1. **Acesse o briefing novamente:**
   ```
   https://seu-site.com/briefing
   ```

2. **Preencha os mesmos dados da Página 1**

3. **Clique em "Próximo"**

4. **Verifique o Console:**
   ```
   ✅ Lead parcial já existe (não cria duplicado)
   ```

5. **Complete TODO o formulário**

6. **Clique em "Enviar"**

7. **Verifique o Console:**
   ```
   ✅ Lead parcial atualizado para completo: [uuid]
   ```

8. **Verifique no Admin:**
   - O mesmo lead agora tem status `novo`
   - Todos os dados do briefing foram salvos

### 3. Teste de Novo Lead (sem parcial)

1. **Limpe o localStorage:**
   ```javascript
   localStorage.removeItem('partial_lead_id')
   ```

2. **Preencha o formulário completo**

3. **Envie o formulário**

4. **Verifique o Console:**
   ```
   ✅ Lead criado com sucesso: [uuid]
   ```

5. **Novo lead foi criado diretamente com status `novo`**

## Remarketing com Leads Parciais

### Identificando Leads Parciais

**No Admin Dashboard:**
```
- Vá em /admin/leads
- Filtre por status: "lead_parcial"
- Ordene por data (mais recentes primeiro)
```

### Dados Disponíveis para Remarketing

```json
{
  "nome": "Dr. João Silva",
  "email": "joao@clinica.com.br",
  "whatsapp": "(11) 98888-8888",
  "briefing_data": {
    "nome_consultorio": "Clínica Dr. João",
    "capturado_em": "2025-12-23T20:45:00Z"
  }
}
```

### Estratégias de Remarketing

1. **E-mail Marketing:**
   - "Vimos que você começou seu cadastro..."
   - "Complete seu site em apenas 5 minutos!"
   - "Oferta especial: R$ 50 de desconto"

2. **WhatsApp:**
   - Mensagem personalizada
   - Oferta de suporte
   - Link direto para continuar

3. **Facebook/Instagram Ads:**
   - Criar público personalizado com e-mails/telefones
   - Anúncios de retargeting
   - Lembrar do site profissional

## Troubleshooting

### Lead duplicado é criado

**Problema:** Dois leads para o mesmo e-mail

**Solução:**
- Verifique se localStorage está funcionando
- Teste em aba anônima (localStorage isolado)
- Verifique logs do console

### Lead parcial não é criado

**Problema:** Nada acontece ao clicar "Próximo"

**Solução:**
1. Verifique console por erros
2. Confirme que migração SQL foi executada
3. Verifique permissões RLS no Supabase
4. Teste conexão com Supabase

### Lead não é atualizado ao enviar formulário

**Problema:** Novo lead é criado em vez de atualizar

**Solução:**
1. Verifique se localStorage tem 'partial_lead_id'
2. Confirme que UUID no localStorage existe no banco
3. Verifique permissões de UPDATE na tabela leads

## Logs de Desenvolvimento

### Console Logs Esperados

**Captura Parcial (Página 1 → 2):**
```javascript
✅ Lead parcial capturado: abc123-def456-ghi789
```

**Tentativa de Captura com Lead Existente:**
```javascript
// Nenhum log - lead parcial já existe no localStorage
```

**Atualização para Lead Completo:**
```javascript
📤 Enviando briefing para o Supabase...
✅ Lead parcial atualizado para completo: abc123-def456-ghi789
```

**Criação de Novo Lead (sem parcial):**
```javascript
📤 Enviando briefing para o Supabase...
✅ Lead criado com sucesso: xyz789-abc123-def456
```

## Checklist de Deploy

- [ ] Executar migração SQL no Supabase
- [ ] Verificar que status 'lead_parcial' foi adicionado
- [ ] Build do projeto sem erros
- [ ] Deploy realizado
- [ ] Testar captura em produção
- [ ] Testar atualização em produção
- [ ] Verificar leads parciais no admin
- [ ] Configurar automações de remarketing

## Arquivos Modificados

```
✅ src/lib/supabase.ts
   - createPartialLead()
   - updateLeadToComplete()

✅ src/pages/Briefing.tsx
   - handleNext() (async)
   - handleSubmit() (verificação de lead parcial)

✅ supabase/migration-add-lead-parcial-status.sql
   - Migração de banco de dados

📝 CAPTURA-LEADS-PARCIAIS.md
   - Documentação completa
```

## Próximos Passos

1. **Automação de E-mails:**
   - Criar fluxo no Resend/SendGrid
   - E-mail 1h após abandono
   - E-mail 24h após abandono

2. **Dashboard de Remarketing:**
   - Painel específico para leads parciais
   - Métricas de conversão
   - Taxa de recuperação

3. **Integração com CRM:**
   - Enviar leads parciais para CRM
   - Automação de follow-up
   - Pontuação de leads (lead scoring)

---

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte os logs do console do navegador
- Verifique a documentação do Supabase

---

**Última atualização:** 2025-12-23
**Versão:** 1.0.0
