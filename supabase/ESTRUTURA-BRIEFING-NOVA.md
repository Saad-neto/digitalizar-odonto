# Estrutura do Briefing - Nova Versão (5 Páginas)

## 📋 Visão Geral

O campo `briefing_data` na tabela `leads` é do tipo JSONB e armazena todos os dados do formulário de briefing.

## 🗂️ Estrutura Completa dos Campos

### PÁGINA 1: Informações Essenciais

```json
{
  // Tipo de negócio
  "tipo_negocio": "individual | parceria | clinica",

  // Dados básicos
  "nome_consultorio": "string",
  "nome": "string",
  "whatsapp": "string (11 dígitos)",
  "email": "string",

  // Slogan
  "slogan_opcao": "anos_experiencia | sorriso_perfeito | tecnologia_avancada | atendimento_humanizado | especialistas_sorrisos | transformamos_sorrisos | custom | confiamos",
  "slogan_custom": "string (se slogan_opcao = custom)",
  "slogan_anos": "number (se slogan_opcao = anos_experiencia)",

  // Informações adicionais
  "ano_inicio": "number (1970-2025)",
  "num_pacientes": "number",
  "tem_google_negocio": "sim | nao",
  "link_google_maps": "string URL (se tem_google_negocio = sim)"
}
```

### PÁGINA 2: Profissionais (Condicional)

#### Se tipo_negocio = "individual" OU "parceria"

```json
{
  // Profissional 1
  "profissional1_nome": "string",
  "profissional1_apresentacao": "dr | dra | doutor | doutora | nome_completo",
  "profissional1_cro": "string",
  "profissional1_uf": "string (2 letras)",
  "profissional1_especialidade": "string",
  "profissional1_formacao": "string",
  "profissional1_bio": "string (opcional)",
  "profissional1_foto": "UploadedFile[] (opcional)"
}
```

#### Se tipo_negocio = "parceria" (adiciona Profissional 2)

```json
{
  // Profissional 2
  "profissional2_nome": "string",
  "profissional2_apresentacao": "dr | dra | doutor | doutora | nome_completo",
  "profissional2_cro": "string",
  "profissional2_uf": "string (2 letras)",
  "profissional2_especialidade": "string",
  "profissional2_formacao": "string",
  "profissional2_bio": "string (opcional)",
  "profissional2_foto": "UploadedFile[] (opcional)"
}
```

#### Se tipo_negocio = "clinica"

```json
{
  // Diretor Técnico
  "diretor_nome": "string",
  "diretor_cro": "string",
  "diretor_uf": "string (2 letras)",

  // Equipe
  "num_profissionais": "number",
  "destacar_profissionais": "sim | nao",
  "profissionais_destaque": "string (se destacar_profissionais = sim)"
}
```

### PÁGINA 3: Serviços e Diferenciais

```json
{
  // Serviços oferecidos (array de 3-6 itens)
  "servicos": [
    "limpeza",
    "clareamento",
    "restauracoes",
    "canal",
    "implantes",
    "proteses",
    "ortodontia_fixa",
    "ortodontia_invisivel",
    "extracao",
    "periodontia",
    "odontopediatria",
    "harmonizacao",
    "bichectomia",
    "lentes",
    "facetas",
    "cirurgia",
    "dtm",
    "emergencia",
    "outro"
  ],
  "servico_outro": "string (se servicos inclui 'outro')",

  // Convênios
  "aceita_convenios": "sim | nao",
  "lista_convenios_array": [
    "odontoprev",
    "bradesco",
    "amil",
    "sulamerica",
    "unimed",
    "porto_seguro",
    "metlife",
    "interodonto",
    "hapvida",
    "notredame",
    "dental_uni",
    "golden_cross",
    "sompo",
    "caixa_seguradora",
    "outro_convenio"
  ],
  "outro_convenio": "string (se lista_convenios_array inclui 'outro_convenio')",

  // Atendimento
  "atende_emergencia": "sim_24h | nao_horario",

  // Tecnologias (array de checkboxes)
  "tecnologias": [
    "tomografia",
    "anestesia",
    "microscopia",
    "scanner",
    "radiografia",
    "laser",
    "implante",
    "camera",
    "impressao",
    "sedacao",
    "piezocirurgia",
    "tecnologia_ponta"
  ],

  // Sedação
  "oferece_sedacao": "sim | nao"
}
```

### PÁGINA 4: Localização e Contato

```json
{
  // Endereço
  "cep": "string (00000-000)",
  "rua": "string",
  "numero": "string",
  "bairro": "string",
  "cidade": "string",
  "estado": "string (2 letras)",
  "complemento": "string (opcional)",

  // Facilidades
  "tem_estacionamento": "sim_gratuito | nao_conveniado",

  // Horários de atendimento (array de checkboxes)
  "horarios_atendimento": [
    "manha",
    "tarde",
    "noite",
    "sabado",
    "domingo"
  ],

  // Mapa
  "exibir_mapa": "sim | nao",

  // Redes Sociais
  "tem_redes_sociais": "sim | nao",
  "instagram": "string URL (opcional)",
  "facebook": "string URL (opcional)",
  "linkedin": "string URL (opcional)",
  "outras_redes": "string URL (opcional)"
}
```

### PÁGINA 5: Depoimentos e Revisão Final

```json
{
  // Estratégia de depoimentos
  "estrategia_depoimentos": "google | texto | nao",

  // Se estrategia_depoimentos = "google"
  "link_google_maps": "string URL",

  // Se estrategia_depoimentos = "texto"
  "depoimentos_texto": "string (depoimentos separados por linha)",

  // Observações finais
  "observacoes_finais": "string (opcional)"
}
```

## 📊 Tipo UploadedFile

```typescript
interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: string; // Data URL base64
}
```

## 🔍 Exemplos de Queries

### 1. Ver todos os leads com briefing completo

```sql
SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  briefing_data->>'tipo_negocio' as tipo_negocio,
  briefing_data->>'nome_consultorio' as consultorio,
  created_at
FROM leads
WHERE jsonb_typeof(briefing_data) = 'object'
  AND briefing_data != '{}'::jsonb
ORDER BY created_at DESC;
```

### 2. Filtrar por tipo de negócio

```sql
SELECT *
FROM leads
WHERE briefing_data->>'tipo_negocio' = 'clinica';
```

### 3. Leads que aceitam convênios

```sql
SELECT
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'aceita_convenios' as aceita_convenios,
  briefing_data->'lista_convenios_array' as convenios
FROM leads
WHERE briefing_data->>'aceita_convenios' = 'sim';
```

### 4. Leads por serviço oferecido

```sql
SELECT
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->'servicos' as servicos
FROM leads
WHERE briefing_data->'servicos' ? 'implantes'; -- Oferece implantes
```

### 5. Leads com Google Meu Negócio

```sql
SELECT
  nome,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'link_google_maps' as google_maps,
  briefing_data->>'estrategia_depoimentos' as estrategia_dep
FROM leads
WHERE briefing_data->>'tem_google_negocio' = 'sim'
   OR briefing_data->>'estrategia_depoimentos' = 'google';
```

### 6. Estatísticas de serviços mais oferecidos

```sql
SELECT
  servico,
  COUNT(*) as total
FROM leads,
  jsonb_array_elements_text(briefing_data->'servicos') as servico
GROUP BY servico
ORDER BY total DESC;
```

### 7. Estatísticas de convênios aceitos

```sql
SELECT
  convenio,
  COUNT(*) as total
FROM leads,
  jsonb_array_elements_text(briefing_data->'lista_convenios_array') as convenio
WHERE briefing_data->>'aceita_convenios' = 'sim'
GROUP BY convenio
ORDER BY total DESC;
```

### 8. Leads por estado (localização)

```sql
SELECT
  briefing_data->>'estado' as estado,
  briefing_data->>'cidade' as cidade,
  COUNT(*) as total
FROM leads
WHERE briefing_data->>'estado' IS NOT NULL
GROUP BY estado, cidade
ORDER BY total DESC;
```

## 🔄 Migration de Dados Antigos (se necessário)

Se você já tem leads com estrutura antiga, pode migrar assim:

```sql
-- Exemplo: Migrar campo antigo para novo
UPDATE leads
SET briefing_data = jsonb_set(
  briefing_data,
  '{novo_campo}',
  to_jsonb(briefing_data->>'campo_antigo')
)
WHERE briefing_data ? 'campo_antigo';
```

## ✅ Validação de Dados

### Verificar leads com dados incompletos

```sql
SELECT
  id,
  nome,
  email,
  CASE
    WHEN briefing_data->>'tipo_negocio' IS NULL THEN 'Falta tipo_negocio'
    WHEN briefing_data->>'nome_consultorio' IS NULL THEN 'Falta nome_consultorio'
    WHEN briefing_data->>'estrategia_depoimentos' IS NULL THEN 'Falta estrategia_depoimentos'
    ELSE 'OK'
  END as status_dados
FROM leads
ORDER BY created_at DESC;
```

## 🎯 Índices Recomendados (JSONB GIN)

Para melhor performance em queries JSONB:

```sql
-- Índice GIN para buscas em campos JSONB
CREATE INDEX idx_leads_briefing_gin ON leads USING GIN (briefing_data);

-- Índice para campo específico muito usado
CREATE INDEX idx_leads_tipo_negocio ON leads ((briefing_data->>'tipo_negocio'));
CREATE INDEX idx_leads_aceita_convenios ON leads ((briefing_data->>'aceita_convenios'));
```
