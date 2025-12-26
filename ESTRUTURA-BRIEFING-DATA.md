# Estrutura do briefing_data (JSONB)

Este documento descreve a estrutura completa do campo `briefing_data` na tabela `leads`.

## Visão Geral

O campo `briefing_data` é do tipo **JSONB** no PostgreSQL/Supabase, permitindo armazenar dados flexíveis e complexos sem precisar criar múltiplas tabelas relacionadas.

## Estrutura por Seção

### SEÇÃO 1: Informações Essenciais

```json
{
  "nome_consultorio": "Clínica Odontológica Dr. Silva",
  "nome": "Dr. Carlos Silva",
  "whatsapp": "(11) 99999-9999",
  "email": "contato@clinica.com",
  "especialidade_principal": "Implantodontia"
}
```

**Campos obrigatórios:**
- ✅ nome_consultorio (mín. 3 caracteres)
- ✅ nome (mín. 3 caracteres)
- ✅ whatsapp (formato válido)
- ✅ email (formato válido)

---

### SEÇÃO 2: Hero / Banner Principal

```json
{
  "hero_titulo_tipo": "opcao1|opcao2|opcao3|custom",
  "hero_titulo": "Texto do título do banner (max 60 chars)",

  "hero_subtitulo_tipo": "opcao1|opcao2|opcao3|custom",
  "hero_subtitulo": "Texto do subtítulo (max 120 chars)",

  "hero_cta_tipo": "agendar|whatsapp|telefone|custom",
  "hero_cta_texto": "Texto do botão (max 40 chars)",

  "widget1_numero": "500+",
  "widget1_label": "Pacientes Atendidos",

  "widget2_numero": "15",
  "widget2_label": "Anos de Experiência",

  "widget3_numero": "4.9",
  "widget3_label": "Avaliação Google",

  "widget4_numero": "100%",
  "widget4_label": "Satisfação",

  "ocultar_widgets": false
}
```

**Campos opcionais** - Personalização do banner principal

---

### SEÇÃO 3: Sobre a Clínica

```json
{
  "sobre_titulo_tipo": "sobre_nos|sobre_clinica|nossa_historia|custom",
  "sobre_titulo": "Título personalizado (max 60 chars)",

  "sobre_texto": "Texto descritivo sobre a clínica (300-800 chars recomendado)",

  "redes_sociais": [
    {
      "tipo": "instagram|facebook|youtube|linkedin|tiktok",
      "url": "https://...",
      "usuario": "@usuario"
    }
  ],

  "anos_experiencia": "15",
  "missao": "Nossa missão...",
  "visao": "Nossa visão...",
  "valores": "Nossos valores..."
}
```

---

### SEÇÃO 4: Equipe

```json
{
  "profissionais": [
    {
      "nome": "Dr. Carlos Silva",
      "registro": "CRO-SP 12345",
      "especialidade": "Implantodontia",
      "descricao": "Descrição do profissional...",
      "foto": "data:image/jpeg;base64,...",
      "redesSociais": [
        {
          "tipo": "instagram",
          "url": "https://instagram.com/dr.carlos",
          "usuario": "@dr.carlos"
        }
      ]
    }
  ]
}
```

**Campos obrigatórios:**
- ✅ Mínimo 1 profissional
- ✅ nome do profissional
- ✅ registro (CRO)

---

### SEÇÃO 5: Serviços e Diferenciais

```json
{
  "servicos": [
    "limpeza",
    "clareamento",
    "implantes",
    "ortodontia_fixa"
  ],
  "servico_customizando": false,
  "servico_outro_temp": "",
  "servico_outro": "Serviço personalizado",

  "aceita_convenios": "sim|nao",
  "lista_convenios": "Unimed, Bradesco Dental, OdontoPrev",

  "diferenciais": [
    "Atendimento 24h",
    "Equipamentos modernos",
    "Equipe especializada"
  ],
  "diferencial_customizando": false,
  "diferencial_outro_temp": "",
  "diferencial_outro": "Diferencial personalizado"
}
```

**Campos obrigatórios:**
- ✅ Mínimo 1 serviço
- ✅ aceita_convenios (sim/nao)
- ✅ lista_convenios (se aceita_convenios = "sim")

---

### SEÇÃO 6: Identidade Visual

```json
{
  "cores_personalizadas": [
    {
      "tipo": "primaria",
      "valor": "#8B5CF6"
    },
    {
      "tipo": "secundaria",
      "valor": "#10B981"
    },
    {
      "tipo": "texto",
      "valor": "#1F2937"
    },
    {
      "tipo": "fundo",
      "valor": "#FFFFFF"
    },
    {
      "tipo": "destaque",
      "valor": "#F59E0B"
    }
  ],

  "sites_referencia_array": [
    {
      "url": "https://exemplo.com",
      "motivo": "Gosto do layout moderno e clean"
    }
  ]
}
```

**Tipos de cores:**
- primaria
- secundaria
- texto
- fundo
- destaque

---

### SEÇÃO 7: Localização e Contato

```json
{
  "estrategia_depoimentos": "google|texto|nao",
  "link_google_maps": "https://...",
  "depoimentos_texto": "Nome: João\nDepoimento: Excelente atendimento...",

  "cep": "01310-100",
  "rua": "Av. Paulista",
  "numero": "1578",
  "complemento": "Sala 1201",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",

  "horarios_atendimento_array": [
    {
      "dia": "segunda",
      "inicio": "08:00",
      "fim": "18:00"
    },
    {
      "dia": "terca",
      "inicio": "08:00",
      "fim": "18:00"
    },
    {
      "dia": "sabado",
      "inicio": "09:00",
      "fim": "13:00"
    }
  ],

  "tem_estacionamento": "sim|nao",
  "tem_acessibilidade": "sim|nao",
  "exibir_mapa": "sim|nao",
  "link_mapa_embed": "https://www.google.com/maps/embed?..."
}
```

**Campos obrigatórios:**
- ✅ cep
- ✅ rua
- ✅ numero
- ✅ bairro
- ✅ cidade
- ✅ estado
- ✅ horarios_atendimento_array (mínimo 1 horário)
- ✅ tem_estacionamento
- ✅ exibir_mapa
- ✅ link_mapa_embed (se exibir_mapa = "sim")

**Dias válidos para horários:**
- segunda, terca, quarta, quinta, sexta, sabado, domingo

---

### SEÇÃO 8: Rastreamento e Integrações

```json
{
  "ga4_id": "G-XXXXXXXXXX",
  "meta_pixel_id": "123456789",
  "gtm_id": "GTM-XXXXXXX",
  "google_ads_conversion": "AW-123456789/...",
  "outras_tags": "<script>...</script>"
}
```

**Todos os campos são opcionais**

---

### SEÇÃO 9: Revisão Final

```json
{
  "observacoes_revisao": "Texto livre com observações, pedidos especiais, urgências, etc."
}
```

**Campo opcional** - Para observações finais do cliente

---

## Índices Criados

Para melhor performance, foram criados os seguintes índices:

```sql
-- Índice GIN para busca geral em JSONB
CREATE INDEX idx_leads_briefing_data_gin ON leads USING GIN (briefing_data);

-- Índices para campos específicos
CREATE INDEX idx_leads_briefing_nome_consultorio ON leads ((briefing_data->>'nome_consultorio'));
CREATE INDEX idx_leads_briefing_especialidade ON leads ((briefing_data->>'especialidade_principal'));
```

## Views Disponíveis

### v_leads_essenciais
Extrai dados principais de todos os leads

### v_leads_localizacao
Dados de endereço e localização

### v_leads_contato
Dados de contato e redes sociais

## Funções Úteis

```sql
-- Buscar profissionais de um lead
SELECT get_profissionais('uuid-do-lead');

-- Buscar serviços de um lead
SELECT get_servicos('uuid-do-lead');

-- Buscar horários de um lead
SELECT get_horarios('uuid-do-lead');

-- Buscar cores personalizadas
SELECT get_cores_personalizadas('uuid-do-lead');

-- Buscar leads por cidade
SELECT * FROM get_leads_by_cidade('São Paulo');

-- Buscar leads por especialidade
SELECT * FROM get_leads_by_especialidade('Implantodontia');
```

## Exemplos de Queries

### Contar leads por especialidade
```sql
SELECT
  briefing_data->>'especialidade_principal' as especialidade,
  COUNT(*) as total
FROM leads
WHERE briefing_data->>'especialidade_principal' IS NOT NULL
GROUP BY especialidade
ORDER BY total DESC;
```

### Leads que aceitam convênios
```sql
SELECT
  id,
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'lista_convenios' as convenios
FROM leads
WHERE briefing_data->>'aceita_convenios' = 'sim';
```

### Leads com atendimento aos sábados
```sql
SELECT
  id,
  nome,
  briefing_data->>'nome_consultorio' as consultorio
FROM leads
WHERE briefing_data->'horarios_atendimento_array' @> '[{"dia": "sabado"}]'::jsonb;
```

### Leads com paleta de cores personalizada
```sql
SELECT
  id,
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  jsonb_array_length(briefing_data->'cores_personalizadas') as num_cores
FROM leads
WHERE briefing_data->'cores_personalizadas' IS NOT NULL
  AND jsonb_array_length(briefing_data->'cores_personalizadas') > 0;
```

## Tamanho Estimado

O campo `briefing_data` armazena em média:
- **Texto**: 5-15 KB (dados textuais)
- **Imagens (base64)**: 500 KB - 3 MB (logo, fotos profissionais)
- **Total médio**: ~1-3 MB por lead

## Considerações

1. **Flexibilidade**: JSONB permite adicionar novos campos sem migração
2. **Performance**: Índices GIN otimizam queries complexas
3. **Validação**: Feita no frontend antes do envio
4. **Backup**: Importante fazer backup regular do banco
5. **Compressão**: PostgreSQL comprime automaticamente JSONB

---

**Última atualização**: 26/12/2025
**Versão do schema**: 2.0 (com novos campos dinâmicos)
