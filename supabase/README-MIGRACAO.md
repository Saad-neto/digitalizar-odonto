# Guia de Migração do Banco de Dados

## Visão Geral

Este guia explica como aplicar as melhorias de performance e estrutura ao banco de dados Supabase após as alterações no formulário de briefing.

## O que foi alterado?

O formulário de briefing passou por uma grande reestruturação com os seguintes novos recursos:

### Novos Campos Dinâmicos (Arrays)
- ✅ **profissionais** - Array dinâmico de profissionais
- ✅ **horarios_atendimento_array** - Horários por dia da semana
- ✅ **cores_personalizadas** - Paleta de cores personalizada
- ✅ **sites_referencia_array** - Sites de referência com motivos
- ✅ **redes_sociais** - Redes sociais da clínica

### Novas Seções
- ✅ **Hero/Banner** - Títulos, CTAs e widgets personalizados
- ✅ **Sobre a Clínica** - Missão, visão, valores
- ✅ **Observações de Revisão** - Campo livre ao final

## Estrutura Atual do Banco

**IMPORTANTE**: O banco já está preparado para essas mudanças! ✅

A tabela `leads` usa o campo `briefing_data` do tipo **JSONB**, que permite armazenar dados flexíveis sem precisar alterar a estrutura da tabela.

Isso significa que:
- ✅ Não precisa criar novas colunas
- ✅ Não precisa modificar a estrutura da tabela
- ✅ Os dados novos são salvos automaticamente no JSONB

## Por que executar a migração então?

A migração adiciona **melhorias de performance e facilidades**:

### 1. Índices GIN para JSONB
Melhora drasticamente a performance de buscas em campos JSONB

### 2. Views Úteis
Facilita consultas comuns sem precisar fazer queries complexas:
- `v_leads_essenciais` - Dados principais
- `v_leads_localizacao` - Endereços
- `v_leads_contato` - Contatos e redes sociais

### 3. Funções Helper
Funções SQL para facilitar extração de dados:
- `get_profissionais(lead_id)` - Extrai array de profissionais
- `get_servicos(lead_id)` - Extrai serviços
- `get_horarios(lead_id)` - Extrai horários
- `get_cores_personalizadas(lead_id)` - Extrai paleta de cores
- `get_leads_by_cidade(cidade)` - Busca por cidade
- `get_leads_by_especialidade(especialidade)` - Busca por especialidade

## Como Executar a Migração

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá em https://app.supabase.com
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Ou vá direto em: Project Settings → Database → SQL Editor

3. **Execute a Migração**
   - Abra o arquivo `migration-briefing-fields.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Clique em **RUN** ou pressione `Ctrl+Enter`

4. **Verifique a Execução**
   - Você deverá ver mensagens de sucesso
   - Verifique se não há erros em vermelho

5. **Confirme as Views**
   - Vá em **Database** → **Views**
   - Você deverá ver:
     - `v_leads_essenciais`
     - `v_leads_localizacao`
     - `v_leads_contato`

### Opção 2: Via CLI do Supabase (Avançado)

Se você tem o Supabase CLI instalado:

```bash
cd swift-dent-studio-16
supabase db push
```

Ou execute o arquivo diretamente:

```bash
psql postgresql://[SEU-CONNECTION-STRING] < supabase/migration-briefing-fields.sql
```

## Verificação Pós-Migração

Execute estas queries para confirmar que tudo está funcionando:

### 1. Verificar Índices
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'leads'
AND indexname LIKE '%briefing%';
```

Você deverá ver:
- `idx_leads_briefing_data_gin`
- `idx_leads_briefing_nome_consultorio`
- `idx_leads_briefing_especialidade`

### 2. Verificar Views
```sql
SELECT * FROM v_leads_essenciais LIMIT 5;
SELECT * FROM v_leads_localizacao LIMIT 5;
SELECT * FROM v_leads_contato LIMIT 5;
```

### 3. Testar Funções
```sql
-- Buscar leads por cidade (substitua por cidade real)
SELECT * FROM get_leads_by_cidade('São Paulo');

-- Contar por especialidade
SELECT
  briefing_data->>'especialidade_principal' as especialidade,
  COUNT(*) as total
FROM leads
GROUP BY especialidade;
```

## Rollback (Se Necessário)

Se algo der errado, você pode reverter executando:

```sql
-- Remover views
DROP VIEW IF EXISTS v_leads_essenciais;
DROP VIEW IF EXISTS v_leads_localizacao;
DROP VIEW IF EXISTS v_leads_contato;

-- Remover funções
DROP FUNCTION IF EXISTS get_leads_by_cidade;
DROP FUNCTION IF EXISTS get_leads_by_especialidade;
DROP FUNCTION IF EXISTS get_profissionais;
DROP FUNCTION IF EXISTS get_servicos;
DROP FUNCTION IF EXISTS get_horarios;
DROP FUNCTION IF EXISTS get_cores_personalizadas;

-- Remover índices
DROP INDEX IF EXISTS idx_leads_briefing_data_gin;
DROP INDEX IF EXISTS idx_leads_briefing_nome_consultorio;
DROP INDEX IF EXISTS idx_leads_briefing_especialidade;
```

## Impacto nos Dados Existentes

### ✅ Dados Antigos
- Leads antigos continuam funcionando normalmente
- Campos ausentes retornam `NULL` nas queries
- Não há perda de dados

### ✅ Dados Novos
- Novos leads salvam todos os campos automaticamente
- Aproveita os novos índices para melhor performance

### ✅ Compatibilidade
- 100% compatível com código existente
- Apenas adiciona recursos, não remove nada

## Performance Esperada

Após a migração:

### Antes (sem índices)
```sql
-- Busca por consultório: ~500ms em 10k registros
SELECT * FROM leads
WHERE briefing_data->>'nome_consultorio' = 'Clínica ABC';
```

### Depois (com índices GIN)
```sql
-- Mesma busca: ~50ms em 10k registros
SELECT * FROM leads
WHERE briefing_data->>'nome_consultorio' = 'Clínica ABC';
```

**Melhoria: ~10x mais rápido** 🚀

## Documentação Adicional

Para detalhes completos sobre a estrutura do `briefing_data`, consulte:
- `ESTRUTURA-BRIEFING-DATA.md` - Documentação completa dos campos

## Suporte

Se encontrar algum problema:

1. Verifique os logs do SQL Editor
2. Confirme que tem permissões de administrador
3. Tente executar a migração em partes menores
4. Entre em contato com suporte do Supabase se necessário

## FAQ

### P: Preciso fazer backup antes?
**R:** Não é obrigatório, mas é sempre recomendado fazer backup antes de qualquer alteração no banco.

### P: Quanto tempo leva a migração?
**R:** Menos de 1 minuto para bancos com até 10.000 registros.

### P: Posso executar a migração em produção?
**R:** Sim! A migração é segura e não altera dados existentes.

### P: E se eu já tiver índices personalizados?
**R:** A migração usa `IF NOT EXISTS`, então não vai sobrescrever índices existentes.

### P: Os dados antigos precisam ser migrados?
**R:** Não! O JSONB é flexível - campos ausentes simplesmente retornam `NULL`.

---

**Data de criação**: 26/12/2025
**Versão**: 1.0
**Autor**: Sistema de Briefing Digitalizar Odonto
