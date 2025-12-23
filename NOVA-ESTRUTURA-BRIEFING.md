# Nova Estrutura do Briefing - Organizado por Seções do Site

## 📋 Visão Geral

Briefing reorganizado para seguir a estrutura visual do site, de cima para baixo (Hero → Footer).

**Total:** 8 páginas
**Tempo estimado:** 15-20 minutos para completar

---

## 🎯 Página 1: Informações Básicas
**Objetivo:** Captura de lead (mantém atual)

### Campos:
- [x] Nome do consultório/clínica *
- [x] Seu nome completo *
- [x] WhatsApp *
- [x] E-mail *

**Validação:** Obrigatória (para captura de lead)

**Dados salvos:**
```json
{
  "nome_consultorio": "Clínica Dr. João",
  "nome": "Dr. João Silva",
  "whatsapp": "(11) 99999-9999",
  "email": "joao@clinica.com"
}
```

---

## 🎨 Página 2: Hero / Banner Principal
**Objetivo:** Criar a primeira seção do site (acima da dobra)

### Layout Visual da Página:
```
┌─────────────────────────────────────────────────┐
│  Vamos criar o BANNER PRINCIPAL do seu site    │
│  Esta é a primeira coisa que seus pacientes    │
│  verão ao acessar                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  📝 TÍTULO PRINCIPAL                            │
│  ┌───────────────────────────────────────────┐ │
│  │ ○ Cuidando do seu sorriso há 15 anos     │ │
│  │ ○ Seu sorriso perfeito começa aqui       │ │
│  │ ○ Transforme seu sorriso                 │ │
│  │ ○ Odontologia com atendimento humanizado │ │
│  │ ⦿ Customizado: [____________]            │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  📝 SUBTÍTULO (complementa o título)            │
│  ┌───────────────────────────────────────────┐ │
│  │ Ex: "Atendimento especializado em        │ │
│  │      São Paulo - Zona Sul"               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  🎯 CHAMADA PARA AÇÃO (botão principal)         │
│  ┌───────────────────────────────────────────┐ │
│  │ Texto do botão:                           │ │
│  │ ○ Agende sua consulta                     │ │
│  │ ○ Fale conosco no WhatsApp                │ │
│  │ ○ Avaliação gratuita                      │ │
│  │ ⦿ Customizado: [____________]             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  📸 IMAGEM DO BANNER                            │
│  ┌───────────────────────────────────────────┐ │
│  │ [ Upload de Imagem ]                      │ │
│  │                                           │ │
│  │ OU escolha da biblioteca:                 │ │
│  │ [Consultório] [Sorriso] [Dentista]       │ │
│  │ [Equipamento] [Paciente Feliz]           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  📊 NÚMEROS DE DESTAQUE (widgets)               │
│  Escolha até 4 métricas para mostrar:          │
│                                                 │
│  ┌──────────┬──────────┬──────────┬─────────┐ │
│  │ ☑ Anos   │ ☑ Pacien-│ ☐ Satis- │ ☐ Proce-│ │
│  │   de Exp.│   tes    │   fação  │ dimentos│ │
│  │          │          │          │         │ │
│  │ [  15  ] │ [5000+]  │ [  98% ] │ [ 500+ ]│ │
│  └──────────┴──────────┴──────────┴─────────┘ │
│                                                 │
│  Métricas disponíveis:                         │
│  ☐ Anos de experiência (calculado auto)        │
│  ☐ Pacientes atendidos                         │
│  ☐ Índice de satisfação                        │
│  ☐ Procedimentos realizados                    │
│  ☐ Avaliação Google (se tiver GMB)             │
│  ☐ Customizado: [Nome] [Valor]                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Campos:

**1. Título Principal:**
- Tipo: Radio + campo texto
- Opções pré-definidas:
  - "Cuidando do seu sorriso há [X] anos" (auto-preenche X)
  - "Seu sorriso perfeito começa aqui"
  - "Transforme seu sorriso com tecnologia de ponta"
  - "Odontologia de qualidade com atendimento humanizado"
  - "Customizado" → campo texto livre
- Validação: Obrigatório

**2. Subtítulo:**
- Tipo: Textarea (2-3 linhas)
- Placeholder: "Ex: Atendimento especializado em [Cidade] - [Bairro]"
- Máximo: 150 caracteres
- Validação: Opcional

**3. Call-to-Action (Texto do Botão):**
- Tipo: Radio + campo texto
- Opções:
  - "Agende sua consulta"
  - "Fale conosco no WhatsApp"
  - "Solicite uma avaliação gratuita"
  - "Customizado" → campo texto livre
- Validação: Obrigatório

**4. Imagem do Banner:**
- Tipo: Upload OU Biblioteca
- Upload: PNG, JPG (max 5MB)
- Biblioteca: 10-15 imagens odontológicas profissionais
- Validação: Obrigatório escolher uma

**5. Widgets de Números:**
- Tipo: Checkboxes + campos numéricos
- Máximo: 4 widgets selecionados
- Cada widget tem:
  - Label (ex: "Anos de Experiência")
  - Valor (ex: "15")
- Opções pré-definidas:
  - Anos de experiência (auto-calcula)
  - Pacientes atendidos (número)
  - Índice de satisfação (%)
  - Procedimentos realizados (número)
  - Avaliação Google (auto se tiver GMB)
  - Customizado (label + valor livres)
- Validação: Mínimo 2, máximo 4

### Dados salvos:
```json
{
  "hero": {
    "titulo": "Cuidando do seu sorriso há 15 anos",
    "titulo_custom": null,
    "subtitulo": "Atendimento especializado em São Paulo - Zona Sul",
    "cta_texto": "Agende sua consulta",
    "cta_custom": null,
    "imagem": {
      "tipo": "upload",
      "url": "base64...",
      "nome": "banner.jpg"
    },
    "widgets": [
      { "label": "Anos de Experiência", "valor": "15", "tipo": "auto" },
      { "label": "Pacientes Atendidos", "valor": "5000+", "tipo": "manual" },
      { "label": "Satisfação", "valor": "98%", "tipo": "manual" },
      { "label": "Avaliação Google", "valor": "4.9", "tipo": "gmb" }
    ]
  }
}
```

---

## 👨‍⚕️ Página 3: Sobre Você / Equipe
**Objetivo:** Apresentar os profissionais

### Mantém estrutura atual com ajustes:

**Para cada profissional:**
- Foto profissional *
- Nome completo *
- CRO *
- Especialidades * (checkbox múltiplo)
- Mini biografia (2-3 parágrafos) *
- Formação acadêmica
- Tempo de experiência (anos)
- Redes sociais (Instagram, Facebook)

**+ Botão:** "Adicionar outro profissional"

### Campos MOVIDOS da Página 1 para cá:
- ✅ Ano de início na odontologia (já existe)
- ✅ Número de pacientes atendidos (já existe)
- ✅ Google Meu Negócio (já existe)
- ✅ Slogan (REMOVER - agora é o título do Hero)

### Dados salvos:
```json
{
  "profissionais": [
    {
      "foto": { "url": "base64...", "nome": "foto.jpg" },
      "nome": "Dr. João Silva",
      "cro": "SP-12345",
      "especialidades": ["Implantodontia", "Prótese"],
      "biografia": "Texto da bio...",
      "formacao": "USP - 2010",
      "anos_experiencia": 15,
      "redes_sociais": [
        { "tipo": "instagram", "url": "@drjoao" }
      ]
    }
  ],
  "ano_inicio": 2010,
  "num_pacientes": "5000+",
  "google_negocio": {
    "tem": true,
    "link": "https://goo.gl/maps/..."
  }
}
```

---

## 🦷 Página 4: Serviços Oferecidos
**Objetivo:** Listar todos os serviços da clínica

### Layout Visual:
```
┌─────────────────────────────────────────────────┐
│  Que serviços você oferece?                    │
│                                                 │
│  Marque todos os serviços que sua clínica      │
│  oferece. Você pode destacar até 3 principais. │
├─────────────────────────────────────────────────┤
│                                                 │
│  SERVIÇOS COMUNS (marque os que oferece)       │
│                                                 │
│  Estética Dental                               │
│  ┌─────────────────────────────────────────┐   │
│  │ ☑ Clareamento Dental                    │   │
│  │   [⭐ Destacar] [Descrição...]          │   │
│  │                                         │   │
│  │ ☑ Facetas de Porcelana                  │   │
│  │   [  Destacar] [Descrição...]          │   │
│  │                                         │   │
│  │ ☑ Lentes de Contato Dental              │   │
│  │   [  Destacar] [Descrição...]          │   │
│  │                                         │   │
│  │ ☑ Harmonização Orofacial                │   │
│  │   [⭐ Destacar] [Descrição...]          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Implantes e Próteses                          │
│  ┌─────────────────────────────────────────┐   │
│  │ ☑ Implante Dentário                     │   │
│  │ ☑ Prótese Fixa                          │   │
│  │ ☑ Prótese Móvel                         │   │
│  │ ☐ Protocolo sobre Implante              │   │
│  │ ☐ Overdenture                           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Ortodontia                                    │
│  ┌─────────────────────────────────────────┐   │
│  │ ☑ Aparelho Fixo Tradicional             │   │
│  │ ☑ Aparelho Estético                     │   │
│  │ ☑ Invisalign / Alinhadores              │   │
│  │ ☐ Aparelho Lingual                      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [+ Adicionar serviço personalizado]           │
│                                                 │
│  ⚠️ Você selecionou 2 serviços em destaque     │
│     (máximo: 3)                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Categorias de Serviços:

**1. Estética Dental**
- Clareamento Dental
- Facetas de Porcelana
- Lentes de Contato Dental
- Restaurações Estéticas
- Harmonização Orofacial

**2. Implantes e Próteses**
- Implante Dentário
- Prótese Fixa
- Prótese Móvel
- Protocolo sobre Implante
- Overdenture

**3. Ortodontia**
- Aparelho Fixo Tradicional
- Aparelho Estético (Safira/Porcelana)
- Invisalign / Alinhadores Invisíveis
- Aparelho Lingual
- Ortodontia Preventiva

**4. Tratamentos Gerais**
- Limpeza e Profilaxia
- Tratamento de Canal
- Extração Dentária
- Tratamento de Gengiva
- Periodontia

**5. Especialidades**
- Odontopediatria
- Cirurgia Bucomaxilofacial
- DTM e Dor Orofacial
- Odontologia para Idosos
- Odontologia do Sono

### Para cada serviço marcado:

**Opções:**
- [ ] Marcar como "Serviço em Destaque" (máx 3)
- [ ] Adicionar descrição curta (opcional)
- [ ] Upload de foto do serviço (opcional)

**Serviço Customizado:**
- Nome do serviço
- Descrição
- Categoria (dropdown)

### Dados salvos:
```json
{
  "servicos": [
    {
      "nome": "Clareamento Dental",
      "categoria": "Estética Dental",
      "destaque": true,
      "descricao": "Clareamento a laser com resultados em 1 sessão",
      "foto": null
    },
    {
      "nome": "Implante Dentário",
      "categoria": "Implantes",
      "destaque": true,
      "descricao": "Implantes com carga imediata",
      "foto": { "url": "base64...", "nome": "implante.jpg" }
    },
    {
      "nome": "Bichectomia",
      "categoria": "Customizado",
      "destaque": false,
      "descricao": "Procedimento estético facial",
      "foto": null
    }
  ]
}
```

---

## ⭐ Página 5: Depoimentos e Prova Social
**Objetivo:** Construir credibilidade

### Layout Visual:
```
┌─────────────────────────────────────────────────┐
│  Vamos mostrar a confiança dos seus pacientes  │
│                                                 │
│  Depoimentos e avaliações aumentam em 300% a   │
│  conversão do site!                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  📱 GOOGLE MEU NEGÓCIO                          │
│  ┌─────────────────────────────────────────┐   │
│  │ ⦿ Sim, tenho Google Meu Negócio         │   │
│  │   Link: [___________________________]   │   │
│  │   Avaliação: 4.9 ⭐ (127 avaliações)     │   │
│  │   ✓ Mostrar no site automaticamente     │   │
│  │                                         │   │
│  │ ○ Não tenho ainda                       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  💬 DEPOIMENTOS DE PACIENTES                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Depoimento #1                           │   │
│  │ ┌─────────────────────────────────────┐ │   │
│  │ │ Nome: Maria Santos                  │ │   │
│  │ │ Foto: [Upload] [Opcional]           │ │   │
│  │ │ Avaliação: ⭐⭐⭐⭐⭐               │ │   │
│  │ │ Texto:                              │ │   │
│  │ │ [________________________]          │ │   │
│  │ │ [________________________]          │ │   │
│  │ │ [________________________]          │ │   │
│  │ │                                     │ │   │
│  │ │ Procedimento realizado:             │ │   │
│  │ │ [Implante Dentário ▼]               │ │   │
│  │ └─────────────────────────────────────┘ │   │
│  │                                         │   │
│  │ [+ Adicionar outro depoimento]          │   │
│  │ (Recomendado: 3-6 depoimentos)          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🏆 CERTIFICAÇÕES E SELOS                       │
│  ┌─────────────────────────────────────────┐   │
│  │ Marque as afiliações/certificações:     │   │
│  │                                         │   │
│  │ ☑ Conselho Regional de Odontologia     │   │
│  │ ☑ Associação Brasileira de Odontologia │   │
│  │ ☐ Sociedade Brasileira de Implantes    │   │
│  │ ☐ Invisalign Provider                   │   │
│  │ ☐ Nobel Biocare Certified              │   │
│  │                                         │   │
│  │ [+ Adicionar certificação customizada]  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Campos:

**1. Google Meu Negócio:**
- Tem perfil? Sim/Não
- Se sim: Link do GMB
- Auto-busca avaliação e nota (se possível via API)
- Checkbox: Mostrar avaliações do Google no site

**2. Depoimentos de Pacientes:**
Array de depoimentos:
- Nome do paciente *
- Foto (opcional - upload)
- Avaliação (1-5 estrelas) *
- Texto do depoimento * (max 300 caracteres)
- Procedimento relacionado (dropdown dos serviços)

Mínimo: 2 depoimentos
Recomendado: 4-6 depoimentos

**3. Certificações e Selos:**
Checkboxes de certificações comuns:
- CRO
- ABO
- SBI (Implantes)
- Invisalign Provider
- Nobel Biocare
- Straumann
- Customizado (nome + logo upload)

### Dados salvos:
```json
{
  "prova_social": {
    "google_meu_negocio": {
      "tem": true,
      "link": "https://goo.gl/maps/...",
      "avaliacao": 4.9,
      "num_avaliacoes": 127,
      "mostrar_site": true
    },
    "depoimentos": [
      {
        "nome": "Maria Santos",
        "foto": null,
        "estrelas": 5,
        "texto": "Excelente atendimento! Dr. João é muito atencioso...",
        "procedimento": "Implante Dentário"
      }
    ],
    "certificacoes": [
      { "nome": "CRO", "tipo": "predefinido" },
      { "nome": "Invisalign Diamond Provider", "tipo": "custom", "logo": "base64..." }
    ]
  }
}
```

---

## 📸 Página 6: Galeria Visual
**Objetivo:** Mostrar o consultório e ambiente

### Layout Visual:
```
┌─────────────────────────────────────────────────┐
│  Imagens que transmitem confiança              │
│                                                 │
│  Pacientes querem ver onde serão atendidos!    │
├─────────────────────────────────────────────────┤
│                                                 │
│  🏢 LOGO DA CLÍNICA                             │
│  ┌─────────────────────────────────────────┐   │
│  │ [ Upload de Logo ]                      │   │
│  │                                         │   │
│  │ Formatos: PNG (recomendado), SVG, JPG  │   │
│  │ Fundo transparente preferível           │   │
│  │                                         │   │
│  │ Preview:                                │   │
│  │ ┌─────────────┐                         │   │
│  │ │   [LOGO]    │                         │   │
│  │ └─────────────┘                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🏥 FOTOS DO CONSULTÓRIO                        │
│  ┌─────────────────────────────────────────┐   │
│  │ Upload múltiplo (4-8 fotos)             │   │
│  │                                         │   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │   │
│  │ │ [+] │ │ [+] │ │ [+] │ │ [+] │        │   │
│  │ └─────┘ └─────┘ └─────┘ └─────┘        │   │
│  │                                         │   │
│  │ Sugestões do que fotografar:            │   │
│  │ • Fachada da clínica                    │   │
│  │ • Recepção                              │   │
│  │ • Sala de atendimento                   │   │
│  │ • Equipamentos modernos                 │   │
│  │ • Sala de esterilização                 │   │
│  │ • Sala de espera                        │   │
│  │                                         │   │
│  │ OU escolha da biblioteca:               │   │
│  │ [Galeria com 20+ fotos profissionais]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🎨 PALETA DE CORES DO SITE                     │
│  ┌─────────────────────────────────────────┐   │
│  │ Baseado no seu logo, sugerimos:         │   │
│  │                                         │   │
│  │ Cor primária: [🎨] #0066CC              │   │
│  │ Cor secundária: [🎨] #00A8E8            │   │
│  │                                         │   │
│  │ Preview:                                │   │
│  │ ┌─────────────────────────────────────┐ │   │
│  │ │ [Botão] [Título] [Link]             │ │   │
│  │ └─────────────────────────────────────┘ │   │
│  │                                         │   │
│  │ ○ Usar cores sugeridas                  │   │
│  │ ○ Escolher minhas próprias cores        │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📱 REDES SOCIAIS (opcional)                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Instagram: [@___________]               │   │
│  │ Facebook: [/____________]               │   │
│  │ YouTube: [/____________]                │   │
│  │ LinkedIn: [/____________]               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Campos:

**1. Logo da Clínica:**
- Upload obrigatório
- Formatos: PNG, SVG, JPG
- Max 2MB
- Preview em tempo real

**2. Fotos do Consultório:**
- Upload múltiplo (4-8 fotos)
- OU escolher da biblioteca (20+ fotos profissionais)
- Mínimo: 4 fotos
- Recomendado: 6-8 fotos
- Sugestões de fotos

**3. Paleta de Cores:**
- Auto-sugere cores baseado no logo (se tiver)
- Permite customizar
- Preview em tempo real
- Cor primária (botões, destaques)
- Cor secundária (links, hover)

**4. Redes Sociais:**
- Instagram (opcional)
- Facebook (opcional)
- YouTube (opcional)
- LinkedIn (opcional)

### Dados salvos:
```json
{
  "galeria": {
    "logo": {
      "url": "base64...",
      "nome": "logo.png",
      "tipo": "png"
    },
    "fotos_consultorio": [
      { "url": "base64...", "nome": "fachada.jpg", "tipo": "upload" },
      { "url": "base64...", "nome": "recepcao.jpg", "tipo": "upload" },
      { "url": "/biblioteca/consultorio-3.jpg", "tipo": "biblioteca" }
    ],
    "cores": {
      "primaria": "#0066CC",
      "secundaria": "#00A8E8",
      "origem": "auto"
    },
    "redes_sociais": {
      "instagram": "@clinicadrjoao",
      "facebook": "/clinicadrjoao",
      "youtube": null,
      "linkedin": null
    }
  }
}
```

---

## 📍 Página 7: Localização e Contato
**Objetivo:** Facilitar que pacientes encontrem a clínica

### Mantém estrutura atual:

**Endereço:**
- CEP (busca automática)
- Rua
- Número
- Complemento
- Bairro
- Cidade
- Estado

**Horários:**
- Segunda a Sexta
- Sábado
- Domingo
- Feriados

**Contatos:**
- WhatsApp (já preenchido)
- Telefone fixo
- E-mail (já preenchido)

**Mapa:**
- Mostrar Google Maps no site? Sim/Não

### Dados salvos:
```json
{
  "localizacao": {
    "endereco": {
      "cep": "01310-100",
      "rua": "Av. Paulista",
      "numero": "1000",
      "complemento": "Sala 501",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP"
    },
    "horarios": {
      "segunda_sexta": "08:00 - 18:00",
      "sabado": "08:00 - 12:00",
      "domingo": "Fechado",
      "observacoes": "Feriados: Fechado"
    },
    "contato": {
      "whatsapp": "(11) 99999-9999",
      "telefone": "(11) 3333-3333",
      "email": "contato@clinica.com"
    },
    "mostrar_mapa": true
  }
}
```

---

## ⚙️ Página 8: Revisão Final e Configurações
**Objetivo:** Review completo + configs técnicas

### Layout Visual:
```
┌─────────────────────────────────────────────────┐
│  Quase pronto! Revise tudo antes de enviar     │
│                                                 │
│  📋 REVISÃO POR SEÇÃO                           │
│  ┌─────────────────────────────────────────┐   │
│  │ ✅ 1. Hero / Banner                     │   │
│  │    Título: "Cuidando do seu sorriso..." │   │
│  │    [Editar]                             │   │
│  │                                         │   │
│  │ ✅ 2. Sobre Você                        │   │
│  │    1 profissional cadastrado            │   │
│  │    [Editar]                             │   │
│  │                                         │   │
│  │ ✅ 3. Serviços                          │   │
│  │    8 serviços, 3 em destaque            │   │
│  │    [Editar]                             │   │
│  │                                         │   │
│  │ ✅ 4. Depoimentos                       │   │
│  │    4 depoimentos, GMB integrado         │   │
│  │    [Editar]                             │   │
│  │                                         │   │
│  │ ✅ 5. Galeria                           │   │
│  │    Logo + 6 fotos do consultório        │   │
│  │    [Editar]                             │   │
│  │                                         │   │
│  │ ✅ 6. Contato                           │   │
│  │    Endereço e horários completos        │   │
│  │    [Editar]                             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🔧 CONFIGURAÇÕES TÉCNICAS (Opcional)           │
│  ┌─────────────────────────────────────────┐   │
│  │ Google Analytics                        │   │
│  │ ID de Acompanhamento: [G-__________]    │   │
│  │                                         │   │
│  │ Meta Pixel (Facebook)                   │   │
│  │ Pixel ID: [___________]                 │   │
│  │                                         │   │
│  │ Google Tag Manager                      │   │
│  │ Container ID: [GTM-______]              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  📊 RESUMO DO PEDIDO                            │
│  ┌─────────────────────────────────────────┐   │
│  │ Site Profissional Completo              │   │
│  │                                         │   │
│  │ Inclui:                                 │   │
│  │ ✓ Design responsivo (mobile + desktop) │   │
│  │ ✓ Formulário de contato integrado      │   │
│  │ ✓ WhatsApp flutuante                   │   │
│  │ ✓ Otimização SEO                       │   │
│  │ ✓ Hospedagem inclusa (1 ano)           │   │
│  │ ✓ Suporte técnico                      │   │
│  │                                         │   │
│  │ Prazo de entrega: 24 horas             │   │
│  │                                         │   │
│  │ Valor total: R$ 497,00                 │   │
│  │ • Entrada: R$ 248,50 (50%)             │   │
│  │ • Saldo: R$ 248,50 (na aprovação)      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ☑ Li e concordo com os termos de serviço      │
│                                                 │
│  [◀ Voltar]  [Enviar e Ir para Pagamento ▶]   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Seções:

**1. Revisão Visual por Seção:**
- Lista todas as seções preenchidas
- Mostra resumo de cada uma
- Botão "Editar" volta para aquela página
- Ícone ✅ se completo, ⚠️ se faltando algo

**2. Configurações Técnicas (Opcional):**
- Google Analytics ID
- Meta Pixel ID
- Google Tag Manager

**3. Resumo do Pedido:**
- O que está incluído
- Prazo de entrega
- Valor total
- Formas de pagamento

**4. Aceite de Termos:**
- Checkbox obrigatório
- Link para termos de serviço

**5. Botão Final:**
- "Enviar e Ir para Pagamento"
- Salva tudo no banco
- Redireciona para página de pagamento

### Dados salvos:
```json
{
  "rastreamento": {
    "google_analytics": "G-XXXXXXXXXX",
    "meta_pixel": "123456789",
    "google_tag_manager": "GTM-XXXXXXX"
  },
  "termos_aceitos": true,
  "data_envio": "2025-12-23T22:30:00Z"
}
```

---

## 📊 Resumo da Estrutura

| Página | Título | Objetivo | Tempo | Campos |
|--------|--------|----------|-------|--------|
| 1 | Informações Básicas | Captura de lead | 1min | 4 |
| 2 | Hero/Banner | Primeira impressão | 3min | 5 |
| 3 | Sobre Você | Apresentação | 4min | 8+ |
| 4 | Serviços | Mostrar ofertas | 3min | N |
| 5 | Depoimentos | Credibilidade | 4min | N |
| 6 | Galeria | Visual | 3min | 4+ |
| 7 | Localização | Contato | 2min | 10 |
| 8 | Revisão | Confirmar tudo | 2min | - |

**Total:** ~20 minutos

---

## ✅ Aprovação

Revise esta estrutura e me diga:

**1. Página 2 (Hero) está OK?**
- [ ] Sim, implementar assim
- [ ] Ajustar: ___________

**2. Página 4 (Serviços) está OK?**
- [ ] Sim, implementar assim
- [ ] Ajustar: ___________

**3. Página 5 (Depoimentos) está OK?**
- [ ] Sim, implementar assim
- [ ] Ajustar: ___________

**4. Página 6 (Galeria) está OK?**
- [ ] Sim, implementar assim
- [ ] Ajustar: ___________

**5. Alguma mudança geral?**
- ___________

**Após sua aprovação, começo a implementar!** 🚀
