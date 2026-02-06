# 🕐 Atualização: Slots de 1 Hora + Formato HH:MM

## ✅ Alterações Realizadas

1. **Slots de agendamento**: 30 minutos → **1 hora**
2. **Formato de exibição**: HH:MM:SS → **HH:MM** (sem segundos)

---

## 🚀 Como Aplicar

### PASSO 1: Atualizar Banco de Dados (Supabase)

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo: `supabase/alterar-slots-1hora.sql`
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **RUN**

**Resultado esperado:**
```
Segunda a Quinta: 7 horários disponíveis
- Manhã: 09:00, 10:00, 11:00
- Tarde: 14:00, 15:00, 16:00, 17:00

Sexta: 6 horários disponíveis
- Manhã: 09:00, 10:00, 11:00
- Tarde: 14:00, 15:00, 16:00
```

---

### PASSO 2: Atualizar Frontend (Deploy)

O código do frontend já foi atualizado:
- ✅ `src/lib/supabase.ts` - Formata horários para HH:MM
- ✅ `src/pages/admin/Agendamentos.tsx` - Já usa formato correto

**Deploy:**

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Build do projeto
npm run build

# Fazer deploy (Netlify ou seu método atual)
# Se usar Netlify, basta dar push no git
git add .
git commit -m "Atualizar slots para 1h e formato HH:MM"
git push origin main
```

**OU deploy manual (se não usar git):**
```bash
# Copiar dist/ para seu servidor
# Ou fazer upload no Netlify via dashboard
```

---

## 🧪 Testar

### 1. Testar SQL (Supabase)
```sql
-- Ver configuração atual
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
  duracao_slot || ' min' as duracao
FROM disponibilidade
WHERE ativo = true
ORDER BY dia_semana, horario_inicio;

-- Resultado esperado: duracao_slot = 60 min
```

### 2. Testar Frontend
1. Acesse: `https://sites-odonto.digitalizar.space/agendar`
2. Selecione uma data (segunda a sexta)
3. **Deve mostrar 7 horários** (segunda a quinta) ou **6 horários** (sexta)
4. Horários no formato: **09:00, 10:00, 11:00** (sem segundos)

### 3. Testar Admin
1. Acesse: `/admin/agendamentos`
2. Veja um agendamento existente
3. Horário deve aparecer como: **14:00** (não 14:00:00)

---

## 🎯 Comparação

### ANTES (30 minutos):
```
09:00:00, 09:30:00, 10:00:00, 10:30:00, 11:00:00, 11:30:00
14:00:00, 14:30:00, 15:00:00, 15:30:00, 16:00:00, 16:30:00, 17:00:00, 17:30:00
Total: 14 horários
```

### DEPOIS (1 hora):
```
09:00, 10:00, 11:00
14:00, 15:00, 16:00, 17:00
Total: 7 horários
```

---

## 🔄 Reverter (se necessário)

Se quiser voltar para slots de 30 minutos:

```sql
UPDATE disponibilidade
SET duracao_slot = 30
WHERE duracao_slot = 60;
```

---

## ✅ Checklist

- [ ] Executei `alterar-slots-1hora.sql` no Supabase
- [ ] Vi que a duração mudou para 60 minutos
- [ ] Fiz build do frontend (`npm run build`)
- [ ] Fiz deploy do frontend
- [ ] Testei em `/agendar` e vi 7 horários (ao invés de 14)
- [ ] Horários aparecem sem segundos (09:00 ao invés de 09:00:00)
- [ ] Admin mostra horários no formato correto

---

**Pronto! Sistema atualizado para agendamentos de 1 em 1 hora.** 🎉
