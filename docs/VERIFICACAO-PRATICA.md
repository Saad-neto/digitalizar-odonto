# ✅ Verificação Prática: Os Dados Estão Sendo Salvos?

## 🎯 3 Formas de Confirmar AGORA

---

## ✅ FORMA 1: Via Supabase Dashboard (Mais Fácil)

### **Passo 1:** Acesse o Supabase
```
1. Vá em: https://supabase.com/dashboard
2. Faça login
3. Selecione o projeto "Sites Odonto"
```

### **Passo 2:** Abra a tabela
```
1. Menu lateral esquerdo → "Table Editor"
2. Procure e clique em "leads"
3. Você deve ver linhas com dados
```

### **Passo 3:** Verifique
```
✅ SE VER LINHAS COM DADOS:
   - Sim! Os dados estão sendo salvos!
   - Cada linha = 1 lead cadastrado
   - Clique no ícone 🔍 em "briefing_data" para ver tudo

❌ SE A TABELA ESTIVER VAZIA:
   - Os dados NÃO estão sendo salvos
   - Pode ser erro na configuração do Supabase
   - Veja "Troubleshooting" abaixo
```

**Screenshot do que você deve ver:**
```
┌────────────┬─────────────────┬────────────────────────────┬──────────────────┬────────┐
│ id         │ nome            │ email                      │ whatsapp         │ status │
├────────────┼─────────────────┼────────────────────────────┼──────────────────┼────────┤
│ uuid-123   │ Dr. Carlos Ed...│ carlos.eduardo@clinica...  │ (11) 99123-9999  │ novo   │
│ uuid-456   │ Dra. Maria...   │ maria@odonto...            │ (18) 98888-8888  │ novo   │
└────────────┴─────────────────┴────────────────────────────┴──────────────────┴────────┘
```

---

## ✅ FORMA 2: Via SQL Editor (Mais Completo)

### **Passo 1:** Abra o SQL Editor
```
1. No Supabase Dashboard
2. Menu lateral → "SQL Editor"
3. Clique em "New query"
```

### **Passo 2:** Execute a query de verificação
```sql
-- Cole e execute esta query:
SELECT COUNT(*) as total_leads FROM leads;
```

### **Passo 3:** Interprete o resultado
```
✅ SE RETORNAR: total_leads = 2 (ou mais)
   - SUCESSO! Tem 2 leads salvos

❌ SE RETORNAR: total_leads = 0
   - PROBLEMA! Nenhum dado foi salvo

❌ SE DER ERRO: "relation 'leads' does not exist"
   - Tabela não foi criada
   - Execute o script: supabase/setup.sql
```

### **Passo 4:** Ver os dados completos
```sql
-- Execute esta query para ver TUDO:
SELECT
  nome,
  email,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  created_at
FROM leads
ORDER BY created_at DESC;
```

**Resultado esperado:**
```
┌─────────────────┬───────────────────────────┬──────────────────────────────────┬────────────────┬─────────────────────┐
│ nome            │ email                     │ consultorio                      │ cidade         │ created_at          │
├─────────────────┼───────────────────────────┼──────────────────────────────────┼────────────────┼─────────────────────┤
│ Dr. Carlos Ed...│ carlos.eduardo@clinica... │ Clínica Odontológica Dr. Carlos..│ São Paulo      │ 2025-12-07 10:30:00 │
└─────────────────┴───────────────────────────┴──────────────────────────────────┴────────────────┴─────────────────────┘
```

---

## ✅ FORMA 3: Via Console do Navegador (Desenvolvedor)

### **Passo 1:** Abra o site do formulário
```
1. Acesse: digitalizar-odonto.pages.dev/briefing
2. Pressione F12 (abrir DevTools)
3. Vá na aba "Console"
```

### **Passo 2:** Execute este código
```javascript
// Cole no console e pressione Enter:
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');

const supabase = createClient(
  'https://hkvybshytzgzcrbqngdh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdnlic2h5dHpnemNyYnFuZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTU4OTUsImV4cCI6MjA0ODg5MTg5NX0.VgMEJBMG8LqLqJJCzWw6Y_A98tz5ZSCQibjx7Z4LvqA'
);

// Buscar leads
const { data, error } = await supabase.from('leads').select('*');

if (error) {
  console.error('❌ ERRO:', error);
} else if (data.length === 0) {
  console.warn('⚠️ Tabela existe mas está vazia!');
} else {
  console.log('✅ SUCESSO! Encontrados', data.length, 'leads:');
  console.table(data.map(d => ({
    nome: d.nome,
    email: d.email,
    cidade: d.briefing_data?.cidade,
    created_at: d.created_at
  })));
}
```

### **Passo 3:** Interprete o resultado
```
✅ SUCESSO:
   - Console mostra: "✅ SUCESSO! Encontrados 2 leads:"
   - Tabela com dados aparece

❌ PROBLEMA:
   - Console mostra: "❌ ERRO: ..."
   - Ou: "⚠️ Tabela existe mas está vazia!"
```

---

## 🔍 Verificar o Fluxo de Salvamento

### **Como funciona (atualmente):**

```
USUÁRIO PREENCHE FORMULÁRIO
    ↓
[Clica "Finalizar" na última seção]
    ↓
Briefing.tsx → handleSubmit()
    ↓
createLead() (supabase.ts)
    ↓
SUPABASE → Tabela "leads"
    ↓
Redirect para /pagamento?leadId=xxx
```

### **Onde pode dar erro:**

1. **Erro no handleSubmit:**
   - Abra DevTools (F12) → Console
   - Preencha o formulário
   - Clique "Finalizar"
   - Se aparecer erro em vermelho → problema no frontend

2. **Erro na conexão com Supabase:**
   - Verifique se o arquivo `.env` existe
   - Confirme se as keys do Supabase estão corretas
   - Teste a conexão (Form 3 acima)

3. **Erro de permissão (RLS):**
   - Supabase tem Row Level Security ativado
   - Política "Permitir insert público" deve existir
   - Verifique no Supabase Dashboard → Authentication → Policies

---

## 🐛 Troubleshooting

### **Problema 1: Tabela não existe**

```sql
-- Execute no SQL Editor:
-- Isso cria a tabela
\i supabase/setup.sql
```

### **Problema 2: Dados não aparecem**

**Verifique as variáveis de ambiente:**

```bash
# Arquivo: .env
VITE_SUPABASE_URL=https://hkvybshytzgzcrbqngdh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (sua key)
```

**Teste a conexão:**

```javascript
// No console do browser:
console.log(import.meta.env.VITE_SUPABASE_URL);
// Deve mostrar: https://hkvybshytzgzcrbqngdh.supabase.co

// Se mostrar "undefined" → .env não está carregando
```

### **Problema 3: Erro de permissão**

**Verifique as políticas RLS:**

```sql
-- No SQL Editor:
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

**Deve retornar a política:**
```
policyname: "Permitir insert público"
cmd: "INSERT"
with_check: true
```

**Se não existir, crie:**

```sql
CREATE POLICY "Permitir insert público" ON leads
  FOR INSERT
  WITH CHECK (true);
```

### **Problema 4: Formulário não envia**

**Abra o código do formulário:**

```typescript
// src/pages/Briefing.tsx, linha ~550
const handleSubmit = async () => {
  try {
    console.log('💾 Salvando lead no Supabase...');

    const lead = await createLead({
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.whatsapp,
      briefing_data: finalData,
    });

    console.log('✅ Lead salvo:', lead);

    // Se chegou aqui, salvou com sucesso!
    navigate(`/pagamento?leadId=${lead.id}`);

  } catch (error) {
    console.error('❌ Erro ao salvar lead:', error);
    alert('Erro ao salvar dados. Tente novamente.');
  }
};
```

**Teste:**
1. Abra DevTools (F12)
2. Preencha o formulário
3. Clique "Finalizar"
4. Veja o console:
   - ✅ Se mostrar "✅ Lead salvo:" → funcionou!
   - ❌ Se mostrar "❌ Erro ao salvar lead:" → veja a mensagem de erro

---

## 📊 Script Completo de Verificação

Execute este script no **SQL Editor** do Supabase:

```bash
# Arquivo já criado:
supabase/VERIFICAR-SE-DADOS-ESTAO-SALVOS.sql
```

**Ele vai retornar:**
- ✅ Quantos leads existem
- ✅ Se os dados estão completos
- ✅ Se os arquivos foram enviados
- ✅ Resumo final

---

## 🎯 Resposta Definitiva

### **Para saber SE ESTÁ SALVANDO:**

Execute **qualquer uma das 3 formas** acima. A mais rápida é:

1. Supabase Dashboard → Table Editor → "leads"
2. Se tiver linhas: **✅ ESTÁ SALVANDO!**
3. Se estiver vazio: **❌ NÃO ESTÁ SALVANDO!**

### **Para saber O QUE está sendo salvo:**

```sql
-- Execute no SQL Editor:
SELECT
  nome,
  email,
  briefing_data->>'nome_consultorio' as consultorio,
  jsonb_pretty(briefing_data) as tudo
FROM leads
ORDER BY created_at DESC
LIMIT 1;
```

---

## ✅ Checklist Rápida

- [ ] Acesso ao Supabase Dashboard
- [ ] Abrir Table Editor
- [ ] Procurar tabela "leads"
- [ ] Verificar se tem linhas com dados
- [ ] Expandir campo "briefing_data" (🔍)
- [ ] Confirmar que tem JSON completo
- [ ] **CONCLUSÃO:** Dados estão sendo salvos?

---

**Execute a FORMA 1 agora e me diga o que você vê!** 👀
