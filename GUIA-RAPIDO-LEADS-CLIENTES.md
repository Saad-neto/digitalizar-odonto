# Guia Rápido: Sistema de Leads e Clientes

## ✅ Sistema Totalmente Configurado!

O dashboard agora está separado em **Leads** e **Clientes** com captura automática.

---

## 📱 Como Usar

### 1. **Leads** (Página 1 Apenas)

**Acesse:** `/admin/leads`

**O que você vê:**
- Pessoas que preencheram APENAS a primeira página do briefing
- Status: `lead_parcial`

**Informações disponíveis:**
- Nome da clínica
- Nome do profissional
- E-mail
- WhatsApp
- Tempo desde a captura

**Priorização automática:**
- 🔥 **Quente** (< 1h) → Contate IMEDIATAMENTE
- ⚡ **Urgente** (1-24h) → Alta prioridade
- ⏰ **Atenção** (1-3 dias) → Configure automação
- ❄️ **Frio** (> 3 dias) → Retargeting

**Ações disponíveis:**
- Botão WhatsApp direto
- Exportar CSV para e-mail marketing
- Filtros por data (Hoje, 7 dias, 30 dias)

**Métricas:**
- Total de leads
- Leads hoje
- Leads últimos 7 dias
- **Taxa de conversão** (% que virou cliente)

---

### 2. **Clientes** (Briefing Completo)

**Acesse:** `/admin/clientes`

**O que você vê:**
- Pessoas que completaram TODO o formulário (8 páginas)
- Todos os status EXCETO `lead_parcial`

**Visualizações:**
- 📋 **Lista** - Visualização em cards
- 📊 **Kanban** - Quadro de produção

**Tag Especial:**
- 🎯 **Convertido** - Cliente que começou como lead parcial e depois completou
  - Indica sucesso do remarketing!

**Status disponíveis:**
- 🆕 Novo
- 🔨 Em Produção
- 👀 Aguardando Aprovação
- 💰 Aprovado e Pago
- 🔧 Em Ajustes
- ✨ Aprovação Final
- 🚀 No Ar
- ✅ Concluído

---

## 🎯 Fluxo Completo

### Cenário 1: Lead Quente que Converte

1. **Dr. João** preenche página 1 do briefing às 10h00
2. Sistema cria automaticamente em **Leads** (status: `lead_parcial`)
3. Você vê em `/admin/leads` com tag 🔥 **Quente**
4. Envia WhatsApp às 10h15: "Olá Dr. João, vi que começou..."
5. **Dr. João** retorna e completa o formulário às 10h30
6. Sistema move automaticamente para **Clientes** (status: `novo`)
7. Cliente aparece com tag 🎯 **Convertido**
8. Taxa de conversão aumenta!

### Cenário 2: Cliente Direto

1. **Dra. Maria** preenche todas as 8 páginas de uma vez
2. Sistema cria diretamente em **Clientes** (status: `novo`)
3. Aparece SEM tag de convertido (pois não passou por Leads)

### Cenário 3: Lead Frio para Remarketing

1. **Dr. Carlos** preencheu página 1 há 5 dias
2. Aparece em **Leads** com tag ❄️ **Frio**
3. Você exporta CSV e adiciona em campanha de e-mail
4. Ou cria público personalizado no Facebook/Instagram
5. Se ele completar depois, vai para **Clientes** com tag 🎯 **Convertido**

---

## 📊 Métricas e Analytics

### Taxa de Conversão

**Fórmula:** (Clientes Convertidos / Total de Leads Capturados) × 100

**Exemplo:**
- 20 leads parciais capturados
- 15 ainda em Leads
- 5 converteram para Clientes
- Taxa: (5 / 20) × 100 = **25%**

**Como melhorar:**
- Contatar leads quentes (< 1h) aumenta conversão em até 60%
- E-mail de follow-up em 24h aumenta conversão em 30%
- Oferta especial para leads frios reativa 10-15%

---

## 🎨 Interface Visual

### Página Leads
```
╔════════════════════════════════════════════════╗
║  Leads (Página 1 Apenas)                      ║
║  Usuários que preencheram apenas a primeira   ║
║  página do briefing                           ║
╠════════════════════════════════════════════════╣
║                                                ║
║  📊 Métricas                                   ║
║  ┌──────────┬──────────┬──────────┬─────────┐ ║
║  │ Total: 42│ Hoje: 12 │ 7d: 28   │ Conv:35%│ ║
║  └──────────┴──────────┴──────────┴─────────┘ ║
║                                                ║
║  🔍 Buscar | [Todos][Hoje][7 Dias][30 Dias]  ║
║                                                ║
║  ┌──────────────────────────────────────────┐ ║
║  │ 🔥 Quente | <1h | Dr. João Silva         │ ║
║  │ Clínica Dr. João                         │ ║
║  │ joao@email.com | (11) 99999-9999         │ ║
║  │ [WhatsApp]                               │ ║
║  ├──────────────────────────────────────────┤ ║
║  │ ⚡ Urgente | 5h | Dra. Maria Santos      │ ║
║  │ ...                                      │ ║
║  └──────────────────────────────────────────┘ ║
╚════════════════════════════════════════════════╝
```

### Página Clientes
```
╔════════════════════════════════════════════════╗
║  Clientes (Briefing Completo)                 ║
║  Kanban de produção | Apenas formulários      ║
║  completos                                    ║
╠════════════════════════════════════════════════╣
║                                                ║
║  📊 Métricas                                   ║
║  ┌──────────┬──────────┬──────────┬─────────┐ ║
║  │ Novos:15 │ Prod: 8  │ Prontos:5│Total:R$ │ ║
║  └──────────┴──────────┴──────────┴─────────┘ ║
║                                                ║
║  [📋 Lista] [📊 Kanban]                       ║
║                                                ║
║  ┌──────────────────────────────────────────┐ ║
║  │ 🆕 Novo | 🎯 Convertido                   │ ║
║  │ Clínica Dr. João                         │ ║
║  │ Dr. João Silva                           │ ║
║  │ joao@email.com | (11) 99999-9999         │ ║
║  │ [Ver Detalhes]                           │ ║
║  ├──────────────────────────────────────────┤ ║
║  │ 🔨 Em Produção                            │ ║
║  │ Clínica Dra. Maria                       │ ║
║  │ ...                                      │ ║
║  └──────────────────────────────────────────┘ ║
╚════════════════════════════════════════════════╝
```

---

## 💡 Dicas de Remarketing

### Para Leads Quentes (< 1h)
**Template WhatsApp:**
```
Olá [Nome], tudo bem?

Vi que você começou o cadastro para criar seu site
odontológico há poucos minutos!

Está com alguma dúvida? Posso te ajudar a completar
o briefing agora mesmo.

Em 24h seu site estará pronto! 😃

[Seu Nome]
Sites Odonto 24H
```

### Para Leads Urgentes (1-24h)
**Template E-mail:**
```
Assunto: Falta pouco para seu site ficar pronto, Dr(a). [Nome]!

Olá Dr(a). [Nome],

Vimos que você iniciou o cadastro do seu site ontem.
Falta apenas 5 minutos para completar!

🎁 OFERTA ESPECIAL: Complete hoje e ganhe R$ 50 de desconto.

[Botão: Completar Agora]

Seu site profissional em 24h!
```

### Para Leads Frios (> 3 dias)
**Estratégia:**
1. Exportar CSV
2. Criar público personalizado no Facebook Ads
3. Campanha de retargeting:
   - "Sites para Dentistas a partir de R$ 447"
   - Mostrar exemplos de sites prontos
   - Depoimentos de clientes satisfeitos

---

## 🔧 Troubleshooting

### Lead não aparece na lista
**Possíveis causas:**
- Filtro de data ativo
- Busca ativa
- Lead foi convertido para Cliente (veja em /admin/clientes)

**Solução:**
- Clique em "Todos" nos filtros
- Limpe a busca
- Verifique em Clientes

### Cliente não tem tag "Convertido"
**Explicação:**
- Tag só aparece se `origem = 'convertido_de_lead'`
- Cliente pode ter completado formulário direto
- Isso é normal e esperado

### Taxa de conversão em 0%
**Possíveis causas:**
- Nenhum lead foi convertido ainda
- Leads muito recentes (< 24h)

**Solução:**
- Normal no início
- Taxa aumenta conforme remarketing funciona

---

## 📈 Metas Recomendadas

### Taxa de Conversão
- ⭐ **Iniciante:** 15-20%
- ⭐⭐ **Bom:** 25-35%
- ⭐⭐⭐ **Excelente:** 40%+

### Tempo de Resposta
- 🔥 Leads Quentes: < 1h = 60% conversão
- ⚡ Leads Urgentes: < 24h = 35% conversão
- ❄️ Leads Frios: 3-7 dias = 15% conversão

### Meta Mensal
- Capturar 100+ leads
- Converter 30+ para clientes
- Taxa global: 30%

---

## 🎯 Checklist Diário

**Manhã (9h):**
- [ ] Verificar Leads Quentes (hoje)
- [ ] Enviar WhatsApp para todos < 1h
- [ ] Verificar taxa de conversão do dia anterior

**Tarde (14h):**
- [ ] Revisar Leads Urgentes (1-24h)
- [ ] Enviar e-mails de follow-up
- [ ] Atualizar Kanban de Clientes

**Noite (18h):**
- [ ] Exportar Leads Frios (> 3 dias)
- [ ] Preparar campanha de e-mail
- [ ] Análise de conversão semanal (sexta-feira)

---

## 🚀 Automações Futuras

### Em Desenvolvimento
1. **E-mail automático** 1h após captura
2. **WhatsApp automático** via API Business
3. **Dashboard de funil** visual
4. **Integração com CRM**
5. **Score de leads** (quente/morno/frio automático)

---

## 📞 Suporte

**Dúvidas?**
- Consulte `CAPTURA-LEADS-PARCIAIS.md` para detalhes técnicos
- Veja logs no console do navegador (F12)
- Verifique migrations no Supabase SQL Editor

**Reportar Bugs:**
- Abra issue no GitHub
- Inclua prints da tela
- Descreva o comportamento esperado

---

**Última atualização:** 2025-12-23
**Versão:** 2.0.0
**Status:** ✅ Totalmente Operacional
