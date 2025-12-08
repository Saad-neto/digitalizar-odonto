# 📍 ONDE ESTÃO OS DADOS DOS LEADS?

## Resposta Rápida

**TODOS os dados** que o cliente preencheu (8 páginas + arquivos) estão armazenados no **Supabase**, na tabela `leads`, coluna `briefing_data` (formato JSON).

---

## 🗂️ Estrutura de Armazenamento

```
SUPABASE (PostgreSQL)
│
└── Tabela: leads
    ├── id (UUID)
    ├── nome (texto)
    ├── email (texto)
    ├── whatsapp (texto)
    ├── status ("novo", "pago_50", etc)
    ├── created_at (data)
    │
    └── briefing_data (JSONB) ← AQUI ESTÁ TUDO! ⭐
        ├── Seção 1: Homepage/Cabeçalho
        ├── Seção 2: Equipe
        ├── Seção 3: Serviços
        ├── Seção 4: Tecnologia
        ├── Seção 5: Localização
        ├── Seção 6: Depoimentos
        ├── Seção 7: Identidade Visual
        └── Arquivos (logo, fotos, depoimentos) em base64
```

---

## 📊 Como Visualizar os Dados

### **Opção 1: SQL Editor do Supabase** (Mais Fácil)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Cole e execute este script:

```sql
-- Ver todos os dados do primeiro lead
SELECT
  nome,
  email,
  whatsapp,
  jsonb_pretty(briefing_data) as dados_completos
FROM leads
ORDER BY created_at DESC
LIMIT 1;
```

**Ou execute o script completo:**
```bash
# Copie e cole no SQL Editor:
/root/projetos/sites-odonto/swift-dent-studio-16/supabase/VER-DADOS-LEADS.sql
```

---

### **Opção 2: Table Editor do Supabase** (Visual)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Table Editor** (menu lateral)
4. Clique na tabela `leads`
5. Você verá todos os leads em formato tabela
6. Clique no ícone de **expand** (🔍) na coluna `briefing_data` para ver o JSON

---

### **Opção 3: Via Código TypeScript**

```typescript
import { supabase } from '@/lib/supabase';

// Buscar todos os leads
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .order('created_at', { ascending: false });

// Ver dados do primeiro lead
console.log('Lead:', leads[0].nome);
console.log('Briefing completo:', leads[0].briefing_data);

// Acessar campos específicos
console.log('Nome do consultório:', leads[0].briefing_data.nome_consultorio);
console.log('Especialidades:', leads[0].briefing_data.especialidades);
console.log('Cidade:', leads[0].briefing_data.cidade);
```

---

## 📝 Exemplo Real de Como os Dados Ficam Salvos

### **Tabela `leads`:**

| id | nome | email | whatsapp | briefing_data | status |
|----|------|-------|----------|---------------|--------|
| uuid-123 | Dr. João Silva | joao@clinica.com | (11) 99999-9999 | `{...JSON...}` | novo |
| uuid-456 | Dra. Maria Santos | maria@odonto.com | (18) 98888-8888 | `{...JSON...}` | novo |

### **Dentro de `briefing_data` (JSON):**

```json
{
  // SEÇÃO 1: Homepage/Cabeçalho
  "nome_consultorio": "Clínica Odontológica Exemplo",
  "tem_slogan": "sim",
  "slogan_texto": "Seu sorriso é nossa missão",
  "especialidades": [
    "Implantodontia",
    "Estética Dental",
    "Periodontia"
  ],
  "outras_especialidades": "",

  // SEÇÃO 2: Equipe
  "numero_dentistas": "3",
  "profissionais": [
    {
      "nome": "Dr. João Silva",
      "especialidade": "Implantodontia",
      "experiencia": "15 anos",
      "descricao": "Especialista em implantes dentários...",
      "foto": {
        "name": "joao.jpg",
        "type": "image/jpeg",
        "size": 250000,
        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
      }
    }
  ],

  // SEÇÃO 3: Serviços
  "servicos_procurados": "Implantes, Clareamento, Limpeza, Ortodontia",
  "convenios": "sim",
  "convenios_lista": "Unimed, SulAmérica, Bradesco Dental",
  "emergencia_24h": "não",

  // SEÇÃO 4: Tecnologia
  "equipamentos": [
    "Raio-X Digital",
    "Scanner Intraoral",
    "Laser Odontológico"
  ],
  "sedacao_consciente": "sim",

  // SEÇÃO 5: Localização/Contato
  "cep": "19060-900",
  "rua": "Rua José Bongiovani",
  "numero": "1234",
  "bairro": "Cidade Universitária",
  "cidade": "Presidente Prudente",
  "uf": "SP",
  "complemento": "Sala 5",
  "estacionamento": "sim",
  "redes_sociais": ["📘 Facebook", "📸 Instagram"],
  "link_facebook": "https://facebook.com/clinica",
  "link_instagram": "https://instagram.com/clinica",
  "link_youtube": "",
  "link_linkedin": "",
  "link_tiktok": "",
  "incorporarMapa": "sim",
  "link_google_maps": "https://maps.google.com/?q=...",
  "link_google_avaliacoes": "https://g.page/...",

  // SEÇÃO 6: Depoimentos
  "tem_depoimentos": "sim",
  "depoimentos_upload": [
    {
      "name": "depoimento1.jpg",
      "type": "image/jpeg",
      "size": 180000,
      "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
    },
    {
      "name": "depoimento2.jpg",
      "type": "image/jpeg",
      "size": 220000,
      "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
    }
  ],
  "avaliacoes_google": "sim",

  // SEÇÃO 7: Identidade Visual
  "logotipo_existente": "sim",
  "logotipo_upload": {
    "name": "logo.png",
    "type": "image/png",
    "size": 85000,
    "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "manual_marca": "não",
  "fotos_consultorio": "sim",
  "fotos_upload": [
    {
      "name": "fachada.jpg",
      "type": "image/jpeg",
      "size": 320000,
      "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
    },
    {
      "name": "recepcao.jpg",
      "type": "image/jpeg",
      "size": 280000,
      "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
    },
    {
      "name": "consultorio.jpg",
      "type": "image/jpeg",
      "size": 290000,
      "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
    }
  ],
  "estilo_fonte": "Moderno e clean",
  "tom_linguagem": "Acessível e amigável",
  "textos_existentes": "Somos uma clínica com 20 anos de tradição..."
}
```

---

## 📸 Sobre os Arquivos (Imagens)

### **Como Estão Armazenados Agora:**

```json
"logotipo_upload": {
  "name": "logo.png",
  "type": "image/png",
  "size": 85000,  // Tamanho original em bytes
  "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."  // ← Imagem em base64
}
```

**Formato:** Base64 (texto)
**Localização:** Dentro do campo `briefing_data` (JSON)
**Tamanho típico:**
- Logo: 80-200 KB (após compressão)
- Fotos: 100-400 KB cada (após compressão)
- Depoimentos: 100-300 KB cada

### **Como Processar as Imagens:**

Use o `dataProcessor.ts` que criamos:

```typescript
import { processBriefing } from '@/lib/dataProcessor';
import { getLeadById } from '@/lib/supabase';

// Buscar lead
const lead = await getLeadById('uuid-do-lead');

// Processar (faz upload das imagens para Storage)
const processed = await processBriefing(lead);

// Agora as imagens estão em URLs permanentes:
console.log('Logo:', processed.branding.logo_url);
// → "https://storage.supabase.co/v1/object/public/logos/uuid/logo.png"

console.log('Fotos:', processed.conteudo.fotos_consultorio);
// → [
//     { url: "https://storage.supabase.co/.../foto1.jpg", nome: "fachada.jpg" },
//     { url: "https://storage.supabase.co/.../foto2.jpg", nome: "recepcao.jpg" }
//   ]
```

---

## 🔍 Queries SQL Úteis

### **Ver dados básicos de todos os leads:**

```sql
SELECT
  id,
  nome,
  email,
  whatsapp,
  briefing_data->>'nome_consultorio' as consultorio,
  briefing_data->>'cidade' as cidade,
  created_at
FROM leads
ORDER BY created_at DESC;
```

### **Ver especialidades:**

```sql
SELECT
  nome,
  briefing_data->'especialidades' as especialidades
FROM leads;
```

### **Ver quem enviou logo:**

```sql
SELECT
  nome,
  CASE
    WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN 'SIM ✓'
    ELSE 'NÃO ✗'
  END as tem_logo
FROM leads;
```

### **Contar arquivos enviados:**

```sql
SELECT
  nome,
  CASE WHEN briefing_data->'logotipo_upload' IS NOT NULL THEN 1 ELSE 0 END as logo,
  COALESCE(jsonb_array_length(briefing_data->'fotos_upload'), 0) as fotos,
  COALESCE(jsonb_array_length(briefing_data->'depoimentos_upload'), 0) as depoimentos
FROM leads;
```

### **Ver endereço completo:**

```sql
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
```

---

## 📋 Checklist: Onde Está Cada Informação

### ✅ Dados Pessoais
- **Nome:** `leads.nome`
- **Email:** `leads.email`
- **WhatsApp:** `leads.whatsapp`

### ✅ Seção 1: Homepage
- **Nome do consultório:** `briefing_data.nome_consultorio`
- **Slogan:** `briefing_data.slogan_texto`
- **Especialidades:** `briefing_data.especialidades` (array)

### ✅ Seção 2: Equipe
- **Quantidade:** `briefing_data.numero_dentistas`
- **Profissionais:** `briefing_data.profissionais` (array de objetos)
- **Fotos dos profissionais:** `briefing_data.profissionais[i].foto`

### ✅ Seção 3: Serviços
- **Serviços:** `briefing_data.servicos_procurados`
- **Convênios:** `briefing_data.convenios_lista`
- **Emergência 24h:** `briefing_data.emergencia_24h`

### ✅ Seção 4: Tecnologia
- **Equipamentos:** `briefing_data.equipamentos` (array)
- **Sedação:** `briefing_data.sedacao_consciente`

### ✅ Seção 5: Localização
- **CEP:** `briefing_data.cep`
- **Endereço completo:** `briefing_data.rua, numero, bairro, cidade, uf`
- **Redes sociais:** `briefing_data.link_facebook, link_instagram, etc`
- **Google Maps:** `briefing_data.link_google_maps`

### ✅ Seção 6: Depoimentos
- **Tem depoimentos:** `briefing_data.tem_depoimentos`
- **Imagens:** `briefing_data.depoimentos_upload` (array)
- **Google Reviews:** `briefing_data.link_google_avaliacoes`

### ✅ Seção 7: Identidade Visual
- **Logo:** `briefing_data.logotipo_upload`
- **Fotos do consultório:** `briefing_data.fotos_upload` (array)
- **Estilo:** `briefing_data.estilo_fonte`
- **Tom:** `briefing_data.tom_linguagem`
- **Textos customizados:** `briefing_data.textos_existentes`

---

## 🚀 Como Acessar AGORA

### **1. Via Supabase Dashboard (Recomendado)**

```
1. Acesse: https://supabase.com/dashboard
2. Login com sua conta
3. Selecione o projeto: "Sites Odonto"
4. Menu lateral → Table Editor
5. Clique em "leads"
6. Você verá os 2 leads cadastrados
7. Clique no ícone 🔍 em "briefing_data" para expandir
```

### **2. Via SQL (Script Pronto)**

```bash
# No SQL Editor do Supabase, execute:
supabase/VER-DADOS-LEADS.sql
```

### **3. Via Código (Console do Browser)**

```javascript
// Abra o console (F12) na sua aplicação
import { supabase } from './src/lib/supabase';

const { data } = await supabase.from('leads').select('*');
console.table(data);
```

---

## 📦 Resumo

| Item | Localização | Formato |
|------|-------------|---------|
| **Dados do cliente** | `leads.nome`, `leads.email`, `leads.whatsapp` | Texto |
| **Todas as 8 seções** | `leads.briefing_data` | JSON |
| **Imagens (logo, fotos, depoimentos)** | `leads.briefing_data.*_upload` | Base64 (dentro do JSON) |
| **Status do lead** | `leads.status` | Enum |
| **Data de cadastro** | `leads.created_at` | Timestamp |

**Total de dados:** ~2-8 MB por lead (dependendo das imagens)

---

## ❓ FAQ

**P: Os dados estão seguros?**
R: Sim! Estão no Supabase (PostgreSQL) com Row Level Security ativado.

**P: Posso baixar as imagens?**
R: Sim! Use o `dataProcessor.ts` para converter base64 em URLs do Storage.

**P: Como ver os dados formatados?**
R: Execute o script `VER-DADOS-LEADS.sql` no SQL Editor.

**P: Quantos leads tenho?**
R: Execute: `SELECT COUNT(*) FROM leads;`

**P: Como exportar todos os dados?**
R: Execute: `SELECT * FROM leads;` e copie o resultado.

---

**Tudo está salvo e seguro no Supabase! 🎉**

Execute o script `VER-DADOS-LEADS.sql` para ver tudo agora mesmo.
