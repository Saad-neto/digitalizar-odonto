# 📋 Setup do Supabase - Digitalizar Odonto

## Passo 1: Criar Projeto Supabase

✅ **JÁ FEITO!** Projeto criado em: https://hkvybshytzgzcrbqngdh.supabase.co

## Passo 2: Executar Script SQL

### Instruções:

1. **Acesse o SQL Editor**
   - Vá em: https://hkvybshytzgzcrbqngdh.supabase.co
   - No menu lateral esquerdo, clique em **"SQL Editor"**

2. **Criar Nova Query**
   - Clique no botão **"New query"**

3. **Copiar o Script**
   - Abra o arquivo: `supabase/setup.sql`
   - Copie **TODO** o conteúdo (Ctrl+A → Ctrl+C)

4. **Colar e Executar**
   - Cole no editor SQL do Supabase
   - Clique em **"Run"** (ou pressione Ctrl+Enter)
   - Aguarde a mensagem: **"Success. No rows returned"**

5. **Verificar se Criou**
   - No menu lateral, clique em **"Table Editor"**
   - Você deve ver 2 tabelas criadas:
     - ✅ `leads`
     - ✅ `payments`

## Passo 3: Criar Storage Buckets

### Instruções:

1. **Acesse Storage**
   - No menu lateral, clique em **"Storage"**

2. **Criar Buckets**
   - Clique em **"New bucket"**
   - Crie os seguintes buckets (um de cada vez):

   **Bucket 1:**
   - Nome: `logos`
   - Public: ✅ Marcar como público

   **Bucket 2:**
   - Nome: `fotos`
   - Public: ✅ Marcar como público

   **Bucket 3:**
   - Nome: `depoimentos`
   - Public: ✅ Marcar como público

## Passo 4: Verificar Configuração

### Checklist Final:

- [ ] Projeto Supabase criado
- [ ] Script SQL executado com sucesso
- [ ] Tabelas `leads` e `payments` visíveis no Table Editor
- [ ] 3 Storage buckets criados (logos, fotos, depoimentos)
- [ ] Arquivo `.env` configurado com URL e chave

---

## ⚠️ Importante

**NUNCA** compartilhe a chave secreta (`service_role_key`) do Supabase publicamente!

As variáveis no arquivo `.env` já estão configuradas corretamente:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

---

## 🆘 Problemas?

### Erro ao executar SQL:
- Verifique se copiou TODO o script (deve ter ~400 linhas)
- Se já executou antes, algumas políticas podem dar erro "already exists" - isso é normal, ignore

### Não vê as tabelas:
- Atualize a página (F5)
- Vá em "Table Editor" → Todas as tabelas devem aparecer

### Erro de permissão:
- Certifique-se que está logado no projeto correto
- Verifique se o projeto está ativo (não pausado)
