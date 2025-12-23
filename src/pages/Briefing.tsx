import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage, getPayloadSize, formatFileSize } from '@/utils/imageCompression';
import { createLead } from '@/lib/supabase';
import ReviewStep from '@/components/ReviewStep';
import ProfessionalForm from '@/components/ProfessionalForm';
import HeaderNew from '@/components/redesign/HeaderNew';
import FooterNew from '@/components/redesign/FooterNew';

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
  const [formData, setFormData] = useState<FormData>({
    profissionais: [{
      nome: '',
      registro: '',
      especialidade: '',
      descricao: '',
      foto: null,
      redesSociais: []
    }]
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: UploadedFile[]}>({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    { id: 'informacoes-essenciais', title: 'Informações Essenciais', subtitle: 'Vamos começar! Informações Básicas', required: true },
    { id: 'profissionais', title: 'Sobre o(s) Profissional(is)', subtitle: 'Vamos apresentar você (ou sua equipe) no site', required: true },
    { id: 'servicos-diferenciais', title: 'Serviços e Diferenciais', subtitle: 'O que você oferece e o que te torna único', required: true },
    { id: 'localizacao-contato', title: 'Localização e Contato', subtitle: 'Onde você está?', required: true },
    { id: 'materiais-visuais', title: 'Materiais Visuais', subtitle: 'Imagens e identidade visual do site', required: false },
    { id: 'rastreamento', title: 'Rastreamento e Integrações', subtitle: 'Configure suas tags de análise (Opcional)', required: false },
    { id: 'depoimentos', title: 'Depoimentos e Avaliações', subtitle: 'Construa confiança com seus pacientes', required: true },
    { id: 'revisao', title: 'Revisão Final', subtitle: 'Confira todas as informações', required: false }
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
          updateFormData('estado', data.uf || '');
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

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    // Formatar CEP: 00000-000
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }

    updateFormData('cep', value);

    // Buscar endereço quando CEP estiver completo
    if (value.replace(/\D/g, '').length === 8) {
      buscarEnderecoPorCEP(value);
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

  // Funções para gerenciar array de profissionais
  const updateProfissional = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const profissionais = [...(prev.profissionais || [])];
      profissionais[index] = {
        ...profissionais[index],
        [field]: value
      };
      return { ...prev, profissionais };
    });

    // Limpar erro do campo se existir
    const errorKey = `profissional_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const adicionarProfissional = () => {
    setFormData((prev: any) => ({
      ...prev,
      profissionais: [
        ...(prev.profissionais || []),
        {
          nome: '',
          registro: '',
          especialidade: '',
          descricao: '',
          foto: null,
          redesSociais: []
        }
      ]
    }));
  };

  const removerProfissional = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      profissionais: prev.profissionais.filter((_: any, i: number) => i !== index)
    }));

    // Limpar erros relacionados ao profissional removido
    setErrors((prev: any) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`profissional_${index}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleProfissionalFoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    try {
      // Comprimir usando função já existente
      const compressedBase64 = await compressImage(file);

      updateProfissional(index, 'foto', {
        name: file.name,
        type: file.type,
        size: file.size,
        data: compressedBase64
      });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar imagem. Tente novamente.');
    }
  };

  const adicionarRedeSocial = (profIndex: number) => {
    setFormData((prev: any) => {
      const profissionais = [...prev.profissionais];
      profissionais[profIndex].redesSociais = [
        ...(profissionais[profIndex].redesSociais || []),
        { tipo: 'instagram', url: '' }
      ];
      return { ...prev, profissionais };
    });
  };

  const removerRedeSocial = (profIndex: number, redeIndex: number) => {
    setFormData((prev: any) => {
      const profissionais = [...prev.profissionais];
      profissionais[profIndex].redesSociais = profissionais[profIndex].redesSociais.filter(
        (_: any, i: number) => i !== redeIndex
      );
      return { ...prev, profissionais };
    });
  };

  const updateRedeSocial = (profIndex: number, redeIndex: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const profissionais = [...prev.profissionais];
      profissionais[profIndex].redesSociais[redeIndex] = {
        ...profissionais[profIndex].redesSociais[redeIndex],
        [field]: value
      };
      return { ...prev, profissionais };
    });
  };

  const validateCurrentSection = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch(currentSection) {
      case 0: // Informações Essenciais
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
        // Validar array de profissionais
        if (!formData.profissionais || formData.profissionais.length === 0) {
          newErrors.profissionais = 'Adicione pelo menos um profissional';
        } else {
          formData.profissionais.forEach((prof: any, index: number) => {
            if (!prof.nome?.trim()) {
              newErrors[`profissional_${index}_nome`] = 'Digite o nome do profissional';
            }
            if (!prof.registro?.trim()) {
              newErrors[`profissional_${index}_registro`] = 'Digite o número do CRO';
            }
            if (!prof.descricao?.trim()) {
              newErrors[`profissional_${index}_descricao`] = 'Escreva uma mini biografia';
            } else if (prof.descricao.trim().length < 50) {
              newErrors[`profissional_${index}_descricao`] = 'A biografia deve ter pelo menos 50 caracteres';
            }
          });
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
        if (formData.aceita_convenios === 'sim' && (!formData.lista_convenios_array || formData.lista_convenios_array.length === 0)) {
          newErrors.lista_convenios = 'Selecione pelo menos um convênio';
        }
        if (formData.lista_convenios_array?.includes('outro_convenio') && !formData.outro_convenio) {
          newErrors.outro_convenio = 'Especifique qual outro convênio';
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

      case 4: // Materiais Visuais - Opcional
        // Sem validações obrigatórias - cliente pode enviar depois
        break;

      case 5: // Rastreamento e Integrações - Opcional
        // Sem validações obrigatórias - tudo é opcional
        break;

      case 6: // Depoimentos
        if (!formData.estrategia_depoimentos) {
          newErrors.estrategia_depoimentos = 'Escolha como quer mostrar depoimentos';
        }
        if (formData.estrategia_depoimentos === 'google' && !formData.link_google_maps) {
          newErrors.link_google_maps = 'Link do Google Maps é obrigatório';
        }
        if (formData.estrategia_depoimentos === 'texto' && !formData.depoimentos_texto) {
          newErrors.depoimentos_texto = 'Cole pelo menos 2 depoimentos';
        }
        break;

      case 7: // Revisão Final - Sem validações necessárias
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
    // Validar última seção
    if (!validateCurrentSection()) {
      alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Enviando briefing para o Supabase...');
      console.log('📋 Dados do formulário:', formData);
      console.log('📁 Arquivos:', uploadedFiles);

      // Preparar dados para salvar
      const briefingCompleto = {
        ...formData,
        // Incluir arquivos no briefing_data
        arquivos: uploadedFiles,
      };

      // Criar lead no Supabase
      const lead = await createLead({
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        briefing_data: briefingCompleto,
      });

      console.log('✅ Lead criado com sucesso:', lead);

      // Redirecionar para página de obrigado
      alert('Briefing enviado com sucesso! 🎉\n\nAgora vamos produzir seu site. Em até 7 dias você receberá o link para aprovação.');
      navigate('/obrigado');

    } catch (error: any) {
      console.error('❌ Erro ao enviar briefing:', error);

      // Mensagem de erro mais específica
      let errorMessage = 'Erro ao enviar o briefing. Por favor, tente novamente.';

      if (error.message?.includes('duplicate')) {
        errorMessage = 'Este e-mail já está cadastrado. Use outro e-mail ou entre em contato conosco.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }

      alert(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch(currentSection) {
      case 0: // PÁGINA 1: Informações Essenciais
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[0].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[0].subtitle}</p>
            </div>

            <div className="space-y-6">
              {/* Nome do Consultório */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Qual o nome do seu consultório ou clínica? *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Clínica Odontológica Dr. Carlos Silva"
                  value={formData.nome_consultorio || ''}
                  onChange={(e) => updateFormData('nome_consultorio', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.nome_consultorio ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                />
                {errors.nome_consultorio && <p className="text-red-500 text-sm mt-2">{errors.nome_consultorio}</p>}
              </div>

              {/* Seu Nome */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Como você se chama? *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Carlos Eduardo Silva"
                  value={formData.nome || ''}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.nome ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                />
                {errors.nome && <p className="text-red-500 text-sm mt-2">{errors.nome}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Nome completo para nossa comunicação durante o projeto</p>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.whatsapp ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-2">{errors.whatsapp}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Este número aparecerá no site para os pacientes agendarem consultas</p>
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Seu melhor e-mail *
                </label>
                <input
                  type="email"
                  placeholder="contato@clinica.com.br"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.email ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Enviaremos o site pronto neste e-mail em até 24 horas</p>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
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
                    <label key={opcao.value} className="flex items-start p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                      <input
                        type="radio"
                        name="slogan_opcao"
                        value={opcao.value}
                        checked={formData.slogan_opcao === opcao.value}
                        onChange={(e) => updateFormData('slogan_opcao', e.target.value)}
                        className="w-4 h-4 text-medical-600 mt-1"
                      />
                      <div className="ml-3">
                        <div className="text-gray-700">{opcao.label}</div>
                        {opcao.desc && <div className="text-xs text-medical-600/60 mt-1">{opcao.desc}</div>}
                      </div>
                    </label>
                  ))}
                  <label className="flex items-start p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="slogan_opcao"
                      value="custom"
                      checked={formData.slogan_opcao === 'custom'}
                      onChange={(e) => updateFormData('slogan_opcao', e.target.value)}
                      className="w-4 h-4 text-medical-600 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-gray-700">Tenho meu próprio slogan:</div>
                      {formData.slogan_opcao === 'custom' && (
                        <input
                          type="text"
                          placeholder="Digite seu slogan personalizado"
                          value={formData.slogan_custom || ''}
                          onChange={(e) => updateFormData('slogan_custom', e.target.value)}
                          className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-400"
                        />
                      )}
                    </div>
                  </label>
                  <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="slogan_opcao"
                      value="confiamos"
                      checked={formData.slogan_opcao === 'confiamos'}
                      onChange={(e) => updateFormData('slogan_opcao', e.target.value)}
                      className="w-4 h-4 text-medical-600"
                    />
                    <span className="ml-3 text-gray-700">Escolham vocês com base no meu perfil</span>
                  </label>
                </div>
                {errors.slogan_opcao && <p className="text-red-500 text-sm mt-2">{errors.slogan_opcao}</p>}
                {errors.slogan_custom && <p className="text-red-500 text-sm mt-2">{errors.slogan_custom}</p>}
              </div>

              {/* Ano de Início */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Desde que ano você atua na odontologia? *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 2010"
                  min="1970"
                  max="2025"
                  value={formData.ano_inicio || ''}
                  onChange={(e) => updateFormData('ano_inicio', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.ano_inicio ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                />
                {errors.ano_inicio && <p className="text-red-500 text-sm mt-2">{errors.ano_inicio}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Usaremos para calcular os anos de experiência e mostrar no site</p>
              </div>

              {/* Número de Pacientes (Opcional) */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
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
                    <label key={opcao.value} className="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                      <input
                        type="radio"
                        name="num_pacientes"
                        value={opcao.value}
                        checked={formData.num_pacientes === opcao.value}
                        onChange={(e) => updateFormData('num_pacientes', e.target.value)}
                        className="w-4 h-4 text-medical-600"
                      />
                      <span className="ml-3 text-gray-700">{opcao.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-medical-600/60 text-xs mt-2">Não precisa ser exato. Usaremos para mostrar sua experiência no site (ex: '+5.000 pacientes atendidos')</p>
              </div>

              {/* Google Meu Negócio */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Tem Google Meu Negócio?
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="tem_google_negocio"
                      value="sim"
                      checked={formData.tem_google_negocio === 'sim'}
                      onChange={(e) => updateFormData('tem_google_negocio', e.target.value)}
                      className="w-4 h-4 text-medical-600 mt-1"
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
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-400"
                          />
                          <p className="text-xs text-medical-600/60">💡 Como encontrar? Busque sua clínica no Google Maps, clique em "Compartilhar" e copie o link</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-medical-400 hover:bg-neutral-50/50">
                    <input
                      type="radio"
                      name="tem_google_negocio"
                      value="nao"
                      checked={formData.tem_google_negocio === 'nao'}
                      onChange={(e) => updateFormData('tem_google_negocio', e.target.value)}
                      className="w-4 h-4 text-medical-600"
                    />
                    <span className="ml-3 text-gray-700">Não tenho</span>
                  </label>
                </div>
                <p className="text-medical-600/60 text-xs mt-2">Se tiver Google Meu Negócio com avaliações, mostraremos no seu site para aumentar a credibilidade</p>
              </div>
            </div>
          </div>
        );

      case 1: // Profissionais
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[1].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[1].subtitle}</p>
            </div>

            {/* Helper */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                💡 Adicione os dentistas/profissionais que aparecerão na página "Nossa Equipe" do site. Você pode adicionar quantos quiser!
              </p>
            </div>

            {/* Lista de Profissionais */}
            <div className="space-y-6">
              {(formData.profissionais || []).map((profissional: any, index: number) => (
                <div key={index} className="border-2 border-medical-200 rounded-xl p-6 space-y-6 relative">
                  {/* Badge de número */}
                  <div className="absolute -top-3 -left-3 bg-medical-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Botão remover (só se tiver 2+) */}
                  {(formData.profissionais?.length || 1) > 1 && (
                    <button
                      type="button"
                      onClick={() => removerProfissional(index)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition shadow-lg font-bold text-lg"
                      title="Remover profissional"
                    >
                      ×
                    </button>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    Profissional {index + 1}
                  </h3>

                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dr. Carlos Eduardo Silva"
                      value={profissional.nome || ''}
                      onChange={(e) => updateProfissional(index, 'nome', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                        errors[`profissional_${index}_nome`] ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    {errors[`profissional_${index}_nome`] && (
                      <p className="text-red-500 text-sm mt-2">{errors[`profissional_${index}_nome`]}</p>
                    )}
                  </div>

                  {/* Registro CRO */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Número do registro (CRO) *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: CRO-SP 12345"
                      value={profissional.registro || ''}
                      onChange={(e) => updateProfissional(index, 'registro', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                        errors[`profissional_${index}_registro`] ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    {errors[`profissional_${index}_registro`] && (
                      <p className="text-red-500 text-sm mt-2">{errors[`profissional_${index}_registro`]}</p>
                    )}
                  </div>

                  {/* Especialidade */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Especialidade principal
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Implantodontia, Ortodontia, Clínico Geral..."
                      value={profissional.especialidade || ''}
                      onChange={(e) => updateProfissional(index, 'especialidade', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                    />
                  </div>

                  {/* Mini biografia */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Mini biografia (2-3 linhas) *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ex: Graduado pela USP, especialista em Implantodontia com mais de 10 anos de experiência. Apaixonado por devolver sorrisos e autoestima aos pacientes."
                      value={profissional.descricao || ''}
                      onChange={(e) => updateProfissional(index, 'descricao', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all resize-none ${
                        errors[`profissional_${index}_descricao`] ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    {errors[`profissional_${index}_descricao`] && (
                      <p className="text-red-500 text-sm mt-2">{errors[`profissional_${index}_descricao`]}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Aparecerá na página "Nossa Equipe" abaixo da foto
                    </p>
                  </div>

                  {/* Foto */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Foto profissional
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfissionalFoto(index, e)}
                      className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-medical-50 file:text-medical-700 hover:file:bg-medical-100"
                    />
                    {profissional.foto && (
                      <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                        <span>✓ {profissional.foto.name}</span>
                        <button
                          type="button"
                          onClick={() => updateProfissional(index, 'foto', null)}
                          className="text-red-500 hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Preferencialmente foto com fundo branco ou neutro. Máx. 5MB.
                    </p>
                  </div>

                  {/* Redes Sociais */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Redes sociais (opcional)
                    </label>

                    {(profissional.redesSociais || []).map((rede: any, redeIndex: number) => (
                      <div key={redeIndex} className="flex gap-3 mb-3">
                        <select
                          value={rede.tipo || 'instagram'}
                          onChange={(e) => updateRedeSocial(index, redeIndex, 'tipo', e.target.value)}
                          className="px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-400"
                        >
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                        <input
                          type="url"
                          placeholder="https://instagram.com/..."
                          value={rede.url || ''}
                          onChange={(e) => updateRedeSocial(index, redeIndex, 'url', e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-400"
                        />
                        <button
                          type="button"
                          onClick={() => removerRedeSocial(index, redeIndex)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => adicionarRedeSocial(index)}
                      className="text-sm text-medical-600 hover:text-medical-700 font-medium"
                    >
                      + Adicionar rede social
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Adicionar Profissional */}
            <button
              type="button"
              onClick={adicionarProfissional}
              className="w-full py-4 border-2 border-dashed border-medical-400 rounded-xl text-medical-600 font-semibold hover:bg-medical-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-2xl">+</span>
              Adicionar outro profissional
            </button>
          </div>
        );

      case 2: // PÁGINA 3: Serviços/Tratamentos + Tecnologia/Diferenciais
        return (
          <div className="space-y-8">
            {/* Serviços Oferecidos */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Quais serviços/tratamentos você oferece? *
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
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
                  <label key={servico.value} className="flex items-center p-3 rounded-lg border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
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
                      className="mr-3 accent-medical-600 w-5 h-5"
                      disabled={!formData.servicos?.includes(servico.value) && (formData.servicos?.length || 0) >= 6}
                    />
                    <span className="text-neutral-900">
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
                  'text-medical-600'
                }`}>
                  {formData.servicos?.length || 0} de 3-6 serviços selecionados
                </span>
              </div>

              {errors.servicos && <p className="text-red-500 text-sm mt-2">{errors.servicos}</p>}

              {/* Campo "Outro" condicional */}
              {formData.servicos?.includes('outro') && (
                <div className="mt-4">
                  <label className="block text-neutral-900 font-semibold mb-2">
                    Qual outro serviço? *
                  </label>
                  <input
                    type="text"
                    value={formData.servico_outro || ''}
                    onChange={(e) => setFormData({...formData, servico_outro: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.servico_outro ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                    } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                    placeholder="Digite o serviço"
                  />
                  {errors.servico_outro && <p className="text-red-500 text-sm mt-1">{errors.servico_outro}</p>}
                </div>
              )}
            </div>

            {/* Aceita Convênios */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Aceita convênios? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="aceita_convenios"
                    value="sim"
                    checked={formData.aceita_convenios === 'sim'}
                    onChange={(e) => setFormData({...formData, aceita_convenios: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">✅ Sim, aceito convênios</div>
                    <div className="text-sm text-medical-600/70">(Unimed, Bradesco Dental, SulAmérica, etc.)</div>
                  </div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="aceita_convenios"
                    value="nao"
                    checked={formData.aceita_convenios === 'nao'}
                    onChange={(e) => setFormData({...formData, aceita_convenios: e.target.value, lista_convenios: ''})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">❌ Não, apenas particular</div>
                  </div>
                </label>
              </div>
              {errors.aceita_convenios && <p className="text-red-500 text-sm mt-2">{errors.aceita_convenios}</p>}
            </div>

            {/* Lista de Convênios (condicional) */}
            {formData.aceita_convenios === 'sim' && (
              <div>
                <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                  Quais convênios você aceita? *
                </label>
                <p className="text-sm text-medical-600/70 mb-4">
                  Selecione todos os convênios que você aceita:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'odontoprev', label: 'OdontoPrev (líder do mercado)', icon: '👑' },
                    { value: 'bradesco', label: 'Bradesco Dental', icon: '🏦' },
                    { value: 'amil', label: 'Amil Dental', icon: '🩺' },
                    { value: 'sulamerica', label: 'SulAmérica Odonto', icon: '💼' },
                    { value: 'unimed', label: 'Unimed Odonto', icon: '🏥' },
                    { value: 'porto_seguro', label: 'Porto Seguro Dental', icon: '🛡️' },
                    { value: 'metlife', label: 'MetLife Dental', icon: '💳' },
                    { value: 'interodonto', label: 'Interodonto', icon: '🦷' },
                    { value: 'hapvida', label: 'Hapvida Odonto', icon: '💚' },
                    { value: 'notredame', label: 'NotreDame Intermédica', icon: '⚕️' },
                    { value: 'dental_uni', label: 'Dental Uni', icon: '🏢' },
                    { value: 'golden_cross', label: 'Golden Cross', icon: '✨' },
                    { value: 'sompo', label: 'Sompo Dental', icon: '🔷' },
                    { value: 'caixa_seguradora', label: 'Caixa Seguradora', icon: '🏛️' },
                    { value: 'outro_convenio', label: 'Outro', icon: '➕' }
                  ].map((convenio) => (
                    <label key={convenio.value} className="flex items-center p-3 rounded-lg border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                      <input
                        type="checkbox"
                        checked={formData.lista_convenios_array?.includes(convenio.value) || false}
                        onChange={(e) => {
                          const current = formData.lista_convenios_array || [];
                          if (e.target.checked) {
                            setFormData({...formData, lista_convenios_array: [...current, convenio.value]});
                          } else {
                            setFormData({...formData, lista_convenios_array: current.filter(c => c !== convenio.value)});
                            // Se desmarcar "outro", limpar o campo
                            if (convenio.value === 'outro_convenio') {
                              setFormData({...formData, lista_convenios_array: current.filter(c => c !== convenio.value), outro_convenio: ''});
                            }
                          }
                        }}
                        className="mr-3 accent-medical-600 w-5 h-5"
                      />
                      <span className="text-neutral-900">
                        <span className="mr-2">{convenio.icon}</span>
                        {convenio.label}
                      </span>
                    </label>
                  ))}
                </div>

                {errors.lista_convenios && <p className="text-red-500 text-sm mt-3">{errors.lista_convenios}</p>}

                {/* Campo "Outro convênio" condicional */}
                {formData.lista_convenios_array?.includes('outro_convenio') && (
                  <div className="mt-4">
                    <label className="block text-neutral-900 font-semibold mb-2">
                      Qual outro convênio? *
                    </label>
                    <input
                      type="text"
                      value={formData.outro_convenio || ''}
                      onChange={(e) => setFormData({...formData, outro_convenio: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        errors.outro_convenio ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                      } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                      placeholder="Digite o nome do convênio"
                    />
                    {errors.outro_convenio && <p className="text-red-500 text-sm mt-1">{errors.outro_convenio}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Atendimento de Emergência */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Tem atendimento de emergência, fora? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="atende_emergencia"
                    value="sim_24h"
                    checked={formData.atende_emergencia === 'sim_24h'}
                    onChange={(e) => setFormData({...formData, atende_emergencia: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">Sim, 24 horas</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="atende_emergencia"
                    value="nao_horario"
                    checked={formData.atende_emergencia === 'nao_horario'}
                    onChange={(e) => setFormData({...formData, atende_emergencia: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">Não, apenas horário comercial</div>
                </label>
              </div>
              {errors.atende_emergencia && <p className="text-red-500 text-sm mt-2">{errors.atende_emergencia}</p>}
            </div>

            {/* Equipamentos/Tecnologia */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Quais equipamentos/tecnologias disponíveis? *
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
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
                  <label key={tech.value} className="flex items-center p-3 rounded-lg border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
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
                      className="mr-3 accent-medical-600 w-5 h-5"
                    />
                    <span className="text-neutral-900">{tech.label}</span>
                  </label>
                ))}
              </div>
              {errors.tecnologias && <p className="text-red-500 text-sm mt-2">{errors.tecnologias}</p>}
            </div>

            {/* Oferece Sessão? */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Oferece sedação consciente? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="oferece_sedacao"
                    value="sim"
                    checked={formData.oferece_sedacao === 'sim'}
                    onChange={(e) => setFormData({...formData, oferece_sedacao: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">Sim, oferecemos sedação consciente</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="oferece_sedacao"
                    value="nao"
                    checked={formData.oferece_sedacao === 'nao'}
                    onChange={(e) => setFormData({...formData, oferece_sedacao: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">Não oferecemos</div>
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
              <label className="block text-neutral-900 font-semibold mb-2">
                CEP *
              </label>
              <input
                type="text"
                value={formData.cep || ''}
                onChange={handleCepChange}
                maxLength={9}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.cep ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                placeholder="00000-000"
              />
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
            </div>

            {/* Rua/Logradouro */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2">
                Rua/Logradouro *
              </label>
              <input
                type="text"
                value={formData.rua || ''}
                onChange={(e) => setFormData({...formData, rua: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.rua ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                placeholder="Rua das Flores"
              />
              {errors.rua && <p className="text-red-500 text-sm mt-1">{errors.rua}</p>}
            </div>

            {/* Número e Bairro (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-neutral-900 font-semibold mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.numero || ''}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.numero ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                  } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                  placeholder="123"
                />
                {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-900 font-semibold mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.bairro || ''}
                  onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.bairro ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                  } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                  placeholder="Centro"
                />
                {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
              </div>
            </div>

            {/* Cidade e UF (2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-neutral-900 font-semibold mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.cidade || ''}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.cidade ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                  } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                  placeholder="São Paulo"
                />
                {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
              </div>

              <div>
                <label className="block text-neutral-900 font-semibold mb-2">
                  UF *
                </label>
                <input
                  type="text"
                  value={formData.estado || ''}
                  onChange={(e) => setFormData({...formData, estado: e.target.value.toUpperCase()})}
                  maxLength={2}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.estado ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                  } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                  placeholder="SP"
                />
                {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
              </div>
            </div>

            {/* Complemento (opcional) */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2">
                Complemento (opcional)
              </label>
              <input
                type="text"
                value={formData.complemento || ''}
                onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                placeholder="Sala 12, 2º andar"
              />
            </div>

            {/* Tem estacionamento? */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Tem estacionamento? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_estacionamento"
                    value="sim_gratuito"
                    checked={formData.tem_estacionamento === 'sim_gratuito'}
                    onChange={(e) => setFormData({...formData, tem_estacionamento: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">✅ Sim, temos estacionamento</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_estacionamento"
                    value="nao_conveniado"
                    checked={formData.tem_estacionamento === 'nao_conveniado'}
                    onChange={(e) => setFormData({...formData, tem_estacionamento: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">❌ Não temos estacionamento</div>
                </label>
              </div>
              {errors.tem_estacionamento && <p className="text-red-500 text-sm mt-2">{errors.tem_estacionamento}</p>}
            </div>

            {/* Horários de Atendimento */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Quais horários de atendimento? *
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
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
                  <label key={horario.value} className="flex items-center p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
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
                      className="mr-3 accent-medical-600 w-5 h-5"
                    />
                    <span className="font-semibold text-neutral-900">{horario.label}</span>
                  </label>
                ))}
              </div>
              {errors.horarios_atendimento && <p className="text-red-500 text-sm mt-2">{errors.horarios_atendimento}</p>}
            </div>

            {/* Quer exibir o mapa do Google Maps? */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Quer exibir o mapa do Google no site? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="exibir_mapa"
                    value="sim"
                    checked={formData.exibir_mapa === 'sim'}
                    onChange={(e) => setFormData({...formData, exibir_mapa: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">✅ Sim, quero mostrar minha localização no mapa</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="exibir_mapa"
                    value="nao"
                    checked={formData.exibir_mapa === 'nao'}
                    onChange={(e) => setFormData({...formData, exibir_mapa: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">❌ Não, apenas o endereço de texto</div>
                </label>
              </div>
              {errors.exibir_mapa && <p className="text-red-500 text-sm mt-2">{errors.exibir_mapa}</p>}
            </div>

            {/* Tem redes sociais ativas? */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Tem redes sociais ativas? *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_redes_sociais"
                    value="sim"
                    checked={formData.tem_redes_sociais === 'sim'}
                    onChange={(e) => setFormData({...formData, tem_redes_sociais: e.target.value})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">✅ Sim, tenho Instagram e/ou Facebook</div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="tem_redes_sociais"
                    value="nao"
                    checked={formData.tem_redes_sociais === 'nao'}
                    onChange={(e) => setFormData({...formData, tem_redes_sociais: e.target.value, instagram: '', facebook: ''})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">❌ Não tenho redes sociais</div>
                </label>
              </div>
              {errors.tem_redes_sociais && <p className="text-red-500 text-sm mt-2">{errors.tem_redes_sociais}</p>}
            </div>

            {/* Links das Redes Sociais (condicional) */}
            {formData.tem_redes_sociais === 'sim' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-neutral-900 font-semibold mb-2">
                    Instagram (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.instagram || ''}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                    placeholder="https://instagram.com/seu_usuario"
                  />
                </div>

                <div>
                  <label className="block text-neutral-900 font-semibold mb-2">
                    Facebook (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.facebook || ''}
                    onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                    placeholder="https://facebook.com/sua_pagina"
                  />
                </div>

                <div>
                  <label className="block text-neutral-900 font-semibold mb-2">
                    LinkedIn (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                    placeholder="https://linkedin.com/in/seu_perfil"
                  />
                </div>

                <div>
                  <label className="block text-neutral-900 font-semibold mb-2">
                    Outras redes (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.outras_redes || ''}
                    onChange={(e) => setFormData({...formData, outras_redes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 4: // PÁGINA 5: Materiais Visuais
        return (
          <div className="space-y-8">
            {/* Aviso Importante */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
              <div className="flex items-start">
                <div className="text-3xl mr-4">ℹ️</div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Imagens e Materiais Visuais
                  </h3>
                  <p className="text-blue-700 mb-3">
                    Esta seção é <strong>opcional</strong>. Se você não tiver todas as imagens agora, não tem problema!
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-yellow-800 text-sm">
                      <strong>⏱️ Atenção quanto ao prazo:</strong> Se você não enviar as imagens agora, nossa equipe entrará
                      em contato para solicitá-las. Porém, <strong>o prazo de entrega de 24h pode não ser cumprido</strong>
                      enquanto aguardamos os materiais. Quanto mais completo você enviar, mais rápido ficará pronto!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo da Clínica */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                📱 Logo da Clínica/Consultório
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Sua logo aparecerá no <strong>cabeçalho do site</strong>, <strong>rodapé</strong> e em outros locais estratégicos.
                Prefira PNG com fundo transparente para melhor resultado.
              </p>
              <div className="border-2 border-dashed border-medical-300 rounded-xl p-6 bg-neutral-50 hover:bg-medical-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleFileUpload('logo', e.target.files)}
                  className="hidden"
                  id="upload_logo"
                />
                <label htmlFor="upload_logo" className="cursor-pointer flex flex-col items-center">
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-neutral-900 font-medium">Clique para fazer upload da logo</p>
                  <p className="text-sm text-medical-600/70 mt-1">(PNG, JPG ou WEBP - máx. 5MB)</p>
                </label>
                {uploadedFiles.logo && uploadedFiles.logo.length > 0 && (
                  <div className="mt-4 text-center text-green-700 font-semibold">
                    ✓ {uploadedFiles.logo[0].name}
                  </div>
                )}
              </div>
              <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>💡 Dica:</strong> A logo deve ter boa qualidade e ser legível em tamanhos pequenos.
                  Formatos ideais: 500x500px ou 1000x300px (depende do formato da sua logo).
                </p>
              </div>
            </div>

            {/* Imagem Hero Desktop */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                🖥️ Imagem Principal do Site (Hero - Desktop)
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Esta é a <strong>primeira imagem que o visitante vê</strong> ao acessar seu site no computador.
                Ela aparece no topo da página inicial e causa a primeira impressão. Escolha uma imagem profissional
                do seu consultório, equipe ou um sorriso bonito.
              </p>
              <div className="border-2 border-dashed border-medical-300 rounded-xl p-6 bg-neutral-50 hover:bg-medical-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleFileUpload('hero_desktop', e.target.files)}
                  className="hidden"
                  id="upload_hero_desktop"
                />
                <label htmlFor="upload_hero_desktop" className="cursor-pointer flex flex-col items-center">
                  <div className="text-5xl mb-3">🖼️</div>
                  <p className="text-neutral-900 font-medium">Clique para fazer upload (Desktop)</p>
                  <p className="text-sm text-medical-600/70 mt-1">(JPG, PNG ou WEBP - máx. 8MB)</p>
                </label>
                {uploadedFiles.hero_desktop && uploadedFiles.hero_desktop.length > 0 && (
                  <div className="mt-4 text-center text-green-700 font-semibold">
                    ✓ {uploadedFiles.hero_desktop[0].name}
                  </div>
                )}
              </div>
              <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>💡 Formato ideal:</strong> 1920x1080px (proporção 16:9) - paisagem (horizontal).
                  Evite imagens muito escuras ou com texto sobreposto.
                </p>
              </div>
            </div>

            {/* Imagem Hero Mobile */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                📱 Imagem Principal do Site (Hero - Mobile)
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Esta é a versão <strong>para celular</strong> da imagem principal. Como as telas de celular são
                verticais, precisamos de uma imagem diferente para garantir boa visualização. Pode ser um recorte
                da imagem desktop ou uma foto diferente.
              </p>
              <div className="border-2 border-dashed border-medical-300 rounded-xl p-6 bg-neutral-50 hover:bg-medical-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleFileUpload('hero_mobile', e.target.files)}
                  className="hidden"
                  id="upload_hero_mobile"
                />
                <label htmlFor="upload_hero_mobile" className="cursor-pointer flex flex-col items-center">
                  <div className="text-5xl mb-3">📱</div>
                  <p className="text-neutral-900 font-medium">Clique para fazer upload (Mobile)</p>
                  <p className="text-sm text-medical-600/70 mt-1">(JPG, PNG ou WEBP - máx. 5MB)</p>
                </label>
                {uploadedFiles.hero_mobile && uploadedFiles.hero_mobile.length > 0 && (
                  <div className="mt-4 text-center text-green-700 font-semibold">
                    ✓ {uploadedFiles.hero_mobile[0].name}
                  </div>
                )}
              </div>
              <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>💡 Formato ideal:</strong> 1080x1920px (proporção 9:16) - retrato (vertical).
                  Ideal focar em rostos ou elementos centrais.
                </p>
              </div>
            </div>

            {/* Fotos da Clínica/Espaço */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                🏥 Fotos da Clínica/Consultório (Galeria)
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Fotos do seu espaço ajudam a gerar <strong>confiança e credibilidade</strong>. Mostram ao paciente
                que você tem um ambiente profissional. Inclua: recepção, consultório, equipamentos modernos,
                sala de espera, etc.
              </p>
              <div className="border-2 border-dashed border-medical-300 rounded-xl p-6 bg-neutral-50 hover:bg-medical-100 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={(e) => handleFileUpload('fotos_espaco', e.target.files)}
                  className="hidden"
                  id="upload_fotos_espaco"
                />
                <label htmlFor="upload_fotos_espaco" className="cursor-pointer flex flex-col items-center">
                  <div className="text-5xl mb-3">📸</div>
                  <p className="text-neutral-900 font-medium">Clique para fazer upload (múltiplas fotos)</p>
                  <p className="text-sm text-medical-600/70 mt-1">(JPG, PNG ou WEBP - máx. 5MB cada)</p>
                </label>
                {uploadedFiles.fotos_espaco && uploadedFiles.fotos_espaco.length > 0 && (
                  <div className="mt-4 text-center text-green-700 font-semibold">
                    ✓ {uploadedFiles.fotos_espaco.length} foto(s) selecionada(s)
                  </div>
                )}
              </div>
              <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>💡 Dica:</strong> Ideal ter entre 4-8 fotos do espaço. Fotos bem iluminadas e organizadas
                  transmitem profissionalismo.
                </p>
              </div>
            </div>

            {/* Cor Preferida */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                🎨 Cor Preferida para o Site
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Escolha a cor principal do seu site. Ela será usada em botões, destaques e elementos importantes.
                Geralmente é a cor da sua marca/logo.
              </p>
              <input
                type="color"
                value={formData.cor_preferida || '#8B5CF6'}
                onChange={(e) => setFormData({...formData, cor_preferida: e.target.value})}
                className="w-full h-16 rounded-xl border-2 border-medical-300 cursor-pointer"
              />
              <p className="text-sm text-gray-600 mt-2">
                Cor selecionada: <strong>{formData.cor_preferida || '#8B5CF6'}</strong>
              </p>
            </div>

            {/* Estilo do Site */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                💅 Estilo Visual do Site *
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
                Que estilo você prefere para o seu site?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'moderno', label: 'Moderno e Minimalista', desc: 'Design limpo, espaçado, com muitos espaços em branco' },
                  { value: 'profissional', label: 'Profissional e Corporativo', desc: 'Sério, confiável, cores sóbrias' },
                  { value: 'acolhedor', label: 'Acolhedor e Humano', desc: 'Cores suaves, imagens de pessoas, tom próximo' },
                  { value: 'inovador', label: 'Inovador e Tecnológico', desc: 'Destaque para tecnologia, equipamentos de ponta' }
                ].map((estilo) => (
                  <label
                    key={estilo.value}
                    className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.estilo_site === estilo.value
                        ? 'border-medical-500 bg-neutral-50'
                        : 'border-medical-200 hover:border-medical-400 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="estilo_site"
                      value={estilo.value}
                      checked={formData.estilo_site === estilo.value}
                      onChange={(e) => setFormData({...formData, estilo_site: e.target.value})}
                      className="mr-3 mt-1 accent-medical-600"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900">{estilo.label}</div>
                      <div className="text-sm text-medical-600/70 mt-1">{estilo.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.estilo_site && <p className="text-red-500 text-sm mt-2">{errors.estilo_site}</p>}
            </div>

            {/* Sites de Referência */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                🔗 Sites de Referência (Opcional)
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Tem algum site odontológico que você gosta? Cole os links aqui para nos inspirarmos no design!
              </p>
              <textarea
                value={formData.sites_referencia || ''}
                onChange={(e) => setFormData({...formData, sites_referencia: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                placeholder="Ex:&#10;https://exemplodentista1.com&#10;https://exemplodentista2.com&#10;&#10;Você pode colar vários links, um por linha."
              />
            </div>

            {/* Prazo Desejado */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                ⏱️ Prazo de Entrega Desejado
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
                Quando você precisa do site pronto?
              </p>
              <div className="space-y-3">
                {[
                  { value: 'urgente', label: '⚡ 24 horas (Urgente)', desc: 'Taxa adicional de R$ 200' },
                  { value: 'rapido', label: '🚀 3-5 dias', desc: 'Entrega rápida' },
                  { value: 'normal', label: '📅 1-2 semanas', desc: 'Prazo padrão' },
                  { value: 'flexivel', label: '🕐 Flexível (mais de 2 semanas)', desc: 'Sem pressa' }
                ].map((prazo) => (
                  <label
                    key={prazo.value}
                    className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.prazo_desejado === prazo.value
                        ? 'border-medical-500 bg-neutral-50'
                        : 'border-medical-200 hover:border-medical-400 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="prazo_desejado"
                      value={prazo.value}
                      checked={formData.prazo_desejado === prazo.value}
                      onChange={(e) => setFormData({...formData, prazo_desejado: e.target.value})}
                      className="mr-3 mt-1 accent-medical-600"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900">{prazo.label}</div>
                      <div className="text-sm text-medical-600/70">{prazo.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // PÁGINA 6: Rastreamento e Integrações (Opcional)
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[5].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[5].subtitle}</p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="text-3xl">ℹ️</div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Esta seção é opcional</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    Se você não tiver essas informações agora, não tem problema! Você pode:
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1 ml-4">
                    <li>• Deixar em branco e enviar depois por email</li>
                    <li>• Solicitar essas informações ao seu gestor de tráfego</li>
                    <li>• Podemos adicionar mais tarde quando você tiver</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Google Analytics 4 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Google Analytics 4 (GA4)
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={formData.ga4_id || ''}
                  onChange={(e) => updateFormData('ga4_id', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                />
                <p className="text-medical-600/60 text-xs mt-2">
                  📊 <strong>O que é:</strong> Ferramenta do Google para acompanhar visitas, origem dos visitantes e comportamento no site.<br/>
                  💡 <strong>Como obter:</strong> Solicite ao seu gestor de tráfego ou crie gratuitamente em analytics.google.com
                </p>
              </div>

              {/* Meta Pixel */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Meta Pixel (Facebook/Instagram)
                </label>
                <input
                  type="text"
                  placeholder="123456789012345"
                  value={formData.meta_pixel_id || ''}
                  onChange={(e) => updateFormData('meta_pixel_id', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                />
                <p className="text-medical-600/60 text-xs mt-2">
                  🎯 <strong>O que é:</strong> Código do Facebook para rastrear conversões de anúncios no Facebook/Instagram.<br/>
                  💡 <strong>Como obter:</strong> Solicite ao seu gestor de tráfego ou crie em business.facebook.com
                </p>
              </div>

              {/* Google Tag Manager */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Google Tag Manager (GTM)
                </label>
                <input
                  type="text"
                  placeholder="GTM-XXXXXXX"
                  value={formData.gtm_id || ''}
                  onChange={(e) => updateFormData('gtm_id', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                />
                <p className="text-medical-600/60 text-xs mt-2">
                  🔧 <strong>O que é:</strong> Container para gerenciar múltiplas tags de rastreamento em um só lugar.<br/>
                  💡 <strong>Como obter:</strong> Solicite ao seu gestor de tráfego ou crie em tagmanager.google.com
                </p>
              </div>

              {/* Google Ads Conversion */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Google Ads - Rastreamento de Conversão
                </label>
                <input
                  type="text"
                  placeholder="AW-XXXXXXXXX/XXXXXXX"
                  value={formData.google_ads_conversion || ''}
                  onChange={(e) => updateFormData('google_ads_conversion', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                />
                <p className="text-medical-600/60 text-xs mt-2">
                  💰 <strong>O que é:</strong> Código para rastrear conversões (agendamentos, contatos) vindas de anúncios do Google.<br/>
                  💡 <strong>Como obter:</strong> Solicite ao seu gestor de tráfego ou acesse ads.google.com
                </p>
              </div>

              {/* Outras Tags/Scripts */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Outras Tags ou Scripts (Opcional)
                </label>
                <textarea
                  placeholder="Cole aqui qualquer outro código de rastreamento que precise ser instalado no site..."
                  value={formData.outras_tags || ''}
                  onChange={(e) => updateFormData('outras_tags', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all font-mono text-sm"
                />
                <p className="text-medical-600/60 text-xs mt-2">
                  📝 <strong>Exemplos:</strong> HotJar, RD Station, outros pixels de remarketing, etc.<br/>
                  ⚠️ Cole apenas códigos fornecidos por plataformas confiáveis
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-3xl">✅</div>
                <div>
                  <h3 className="font-bold text-green-900 mb-2">Instalação incluída no serviço</h3>
                  <p className="text-green-800 text-sm">
                    Todas as tags fornecidas serão instaladas corretamente no seu site durante a criação. Não se preocupe com aspectos técnicos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // PÁGINA 7: Depoimentos/Cases + Link do Google Maps
        return (
          <div className="space-y-8">
            {/* Como você quer mostrar depoimentos no site? */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                Como você quer mostrar depoimentos no site? *
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
                Depoimentos são essenciais para gerar confiança. Escolha a melhor opção para você:
              </p>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="estrategia_depoimentos"
                    value="google"
                    checked={formData.estrategia_depoimentos === 'google'}
                    onChange={(e) => setFormData({
                      ...formData,
                      estrategia_depoimentos: e.target.value,
                      depoimentos_texto: '' // Limpar campo de texto se mudar
                    })}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">⭐ Usar minhas avaliações do Google (automático)</div>
                    <div className="text-sm text-medical-600/70 mt-1">Exibiremos suas avaliações do Google Meu Negócio no site</div>
                  </div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="estrategia_depoimentos"
                    value="texto"
                    checked={formData.estrategia_depoimentos === 'texto'}
                    onChange={(e) => setFormData({
                      ...formData,
                      estrategia_depoimentos: e.target.value,
                      link_google_maps: '' // Limpar link se mudar
                    })}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">💬 Vou enviar depoimentos que já tenho</div>
                    <div className="text-sm text-medical-600/70 mt-1">Depoimentos salvos de WhatsApp, mensagens ou outros canais</div>
                  </div>
                </label>

                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 transition-all cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="estrategia_depoimentos"
                    value="nao"
                    checked={formData.estrategia_depoimentos === 'nao'}
                    onChange={(e) => setFormData({
                      ...formData,
                      estrategia_depoimentos: e.target.value,
                      link_google_maps: '',
                      depoimentos_texto: ''
                    })}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900">⏭️ Não quero seção de depoimentos por enquanto</div>
                    <div className="text-sm text-medical-600/70 mt-1">Podemos adicionar depois se necessário</div>
                  </div>
                </label>
              </div>
              {errors.estrategia_depoimentos && <p className="text-red-500 text-sm mt-2">{errors.estrategia_depoimentos}</p>}
            </div>

            {/* Link do Google Maps (se escolheu Google) */}
            {formData.estrategia_depoimentos === 'google' && (
              <div>
                <label className="block text-neutral-900 font-semibold mb-2">
                  Link do Google Maps *
                </label>
                <p className="text-sm text-medical-600/70 mb-3">
                  Cole o link do seu Google Meu Negócio. Para encontrar: acesse google.com/maps, pesquise seu consultório e copie o link da barra de endereços.
                </p>
                <input
                  type="url"
                  value={formData.link_google_maps || ''}
                  onChange={(e) => setFormData({...formData, link_google_maps: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.link_google_maps ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                  } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                  placeholder="https://maps.google.com/..."
                />
                {errors.link_google_maps && <p className="text-red-500 text-sm mt-1">{errors.link_google_maps}</p>}

                <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-medical-200">
                  <p className="text-sm text-medical-700">
                    ℹ️ <strong>Dica:</strong> Suas avaliações do Google aparecerão automaticamente no site com estrelas e comentários dos pacientes.
                  </p>
                </div>
              </div>
            )}

            {/* Depoimentos em Texto (se escolheu texto) */}
            {formData.estrategia_depoimentos === 'texto' && (
              <div>
                <label className="block text-neutral-900 font-semibold mb-2">
                  Cole aqui 2-3 depoimentos *
                </label>
                <p className="text-sm text-medical-600/70 mb-3">
                  Cole depoimentos reais de pacientes. Um por linha. Inclua o nome do paciente se possível.
                </p>
                <textarea
                  value={formData.depoimentos_texto || ''}
                  onChange={(e) => setFormData({...formData, depoimentos_texto: e.target.value})}
                  rows={8}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.depoimentos_texto ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                  } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                  placeholder={`Exemplo:\n\n"Excelente profissional! Fiz um implante e o resultado ficou perfeito. Recomendo muito!" - Maria Silva\n\n"Melhor dentista da região. Atendimento impecável e preço justo." - João Santos\n\n"Meu filho tinha medo de dentista, mas adorou a consulta. Super recomendo!" - Ana Paula`}
                />
                {errors.depoimentos_texto && <p className="text-red-500 text-sm mt-1">{errors.depoimentos_texto}</p>}

                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Dica:</strong> Depoimentos específicos convertem mais! Exemplo: "Fiz clareamento e ficou incrível" é melhor que "Ótimo dentista".
                  </p>
                </div>
              </div>
            )}

            {/* Observações Finais */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-2 text-lg">
                Observações finais ou algo que não perguntamos?
              </label>
              <p className="text-sm text-medical-600/70 mb-3">
                Use este espaço para nos contar qualquer informação adicional que você acha importante para o site.
              </p>
              <textarea
                value={formData.observacoes_finais || ''}
                onChange={(e) => setFormData({...formData, observacoes_finais: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                placeholder="Ex: Tenho um diferencial específico, atendo um público especial, quero destacar algo em especial..."
              />
            </div>

            {/* Mensagem de Conclusão */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-medical-300">
              <div className="flex items-start">
                <div className="text-3xl mr-4">🎉</div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    Quase lá! Revise suas informações
                  </h3>
                  <p className="text-medical-700">
                    Você está na última etapa. Revise todas as informações preenchidas antes de enviar.
                    Use o botão "Anterior" para voltar e corrigir algo se necessário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // PÁGINA 8: Revisão Final
        return (
          <ReviewStep
            formData={formData}
            uploadedFiles={uploadedFiles}
            onEdit={(sectionIndex) => {
              setCurrentSection(sectionIndex);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );

      default:
        return <div className="text-center text-medical-600">Página em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNew />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Briefing Odonto
            </h1>
            <p className="text-body-lg text-neutral-600">
              Formulário Completo para Desenvolvimento do Site
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-body-sm font-semibold text-neutral-900">Progresso</span>
              <span className="text-body-sm font-semibold text-medical-600">{Math.round(progressPercentage)}% completo</span>
            </div>
            <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-medical-500 to-medical-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-neutral-600 text-body-sm font-medium">
                {currentSection + 1} de {sections.length} - {sections[currentSection].title}
              </span>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            {renderSection()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-medical-500 hover:bg-medical-600 text-white"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-mint-600 hover:bg-mint-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Enviar Briefing
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <FooterNew />
    </div>
  );
};

export default BriefingOdonto;
