# 📋 Análise de Coleta e Tratamento de Dados
## Sistema Sites Odonto

**Data:** 2025-12-07
**Status:** Análise Completa

---

## 🎯 VISÃO GERAL

O sistema coleta dados através de um **formulário multi-step** com 8 seções, processa através de validações client-side, comprime imagens, e armazena no **Supabase** (PostgreSQL).

**Fluxo Atual:**
```
Usuário → Formulário (8 seções) → Validação → Compressão → Supabase → Página Pagamento
```

---

## 📝 SEÇÕES DO FORMULÁRIO E DADOS COLETADOS

### **Seção 0: Informações Pessoais** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório | Tratamento |
|-------|------|-----------|-------------|------------|
| `nome` | text | Min 3 caracteres | ✅ Sim | Trim, capitalização |
| `whatsapp` | tel | Formato (11) 99999-9999 | ✅ Sim | Formatação automática, validação DDD |
| `email` | email | RFC compliant | ✅ Sim | Lowercase, validação regex |

**Validações Aplicadas:**
```typescript
// WhatsApp
- DDD válido (Brasil)
- Deve começar com 9 (celular)
- Formato: (XX) 9XXXX-XXXX

// Email
- Regex RFC compliant
- Máx 254 caracteres
- Sem ".." consecutivos
- Não começa/termina com "."
```

---

### **Seção 1: Homepage/Cabeçalho** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `nome_consultorio` | text | Min 3 chars | ✅ Sim |
| `tem_slogan` | radio | sim/não | ✅ Sim |
| `slogan_texto` | text | - | ⚠️ Condicional |
| `especialidades` | checkbox[] | Min 1 | ✅ Sim |
| `outras_especialidades` | text | - | ❌ Não |

**Opções de Especialidades:**
- 🦷 Clínica Geral
- 💎 Estética Dental
- 🔧 Implantodontia
- 📐 Ortodontia
- 🦴 Periodontia
- 🪥 Endodontia
- 👶 Odontopediatria
- 👴 Prótese Dentária
- 🏥 Cirurgia Oral
- 🎯 Outras (campo aberto)

---

### **Seção 2: Sobre Nós/Equipe** ⚠️ OPCIONAL

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `numero_dentistas` | number | - | ❌ Não |
| `profissionais[i].nome` | text | - | ❌ Não |
| `profissionais[i].especialidade` | text | - | ❌ Não |
| `profissionais[i].experiencia` | text | - | ❌ Não |
| `profissionais[i].descricao` | textarea | - | ❌ Não |
| `profissionais[i].foto` | file | Image, max 5MB | ❌ Não |

**Compressão de Fotos:**
```javascript
{
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  maxSizeMB: 1
}
```

---

### **Seção 3: Serviços/Tratamentos** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `servicos_procurados` | textarea | - | ✅ Sim |
| `convenios` | radio | sim/não | ✅ Sim |
| `convenios_lista` | text | - | ⚠️ Condicional |
| `emergencia_24h` | radio | sim/não | ✅ Sim |

---

### **Seção 4: Tecnologia/Diferenciais** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `equipamentos` | checkbox[] | Min 1 | ✅ Sim |
| `sedacao_consciente` | radio | sim/não | ✅ Sim |

**Opções de Equipamentos:**
- 📷 Raio-X Digital
- 🔬 Scanner Intraoral
- 🖨️ Impressora 3D
- 💻 Câmera Intraoral
- ⚡ Laser Odontológico
- 🦷 Sistema CAD/CAM
- 🎯 Outros (campo aberto)

---

### **Seção 5: Localização/Contato** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `cep` | text | API ViaCEP | ✅ Sim |
| `rua` | text | Auto-preenchido | ✅ Sim |
| `bairro` | text | Auto-preenchido | ❌ Não |
| `cidade` | text | Auto-preenchido | ✅ Sim |
| `uf` | text | Auto-preenchido | ❌ Não |
| `numero` | text | - | ❌ Não |
| `complemento` | text | - | ❌ Não |
| `estacionamento` | radio | sim/não | ✅ Sim |
| `redes_sociais` | checkbox[] | Min 1 | ✅ Sim |
| `link_facebook` | url | Valida domínio | ⚠️ Condicional |
| `link_instagram` | url | Valida domínio | ⚠️ Condicional |
| `link_youtube` | url | Valida domínio | ⚠️ Condicional |
| `link_linkedin` | url | Valida domínio | ⚠️ Condicional |
| `link_tiktok` | url | Valida domínio | ⚠️ Condicional |
| `incorporarMapa` | radio | sim/não | ❌ Não |
| `link_google_maps` | url | - | ⚠️ Condicional |
| `link_google_avaliacoes` | url | - | ⚠️ Condicional |

**Validação de Redes Sociais:**
```typescript
// Valida se URL corresponde à plataforma selecionada
facebook: cleanUrl.includes('facebook.com/') || cleanUrl.includes('fb.com/')
instagram: cleanUrl.includes('instagram.com/')
youtube: cleanUrl.includes('youtube.com/') || cleanUrl.includes('youtu.be/')
linkedin: cleanUrl.includes('linkedin.com/')
tiktok: cleanUrl.includes('tiktok.com/')
```

**Integração CEP (ViaCEP):**
- Busca automática ao digitar CEP
- Auto-preenche: rua, bairro, cidade, UF
- Fallback para CEPs conhecidos se API falhar
- Permite preenchimento manual em caso de erro

---

### **Seção 6: Depoimentos/Cases** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `tem_depoimentos` | radio | sim/não | ✅ Sim |
| `depoimentos_upload` | file[] | Multiple images | ⚠️ Condicional |
| `avaliacoes_google` | radio | sim/não | ✅ Sim |
| `link_google_avaliacoes` | url | - | ⚠️ Condicional |

---

### **Seção 7: Identidade Visual/Design** ✅ OBRIGATÓRIA

| Campo | Tipo | Validação | Obrigatório |
|-------|------|-----------|-------------|
| `logotipo_existente` | radio | sim/não | ✅ Sim |
| `logotipo_upload` | file | Image, max 5MB | ⚠️ Condicional |
| `manual_marca` | radio | sim/não | ✅ Sim |
| `fotos_consultorio` | radio | sim/não | ✅ Sim |
| `fotos_upload` | file[] | Multiple images | ⚠️ Condicional |
| `estilo_fonte` | select | - | ✅ Sim |
| `tom_linguagem` | select | - | ✅ Sim |
| `textos_existentes` | textarea | - | ❌ Não |

**Opções de Estilo:**
```
Fonte: Moderno e clean | Clássico e elegante | Minimalista
Tom: Formal e técnico | Acessível e amigável | Descontraído
```

---

## 💾 ESTRUTURA DE ARMAZENAMENTO

### **Tabela: `leads`**

```sql
{
  id: UUID (auto),
  created_at: TIMESTAMP (auto),
  updated_at: TIMESTAMP (auto via trigger),

  -- Status
  status: 'novo' | 'pago_50' | 'em_producao' | 'em_aprovacao' | 'pago_100' | 'concluido',

  -- Dados principais
  nome: TEXT,
  email: TEXT,
  whatsapp: TEXT,

  -- Briefing completo (JSONB)
  briefing_data: JSONB,

  -- Valores
  valor_total: INTEGER (49700 centavos),
  valor_entrada: INTEGER (24850 centavos),
  valor_saldo: INTEGER (24850 centavos),

  -- Stripe
  stripe_payment_intent_entrada: TEXT,
  stripe_payment_intent_saldo: TEXT,
  stripe_customer_id: TEXT,

  -- URLs
  preview_url: TEXT,
  site_final_url: TEXT,

  -- Timestamps
  pago_entrada_at: TIMESTAMP,
  pago_saldo_at: TIMESTAMP,
  aprovado_at: TIMESTAMP,
  concluido_at: TIMESTAMP
}
```

### **Campo `briefing_data` (JSONB)**

Estrutura completa dos dados coletados:

```json
{
  "nome_consultorio": "Clínica Exemplo",
  "tem_slogan": "sim",
  "slogan_texto": "Seu sorriso é nossa missão",
  "especialidades": ["Implantodontia", "Estética Dental"],
  "outras_especialidades": "",

  "numero_dentistas": "3",
  "profissionais": [
    {
      "nome": "Dr. João Silva",
      "especialidade": "Implantodontia",
      "experiencia": "15 anos",
      "descricao": "Especialista em...",
      "foto": "data:image/jpeg;base64,..."
    }
  ],

  "servicos_procurados": "Implantes, clareamento...",
  "convenios": "sim",
  "convenios_lista": "Unimed, SulAmérica",
  "emergencia_24h": "não",

  "equipamentos": ["Raio-X Digital", "Scanner Intraoral"],
  "sedacao_consciente": "sim",

  "cep": "19060-900",
  "rua": "Rua José Bongiovani",
  "bairro": "Cidade Universitária",
  "cidade": "Presidente Prudente",
  "uf": "SP",
  "numero": "1234",
  "complemento": "Sala 5",
  "estacionamento": "sim",

  "redes_sociais": ["📘 Facebook", "📸 Instagram"],
  "link_facebook": "https://facebook.com/clinica",
  "link_instagram": "https://instagram.com/clinica",
  "link_youtube": "",
  "link_linkedin": "",
  "link_tiktok": "",
  "incorporarMapa": "sim",
  "link_google_maps": "https://maps.google.com/...",
  "link_google_avaliacoes": "https://g.page/...",

  "tem_depoimentos": "sim",
  "depoimentos_upload": [
    {
      "name": "depoimento1.jpg",
      "type": "image/jpeg",
      "size": 125000,
      "data": "data:image/jpeg;base64,..."
    }
  ],
  "avaliacoes_google": "sim",

  "logotipo_existente": "sim",
  "logotipo_upload": {
    "name": "logo.png",
    "type": "image/png",
    "size": 85000,
    "data": "data:image/png;base64,..."
  },
  "manual_marca": "não",
  "fotos_consultorio": "sim",
  "fotos_upload": [
    {
      "name": "consultorio1.jpg",
      "type": "image/jpeg",
      "size": 180000,
      "data": "data:image/jpeg;base64,..."
    }
  ],
  "estilo_fonte": "Moderno e clean",
  "tom_linguagem": "Acessível e amigável",
  "textos_existentes": "Texto sobre a clínica..."
}
```

---

## ⚙️ PROCESSAMENTO ATUAL

### **1. Validação Client-Side**

```typescript
// Validação em tempo real
- Ao digitar: formata campos (WhatsApp, CEP)
- Ao perder foco: valida campo individual
- Ao clicar "Próximo": valida toda seção

// Validações implementadas:
✅ Nome: min 3 caracteres
✅ WhatsApp: formato + DDD válido + celular
✅ Email: RFC compliant
✅ CEP: integração ViaCEP
✅ URLs: formato + domínio da plataforma
✅ Checkboxes: mínimo de opções
✅ Radio buttons: obrigatoriedade de seleção
✅ Condicionais: campos dependentes
```

### **2. Compressão de Imagens**

```javascript
// Configuração atual
compressImage(file, {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  maxSizeMB: 1
})

// Resultados típicos:
Original: 2.5MB → Comprimido: 400KB (~84% redução)
Formato: mantém original (JPEG, PNG)
Output: data:image/...;base64,... (string)
```

**Limites:**
- Tamanho máximo por arquivo: 5MB (antes da compressão)
- Tamanho alvo após compressão: <1MB
- Limite total payload: ~8MB (para evitar timeout)

### **3. Salvamento no Supabase**

```typescript
// Função: createLead()
const lead = await createLead({
  nome: formData.nome,
  email: formData.email,
  whatsapp: formData.whatsapp,
  briefing_data: finalData, // Todo o JSON
});

// Retorna:
{
  id: "uuid-gerado",
  status: "novo",
  created_at: "2025-12-07T...",
  // ... outros campos
}
```

---

## 🔄 COMO PROCESSAR OS DADOS COLETADOS

### **Objetivo:** Transformar dados do briefing em site funcional

### **Pipeline Proposto:**

```
1. COLETA (✅ Atual)
   └─> Formulário → Validação → Supabase

2. PROCESSAMENTO (🔴 TODO)
   ├─> Extrair dados do briefing_data
   ├─> Sanitizar e normalizar
   ├─> Validar integridade
   └─> Enriquecer com dados externos

3. GERAÇÃO (🔴 TODO)
   ├─> Escolher template baseado em estilo
   ├─> Preencher componentes com dados
   ├─> Processar imagens (upload real ao storage)
   ├─> Gerar páginas estáticas
   └─> Deploy preview

4. APROVAÇÃO (🔴 TODO)
   ├─> Enviar preview_url ao cliente
   ├─> Cliente visualiza e aprova/ajusta
   └─> Atualizar status

5. PUBLICAÇÃO (🔴 TODO)
   ├─> Deploy final
   ├─> Configurar domínio
   └─> Entregar site_final_url
```

---

## 📊 ANÁLISE DOS DADOS COLETADOS (2 Leads Reais)

Execute para ver os dados reais:
```sql
-- Análise completa
\i supabase/analise-leads-existentes.sql
```

**Queries úteis:**

```sql
-- Ver todos os campos do briefing
SELECT
  nome,
  email,
  jsonb_pretty(briefing_data)
FROM leads
ORDER BY created_at DESC;

-- Extrair especialidades
SELECT
  nome,
  briefing_data->'especialidades' as especialidades
FROM leads;

-- Buscar por cidade
SELECT * FROM leads
WHERE briefing_data->>'cidade' = 'Presidente Prudente';

-- Verificar quem tem logo
SELECT nome, briefing_data->>'logotipo_existente'
FROM leads;
```

---

## 🎯 MELHORIAS PROPOSTAS NA COLETA

### **1. Validação Backend (Adicional)**

```typescript
// Criar API endpoint: POST /api/validate-briefing
// Validar novamente no servidor antes de salvar
// Prevenir manipulação client-side
```

### **2. Salvamento Progressivo**

```typescript
// Salvar rascunho a cada seção
// Permitir retomar preenchimento depois
// localStorage + Supabase sync
```

### **3. Upload Real de Imagens**

```typescript
// Ao invés de base64 no JSON:
// 1. Upload imediato ao Storage
// 2. Salvar apenas URL no briefing_data
// 3. Reduzir tamanho do payload

// Antes (atual):
briefing_data.logotipo_upload = "data:image/png;base64,..."  // ~500KB

// Depois (proposto):
briefing_data.logotipo_url = "https://storage.supabase.co/.../logo.png"
```

### **4. Validação de Duplicatas**

```typescript
// Verificar se email/whatsapp já existe
// Alertar usuário antes de criar lead duplicado
// Oferecer continuar cadastro anterior
```

### **5. Enriquecimento de Dados**

```typescript
// Buscar dados adicionais:
- Lat/Long da cidade (geocoding)
- Fuso horário
- População da cidade
- Verificar se email é descartável
- Validar WhatsApp com API (opcional)
```

---

## 🛠️ SISTEMA DE PROCESSAMENTO (Proposta)

### **Arquivo:** `src/lib/dataProcessor.ts`

```typescript
// ===================================
// PROCESSADOR DE DADOS DO BRIEFING
// ===================================

interface ProcessedBriefing {
  // Dados limpos e estruturados
  cliente: {
    nome: string;
    email: string;
    whatsapp: string;
    whatsapp_clean: string; // apenas números
  };

  clinica: {
    nome: string;
    slogan?: string;
    especialidades: string[];
    cidade: string;
    estado: string;
    endereco_completo: string;
  };

  branding: {
    logo_url?: string;
    cores: string[];
    estilo: 'moderno' | 'classico' | 'minimalista';
    tom: 'formal' | 'acessivel' | 'descontraido';
  };

  conteudo: {
    servicos: string[];
    equipamentos: string[];
    depoimentos: Array<{url: string, texto?: string}>;
    fotos_consultorio: string[];
  };

  contato: {
    endereco: {
      cep: string;
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      uf: string;
      complemento?: string;
    };
    redes_sociais: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
      tiktok?: string;
    };
    google_maps?: string;
    google_avaliacoes?: string;
  };

  meta: {
    aceita_convenios: boolean;
    convenios?: string[];
    emergencia_24h: boolean;
    tem_estacionamento: boolean;
    sedacao_consciente: boolean;
  };
}

export async function processBriefing(lead: Lead): Promise<ProcessedBriefing> {
  const b = lead.briefing_data;

  // 1. Sanitizar textos
  const cleanText = (text: string) =>
    text?.trim().replace(/\s+/g, ' ') || '';

  // 2. Processar imagens (upload real)
  const logoUrl = b.logotipo_upload
    ? await uploadBase64ToStorage('logos', lead.id, b.logotipo_upload)
    : null;

  const fotosUrls = b.fotos_upload
    ? await Promise.all(
        b.fotos_upload.map(f => uploadBase64ToStorage('fotos', lead.id, f))
      )
    : [];

  // 3. Normalizar WhatsApp
  const whatsappClean = lead.whatsapp.replace(/\D/g, '');

  // 4. Parsear convênios
  const convenios = b.convenios === 'sim' && b.convenios_lista
    ? b.convenios_lista.split(',').map((c: string) => c.trim())
    : [];

  // 5. Estruturar redes sociais
  const redes: any = {};
  if (b.link_facebook) redes.facebook = b.link_facebook;
  if (b.link_instagram) redes.instagram = b.link_instagram;
  if (b.link_youtube) redes.youtube = b.link_youtube;
  if (b.link_linkedin) redes.linkedin = b.link_linkedin;
  if (b.link_tiktok) redes.tiktok = b.link_tiktok;

  // 6. Retornar dados processados
  return {
    cliente: {
      nome: cleanText(lead.nome),
      email: lead.email.toLowerCase(),
      whatsapp: lead.whatsapp,
      whatsapp_clean: whatsappClean,
    },

    clinica: {
      nome: cleanText(b.nome_consultorio),
      slogan: b.tem_slogan === 'sim' ? cleanText(b.slogan_texto) : undefined,
      especialidades: b.especialidades || [],
      cidade: cleanText(b.cidade),
      estado: b.uf,
      endereco_completo: `${b.rua}, ${b.numero} - ${b.bairro}, ${b.cidade}/${b.uf}`,
    },

    branding: {
      logo_url: logoUrl,
      cores: extractColors(b.manual_marca), // Extrair ou usar padrão
      estilo: mapEstilo(b.estilo_fonte),
      tom: mapTom(b.tom_linguagem),
    },

    conteudo: {
      servicos: parseServicos(b.servicos_procurados),
      equipamentos: b.equipamentos || [],
      depoimentos: [], // Processar depoimentos_upload
      fotos_consultorio: fotosUrls,
    },

    contato: {
      endereco: {
        cep: b.cep,
        rua: cleanText(b.rua),
        numero: b.numero,
        bairro: cleanText(b.bairro),
        cidade: cleanText(b.cidade),
        uf: b.uf,
        complemento: b.complemento,
      },
      redes_sociais: redes,
      google_maps: b.link_google_maps,
      google_avaliacoes: b.link_google_avaliacoes,
    },

    meta: {
      aceita_convenios: b.convenios === 'sim',
      convenios: convenios.length ? convenios : undefined,
      emergencia_24h: b.emergencia_24h === 'sim',
      tem_estacionamento: b.estacionamento === 'sim',
      sedacao_consciente: b.sedacao_consciente === 'sim',
    },
  };
}

// Helper: Upload base64 para Storage
async function uploadBase64ToStorage(
  bucket: string,
  leadId: string,
  fileData: {name: string, data: string, type: string}
) {
  // Converter base64 para Blob
  const blob = base64ToBlob(fileData.data, fileData.type);

  // Upload
  const fileName = `${leadId}/${Date.now()}_${fileData.name}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, blob);

  if (error) throw error;

  // Retornar URL pública
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
}
```

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Melhorar Coleta** (1-2 dias)

- [ ] Adicionar validação backend (POST /api/validate)
- [ ] Implementar upload real de imagens (Storage)
- [ ] Verificação de duplicatas (email/whatsapp)
- [ ] Salvamento progressivo (localStorage)

### **Fase 2: Processar Dados** (2-3 dias)

- [ ] Criar `dataProcessor.ts`
- [ ] Função `processBriefing(lead)`
- [ ] Migrar imagens base64 → Storage URLs
- [ ] Testes unitários do processador

### **Fase 3: Geração de Sites** (1-2 semanas)

- [ ] Template base (React/Next.js)
- [ ] Componentes parametrizados
- [ ] Gerador de páginas
- [ ] Sistema de build/deploy

### **Fase 4: Dashboard** (3-5 dias)

- [ ] Visualizar leads processados
- [ ] Preview dos dados estruturados
- [ ] Edição manual se necessário
- [ ] Gatilho manual para geração

---

## 🎓 RESUMO EXECUTIVO

### **✅ O que funciona bem:**
- Formulário completo e validado
- Compressão de imagens eficiente
- Salvamento no Supabase
- Dados estruturados em JSONB

### **⚠️ O que precisa melhorar:**
- Upload real de imagens (em vez de base64)
- Processador de dados estruturado
- Gerador automático de sites
- Sistema de preview/aprovação

### **🚀 Próximo passo recomendado:**
Criar o `dataProcessor.ts` para transformar os dados brutos do briefing em dados estruturados prontos para gerar sites.

---

**Quer que eu implemente alguma dessas melhorias agora?**
