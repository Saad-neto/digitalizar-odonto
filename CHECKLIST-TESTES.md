# ✅ Checklist Completo de Testes - Dashboard Administrativo

## 🎯 Instruções de Uso

Este checklist cobre TODAS as funcionalidades implementadas nas 3 fases do projeto.

**Como usar:**
- [ ] Marque cada item após testar
- ⚠️ Anote problemas encontrados
- ✅ Confirme funcionamento correto
- 🐛 Reporte bugs se encontrar

---

## 🔐 FASE 1 - AUTENTICAÇÃO E BÁSICO

### Login e Autenticação
- [ ] **Login - Usuário Válido**
  - Acesse: https://digitalizar-odonto.pages.dev/admin/login
  - Digite email e senha corretos
  - Clique em "Entrar"
  - ✅ Deve redirecionar para `/admin/dashboard`
  - ✅ Não deve mostrar erros

- [ ] **Login - Usuário Inválido**
  - Digite email ou senha incorretos
  - Clique em "Entrar"
  - ✅ Deve mostrar mensagem de erro
  - ✅ Não deve redirecionar

- [ ] **Login - Campos Vazios**
  - Deixe campos em branco
  - Tente fazer login
  - ✅ Deve validar e mostrar erro

- [ ] **Login - Persistência de Sessão**
  - Faça login com sucesso
  - Feche a aba/navegador
  - Abra novamente `/admin/dashboard`
  - ✅ Deve continuar logado (não pedir login novamente)

- [ ] **Logout**
  - Estando logado, clique em "Sair" no header
  - ✅ Deve deslogar e redirecionar para `/admin/login`
  - ✅ Tentar acessar dashboard deve pedir login novamente

- [ ] **Proteção de Rotas**
  - SEM estar logado, tente acessar:
    - `/admin/dashboard`
    - `/admin/leads/qualquer-id`
    - `/admin/reports`
  - ✅ Todas devem redirecionar para `/admin/login`

---

### Dashboard Principal

- [ ] **Carregamento Inicial**
  - Acesse `/admin/dashboard` logado
  - ✅ Deve mostrar loading spinner
  - ✅ Depois deve carregar leads
  - ✅ Não deve mostrar erros no console

- [ ] **Cards de Métricas**
  - Verifique os 4 cards no topo:
    - [ ] **Novos** - mostra quantidade correta
    - [ ] **Produção** - mostra quantidade correta
    - [ ] **Prontos** - mostra quantidade correta
    - [ ] **Total Mês** - mostra valor em R$ correto
  - ✅ Números devem bater com a quantidade real de leads

- [ ] **Lista de Leads**
  - [ ] Deve mostrar todos os leads
  - [ ] Cada lead deve ter:
    - Badge de status colorido
    - Nome da clínica
    - Nome do profissional
    - Email
    - WhatsApp
    - Tempo decorrido (ex: "Há 2 horas")
    - Botão "Ver Detalhes"
  - [ ] Leads urgentes (24h) devem ter badge "⚠️ URGENTE"

- [ ] **Busca**
  - Digite no campo de busca:
    - [ ] Nome de uma clínica → deve filtrar
    - [ ] Nome de um profissional → deve filtrar
    - [ ] Email → deve filtrar
    - [ ] Telefone → deve filtrar
  - [ ] Busca deve funcionar em tempo real
  - [ ] Limpar busca deve mostrar todos novamente

- [ ] **Filtro por Status**
  - Selecione cada status no dropdown:
    - [ ] "Todos os Status" → mostra todos
    - [ ] "Novo" → mostra só novos
    - [ ] "Pago 50%" → mostra só pago 50%
    - [ ] "Em Produção" → mostra só em produção
    - [ ] "Em Aprovação" → mostra só em aprovação
    - [ ] "Pago 100%" → mostra só pago 100%
    - [ ] "Concluído" → mostra só concluídos
  - ✅ Contador deve atualizar

- [ ] **Click em Lead**
  - Clique no card de qualquer lead
  - ✅ Deve abrir página de detalhes (`/admin/leads/ID`)

---

### Página de Detalhes do Lead

- [ ] **Carregamento**
  - Acesse um lead
  - ✅ Deve carregar informações completas
  - ✅ Não deve dar erro 404

- [ ] **Header**
  - [ ] Mostra nome da clínica
  - [ ] Mostra ID do lead (8 primeiros caracteres)
  - [ ] Mostra badge de status atual
  - [ ] Tem botão "← Voltar"

- [ ] **Botão Voltar**
  - Clique em "← Voltar"
  - ✅ Deve retornar ao dashboard

- [ ] **Alterar Status**
  - Teste mudar para cada status:
    - [ ] Novo
    - [ ] Pago 50%
    - [ ] Em Produção
    - [ ] Em Aprovação
    - [ ] Pago 100%
    - [ ] Concluído
  - Para cada mudança:
    - ✅ Deve mostrar loading
    - ✅ Deve atualizar badge
    - ✅ Deve mostrar notificação de sucesso
    - ✅ Notificação deve desaparecer após 3s

- [ ] **Contato Rápido - WhatsApp**
  - Clique no botão verde "WhatsApp"
  - ✅ Deve abrir WhatsApp Web em nova aba
  - ✅ Número deve estar preenchido
  - ✅ Formato: https://wa.me/55XXXXXXXXXXX

- [ ] **Contato Rápido - Email**
  - Clique no botão azul "Email"
  - ✅ Deve abrir cliente de email padrão
  - ✅ Email deve estar preenchido no destinatário

- [ ] **Copiar WhatsApp**
  - Clique no ícone de copiar ao lado do WhatsApp
  - ✅ Ícone deve mudar para checkmark verde
  - ✅ Cole em outro lugar para verificar
  - ✅ Deve voltar ao normal após 2s

- [ ] **Copiar Email**
  - Clique no ícone de copiar ao lado do email
  - ✅ Ícone deve mudar para checkmark verde
  - ✅ Cole em outro lugar para verificar
  - ✅ Deve voltar ao normal após 2s

- [ ] **Abas - Navegação**
  - Clique em cada aba:
    - [ ] Resumo
    - [ ] Briefing Completo
    - [ ] Timeline
    - [ ] Notas
  - ✅ Aba ativa deve ter fundo roxo
  - ✅ Conteúdo deve mudar

- [ ] **Aba Resumo**
  - Verifique se mostra:
    - [ ] Nome do profissional
    - [ ] Nome da clínica
    - [ ] Prazo desejado (com cores corretas)
    - [ ] Estilo do site
    - [ ] Data de criação
    - [ ] Valor total
  - [ ] Se prazo for 24h, deve mostrar alerta vermelho

- [ ] **Aba Briefing Completo**
  - [ ] Deve mostrar ReviewStep completo
  - [ ] Todas as seções devem aparecer
  - [ ] Imagens devem carregar (se houver)

---

## 🔥 FASE 2 - FUNCIONALIDADES AVANÇADAS

### ⚠️ ANTES DE TESTAR A FASE 2:

- [ ] **Executar SQL no Supabase**
  - Abra: https://supabase.com/dashboard
  - Entre no projeto "Sites odonto"
  - Vá em "SQL Editor"
  - Abra o arquivo `supabase-migrations.sql`
  - Copie TODO o conteúdo
  - Cole no SQL Editor
  - Clique em "Run"
  - ✅ Deve mostrar "Success"
  - ✅ Tabelas devem ser criadas

- [ ] **Verificar Tabelas Criadas**
  - No SQL Editor, execute:
  ```sql
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('lead_status_history', 'lead_notes');
  ```
  - ✅ Deve retornar 2 linhas

---

### Timeline de Histórico

- [ ] **Acesso à Timeline**
  - Na página de detalhes, clique na aba "Timeline"
  - ✅ Deve carregar sem erros

- [ ] **Timeline Vazia**
  - Para um lead novo sem mudanças:
    - ✅ Deve mostrar "Nenhuma mudança de status ainda"

- [ ] **Criar Histórico**
  - Mude o status de um lead 2-3 vezes
  - Volte para aba Timeline
  - ✅ Deve mostrar todas as mudanças
  - ✅ Ordem: mais recente primeiro

- [ ] **Informações no Histórico**
  - Cada item deve ter:
    - [ ] Status anterior e novo
    - [ ] Data/hora relativa (ex: "há 5 minutos")
    - [ ] Badge com cor do status
    - [ ] Linha visual conectando items

- [ ] **Timeline Visual**
  - [ ] Deve ter linha vertical
  - [ ] Pontos coloridos por status
  - [ ] Última mudança não deve ter linha embaixo

---

### Sistema de Notas

- [ ] **Acesso às Notas**
  - Na página de detalhes, clique na aba "Notas"
  - ✅ Deve carregar sem erros

- [ ] **Adicionar Nota - Sucesso**
  - Digite uma nota no campo de texto
  - Clique em "Adicionar Nota"
  - ✅ Deve mostrar loading
  - ✅ Nota deve aparecer na lista
  - ✅ Campo deve limpar
  - ✅ Timestamp deve estar correto

- [ ] **Adicionar Nota - Vazio**
  - Deixe campo vazio
  - Tente adicionar
  - ✅ Deve mostrar erro "Digite uma nota antes de enviar"
  - ✅ Não deve criar nota

- [ ] **Adicionar Múltiplas Notas**
  - Adicione 3-4 notas
  - ✅ Todas devem aparecer
  - ✅ Ordem: mais recente primeiro
  - ✅ Contador "(X notas)" deve atualizar

- [ ] **Deletar Nota**
  - Clique no ícone de lixeira em uma nota
  - ✅ Deve pedir confirmação
  - Confirme
  - ✅ Nota deve sumir da lista
  - ✅ Contador deve diminuir

- [ ] **Deletar Nota - Cancelar**
  - Clique no ícone de lixeira
  - Cancele o diálogo
  - ✅ Nota deve continuar lá

- [ ] **Notas Vazias**
  - Para lead sem notas:
    - ✅ Deve mostrar estado vazio
    - ✅ Mensagem: "Nenhuma nota ainda"

---

### Download de PDF

- [ ] **Botão PDF - Desktop**
  - No header da página de detalhes
  - ✅ Deve ter botão "PDF"

- [ ] **Botão PDF - Mobile**
  - Em tela pequena (< 768px)
  - ✅ Deve ter botão "Baixar PDF" abaixo do header

- [ ] **Gerar PDF**
  - Clique no botão PDF
  - ✅ Deve mostrar loading
  - ✅ PDF deve baixar automaticamente
  - ✅ Notificação de sucesso
  - ✅ Nome: `briefing-nome-da-clinica.pdf`

- [ ] **Conteúdo do PDF**
  - Abra o PDF baixado
  - Verifique se tem:
    - [ ] Título "Briefing - Sites Odonto 24H"
    - [ ] Informações do cliente
    - [ ] Dados da clínica
    - [ ] Diretor técnico (se houver)
    - [ ] Serviços oferecidos
    - [ ] Diferenciais
    - [ ] Endereço
    - [ ] Redes sociais
    - [ ] Footer com ID do lead
  - ✅ Formatação deve estar legível

- [ ] **PDF - Lead sem Dados**
  - Para lead com poucos dados
  - ✅ Não deve dar erro
  - ✅ Deve gerar com campos vazios

---

### Download de Imagens ZIP

- [ ] **Botão Imagens - Desktop**
  - No header da página de detalhes
  - ✅ Deve ter botão "Imagens"

- [ ] **Botão Imagens - Mobile**
  - Em tela pequena
  - ✅ Deve ter botão "Baixar Imagens"

- [ ] **Gerar ZIP - Com Imagens**
  - Para lead com imagens
  - Clique no botão
  - ✅ Deve mostrar loading
  - ✅ ZIP deve baixar
  - ✅ Notificação de sucesso
  - ✅ Nome: `imagens-nome-da-clinica.zip`

- [ ] **Conteúdo do ZIP**
  - Descompacte o ZIP
  - Verifique estrutura de pastas:
    - [ ] `/logo/` - logo da clínica
    - [ ] `/clinica/` - foto da clínica
    - [ ] `/profissionais/` - fotos dos profissionais
    - [ ] `/depoimentos/` - fotos dos depoimentos
  - ✅ Imagens devem abrir corretamente
  - ✅ Nomes devem ser descritivos

- [ ] **ZIP - Sem Imagens**
  - Para lead sem imagens
  - ✅ Deve mostrar alerta "Nenhuma imagem encontrada"
  - ✅ Não deve baixar ZIP vazio

---

### Notificações Visuais

- [ ] **Notificação - Mudança de Status**
  - Mude status de qualquer lead
  - ✅ Notificação verde aparece no topo direito
  - ✅ Texto: "✅ Status atualizado com sucesso!"
  - ✅ Some automaticamente após 3s

- [ ] **Notificação - PDF**
  - Baixe um PDF
  - ✅ Notificação: "✅ PDF baixado com sucesso!"
  - ✅ Some após 3s

- [ ] **Notificação - ZIP**
  - Baixe um ZIP
  - ✅ Notificação: "✅ Imagens baixadas com sucesso!"
  - ✅ Some após 3s

- [ ] **Notificação - Erro**
  - Force um erro (ex: rede offline)
  - ✅ Notificação vermelha deve aparecer
  - ✅ Mensagem de erro clara

---

## 🎨 FASE 3 - VISUALIZAÇÕES AVANÇADAS

### Filtros Avançados

- [ ] **Filtro por Data - Hoje**
  - Selecione "Hoje" no filtro de data
  - ✅ Deve mostrar só leads criados hoje
  - ✅ Contador deve atualizar

- [ ] **Filtro por Data - Última Semana**
  - Selecione "Última Semana"
  - ✅ Deve mostrar leads dos últimos 7 dias

- [ ] **Filtro por Data - Último Mês**
  - Selecione "Último Mês"
  - ✅ Deve mostrar leads dos últimos 30 dias

- [ ] **Filtro por Data - Todas**
  - Selecione "Todas as Datas"
  - ✅ Deve mostrar todos os leads

- [ ] **Filtros Combinados**
  - Combine busca + status + data
  - ✅ Todos devem funcionar juntos
  - ✅ Resultado deve respeitar TODOS os filtros

---

### Exportação CSV

- [ ] **Botão Exportar CSV**
  - No dashboard, procure botão "Exportar CSV"
  - ✅ Deve estar visível

- [ ] **Exportar Todos**
  - Sem filtros aplicados
  - Clique em "Exportar CSV"
  - ✅ CSV deve baixar
  - ✅ Nome: `leads-YYYY-MM-DD.csv`
  - ✅ Notificação de sucesso

- [ ] **Conteúdo do CSV**
  - Abra o CSV no Excel/Google Sheets
  - Verifique colunas:
    - [ ] ID
    - [ ] Data Criação
    - [ ] Clínica
    - [ ] Profissional
    - [ ] Email
    - [ ] WhatsApp
    - [ ] Status
    - [ ] Valor
    - [ ] Prazo
    - [ ] Estilo
  - ✅ Dados devem estar corretos
  - ✅ Formatação deve estar legível

- [ ] **Exportar com Filtros**
  - Aplique filtros (ex: só "Em Produção")
  - Exporte CSV
  - ✅ CSV deve ter só os leads filtrados

- [ ] **CSV Vazio**
  - Aplique filtro que não retorna resultados
  - Tente exportar
  - ✅ Deve exportar CSV vazio (só headers)

---

### Toggle Lista/Kanban

- [ ] **Botão Toggle - Visível**
  - No dashboard, ao lado do "Exportar CSV"
  - ✅ Deve ter 2 botões lado a lado:
    - ☰ (Lista)
    - ⊞ (Kanban)

- [ ] **Toggle - Lista para Kanban**
  - Clique no botão ⊞ (Kanban)
  - ✅ Botão deve ficar roxo
  - ✅ Visualização deve mudar para Kanban
  - ✅ Animação suave

- [ ] **Toggle - Kanban para Lista**
  - Clique no botão ☰ (Lista)
  - ✅ Botão deve ficar roxo
  - ✅ Visualização deve voltar para lista
  - ✅ Animação suave

- [ ] **Toggle - Mobile**
  - Em tela pequena
  - ✅ Botões devem funcionar igual
  - ✅ Responsivo

---

### Kanban Board

- [ ] **Carregamento do Kanban**
  - Mude para visualização Kanban
  - ✅ Deve mostrar 6 colunas
  - ✅ Não deve dar erro

- [ ] **Colunas do Kanban**
  - Verifique cada coluna:
    - [ ] 🟢 Novo (verde)
    - [ ] 💰 Pago 50% (azul)
    - [ ] 🔨 Em Produção (amarelo)
    - [ ] 👀 Em Aprovação (roxo)
    - [ ] 💯 Pago 100% (índigo)
    - [ ] ✅ Concluído (cinza)
  - ✅ Cores devem estar corretas
  - ✅ Contador deve estar correto

- [ ] **Cards no Kanban**
  - Cada card deve ter:
    - [ ] Nome da clínica
    - [ ] Nome do profissional
    - [ ] Email
    - [ ] Telefone
    - [ ] Tempo decorrido
    - [ ] Valor (R$)
    - [ ] Badge "URGENTE" se 24h

- [ ] **Drag and Drop - Começar**
  - Clique e segure um card
  - ✅ Card deve "levantar"
  - ✅ Cursor deve mudar

- [ ] **Drag and Drop - Hover**
  - Arraste sobre outra coluna
  - ✅ Coluna deve mudar aparência (fundo roxo)
  - ✅ Borda tracejada deve aparecer

- [ ] **Drag and Drop - Soltar**
  - Solte o card em outra coluna
  - ✅ Card deve ir para nova coluna
  - ✅ Deve mostrar loading
  - ✅ Notificação de sucesso
  - ✅ Status deve atualizar no banco

- [ ] **Drag and Drop - Cancelar**
  - Comece a arrastar
  - Solte fora de qualquer coluna
  - ✅ Card deve voltar para posição original

- [ ] **Drag and Drop - Mesma Coluna**
  - Arraste e solte na mesma coluna
  - ✅ Nada deve acontecer
  - ✅ Não deve fazer request

- [ ] **Drag and Drop - Múltiplos Cards**
  - Arraste vários cards para testar
  - ✅ Todos devem funcionar
  - ✅ Timeline deve registrar mudanças

- [ ] **Overlay Durante Drag**
  - Ao arrastar
  - ✅ Deve mostrar preview do card
  - ✅ Preview deve ter rotação leve
  - ✅ Opacidade reduzida

- [ ] **Kanban - Click no Card**
  - Clique em qualquer card
  - ✅ Deve abrir página de detalhes
  - ✅ Não deve iniciar drag

- [ ] **Kanban - Coluna Vazia**
  - Para coluna sem cards
  - ✅ Deve mostrar "Arraste cards aqui"
  - ✅ Deve aceitar drops

- [ ] **Kanban - Scroll Horizontal**
  - Em tela pequena
  - ✅ Deve ter scroll horizontal
  - ✅ Todas as colunas devem ser acessíveis

- [ ] **Kanban - Filtros**
  - Aplique filtros
  - ✅ Kanban deve respeitar filtros
  - ✅ Só leads filtrados aparecem

---

### Página de Relatórios

- [ ] **Acesso aos Relatórios**
  - No dashboard, clique em "Relatórios" (header)
  - Ou acesse: `/admin/reports`
  - ✅ Deve carregar página
  - ✅ Não deve dar erro 404

- [ ] **Botão Voltar**
  - Clique em "← Voltar"
  - ✅ Deve retornar ao dashboard

---

#### KPIs Principais

- [ ] **KPI - Total de Leads**
  - ✅ Número deve bater com total real
  - ✅ Deve ter ícone de usuários
  - ✅ Deve ter tendência (+X% vs mês anterior)
  - ✅ Seta verde para cima se positivo

- [ ] **KPI - Faturamento**
  - ✅ Valor em R$ correto
  - ✅ Formatação brasileira (R$ 1.234,56)
  - ✅ Ícone de cifrão
  - ✅ Tendência com seta

- [ ] **KPI - Ticket Médio**
  - ✅ Cálculo correto (total / quantidade)
  - ✅ Valor em R$
  - ✅ Texto "Por lead"

- [ ] **KPI - Taxa de Conversão**
  - ✅ Porcentagem correta
  - ✅ Conta leads pagos/concluídos
  - ✅ Máximo 100%
  - ✅ Tendência com seta

---

#### Gráficos

- [ ] **Gráfico - Leads por Dia**
  - ✅ Gráfico de linha deve aparecer
  - ✅ Eixo X: datas (últimos 30 dias)
  - ✅ Eixo Y: quantidade
  - ✅ Linha roxa
  - ✅ Hover mostra tooltip
  - ✅ Dados devem estar corretos

- [ ] **Gráfico - Distribuição por Status**
  - ✅ Gráfico de pizza deve aparecer
  - ✅ 6 fatias (uma por status)
  - ✅ Cores corretas por status
  - ✅ Labels com nome e %
  - ✅ Hover mostra tooltip
  - ✅ Porcentagens somam 100%

- [ ] **Gráfico - Faturamento Mensal**
  - ✅ Gráfico de barras deve aparecer
  - ✅ Últimos 6 meses
  - ✅ Barras verdes
  - ✅ Eixo X: meses (MMM/YY)
  - ✅ Eixo Y: valor em R$
  - ✅ Hover mostra tooltip

- [ ] **Gráfico - Tempo por Etapa**
  - ✅ Gráfico de barras horizontal
  - ✅ 5 barras (transições entre status)
  - ✅ Barras amarelas/laranjas
  - ✅ Eixo X: dias
  - ✅ Eixo Y: nome da etapa
  - ✅ Hover mostra tooltip

- [ ] **Responsividade dos Gráficos**
  - Redimensione janela
  - ✅ Gráficos devem se adaptar
  - ✅ Não devem quebrar
  - ✅ Em mobile, devem empilhar

---

#### Tabela de Leads Urgentes

- [ ] **Tabela - Header**
  - ✅ Título "Leads Urgentes (Prazo 24h)"
  - ✅ 4 colunas: Clínica, Status, Criado em, Valor

- [ ] **Tabela - Dados**
  - ✅ Só mostra leads com prazo 24h
  - ✅ Máximo 5 leads
  - ✅ Ordenado por data (mais recente primeiro)
  - ✅ Badge de status colorido
  - ✅ Data formatada (dd/MM/yyyy HH:mm)
  - ✅ Valor em R$

- [ ] **Tabela - Click na Linha**
  - Clique em qualquer linha
  - ✅ Deve abrir detalhes do lead

- [ ] **Tabela - Hover**
  - Passe mouse sobre linha
  - ✅ Fundo deve mudar (hover state)
  - ✅ Cursor deve ser pointer

- [ ] **Tabela - Vazia**
  - Se não houver leads urgentes
  - ✅ Deve mostrar mensagem apropriada

---

## 📱 TESTES DE RESPONSIVIDADE

### Desktop (> 1024px)

- [ ] **Dashboard**
  - ✅ 4 cards de métricas em linha
  - ✅ Filtros em linha única
  - ✅ Lista/Kanban ocupa largura total

- [ ] **Detalhes**
  - ✅ Header com todos os botões
  - ✅ Abas em linha
  - ✅ Conteúdo não cortado

- [ ] **Relatórios**
  - ✅ KPIs em 4 colunas
  - ✅ Gráficos em grid 2x2
  - ✅ Tabela com todas as colunas

- [ ] **Kanban**
  - ✅ 6 colunas visíveis sem scroll
  - ✅ Cards confortavelmente espaçados

### Tablet (768px - 1024px)

- [ ] **Dashboard**
  - ✅ Métricas em 2 colunas
  - ✅ Filtros empilhados
  - ✅ Lista legível

- [ ] **Kanban**
  - ✅ Scroll horizontal funciona
  - ✅ Drag funciona em touch

- [ ] **Relatórios**
  - ✅ KPIs em 2 colunas
  - ✅ Gráficos empilhados

### Mobile (< 768px)

- [ ] **Dashboard**
  - ✅ Métricas empilhadas (1 coluna)
  - ✅ Filtros empilhados
  - ✅ Busca ocupa largura total
  - ✅ Toggle Lista/Kanban compacto

- [ ] **Detalhes**
  - ✅ Botões PDF/ZIP empilhados
  - ✅ Abas com scroll horizontal
  - ✅ Botões de ação maiores

- [ ] **Kanban**
  - ✅ Scroll horizontal
  - ✅ Touch funciona
  - ✅ Ou mensagem sugerindo Lista

- [ ] **Relatórios**
  - ✅ KPIs empilhados
  - ✅ Gráficos empilhados
  - ✅ Tabela com scroll horizontal

---

## 🌐 TESTES DE NAVEGADORES

### Chrome
- [ ] Desktop
- [ ] Mobile (DevTools)
- [ ] Todas as funcionalidades

### Firefox
- [ ] Desktop
- [ ] Todas as funcionalidades

### Safari
- [ ] Desktop (Mac)
- [ ] iOS (iPhone/iPad)

### Edge
- [ ] Desktop
- [ ] Todas as funcionalidades

---

## ⚡ TESTES DE PERFORMANCE

- [ ] **Carregamento Inicial**
  - ✅ Dashboard carrega em < 3s
  - ✅ Não trava durante loading

- [ ] **Busca em Tempo Real**
  - Digite rapidamente
  - ✅ Não deve travar
  - ✅ Deve ter debounce

- [ ] **Mudança de Status**
  - ✅ Não deve demorar mais que 2s
  - ✅ Feedback imediato

- [ ] **Drag and Drop**
  - ✅ Sem lag durante arrasto
  - ✅ Animações suaves

- [ ] **Gráficos**
  - ✅ Renderizam rápido
  - ✅ Interação fluida

- [ ] **Exportação**
  - ✅ CSV gera rápido (< 2s)
  - ✅ PDF gera em < 5s

---

## 🐛 TESTES DE EDGE CASES

- [ ] **Lead sem Dados**
  - Lead com campos vazios
  - ✅ Não deve quebrar
  - ✅ Deve mostrar "-" ou "N/A"

- [ ] **Lead sem Imagens**
  - ✅ Download de ZIP avisa
  - ✅ PDF gera normalmente

- [ ] **Muitos Leads (100+)**
  - ✅ Dashboard carrega
  - ✅ Kanban funciona
  - ✅ Busca funciona

- [ ] **Conexão Lenta**
  - Throttle network (DevTools)
  - ✅ Mostra loading states
  - ✅ Não quebra

- [ ] **Conexão Offline**
  - Desabilite internet
  - ✅ Mostra erro apropriado
  - ✅ Não quebra completamente

- [ ] **Sessão Expirada**
  - Espere sessão expirar
  - Tente fazer ação
  - ✅ Deve redirecionar para login

---

## 🔒 TESTES DE SEGURANÇA

- [ ] **SQL no Supabase Executado**
  - ✅ RLS está habilitado
  - ✅ Políticas foram criadas

- [ ] **Acesso sem Login**
  - Tente acessar rotas admin sem login
  - ✅ Todas redirecionam para /login

- [ ] **Manipular URL**
  - Tente acessar `/admin/leads/id-invalido`
  - ✅ Deve mostrar erro apropriado

- [ ] **XSS em Busca**
  - Digite `<script>alert('XSS')</script>` na busca
  - ✅ Não deve executar
  - ✅ Deve tratar como texto

---

## 📊 RESUMO DO CHECKLIST

### Contadores:
- **FASE 1:** ~40 testes
- **FASE 2:** ~50 testes
- **FASE 3:** ~80 testes
- **Responsividade:** ~20 testes
- **Performance:** ~10 testes
- **Edge Cases:** ~10 testes
- **Segurança:** ~5 testes

### **TOTAL:** ~215 testes ✅

---

## 📝 COMO REPORTAR PROBLEMAS

Se encontrar algum problema:

1. **Marque o item como problemático:** ⚠️
2. **Anote:**
   - O que você fez
   - O que esperava
   - O que aconteceu
   - Browser/dispositivo
   - Screenshot se possível
3. **Reproduza** o problema 2-3 vezes
4. **Reporte** com todos os detalhes

---

## ✅ APROVAÇÃO FINAL

Após completar TODO o checklist:

- [ ] **Todos os testes passaram**
- [ ] **Nenhum bug crítico encontrado**
- [ ] **Performance aceitável**
- [ ] **Responsivo em todos os tamanhos**
- [ ] **Funciona em todos os browsers**

**Data do Teste:** ___/___/______

**Testado por:** _________________

**Status Final:**
- [ ] ✅ APROVADO PARA PRODUÇÃO
- [ ] ⚠️ APROVADO COM RESSALVAS
- [ ] ❌ REPROVADO - NECESSITA CORREÇÕES

---

**Observações:**
_____________________________________________
_____________________________________________
_____________________________________________

---

🎉 **BOA SORTE COM OS TESTES!** 🎉
