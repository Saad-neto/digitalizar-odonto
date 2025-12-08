# 🗺️ Mapeamento: Formulário → Banco de Dados

## De onde vem → Para onde vai

Baseado nos prints do formulário preenchido pelo Dr. Carlos Eduardo.

---

## 📋 SEÇÃO 1: Informações Pessoais (13%)

### **O que o cliente vê no formulário:**
```
Como você gostaria de ser chamado? *
└─ Dr. Carlos Eduardo

WhatsApp para contato *
└─ (11) 99123-9999

Seu melhor e-mail *
└─ carlos.eduardo@clinica.com.br
```

### **Onde é salvo no Supabase:**
```sql
Tabela: leads

-- Campos diretos (fora do JSON)
nome = "Dr. Carlos Eduardo"
email = "carlos.eduardo@clinica.com.br"
whatsapp = "(11) 99123-9999"
```

### **Como acessar via SQL:**
```sql
SELECT nome, email, whatsapp
FROM leads
WHERE email = 'carlos.eduardo@clinica.com.br';
```

---

## 🏠 SEÇÃO 2: Homepage/Cabeçalho (25%)

### **O que o cliente vê:**
```
Qual o nome do consultório? *
└─ Clínica Odontológica Dr. Carlos Eduardo

Tem slogan ou frase de posicionamento? *
└─ ● Sim
   └─ "Cuidando do seu sorriso com excelência"

Quais as principais especialidades?
└─ ☑ Clínica Geral
   ☑ Implantodontia
   ☑ Ortodontia
   ... (pode marcar várias)
```

### **Onde é salvo:**
```sql
Tabela: leads
Campo: briefing_data (JSONB)

{
  "nome_consultorio": "Clínica Odontológica Dr. Carlos Eduardo",
  "tem_slogan": "sim",
  "slogan_texto": "Cuidando do seu sorriso com excelência",
  "especialidades": [
    "Clínica Geral",
    "Implantodontia",
    "Ortodontia"
  ]
}
```

### **Como acessar:**
```sql
-- Nome do consultório
SELECT briefing_data->>'nome_consultorio' as consultorio
FROM leads;

-- Slogan
SELECT briefing_data->>'slogan_texto' as slogan
FROM leads;

-- Especialidades
SELECT briefing_data->'especialidades' as especialidades
FROM leads;
```

---

## 👥 SEÇÃO 3: Sobre Nós/Equipe (38%)

### **O que o cliente vê:**
```
Profissional 1:
├─ Nome do profissional: Dr. Carlos Eduardo
├─ Especialidade: Implantodontia
├─ Anos de experiência: 15 anos
├─ Breve descrição: Especialista em...
└─ 📸 Foto do profissional: [Upload]

Profissional 2:
├─ Nome: Dra. Maria Silva
├─ Especialidade: Ortodontia
└─ ...
```

### **Onde é salvo:**
```json
{
  "numero_dentistas": "2",
  "profissionais": [
    {
      "nome": "Dr. Carlos Eduardo",
      "especialidade": "Implantodontia",
      "experiencia": "15 anos",
      "descricao": "Especialista em implantes dentários...",
      "foto": {
        "name": "carlos.jpg",
        "type": "image/jpeg",
        "size": 180000,
        "data": "data:image/jpeg;base64,/9j/4AAQ..."
      }
    },
    {
      "nome": "Dra. Maria Silva",
      "especialidade": "Ortodontia",
      "experiencia": "10 anos",
      "descricao": "...",
      "foto": { ... }
    }
  ]
}
```

### **Como acessar:**
```sql
-- Ver todos os profissionais
SELECT
  nome,
  briefing_data->'profissionais' as equipe
FROM leads;

-- Contar quantos profissionais
SELECT
  nome,
  jsonb_array_length(briefing_data->'profissionais') as qtd_profissionais
FROM leads;
```

---

## 🦷 SEÇÃO 4: Serviços/Tratamentos (50%)

### **O que o cliente vê:**
```
3 serviços mais procurados:
├─ 1. Limpeza e profilaxia
├─ 2. Clareamento dental
└─ 3. Restaurações em resina

Aceita convênios? *
└─ ● Sim, aceito convênios
   └─ Unimed, Bradesco Dental, SulAmérica, etc.

Emergência 24h? *
└─ ● Sim, 24 horas
```

### **Onde é salvo:**
```json
{
  "servicos_procurados": "1. Limpeza e profilaxia\n2. Clareamento dental\n3. Restaurações em resina",
  "convenios": "sim",
  "convenios_lista": "Unimed, Bradesco Dental, SulAmérica, etc.",
  "emergencia_24h": "sim"
}
```

### **Como acessar:**
```sql
SELECT
  nome,
  briefing_data->>'servicos_procurados' as servicos,
  briefing_data->>'convenios_lista' as convenios,
  briefing_data->>'emergencia_24h' as emergencia
FROM leads;
```

---

## ⚙️ SEÇÃO 5: Tecnologia/Diferenciais (63%)

### **O que o cliente vê:**
```
Equipamentos disponíveis:
└─ ☑ Radiografia digital
   ☑ Scanner intraoral
   ☑ Laser odontológico
   ☑ Tomografia computadorizada
   ... (pode marcar vários)

Oferece sedação consciente? *
└─ ● Sim, oferecemos sedação
```

### **Onde é salvo:**
```json
{
  "equipamentos": [
    "Radiografia digital",
    "Scanner intraoral",
    "Laser odontológico",
    "Tomografia computadorizada"
  ],
  "sedacao_consciente": "sim"
}
```

### **Como acessar:**
```sql
SELECT
  nome,
  briefing_data->'equipamentos' as tecnologias,
  briefing_data->>'sedacao_consciente' as sedacao
FROM leads;
```

---

## 📍 SEÇÃO 6: Localização/Contato (75%)

### **O que o cliente vê:**
```
CEP *: 00000-000 → Auto-preenche:
├─ Rua: Rua das Flores
├─ Bairro: Centro
├─ Cidade: São Paulo
└─ UF: SP

Número: 123

Estacionamento? *
└─ ● Sim, temos estacionamento

Redes sociais:
└─ ☑ Facebook
   ☑ Instagram
   ☑ YouTube

Google Meu Negócio?
└─ ● Sim, já temos

Incorporar mapa?
└─ ● Sim, quero mostrar a localização
   └─ Link Google Maps: https://maps.google.com/...
```

### **Onde é salvo:**
```json
{
  "cep": "00000-000",
  "rua": "Rua das Flores",
  "numero": "123",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "uf": "SP",
  "estacionamento": "sim",
  "redes_sociais": ["📘 Facebook", "📸 Instagram", "🎬 YouTube"],
  "link_facebook": "",
  "link_instagram": "",
  "link_youtube": "",
  "incorporarMapa": "sim",
  "link_google_maps": "https://maps.google.com/..."
}
```

### **Como acessar:**
```sql
-- Endereço completo
SELECT
  nome,
  CONCAT(
    briefing_data->>'rua', ', ',
    briefing_data->>'numero', ' - ',
    briefing_data->>'bairro', ', ',
    briefing_data->>'cidade', '/',
    briefing_data->>'uf'
  ) as endereco_completo
FROM leads;

-- Redes sociais
SELECT
  nome,
  briefing_data->'redes_sociais' as redes
FROM leads;
```

---

## 💬 SEÇÃO 7: Depoimentos/Cases (88%)

### **O que o cliente vê:**
```
Tem depoimentos de pacientes satisfeitos? *
└─ ○ Sim, temos vários
   ○ Não temos ainda

Utilizar avaliações do Google? *
└─ ● Sim, quero mostrar minhas avaliações do Google
   ○ ✗ Não vamos usar depoimentos
```

### **Onde é salvo:**
```json
{
  "tem_depoimentos": "não",
  "depoimentos_upload": [],
  "avaliacoes_google": "sim",
  "link_google_avaliacoes": ""
}
```

### **Como acessar:**
```sql
SELECT
  nome,
  briefing_data->>'tem_depoimentos' as tem_depoimentos,
  briefing_data->>'avaliacoes_google' as usa_google,
  briefing_data->'depoimentos_upload' as arquivos_depoimentos
FROM leads;
```

---

## 🎨 SEÇÃO 8: Identidade Visual/Design (100%)

### **O que o cliente vê:**
```
Tem logotipo existente? *
└─ ● Sim, já temos logo
   └─ 📤 Upload do arquivo: logo.png

Fotos do consultório? *
└─ ● Sim, tenho fotos
   └─ 📤 Upload múltiplo:
      - fachada.jpg
      - recepcao.jpg
      - consultorio.jpg

Estilo de fonte preferido:
└─ Moderno e clean

Tom de linguagem:
└─ Acessível e amigável

Textos customizados:
└─ "Somos uma clínica com 20 anos..."
```

### **Onde é salvo:**
```json
{
  "logotipo_existente": "sim",
  "logotipo_upload": {
    "name": "logo.png",
    "type": "image/png",
    "size": 85000,
    "data": "data:image/png;base64,iVBORw0KGgo..."
  },
  "fotos_consultorio": "sim",
  "fotos_upload": [
    {
      "name": "fachada.jpg",
      "type": "image/jpeg",
      "size": 320000,
      "data": "data:image/jpeg;base64,/9j/4AAQ..."
    },
    {
      "name": "recepcao.jpg",
      "type": "image/jpeg",
      "size": 280000,
      "data": "data:image/jpeg;base64,/9j/4AAQ..."
    }
  ],
  "estilo_fonte": "Moderno e clean",
  "tom_linguagem": "Acessível e amigável",
  "textos_existentes": "Somos uma clínica com 20 anos..."
}
```

### **Como acessar:**
```sql
-- Verificar se tem logo
SELECT
  nome,
  CASE
    WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN 'SIM ✓'
    ELSE 'NÃO ✗'
  END as tem_logo
FROM leads;

-- Ver quantidade de fotos
SELECT
  nome,
  jsonb_array_length(briefing_data->'fotos_upload') as qtd_fotos
FROM leads;

-- Estilo e tom
SELECT
  nome,
  briefing_data->>'estilo_fonte' as estilo,
  briefing_data->>'tom_linguagem' as tom
FROM leads;
```

---

## 🎯 RESUMO: Estrutura Completa no Banco

```sql
Tabela: leads
├── id (UUID) ← gerado automaticamente
├── created_at (timestamp) ← quando preencheu
├── updated_at (timestamp) ← última modificação
├── status ("novo", "pago_50", etc)
│
├── nome = "Dr. Carlos Eduardo"
├── email = "carlos.eduardo@clinica.com.br"
├── whatsapp = "(11) 99123-9999"
│
└── briefing_data (JSONB) ← TUDO DAQUI! ⭐
    ├── Seção 1: já está em campos separados
    ├── Seção 2: nome_consultorio, slogan_texto, especialidades[]
    ├── Seção 3: numero_dentistas, profissionais[]
    ├── Seção 4: servicos_procurados, convenios_lista, emergencia_24h
    ├── Seção 5: equipamentos[], sedacao_consciente
    ├── Seção 6: cep, rua, cidade, redes_sociais[], links
    ├── Seção 7: tem_depoimentos, avaliacoes_google
    └── Seção 8: logotipo_upload{}, fotos_upload[], estilo_fonte, tom_linguagem
```

---

## 📊 Como Visualizar AGORA no Supabase

### **Opção 1: Table Editor (Visual)**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Menu lateral → **Table Editor**
4. Clique em **`leads`**
5. Você verá uma linha para cada lead
6. Clique no ícone **🔍** na coluna `briefing_data` para expandir o JSON

### **Opção 2: SQL Editor (Completo)**

1. Menu lateral → **SQL Editor**
2. Cole e execute:

```sql
-- Ver todos os dados do Dr. Carlos Eduardo
SELECT
  id,
  nome,
  email,
  whatsapp,
  status,
  created_at,
  jsonb_pretty(briefing_data) as dados_completos
FROM leads
WHERE nome LIKE '%Carlos%'
ORDER BY created_at DESC;
```

### **Opção 3: Ver Campos Específicos**

```sql
-- Dados essenciais formatados
SELECT
  nome,
  email,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'slogan_texto' as slogan,
  briefing_data->'especialidades' as especialidades,
  briefing_data->>'cidade' as cidade,
  briefing_data->>'servicos_procurados' as servicos,
  briefing_data->>'estilo_fonte' as estilo,

  -- Verificar arquivos
  CASE WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN '✓ SIM' ELSE '✗ NÃO' END as tem_logo,
  COALESCE(jsonb_array_length(briefing_data->'fotos_upload'), 0) as qtd_fotos

FROM leads
ORDER BY created_at DESC;
```

---

## 🔄 Como Processar os Dados

Use o **dataProcessor.ts** que criamos:

```typescript
import { processBriefing } from '@/lib/dataProcessor';
import { getLeadById } from '@/lib/supabase';

// 1. Buscar lead
const lead = await getLeadById('uuid-do-dr-carlos');

// 2. Processar
const processed = await processBriefing(lead);

// 3. Dados prontos para usar!
console.log('Consultório:', processed.clinica.nome);
// → "Clínica Odontológica Dr. Carlos Eduardo"

console.log('Slogan:', processed.clinica.slogan);
// → "Cuidando do seu sorriso com excelência"

console.log('Logo URL:', processed.branding.logo_url);
// → "https://storage.supabase.co/.../logo.png" (após processar)

console.log('Especialidades:', processed.clinica.especialidades);
// → ["Clínica Geral", "Implantodontia", "Ortodontia"]

console.log('WhatsApp Link:', processed.cliente.whatsapp_link);
// → "https://wa.me/5511991239999"
```

---

## ✅ CONCLUSÃO

**TODAS as 8 páginas do formulário** estão sendo salvas em:

```
Supabase → Tabela "leads" → Campo "briefing_data" (JSON)
```

- ✅ Textos
- ✅ Checkboxes selecionados
- ✅ Radio buttons
- ✅ Imagens (base64)
- ✅ Tudo!

**Para ver os dados:**
1. Execute `VER-DADOS-LEADS.sql` no SQL Editor
2. Ou use o Table Editor e clique em expandir 🔍
3. Ou processe com `dataProcessor.ts`

**Nada se perde! Tudo está salvo!** 🎉
