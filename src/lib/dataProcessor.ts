/**
 * ========================================
 * PROCESSADOR DE DADOS DO BRIEFING
 * ========================================
 *
 * Transforma dados brutos do formulário em dados estruturados
 * prontos para gerar sites odontológicos.
 *
 * @author Sites Odonto
 * @date 2025-12-07
 */

import { supabase, type Lead } from './supabase';

// ========================================
// TIPOS E INTERFACES
// ========================================

export interface ProcessedBriefing {
  // Dados do cliente
  cliente: {
    nome: string;
    email: string;
    whatsapp: string;
    whatsapp_clean: string; // apenas números: 11999999999
    whatsapp_link: string;  // link para WhatsApp: https://wa.me/5511999999999
  };

  // Dados da clínica
  clinica: {
    nome: string;
    slogan?: string;
    especialidades: string[];
    especialidades_texto: string; // "Implantodontia, Estética Dental"
    cidade: string;
    estado: string;
    endereco_completo: string;
  };

  // Branding e identidade visual
  branding: {
    logo_url?: string;
    tem_manual_marca: boolean;
    estilo: 'moderno' | 'classico' | 'minimalista';
    tom: 'formal' | 'acessivel' | 'descontraido';
    cores: {
      primary: string;
      secondary: string;
    };
  };

  // Conteúdo do site
  conteudo: {
    servicos: string[];
    equipamentos: string[];
    diferenciais: string[];
    textos_customizados?: string;
    depoimentos: Array<{
      url: string;
      nome: string;
    }>;
    fotos_consultorio: Array<{
      url: string;
      nome: string;
    }>;
  };

  // Equipe (opcional)
  equipe?: {
    quantidade: number;
    profissionais: Array<{
      nome: string;
      especialidade: string;
      experiencia: string;
      descricao: string;
      foto_url?: string;
    }>;
  };

  // Contato e localização
  contato: {
    endereco: {
      cep: string;
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      uf: string;
      complemento?: string;
      endereco_formatado: string;
    };
    redes_sociais: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
      tiktok?: string;
    };
    tem_redes_sociais: boolean;
    google_maps?: string;
    google_avaliacoes?: string;
    incorporar_mapa: boolean;
  };

  // Metadados e serviços
  meta: {
    aceita_convenios: boolean;
    convenios: string[];
    emergencia_24h: boolean;
    tem_estacionamento: boolean;
    sedacao_consciente: boolean;
    tem_depoimentos: boolean;
    tem_avaliacoes_google: boolean;
  };

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Limpa e normaliza texto
 */
function cleanText(text: string | undefined | null): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Remove todos os caracteres não numéricos
 */
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Gera link do WhatsApp
 */
function generateWhatsAppLink(phone: string): string {
  const clean = cleanPhone(phone);
  return `https://wa.me/55${clean}`;
}

/**
 * Converte base64 para Blob
 */
function base64ToBlob(base64: string, contentType: string): Blob {
  // Remove o prefixo data:image/...;base64,
  const base64Data = base64.split(',')[1] || base64;

  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/**
 * Upload de arquivo base64 para Supabase Storage
 */
async function uploadBase64ToStorage(
  bucket: 'logos' | 'fotos' | 'depoimentos',
  leadId: string,
  fileData: { name: string; data: string; type: string }
): Promise<string> {
  try {
    // Converter base64 para Blob
    const blob = base64ToBlob(fileData.data, fileData.type);

    // Gerar nome único
    const timestamp = Date.now();
    const safeName = fileData.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${leadId}/${timestamp}_${safeName}`;

    // Upload para Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error(`Erro ao fazer upload de ${fileData.name}:`, error);
      throw error;
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log(`✅ Upload realizado: ${bucket}/${fileName}`);
    return urlData.publicUrl;

  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
}

/**
 * Mapeia estilo de fonte para valor padronizado
 */
function mapEstilo(estilo: string): 'moderno' | 'classico' | 'minimalista' {
  const estiloLower = estilo?.toLowerCase() || '';

  if (estiloLower.includes('moderno') || estiloLower.includes('clean')) {
    return 'moderno';
  }
  if (estiloLower.includes('classic') || estiloLower.includes('elegante')) {
    return 'classico';
  }
  return 'minimalista';
}

/**
 * Mapeia tom de linguagem para valor padronizado
 */
function mapTom(tom: string): 'formal' | 'acessivel' | 'descontraido' {
  const tomLower = tom?.toLowerCase() || '';

  if (tomLower.includes('formal') || tomLower.includes('técnico')) {
    return 'formal';
  }
  if (tomLower.includes('descontraído')) {
    return 'descontraido';
  }
  return 'acessivel';
}

/**
 * Extrai cores do branding ou retorna padrão
 */
function extractColors(temManual: string): { primary: string; secondary: string } {
  // TODO: Implementar extração de cores do manual de marca se fornecido
  // Por enquanto, retorna cores padrão baseadas no estilo

  return {
    primary: '#0066CC',    // Azul odontológico
    secondary: '#00AAFF',  // Azul claro
  };
}

/**
 * Parseia lista de serviços de textarea
 */
function parseServicos(texto: string): string[] {
  if (!texto) return [];

  // Divide por vírgula, quebra de linha ou ponto e vírgula
  return texto
    .split(/[,;\n]/)
    .map(s => cleanText(s))
    .filter(s => s.length > 0);
}

/**
 * Gera slug a partir do nome
 */
function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

/**
 * Processa dados do briefing e retorna estrutura organizada
 *
 * @param lead - Lead do Supabase
 * @returns Dados processados e estruturados
 */
export async function processBriefing(lead: Lead): Promise<ProcessedBriefing> {
  console.log(`📊 Processando briefing do lead: ${lead.id}`);

  const b = lead.briefing_data;

  // ========================================
  // 1. PROCESSAR CLIENTE
  // ========================================

  const whatsappClean = cleanPhone(lead.whatsapp);
  const whatsappLink = generateWhatsAppLink(lead.whatsapp);

  const cliente = {
    nome: cleanText(lead.nome),
    email: lead.email.toLowerCase().trim(),
    whatsapp: lead.whatsapp,
    whatsapp_clean: whatsappClean,
    whatsapp_link: whatsappLink,
  };

  // ========================================
  // 2. PROCESSAR CLÍNICA
  // ========================================

  const especialidades = b.especialidades || [];
  const especialidadesTexto = especialidades.join(', ');

  const clinica = {
    nome: cleanText(b.nome_consultorio),
    slogan: b.tem_slogan === 'sim' ? cleanText(b.slogan_texto) : undefined,
    especialidades,
    especialidades_texto: especialidadesTexto,
    cidade: cleanText(b.cidade),
    estado: b.uf || '',
    endereco_completo: `${b.rua}, ${b.numero || 's/n'} - ${b.bairro}, ${b.cidade}/${b.uf}`,
  };

  // ========================================
  // 3. PROCESSAR BRANDING
  // ========================================

  let logoUrl: string | undefined;

  if (b.logotipo_existente === 'sim' && b.logotipo_upload) {
    try {
      logoUrl = await uploadBase64ToStorage('logos', lead.id, b.logotipo_upload);
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
    }
  }

  const branding = {
    logo_url: logoUrl,
    tem_manual_marca: b.manual_marca === 'sim',
    estilo: mapEstilo(b.estilo_fonte),
    tom: mapTom(b.tom_linguagem),
    cores: extractColors(b.manual_marca),
  };

  // ========================================
  // 4. PROCESSAR CONTEÚDO
  // ========================================

  const servicos = parseServicos(b.servicos_procurados);
  const equipamentos = b.equipamentos || [];

  // Upload de depoimentos
  const depoimentos: Array<{ url: string; nome: string }> = [];
  if (b.tem_depoimentos === 'sim' && b.depoimentos_upload && Array.isArray(b.depoimentos_upload)) {
    for (const depoimento of b.depoimentos_upload) {
      try {
        const url = await uploadBase64ToStorage('depoimentos', lead.id, depoimento);
        depoimentos.push({ url, nome: depoimento.name });
      } catch (error) {
        console.error('Erro ao fazer upload de depoimento:', error);
      }
    }
  }

  // Upload de fotos do consultório
  const fotosConsultorio: Array<{ url: string; nome: string }> = [];
  if (b.fotos_consultorio === 'sim' && b.fotos_upload && Array.isArray(b.fotos_upload)) {
    for (const foto of b.fotos_upload) {
      try {
        const url = await uploadBase64ToStorage('fotos', lead.id, foto);
        fotosConsultorio.push({ url, nome: foto.name });
      } catch (error) {
        console.error('Erro ao fazer upload de foto:', error);
      }
    }
  }

  // Diferenciais (pode ser extraído de outros campos)
  const diferenciais: string[] = [];
  if (equipamentos.length > 0) {
    diferenciais.push('Tecnologia de ponta');
  }
  if (b.sedacao_consciente === 'sim') {
    diferenciais.push('Sedação consciente');
  }
  if (b.emergencia_24h === 'sim') {
    diferenciais.push('Atendimento 24h');
  }
  if (b.estacionamento === 'sim') {
    diferenciais.push('Estacionamento próprio');
  }

  const conteudo = {
    servicos,
    equipamentos,
    diferenciais,
    textos_customizados: cleanText(b.textos_existentes),
    depoimentos,
    fotos_consultorio: fotosConsultorio,
  };

  // ========================================
  // 5. PROCESSAR EQUIPE (OPCIONAL)
  // ========================================

  let equipe: ProcessedBriefing['equipe'] | undefined;

  if (b.numero_dentistas && parseInt(b.numero_dentistas) > 0) {
    const profissionais = [];

    if (b.profissionais && Array.isArray(b.profissionais)) {
      for (const prof of b.profissionais) {
        if (prof.nome) {
          let fotoUrl: string | undefined;

          if (prof.foto) {
            try {
              fotoUrl = await uploadBase64ToStorage('fotos', lead.id, prof.foto);
            } catch (error) {
              console.error('Erro ao fazer upload de foto do profissional:', error);
            }
          }

          profissionais.push({
            nome: cleanText(prof.nome),
            especialidade: cleanText(prof.especialidade),
            experiencia: cleanText(prof.experiencia),
            descricao: cleanText(prof.descricao),
            foto_url: fotoUrl,
          });
        }
      }
    }

    if (profissionais.length > 0) {
      equipe = {
        quantidade: profissionais.length,
        profissionais,
      };
    }
  }

  // ========================================
  // 6. PROCESSAR CONTATO
  // ========================================

  const redesSociais: ProcessedBriefing['contato']['redes_sociais'] = {};

  if (b.link_facebook) redesSociais.facebook = b.link_facebook;
  if (b.link_instagram) redesSociais.instagram = b.link_instagram;
  if (b.link_youtube) redesSociais.youtube = b.link_youtube;
  if (b.link_linkedin) redesSociais.linkedin = b.link_linkedin;
  if (b.link_tiktok) redesSociais.tiktok = b.link_tiktok;

  const temRedesSociais = Object.keys(redesSociais).length > 0;

  const contato = {
    endereco: {
      cep: b.cep || '',
      rua: cleanText(b.rua),
      numero: b.numero || '',
      bairro: cleanText(b.bairro),
      cidade: cleanText(b.cidade),
      uf: b.uf || '',
      complemento: cleanText(b.complemento),
      endereco_formatado: clinica.endereco_completo,
    },
    redes_sociais: redesSociais,
    tem_redes_sociais: temRedesSociais,
    google_maps: b.link_google_maps,
    google_avaliacoes: b.link_google_avaliacoes,
    incorporar_mapa: b.incorporarMapa === 'sim',
  };

  // ========================================
  // 7. PROCESSAR METADADOS
  // ========================================

  const conveniosList = b.convenios === 'sim' && b.convenios_lista
    ? b.convenios_lista.split(',').map((c: string) => cleanText(c)).filter((c: string) => c)
    : [];

  const meta = {
    aceita_convenios: b.convenios === 'sim',
    convenios: conveniosList,
    emergencia_24h: b.emergencia_24h === 'sim',
    tem_estacionamento: b.estacionamento === 'sim',
    sedacao_consciente: b.sedacao_consciente === 'sim',
    tem_depoimentos: b.tem_depoimentos === 'sim',
    tem_avaliacoes_google: b.avaliacoes_google === 'sim',
  };

  // ========================================
  // 8. GERAR SEO
  // ========================================

  const seo = {
    title: `${clinica.nome} - ${especialidadesTexto} em ${clinica.cidade}`,
    description: `${clinica.nome}: ${especialidadesTexto} em ${clinica.cidade}/${clinica.estado}. ${
      meta.aceita_convenios ? 'Aceitamos convênios.' : ''
    } Agende sua consulta!`,
    keywords: [
      ...especialidades,
      clinica.cidade,
      clinica.estado,
      'dentista',
      'odontologia',
      'consultório odontológico',
    ],
    slug: generateSlug(clinica.nome),
  };

  // ========================================
  // 9. RETORNAR DADOS PROCESSADOS
  // ========================================

  const processed: ProcessedBriefing = {
    cliente,
    clinica,
    branding,
    conteudo,
    equipe,
    contato,
    meta,
    seo,
  };

  console.log('✅ Briefing processado com sucesso!');
  console.log('📸 Imagens enviadas ao Storage:');
  console.log(`  - Logo: ${logoUrl ? '✓' : '✗'}`);
  console.log(`  - Depoimentos: ${depoimentos.length}`);
  console.log(`  - Fotos: ${fotosConsultorio.length}`);

  return processed;
}

// ========================================
// FUNÇÃO DE VALIDAÇÃO
// ========================================

/**
 * Valida se todos os dados obrigatórios estão presentes
 */
export function validateProcessedBriefing(data: ProcessedBriefing): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar dados do cliente
  if (!data.cliente.nome) errors.push('Nome do cliente é obrigatório');
  if (!data.cliente.email) errors.push('Email do cliente é obrigatório');
  if (!data.cliente.whatsapp) errors.push('WhatsApp do cliente é obrigatório');

  // Validar dados da clínica
  if (!data.clinica.nome) errors.push('Nome da clínica é obrigatório');
  if (data.clinica.especialidades.length === 0) errors.push('Ao menos uma especialidade é obrigatória');
  if (!data.clinica.cidade) errors.push('Cidade é obrigatória');

  // Validar contato
  if (!data.contato.endereco.rua) errors.push('Endereço é obrigatório');

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ========================================
// EXPORT
// ========================================

export default {
  processBriefing,
  validateProcessedBriefing,
};
