# 🔧 Correção do Sistema de Agendamentos

## 🚨 Problema Identificado

O erro ao **inserir horários disponíveis** acontece porque a função SQL `listar_horarios_disponiveis` não existe ou está com problemas de permissão no banco de dados Supabase.

---

## ✅ Solução em 3 Passos

### **PASSO 1: Diagnóstico (Opcional mas recomendado)**

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** (menu lateral esquerdo)
3. Clique em **New Query**
4. Abra o arquivo: `supabase/diagnostico-agendamentos.sql`
5. Copie TODO o conteúdo do arquivo
6. Cole no SQL Editor
7. Clique em **RUN** (ou pressione Ctrl/Cmd + Enter)

**O que você verá:**
- Se as tabelas existem
- Se as funções existem
- Quantos horários estão configurados
- Status das políticas RLS

**Se houver qualquer erro ou dado faltando, prossiga para o PASSO 2.**

---

### **PASSO 2: Correção Completa** ⭐ **EXECUTAR ESTE**

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** (menu lateral esquerdo)
3. Clique em **New Query**
4. Abra o arquivo: `supabase/fix-agendamentos-completo.sql`
5. Copie TODO o conteúdo do arquivo (3000+ linhas)
6. Cole no SQL Editor
7. Clique em **RUN** (ou pressione Ctrl/Cmd + Enter)
8. **Aguarde** - pode levar 10-30 segundos

**O que este script faz:**
- ✅ Remove configurações antigas problemáticas
- ✅ Recria todas as tabelas (se necessário)
- ✅ Cria as funções SQL necessárias
- ✅ Insere 8 horários padrão (Segunda a Sexta, manhã e tarde)
- ✅ Configura todas as políticas RLS corretamente
- ✅ Cria views úteis
- ✅ Executa testes automáticos

**Resultados esperados:**
Você deve ver no final da execução:
```
TESTE: Listar horários disponíveis | total_horarios: 14
CONFIGURAÇÃO: Horários por dia da semana
- Segunda-feira: 09:00 - 12:00 (30 min)
- Segunda-feira: 14:00 - 18:00 (30 min)
- Terça-feira: 09:00 - 12:00 (30 min)
... (e assim por diante)
POLÍTICAS RLS CRIADAS
- várias políticas listadas
```

---

### **PASSO 3: Testar no Site**

1. Acesse sua página de agendamento: `https://sites-odonto.digitalizar.space/agendar`
2. Preencha as informações pessoais
3. Clique em "Próximo"
4. Selecione uma data (segunda a sexta)
5. **Deve aparecer os horários disponíveis!** ✅

Se ainda não aparecer:
- Abra o Console do navegador (F12)
- Vá na aba "Console"
- Tente novamente e veja se há algum erro vermelho
- Anote o erro e me envie

---

## 🔄 Se Algo Der Errado

### Erro: "function listar_horarios_disponiveis does not exist"
**Solução:** Execute novamente o `fix-agendamentos-completo.sql`

### Erro: "permission denied for function"
**Solução:** As funções foram criadas com `SECURITY DEFINER`, o que já resolve isso. Se persistir:
```sql
-- Execute isto no SQL Editor:
GRANT EXECUTE ON FUNCTION listar_horarios_disponiveis(DATE) TO anon;
GRANT EXECUTE ON FUNCTION listar_horarios_disponiveis(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION verificar_disponibilidade(DATE, TIME) TO anon;
GRANT EXECUTE ON FUNCTION verificar_disponibilidade(DATE, TIME) TO authenticated;
```

### Erro: "relation 'disponibilidade' does not exist"
**Solução:** A tabela não foi criada. Execute o `fix-agendamentos-completo.sql` novamente.

### Não aparece nenhum horário
**Causas possíveis:**
1. Você selecionou um sábado ou domingo (não há horários configurados)
2. A tabela `disponibilidade` está vazia
3. Você selecionou uma data passada

**Solução:**
```sql
-- Execute no SQL Editor para verificar:
SELECT * FROM disponibilidade WHERE ativo = true;

-- Se retornar 0 registros, execute:
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo) VALUES
  (1, '09:00', '12:00', 30, true),
  (1, '14:00', '18:00', 30, true),
  (2, '09:00', '12:00', 30, true),
  (2, '14:00', '18:00', 30, true),
  (3, '09:00', '12:00', 30, true),
  (3, '14:00', '18:00', 30, true),
  (4, '09:00', '12:00', 30, true),
  (4, '14:00', '18:00', 30, true),
  (5, '09:00', '12:00', 30, true),
  (5, '14:00', '17:00', 30, true);
```

---

## 📊 Personalizar Horários (Opcional)

Depois que tudo estiver funcionando, você pode alterar os horários:

```sql
-- Ver horários atuais
SELECT
  CASE dia_semana
    WHEN 1 THEN 'Segunda'
    WHEN 2 THEN 'Terça'
    WHEN 3 THEN 'Quarta'
    WHEN 4 THEN 'Quinta'
    WHEN 5 THEN 'Sexta'
  END as dia,
  horario_inicio,
  horario_fim,
  duracao_slot
FROM disponibilidade
WHERE ativo = true
ORDER BY dia_semana, horario_inicio;

-- Exemplo: Alterar sexta para fechar às 16h
UPDATE disponibilidade
SET horario_fim = '16:00'
WHERE dia_semana = 5 AND horario_inicio = '14:00';

-- Exemplo: Adicionar horário no sábado de manhã
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (6, '09:00', '12:00', 30, true);
```

---

## 🎯 Checklist Final

- [ ] Execute o script de diagnóstico (opcional)
- [ ] Execute o script de correção completa (`fix-agendamentos-completo.sql`)
- [ ] Veja as mensagens de sucesso no SQL Editor
- [ ] Acesse `/agendar` no site
- [ ] Selecione uma data de segunda a sexta
- [ ] Veja os horários disponíveis aparecerem
- [ ] Teste fazer um agendamento completo
- [ ] Verifique no `/admin/agendamentos` se apareceu

---

## 💡 Dica

Se você tiver muitos dados de teste e quiser limpar:

```sql
-- CUIDADO: Isso apaga TODOS os agendamentos
-- USE APENAS EM AMBIENTE DE TESTE
TRUNCATE TABLE agendamentos CASCADE;
```

---

## 📞 Precisa de Ajuda?

Se após seguir todos os passos ainda houver erro:

1. Execute o diagnóstico e copie os resultados
2. Abra o Console do navegador (F12) e copie os erros
3. Me envie ambos para análise

---

**Boa sorte! 🚀**
