# Atualização da Estrutura do Briefing

## 📝 Mudanças Solicitadas

### 1. ✅ Adicionar Página de Rastreamento (Página 6)
### 2. ✅ Melhorar Página de Endereço com Google Maps
### 3. ✅ Simplificar Review para usar Google Maps
### 4. 💡 Sugestões de Seções Adicionais

---

## 🔧 Página 6: Rastreamento e Integrações (NOVA)

**Posição:** Entre Galeria e Localização
**Objetivo:** Configurar tags de análise e remarketing
**Tipo:** Opcional

### Layout Visual:
```
┌─────────────────────────────────────────────────┐
│  Rastreamento e Integrações                    │
│  Configure suas tags de análise (Opcional)     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ℹ️ Esta seção é opcional                      │
│  ┌─────────────────────────────────────────┐   │
│  │ Se você não tiver essas informações     │   │
│  │ agora, não tem problema! Você pode:     │   │
│  │                                         │   │
│  │ • Deixar em branco e enviar depois     │   │
│  │   por email                            │   │
│  │ • Solicitar ao seu gestor de tráfego   │   │
│  │ • Adicionar mais tarde quando tiver    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📊 Google Analytics 4 (GA4)                    │
│  ┌─────────────────────────────────────────┐   │
│  │ ID de Medição:                          │   │
│  │ ┌───────────────────────────────────┐   │   │
│  │ │ G-XXXXXXXXXX                      │   │   │
│  │ └───────────────────────────────────┘   │   │
│  │                                         │   │
│  │ 📊 O que é:                             │   │
│  │ Ferramenta do Google para acompanhar    │   │
│  │ visitas, origem dos visitantes e        │   │
│  │ comportamento no site.                  │   │
│  │                                         │   │
│  │ 💡 Como obter:                          │   │
│  │ Solicite ao seu gestor de tráfego ou    │   │
│  │ crie gratuitamente em:                  │   │
│  │ analytics.google.com                    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🎯 Meta Pixel (Facebook/Instagram)             │
│  ┌─────────────────────────────────────────┐   │
│  │ Pixel ID:                               │   │
│  │ ┌───────────────────────────────────┐   │   │
│  │ │ 123456789012345                   │   │   │
│  │ └───────────────────────────────────┘   │   │
│  │                                         │   │
│  │ 🎯 O que é:                             │   │
│  │ Código do Facebook para rastrear        │   │
│  │ conversões de anúncios no               │   │
│  │ Facebook/Instagram.                     │   │
│  │                                         │   │
│  │ 💡 Como obter:                          │   │
│  │ Solicite ao seu gestor de tráfego ou    │   │
│  │ crie em: business.facebook.com          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🔧 Google Tag Manager (GTM)                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Container ID:                           │   │
│  │ ┌───────────────────────────────────┐   │   │
│  │ │ GTM-XXXXXXX                       │   │   │
│  │ └───────────────────────────────────┘   │   │
│  │                                         │   │
│  │ 🔧 O que é:                             │   │
│  │ Container para gerenciar múltiplas      │   │
│  │ tags de rastreamento em um só lugar.    │   │
│  │                                         │   │
│  │ 💡 Como obter:                          │   │
│  │ Solicite ao seu gestor de tráfego ou    │   │
│  │ crie em: tagmanager.google.com          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  💰 Google Ads - Rastreamento de Conversão      │
│  ┌─────────────────────────────────────────┐   │
│  │ Código de Conversão:                    │   │
│  │ ┌───────────────────────────────────┐   │   │
│  │ │ AW-XXXXXXXXX/XXXXXXX              │   │   │
│  │ └───────────────────────────────────┘   │   │
│  │                                         │   │
│  │ 💰 O que é:                             │   │
│  │ Código para rastrear conversões         │   │
│  │ (agendamentos, contatos) vindas de      │   │
│  │ anúncios do Google.                     │   │
│  │                                         │   │
│  │ 💡 Como obter:                          │   │
│  │ Solicite ao seu gestor de tráfego ou    │   │
│  │ acesse: ads.google.com                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📝 Outras Tags ou Scripts (Opcional)           │
│  ┌─────────────────────────────────────────┐   │
│  │ Cole aqui qualquer outro código de      │   │
│  │ rastreamento que precise ser instalado: │   │
│  │ ┌───────────────────────────────────┐   │   │
│  │ │ <script>                          │   │   │
│  │ │   // Seu código aqui...           │   │   │
│  │ │ </script>                         │   │   │
│  │ │                                   │   │   │
│  │ │                                   │   │   │
│  │ └───────────────────────────────────┘   │   │
│  │                                         │   │
│  │ 📝 Exemplos:                            │   │
│  │ • HotJar (mapa de calor)                │   │
│  │ • RD Station (automação marketing)      │   │
│  │ • Outros pixels de remarketing          │   │
│  │ • Chat online (Zendesk, Intercom, etc)  │   │
│  │                                         │   │
│  │ ⚠️ Cole apenas códigos fornecidos por   │   │
│  │    plataformas confiáveis               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ✅ Instalação incluída no serviço              │
│  ┌─────────────────────────────────────────┐   │
│  │ Todas as tags fornecidas serão          │   │
│  │ instaladas corretamente no seu site     │   │
│  │ durante a criação. Não se preocupe      │   │
│  │ com aspectos técnicos!                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Campos:

**1. Google Analytics 4 (GA4):**
- Campo: Input text
- Placeholder: "G-XXXXXXXXXX"
- Validação: Opcional, formato G-XXXXXXXXXX
- Dica explicativa: O que é + Como obter

**2. Meta Pixel (Facebook/Instagram):**
- Campo: Input text
- Placeholder: "123456789012345"
- Validação: Opcional, apenas números (15 dígitos)
- Dica explicativa: O que é + Como obter

**3. Google Tag Manager (GTM):**
- Campo: Input text
- Placeholder: "GTM-XXXXXXX"
- Validação: Opcional, formato GTM-XXXXXXX
- Dica explicativa: O que é + Como obter

**4. Google Ads Conversion:**
- Campo: Input text
- Placeholder: "AW-XXXXXXXXX/XXXXXXX"
- Validação: Opcional, formato AW-XXXXXXXXX/XXXXXXX
- Dica explicativa: O que é + Como obter

**5. Outras Tags/Scripts:**
- Campo: Textarea (5-10 linhas)
- Placeholder: "Cole aqui scripts adicionais..."
- Validação: Opcional
- Aceita: HTML, JavaScript
- Exemplos: HotJar, RD Station, Chat

### Dados salvos:
```json
{
  "rastreamento": {
    "google_analytics": "G-ABC123XYZ",
    "meta_pixel": "123456789012345",
    "google_tag_manager": "GTM-ABC123",
    "google_ads_conversion": "AW-123456789/AbCdEfGhIj",
    "outras_tags": "<script>... código do HotJar ...</script>",
    "instalacao_confirmada": true
  }
}
```

---

## 📍 Página 7: Localização e Contato (ATUALIZADA)

**Mudança:** Adicionar opção de Link do Google Maps

### Layout Atualizado:
```
┌─────────────────────────────────────────────────┐
│  Localização e Contato                         │
│  Como os pacientes vão te encontrar?           │
├─────────────────────────────────────────────────┤
│                                                 │
│  🗺️ ENDEREÇO (escolha uma opção)               │
│  ┌─────────────────────────────────────────┐   │
│  │ ○ Preencher endereço manualmente        │   │
│  │ ⦿ Colar link do Google Maps             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📍 Opção 1: Link do Google Maps                │
│  ┌─────────────────────────────────────────┐   │
│  │ Link completo do Google Maps:           │   │
│  │ ┌───────────────────────────────────┐   │   │
│  │ │ https://goo.gl/maps/...           │   │   │
│  │ └───────────────────────────────────┘   │   │
│  │                                         │   │
│  │ 💡 Como obter:                          │   │
│  │ 1. Abra Google Maps                     │   │
│  │ 2. Busque seu consultório               │   │
│  │ 3. Clique em "Compartilhar"             │   │
│  │ 4. Copie o link e cole aqui             │   │
│  │                                         │   │
│  │ ✅ Endereço será extraído               │   │
│  │    automaticamente do link              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  OU                                             │
│                                                 │
│  📝 Opção 2: Preencher manualmente              │
│  ┌─────────────────────────────────────────┐   │
│  │ CEP: [_____-___]  [🔍 Buscar]           │   │
│  │                                         │   │
│  │ Rua: [____________________________]     │   │
│  │ Número: [______]                        │   │
│  │ Complemento: [___________________]      │   │
│  │ Bairro: [_______________________]       │   │
│  │ Cidade: [_______________________]       │   │
│  │ Estado: [SP ▼]                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🕐 HORÁRIOS DE ATENDIMENTO                     │
│  ┌─────────────────────────────────────────┐   │
│  │ Segunda a Sexta:                        │   │
│  │ Das [08:00] às [18:00]                  │   │
│  │                                         │   │
│  │ Sábado:                                 │   │
│  │ Das [08:00] às [12:00]                  │   │
│  │ ☐ Fechado                               │   │
│  │                                         │   │
│  │ Domingo:                                │   │
│  │ ☑ Fechado                               │   │
│  │                                         │   │
│  │ Observações:                            │   │
│  │ [Ex: Feriados - Fechado]                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📞 CONTATOS                                    │
│  ┌─────────────────────────────────────────┐   │
│  │ WhatsApp: (11) 99999-9999 (preenchido)  │   │
│  │ Telefone fixo: [____________]           │   │
│  │ E-mail: contato@... (preenchido)        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🗺️ EXIBIÇÃO NO SITE                           │
│  ┌─────────────────────────────────────────┐   │
│  │ ☑ Mostrar mapa interativo do Google    │   │
│  │   Maps no site                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Campos Atualizados:

**Endereço - Duas Opções:**

**Opção A: Link do Google Maps (Recomendado)**
- Campo: Input URL
- Placeholder: "https://goo.gl/maps/..."
- Validação: Formato de URL do Google Maps
- Ação: Extrai endereço automaticamente do link
- Benefício: Mais preciso + já vincula ao Google Maps

**Opção B: Preenchimento Manual**
- CEP com busca automática (ViaCEP)
- Campos tradicionais de endereço
- Usado se não tiver Google Maps

**Resto mantém:**
- Horários
- Contatos
- Checkbox para mostrar mapa

### Dados salvos:
```json
{
  "localizacao": {
    "metodo": "google_maps_link",
    "google_maps_link": "https://goo.gl/maps/xyz123",
    "endereco": {
      "cep": "01310-100",
      "rua": "Av. Paulista",
      "numero": "1000",
      "complemento": "Sala 501",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP",
      "origem": "extraido_maps"
    },
    "horarios": { ... },
    "contato": { ... },
    "mostrar_mapa": true
  }
}
```

---

## ⭐ Página 5: Depoimentos (SIMPLIFICADA)

**Mudança:** Simplificar integração para apenas Google Maps

### Seção do Google Meu Negócio Atualizada:
```
┌─────────────────────────────────────────────────┐
│  📱 AVALIAÇÕES DO GOOGLE                        │
│  ┌─────────────────────────────────────────┐   │
│  │ ⦿ Sim, mostrar avaliações do Google    │   │
│  │                                         │   │
│  │   Link do Google Meu Negócio:           │   │
│  │   ┌───────────────────────────────────┐ │   │
│  │   │ https://goo.gl/maps/...           │ │   │
│  │   └───────────────────────────────────┘ │   │
│  │                                         │   │
│  │   💡 Como obter:                        │   │
│  │   1. Abra Google Maps                   │   │
│  │   2. Busque sua clínica                 │   │
│  │   3. Clique em "Compartilhar"           │   │
│  │   4. Copie o link e cole aqui           │   │
│  │                                         │   │
│  │   🔄 Sistema buscará automaticamente:   │   │
│  │   • Sua nota média (ex: 4.9 ⭐)         │   │
│  │   • Número de avaliações (ex: 127)      │   │
│  │   • Últimas avaliações dos pacientes    │   │
│  │                                         │   │
│  │   ✅ Atualização automática no site     │   │
│  │                                         │   │
│  │ ○ Não tenho Google Meu Negócio ainda    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  💬 DEPOIMENTOS PERSONALIZADOS (Opcional)       │
│  Se quiser adicionar depoimentos específicos:  │
│  [+ Adicionar depoimento manual]                │
└─────────────────────────────────────────────────┘
```

### Mudanças:

**Simplificação:**
- ✅ Foco principal: Link do Google Maps
- ✅ Sistema puxa automaticamente: nota, avaliações, depoimentos
- ✅ Depoimentos manuais viram opcionais
- ✅ Menos trabalho para o cliente

---

## 💡 Sugestões de Seções Adicionais para o Site

Baseado em sites odontológicos modernos de sucesso:

### **1. FAQ - Perguntas Frequentes** 🙋‍♀️
**Benefício:** Reduz dúvidas antes do contato, melhora SEO

**Implementação:**
- Adicionar na Página 5 ou criar Página 6.5
- 5-10 perguntas e respostas
- Categorias: Procedimentos, Pagamento, Agendamento

**Exemplos de perguntas:**
```
- Quanto tempo leva um clareamento dental?
- Vocês atendem convênio?
- Qual a forma de pagamento?
- Dói fazer implante?
- Como é a primeira consulta?
```

---

### **2. Antes e Depois** 📸
**Benefício:** Prova visual de resultados, aumenta conversão em 250%

**Implementação:**
- Adicionar opção na Página 6 (Galeria)
- Upload de pares de fotos (antes/depois)
- Slider interativo no site
- Obs: Precisa autorização do paciente

**Exemplo:**
```
Caso 1: Clareamento Dental
[Antes] [Depois]
Procedimento: Clareamento a laser
Tempo: 1 sessão
```

---

### **3. Formas de Pagamento** 💳
**Benefício:** Remove objeção de preço, aumenta agendamentos

**Implementação:**
- Adicionar na Página 7 ou criar seção específica
- Checkbox de opções aceitas

**Opções:**
```
☑ Dinheiro
☑ Cartão de crédito (até 12x)
☑ Cartão de débito
☑ PIX
☑ Boleto bancário
☐ Convênios (especificar quais)
☐ Financiamento (parceiro: Creditas, etc)
```

---

### **4. Área de Atendimento** 🗺️
**Benefício:** SEO local, aparece em buscas da região

**Implementação:**
- Adicionar na Página 7 (Localização)
- Lista de bairros/cidades que atende

**Exemplo:**
```
Atendemos pacientes de:
• Pinheiros, Jardins, Moema, Vila Madalena
• Região: Zona Sul e Centro de São Paulo
• Atendimento domiciliar (sob consulta)
```

---

### **5. Convênios Aceitos** 🏥
**Benefício:** Atrai pacientes de convênio

**Implementação:**
- Checkbox na Página 5 ou criar seção
- Se não aceita, informar que trabalha com reembolso

**Opções:**
```
☑ Amil
☑ SulAmérica
☑ Bradesco Saúde
☐ Unimed
☐ Não aceitamos convênio
  ☑ Fornecemos recibo para reembolso
```

---

### **6. Agendamento Online** 📅
**Benefício:** Facilita conversão, capta leads fora do horário

**Implementação:**
- Integração com ferramentas:
  - Calendly
  - Agendor
  - Google Calendar
  - WhatsApp direto

**Opção na Página 8 (Review):**
```
🗓️ Quer integrar agendamento online?
○ Sim, tenho Calendly/Google Calendar
  Link: [_______________]
○ Não, prefiro agendamento por WhatsApp
```

---

### **7. Blog / Conteúdo Educativo** 📰
**Benefício:** SEO, autoridade, atrai tráfego orgânico

**Implementação:**
- Pergunta na Página 8
- Se sim, incluir seção de blog no site

**Opção:**
```
📰 Quer uma seção de blog/artigos?
○ Sim, quero publicar conteúdo educativo
○ Não neste momento
```

---

### **8. Urgência Odontológica** 🚨
**Benefício:** Atende emergências, diferencial competitivo

**Implementação:**
- Banner no hero
- Botão de emergência

**Opção na Página 2 (Hero):**
```
🚨 Atende urgências odontológicas?
☑ Sim
  Telefone de emergência: [__________]
  Horário de urgência: [____________]
☐ Não
```

---

### **9. Diferencial Competitivo** 🏆
**Benefício:** Destaca por que escolher você

**Implementação:**
- Seção após Hero
- 3-4 diferenciais principais

**Exemplos:**
```
✓ Equipamentos de última geração
✓ Atendimento personalizado
✓ Anestesia computadorizada (sem dor)
✓ Resultados garantidos
✓ Parcelamento sem juros
```

Opção na Página 2 ou 4:
```
🏆 Seus principais diferenciais:
☑ Tecnologia de ponta
☑ Atendimento humanizado
☑ Sem dor (anestesia moderna)
☐ Customizado: [___________]
```

---

### **10. Equipe Completa** 👥
**Benefício:** Transparência, confiança

**Se tiver:**
- Recepcionista
- Auxiliares
- Especialistas

Opção na Página 3:
```
Tem equipe de apoio para apresentar?
☑ Sim, mostrar recepcionista/auxiliares
☐ Não, só dentistas
```

---

## 📊 Resumo das Seções Sugeridas

| Seção | Prioridade | Impacto | Implementação |
|-------|-----------|---------|---------------|
| FAQ | ⭐⭐⭐ Alta | SEO + Reduz dúvidas | Página 5 ou 6.5 |
| Antes/Depois | ⭐⭐⭐ Alta | Conversão +250% | Página 6 (Galeria) |
| Pagamento | ⭐⭐⭐ Alta | Remove objeção | Página 7 |
| Área Atendimento | ⭐⭐ Média | SEO Local | Página 7 |
| Convênios | ⭐⭐ Média | Atrai nicho | Página 5 |
| Agendamento Online | ⭐⭐ Média | Facilita conversão | Página 8 |
| Blog | ⭐ Baixa | SEO longo prazo | Página 8 |
| Urgência | ⭐⭐ Média | Diferencial | Página 2 |
| Diferenciais | ⭐⭐⭐ Alta | Destaque | Página 2 ou 4 |
| Equipe Apoio | ⭐ Baixa | Transparência | Página 3 |

---

## ✅ O Que Preciso de Você

1. **Aprovar mudanças:**
   - ✅ Página de Rastreamento está OK?
   - ✅ Google Maps na localização está OK?
   - ✅ Simplificação dos depoimentos está OK?

2. **Seções adicionais:**
   - Quais você quer incluir?
   - Eu recomendo priorizar: **FAQ, Antes/Depois, Pagamento, Diferenciais**

3. **Site de referência:**
   - Me mande o link do site que você mencionou para eu analisar!

---

**Aguardando seu feedback para continuar!** 🚀
