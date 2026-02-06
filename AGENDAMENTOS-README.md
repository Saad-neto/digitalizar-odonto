# 📅 Sistema de Agendamento de Reuniões

## ✅ Sistema Implementado com Sucesso!

### O que foi criado:

1. **📊 Banco de Dados** (`supabase/agendamentos-setup.sql`)
   - Tabela `agendamentos` (armazena todas as reuniões)
   - Tabela `disponibilidade` (horários disponíveis por dia da semana)
   - Tabela `bloqueios` (feriados, férias, etc)
   - Funções SQL para verificar disponibilidade
   - Triggers e índices otimizados

2. **🔧 Backend** (`src/lib/supabase.ts`)
   - `createAgendamento()` - Criar novo agendamento
   - `listarHorariosDisponiveis()` - Buscar horários livres
   - `verificarDisponibilidade()` - Checar se horário está disponível
   - `listarAgendamentos()` - Listar com filtros
   - `updateAgendamentoStatus()` - Atualizar status
   - `remarcarAgendamento()` - Remarcar data/horário

3. **🎨 Frontend**
   - `/agendar` - Página pública de agendamento (4 etapas)
   - `/admin/agendamentos` - Painel admin para gerenciar

---

## 🚀 Como Ativar

### Passo 1: Executar SQL no Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** (menu lateral)
3. Abra o arquivo: `supabase/agendamentos-setup.sql`
4. Copie todo o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **RUN** (Ctrl/Cmd + Enter)

✅ Isso criará:
- 3 tabelas (`agendamentos`, `disponibilidade`, `bloqueios`)
- 2 funções SQL (`verificar_disponibilidade`, `listar_horarios_disponiveis`)
- Disponibilidade padrão (Segunda a Sexta)

### Passo 2: Build e Deploy

```bash
cd /root/projetos/sites-odonto/swift-dent-studio-16

# Build da nova versão
docker build -t digitalizar-odonto:latest .

# Deploy
docker service update --image digitalizar-odonto:latest --force digitalizar-odonto_digitalizar-odonto
```

---

## 📖 Como Usar

### Para Clientes (Página Pública)

**URL**: `https://sites-odonto.digitalizar.space/agendar`

**Fluxo**:
1. Cliente preenche seus dados (nome, email, WhatsApp)
2. Escolhe uma data disponível no calendário
3. Seleciona um horário disponível
4. Revisa e confirma o agendamento

✅ Sistema bloqueia automaticamente:
- Finais de semana
- Datas passadas
- Horários já ocupados

### Para Admin (Painel)

**URL**: `https://sites-odonto.digitalizar.space/admin/agendamentos`

**Funcionalidades**:
- ✅ Visualizar todos os agendamentos
- ✅ Filtrar por status (agendado, confirmado, realizado, cancelado)
- ✅ Buscar por nome, email ou telefone
- ✅ Confirmar agendamentos
- ✅ Marcar como realizado
- ✅ Cancelar com motivo
- ✅ Dashboard com estatísticas

---

## 🕐 Horários Configurados

**Segunda a Sábado:**
- 9h às 20h (horário contínuo, sem intervalo)
- Slots de 1 hora (60 minutos)
- 11 horários disponíveis por dia

**Domingo:** Não atende

---

## 🔧 Personalização

### Alterar Horários Disponíveis

Execute no SQL Editor do Supabase:

```sql
-- Ver horários atuais
SELECT * FROM disponibilidade ORDER BY dia_semana, horario_inicio;

-- Alterar horário (exemplo: fechar mais cedo na sexta)
UPDATE disponibilidade
SET horario_fim = '16:00'
WHERE dia_semana = 5 AND horario_inicio = '14:00';

-- Adicionar horário no sábado
INSERT INTO disponibilidade (dia_semana, horario_inicio, horario_fim, duracao_slot)
VALUES (6, '09:00', '12:00', 30);
```

### Bloquear Datas (Feriados/Férias)

```sql
-- Bloquear feriado (25/12/2025)
INSERT INTO bloqueios (data_inicio, data_fim, motivo, ativo)
VALUES ('2025-12-25', '2025-12-25', 'Natal', true);

-- Bloquear período de férias (20/01/2026 a 31/01/2026)
INSERT INTO bloqueios (data_inicio, data_fim, motivo, ativo)
VALUES ('2026-01-20', '2026-01-31', 'Férias', true);
```

---

## 📊 Status dos Agendamentos

| Status | Descrição |
|--------|-----------|
| **agendado** | Reunião foi agendada, aguardando confirmação |
| **confirmado** | Admin confirmou a reunião |
| **realizado** | Reunião foi realizada |
| **cancelado** | Reunião cancelada (com motivo) |
| **remarcado** | Data/horário foram alterados |

---

## 🔔 Próximas Melhorias (Opcional)

- [ ] Notificações por e-mail automáticas
- [ ] Notificações por WhatsApp via N8N
- [ ] Integração com Google Calendar
- [ ] Lembretes automáticos (24h antes)
- [ ] Link de reunião automático (Google Meet/Zoom)

---

## 📱 Páginas Criadas

### 1. `/agendar` - Página Pública

Formulário em 4 etapas:
- **Etapa 1**: Informações pessoais
- **Etapa 2**: Escolher data (calendário interativo)
- **Etapa 3**: Escolher horário (slots disponíveis)
- **Etapa 4**: Confirmar agendamento

### 2. `/admin/agendamentos` - Painel Admin

Dashboard completo:
- Cards com estatísticas
- Lista de agendamentos
- Filtros por status
- Busca por nome/email/telefone
- Ações (confirmar, cancelar, marcar como realizado)

---

## 🎯 Fluxo Completo

```
Cliente acessa /agendar
    ↓
Preenche dados pessoais
    ↓
Seleciona data disponível
    ↓
Sistema mostra apenas horários livres
    ↓
Cliente escolhe horário
    ↓
Revisa e confirma
    ↓
Agendamento criado com status "agendado"
    ↓
Admin recebe notificação (email/whatsapp)
    ↓
Admin confirma no painel (/admin/agendamentos)
    ↓
Status muda para "confirmado"
    ↓
Após reunião, admin marca como "realizado"
```

---

## ⚙️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Componentes**: shadcn/ui (Calendar, Button, etc)
- **Datas**: date-fns (formatação e manipulação)
- **Validações**: Cliente e servidor
- **RLS**: Row Level Security ativado

---

## 🐛 Troubleshooting

### Problema: "Função não encontrada"

**Solução**: Execute novamente o SQL no Supabase:
```bash
cat supabase/agendamentos-setup.sql
# Copie e execute no SQL Editor
```

### Problema: "Horários não aparecem"

**Solução**: Verifique a disponibilidade:
```sql
SELECT * FROM disponibilidade WHERE ativo = true;
```

### Problema: "Erro ao agendar"

**Solução**: Verifique os logs do Supabase e permissões RLS

---

## ✅ Checklist de Ativação

- [ ] SQL executado no Supabase
- [ ] Tabelas criadas com sucesso
- [ ] Build feito (`docker build`)
- [ ] Deploy realizado (`docker service update`)
- [ ] Página `/agendar` acessível
- [ ] Página `/admin/agendamentos` acessível
- [ ] Teste de agendamento completo
- [ ] Admin consegue confirmar/cancelar

---

## 📞 Suporte

Em caso de dúvidas, verifique:
1. Logs do Supabase (Functions → Logs)
2. Console do navegador (F12)
3. Logs do Docker (`docker service logs digitalizar-odonto_digitalizar-odonto`)

---

**Sistema pronto para uso!** 🎉
