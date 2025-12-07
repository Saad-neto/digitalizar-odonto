import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage, getPayloadSize, formatFileSize } from '@/utils/imageCompression';
import { createLead } from '@/lib/supabase';

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
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: UploadedFile[]}>({});
  const [loadingCep, setLoadingCep] = useState(false);

  const sections = [
    { id: 'informacoes-essenciais', title: 'Informações Essenciais', subtitle: 'Vamos começar! Informações Básicas', required: true },
    { id: 'profissionais', title: 'Sobre o(s) Profissional(is)', subtitle: 'Vamos apresentar você (ou sua equipe) no site', required: true },
    { id: 'servicos-diferenciais', title: 'Serviços e Diferenciais', subtitle: 'O que você oferece e o que te torna único', required: true },
    { id: 'localizacao-contato', title: 'Localização e Contato', subtitle: 'Onde você está?', required: true },
    { id: 'materiais-revisao', title: 'Materiais e Revisão Final', subtitle: 'Quase lá! Materiais e Revisão', required: true }
  ];

  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  // Funções de formatação
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  // Funções de validação
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
    if (!url || url.trim() === '') return true;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
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
          return;
        } else {
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
          return;
        }
      }

      throw new Error('API indisponível');

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setErrors(prev => ({
        ...prev,
        cep: 'API de CEP temporariamente indisponível. Por favor, preencha o endereço manualmente.'
      }));

    } finally {
      setLoadingCep(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (fieldName: string, files: FileList | null) => {
    if (!files) return;

    const fileArray: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const compressedDataUrl = await compressImage(file);

        fileArray.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: compressedDataUrl
        });
      } catch (error) {
        console.error('Erro ao processar arquivo:', error);
      }
    }

    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: fileArray
    }));

    updateFormData(fieldName, fileArray);
  };

  const validateCurrentSection = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch(currentSection) {
      case 0: // Informações Essenciais
        if (!formData.tipo_negocio) newErrors.tipo_negocio = 'Selecione o tipo de negócio';
        if (!formData.nome_consultorio || formData.nome_consultorio.length < 3) {
          newErrors.nome_consultorio = 'Nome do consultório é obrigatório (mín. 3 caracteres)';
        }
        if (!formData.nome || formData.nome.length < 3) {
          newErrors.nome = 'Seu nome é obrigatório (mín. 3 caracteres)';
        }
        if (!formData.whatsapp || !validateWhatsApp(formData.whatsapp)) {
          newErrors.whatsapp = 'WhatsApp inválido (deve ter 11 dígitos)';
        }
        if (!formData.email || !validateEmail(formData.email)) {
          newErrors.email = 'E-mail inválido';
        }
        if (!formData.slogan_opcao) newErrors.slogan_opcao = 'Escolha uma opção de slogan';
        if (formData.slogan_opcao === 'custom' && !formData.slogan_custom) {
          newErrors.slogan_custom = 'Digite seu slogan personalizado';
        }
        if (!formData.ano_inicio || formData.ano_inicio < 1970 || formData.ano_inicio > 2025) {
          newErrors.ano_inicio = 'Ano inválido';
        }
        break;

      case 1: // Profissionais
        // Validação condicional baseada no tipo de negócio
        if (formData.tipo_negocio === 'individual' || formData.tipo_negocio === 'parceria') {
          if (!formData.profissional1_nome) newErrors.profissional1_nome = 'Nome completo é obrigatório';
          if (!formData.profissional1_apresentacao) newErrors.profissional1_apresentacao = 'Como quer ser apresentado é obrigatório';
          if (!formData.profissional1_cro) newErrors.profissional1_cro = 'CRO é obrigatório';
          if (!formData.profissional1_uf) newErrors.profissional1_uf = 'UF é obrigatório';
          if (!formData.profissional1_especialidade) newErrors.profissional1_especialidade = 'Especialidade é obrigatória';
          if (!formData.profissional1_formacao) newErrors.profissional1_formacao = 'Formação é obrigatória';
        }
        if (formData.tipo_negocio === 'parceria') {
          if (!formData.profissional2_nome) newErrors.profissional2_nome = 'Nome do 2º profissional é obrigatório';
          if (!formData.profissional2_apresentacao) newErrors.profissional2_apresentacao = 'Apresentação do 2º profissional é obrigatória';
          if (!formData.profissional2_cro) newErrors.profissional2_cro = 'CRO do 2º profissional é obrigatório';
          if (!formData.profissional2_uf) newErrors.profissional2_uf = 'UF do 2º profissional é obrigatória';
          if (!formData.profissional2_especialidade) newErrors.profissional2_especialidade = 'Especialidade do 2º profissional é obrigatória';
          if (!formData.profissional2_formacao) newErrors.profissional2_formacao = 'Formação do 2º profissional é obrigatória';
        }
        if (formData.tipo_negocio === 'clinica') {
          if (!formData.diretor_nome) newErrors.diretor_nome = 'Nome do diretor técnico é obrigatório';
          if (!formData.diretor_cro) newErrors.diretor_cro = 'CRO do diretor é obrigatório';
          if (!formData.diretor_uf) newErrors.diretor_uf = 'UF do diretor é obrigatória';
          if (!formData.num_profissionais) newErrors.num_profissionais = 'Número de profissionais é obrigatório';
        }
        break;

      case 2: // Serviços e Diferenciais
        if (!formData.servicos || formData.servicos.length < 3) {
          newErrors.servicos = 'Selecione pelo menos 3 serviços';
        }
        if (formData.servicos && formData.servicos.length > 6) {
          newErrors.servicos = 'Selecione no máximo 6 serviços';
        }
        if (formData.servicos?.includes('outro') && !formData.servico_outro) {
          newErrors.servico_outro = 'Especifique qual outro serviço';
        }
        if (!formData.aceita_convenios) newErrors.aceita_convenios = 'Informe se aceita convênios';
        if (formData.aceita_convenios === 'sim' && !formData.lista_convenios) {
          newErrors.lista_convenios = 'Liste os convênios aceitos';
        }
        if (!formData.atende_emergencia) newErrors.atende_emergencia = 'Informe sobre atendimento de emergência';
        if (!formData.tecnologias || formData.tecnologias.length === 0) {
          newErrors.tecnologias = 'Selecione pelo menos uma tecnologia';
        }
        if (!formData.oferece_sedacao) newErrors.oferece_sedacao = 'Informe se oferece sedação';
        break;

      case 3: // Localização e Contato
        if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
        if (!formData.rua) newErrors.rua = 'Rua é obrigatória';
        if (!formData.numero) newErrors.numero = 'Número é obrigatório';
        if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
        if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
        if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
        if (!formData.tem_estacionamento) newErrors.tem_estacionamento = 'Informe sobre estacionamento';
        if (!formData.horarios_atendimento || formData.horarios_atendimento.length === 0) {
          newErrors.horarios_atendimento = 'Selecione pelo menos um horário de atendimento';
        }
        if (!formData.exibir_mapa) newErrors.exibir_mapa = 'Informe se quer exibir o mapa';
        if (!formData.tem_redes_sociais) newErrors.tem_redes_sociais = 'Informe se tem redes sociais';
        break;

      case 4: // Depoimentos/Cases e Revisão Final
        if (!formData.tem_depoimentos) newErrors.tem_depoimentos = 'Informe se tem depoimentos';
        if (formData.link_google_maps && !formData.usar_avaliacoes_google) {
          newErrors.usar_avaliacoes_google = 'Informe se quer usar avaliações do Google';
        }
        if (formData.tem_google_negocio === 'sim' && !formData.link_google_maps) {
          newErrors.link_google_maps = 'Link do Google Maps é obrigatório';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentSection()) return;

    try {
      // Aqui você salvaria no Supabase
      console.log('Dados do formulário:', formData);
      console.log('Arquivos:', uploadedFiles);

      // await createLead(formData);

      alert('Briefing enviado com sucesso! Você receberá o site em até 24 horas.');
      navigate('/obrigado');
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar o briefing. Tente novamente.');
    }
  };

  const renderSection = () => {
    switch(currentSection) {
      case 0: // PÁGINA 1: Informações Essenciais
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                {sections[0].title}
              </h2>
              <p className="text-purple-600/70 text-lg">{sections[0].subtitle}</p>
            </div>

            <div className="space-y-6">
              {/* Tipo de Negócio */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Qual o tipo do seu negócio odontológico? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="tipo_negocio"
                      value="individual"
                      checked={formData.tipo_negocio === 'individual'}
                      onChange={(e) => updateFormData('tipo_negocio', e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-gray-700">Consultório individual - trabalho sozinho(a)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="tipo_negocio"
                      value="parceria"
                      checked={formData.tipo_negocio === 'parceria'}
                      onChange={(e) => updateFormData('tipo_negocio', e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-gray-700">Consultório em parceria - somos 2 dentistas dividindo o espaço</span>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="tipo_negocio"
                      value="clinica"
                      checked={formData.tipo_negocio === 'clinica'}
                      onChange={(e) => updateFormData('tipo_negocio', e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-gray-700">Clínica odontológica - equipe com 3 ou mais profissionais</span>
                  </label>
                </div>
                {errors.tipo_negocio && <p className="text-red-500 text-sm mt-2">{errors.tipo_negocio}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Isso nos ajuda a personalizar o conteúdo do seu site</p>
              </div>

              {/* Nome do Consultório */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Qual o nome do seu consultório ou clínica? *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Clínica Odontológica Dr. Carlos Silva"
                  value={formData.nome_consultorio || ''}
                  onChange={(e) => updateFormData('nome_consultorio', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.nome_consultorio ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.nome_consultorio && <p className="text-red-500 text-sm mt-2">{errors.nome_consultorio}</p>}
              </div>

              {/* Seu Nome */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Como você se chama? *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Carlos Eduardo Silva"
                  value={formData.nome || ''}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.nome ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.nome && <p className="text-red-500 text-sm mt-2">{errors.nome}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Nome completo para nossa comunicação durante o projeto</p>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Qual seu WhatsApp para agendamentos? *
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp || ''}
                  onChange={(e) => {
                    const formatted = formatWhatsApp(e.target.value);
                    updateFormData('whatsapp', formatted);
                  }}
                  maxLength={15}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.whatsapp ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-2">{errors.whatsapp}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Este número aparecerá no site para os pacientes agendarem consultas</p>
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Seu melhor e-mail *
                </label>
                <input
                  type="email"
                  placeholder="contato@clinica.com.br"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.email ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Enviaremos o site pronto neste e-mail em até 24 horas</p>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Escolha a frase principal do seu site: *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'anos_experiencia', label: 'Cuidando do seu sorriso há [X] anos', desc: 'Personalização: mostrará seus anos de experiência' },
                    { value: 'sorriso_perfeito', label: 'Seu sorriso perfeito começa aqui', desc: '' },
                    { value: 'confianca', label: 'Sorria com confiança e segurança', desc: '' },
                    { value: 'humanizado', label: 'Odontologia de qualidade com atendimento humanizado', desc: '' },
                    { value: 'tecnologia', label: 'Tecnologia avançada para cuidar do seu sorriso', desc: '' },
                    { value: 'sem_dor', label: 'Tratamento odontológico sem dor', desc: '' },
                  ].map((opcao) => (
                    <label key={opcao.value} className="flex items-start p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                      <input
                        type="radio"
                        name="slogan_opcao"
                        value={opcao.value}
                        checked={formData.slogan_opcao === opcao.value}
                        onChange={(e) => updateFormData('slogan_opcao', e.target.value)}
                        className="w-4 h-4 text-purple-600 mt-1"
                      />
                      <div className="ml-3">
                        <div className="text-gray-700">{opcao.label}</div>
                        {opcao.desc && <div className="text-xs text-purple-600/60 mt-1">{opcao.desc}</div>}
                      </div>
                    </label>
                  ))}
                  <label className="flex items-start p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="slogan_opcao"
                      value="custom"
                      checked={formData.slogan_opcao === 'custom'}
                      onChange={(e) => updateFormData('slogan_opcao', e.target.value)}
                      className="w-4 h-4 text-purple-600 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-gray-700">Tenho meu próprio slogan:</div>
                      {formData.slogan_opcao === 'custom' && (
                        <input
                          type="text"
                          placeholder="Digite seu slogan personalizado"
                          value={formData.slogan_custom || ''}
                          onChange={(e) => updateFormData('slogan_custom', e.target.value)}
                          className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      )}
                    </div>
                  </label>
                  <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="slogan_opcao"
                      value="confiamos"
                      checked={formData.slogan_opcao === 'confiamos'}
                      onChange={(e) => updateFormData('slogan_opcao', e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-gray-700">Escolham vocês com base no meu perfil</span>
                  </label>
                </div>
                {errors.slogan_opcao && <p className="text-red-500 text-sm mt-2">{errors.slogan_opcao}</p>}
                {errors.slogan_custom && <p className="text-red-500 text-sm mt-2">{errors.slogan_custom}</p>}
              </div>

              {/* Ano de Início */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Desde que ano você atua na odontologia? *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 2010"
                  min="1970"
                  max="2025"
                  value={formData.ano_inicio || ''}
                  onChange={(e) => updateFormData('ano_inicio', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.ano_inicio ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.ano_inicio && <p className="text-red-500 text-sm mt-2">{errors.ano_inicio}</p>}
                <p className="text-purple-600/60 text-xs mt-2">Usaremos para calcular os anos de experiência e mostrar no site</p>
              </div>

              {/* Número de Pacientes (Opcional) */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Aproximadamente quantos pacientes você já atendeu?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'menos_500', label: 'Menos de 500' },
                    { value: '500_2000', label: 'Entre 500 e 2.000' },
                    { value: '2000_5000', label: 'Entre 2.000 e 5.000' },
                    { value: 'mais_5000', label: 'Mais de 5.000' },
                    { value: 'nao_informar', label: 'Não sei / Prefiro não informar' },
                  ].map((opcao) => (
                    <label key={opcao.value} className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                      <input
                        type="radio"
                        name="num_pacientes"
                        value={opcao.value}
                        checked={formData.num_pacientes === opcao.value}
                        onChange={(e) => updateFormData('num_pacientes', e.target.value)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="ml-3 text-gray-700">{opcao.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-purple-600/60 text-xs mt-2">Não precisa ser exato. Usaremos para mostrar sua experiência no site (ex: '+5.000 pacientes atendidos')</p>
              </div>

              {/* Google Meu Negócio */}
              <div>
                <label className="block text-sm font-semibold text-purple-800 mb-3">
                  Tem Google Meu Negócio?
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="tem_google_negocio"
                      value="sim"
                      checked={formData.tem_google_negocio === 'sim'}
                      onChange={(e) => updateFormData('tem_google_negocio', e.target.value)}
                      className="w-4 h-4 text-purple-600 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-gray-700">Sim, tenho</div>
                      {formData.tem_google_negocio === 'sim' && (
                        <div className="mt-3 space-y-3">
                          <input
                            type="text"
                            placeholder="Cole o link do Google Meu Negócio"
                            value={formData.link_google_negocio || ''}
                            onChange={(e) => updateFormData('link_google_negocio', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                          />
                          <p className="text-xs text-purple-600/60">💡 Como encontrar? Busque sua clínica no Google Maps, clique em "Compartilhar" e copie o link</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="tem_google_negocio"
                      value="nao"
                      checked={formData.tem_google_negocio === 'nao'}
                      onChange={(e) => updateFormData('tem_google_negocio', e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-gray-700">Não tenho</span>
                  </label>
                </div>
                <p className="text-purple-600/60 text-xs mt-2">Se tiver Google Meu Negócio com avaliações, mostraremos no seu site para aumentar a credibilidade</p>
              </div>
            </div>
          </div>
        );

      case 1: // PÁGINA 2: Profissionais (Condicional)
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">
                {sections[1].title}
              </h2>
              <p className="text-purple-600/70 text-lg">{sections[1].subtitle}</p>
            </div>

            <div className="space-y-8">
              {/* Mensagem informativa baseada no tipo */}
              {formData.tipo_negocio === 'parceria' && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-purple-800 text-sm">
                    Você informou que são <strong>2 dentistas em parceria</strong>. Vamos coletar os dados de cada profissional para mostrar no site.
                  </p>
                </div>
              )}
              {formData.tipo_negocio === 'clinica' && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-purple-800 text-sm">
                    Sua clínica tem uma <strong>equipe de profissionais</strong>. Vamos coletar os dados do diretor técnico e decidir quais profissionais destacar no site.
                  </p>
                </div>
              )}

              {/* CONSULTÓRIO INDIVIDUAL OU PARCERIA - PROFISSIONAL 1 */}
              {(formData.tipo_negocio === 'individual' || formData.tipo_negocio === 'parceria') && (
                <div className="space-y-6">
                  {formData.tipo_negocio === 'parceria' && (
                    <div className="border-t-4 border-purple-400 pt-6">
                      <h3 className="text-xl font-bold text-purple-800 mb-4">Profissional 1</h3>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Qual seu nome completo? *
                    </label>
                    <input
                      type="text"
                      placeholder="Carlos Eduardo Silva"
                      value={formData.profissional1_nome || ''}
                      onChange={(e) => updateFormData('profissional1_nome', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional1_nome ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.profissional1_nome && <p className="text-red-500 text-sm mt-2">{errors.profissional1_nome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Como gostaria de ser apresentado no site? *
                    </label>
                    <input
                      type="text"
                      placeholder="Dr. Carlos Eduardo  OU  Dra. Ana Silva"
                      value={formData.profissional1_apresentacao || ''}
                      onChange={(e) => updateFormData('profissional1_apresentacao', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional1_apresentacao ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.profissional1_apresentacao && <p className="text-red-500 text-sm mt-2">{errors.profissional1_apresentacao}</p>}
                    <p className="text-purple-600/60 text-xs mt-2">Este nome aparecerá em destaque na seção 'Sobre' do site</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-3">
                        CRO *
                      </label>
                      <input
                        type="text"
                        placeholder="12345"
                        value={formData.profissional1_cro || ''}
                        onChange={(e) => updateFormData('profissional1_cro', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                          errors.profissional1_cro ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                        }`}
                      />
                      {errors.profissional1_cro && <p className="text-red-500 text-sm mt-2">{errors.profissional1_cro}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-3">
                        UF *
                      </label>
                      <select
                        value={formData.profissional1_uf || ''}
                        onChange={(e) => updateFormData('profissional1_uf', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                          errors.profissional1_uf ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                        }`}
                      >
                        <option value="">Selecione</option>
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                      {errors.profissional1_uf && <p className="text-red-500 text-sm mt-2">{errors.profissional1_uf}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Qual sua principal especialidade? *
                    </label>
                    <select
                      value={formData.profissional1_especialidade || ''}
                      onChange={(e) => updateFormData('profissional1_especialidade', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional1_especialidade ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    >
                      <option value="">Selecione...</option>
                      <option value="clinica_geral">Clínica Geral</option>
                      <option value="implantodontia">Implantodontia</option>
                      <option value="ortodontia">Ortodontia</option>
                      <option value="endodontia">Endodontia (Canal)</option>
                      <option value="periodontia">Periodontia (Gengiva)</option>
                      <option value="odontopediatria">Odontopediatria</option>
                      <option value="protese">Prótese Dentária</option>
                      <option value="bucomaxilo">Cirurgia Bucomaxilofacial</option>
                      <option value="estetica">Odontologia Estética</option>
                      <option value="harmonizacao">Harmonização Orofacial</option>
                      <option value="outras">Outras</option>
                    </select>
                    {errors.profissional1_especialidade && <p className="text-red-500 text-sm mt-2">{errors.profissional1_especialidade}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Resumo da sua formação *
                    </label>
                    <textarea
                      placeholder="Ex: Graduado pela USP (2010), Especialista em Implantodontia pela APCD (2015)"
                      value={formData.profissional1_formacao || ''}
                      onChange={(e) => updateFormData('profissional1_formacao', e.target.value)}
                      maxLength={200}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional1_formacao ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.profissional1_formacao && <p className="text-red-500 text-sm mt-2">{errors.profissional1_formacao}</p>}
                    <p className="text-purple-600/60 text-xs mt-2">Graduação + principal especialização. Seja breve. (máx. 200 caracteres)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Breve apresentação pessoal (opcional)
                    </label>
                    <textarea
                      placeholder="Ex: Com mais de 15 anos de experiência, dedico-me a oferecer tratamentos odontológicos de excelência..."
                      value={formData.profissional1_bio || ''}
                      onChange={(e) => updateFormData('profissional1_bio', e.target.value)}
                      maxLength={400}
                      rows={4}
                      className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all border-purple-200 focus:border-purple-400"
                    />
                    <p className="text-purple-600/60 text-xs mt-2">Opcional, mas recomendado. Conte um pouco sobre você e sua missão. (máx. 400 caracteres)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Sua foto profissional *
                    </label>
                    <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('profissional1_foto', e.target.files)}
                        className="hidden"
                        id="profissional1_foto"
                      />
                      <label htmlFor="profissional1_foto" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <p className="text-purple-800 font-medium">Clique para fazer upload</p>
                        <p className="text-purple-600/60 text-xs mt-1">JPG ou PNG (máx. 5MB)</p>
                      </label>
                      {uploadedFiles.profissional1_foto && uploadedFiles.profissional1_foto.length > 0 && (
                        <div className="mt-3 text-sm text-green-600">
                          ✓ {uploadedFiles.profissional1_foto[0].name}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-purple-600/70 space-y-1">
                      <p>✅ Foto de boa qualidade (não use selfie)</p>
                      <p>✅ Fundo neutro ou do consultório</p>
                      <p>✅ Roupa profissional (jaleco de preferência)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PARCERIA - PROFISSIONAL 2 */}
              {formData.tipo_negocio === 'parceria' && (
                <div className="space-y-6 border-t-4 border-purple-400 pt-8">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Profissional 2</h3>

                  {/* Campos idênticos ao Profissional 1, mas com profissional2_* */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Nome completo do 2º profissional *
                    </label>
                    <input
                      type="text"
                      placeholder="Ana Paula Santos"
                      value={formData.profissional2_nome || ''}
                      onChange={(e) => updateFormData('profissional2_nome', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional2_nome ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.profissional2_nome && <p className="text-red-500 text-sm mt-2">{errors.profissional2_nome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Como gostaria de ser apresentado(a) no site? *
                    </label>
                    <input
                      type="text"
                      placeholder="Dra. Ana Paula"
                      value={formData.profissional2_apresentacao || ''}
                      onChange={(e) => updateFormData('profissional2_apresentacao', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional2_apresentacao ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.profissional2_apresentacao && <p className="text-red-500 text-sm mt-2">{errors.profissional2_apresentacao}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-3">
                        CRO *
                      </label>
                      <input
                        type="text"
                        placeholder="54321"
                        value={formData.profissional2_cro || ''}
                        onChange={(e) => updateFormData('profissional2_cro', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                          errors.profissional2_cro ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                        }`}
                      />
                      {errors.profissional2_cro && <p className="text-red-500 text-sm mt-2">{errors.profissional2_cro}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-3">
                        UF *
                      </label>
                      <select
                        value={formData.profissional2_uf || ''}
                        onChange={(e) => updateFormData('profissional2_uf', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                          errors.profissional2_uf ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                        }`}
                      >
                        <option value="">Selecione</option>
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                      {errors.profissional2_uf && <p className="text-red-500 text-sm mt-2">{errors.profissional2_uf}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Especialidade principal *
                    </label>
                    <select
                      value={formData.profissional2_especialidade || ''}
                      onChange={(e) => updateFormData('profissional2_especialidade', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional2_especialidade ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    >
                      <option value="">Selecione...</option>
                      <option value="clinica_geral">Clínica Geral</option>
                      <option value="implantodontia">Implantodontia</option>
                      <option value="ortodontia">Ortodontia</option>
                      <option value="endodontia">Endodontia (Canal)</option>
                      <option value="periodontia">Periodontia (Gengiva)</option>
                      <option value="odontopediatria">Odontopediatria</option>
                      <option value="protese">Prótese Dentária</option>
                      <option value="bucomaxilo">Cirurgia Bucomaxilofacial</option>
                      <option value="estetica">Odontologia Estética</option>
                      <option value="harmonizacao">Harmonização Orofacial</option>
                      <option value="outras">Outras</option>
                    </select>
                    {errors.profissional2_especialidade && <p className="text-red-500 text-sm mt-2">{errors.profissional2_especialidade}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Resumo da formação *
                    </label>
                    <textarea
                      placeholder="Ex: Graduada pela UFRJ (2012), Especialista em Ortodontia..."
                      value={formData.profissional2_formacao || ''}
                      onChange={(e) => updateFormData('profissional2_formacao', e.target.value)}
                      maxLength={200}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                        errors.profissional2_formacao ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                      }`}
                    />
                    {errors.profissional2_formacao && <p className="text-red-500 text-sm mt-2">{errors.profissional2_formacao}</p>}
                    <p className="text-purple-600/60 text-xs mt-2">máx. 200 caracteres</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-3">
                      Foto profissional *
                    </label>
                    <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('profissional2_foto', e.target.files)}
                        className="hidden"
                        id="profissional2_foto"
                      />
                      <label htmlFor="profissional2_foto" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <p className="text-purple-800 font-medium">Clique para fazer upload</p>
                        <p className="text-purple-600/60 text-xs mt-1">JPG ou PNG (máx. 5MB)</p>
                      </label>
                      {uploadedFiles.profissional2_foto && uploadedFiles.profissional2_foto.length > 0 && (
                        <div className="mt-3 text-sm text-green-600">
                          ✓ {uploadedFiles.profissional2_foto[0].name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* CLÍNICA - DIRETOR TÉCNICO + OPÇÃO DE DESTACAR */}
              {formData.tipo_negocio === 'clinica' && (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-purple-800">Diretor Técnico (Obrigatório por lei)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-purple-800 mb-3">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          placeholder="Dr. Roberto Silva"
                          value={formData.diretor_nome || ''}
                          onChange={(e) => updateFormData('diretor_nome', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                            errors.diretor_nome ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                          }`}
                        />
                        {errors.diretor_nome && <p className="text-red-500 text-sm mt-2">{errors.diretor_nome}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-purple-800 mb-3">
                            CRO *
                          </label>
                          <input
                            type="text"
                            placeholder="12345"
                            value={formData.diretor_cro || ''}
                            onChange={(e) => updateFormData('diretor_cro', e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                              errors.diretor_cro ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                            }`}
                          />
                          {errors.diretor_cro && <p className="text-red-500 text-sm mt-2">{errors.diretor_cro}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-purple-800 mb-3">
                            UF *
                          </label>
                          <select
                            value={formData.diretor_uf || ''}
                            onChange={(e) => updateFormData('diretor_uf', e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                              errors.diretor_uf ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                            }`}
                          >
                            <option value="">UF</option>
                            {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                              <option key={uf} value={uf}>{uf}</option>
                            ))}
                          </select>
                          {errors.diretor_uf && <p className="text-red-500 text-sm mt-2">{errors.diretor_uf}</p>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-800 mb-3">
                        Quantos profissionais trabalham na clínica? *
                      </label>
                      <input
                        type="number"
                        placeholder="Ex: 8"
                        min="3"
                        value={formData.num_profissionais || ''}
                        onChange={(e) => updateFormData('num_profissionais', parseInt(e.target.value))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                          errors.num_profissionais ? 'border-red-400' : 'border-purple-200 focus:border-purple-400'
                        }`}
                      />
                      {errors.num_profissionais && <p className="text-red-500 text-sm mt-2">{errors.num_profissionais}</p>}
                      <p className="text-purple-600/60 text-xs mt-2">Mostraremos no site: 'Equipe com X especialistas'</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-purple-800">
                      Deseja destacar alguns profissionais no site?
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                        <input
                          type="radio"
                          name="destacar_profissionais"
                          value="nao"
                          checked={formData.destacar_profissionais === 'nao'}
                          onChange={(e) => updateFormData('destacar_profissionais', e.target.value)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="ml-3 text-gray-700">Não, apenas mencionar que temos equipe especializada</span>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50">
                        <input
                          type="radio"
                          name="destacar_profissionais"
                          value="sim"
                          checked={formData.destacar_profissionais === 'sim'}
                          onChange={(e) => updateFormData('destacar_profissionais', e.target.value)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="ml-3 text-gray-700">Sim, quero destacar profissionais específicos</span>
                      </label>
                    </div>
                    <p className="text-purple-600/60 text-xs">Destacar profissionais principais aumenta a confiança. Recomendamos mostrar pelo menos 2-3.</p>
                  </div>

                  {formData.destacar_profissionais === 'sim' && (
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                      <p className="text-purple-800 text-sm mb-2">
                        <strong>Funcionalidade em desenvolvimento:</strong> Por enquanto, você poderá enviar as informações dos profissionais por e-mail após o envio do briefing.
                      </p>
                      <p className="text-purple-600/70 text-xs">
                        Precisaremos: nome, CRO, especialidade, mini bio e foto de cada profissional que deseja destacar.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 2: // PÁGINA 3: Serviços/Tratamentos + Tecnologia/Diferenciais
        return (
          <div className="space-y-8">
            {/* Serviços Oferecidos */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Quais serviços/tratamentos você oferece? *
              </label>
              <p className="text-sm text-purple-600/70 mb-4">
                Selecione de 3 a 6 serviços que você oferece (os principais que deseja destacar no site):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'limpeza', label: 'Limpeza e profilaxia', icon: '✨' },
                  { value: 'clareamento', label: 'Clareamento dental', icon: '⚡' },
                  { value: 'restauracoes', label: 'Restaurações em resina', icon: '🦷' },
                  { value: 'canal', label: 'Tratamento de canal (endodontia)', icon: '🔧' },
                  { value: 'implantes', label: 'Implantes dentários', icon: '💎' },
                  { value: 'proteses', label: 'Próteses dentárias', icon: '👄' },
                  { value: 'ortodontia_fixa', label: 'Ortodontia (aparelho fixo)', icon: '📐' },
                  { value: 'ortodontia_invisivel', label: 'Ortodontia invisível (alinhadores)', icon: '🔍' },
                  { value: 'extracao', label: 'Extração de dentes/sisos', icon: '🩺' },
                  { value: 'periodontia', label: 'Periodontia (tratamento de gengiva)', icon: '🌿' },
                  { value: 'odontopediatria', label: 'Odontopediatria (dentista infantil)', icon: '👶' },
                  { value: 'harmonizacao', label: 'Harmonização facial', icon: '💉' },
                  { value: 'bichectomia', label: 'Bichectomia', icon: '✂️' },
                  { value: 'lentes', label: 'Lentes de contato dental', icon: '💫' },
                  { value: 'facetas', label: 'Facetas de porcelana', icon: '🎨' },
                  { value: 'cirurgia', label: 'Cirurgia bucomaxilofacial', icon: '🏥' },
                  { value: 'dtm', label: 'DTM e bruxismo', icon: '😴' },
                  { value: 'emergencia', label: 'Emergências 24h', icon: '🚨' },
                  { value: 'outro', label: 'Outro', icon: '➕' }
                ].map((servico) => (
                  <label key={servico.value} className="flex items-center p-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                    <input
                      type="checkbox"
                      checked={formData.servicos?.includes(servico.value) || false}
                      onChange={(e) => {
                        const current = formData.servicos || [];
                        if (e.target.checked) {
                          // Limitar a 6 serviços
                          if (current.length < 6) {
                            setFormData({...formData, servicos: [...current, servico.value]});
                          }
                        } else {
                          setFormData({...formData, servicos: current.filter(s => s !== servico.value)});
                          // Se desmarcar "outro", limpar o campo
                          if (servico.value === 'outro') {
                            setFormData({...formData, servicos: current.filter(s => s !== servico.value), servico_outro: ''});
                          }
                        }
                      }}
                      className="mr-3 accent-purple-600 w-5 h-5"
                      disabled={!formData.servicos?.includes(servico.value) && (formData.servicos?.length || 0) >= 6}
                    />
                    <span className="text-purple-800">
                      <span className="mr-2">{servico.icon}</span>
                      {servico.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Contador de serviços selecionados */}
              <div className="mt-3 text-center">
                <span className={`text-sm font-semibold ${
                  (formData.servicos?.length || 0) < 3 ? 'text-red-600' :
                  (formData.servicos?.length || 0) > 6 ? 'text-red-600' :
                  'text-purple-600'
                }`}>
                  {formData.servicos?.length || 0} de 3-6 serviços selecionados
                </span>
              </div>

              {errors.servicos && <p className="text-red-500 text-sm mt-2">{errors.servicos}</p>}

              {/* Campo "Outro" condicional */}
              {formData.servicos?.includes('outro') && (
                <div className="mt-4">
                  <label className="block text-purple-800 font-semibold mb-2">
                    Qual outro serviço? *
                  </label>
                  <input
                    type="text"
                    value={formData.servico_outro || ''}
                    onChange={(e) => setFormData({...formData, servico_outro: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.servico_outro ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                    placeholder="Digite o serviço"
                  />
                  {errors.servico_outro && <p className="text-red-500 text-sm mt-1">{errors.servico_outro}</p>}
                </div>
              )}
            </div>

            {/* Aceita Convênios */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Aceita convênios? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="aceita_convenios"
                    value="sim"
                    checked={formData.aceita_convenios === 'sim'}
                    onChange={(e) => setFormData({...formData, aceita_convenios: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div>
                    <div className="font-semibold text-purple-800">✅ Sim, aceito convênios</div>
                    <div className="text-sm text-purple-600/70">(Unimed, Bradesco Dental, SulAmérica, etc.)</div>
                  </div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="aceita_convenios"
                    value="nao"
                    checked={formData.aceita_convenios === 'nao'}
                    onChange={(e) => setFormData({...formData, aceita_convenios: e.target.value, lista_convenios: ''})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div>
                    <div className="font-semibold text-purple-800">❌ Não, apenas particular</div>
                  </div>
                </label>
              </div>
              {errors.aceita_convenios && <p className="text-red-500 text-sm mt-2">{errors.aceita_convenios}</p>}
            </div>

            {/* Lista de Convênios (condicional) */}
            {formData.aceita_convenios === 'sim' && (
              <div>
                <label className="block text-purple-800 font-semibold mb-2">
                  Quais convênios você aceita? *
                </label>
                <p className="text-sm text-purple-600/70 mb-3">
                  Liste os convênios separados por vírgula (ex: Unimed, Bradesco Dental, SulAmérica)
                </p>
                <textarea
                  value={formData.lista_convenios || ''}
                  onChange={(e) => setFormData({...formData, lista_convenios: e.target.value})}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.lista_convenios ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                  placeholder="Ex: Unimed, Bradesco Dental, SulAmérica, Amil, Porto Seguro"
                />
                {errors.lista_convenios && <p className="text-red-500 text-sm mt-1">{errors.lista_convenios}</p>}
              </div>
            )}

            {/* Atendimento de Emergência */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Tem atendimento de emergência, fora? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="atende_emergencia"
                    value="sim_24h"
                    checked={formData.atende_emergencia === 'sim_24h'}
                    onChange={(e) => setFormData({...formData, atende_emergencia: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">Sim, 24 horas</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="atende_emergencia"
                    value="nao_horario"
                    checked={formData.atende_emergencia === 'nao_horario'}
                    onChange={(e) => setFormData({...formData, atende_emergencia: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">Não, apenas horário comercial</div>
                </label>
              </div>
              {errors.atende_emergencia && <p className="text-red-500 text-sm mt-2">{errors.atende_emergencia}</p>}
            </div>

            {/* Equipamentos/Tecnologia */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Quais equipamentos/tecnologias disponíveis? *
              </label>
              <p className="text-sm text-purple-600/70 mb-4">
                Marque todos que se aplicam:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'tomografia', label: 'Tomografia computadorizada' },
                  { value: 'anestesia', label: 'Anestesia computadorizada' },
                  { value: 'microscopia', label: 'Microscopia odontológica' },
                  { value: 'scanner', label: 'Scanner intraoral' },
                  { value: 'radiografia', label: 'Radiografia digital' },
                  { value: 'laser', label: 'Laser odontológico' },
                  { value: 'implante', label: 'Implante com cóleo clínico' },
                  { value: 'camera', label: 'Câmera intraoral' },
                  { value: 'impressao', label: 'Impressora guarda em Google' },
                  { value: 'sedacao', label: 'Sedação com óxido nitroso' },
                  { value: 'piezocirurgia', label: 'Piezocirurgia' },
                  { value: 'tecnologia_ponta', label: 'Tecnologia de ponta' }
                ].map((tech) => (
                  <label key={tech.value} className="flex items-center p-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                    <input
                      type="checkbox"
                      checked={formData.tecnologias?.includes(tech.value) || false}
                      onChange={(e) => {
                        const current = formData.tecnologias || [];
                        if (e.target.checked) {
                          setFormData({...formData, tecnologias: [...current, tech.value]});
                        } else {
                          setFormData({...formData, tecnologias: current.filter(t => t !== tech.value)});
                        }
                      }}
                      className="mr-3 accent-purple-600 w-5 h-5"
                    />
                    <span className="text-purple-800">{tech.label}</span>
                  </label>
                ))}
              </div>
              {errors.tecnologias && <p className="text-red-500 text-sm mt-2">{errors.tecnologias}</p>}
            </div>

            {/* Oferece Sessão? */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Oferece sedação consciente? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="oferece_sedacao"
                    value="sim"
                    checked={formData.oferece_sedacao === 'sim'}
                    onChange={(e) => setFormData({...formData, oferece_sedacao: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">Sim, oferecemos sedação</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="oferece_sedacao"
                    value="nao"
                    checked={formData.oferece_sedacao === 'nao'}
                    onChange={(e) => setFormData({...formData, oferece_sedacao: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">Não oferecemos</div>
                </label>
              </div>
              {errors.oferece_sedacao && <p className="text-red-500 text-sm mt-2">{errors.oferece_sedacao}</p>}
            </div>
          </div>
        );

      case 3: // PÁGINA 4: Localização/Contato
        return (
          <div className="space-y-8">
            {/* CEP */}
            <div>
              <label className="block text-purple-800 font-semibold mb-2">
                CEP *
              </label>
              <input
                type="text"
                value={formData.cep || ''}
                onChange={handleCepChange}
                maxLength={9}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.cep ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                placeholder="00000-000"
              />
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            </div>

            {/* Rua/Logradouro */}
            <div>
              <label className="block text-purple-800 font-semibold mb-2">
                Rua/Logradouro *
              </label>
              <input
                type="text"
                value={formData.rua || ''}
                onChange={(e) => setFormData({...formData, rua: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.rua ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                placeholder="Rua das Flores"
              />
              {errors.rua && <p className="text-red-500 text-sm mt-1">{errors.rua}</p>}
            </div>

            {/* Número e Bairro (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-purple-800 font-semibold mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.numero || ''}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.numero ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                  placeholder="123"
                />
                {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-purple-800 font-semibold mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.bairro || ''}
                  onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.bairro ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                  placeholder="Centro"
                />
                {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
              </div>
            </div>

            {/* Cidade e UF (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-purple-800 font-semibold mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.cidade || ''}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.cidade ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                  placeholder="São Paulo"
                />
                {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
              </div>

              <div>
                <label className="block text-purple-800 font-semibold mb-2">
                  UF *
                </label>
                <input
                  type="text"
                  value={formData.estado || ''}
                  onChange={(e) => setFormData({...formData, estado: e.target.value.toUpperCase()})}
                  maxLength={2}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.estado ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                  placeholder="SP"
                />
                {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
              </div>
            </div>

            {/* Complemento (opcional) */}
            <div>
              <label className="block text-purple-800 font-semibold mb-2">
                Complemento (opcional)
              </label>
              <input
                type="text"
                value={formData.complemento || ''}
                onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Sala 12, 2º andar"
              />
            </div>

            {/* Tem estacionamento? */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Tem estacionamento? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_estacionamento"
                    value="sim_gratuito"
                    checked={formData.tem_estacionamento === 'sim_gratuito'}
                    onChange={(e) => setFormData({...formData, tem_estacionamento: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">✅ Sim, temos estacionamento</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_estacionamento"
                    value="nao_conveniado"
                    checked={formData.tem_estacionamento === 'nao_conveniado'}
                    onChange={(e) => setFormData({...formData, tem_estacionamento: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">❌ Não temos estacionamento</div>
                </label>
              </div>
              {errors.tem_estacionamento && <p className="text-red-500 text-sm mt-2">{errors.tem_estacionamento}</p>}
            </div>

            {/* Horários de Atendimento */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Quais horários de atendimento? *
              </label>
              <p className="text-sm text-purple-600/70 mb-4">
                Marque todos os horários que você atende:
              </p>
              <div className="space-y-3">
                {[
                  { value: 'manha', label: '☀️ Manhã' },
                  { value: 'tarde', label: '🌤️ Tarde' },
                  { value: 'noite', label: '🌙 Noite' },
                  { value: 'sabado', label: '📅 Sábado' },
                  { value: 'domingo', label: '🗓️ Domingo e feriados' }
                ].map((horario) => (
                  <label key={horario.value} className="flex items-center p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                    <input
                      type="checkbox"
                      checked={formData.horarios_atendimento?.includes(horario.value) || false}
                      onChange={(e) => {
                        const current = formData.horarios_atendimento || [];
                        if (e.target.checked) {
                          setFormData({...formData, horarios_atendimento: [...current, horario.value]});
                        } else {
                          setFormData({...formData, horarios_atendimento: current.filter(h => h !== horario.value)});
                        }
                      }}
                      className="mr-3 accent-purple-600 w-5 h-5"
                    />
                    <span className="font-semibold text-purple-800">{horario.label}</span>
                  </label>
                ))}
              </div>
              {errors.horarios_atendimento && <p className="text-red-500 text-sm mt-2">{errors.horarios_atendimento}</p>}
            </div>

            {/* Quer exibir o mapa do Google Maps? */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Quer exibir o mapa do Google no site? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="exibir_mapa"
                    value="sim"
                    checked={formData.exibir_mapa === 'sim'}
                    onChange={(e) => setFormData({...formData, exibir_mapa: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">✅ Sim, quero mostrar minha localização no mapa</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="exibir_mapa"
                    value="nao"
                    checked={formData.exibir_mapa === 'nao'}
                    onChange={(e) => setFormData({...formData, exibir_mapa: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">❌ Não, apenas o endereço de texto</div>
                </label>
              </div>
              {errors.exibir_mapa && <p className="text-red-500 text-sm mt-2">{errors.exibir_mapa}</p>}
            </div>

            {/* Tem redes sociais ativas? */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Tem redes sociais ativas? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_redes_sociais"
                    value="sim"
                    checked={formData.tem_redes_sociais === 'sim'}
                    onChange={(e) => setFormData({...formData, tem_redes_sociais: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">✅ Sim, tenho Instagram e/ou Facebook</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_redes_sociais"
                    value="nao"
                    checked={formData.tem_redes_sociais === 'nao'}
                    onChange={(e) => setFormData({...formData, tem_redes_sociais: e.target.value, instagram: '', facebook: ''})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">❌ Não tenho redes sociais</div>
                </label>
              </div>
              {errors.tem_redes_sociais && <p className="text-red-500 text-sm mt-2">{errors.tem_redes_sociais}</p>}
            </div>

            {/* Links das Redes Sociais (condicional) */}
            {formData.tem_redes_sociais === 'sim' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-800 font-semibold mb-2">
                    Instagram (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.instagram || ''}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="https://instagram.com/seu_usuario"
                  />
                </div>

                <div>
                  <label className="block text-purple-800 font-semibold mb-2">
                    Facebook (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.facebook || ''}
                    onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="https://facebook.com/sua_pagina"
                  />
                </div>

                <div>
                  <label className="block text-purple-800 font-semibold mb-2">
                    LinkedIn (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="https://linkedin.com/in/seu_perfil"
                  />
                </div>

                <div>
                  <label className="block text-purple-800 font-semibold mb-2">
                    Outras redes (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.outras_redes || ''}
                    onChange={(e) => setFormData({...formData, outras_redes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 4: // PÁGINA 5: Depoimentos/Cases + Link do Google Maps
        return (
          <div className="space-y-8">
            {/* Tem depoimentos de pacientes satisfeitos? */}
            <div>
              <label className="block text-purple-800 font-semibold mb-4 text-lg">
                Tem depoimentos de pacientes satisfeitos? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_depoimentos"
                    value="sim"
                    checked={formData.tem_depoimentos === 'sim'}
                    onChange={(e) => setFormData({...formData, tem_depoimentos: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">✅ Sim, tenho vários</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_depoimentos"
                    value="nao"
                    checked={formData.tem_depoimentos === 'nao'}
                    onChange={(e) => setFormData({...formData, tem_depoimentos: e.target.value})}
                    className="mt-1 mr-3 accent-purple-600"
                  />
                  <div className="font-semibold text-purple-800">❌ Não tenho ainda</div>
                </label>
              </div>
              {errors.tem_depoimentos && <p className="text-red-500 text-sm mt-2">{errors.tem_depoimentos}</p>}
            </div>

            {/* Você gostaria de utilizar as avaliações do Google no site? */}
            {formData.link_google_maps && (
              <div>
                <label className="block text-purple-800 font-semibold mb-4 text-lg">
                  Você gostaria de utilizar as avaliações do Google no site? *
                </label>
                <p className="text-sm text-purple-600/70 mb-4">
                  As avaliações do Google podem ser exibidas automaticamente com o link do seu negócio.
                </p>
                <div className="space-y-3">
                  <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                    <input
                      type="radio"
                      name="usar_avaliacoes_google"
                      value="sim"
                      checked={formData.usar_avaliacoes_google === 'sim'}
                      onChange={(e) => setFormData({...formData, usar_avaliacoes_google: e.target.value})}
                      className="mt-1 mr-3 accent-purple-600"
                    />
                    <div className="font-semibold text-purple-800">✅ Sim, quero mostrar minhas avaliações do Google</div>
                  </label>

                  <label className="flex items-start p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer bg-white">
                    <input
                      type="radio"
                      name="usar_avaliacoes_google"
                      value="nao"
                      checked={formData.usar_avaliacoes_google === 'nao'}
                      onChange={(e) => setFormData({...formData, usar_avaliacoes_google: e.target.value})}
                      className="mt-1 mr-3 accent-purple-600"
                    />
                    <div className="font-semibold text-purple-800">❌ Não quero exibir as avaliações do Google</div>
                  </label>
                </div>
                {errors.usar_avaliacoes_google && <p className="text-red-500 text-sm mt-2">{errors.usar_avaliacoes_google}</p>}
              </div>
            )}

            {/* Link do Google Maps (se tiver Google Meu Negócio) */}
            {formData.tem_google_negocio === 'sim' && (
              <div>
                <label className="block text-purple-800 font-semibold mb-2">
                  Link do Google Maps *
                </label>
                <p className="text-sm text-purple-600/70 mb-3">
                  Cole o link do seu Google Maps. Para encontrar: acesse google.com/maps, pesquise seu consultório e copie o link.
                </p>
                <input
                  type="url"
                  value={formData.link_google_maps || ''}
                  onChange={(e) => setFormData({...formData, link_google_maps: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.link_google_maps ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                  placeholder="https://maps.google.com/..."
                />
                {errors.link_google_maps && <p className="text-red-500 text-sm mt-1">{errors.link_google_maps}</p>}
              </div>
            )}

            {/* Observações Finais */}
            <div>
              <label className="block text-purple-800 font-semibold mb-2 text-lg">
                Observações finais ou algo que não perguntamos?
              </label>
              <p className="text-sm text-purple-600/70 mb-3">
                Use este espaço para nos contar qualquer informação adicional que você acha importante para o site.
              </p>
              <textarea
                value={formData.observacoes_finais || ''}
                onChange={(e) => setFormData({...formData, observacoes_finais: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Ex: Tenho um diferencial específico, atendo um público especial, quero destacar algo em especial..."
              />
            </div>

            {/* Mensagem de Conclusão */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
              <div className="flex items-start">
                <div className="text-3xl mr-4">🎉</div>
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Quase lá! Revise suas informações
                  </h3>
                  <p className="text-purple-700">
                    Você está na última etapa. Revise todas as informações preenchidas antes de enviar.
                    Use o botão "Anterior" para voltar e corrigir algo se necessário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-purple-600">Página em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            Briefing Odonto
          </h1>
          <p className="text-purple-600/70 text-lg">
            Formulário Completo para Desenvolvimento do Site
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-purple-800">Progresso</span>
            <span className="text-sm font-semibold text-purple-600">{Math.round(progressPercentage)}% completo</span>
          </div>
          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-purple-600/80 text-sm font-medium">
              {currentSection + 1} de {sections.length} - {sections[currentSection].title}
            </span>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          {renderSection()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentSection === 0}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentSection < sections.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              Enviar Briefing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefingOdonto;
