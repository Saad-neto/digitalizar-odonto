# 🕐 Horário Contínuo: 9h às 20h

## ✅ Alteração Realizada

**Horário de atendimento atualizado:**
- **Antes:** Segunda a Quinta (9h-12h, 14h-18h) | Sexta (9h-12h, 14h-17h)
- **Depois:** Segunda a Sexta (9h às 20h) - **Horário contínuo, sem intervalo**

---

## 🚀 Como Aplicar (2 Passos)

### **PASSO 1: Atualizar Banco de Dados** ⭐

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo: **`supabase/horario-continuo-9-20.sql`**
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **RUN**

**Resultado esperado:**
```
Segunda a Sexta: 11 horários disponíveis
09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00
```

---

### **PASSO 2: Deploy do Frontend**

O código do frontend já foi atualizado:
- ✅ `src/pages/Agendar.tsx` - Descrição atualizada para "9h às 20h (horário contínuo)"

**Deploy:**

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Build
npm run build

# Deploy (se usar Git/Netlify)
git add .
git commit -m "Atualizar horário para 9h-20h contínuo"
git push origin main
```

---

## 📊 Comparação

### ANTES (com intervalo):
```
Manhã: 09:00, 10:00, 11:00
[Intervalo de almoço - sem atendimento]
Tarde: 14:00, 15:00, 16:00, 17:00
= 7 horários por dia (segunda a quinta)
```

### DEPOIS (contínuo):
```
09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00
= 11 horários por dia (segunda a sexta)
```

---

## 🎯 Benefícios

- ✅ **+ 4 horários por dia** (11 ao invés de 7)
- ✅ **+ 57% de capacidade** de agendamento
- ✅ **Horário do almoço disponível** (12h, 13h)
- ✅ **Horário noturno** até 19h (último horário)
- ✅ **Mesmo horário** todos os dias úteis (segunda a sexta)

---

## 🧪 Testar

### 1. No Supabase (após executar o SQL):
```sql
-- Ver horários de segunda-feira, 13/01/2025
SELECT horario::text
FROM listar_horarios_disponiveis('2025-01-13')
ORDER BY horario;

-- Deve retornar 11 horários
```

### 2. No Site (após deploy):
1. Acesse: `https://sites-odonto.digitalizar.space/agendar`
2. Selecione uma data (segunda a sexta)
3. Deve mostrar **11 horários** de 09:00 até 19:00
4. Descrição deve dizer: "Segunda a Sexta: 9h às 20h (horário contínuo)"

---

## 📝 O que foi alterado:

### Banco de Dados:
- ✅ Removidos horários com intervalo (manhã/tarde separados)
- ✅ Adicionado horário único contínuo: 09:00-20:00
- ✅ Configurado para segunda a sexta (dias 1-5)
- ✅ Mantido slots de 60 minutos

### Frontend:
- ✅ Atualizada descrição de horários em `src/pages/Agendar.tsx`
- ✅ Removida referência ao intervalo de almoço
- ✅ Unificado texto para "Segunda a Sexta"

---

## 🔄 Reverter (se necessário)

Se quiser voltar para o horário com intervalo:

```sql
DELETE FROM disponibilidade;

-- Segunda a Sexta - Manhã
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
SELECT dia, '09:00', '12:00', 60, true
FROM generate_series(1, 5) AS dia;

-- Segunda a Quinta - Tarde
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
SELECT dia, '14:00', '18:00', 60, true
FROM generate_series(1, 4) AS dia;

-- Sexta - Tarde
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot, ativo)
VALUES (5, '14:00', '17:00', 60, true);
```

---

## ✅ Checklist

- [ ] Executei `horario-continuo-9-20.sql` no Supabase
- [ ] Vi que foram criados 5 registros (segunda a sexta)
- [ ] Teste SQL retornou 11 horários
- [ ] Fiz build do frontend (`npm run build`)
- [ ] Fiz deploy
- [ ] Testei em `/agendar` e vi 11 horários
- [ ] Descrição mostra "9h às 20h (horário contínuo)"

---

## 💡 Dica

Agora você pode agendar reuniões:
- Durante o horário de almoço (12h, 13h)
- No final da tarde/noite (até 19h)
- Sem se preocupar com intervalos

**Mais flexibilidade para seus clientes!** 🎉
