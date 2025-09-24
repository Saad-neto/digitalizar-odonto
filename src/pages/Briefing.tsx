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