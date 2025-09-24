import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Check, MapPin, Phone, 
         User, Heart, Smile, Sparkles, Shield, Stethoscope, Baby, Clock, Scissors, Star } from 'lucide-react';
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

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const buscarEnderecoPorCEP = async (cep) => {
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
          return;
        } else {
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado na base dos Correios' }));
          return;
        }
      }

      throw new Error('API indisponível');
      
    } catch (error) {
      const cepsConhecidos = {
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

  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const validateWhatsApp = (whatsapp) => {
    const numbers = whatsapp.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    const validDDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28', '31', '32', '33', '34', '35', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48', '49', '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69', '71', '73', '74', '75', '77', '79', '81', '82', '83', '84', '85', '86', '87', '88', '89', '91', '92', '93', '94', '95', '96', '97', '98', '99'];
    const ddd = numbers.substring(0, 2);
    if (!validDDDs.includes(ddd)) return false;
    if (numbers.charAt(2) !== '9') return false;
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return false;
    if (email.length > 254) return false;
    if (email.includes('..')) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    return true;
  };

  const updateFormData = (field, value) => {
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
    
    console.log('🚀 Enviando dados para webhook:', {
      url: 'https://n8n-webhook.isaai.online/webhook/odonto_form',
      dataKeys: Object.keys(finalData),
      timestamp: finalData.timestamp
    });

    try {
      const response = await fetch('https://n8n-webhook.isaai.online/webhook/odonto_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(finalData)
      });
      
      console.log('📡 Resposta do webhook:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const responseData = await response.text();
        console.log('✅ Formulário enviado com sucesso:', responseData);
        setCurrentSection(sections.length); // Ir para página de sucesso
      } else {
        const errorText = await response.text();
        console.error('❌ Erro HTTP do servidor:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 404) {
          alert('Erro: Webhook não encontrado. Verifique a configuração do N8N.');
        } else if (response.status >= 500) {
          alert('Erro interno do servidor. Tente novamente em alguns minutos.');
        } else {
          alert(`Erro ao enviar formulário (${response.status}): ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Erro de rede ou CORS:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Erro de conexão: Verifique sua internet ou entre em contato com o suporte.\n\nDetalhes: ' + error.message);
      } else {
        alert('Erro ao enviar formulário: ' + error.message);
      }
    }
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
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
            hasFiles 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => document.getElementById(fieldName).click()}
        >
          <Upload className={`mx-auto h-8 w-8 mb-2 ${hasFiles ? 'text-green-500' : 'text-gray-400'}`} />
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
              <p className="text-sm text-gray-600">Clique aqui para selecionar arquivos</p>
              <p className="text-xs text-gray-500 mt-1">Formatos aceitos: {accept}</p>
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

  const RadioGroup = ({ name, options, label, required = false }: {
    name: string;
    options: {value: string; label: string}[];
    label: string;
    required?: boolean;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={formData[name] === option.value}
              onChange={(e) => updateFormData(name, e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  const CheckboxGroup = ({ name, options, label, required = false }: {
    name: string;
    options: {value: string; label: string}[];
    label: string;
    required?: boolean;
  }) => {
    const currentValues = formData[name] || [];
    
    const handleChange = (value, checked) => {
      if (checked) {
        updateFormData(name, [...currentValues, value]);
      } else {
        updateFormData(name, currentValues.filter(v => v !== value));
      }
    };

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={currentValues.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
      </div>
    );
  };

  const SpecialtiesCheckboxGroup = ({ name, label, required = false, formData, updateFormData, errors }: {
    name: string;
    label: string;
    required?: boolean;
    formData: any;
    updateFormData: any;
    errors: any;
  }) => {
    const currentValues = formData[name] || [];
    
    const handleChange = (value, checked) => {
      if (checked) {
        updateFormData(name, [...currentValues, value]);
      } else {
        updateFormData(name, currentValues.filter(v => v !== value));
      }
    };

    const specialties = [
      { value: 'clinica_geral', label: 'Clínica Geral', icon: User, color: 'purple' },
      { value: 'ortodontia', label: 'Ortodontia', icon: Smile, color: 'orange' },
      { value: 'implantodontia', label: 'Implantodontia', icon: Shield, color: 'purple' },
      { value: 'estetica', label: 'Odontologia Estética', icon: Sparkles, color: 'orange' },
      { value: 'harmonizacao', label: 'Harmonização Facial', icon: Star, color: 'purple' },
      { value: 'endodontia', label: 'Endodontia', icon: Heart, color: 'orange' },
      { value: 'odontopediatria', label: 'Odontopediatria', icon: Baby, color: 'yellow' },
      { value: 'periodontia', label: 'Periodontia', icon: Stethoscope, color: 'purple' },
      { value: 'cirurgia', label: 'Cirurgia Bucomaxilofacial', icon: Scissors, color: 'blue' },
      { value: 'multiplas', label: 'Múltiplas especialidades', icon: Star, color: 'purple' }
    ];

    const getColorClasses = (color: string) => {
      const colorMap = {
        purple: 'bg-purple-100 text-purple-600 border-purple-200',
        orange: 'bg-orange-100 text-orange-600 border-orange-200',
        yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
        blue: 'bg-blue-100 text-blue-600 border-blue-200'
      };
      return colorMap[color] || colorMap.purple;
    };

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {specialties.map((specialty) => {
            const IconComponent = specialty.icon;
            return (
              <label key={specialty.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                currentValues.includes(specialty.value) 
                  ? `${getColorClasses(specialty.color)} border-opacity-100` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={currentValues.includes(specialty.value)}
                  onChange={(e) => handleChange(specialty.value, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  currentValues.includes(specialty.value) ? getColorClasses(specialty.color) : 'bg-gray-100'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{specialty.label}</span>
              </label>
            );
          })}
        </div>
        {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
      </div>
    );
  };

  // Página de confirmação
  if (currentSection === sections.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100/50 p-12 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
              Formulário Enviado com Sucesso!
            </h1>
            <p className="text-purple-600/80 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Recebemos todas as informações da <strong className="text-purple-700">{formData.nome_consultorio}</strong>.
              Nossa equipe analisará os dados e entrará em contato em até 24 horas.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch(currentSection) {

      case 0: // Informações Pessoais
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações Pessoais</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => updateFormData('nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => updateFormData('whatsapp', formatWhatsApp(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(11) 99999-9999"
              />
              {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        );

      case 1: // Homepage/Cabeçalho
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-800 mb-2">OdontoForm</h2>
              <p className="text-gray-500 text-sm mb-8">Informações sobre seu consultório</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qual o nome do consultório? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome_consultorio || ''}
                onChange={(e) => updateFormData('nome_consultorio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Clínica Odontológica Dr. Carlos Eduardo"
              />
              {errors.nome_consultorio && <p className="text-red-500 text-sm mt-1">{errors.nome_consultorio}</p>}
            </div>

            <RadioGroup
              name="tem_slogan"
              label="Tem slogan ou frase de posicionamento?"
              required
              options={[
                { value: 'sim', label: 'Sim, temos um slogan' },
                { value: 'nao', label: 'Não, confio na expertise de vocês' }
              ]}
            />

            {formData.tem_slogan === 'sim' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual é o slogan?
                </label>
                <input
                  type="text"
                  value={formData.slogan_texto || ''}
                  onChange={(e) => updateFormData('slogan_texto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o slogan do consultório"
                />
              </div>
            )}

            <SpecialtiesCheckboxGroup
              name="especialidades"
              label="Quais as principais especialidades que querem destacar?"
              required
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          </div>
        );

      case 2: // Equipe
        const numDentistas = parseInt(formData.numero_dentistas) || 1;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sobre Nós/Equipe</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantos dentistas trabalham no consultório?
              </label>
              <select
                value={formData.numero_dentistas || '1'}
                onChange={(e) => updateFormData('numero_dentistas', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'dentista' : 'dentistas'}</option>
                ))}
              </select>
            </div>

            {Array.from({ length: numDentistas }, (_, i) => i + 1).map(profNum => (
              <div key={profNum} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Profissional {profNum}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData[`prof${profNum}_nome`] || ''}
                      onChange={(e) => updateFormData(`prof${profNum}_nome`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do profissional"
                    />
                    {errors[`prof${profNum}_nome`] && <p className="text-red-500 text-sm mt-1">{errors[`prof${profNum}_nome`]}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData[`prof${profNum}_especialidade`] || ''}
                      onChange={(e) => updateFormData(`prof${profNum}_especialidade`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Clínica Geral, Ortodontia..."
                    />
                    {errors[`prof${profNum}_especialidade`] && <p className="text-red-500 text-sm mt-1">{errors[`prof${profNum}_especialidade`]}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anos de Experiência <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData[`prof${profNum}_experiencia`] || ''}
                    onChange={(e) => updateFormData(`prof${profNum}_experiencia`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 10 anos, Mais de 15 anos..."
                  />
                  {errors[`prof${profNum}_experiencia`] && <p className="text-red-500 text-sm mt-1">{errors[`prof${profNum}_experiencia`]}</p>}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição/Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData[`prof${profNum}_descricao`] || ''}
                    onChange={(e) => updateFormData(`prof${profNum}_descricao`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Breve descrição do profissional, formação, experiências..."
                  />
                  {errors[`prof${profNum}_descricao`] && <p className="text-red-500 text-sm mt-1">{errors[`prof${profNum}_descricao`]}</p>}
                </div>

                <div className="mt-4">
                  <FileUploadField
                    fieldName={`prof${profNum}_foto`}
                    accept="image/*"
                    label="Foto do Profissional (opcional)"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 3: // Serviços
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Serviços/Tratamentos</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quais são os 3 serviços mais procurados pelos seus pacientes?
              </label>
              <textarea
                value={formData.servicos_procurados || ''}
                onChange={(e) => updateFormData('servicos_procurados', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ex: 1. Limpeza e Profilaxia, 2. Clareamento dental, 3. Restaurações..."
              />
            </div>

            <RadioGroup
              name="convenios"
              label="Vocês trabalham com convênios odontológicos?"
              required
              options={[
                { value: 'sim', label: 'Sim, trabalhamos com convênios' },
                { value: 'nao', label: 'Não trabalhamos com convênios' },
                { value: 'alguns', label: 'Trabalhamos com alguns convênios específicos' }
              ]}
            />

            {(formData.convenios === 'sim' || formData.convenios === 'alguns') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quais convênios vocês atendem?
                </label>
                <textarea
                  value={formData.convenios_lista || ''}
                  onChange={(e) => updateFormData('convenios_lista', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Liste os convênios que vocês atendem..."
                />
              </div>
            )}

            <RadioGroup
              name="emergencia_24h"
              label="Vocês fazem atendimento de emergência 24 horas?"
              required
              options={[
                { value: 'sim', label: 'Sim, atendemos emergências 24h' },
                { value: 'nao', label: 'Não fazemos atendimento 24h' },
                { value: 'horario_estendido', label: 'Temos horário estendido, mas não 24h' }
              ]}
            />
          </div>
        );

      case 4: // Tecnologia
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tecnologia/Diferenciais</h2>
            
            <CheckboxGroup
              name="equipamentos"
              label="Quais equipamentos e tecnologias vocês possuem?"
              options={[
                { value: 'raio_x_digital', label: 'Raio-X Digital' },
                { value: 'tomografia', label: 'Tomografia Computadorizada' },
                { value: 'scanner_3d', label: 'Scanner 3D Intraoral' },
                { value: 'laser_terapeutico', label: 'Laser Terapêutico' },
                { value: 'sedacao_consciente', label: 'Sedação Consciente' },
                { value: 'implantes_guiados', label: 'Cirurgia Guiada para Implantes' },
                { value: 'cad_cam', label: 'Sistema CAD/CAM' },
                { value: 'microscopia', label: 'Microscopia Odontológica' }
              ]}
            />

            <RadioGroup
              name="sedacao_consciente"
              label="Vocês oferecem sedação consciente para pacientes ansiosos?"
              required
              options={[
                { value: 'sim', label: 'Sim, oferecemos sedação consciente' },
                { value: 'nao', label: 'Não oferecemos sedação consciente' },
                { value: 'parceria', label: 'Temos parceria com anestesista' }
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outros diferenciais do consultório:
              </label>
              <textarea
                value={formData.outros_diferenciais || ''}
                onChange={(e) => updateFormData('outros_diferenciais', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ex: Atendimento humanizado, ambiente climatizado, wifi gratuito, etc."
              />
            </div>
          </div>
        );

      case 5: // Localização
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Localização/Contato</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.cep || ''}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      updateFormData('cep', formatted);
                      if (formatted.replace(/\D/g, '').length === 8) {
                        buscarEnderecoPorCEP(formatted);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="00000-000"
                  />
                  {loadingCep && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.numero || ''}
                  onChange={(e) => updateFormData('numero', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rua/Avenida
              </label>
              <input
                type="text"
                value={formData.rua || ''}
                onChange={(e) => updateFormData('rua', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome da rua"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.bairro || ''}
                  onChange={(e) => updateFormData('bairro', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bairro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.cidade || ''}
                  onChange={(e) => updateFormData('cidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UF
                </label>
                <input
                  type="text"
                  value={formData.uf || ''}
                  onChange={(e) => updateFormData('uf', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>

            <RadioGroup
              name="estacionamento"
              label="Vocês têm estacionamento?"
              required
              options={[
                { value: 'sim_proprio', label: 'Sim, estacionamento próprio' },
                { value: 'sim_conveniado', label: 'Sim, conveniado' },
                { value: 'nao', label: 'Não temos estacionamento' }
              ]}
            />

            <CheckboxGroup
              name="redes_sociais"
              label="Em quais redes sociais vocês estão presentes?"
              required
              options={[
                { value: 'facebook', label: 'Facebook' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'youtube', label: 'YouTube' },
                { value: 'linkedin', label: 'LinkedIn' },
                { value: 'tiktok', label: 'TikTok' },
                { value: 'nenhuma', label: 'Não temos redes sociais' }
              ]}
            />

            {formData.redes_sociais && formData.redes_sociais.includes('facebook') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Facebook
                </label>
                <input
                  type="url"
                  value={formData.link_facebook || ''}
                  onChange={(e) => updateFormData('link_facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/seuconsultorio"
                />
              </div>
            )}

            {formData.redes_sociais && formData.redes_sociais.includes('instagram') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Instagram
                </label>
                <input
                  type="url"
                  value={formData.link_instagram || ''}
                  onChange={(e) => updateFormData('link_instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/seuconsultorio"
                />
              </div>
            )}

            <RadioGroup
              name="google_meu_negocio"
              label="Vocês têm cadastro no Google Meu Negócio?"
              required
              options={[
                { value: 'sim_ativo', label: 'Sim, temos e está ativo' },
                { value: 'sim_inativo', label: 'Sim, mas não está atualizado' },
                { value: 'nao', label: 'Não temos cadastro' }
              ]}
            />

            <RadioGroup
              name="mapa_google"
              label="Gostariam de ter o mapa do Google integrado no site?"
              required
              options={[
                { value: 'sim', label: 'Sim, queremos o mapa integrado' },
                { value: 'nao', label: 'Não queremos o mapa' }
              ]}
            />

            {formData.mapa_google === 'sim' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Google Maps (opcional)
                </label>
                <input
                  type="url"
                  value={formData.link_google_maps || ''}
                  onChange={(e) => updateFormData('link_google_maps', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://maps.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vá no Google Maps, procure seu consultório e copie o link
                </p>
              </div>
            )}
          </div>
        );

      case 6: // Depoimentos
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Depoimentos/Cases</h2>
            
            <RadioGroup
              name="depoimentos_estrategia"
              label="Como vocês gostariam de trabalhar os depoimentos no site?"
              required
              options={[
                { value: 'fotos_reais', label: 'Usar fotos reais de pacientes (com autorização)' },
                { value: 'antes_depois', label: 'Mostrar casos de antes e depois' },
                { value: 'textos_apenas', label: 'Apenas textos dos depoimentos' },
                { value: 'nao_usar', label: 'Não queremos usar depoimentos' }
              ]}
            />

            {formData.depoimentos_estrategia !== 'nao_usar' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compartilhem alguns depoimentos de pacientes:
                </label>
                <textarea
                  value={formData.depoimentos_texto || ''}
                  onChange={(e) => updateFormData('depoimentos_texto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Cole aqui os depoimentos que vocês já têm ou gostariam de destacar..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link do Google para avaliações (opcional)
              </label>
              <input
                type="url"
                value={formData.link_google_avaliacoes || ''}
                onChange={(e) => updateFormData('link_google_avaliacoes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://g.page/seuconsultorio/review"
              />
              <p className="text-xs text-gray-500 mt-1">
                Link direto para que pacientes possam avaliar no Google
              </p>
            </div>

            <FileUploadField
              fieldName="fotos_antes_depois"
              accept="image/*"
              multiple={true}
              label="Fotos de casos Antes/Depois (opcional)"
            />
          </div>
        );

      case 7: // Identidade Visual
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Identidade Visual/Design</h2>
            
            <RadioGroup
              name="logotipo_existente"
              label="Vocês já têm um logotipo?"
              required
              options={[
                { value: 'sim_gosto', label: 'Sim, temos e gostamos' },
                { value: 'sim_melhorar', label: 'Sim, mas gostaríamos de melhorar' },
                { value: 'nao', label: 'Não temos logotipo' }
              ]}
            />

            {(formData.logotipo_existente === 'sim_gosto' || formData.logotipo_existente === 'sim_melhorar') && (
              <FileUploadField
                fieldName="logotipo_arquivo"
                accept="image/*"
                label="Envie o logotipo atual"
              />
            )}

            <RadioGroup
              name="manual_marca"
              label="Vocês têm manual da marca com cores e padrões definidos?"
              required
              options={[
                { value: 'sim_completo', label: 'Sim, temos manual completo' },
                { value: 'sim_basico', label: 'Temos algumas definições básicas' },
                { value: 'nao', label: 'Não temos manual da marca' }
              ]}
            />

            {formData.manual_marca !== 'nao' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva as cores e padrões da marca:
                </label>
                <textarea
                  value={formData.manual_marca_texto || ''}
                  onChange={(e) => updateFormData('manual_marca_texto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ex: Cores principais: azul #003366 e branco, fonte: Arial, estilo clean e profissional..."
                />
              </div>
            )}

            <RadioGroup
              name="fotos_consultorio"
              label="Vocês têm fotos profissionais do consultório?"
              required
              options={[
                { value: 'sim_profissionais', label: 'Sim, fotos profissionais' },
                { value: 'sim_amadoras', label: 'Temos fotos, mas não profissionais' },
                { value: 'nao', label: 'Não temos fotos do consultório' }
              ]}
            />

            {formData.fotos_consultorio !== 'nao' && (
              <FileUploadField
                fieldName="fotos_consultorio_arquivos"
                accept="image/*"
                multiple={true}
                label="Envie as fotos do consultório"
              />
            )}

            <RadioGroup
              name="estilo_fonte"
              label="Qual estilo de fonte vocês preferem?"
              required
              options={[
                { value: 'serif_classica', label: 'Clássica com serifa (Times, Georgia)' },
                { value: 'sans_moderna', label: 'Moderna sem serifa (Arial, Helvetica)' },
                { value: 'sans_amigavel', label: 'Amigável sem serifa (Open Sans, Roboto)' },
                { value: 'customizada', label: 'Fonte customizada/diferenciada' }
              ]}
            />

            <CheckboxGroup
              name="percepcao"
              label="Como vocês gostariam que o consultório fosse percebido?"
              options={[
                { value: 'confiavel', label: 'Confiável e Seguro' },
                { value: 'moderno', label: 'Moderno e Tecnológico' },
                { value: 'acolhedor', label: 'Acolhedor e Humano' },
                { value: 'premium', label: 'Premium e Exclusivo' },
                { value: 'familiar', label: 'Familiar e Próximo' },
                { value: 'profissional', label: 'Profissional e Sério' }
              ]}
            />

            <RadioGroup
              name="tom_linguagem"
              label="Qual tom de linguagem preferem para o site?"
              required
              options={[
                { value: 'formal', label: 'Formal e técnico' },
                { value: 'amigavel', label: 'Amigável e próximo' },
                { value: 'equilibrado', label: 'Equilibrado entre formal e amigável' }
              ]}
            />

            <RadioGroup
              name="textos_existentes"
              label="Vocês já têm textos prontos para o site?"
              required
              options={[
                { value: 'sim_completos', label: 'Sim, temos textos completos' },
                { value: 'sim_parciais', label: 'Temos alguns textos' },
                { value: 'nao', label: 'Não temos textos prontos' }
              ]}
            />

            {formData.textos_existentes !== 'nao' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compartilhem os textos que já têm:
                </label>
                <textarea
                  value={formData.textos_texto || ''}
                  onChange={(e) => updateFormData('textos_texto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Cole aqui os textos que vocês já têm para o site..."
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Barra de Progresso Fixa */}
      <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 border-b border-purple-100">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              OdontoForm
            </h1>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {currentSection + 1} de {sections.length}
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm font-medium text-purple-700">
            {sections[currentSection].title}
          </div>
        </div>
      </div>

      {/* Conteúdo do Formulário */}
      <div className="pt-40 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100/50 p-8 backdrop-blur-sm">
            {renderSection()}
            
            {/* Botões de Navegação */}
            <div className="flex justify-between mt-10 pt-8 border-t border-purple-100">
              <Button
                onClick={prevSection}
                disabled={currentSection === 0}
                variant={currentSection === 0 ? "secondary" : "outline"}
                className="flex items-center"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </Button>
              
              {currentSection === sections.length - 1 ? (
                <Button
                  onClick={submitForm}
                  className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Finalizar e Enviar
                  <Check className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={nextSection}
                  className="flex items-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingOdonto;