import { z } from 'zod';

export const formSchema = z.object({
  // Seção 1: Informações Pessoais
  nomeCompleto: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  nomeClinica: z.string().min(2, 'Nome da clínica deve ter pelo menos 2 caracteres'),
  cro: z.string().min(5, 'CRO inválido'),
  tempoAtuacao: z.string().optional(),
  
  // Profissionais adicionais
  profissionais: z.array(z.object({
    nome: z.string().min(2, 'Nome do profissional é obrigatório'),
    cro: z.string().min(5, 'CRO é obrigatório'),
    descricao: z.string().min(10, 'Descrição é obrigatória'),
    experiencia: z.string().optional(),
    foto: z.array(z.instanceof(File)).optional(),
  })).optional(),
  
  // Convênios
  convenios: z.enum(['sim', 'nao']),
  conveniosEspecificar: z.string().optional(),
  
  // Logo
  logoOpcao: z.enum(['tenho', 'criar-pago', 'criar-bonus']),
  logoArquivo: z.array(z.instanceof(File)).optional(),
  
  // Fotos
  temFotos: z.enum(['sim', 'nao']).optional(),
  fotos: z.array(z.instanceof(File)).optional(),
  
  // Endereço
  enderecoOpcao: z.enum(['google', 'digitar']).optional(),
  googleMeuNegocio: z.string().optional(),
  cep: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  
  telefoneClinica: z.string().min(10, 'Telefone da clínica inválido'),
  
  // Seção 2: Especialidade e Serviços
  trajetoria: z.string().optional(),
  especialidades: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  especialidadeOutra: z.string().optional(),
  servicos: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
  servicoOutro: z.string().optional(),
  conteudoEspecifico: z.string().optional(),
  documentos: z.array(z.instanceof(File)).optional(),
  
  // Seção 3: Estilo e Redes Sociais
  estilo: z.enum(['classico', 'moderno', 'tecnologico', 'elegante', 'expertise']),
  redesSociais: z.record(z.boolean()).optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  avaliacoesGoogle: z.enum(['sim', 'nao']),
  googleMeuNegocioAvaliacoes: z.string().optional(),
  mostrarAvaliacoesGoogle: z.enum(['sim', 'nao']),
  
  // Termos e condições
  aceitaTermos: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
  aceitaPrivacidade: z.boolean().refine(val => val === true, 'Você deve aceitar a política de privacidade'),
  aceitaWhatsapp: z.boolean().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface ProcessedFormData extends FormData {
  logoArquivoBase64?: string[];
  fotosBase64?: string[];
  documentosBase64?: string[];
  profissionaisFotosBase64?: { [key: number]: string[] };
}