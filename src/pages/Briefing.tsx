import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormData {
  [key: string]: any;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: string;
}

const BriefingOdonto = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: UploadedFile[]}>({});
  const [loadingCep, setLoadingCep] = useState(false);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const buscarEnderecoPorCEP = async (cep: string) => {
    const cepNumbers = cep.replace(/\D/g, '');
    
    if (cepNumbers.length !== 8) return;
    
    setLoadingCep(true);
    
    try {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cep;
        return newErrors;
      });

      const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (!data.erro) {
          updateFormData('rua', data.logradouro || '');
          updateFormData('bairro', data.bairro || '');
          updateFormData('cidade', data.localidade || '');
          updateFormData('uf', data.uf || '');
          console.log('CEP encontrado via API:', data);
          return;
        } else {
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado na base dos Correios' }));
          return;
        }
      }

      throw new Error('API indisponível');
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      
      const cepsConhecidos: {[key: string]: any} = {
        '01310100': { logradouro: 'Avenida Paulista', bairro: 'Bela Vista', localidade: 'São Paulo', uf: 'SP' },
        '20040020': { logradouro: 'Rua da Assembleia', bairro: 'Centro', localidade: 'Rio de Janeiro', uf: 'RJ' },
        '30112000': { logradouro: 'Rua da Bahia', bairro: 'Centro', localidade: 'Belo Horizonte', uf: 'MG' }
      };

      const enderecoConhecido = cepsConhecidos[cepNumbers];
      if (enderecoConhecido) {
        updateFormData('rua', enderecoConhecido.logradouro);
        updateFormData('bairro', enderecoConhecido.bairro);
        updateFormData('cidade', enderecoConhecido.localidade);
        updateFormData('uf', enderecoConhecido.uf);
        console.log('Usando dados verificados para CEP:', cepNumbers);
      } else {
        setErrors(prev => ({ 
          ...prev, 
          cep: 'API de CEP temporariamente indisponível. Por favor, preencha o endereço manualmente.' 
        }));
      }
      
    } finally {
      setLoadingCep(false);
    }
  };

  const sections = [
    { id: 'pessoais', title: 'Informações Pessoais', required: true },
    { id: 'cabecalho', title: 'Homepage/Cabeçalho', required: true },
    { id: 'equipe', title: 'Sobre Nós/Equipe', required: false },
    { id: 'servicos', title: 'Serviços/Tratamentos', required: true },
    { id: 'tecnologia', title: 'Tecnologia/Diferenciais', required: true },
    { id: 'localizacao', title: 'Localização/Contato', required: true },
    { id: 'depoimentos', title: 'Depoimentos/Cases', required: true },
    { id: 'identidade', title: 'Identidade Visual/Design', required: true }
  ];

  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const validateWhatsApp = (whatsapp: string) => {
    const numbers = whatsapp.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    const ddd = numbers.substring(0, 2);
    if (!validDDDs.includes(ddd)) return false;
    if (numbers.charAt(2) !== '9') return false;
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return false;
    if (email.length > 254) return false;
    if (email.includes('..')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    return true;
  };

  const validateURL = (url: string) => {
    if (!url || url.trim() === '') return true; // Optional field
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const validateSocialMediaURL = (url: string, platform: string) => {
    if (!url || url.trim() === '') return true; // Optional field
    if (!validateURL(url)) return false;
    
    const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    switch (platform) {
      case 'facebook':
        return cleanUrl.includes('facebook.com/') || cleanUrl.includes('fb.com/');
      case 'instagram':
        return cleanUrl.includes('instagram.com/');
      case 'youtube':
        return cleanUrl.includes('youtube.com/') || cleanUrl.includes('youtu.be/');
      case 'linkedin':
        return cleanUrl.includes('linkedin.com/');
      case 'tiktok':
        return cleanUrl.includes('tiktok.com/');
      default:
        return true;
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      let isValid = false;
      
      switch(field) {
        case 'nome':
          isValid = value && value.length >= 3;
          break;
        case 'whatsapp':
          isValid = value && validateWhatsApp(value);
          break;
        case 'email':
          isValid = value && validateEmail(value);
          break;
        case 'nome_consultorio':
          isValid = value && value.length >= 3;
          break;
        case 'tem_slogan':
        case 'convenios':
        case 'emergencia_24h':
        case 'sedacao_consciente':
        case 'estacionamento':
        case 'google_meu_negocio':
        case 'mapa_google':
        case 'depoimentos_estrategia':
        case 'logotipo_existente':
        case 'manual_marca':
        case 'fotos_consultorio':
        case 'estilo_fonte':
        case 'tom_linguagem':
        case 'textos_existentes':
          isValid = value && value.trim().length > 0;
          break;
        case 'especialidades':
        case 'redes_sociais':
          isValid = value && Array.isArray(value) && value.length > 0;
          break;
        case 'link_facebook':
          isValid = validateSocialMediaURL(value, 'facebook');
          break;
        case 'link_instagram':
          isValid = validateSocialMediaURL(value, 'instagram');
          break;
        case 'link_youtube':
          isValid = validateSocialMediaURL(value, 'youtube');
          break;
        case 'link_linkedin':
          isValid = validateSocialMediaURL(value, 'linkedin');
          break;
        case 'link_tiktok':
          isValid = validateSocialMediaURL(value, 'tiktok');
          break;
        case 'link_google_maps':
        case 'link_google_avaliacoes':
          isValid = validateURL(value);
          break;
      }
      
      if (isValid) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleFileUpload = (fieldName: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const processedFiles: UploadedFile[] = [];

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        processedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target?.result as string
        });
        
        if (processedFiles.length === fileArray.length) {
          setUploadedFiles(prev => ({
            ...prev,
            [fieldName]: processedFiles
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const validateSection = () => {
    const newErrors: {[key: string]: string} = {};
    
    switch(currentSection) {
      case 0: // Informações Pessoais
        if (!formData.nome || formData.nome.length < 3) {
          newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
        }
        if (!formData.whatsapp) {
          newErrors.whatsapp = 'WhatsApp é obrigatório';
        } else if (!validateWhatsApp(formData.whatsapp)) {
          newErrors.whatsapp = 'WhatsApp deve ter formato válido (11) 99999-9999';
        }
        if (!formData.email) {
          newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Email deve ter formato válido';
        }
        break;
        
      case 1: // Homepage/Cabeçalho
        if (!formData.nome_consultorio || formData.nome_consultorio.length < 3) {
          newErrors.nome_consultorio = 'Nome do consultório é obrigatório';
        }
        if (!formData.tem_slogan) {
          newErrors.tem_slogan = 'Informe se tem slogan ou não';
        }
        if (!formData.especialidades || formData.especialidades.length === 0) {
          newErrors.especialidades = 'Selecione pelo menos uma especialidade';
        }
        break;
        
      case 3: // Serviços/Tratamentos
        if (!formData.servicos_procurados) {
          newErrors.servicos_procurados = 'Informe os serviços mais procurados';
        }
        if (!formData.convenios) {
          newErrors.convenios = 'Informe se aceita convênios';
        }
        if (!formData.emergencia_24h) {
          newErrors.emergencia_24h = 'Informe sobre atendimento 24h';
        }
        break;
        
      case 4: // Tecnologia/Diferenciais
        if (!formData.equipamentos || formData.equipamentos.length === 0) {
          newErrors.equipamentos = 'Selecione pelo menos um equipamento/tecnologia';
        }
        if (!formData.sedacao_consciente) {
          newErrors.sedacao_consciente = 'Informe sobre sedação consciente';
        }
        break;
        
      case 5: // Localização/Contato
        if (!formData.cep) {
          newErrors.cep = 'CEP é obrigatório';
        }
        if (!formData.rua) {
          newErrors.rua = 'Endereço é obrigatório';
        }
        if (!formData.cidade) {
          newErrors.cidade = 'Cidade é obrigatória';
        }
        if (!formData.estacionamento) {
          newErrors.estacionamento = 'Informe sobre estacionamento';
        }
        if (!formData.redes_sociais || formData.redes_sociais.length === 0) {
          newErrors.redes_sociais = 'Selecione pelo menos uma rede social ou "Não uso redes sociais"';
        }
        
        // Validate social media URLs if provided (but not for "Não uso redes sociais")
        const redesSemNaoUso = (formData.redes_sociais || []).filter((rede: string) => rede !== '❌ Não uso redes sociais');
        if (redesSemNaoUso.includes('📘 Facebook') && formData.link_facebook && !validateSocialMediaURL(formData.link_facebook, 'facebook')) {
          newErrors.link_facebook = 'URL do Facebook inválida';
        }
        if (redesSemNaoUso.includes('📸 Instagram') && formData.link_instagram && !validateSocialMediaURL(formData.link_instagram, 'instagram')) {
          newErrors.link_instagram = 'URL do Instagram inválida';
        }
        if (redesSemNaoUso.includes('🎬 YouTube') && formData.link_youtube && !validateSocialMediaURL(formData.link_youtube, 'youtube')) {
          newErrors.link_youtube = 'URL do YouTube inválida';
        }
        if (redesSemNaoUso.includes('💼 LinkedIn') && formData.link_linkedin && !validateSocialMediaURL(formData.link_linkedin, 'linkedin')) {
          newErrors.link_linkedin = 'URL do LinkedIn inválida';
        }
        if (redesSemNaoUso.includes('🎵 TikTok') && formData.link_tiktok && !validateSocialMediaURL(formData.link_tiktok, 'tiktok')) {
          newErrors.link_tiktok = 'URL do TikTok inválida';
        }
        
        // Validate Google Maps link only if they chose to show location
        if (formData.incorporarMapa === 'sim_mostrar' && formData.link_google_maps && !validateURL(formData.link_google_maps)) {
          newErrors.link_google_maps = 'URL do Google Maps inválida';
        }
        break;
        
      case 6: // Depoimentos/Cases
        if (!formData.depoimentos_estrategia) {
          newErrors.depoimentos_estrategia = 'Selecione uma estratégia para depoimentos';
        }
        if (formData.link_google_avaliacoes && !validateURL(formData.link_google_avaliacoes)) {
          newErrors.link_google_avaliacoes = 'URL das avaliações do Google inválida';
        }
        break;
        
      case 7: // Identidade Visual/Design
        if (!formData.logotipo_existente) {
          newErrors.logotipo_existente = 'Informe sobre logotipo existente';
        }
        if (!formData.manual_marca) {
          newErrors.manual_marca = 'Informe sobre manual da marca';
        }
        if (!formData.fotos_consultorio) {
          newErrors.fotos_consultorio = 'Informe sobre fotos do consultório';
        }
        if (!formData.estilo_fonte) {
          newErrors.estilo_fonte = 'Selecione um estilo de fonte';
        }
        if (!formData.tom_linguagem) {
          newErrors.tom_linguagem = 'Selecione um tom de linguagem';
        }
        if (!formData.textos_existentes) {
          newErrors.textos_existentes = 'Informe sobre textos existentes';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextSection = () => {
    if (validateSection() && currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const submitForm = async () => {
    if (!validateSection()) return;

    const finalData = {
      timestamp: new Date().toISOString(),
      form_id: `briefing_odonto_${Date.now()}`,
      dados_pessoais: {
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        email: formData.email
      },
      homepage_cabecalho: {
        nome_consultorio: formData.nome_consultorio,
        tem_slogan: formData.tem_slogan,
        slogan_texto: formData.slogan_texto,
        especialidades: formData.especialidades || [],
        outras_especialidades: formData.outras_especialidades
      },
      equipe: {
        numero_dentistas: formData.numero_dentistas,
        profissionais: Array.from({ length: parseInt(formData.numero_dentistas) || 1 }, (_, i) => ({
          nome: formData[`prof${i + 1}_nome`],
          especialidade: formData[`prof${i + 1}_especialidade`],
          experiencia: formData[`prof${i + 1}_experiencia`],
          descricao: formData[`prof${i + 1}_descricao`],
          foto: uploadedFiles[`prof${i + 1}_foto`]?.[0]
        }))
      },
      servicos: {
        servicos_procurados: formData.servicos_procurados,
        convenios: formData.convenios,
        convenios_lista: formData.convenios_lista,
        emergencia_24h: formData.emergencia_24h
      },
      tecnologia: {
        equipamentos: formData.equipamentos || [],
        sedacao_consciente: formData.sedacao_consciente
      },
      localizacao: {
        cep: formData.cep,
        rua: formData.rua,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        uf: formData.uf,
        estacionamento: formData.estacionamento,
        redes_sociais: formData.redes_sociais || [],
        links_redes: {
          facebook: formData.link_facebook,
          instagram: formData.link_instagram,
          youtube: formData.link_youtube,
          linkedin: formData.link_linkedin,
          tiktok: formData.link_tiktok
        },
        google_meu_negocio: formData.google_meu_negocio,
        mapa_google: formData.mapa_google,
        link_google_maps: formData.link_google_maps
      },
      depoimentos: {
        estrategia: formData.depoimentos_estrategia,
        texto: formData.depoimentos_texto,
        link_google_avaliacoes: formData.link_google_avaliacoes
      },
      identidade_visual: {
        logotipo_existente: formData.logotipo_existente,
        manual_marca: formData.manual_marca,
        manual_marca_texto: formData.manual_marca_texto,
        fotos_consultorio: formData.fotos_consultorio,
        estilo_fonte: formData.estilo_fonte,
        percepcao: formData.percepcao || [],
        tom_linguagem: formData.tom_linguagem,
        textos_existentes: formData.textos_existentes,
        textos_texto: formData.textos_texto
      },
      arquivos_enviados: uploadedFiles
    };
    
    console.log('Formulário preenchido:', finalData);
    alert('Formulário enviado com sucesso! Dados salvos no console.');
  };

  const FileUploadField = ({ fieldName, accept, multiple = false, label }: {
    fieldName: string;
    accept: string;
    multiple?: boolean;
    label: string;
  }) => {
    const hasFiles = uploadedFiles[fieldName] && uploadedFiles[fieldName].length > 0;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-purple-800 mb-3">{label}</label>
        <div 
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
            hasFiles 
              ? 'border-green-300 bg-green-50/80' 
              : 'border-purple-200 hover:border-purple-400 bg-white/50'
          }`}
          onClick={() => document.getElementById(fieldName)?.click()}
        >
          <Upload className={`mx-auto h-8 w-8 mb-2 ${hasFiles ? 'text-green-500' : 'text-purple-400'}`} />
          {hasFiles ? (
            <div>
              <p className="text-sm text-green-600 font-medium">
                {uploadedFiles[fieldName].length} arquivo(s) selecionado(s)
              </p>
              <p className="text-xs text-green-500 mt-1">
                {uploadedFiles[fieldName].map(f => f.name).join(', ')}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-purple-600">Clique aqui para selecionar arquivos</p>
              <p className="text-xs text-purple-500 mt-1">Formatos aceitos: {accept}</p>
            </div>
          )}
          <input
            id={fieldName}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileUpload(fieldName, e.target.files)}
            className="hidden"
          />
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch(currentSection) {
      case 0: // Informações Pessoais
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Informações Pessoais
              </h2>
              <p className="text-purple-600/70 text-lg">Vamos começar com suas informações básicas</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Como você gostaria de ser chamado? *
                </label>
                <input
                  type="text"
                  placeholder="Dr. Carlos Eduardo"
                  value={formData.nome || ''}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                    errors.nome ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.nome && <p className="text-red-500 text-sm mt-2 font-medium">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  WhatsApp para contato *
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99123-9999"
                  value={formData.whatsapp || ''}
                  onChange={(e) => {
                    const formatted = formatWhatsApp(e.target.value);
                    updateFormData('whatsapp', formatted);
                  }}
                  maxLength={15}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                    errors.whatsapp ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-2 font-medium">{errors.whatsapp}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Usaremos para tirar dúvidas sobre o projeto</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Seu melhor e-mail *
                </label>
                <input
                  type="email"
                  placeholder="carlos.eduardo@clinica.com.br"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Para enviarmos atualizações do projeto</p>
              </div>
            </div>
          </div>
        );

      case 1: // Homepage/Cabeçalho
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Homepage/Cabeçalho
              </h2>
              <p className="text-purple-600/70 text-lg">Informações sobre seu consultório</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Qual o nome do consultório? *
                </label>
                <input
                  type="text"
                  placeholder="Clínica Odontológica Dr. Carlos Eduardo"
                  value={formData.nome_consultorio || ''}
                  onChange={(e) => updateFormData('nome_consultorio', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                    errors.nome_consultorio ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.nome_consultorio && <p className="text-red-500 text-sm mt-2 font-medium">{errors.nome_consultorio}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Tem slogan ou frase de posicionamento? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="tem_slogan"
                      value="sim"
                      checked={formData.tem_slogan === 'sim'}
                      onChange={(e) => updateFormData('tem_slogan', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim</span>
                  </label>
                  {formData.tem_slogan === 'sim' && (
                    <input
                      type="text"
                      placeholder="Cuidando do seu sorriso com excelência"
                      value={formData.slogan_texto || ''}
                      onChange={(e) => updateFormData('slogan_texto', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm ml-8"
                    />
                  )}
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="tem_slogan"
                      value="nao"
                      checked={formData.tem_slogan === 'nao'}
                      onChange={(e) => updateFormData('tem_slogan', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, confio na expertise de vocês</span>
                  </label>
                </div>
                {errors.tem_slogan && <p className="text-red-500 text-sm mt-2 font-medium">{errors.tem_slogan}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Quais as principais especialidades que querem destacar? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '🦷 Clínica Geral',
                    '📐 Ortodontia', 
                    '🦴 Implantodontia',
                    '✨ Odontologia Estética',
                    '💉 Harmonização Facial',
                    '🔧 Endodontia',
                    '👶 Odontopediatria',
                    '🦷 Periodontia',
                    '⚕️ Cirurgia Bucomaxilofacial',
                    '🏥 Múltiplas especialidades'
                  ].map((esp) => (
                    <label key={esp} className="flex items-center p-3 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                      <input
                        type="checkbox"
                        checked={(formData.especialidades || []).includes(esp)}
                        onChange={(e) => {
                          const especialidades = formData.especialidades || [];
                          if (e.target.checked) {
                            updateFormData('especialidades', [...especialidades, esp]);
                          } else {
                            updateFormData('especialidades', especialidades.filter((item: string) => item !== esp));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-purple-800">{esp}</span>
                    </label>
                  ))}
                </div>
                {errors.especialidades && <p className="text-red-500 text-sm mt-2 font-medium">{errors.especialidades}</p>}
              </div>
            </div>
          </div>
        );

      case 2: // Equipe
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Sobre Nós/Equipe
              </h2>
              <p className="text-purple-600/70 text-lg">Informações sobre os profissionais do consultório</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Quantos dentistas trabalham no consultório? *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.numero_dentistas || '1'}
                  onChange={(e) => updateFormData('numero_dentistas', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-6">
                {Array.from({ length: parseInt(formData.numero_dentistas) || 1 }, (_, index) => (
                  <div key={index} className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-r from-purple-50/50 to-white/50 backdrop-blur-sm">
                    <h3 className="font-bold text-purple-800 mb-6 text-lg">Profissional {index + 1}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                          Nome do profissional
                        </label>
                        <input
                          type="text"
                          placeholder="Dr. João Silva - Especialista"
                          value={formData[`prof${index + 1}_nome`] || ''}
                          onChange={(e) => updateFormData(`prof${index + 1}_nome`, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                          Especialidade principal
                        </label>
                        <input
                          type="text"
                          placeholder="Implantodontia"
                          value={formData[`prof${index + 1}_especialidade`] || ''}
                          onChange={(e) => updateFormData(`prof${index + 1}_especialidade`, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                          Experiência
                        </label>
                        <input
                          type="text"
                          placeholder="15 anos de experiência"
                          value={formData[`prof${index + 1}_experiencia`] || ''}
                          onChange={(e) => updateFormData(`prof${index + 1}_experiencia`, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                          Breve descrição do profissional
                        </label>
                        <textarea
                          placeholder="Especialista em implantes com 15 anos de experiência. Formado pela USP, pós-graduado em Implantodontia..."
                          value={formData[`prof${index + 1}_descricao`] || ''}
                          onChange={(e) => updateFormData(`prof${index + 1}_descricao`, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                          rows={3}
                        />
                        <p className="text-purple-600/60 text-xs mt-2">Descreva formação, experiência e especialidades</p>
                      </div>
                      <FileUploadField
                        fieldName={`prof${index + 1}_foto`}
                        accept=".jpg,.jpeg,.png,.webp"
                        label="Foto profissional"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Serviços/Tratamentos
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Serviços/Tratamentos
              </h2>
              <p className="text-purple-600/70 text-lg">Informações sobre os serviços oferecidos</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Quais os 3 serviços/tratamentos mais procurados pelos pacientes? *
                </label>
                <textarea
                  placeholder="1. Limpeza e profilaxia&#10;2. Clareamento dental&#10;3. Restaurações em resina"
                  value={formData.servicos_procurados || ''}
                  onChange={(e) => updateFormData('servicos_procurados', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none ${
                    errors.servicos_procurados ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                  }`}
                  rows={4}
                />
                {errors.servicos_procurados && <p className="text-red-500 text-sm mt-2 font-medium">{errors.servicos_procurados}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Aceita convênios? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="convenios"
                      value="sim"
                      checked={formData.convenios === 'sim'}
                      onChange={(e) => updateFormData('convenios', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, aceito convênios</span>
                  </label>
                  {formData.convenios === 'sim' && (
                    <input
                      type="text"
                      placeholder="Unimed, Bradesco Dental, SulAmérica, etc."
                      value={formData.convenios_lista || ''}
                      onChange={(e) => updateFormData('convenios_lista', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm ml-8"
                    />
                  )}
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="convenios"
                      value="nao"
                      checked={formData.convenios === 'nao'}
                      onChange={(e) => updateFormData('convenios', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, apenas particular</span>
                  </label>
                </div>
                {errors.convenios && <p className="text-red-500 text-sm mt-2 font-medium">{errors.convenios}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Tem atendimento de emergência 24h? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="emergencia_24h"
                      value="sim"
                      checked={formData.emergencia_24h === 'sim'}
                      onChange={(e) => updateFormData('emergencia_24h', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, 24 horas</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="emergencia_24h"
                      value="nao"
                      checked={formData.emergencia_24h === 'nao'}
                      onChange={(e) => updateFormData('emergencia_24h', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, apenas horário comercial</span>
                  </label>
                </div>
                {errors.emergencia_24h && <p className="text-red-500 text-sm mt-2 font-medium">{errors.emergencia_24h}</p>}
              </div>
            </div>
          </div>
        );

      case 4: // Tecnologia/Diferenciais
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Tecnologia/Diferenciais
              </h2>
              <p className="text-purple-600/70 text-lg">Equipamentos e tecnologias do consultório</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Quais equipamentos/tecnologias disponíveis? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '🦴 Tomografia computadorizada',
                    '📱 Radiografia digital',
                    '💉 Anestesia computadorizada',
                    '⚡ Laser odontológico',
                    '🔬 Microscópio odontológico',
                    '💻 Planejamento digital (CAD/CAM)',
                    '🎯 Scanner intraoral',
                    '📷 Câmera intraoral',
                    '🦷 Implantes guiados por cirurgia',
                    '⭐ Sedação com óxido nitroso',
                    '🏥 Equipamentos de última geração',
                    '🔧 Tecnologia de ponta'
                  ].map((equip) => (
                    <label key={equip} className="flex items-center p-3 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                      <input
                        type="checkbox"
                        checked={(formData.equipamentos || []).includes(equip)}
                        onChange={(e) => {
                          const equipamentos = formData.equipamentos || [];
                          if (e.target.checked) {
                            updateFormData('equipamentos', [...equipamentos, equip]);
                          } else {
                            updateFormData('equipamentos', equipamentos.filter((item: string) => item !== equip));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-purple-800">{equip}</span>
                    </label>
                  ))}
                </div>
                {errors.equipamentos && <p className="text-red-500 text-sm mt-2 font-medium">{errors.equipamentos}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Oferece sedação consciente? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="sedacao_consciente"
                      value="sim"
                      checked={formData.sedacao_consciente === 'sim'}
                      onChange={(e) => updateFormData('sedacao_consciente', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, oferecemos sedação</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="sedacao_consciente"
                      value="nao"
                      checked={formData.sedacao_consciente === 'nao'}
                      onChange={(e) => updateFormData('sedacao_consciente', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não oferecemos</span>
                  </label>
                </div>
                {errors.sedacao_consciente && <p className="text-red-500 text-sm mt-2 font-medium">{errors.sedacao_consciente}</p>}
              </div>
            </div>
          </div>
        );

      case 5: // Localização/Contato
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Localização/Contato
              </h2>
              <p className="text-purple-600/70 text-lg">Endereço e informações de contato</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={formData.cep || ''}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value);
                        updateFormData('cep', formatted);
                        if (formatted.length === 9) {
                          buscarEnderecoPorCEP(formatted);
                        }
                      }}
                      maxLength={9}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.cep ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {loadingCep && (
                      <div className="absolute right-3 top-3">
                        <AlertCircle className="w-5 h-5 text-purple-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  {errors.cep && <p className="text-red-500 text-sm mt-2 font-medium">{errors.cep}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    Número
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.numero || ''}
                    onChange={(e) => updateFormData('numero', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Rua/Endereço *
                </label>
                <input
                  type="text"
                  placeholder="Rua das Flores"
                  value={formData.rua || ''}
                  onChange={(e) => updateFormData('rua', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                    errors.rua ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.rua && <p className="text-red-500 text-sm mt-2 font-medium">{errors.rua}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    Bairro
                  </label>
                  <input
                    type="text"
                    placeholder="Centro"
                    value={formData.bairro || ''}
                    onChange={(e) => updateFormData('bairro', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    placeholder="São Paulo"
                    value={formData.cidade || ''}
                    onChange={(e) => updateFormData('cidade', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.cidade ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.cidade && <p className="text-red-500 text-sm mt-2 font-medium">{errors.cidade}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    UF
                  </label>
                  <input
                    type="text"
                    placeholder="SP"
                    value={formData.uf || ''}
                    onChange={(e) => updateFormData('uf', e.target.value.toUpperCase())}
                    maxLength={2}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Tem estacionamento? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="estacionamento"
                      value="sim"
                      checked={formData.estacionamento === 'sim'}
                      onChange={(e) => updateFormData('estacionamento', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, temos estacionamento</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="estacionamento"
                      value="nao"
                      checked={formData.estacionamento === 'nao'}
                      onChange={(e) => updateFormData('estacionamento', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não temos estacionamento</span>
                  </label>
                </div>
                {errors.estacionamento && <p className="text-red-500 text-sm mt-2 font-medium">{errors.estacionamento}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Redes sociais ativas *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '📘 Facebook',
                    '📸 Instagram',
                    '🎬 YouTube',
                    '💼 LinkedIn',
                    '🎵 TikTok',
                    '❌ Não uso redes sociais'
                  ].map((rede) => (
                    <label key={rede} className="flex items-center p-3 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                      <input
                        type="checkbox"
                        checked={(formData.redes_sociais || []).includes(rede)}
                        onChange={(e) => {
                          const redes = formData.redes_sociais || [];
                          if (e.target.checked) {
                            if (rede === '❌ Não uso redes sociais') {
                              // Se selecionar "Não uso redes sociais", desmarcar todas as outras
                              updateFormData('redes_sociais', [rede]);
                            } else {
                              // Se selecionar qualquer rede social, remover "Não uso redes sociais"
                              const filtered = redes.filter(r => r !== '❌ Não uso redes sociais');
                              updateFormData('redes_sociais', [...filtered, rede]);
                            }
                          } else {
                            updateFormData('redes_sociais', redes.filter((item: string) => item !== rede));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-purple-800">{rede}</span>
                    </label>
                  ))}
                </div>
                {errors.redes_sociais && <p className="text-red-500 text-sm mt-2 font-medium">{errors.redes_sociais}</p>}
              </div>

              {(formData.redes_sociais || []).filter(rede => rede !== '❌ Não uso redes sociais').includes('📘 Facebook') && (
                <div>
                  <input
                    type="url"
                    placeholder="Link do Facebook"
                    value={formData.link_facebook || ''}
                    onChange={(e) => updateFormData('link_facebook', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_facebook ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_facebook && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_facebook}</p>}
                </div>
              )}

              {(formData.redes_sociais || []).filter(rede => rede !== '❌ Não uso redes sociais').includes('📸 Instagram') && (
                <div>
                  <input
                    type="url"
                    placeholder="Link do Instagram"
                    value={formData.link_instagram || ''}
                    onChange={(e) => updateFormData('link_instagram', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_instagram ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_instagram && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_instagram}</p>}
                </div>
              )}

              {(formData.redes_sociais || []).filter(rede => rede !== '❌ Não uso redes sociais').includes('🎬 YouTube') && (
                <div>
                  <input
                    type="url"
                    placeholder="Link do YouTube"
                    value={formData.link_youtube || ''}
                    onChange={(e) => updateFormData('link_youtube', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_youtube ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_youtube && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_youtube}</p>}
                </div>
              )}

              {(formData.redes_sociais || []).filter(rede => rede !== '❌ Não uso redes sociais').includes('💼 LinkedIn') && (
                <div>
                  <input
                    type="url"
                    placeholder="Link do LinkedIn"
                    value={formData.link_linkedin || ''}
                    onChange={(e) => updateFormData('link_linkedin', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_linkedin ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_linkedin && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_linkedin}</p>}
                </div>
              )}

              {(formData.redes_sociais || []).filter(rede => rede !== '❌ Não uso redes sociais').includes('🎵 TikTok') && (
                <div>
                  <input
                    type="url"
                    placeholder="Link do TikTok"
                    value={formData.link_tiktok || ''}
                    onChange={(e) => updateFormData('link_tiktok', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_tiktok ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_tiktok && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_tiktok}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Você tem Google Meu Negócio?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="googleMeuNegocio"
                      value="sim_tenho"
                      checked={formData.googleMeuNegocio === 'sim_tenho'}
                      onChange={(e) => updateFormData('googleMeuNegocio', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, já temos</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="googleMeuNegocio"
                      value="nao_preciso_criar"
                      checked={formData.googleMeuNegocio === 'nao_preciso_criar'}
                      onChange={(e) => updateFormData('googleMeuNegocio', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, precisamos criar (R$ 300)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="googleMeuNegocio"
                      value="nao_interesse"
                      checked={formData.googleMeuNegocio === 'nao_interesse'}
                      onChange={(e) => updateFormData('googleMeuNegocio', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não tenho interesse</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Deseja incorporar o mapa no site?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="incorporarMapa"
                      value="sim_mostrar"
                      checked={formData.incorporarMapa === 'sim_mostrar'}
                      onChange={(e) => updateFormData('incorporarMapa', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, quero mostrar a localização</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="incorporarMapa"
                      value="nao_apenas_texto"
                      checked={formData.incorporarMapa === 'nao_apenas_texto'}
                      onChange={(e) => updateFormData('incorporarMapa', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, apenas o endereço por texto</span>
                  </label>
                </div>
              </div>

              {formData.incorporarMapa === 'sim_mostrar' && (
                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    Link do Google Maps
                  </label>
                  <p className="text-sm text-purple-600 mb-2">Cole o link do Google Maps do seu consultório para incorporar no site</p>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.link_google_maps || ''}
                    onChange={(e) => updateFormData('link_google_maps', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_google_maps ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_google_maps && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_google_maps}</p>}
                </div>
              )}
            </div>
          </div>
        );

      case 6: // Depoimentos/Cases
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Depoimentos/Cases
              </h2>
              <p className="text-purple-600/70 text-lg">Estratégia para depoimentos e cases de sucesso</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Qual estratégia para depoimentos? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="depoimentos_estrategia"
                      value="tenho"
                      checked={formData.depoimentos_estrategia === 'tenho'}
                      onChange={(e) => updateFormData('depoimentos_estrategia', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Tenho depoimentos específicos para usar</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="depoimentos_estrategia"
                      value="criem"
                      checked={formData.depoimentos_estrategia === 'criem'}
                      onChange={(e) => updateFormData('depoimentos_estrategia', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Criem depoimentos baseados na nossa realidade</span>
                  </label>
                </div>
                {errors.depoimentos_estrategia && <p className="text-red-500 text-sm mt-2 font-medium">{errors.depoimentos_estrategia}</p>}
              </div>

              {formData.depoimentos_estrategia === 'tenho' && (
                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    Cole aqui os depoimentos específicos
                  </label>
                  <textarea
                    placeholder="Cole aqui os depoimentos reais dos seus pacientes..."
                    value={formData.depoimentos_texto || ''}
                    onChange={(e) => updateFormData('depoimentos_texto', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                    rows={5}
                  />
                </div>
              )}

                <div>
                  <label className="block text-sm font-semibold text-purple-800 mb-3">
                    Link das avaliações do Google (opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.google.com/search?q=..."
                    value={formData.link_google_avaliacoes || ''}
                    onChange={(e) => updateFormData('link_google_avaliacoes', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.link_google_avaliacoes ? 'border-red-400 focus:border-red-500' : 'border-purple-200 focus:border-purple-400'
                    }`}
                  />
                  {errors.link_google_avaliacoes && <p className="text-red-500 text-sm mt-2 font-medium">{errors.link_google_avaliacoes}</p>}
                </div>
            </div>
          </div>
        );

      case 7: // Identidade Visual/Design
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Identidade Visual/Design
              </h2>
              <p className="text-purple-600/70 text-lg">Definições visuais e de marca do consultório</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Já tem logotipo? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="logotipo_existente"
                      value="sim"
                      checked={formData.logotipo_existente === 'sim'}
                      onChange={(e) => updateFormData('logotipo_existente', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, já tenho logotipo</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="logotipo_existente"
                      value="nao"
                      checked={formData.logotipo_existente === 'nao'}
                      onChange={(e) => updateFormData('logotipo_existente', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, preciso de um logotipo</span>
                  </label>
                </div>
                {errors.logotipo_existente && <p className="text-red-500 text-sm mt-2 font-medium">{errors.logotipo_existente}</p>}
              </div>

              {formData.logotipo_existente === 'sim' && (
                <FileUploadField
                  fieldName="logotipo_upload"
                  accept="image/*"
                  multiple={false}
                  label="Upload do Logotipo"
                />
              )}

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Tem manual da marca/identidade visual? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="manual_marca"
                      value="sim"
                      checked={formData.manual_marca === 'sim'}
                      onChange={(e) => updateFormData('manual_marca', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, temos manual da marca</span>
                  </label>
                  {formData.manual_marca === 'sim' && (
                    <textarea
                      placeholder="Descreva as diretrizes da marca (cores, fontes, estilo visual, etc.)"
                      value={formData.manual_marca_texto || ''}
                      onChange={(e) => updateFormData('manual_marca_texto', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm ml-8 resize-none"
                      rows={3}
                    />
                  )}
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="manual_marca"
                      value="nao"
                      checked={formData.manual_marca === 'nao'}
                      onChange={(e) => updateFormData('manual_marca', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, criem baseado no nosso perfil</span>
                  </label>
                </div>
                {errors.manual_marca && <p className="text-red-500 text-sm mt-2 font-medium">{errors.manual_marca}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Têm fotos profissionais do consultório? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="fotos_consultorio"
                      value="sim"
                      checked={formData.fotos_consultorio === 'sim'}
                      onChange={(e) => updateFormData('fotos_consultorio', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, temos fotos profissionais</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="fotos_consultorio"
                      value="nao"
                      checked={formData.fotos_consultorio === 'nao'}
                      onChange={(e) => updateFormData('fotos_consultorio', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, usem fotos de banco de imagens</span>
                  </label>
                </div>
                {errors.fotos_consultorio && <p className="text-red-500 text-sm mt-2 font-medium">{errors.fotos_consultorio}</p>}
              </div>

              {formData.fotos_consultorio === 'sim' && (
                <FileUploadField
                  fieldName="fotos_consultorio_upload"
                  accept="image/*"
                  multiple={true}
                  label="Upload das Fotos do Consultório"
                />
              )}

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Estilo de fonte preferido *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="estilo_fonte"
                      value="elegante"
                      checked={formData.estilo_fonte === 'elegante'}
                      onChange={(e) => updateFormData('estilo_fonte', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Elegante/Sofisticado</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="estilo_fonte"
                      value="moderno"
                      checked={formData.estilo_fonte === 'moderno'}
                      onChange={(e) => updateFormData('estilo_fonte', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Moderno/Limpo</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="estilo_fonte"
                      value="acolhedor"
                      checked={formData.estilo_fonte === 'acolhedor'}
                      onChange={(e) => updateFormData('estilo_fonte', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Acolhedor/Humanizado</span>
                  </label>
                </div>
                {errors.estilo_fonte && <p className="text-red-500 text-sm mt-2 font-medium">{errors.estilo_fonte}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Percepções desejadas sobre o consultório
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    '💎 Luxuoso/Premium',
                    '🤝 Confiável/Seguro',
                    '🚀 Inovador/Moderno',
                    '❤️ Acolhedor/Humanizado',
                    '⚡ Rápido/Eficiente',
                    '🎓 Especializado/Expert'
                  ].map((percepcao) => (
                    <label key={percepcao} className="flex items-center p-3 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                      <input
                        type="checkbox"
                        checked={(formData.percepcao || []).includes(percepcao)}
                        onChange={(e) => {
                          const percepcoes = formData.percepcao || [];
                          if (e.target.checked) {
                            updateFormData('percepcao', [...percepcoes, percepcao]);
                          } else {
                            updateFormData('percepcao', percepcoes.filter((item: string) => item !== percepcao));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-purple-800">{percepcao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Tom de linguagem *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="tom_linguagem"
                      value="formal"
                      checked={formData.tom_linguagem === 'formal'}
                      onChange={(e) => updateFormData('tom_linguagem', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Formal/Técnico</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="tom_linguagem"
                      value="acessivel"
                      checked={formData.tom_linguagem === 'acessivel'}
                      onChange={(e) => updateFormData('tom_linguagem', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Acessível/Didático</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="tom_linguagem"
                      value="amigavel"
                      checked={formData.tom_linguagem === 'amigavel'}
                      onChange={(e) => updateFormData('tom_linguagem', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Amigável/Próximo</span>
                  </label>
                </div>
                {errors.tom_linguagem && <p className="text-red-500 text-sm mt-2 font-medium">{errors.tom_linguagem}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Já têm textos prontos para o site? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="textos_existentes"
                      value="sim"
                      checked={formData.textos_existentes === 'sim'}
                      onChange={(e) => updateFormData('textos_existentes', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Sim, temos textos prontos</span>
                  </label>
                  {formData.textos_existentes === 'sim' && (
                    <textarea
                      placeholder="Cole aqui os textos que já têm prontos para o site..."
                      value={formData.textos_texto || ''}
                      onChange={(e) => updateFormData('textos_texto', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm ml-8 resize-none"
                      rows={5}
                    />
                  )}
                  <label className="flex items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white/80">
                    <input
                      type="radio"
                      name="textos_existentes"
                      value="nao"
                      checked={formData.textos_existentes === 'nao'}
                      onChange={(e) => updateFormData('textos_existentes', e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-3 font-medium text-purple-800">Não, criem os textos baseados nas informações</span>
                  </label>
                </div>
                {errors.textos_existentes && <p className="text-red-500 text-sm mt-2 font-medium">{errors.textos_existentes}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Seção em desenvolvimento</h2>
            <p className="text-purple-600">Esta seção será implementada em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            OdontoForm
          </h1>
          <p className="text-purple-600/80 text-lg">Formulário Completo para Desenvolvimento do Site</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/60 rounded-full p-1 shadow-lg">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm text-purple-600">
            <span>Progresso</span>
            <span>{Math.round(progressPercentage)}% completo</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
            {renderSection()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={prevSection}
              disabled={currentSection === 0}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="text-center">
              <p className="text-purple-600 font-medium">
                {currentSection + 1} de {sections.length} - {sections[currentSection].title}
              </p>
            </div>

            {currentSection === sections.length - 1 ? (
              <Button
                onClick={submitForm}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                <Check className="w-4 h-4" />
                Finalizar
              </Button>
            ) : (
              <Button
                onClick={nextSection}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingOdonto;