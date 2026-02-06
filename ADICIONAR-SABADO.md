# 🗓️ Atualização: Adicionar Sábado ao Agendamento

## ✅ Alteração Realizada

**Horário de atendimento atualizado:**
- **Antes:** Segunda a Sexta (9h-20h) | Sábado e Domingo fechados
- **Depois:** Segunda a Sábado (9h-20h) | Apenas Domingo fechado

---

## 🚀 Como Aplicar (2 Passos)

### **PASSO 1: Atualizar Banco de Dados** ⭐

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Abra o arquivo: **`supabase/adicionar-sabado.sql`**
4. Copie TODO o conteúdo
5. Cole no SQL Editor
6. Clique em **RUN**

**Resultado esperado:**
```
Sábado adicionado com sucesso!
11 horários disponíveis:
09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00
```

---

### **PASSO 2: Deploy do Frontend**

O código do frontend já foi atualizado:
- ✅ `src/pages/Agendar.tsx` - Habilitado sábado no calendário
- ✅ `src/pages/Agendar.tsx` - Texto atualizado para "Segunda a Sábado"

**Deploy:**

```bash
cd /root/projetos/sites/sites-odonto/projeto-principal/swift-dent-studio-16

# Build
npm run build

# Deploy (se usar Git/Netlify)
git add .
git commit -m "Adicionar sábado ao horário de atendimento (9h-20h)"
git push origin main
```

---

## 📊 Comparação

| Item | Antes | Depois |
|------|-------|--------|
| **Dias úteis** | Segunda a Sexta (5 dias) | Segunda a Sábado (6 dias) |
| **Horário sábado** | ❌ Fechado | ✅ 9h-20h (11 horários) |
| **Capacidade semanal** | 55 horários/semana | **66 horários/semana** (+20%) |
| **Calendário** | Sábado bloqueado | Sábado selecionável |

---

## 🎯 Benefícios

- ✅ **+20% de capacidade** semanal (66 vs 55 horários)
- ✅ **Mais opções** para clientes que trabalham durante a semana
- ✅ **Final de semana** disponível
- ✅ **Mesmo horário** todos os dias (segunda a sábado)

---

## 🧪 Testar

### 1. No Supabase (após executar o SQL):
```sql
-- Ver horários de sábado, 18/01/2025
SELECT horario::text
FROM listar_horarios_disponiveis('2025-01-18')
ORDER BY horario;

-- Deve retornar 11 horários
```

### 2. No Site (após deploy):
1. Acesse: `https://sites-odonto.digitalizar.space/agendar`
2. Preencha os dados
3. **Tente selecionar um sábado** - Agora deve estar habilitado! ✅
4. Veja os 11 horários disponíveis
5. Descrição deve dizer: "Segunda a Sábado: 9h às 20h (horário contínuo)"
6. Descrição deve dizer: "Domingo: Não atendemos"

---

## 📝 O que foi alterado:

### Banco de Dados:
- ✅ Adicionado dia 6 (Sábado) na tabela `disponibilidade`
- ✅ Horário: 09:00-20:00 (igual aos outros dias)
- ✅ Slots de 60 minutos

### Frontend:
- ✅ Removido bloqueio de sábado no calendário
- ✅ Atualizada função `isDateDisabled()` - agora bloqueia apenas domingo
- ✅ Atualizado texto informativo: "Segunda a Sábado" ao invés de "Segunda a Sexta"

### Documentação:
- ✅ `AGENDAMENTOS-README.md` atualizado

---

## 🔄 Reverter (se necessário)

Se quiser remover o sábado:

```sql
-- Remover sábado
DELETE FROM disponibilidade WHERE dia_semana = 6;
```

E reverter o frontend:
```javascript
// Em src/pages/Agendar.tsx, linha 192
return dayOfWeek === 0 || dayOfWeek === 6; // Bloquear domingo E sábado
```

---

## ✅ Checklist

- [ ] Executei `adicionar-sabado.sql` no Supabase
- [ ] Vi que sábado foi adicionado com 11 horários
- [ ] Fiz build do frontend (`npm run build`)
- [ ] Fiz deploy
- [ ] Testei selecionar um sábado no calendário (deve funcionar)
- [ ] Vi 11 horários disponíveis para sábado
- [ ] Texto mostra "Segunda a Sábado: 9h às 20h"
- [ ] Texto mostra "Domingo: Não atendemos"

---

## 💼 Capacidade Total do Sistema

Com essa atualização:
- **66 horários por semana** (11 horários × 6 dias)
- **~264 horários por mês** (em média)
- **Melhor aproveitamento** do tempo disponível

**Perfeito para atender mais clientes!** 🎉
