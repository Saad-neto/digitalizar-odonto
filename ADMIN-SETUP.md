# 🎯 Configuração do Dashboard Administrativo - Fase 2

## ⚠️ IMPORTANTE: Execute este SQL no Supabase

Antes de usar as novas funcionalidades (Timeline e Notas), você **PRECISA** executar o SQL abaixo no Supabase.

### Como executar:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Entre no projeto **"Sites odonto"**
3. No menu lateral, clique em **"SQL Editor"** (ícone </>)
4. Clique em **"New query"**
5. Cole o SQL do arquivo `supabase-migrations.sql`
6. Clique em **"Run"** ou pressione `Ctrl+Enter`

---

## ✨ Novas Funcionalidades Implementadas

### 1. Timeline de Histórico 📅
- **Aba "Timeline"** na página de detalhes do lead
- Mostra todas as mudanças de status automaticamente
- Timeline visual com indicadores coloridos
- Data e hora de cada mudança

### 2. Sistema de Notas Internas 💬
- **Aba "Notas"** na página de detalhes do lead
- Adicionar notas sobre cada lead
- Deletar notas quando necessário
- Útil para comunicação interna da equipe
- Anotações sobre o cliente, preferências, observações, etc.

### 3. Download de PDF 📄
- **Botão "PDF"** no header da página de detalhes
- Gera PDF completo do briefing
- Inclui todas as informações do lead
- Formatação profissional
- Nome do arquivo: `briefing-nome-da-clinica.pdf`

### 4. Download de Imagens em ZIP 📦
- **Botão "Imagens"** no header da página de detalhes
- Baixa todas as imagens do briefing em um arquivo ZIP
- Organizado em pastas:
  - `/logo` - Logo da clínica
  - `/clinica` - Foto da clínica
  - `/profissionais` - Fotos dos profissionais
  - `/depoimentos` - Fotos dos depoimentos
- Nome do arquivo: `imagens-nome-da-clinica.zip`

### 5. Notificações Visuais 🔔
- Notificação quando status é alterado
- Notificação quando PDF é baixado
- Notificação quando ZIP é baixado
- Aparecem no canto superior direito
- Desaparecem automaticamente após 3 segundos

### 6. Melhorias na Interface ✨
- Aba "Notas" adicionada
- Botões de download no header
- Versão mobile dos botões de download
- Timeline visual redesenhada
- Melhor feedback ao usuário

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:

#### `lead_status_history`
Armazena o histórico de mudanças de status de cada lead.

```sql
CREATE TABLE public.lead_status_history (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP,
  created_at TIMESTAMP
);
```

#### `lead_notes`
Armazena as notas internas de cada lead.

```sql
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Trigger Automático:

Um trigger foi criado para registrar automaticamente cada mudança de status na tabela `lead_status_history`.

```sql
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION log_status_change();
```

Isso significa que **você não precisa fazer nada manualmente** - toda vez que o status de um lead mudar, será criado um registro no histórico automaticamente!

---

## 📦 Bibliotecas Adicionadas

### jsPDF
Para gerar PDFs do briefing.

```bash
npm install jspdf
```

### JSZip
Para criar arquivos ZIP com as imagens.

```bash
npm install jszip
```

### date-fns
Para formatação de datas (já estava instalado).

```bash
npm install date-fns
```

---

## 🚀 Como Usar

### Timeline:
1. Abra qualquer lead no dashboard
2. Clique na aba **"Timeline"**
3. Veja o histórico completo de mudanças

### Notas:
1. Abra qualquer lead no dashboard
2. Clique na aba **"Notas"**
3. Digite sua nota no campo de texto
4. Clique em **"Adicionar Nota"**
5. Para deletar, clique no ícone de lixeira ao lado da nota

### Download de PDF:
1. Abra qualquer lead no dashboard
2. Clique no botão **"PDF"** no header (ou "Baixar PDF" no mobile)
3. O PDF será gerado e baixado automaticamente

### Download de Imagens:
1. Abra qualquer lead no dashboard
2. Clique no botão **"Imagens"** no header (ou "Baixar Imagens" no mobile)
3. O ZIP será gerado e baixado automaticamente

---

## ⚡ Performance

- Timeline carrega automaticamente ao abrir a aba
- Notas são recarregadas após adicionar/deletar
- Downloads são assíncronos (não travam a interface)
- Notificações desaparecem sozinhas

---

## 🐛 Troubleshooting

### "Nenhuma mudança de status ainda"
- Normal para leads novos que nunca tiveram o status alterado
- Assim que você alterar o status, aparecerá na timeline

### "Nenhuma imagem encontrada para download"
- O lead não tem imagens no briefing
- Ou as URLs das imagens estão inválidas/expiradas

### "Erro ao gerar PDF"
- Verifique se todas as informações do lead estão corretas
- Verifique o console do navegador para mais detalhes

### Timeline não aparece
- Você executou o SQL no Supabase?
- Verifique se as tabelas foram criadas corretamente

---

## 📝 Próximas Melhorias (Fase 3)

- [ ] Kanban Board (arrastar e soltar leads entre colunas)
- [ ] Notificações por email automáticas
- [ ] Relatórios e gráficos
- [ ] Multi-usuário com permissões
- [ ] Integração com WhatsApp automático
- [ ] Sistema de aprovação de sites
- [ ] Upload de sites finalizados

---

**Data de Implementação:** 08/12/2025
**Versão:** 2.0.0 (Fase 2)
