# 🔧 Exemplo de Uso do Data Processor

## Como processar dados de um lead

### **1. Importar o processador**

```typescript
import { processBriefing, validateProcessedBriefing } from '@/lib/dataProcessor';
import { getLeadById } from '@/lib/supabase';
```

### **2. Buscar e processar lead**

```typescript
async function processLead(leadId: string) {
  try {
    // Buscar lead no Supabase
    const lead = await getLeadById(leadId);

    console.log(`Processando lead: ${lead.nome} (${lead.email})`);

    // Processar briefing
    const processed = await processBriefing(lead);

    // Validar dados processados
    const validation = validateProcessedBriefing(processed);

    if (!validation.valid) {
      console.error('❌ Dados incompletos:', validation.errors);
      return;
    }

    // Dados prontos para uso!
    console.log('✅ Dados processados:', processed);

    return processed;

  } catch (error) {
    console.error('Erro ao processar lead:', error);
    throw error;
  }
}
```

### **3. Usar dados processados**

```typescript
const processed = await processLead('lead-uuid-here');

// Acessar dados estruturados
console.log('Nome da clínica:', processed.clinica.nome);
console.log('Especialidades:', processed.clinica.especialidades);
console.log('WhatsApp link:', processed.cliente.whatsapp_link);
console.log('Logo URL:', processed.branding.logo_url);
console.log('Fotos:', processed.conteudo.fotos_consultorio);

// Usar para gerar site
const siteData = {
  hero: {
    title: processed.clinica.nome,
    subtitle: processed.clinica.especialidades_texto,
    slogan: processed.clinica.slogan,
    cta: {
      text: 'Agende sua consulta',
      link: processed.cliente.whatsapp_link,
    },
  },

  about: {
    description: processed.conteudo.textos_customizados,
    team: processed.equipe?.profissionais,
  },

  services: {
    items: processed.conteudo.servicos.map(servico => ({
      name: servico,
      description: `Tratamento de ${servico}`,
    })),
  },

  gallery: {
    photos: processed.conteudo.fotos_consultorio.map(foto => ({
      url: foto.url,
      alt: foto.nome,
    })),
  },

  testimonials: {
    items: processed.conteudo.depoimentos.map(dep => ({
      image: dep.url,
      name: dep.nome,
    })),
  },

  contact: {
    address: processed.contato.endereco.endereco_formatado,
    phone: processed.cliente.whatsapp,
    email: processed.cliente.email,
    social: processed.contato.redes_sociais,
    mapUrl: processed.contato.google_maps,
  },

  branding: {
    logo: processed.branding.logo_url,
    colors: processed.branding.cores,
    style: processed.branding.estilo,
  },

  seo: {
    title: processed.seo.title,
    description: processed.seo.description,
    keywords: processed.seo.keywords,
  },
};

// Agora você pode usar siteData para gerar o site!
```

### **4. Exemplo completo de API**

```typescript
// src/api/process-lead.ts

import { Handler } from '@netlify/functions';
import { processBriefing } from '@/lib/dataProcessor';
import { getLeadById } from '@/lib/supabase';

export const handler: Handler = async (event) => {
  // Verificar método
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Obter leadId do body
    const { leadId } = JSON.parse(event.body || '{}');

    if (!leadId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'leadId é obrigatório' }),
      };
    }

    // Buscar lead
    const lead = await getLeadById(leadId);

    // Processar
    const processed = await processBriefing(lead);

    // Retornar dados processados
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: processed,
      }),
    };

  } catch (error) {
    console.error('Erro ao processar lead:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro ao processar lead',
        message: error.message,
      }),
    };
  }
};
```

### **5. Chamar via frontend**

```typescript
// src/pages/Admin/LeadDetails.tsx

async function handleProcessLead(leadId: string) {
  setLoading(true);

  try {
    const response = await fetch('/.netlify/functions/process-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Dados processados:', result.data);

      // Mostrar preview dos dados
      setProcessedData(result.data);

      // Ou iniciar geração do site
      await generateSite(result.data);
    }

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao processar lead');
  } finally {
    setLoading(false);
  }
}
```

---

## 🎯 Estrutura de Dados Retornada

O processador retorna a seguinte estrutura:

```typescript
{
  cliente: {
    nome: "Dr. João Silva",
    email: "joao@clinica.com",
    whatsapp: "(11) 99999-9999",
    whatsapp_clean: "11999999999",
    whatsapp_link: "https://wa.me/5511999999999"
  },

  clinica: {
    nome: "Clínica Odontológica Exemplo",
    slogan: "Seu sorriso é nossa missão",
    especialidades: ["Implantodontia", "Estética Dental"],
    especialidades_texto: "Implantodontia, Estética Dental",
    cidade: "São Paulo",
    estado: "SP",
    endereco_completo: "Rua Exemplo, 123 - Centro, São Paulo/SP"
  },

  branding: {
    logo_url: "https://storage.supabase.co/.../logo.png",
    tem_manual_marca: false,
    estilo: "moderno",
    tom: "acessivel",
    cores: {
      primary: "#0066CC",
      secondary: "#00AAFF"
    }
  },

  conteudo: {
    servicos: ["Implantes", "Clareamento", "Limpeza"],
    equipamentos: ["Raio-X Digital", "Scanner Intraoral"],
    diferenciais: ["Tecnologia de ponta", "Atendimento 24h"],
    textos_customizados: "Texto sobre a clínica...",
    depoimentos: [
      {
        url: "https://storage.supabase.co/.../depo1.jpg",
        nome: "depoimento1.jpg"
      }
    ],
    fotos_consultorio: [
      {
        url: "https://storage.supabase.co/.../foto1.jpg",
        nome: "consultorio1.jpg"
      }
    ]
  },

  equipe: {
    quantidade: 2,
    profissionais: [
      {
        nome: "Dr. João Silva",
        especialidade: "Implantodontia",
        experiencia: "15 anos",
        descricao: "Especialista em...",
        foto_url: "https://storage.supabase.co/.../perfil1.jpg"
      }
    ]
  },

  contato: {
    endereco: {
      cep: "01310-100",
      rua: "Avenida Paulista",
      numero: "1234",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      uf: "SP",
      complemento: "Sala 5",
      endereco_formatado: "Avenida Paulista, 1234 - Bela Vista, São Paulo/SP"
    },
    redes_sociais: {
      facebook: "https://facebook.com/clinica",
      instagram: "https://instagram.com/clinica"
    },
    tem_redes_sociais: true,
    google_maps: "https://maps.google.com/...",
    google_avaliacoes: "https://g.page/...",
    incorporar_mapa: true
  },

  meta: {
    aceita_convenios: true,
    convenios: ["Unimed", "SulAmérica"],
    emergencia_24h: false,
    tem_estacionamento: true,
    sedacao_consciente: true,
    tem_depoimentos: true,
    tem_avaliacoes_google: true
  },

  seo: {
    title: "Clínica Odontológica Exemplo - Implantodontia, Estética Dental em São Paulo",
    description: "Clínica Odontológica Exemplo: Implantodontia, Estética Dental em São Paulo/SP. Aceitamos convênios. Agende sua consulta!",
    keywords: [
      "Implantodontia",
      "Estética Dental",
      "São Paulo",
      "SP",
      "dentista",
      "odontologia",
      "consultório odontológico"
    ],
    slug: "clinica-odontologica-exemplo"
  }
}
```

---

## 📝 Checklist de Integração

### Para usar o processador:

- [x] Criar arquivo `src/lib/dataProcessor.ts`
- [ ] Testar processamento com lead real
- [ ] Criar função serverless para processar
- [ ] Integrar com dashboard admin
- [ ] Usar dados para gerar site

### Próximos passos:

1. **Testar com os 2 leads já cadastrados**
   ```bash
   # No console do browser ou Node.js
   import { processBriefing } from './src/lib/dataProcessor';
   import { getLeadById } from './src/lib/supabase';

   const lead = await getLeadById('uuid-do-lead');
   const processed = await processBriefing(lead);
   console.log(processed);
   ```

2. **Criar endpoint de processamento**
   - `POST /api/process-lead`
   - Retorna dados processados

3. **Integrar com gerador de sites**
   - Usar dados processados como input
   - Gerar páginas HTML/React
   - Deploy em preview

4. **Dashboard admin**
   - Botão "Processar dados"
   - Visualizar dados processados
   - Iniciar geração de site

---

## 🚀 Benefícios

✅ **Dados organizados e estruturados**
✅ **Imagens salvas no Storage (URLs permanentes)**
✅ **Validações e limpeza automática**
✅ **Pronto para gerar sites**
✅ **SEO otimizado**
✅ **Fácil de integrar**

---

**Próximo passo:** Testar o processador com os leads reais e criar o dashboard admin!
