import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, X, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage, getPayloadSize, formatFileSize } from '@/utils/imageCompression';
import { createLead, createPartialLead, updateLeadToComplete } from '@/lib/supabase';
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
    { id: 'hero-banner', title: 'Hero / Banner Principal', subtitle: 'Vamos criar o banner principal do seu site', required: true },
    { id: 'sobre-clinica', title: 'Sobre a Clínica', subtitle: 'Apresente sua clínica', required: true },
    { id: 'profissionais', title: 'Equipe', subtitle: 'Apresente os profissionais', required: true },
    { id: 'servicos-diferenciais', title: 'Serviços e Diferenciais', subtitle: 'O que você oferece e o que te torna único', required: true },
    { id: 'identidade-visual', title: 'Identidade Visual', subtitle: 'Referências, logo e estilo que você quer para o site', required: true },
    { id: 'localizacao-contato', title: 'Depoimentos, Localização e Contato', subtitle: 'Depoimentos, onde você está e como te encontrar', required: true },
    { id: 'rastreamento-integracoes', title: 'Rastreamento e Integrações', subtitle: 'Configure pixels e tags de analytics (opcional)', required: false },
    { id: 'revisao-final', title: 'Revisão Final', subtitle: 'Confira tudo antes de enviar', required: false }
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
        break;

      case 1: // Hero / Banner Principal
        // Validações opcionais
        break;

      case 2: // Sobre a Clínica
        // Validações opcionais
        break;

      case 3: // Equipe
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

      case 4: // Serviços e Diferenciais
        if (!formData.servicos || formData.servicos.length === 0) {
          newErrors.servicos = 'Selecione pelo menos 1 serviço';
        }
        break;

      case 5: // Galeria e Cores - Opcional
        // Sem validações obrigatórias - cliente pode enviar depois
        break;

      case 6: // Depoimentos, Localização e Contato
        // Validações de Localização
        if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
        if (!formData.rua) newErrors.rua = 'Rua é obrigatória';
        if (!formData.numero) newErrors.numero = 'Número é obrigatório';
        if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
        if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
        if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
        if (!formData.tem_estacionamento) newErrors.tem_estacionamento = 'Informe sobre estacionamento';
        if (!formData.horario_padrao) newErrors.horario_padrao = 'Selecione um horário de atendimento';
        if (!formData.exibir_mapa) newErrors.exibir_mapa = 'Informe se quer exibir o mapa';
        // Validação condicional do link do mapa
        if (formData.exibir_mapa === 'sim' && !formData.link_mapa_embed) {
          newErrors.link_mapa_embed = 'Link do Google Maps é obrigatório quando você escolhe exibir o mapa';
        }
        // Depoimentos do Google é opcional
        break;

      case 7: // Rastreamento e Integrações - Opcional
        // Sem validações obrigatórias - tudo é opcional
        break;

      case 8: // Revisão Final - Sem validações necessárias
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    // VALIDAÇÃO DESABILITADA TEMPORARIAMENTE PARA DESENVOLVIMENTO
    // if (validateCurrentSection()) {

    // Captura automática de lead após página 1 (seção 0)
    if (currentSection === 0) {
      // Verificar se já existe um lead parcial salvo
      const existingLeadId = localStorage.getItem('partial_lead_id');

      if (!existingLeadId) {
        // Criar lead parcial silenciosamente
        const partialLead = await createPartialLead({
          nome: formData.nome,
          email: formData.email,
          whatsapp: formData.whatsapp,
          nome_consultorio: formData.nome_consultorio,
        });

        if (partialLead) {
          // Salvar leadId no localStorage
          localStorage.setItem('partial_lead_id', partialLead.id);
          console.log('✅ Lead parcial capturado:', partialLead.id);
        }
      }
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // }
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

      // Verificar se existe lead parcial
      const existingLeadId = localStorage.getItem('partial_lead_id');
      let lead;

      if (existingLeadId) {
        // Atualizar lead parcial para completo
        lead = await updateLeadToComplete(existingLeadId, {
          nome: formData.nome,
          email: formData.email,
          whatsapp: formData.whatsapp,
          briefing_data: briefingCompleto,
        });
        console.log('✅ Lead parcial atualizado para completo:', lead);
        // Limpar localStorage
        localStorage.removeItem('partial_lead_id');
      } else {
        // Criar novo lead
        lead = await createLead({
          nome: formData.nome,
          email: formData.email,
          whatsapp: formData.whatsapp,
          briefing_data: briefingCompleto,
        });
        console.log('✅ Lead criado com sucesso:', lead);
      }

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
            </div>
          </div>
        );

      case 1: // PÁGINA 2: Hero / Banner Principal
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[1].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[1].subtitle}</p>
            </div>

            <div className="space-y-8">
              {/* Título Principal */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Título Principal do Banner *
                </label>
                <select
                  value={formData.hero_titulo_tipo || ''}
                  onChange={(e) => {
                    updateFormData('hero_titulo_tipo', e.target.value);
                    if (e.target.value !== 'custom') {
                      updateFormData('hero_titulo', e.target.value);
                    } else {
                      updateFormData('hero_titulo', '');
                    }
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.hero_titulo ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                >
                  <option value="">Escolha uma sugestão ou customize</option>
                  <option value="Cuidando do seu sorriso há anos">Cuidando do seu sorriso há anos</option>
                  <option value="Seu sorriso perfeito começa aqui">Seu sorriso perfeito começa aqui</option>
                  <option value="Transforme seu sorriso com tecnologia de ponta">Transforme seu sorriso com tecnologia de ponta</option>
                  <option value="Odontologia com Excelência">Odontologia com Excelência</option>
                  <option value="Atendimento odontológico humanizado">Atendimento odontológico humanizado</option>
                  <option value="custom">✏️ Personalizar título</option>
                </select>

                {formData.hero_titulo_tipo === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Digite seu título personalizado"
                      value={formData.hero_titulo || ''}
                      onChange={(e) => updateFormData('hero_titulo', e.target.value)}
                      maxLength={60}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                        errors.hero_titulo ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    <p className="text-medical-600/60 text-xs mt-2">{(formData.hero_titulo || '').length}/60 caracteres</p>
                  </div>
                )}

                {errors.hero_titulo && <p className="text-red-500 text-sm mt-2">{errors.hero_titulo}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Este será o primeiro texto que seus pacientes verão no site</p>
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Subtítulo *
                </label>
                <select
                  value={formData.hero_subtitulo_tipo || ''}
                  onChange={(e) => {
                    updateFormData('hero_subtitulo_tipo', e.target.value);
                    if (e.target.value !== 'custom') {
                      updateFormData('hero_subtitulo', e.target.value);
                    } else {
                      updateFormData('hero_subtitulo', '');
                    }
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.hero_subtitulo ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                >
                  <option value="">Escolha uma sugestão ou customize</option>
                  <option value="Atendimento odontológico de excelência com tecnologia e cuidado">Atendimento odontológico de excelência</option>
                  <option value="Transformando sorrisos com experiência e dedicação">Transformando sorrisos com experiência</option>
                  <option value="Sua saúde bucal é nossa prioridade">Sua saúde bucal é nossa prioridade</option>
                  <option value="Tecnologia avançada para o seu sorriso perfeito">Tecnologia avançada para seu sorriso</option>
                  <option value="custom">✏️ Personalizar subtítulo</option>
                </select>

                {formData.hero_subtitulo_tipo === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Digite seu subtítulo personalizado"
                      value={formData.hero_subtitulo || ''}
                      onChange={(e) => updateFormData('hero_subtitulo', e.target.value)}
                      maxLength={120}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                        errors.hero_subtitulo ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    <p className="text-medical-600/60 text-xs mt-2">{(formData.hero_subtitulo || '').length}/120 caracteres</p>
                  </div>
                )}

                {errors.hero_subtitulo && <p className="text-red-500 text-sm mt-2">{errors.hero_subtitulo}</p>}
              </div>

              {/* Botão CTA */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Texto do Botão Principal *
                </label>
                <select
                  value={formData.hero_cta_tipo || ''}
                  onChange={(e) => {
                    updateFormData('hero_cta_tipo', e.target.value);
                    if (e.target.value !== 'custom') {
                      updateFormData('hero_cta_texto', e.target.value);
                    } else {
                      updateFormData('hero_cta_texto', '');
                    }
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.hero_cta_texto ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                >
                  <option value="">Escolha o texto do botão ou customize</option>
                  <option value="Agende sua consulta">Agende sua consulta</option>
                  <option value="Fale conosco no WhatsApp">Fale conosco no WhatsApp</option>
                  <option value="Agendar avaliação gratuita">Agendar avaliação gratuita</option>
                  <option value="Entre em contato">Entre em contato</option>
                  <option value="Quero agendar">Quero agendar</option>
                  <option value="custom">✏️ Personalizar texto</option>
                </select>

                {formData.hero_cta_tipo === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Digite o texto personalizado do botão"
                      value={formData.hero_cta_texto || ''}
                      onChange={(e) => updateFormData('hero_cta_texto', e.target.value)}
                      maxLength={40}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                        errors.hero_cta_texto ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    <p className="text-medical-600/60 text-xs mt-2">{(formData.hero_cta_texto || '').length}/40 caracteres</p>
                  </div>
                )}

                {errors.hero_cta_texto && <p className="text-red-500 text-sm mt-2">{errors.hero_cta_texto}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Este botão levará para seu WhatsApp</p>
              </div>

              {/* Imagem do Banner */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Imagem do Banner (Opcional)
                </label>
                <p className="text-medical-600/60 text-sm mb-3">
                  Envie uma foto que represente sua clínica ou equipe. Tamanho recomendado: 1920x1080px
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('hero_imagem', e.target.files)}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all"
                />
                {uploadedFiles.hero_imagem && uploadedFiles.hero_imagem.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Imagem enviada: {uploadedFiles.hero_imagem[0].name}</span>
                  </div>
                )}
                <p className="text-medical-600/60 text-xs mt-2">
                  Se não enviar agora, usaremos uma imagem da nossa biblioteca
                </p>
              </div>

              {/* Widgets de Números */}
              <div className="border-t-2 border-medical-100 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Widgets de Números (Opcional)</h3>
                <p className="text-medical-600/60 text-sm mb-6">
                  Adicione até 4 métricas para destacar no banner (ex: "15 Anos", "5.000+ Pacientes")
                </p>

                <div className="space-y-4">
                  {/* Widget 1 */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Número</label>
                      <input
                        type="text"
                        placeholder="Ex: 15"
                        value={formData.widget1_numero || ''}
                        onChange={(e) => updateFormData('widget1_numero', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Descrição</label>
                      <select
                        value={formData.widget1_label || ''}
                        onChange={(e) => updateFormData('widget1_label', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      >
                        <option value="">Selecione</option>
                        <option value="Anos de experiência">Anos de experiência</option>
                        <option value="Anos no mercado">Anos no mercado</option>
                        <option value="Anos de tradição">Anos de tradição</option>
                      </select>
                    </div>
                  </div>

                  {/* Widget 2 */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Número</label>
                      <input
                        type="text"
                        placeholder="Ex: 5000+"
                        value={formData.widget2_numero || ''}
                        onChange={(e) => updateFormData('widget2_numero', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Descrição</label>
                      <select
                        value={formData.widget2_label || ''}
                        onChange={(e) => updateFormData('widget2_label', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      >
                        <option value="">Selecione</option>
                        <option value="Pacientes atendidos">Pacientes atendidos</option>
                        <option value="Sorrisos transformados">Sorrisos transformados</option>
                        <option value="Famílias atendidas">Famílias atendidas</option>
                      </select>
                    </div>
                  </div>

                  {/* Widget 3 */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Número (%)</label>
                      <input
                        type="text"
                        placeholder="Ex: 98"
                        value={formData.widget3_numero || ''}
                        onChange={(e) => updateFormData('widget3_numero', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Descrição</label>
                      <select
                        value={formData.widget3_label || ''}
                        onChange={(e) => updateFormData('widget3_label', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      >
                        <option value="">Selecione</option>
                        <option value="Taxa de satisfação">Taxa de satisfação</option>
                        <option value="Pacientes satisfeitos">Pacientes satisfeitos</option>
                        <option value="Aprovação">Aprovação</option>
                      </select>
                    </div>
                  </div>

                  {/* Widget 4 */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Número</label>
                      <input
                        type="text"
                        placeholder="Ex: 500+"
                        value={formData.widget4_numero || ''}
                        onChange={(e) => updateFormData('widget4_numero', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-neutral-700 mb-2">Descrição</label>
                      <select
                        value={formData.widget4_label || ''}
                        onChange={(e) => updateFormData('widget4_label', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                      >
                        <option value="">Selecione</option>
                        <option value="Procedimentos realizados">Procedimentos realizados</option>
                        <option value="Implantes realizados">Implantes realizados</option>
                        <option value="Casos de sucesso">Casos de sucesso</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ocultar_widgets || false}
                      onChange={(e) => updateFormData('ocultar_widgets', e.target.checked)}
                      className="w-4 h-4 text-medical-600 border-medical-300 rounded focus:ring-medical-500"
                    />
                    <span className="text-sm text-neutral-700">Não quero exibir widgets de números</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // PÁGINA 3: Sobre a Clínica
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[2].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[2].subtitle}</p>
            </div>

            <div className="space-y-8">
              {/* Título da Seção */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Título da Seção "Sobre" *
                </label>
                <select
                  value={formData.sobre_titulo_tipo || ''}
                  onChange={(e) => {
                    updateFormData('sobre_titulo_tipo', e.target.value);
                    if (e.target.value !== 'custom') {
                      updateFormData('sobre_titulo', e.target.value);
                    } else {
                      updateFormData('sobre_titulo', '');
                    }
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                    errors.sobre_titulo ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                >
                  <option value="">Escolha um título ou customize</option>
                  <option value="Sobre Nossa Clínica">Sobre Nossa Clínica</option>
                  <option value="Quem Somos">Quem Somos</option>
                  <option value="Nossa História">Nossa História</option>
                  <option value="Conheça Nossa Clínica">Conheça Nossa Clínica</option>
                  <option value="Sua Satisfação é Nossa Prioridade">Sua Satisfação é Nossa Prioridade</option>
                  <option value="custom">✏️ Personalizar título</option>
                </select>

                {formData.sobre_titulo_tipo === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Digite o título personalizado da seção"
                      value={formData.sobre_titulo || ''}
                      onChange={(e) => updateFormData('sobre_titulo', e.target.value)}
                      maxLength={60}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                        errors.sobre_titulo ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                      }`}
                    />
                    <p className="text-medical-600/60 text-xs mt-2">{(formData.sobre_titulo || '').length}/60 caracteres</p>
                  </div>
                )}

                {errors.sobre_titulo && <p className="text-red-500 text-sm mt-2">{errors.sobre_titulo}</p>}
                <p className="text-medical-600/60 text-xs mt-2">Este será o título da seção "Sobre" no seu site</p>
              </div>

              {/* Texto Institucional */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Texto Institucional *
                </label>
                <p className="text-medical-600/60 text-sm mb-3">
                  Conte a história da sua clínica, sua missão, valores e o que torna seu atendimento especial:
                </p>
                <ul className="text-medical-600/60 text-xs mb-3 space-y-1 list-disc list-inside">
                  <li>Como e quando a clínica foi fundada</li>
                  <li>Missão e valores da clínica</li>
                  <li>Filosofia de atendimento</li>
                  <li>Diferenciais e compromisso com os pacientes</li>
                </ul>
                <textarea
                  value={formData.sobre_texto || ''}
                  onChange={(e) => updateFormData('sobre_texto', e.target.value)}
                  placeholder="Ex: Na Clínica Sorriso Perfeito, acreditamos que cada sorriso conta uma história única. Fundada em 2010, nossa missão é proporcionar um atendimento odontológico de excelência, combinando tecnologia de ponta com cuidado humanizado..."
                  rows={10}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all resize-y ${
                    errors.sobre_texto ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                  }`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.sobre_texto && <p className="text-red-500 text-sm">{errors.sobre_texto}</p>}
                  <p className={`text-xs ml-auto ${
                    (formData.sobre_texto || '').length < 100 ? 'text-red-500' :
                    (formData.sobre_texto || '').length < 300 ? 'text-orange-500' :
                    'text-green-600'
                  }`}>
                    {(formData.sobre_texto || '').length} caracteres
                    {(formData.sobre_texto || '').length < 300 && ' (recomendado: 300-800)'}
                  </p>
                </div>
              </div>

              {/* Fotos da Clínica */}
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Fotos da Clínica (Opcional)
                </label>
                <p className="text-medical-600/60 text-sm mb-3">
                  Envie de 1 a 4 fotos da sua clínica (fachada, recepção, consultórios, etc.)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload('sobre_fotos', e.target.files)}
                  className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all"
                />
                {uploadedFiles.sobre_fotos && uploadedFiles.sobre_fotos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.sobre_fotos.map((file: File, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Foto {idx + 1}: {file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-medical-600/60 text-xs mt-2">
                  💡 Recomendado: fotos profissionais, bem iluminadas, em alta resolução (máx. 5MB cada)
                </p>
              </div>

              {/* Redes Sociais */}
              <div className="border-t-2 border-medical-100 pt-6 mt-6">
                <label className="block text-sm font-semibold text-neutral-900 mb-3">
                  Redes Sociais (Opcional)
                </label>
                <p className="text-medical-600/60 text-sm mb-4">
                  Adicione os links das redes sociais da sua clínica para exibir no site
                </p>

                <div className="space-y-4">
                  {(formData.redes_sociais || []).map((rede: any, index: number) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <select
                          value={rede.tipo || ''}
                          onChange={(e) => {
                            const novasRedes = [...(formData.redes_sociais || [])];
                            novasRedes[index] = { ...novasRedes[index], tipo: e.target.value };
                            updateFormData('redes_sociais', novasRedes);
                          }}
                          className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                        >
                          <option value="">Selecione a rede</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="tiktok">TikTok</option>
                          <option value="youtube">YouTube</option>
                          <option value="kwai">Kwai</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter/X</option>
                          <option value="whatsapp">WhatsApp Business</option>
                          <option value="telegram">Telegram</option>
                          <option value="pinterest">Pinterest</option>
                        </select>
                      </div>
                      <div className="flex-[2]">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={rede.url || ''}
                          onChange={(e) => {
                            const novasRedes = [...(formData.redes_sociais || [])];
                            novasRedes[index] = { ...novasRedes[index], url: e.target.value };
                            updateFormData('redes_sociais', novasRedes);
                          }}
                          className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-100"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const novasRedes = (formData.redes_sociais || []).filter((_: any, i: number) => i !== index);
                          updateFormData('redes_sociais', novasRedes);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const novasRedes = [...(formData.redes_sociais || []), { tipo: '', url: '' }];
                    updateFormData('redes_sociais', novasRedes);
                  }}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-medical-600 hover:bg-medical-50 border-2 border-medical-200 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar rede social
                </button>
              </div>
            </div>
          </div>
        );

      case 3: // PÁGINA 4: Equipe (era case 2 - Profissionais)
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[3].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[3].subtitle}</p>
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
                    <select
                      value={profissional.especialidade_tipo || ''}
                      onChange={(e) => {
                        updateProfissional(index, 'especialidade_tipo', e.target.value);
                        if (e.target.value !== 'custom') {
                          updateProfissional(index, 'especialidade', e.target.value);
                        } else {
                          updateProfissional(index, 'especialidade', '');
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                    >
                      <option value="">Selecione a especialidade ou customize</option>
                      <option value="Clínico Geral">Clínico Geral</option>
                      <option value="Ortodontia">Ortodontia</option>
                      <option value="Implantodontia">Implantodontia</option>
                      <option value="Endodontia">Endodontia (Tratamento de Canal)</option>
                      <option value="Periodontia">Periodontia (Gengiva)</option>
                      <option value="Odontopediatria">Odontopediatria (Crianças)</option>
                      <option value="Prótese Dentária">Prótese Dentária</option>
                      <option value="Estética/Harmonização">Estética/Harmonização Orofacial</option>
                      <option value="Cirurgia Bucomaxilofacial">Cirurgia Bucomaxilofacial</option>
                      <option value="Radiologia">Radiologia Odontológica</option>
                      <option value="custom">✏️ Personalizar especialidade</option>
                    </select>

                    {profissional.especialidade_tipo === 'custom' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Digite a especialidade personalizada"
                          value={profissional.especialidade || ''}
                          onChange={(e) => updateProfissional(index, 'especialidade', e.target.value)}
                          maxLength={60}
                          className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                        />
                        <p className="text-medical-600/60 text-xs mt-2">{(profissional.especialidade || '').length}/60 caracteres</p>
                      </div>
                    )}
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

      case 4: // PÁGINA 5: Serviços e Diferenciais
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[4].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[4].subtitle}</p>
            </div>

            {/* Serviços Oferecidos */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-3 text-lg">
                Quais serviços/tratamentos você oferece? *
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
                Selecione os serviços que você oferece:
              </p>

              {/* Dropdown de Serviços */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const current = formData.servicos || [];
                    if (!current.includes(e.target.value)) {
                      setFormData({...formData, servicos: [...current, e.target.value]});
                    }
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200 transition-all mb-4"
              >
                <option value="">Selecione um serviço para adicionar</option>
                {[
                  { value: 'clinica_geral', label: 'Clínica geral' },
                  { value: 'ortodontia', label: 'Ortodontia' },
                  { value: 'implantes', label: 'Implantes' },
                  { value: 'estetica', label: 'Estética (clareamento, facetas, lentes)' },
                  { value: 'proteses', label: 'Próteses' },
                  { value: 'odontopediatria', label: 'Odontopediatria' },
                  { value: 'periodontia', label: 'Periodontia' },
                  { value: 'endodontia', label: 'Endodontia (canal)' }
                ]
                  .filter(servico => !formData.servicos?.includes(servico.value))
                  .map((servico) => (
                    <option key={servico.value} value={servico.value}>
                      {servico.label}
                    </option>
                  ))
                }
              </select>

              {/* Campo Personalizado */}
              <div className="mb-4">
                <label className="block text-neutral-900 font-semibold mb-2">
                  ✏️ Personalizar serviço
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.servico_outro_temp || ''}
                    onChange={(e) => setFormData({...formData, servico_outro_temp: e.target.value})}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const valor = formData.servico_outro_temp?.trim();
                        if (valor) {
                          const current = formData.servicos || [];
                          setFormData({
                            ...formData,
                            servicos: [...current, `outro:${valor}`],
                            servico_outro_temp: ''
                          });
                        }
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200 transition-all"
                    placeholder="Digite o serviço e pressione Enter ou clique em Adicionar"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const valor = formData.servico_outro_temp?.trim();
                      if (valor) {
                        const current = formData.servicos || [];
                        setFormData({
                          ...formData,
                          servicos: [...current, `outro:${valor}`],
                          servico_outro_temp: ''
                        });
                      }
                    }}
                    disabled={!formData.servico_outro_temp?.trim()}
                    className="px-6 py-3 bg-medical-600 text-white rounded-xl font-semibold hover:bg-medical-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
                <p className="text-xs text-medical-600/60 mt-1">
                  Digite o nome do serviço e clique em "Adicionar" para incluir
                </p>
              </div>

              {/* Caixa de Tags dos Selecionados */}
              {(formData.servicos?.length || 0) > 0 && (
                <div className="p-4 bg-gradient-to-r from-medical-50 to-blue-50 border-2 border-medical-200 rounded-xl">
                  <p className="text-xs font-semibold text-medical-700 mb-2">SERVIÇOS SELECIONADOS:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.servicos?.map((servicoValue, index) => {
                      // Verifica se é um serviço personalizado (formato "outro:Nome")
                      const isCustom = servicoValue.startsWith('outro:');
                      const displayLabel = isCustom
                        ? servicoValue.replace('outro:', '')
                        : [
                            { value: 'clinica_geral', label: 'Clínica geral' },
                            { value: 'ortodontia', label: 'Ortodontia' },
                            { value: 'implantes', label: 'Implantes' },
                            { value: 'estetica', label: 'Estética' },
                            { value: 'proteses', label: 'Próteses' },
                            { value: 'odontopediatria', label: 'Odontopediatria' },
                            { value: 'periodontia', label: 'Periodontia' },
                            { value: 'endodontia', label: 'Endodontia' }
                          ].find(s => s.value === servicoValue)?.label || servicoValue;

                      return (
                        <span
                          key={`${servicoValue}-${index}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-medical-400 rounded-full text-sm font-medium text-medical-700 shadow-sm"
                        >
                          <span>{displayLabel}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newServicos = formData.servicos?.filter(s => s !== servicoValue) || [];
                              setFormData({...formData, servicos: newServicos});
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs font-semibold mt-2 text-medical-600">
                    {formData.servicos?.length || 0} serviço(s) selecionado(s)
                  </p>
                </div>
              )}

              {errors.servicos && <p className="text-red-500 text-sm mt-2">{errors.servicos}</p>}
            </div>

            {/* Aceita Convênios */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-3 text-lg">
                Aceita convênios? *
              </label>
              <select
                value={formData.aceita_convenios || ''}
                onChange={(e) => setFormData({...formData, aceita_convenios: e.target.value, lista_convenios: e.target.value === 'nao' ? '' : formData.lista_convenios})}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.aceita_convenios ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                } focus:outline-none focus:ring-2 focus:ring-medical-200`}
              >
                <option value="">Selecione uma opção</option>
                <option value="sim">Sim, aceito convênios</option>
                <option value="nao">Não, apenas particular</option>
              </select>
              {errors.aceita_convenios && <p className="text-red-500 text-sm mt-2">{errors.aceita_convenios}</p>}
            </div>

            {/* Lista de Convênios (condicional) */}
            {formData.aceita_convenios === 'sim' && (
              <div>
                <label className="block text-neutral-900 font-semibold mb-4 text-lg">
                  Quais convênios você aceita? *
                </label>
                <p className="text-sm text-medical-600/70 mb-3">
                  Selecione os principais ou especifique outros:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'odontoprev', label: 'OdontoPrev' },
                    { value: 'bradesco', label: 'Bradesco Dental' },
                    { value: 'unimed', label: 'Unimed Odonto' },
                    { value: 'sulamerica', label: 'SulAmérica' },
                    { value: 'amil', label: 'Amil Dental' },
                    { value: 'outros', label: 'Outros' }
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
                            // Se desmarcar "outros", limpar o campo
                            if (convenio.value === 'outros') {
                              setFormData({...formData, lista_convenios_array: current.filter(c => c !== convenio.value), outros_convenios: ''});
                            }
                          }
                        }}
                        className="mr-3 accent-medical-600 w-5 h-5"
                      />
                      <span className="text-neutral-900 font-medium">{convenio.label}</span>
                    </label>
                  ))}
                </div>

                {errors.lista_convenios && <p className="text-red-500 text-sm mt-3">{errors.lista_convenios}</p>}

                {/* Campo "Outros convênios" condicional */}
                {formData.lista_convenios_array?.includes('outros') && (
                  <div className="mt-4">
                    <label className="block text-neutral-900 font-semibold mb-2">
                      Especifique outros convênios *
                    </label>
                    <input
                      type="text"
                      value={formData.outros_convenios || ''}
                      onChange={(e) => setFormData({...formData, outros_convenios: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                        errors.outros_convenios ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                      } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                      placeholder="Ex: Porto Seguro, MetLife, Hapvida"
                    />
                    <p className="text-xs text-medical-600/60 mt-1">Separe múltiplos convênios por vírgula</p>
                    {errors.outros_convenios && <p className="text-red-500 text-sm mt-1">{errors.outros_convenios}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Diferenciais da Clínica */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-3 text-lg">
                Quais são os principais diferenciais da sua clínica? (Opcional)
              </label>
              <p className="text-sm text-medical-600/70 mb-4">
                Selecione os diferenciais que você oferece:
              </p>

              {/* Dropdown de Diferenciais */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const current = formData.diferenciais || [];
                    if (!current.includes(e.target.value)) {
                      setFormData({...formData, diferenciais: [...current, e.target.value]});
                    }
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200 transition-all mb-4"
              >
                <option value="">Selecione um diferencial para adicionar</option>
                {[
                  { value: 'emergencia_24h', label: 'Atendimento 24 horas' },
                  { value: 'tecnologia', label: 'Tecnologia de ponta' },
                  { value: 'sem_dor', label: 'Tratamento sem dor' },
                  { value: 'estacionamento', label: 'Estacionamento' },
                  { value: 'acessibilidade', label: 'Acessibilidade' },
                  { value: 'atendimento_rapido', label: 'Atendimento rápido' },
                  { value: 'wifi_gratis', label: 'Wi-Fi grátis' },
                  { value: 'ambiente_kids', label: 'Ambiente kids' }
                ]
                  .filter(diferencial => !formData.diferenciais?.includes(diferencial.value))
                  .map((diferencial) => (
                    <option key={diferencial.value} value={diferencial.value}>
                      {diferencial.label}
                    </option>
                  ))
                }
              </select>

              {/* Campo Personalizado */}
              <div className="mb-4">
                <label className="block text-neutral-900 font-semibold mb-2">
                  ✏️ Personalizar diferencial
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.diferencial_outro_temp || ''}
                    onChange={(e) => setFormData({...formData, diferencial_outro_temp: e.target.value})}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const valor = formData.diferencial_outro_temp?.trim();
                        if (valor) {
                          const current = formData.diferenciais || [];
                          setFormData({
                            ...formData,
                            diferenciais: [...current, `outro:${valor}`],
                            diferencial_outro_temp: ''
                          });
                        }
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200 transition-all"
                    placeholder="Digite o diferencial e pressione Enter ou clique em Adicionar"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const valor = formData.diferencial_outro_temp?.trim();
                      if (valor) {
                        const current = formData.diferenciais || [];
                        setFormData({
                          ...formData,
                          diferenciais: [...current, `outro:${valor}`],
                          diferencial_outro_temp: ''
                        });
                      }
                    }}
                    disabled={!formData.diferencial_outro_temp?.trim()}
                    className="px-6 py-3 bg-medical-600 text-white rounded-xl font-semibold hover:bg-medical-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
                <p className="text-xs text-medical-600/60 mt-1">
                  Digite o nome do diferencial e clique em "Adicionar" para incluir
                </p>
              </div>

              {/* Caixa de Tags dos Selecionados */}
              {(formData.diferenciais?.length || 0) > 0 && (
                <div className="p-4 bg-medical-50 border-2 border-medical-200 rounded-xl">
                  <p className="text-xs font-semibold text-medical-700 mb-2">DIFERENCIAIS SELECIONADOS:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.diferenciais?.map((diferencialValue, index) => {
                      // Verifica se é um diferencial personalizado (formato "outro:Nome")
                      const isCustom = diferencialValue.startsWith('outro:');
                      const displayLabel = isCustom
                        ? diferencialValue.replace('outro:', '')
                        : [
                            { value: 'emergencia_24h', label: 'Atendimento 24h' },
                            { value: 'tecnologia', label: 'Tecnologia de ponta' },
                            { value: 'sem_dor', label: 'Tratamento sem dor' },
                            { value: 'estacionamento', label: 'Estacionamento' },
                            { value: 'acessibilidade', label: 'Acessibilidade' },
                            { value: 'atendimento_rapido', label: 'Atendimento rápido' },
                            { value: 'wifi_gratis', label: 'Wi-Fi grátis' },
                            { value: 'ambiente_kids', label: 'Ambiente kids' }
                          ].find(d => d.value === diferencialValue)?.label || diferencialValue;

                      return (
                        <span
                          key={`${diferencialValue}-${index}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-medical-400 rounded-full text-sm font-medium text-medical-700 shadow-sm"
                        >
                          <span>{displayLabel}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newDiferenciais = formData.diferenciais?.filter(d => d !== diferencialValue) || [];
                              setFormData({...formData, diferenciais: newDiferenciais});
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs font-semibold text-medical-600 mt-2">
                    {formData.diferenciais?.length || 0} diferencial(is) selecionado(s)
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 6: // PÁGINA 7: Depoimentos, Localização e Contato
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[6].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[6].subtitle}</p>
            </div>

            {/* Depoimentos do Google Review */}
            <div className="border-2 border-medical-300 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">⭐ Depoimentos do Google</h3>
              <p className="text-sm text-medical-600/70 mb-4">
                Cole o link do seu Google Meu Negócio para exibirmos suas avaliações automaticamente no site.
              </p>

              <div>
                <label className="block text-neutral-900 font-semibold mb-2">
                  Link do Google Meu Negócio (Opcional)
                </label>
                <p className="text-sm text-medical-600/70 mb-3">
                  Para encontrar: acesse google.com/maps, pesquise seu consultório e copie o link da barra de endereços.
                </p>
                <input
                  type="url"
                  value={formData.link_google_maps || ''}
                  onChange={(e) => setFormData({...formData, link_google_maps: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-medical-200 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-200"
                  placeholder="https://maps.google.com/..."
                />
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-medical-200">
                  <p className="text-sm text-medical-700">
                    💡 <strong>Dica:</strong> Suas avaliações do Google aparecerão automaticamente no site com estrelas e comentários dos pacientes. Se não tiver Google Meu Negócio, deixe em branco.
                  </p>
                </div>
              </div>
            </div>

            {/* Separador Visual */}
            <div className="border-t-4 border-medical-100 my-8"></div>

            <h3 className="text-2xl font-bold text-neutral-900 mb-6">📍 Localização e Contato</h3>

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
                Horários de atendimento *
              </label>
              <select
                value={formData.horario_padrao || ''}
                onChange={(e) => updateFormData('horario_padrao', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 transition-all ${
                  errors.horario_padrao ? 'border-red-400' : 'border-medical-200 focus:border-medical-400'
                }`}
              >
                <option value="">Escolha um padrão de horário</option>
                <option value="seg_sex_8_18_sab_8_12">Segunda a Sexta: 8h-18h | Sábado: 8h-12h</option>
                <option value="seg_sex_9_19_sab_fechado">Segunda a Sexta: 9h-19h | Sábado: Fechado</option>
                <option value="seg_sex_8_17_sab_8_12">Segunda a Sexta: 8h-17h | Sábado: 8h-12h</option>
                <option value="seg_sex_8_18_sab_fechado">Segunda a Sexta: 8h-18h | Sábado: Fechado</option>
                <option value="seg_sab_8_18">Segunda a Sábado: 8h-18h</option>
                <option value="seg_sex_14_22">Segunda a Sexta: 14h-22h (Noturno)</option>
                <option value="custom">Personalizado (especificar abaixo)</option>
              </select>

              {formData.horario_padrao === 'custom' && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Descreva seus horários personalizados
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Segunda, Quarta e Sexta: 8h-12h e 14h-18h"
                    value={formData.horario_customizado || ''}
                    onChange={(e) => updateFormData('horario_customizado', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-medical-100 focus:border-medical-400 transition-all"
                  />
                </div>
              )}

              {errors.horario_padrao && <p className="text-red-500 text-sm mt-2">{errors.horario_padrao}</p>}
              <p className="text-medical-600/60 text-xs mt-2">Escolha o padrão que mais se aproxima do seu horário</p>
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
                    onChange={(e) => setFormData({...formData, exibir_mapa: e.target.value, link_mapa_embed: ''})}
                    className="mt-1 mr-3 accent-medical-600"
                  />
                  <div className="font-semibold text-neutral-900">❌ Não, apenas o endereço de texto</div>
                </label>
              </div>
              {errors.exibir_mapa && <p className="text-red-500 text-sm mt-2">{errors.exibir_mapa}</p>}

              {/* Campo condicional: Link do Google Maps para Embed */}
              {formData.exibir_mapa === 'sim' && (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <label className="block text-neutral-900 font-semibold mb-2">
                    Link do Google Maps *
                  </label>
                  <p className="text-sm text-medical-600/70 mb-3">
                    Cole o link do seu Google Maps aqui. Para obter: pesquise sua clínica no Google Maps, clique em "Compartilhar" e copie o link.
                  </p>
                  <input
                    type="url"
                    value={formData.link_mapa_embed || ''}
                    onChange={(e) => setFormData({...formData, link_mapa_embed: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.link_mapa_embed ? 'border-red-400 bg-red-50' : 'border-medical-200 focus:border-medical-500'
                    } focus:outline-none focus:ring-2 focus:ring-medical-200`}
                    placeholder="https://maps.google.com/..."
                  />
                  {errors.link_mapa_embed && <p className="text-red-500 text-sm mt-1">{errors.link_mapa_embed}</p>}

                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Dica:</strong> O mapa interativo do Google aparecerá no rodapé do seu site, permitindo que pacientes vejam sua localização e obtenham rotas facilmente.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        );

      case 5: // PÁGINA 6: Identidade Visual
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[5].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[5].subtitle}</p>
            </div>

            {/* Sites de Referência */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">🌟 Sites de Referência (Recomendado)</h3>
              <p className="text-sm text-medical-600/70 mb-4">
                Mostre sites que você gosta para nos inspirarmos no design do seu site.
                <strong> Uma imagem vale mais que mil palavras!</strong>
              </p>

              <div className="space-y-4">
                {(formData.sites_referencia || []).map((site: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-4 border-2 border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-neutral-900">Site de Referência {index + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const novasSites = (formData.sites_referencia || []).filter((_: any, i: number) => i !== index);
                          setFormData({...formData, sites_referencia: novasSites});
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Remover site"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Link do site
                        </label>
                        <input
                          type="url"
                          placeholder="https://exemplo.com"
                          value={site.url || ''}
                          onChange={(e) => {
                            const novasSites = [...(formData.sites_referencia || [])];
                            novasSites[index] = { ...novasSites[index], url: e.target.value };
                            setFormData({...formData, sites_referencia: novasSites});
                          }}
                          className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                      </div>

                      {site.url && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              O que você mais gostou neste site?
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { value: 'layout', label: 'Layout/organização' },
                                { value: 'cores', label: 'Cores e estilo' },
                                { value: 'fotos', label: 'Tipo de fotos' },
                                { value: 'animacoes', label: 'Animações/efeitos' }
                              ].map((opcao) => {
                                const aspectos = site.aspectos || [];
                                return (
                                  <label key={opcao.value} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={aspectos.includes(opcao.value)}
                                      onChange={(e) => {
                                        const novasSites = [...(formData.sites_referencia || [])];
                                        const aspectosAtuais = novasSites[index]?.aspectos || [];

                                        if (e.target.checked) {
                                          novasSites[index] = {
                                            ...novasSites[index],
                                            aspectos: [...aspectosAtuais, opcao.value]
                                          };
                                        } else {
                                          novasSites[index] = {
                                            ...novasSites[index],
                                            aspectos: aspectosAtuais.filter((a: string) => a !== opcao.value)
                                          };
                                        }
                                        setFormData({...formData, sites_referencia: novasSites});
                                      }}
                                      className="w-4 h-4 text-purple-600 border-medical-300 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-neutral-700">{opcao.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                              Observações adicionais (opcional)
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Gostei da forma como apresentam os serviços"
                              value={site.observacao || ''}
                              onChange={(e) => {
                                const novasSites = [...(formData.sites_referencia || [])];
                                novasSites[index] = { ...novasSites[index], observacao: e.target.value };
                                setFormData({...formData, sites_referencia: novasSites});
                              }}
                              className="w-full px-3 py-2 border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const novasSites = [...(formData.sites_referencia || []), { url: '', aspectos: [], observacao: '' }];
                  setFormData({...formData, sites_referencia: novasSites});
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Adicionar site de referência
              </button>

              <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-sm text-purple-800">
                  💡 <strong>Dica:</strong> Mesmo 1 referência já ajuda muito!
                  Pode ser site de dentista, clínica médica ou qualquer site que você ache bonito.
                </p>
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

            {/* Paleta de Cores */}
            <div className="border-t-4 border-medical-100 pt-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">🎨 Paleta de Cores</h3>
              <p className="text-sm text-medical-600/70 mb-6">
                Defina as cores que serão usadas no seu site. Você pode enviar uma paleta pronta ou criar uma personalizada.
              </p>

              {/* Opção: Upload de Paleta */}
              <div className="mb-6">
                <label className="block text-neutral-900 font-semibold mb-3">
                  Opção 1: Enviar Paleta de Cores (Imagem)
                </label>
                <p className="text-sm text-medical-600/70 mb-3">
                  Já tem uma paleta definida? Envie uma imagem com suas cores.
                </p>
                <div className="border-2 border-dashed border-medical-300 rounded-xl p-6 bg-neutral-50 hover:bg-medical-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFileUpload('paleta_cores', e.target.files)}
                    className="hidden"
                    id="upload_paleta"
                  />
                  <label htmlFor="upload_paleta" className="cursor-pointer flex flex-col items-center">
                    <div className="text-4xl mb-2">🎨</div>
                    <p className="text-neutral-900 font-medium">Clique para enviar sua paleta</p>
                    <p className="text-sm text-medical-600/70 mt-1">(PNG, JPG ou WEBP - máx. 5MB)</p>
                  </label>
                  {uploadedFiles.paleta_cores && uploadedFiles.paleta_cores.length > 0 && (
                    <div className="mt-4 text-center text-green-700 font-semibold">
                      ✓ {uploadedFiles.paleta_cores[0].name}
                    </div>
                  )}
                </div>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-medical-200"></div>
                <span className="text-sm text-medical-600 font-medium">OU</span>
                <div className="flex-1 h-px bg-medical-200"></div>
              </div>

              {/* Opção: Seguir Padrão da Logo */}
              <div className="mb-6">
                <label className="flex items-start p-4 rounded-xl border-2 border-medical-200 hover:border-medical-400 cursor-pointer bg-white transition-all">
                  <input
                    type="checkbox"
                    checked={formData.usar_cores_logo || false}
                    onChange={(e) => setFormData({...formData, usar_cores_logo: e.target.checked})}
                    className="mt-1 mr-3 w-5 h-5 text-medical-600 border-medical-300 rounded focus:ring-medical-500"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900 mb-1">
                      ✨ Extrair cores automaticamente da logo
                    </div>
                    <div className="text-sm text-medical-600/70">
                      Nosso designer irá extrair e criar uma paleta de cores harmoniosa baseada nas cores da sua logo.
                      Marque esta opção se você quer que as cores do site sigam exatamente as cores da sua marca.
                    </div>
                  </div>
                </label>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-medical-200"></div>
                <span className="text-sm text-medical-600 font-medium">OU</span>
                <div className="flex-1 h-px bg-medical-200"></div>
              </div>

              {/* Opção: Criar Paleta Manualmente */}
              <div>
                <label className="block text-neutral-900 font-semibold mb-3">
                  Opção 2: Criar Paleta Personalizada
                </label>
                <p className="text-sm text-medical-600/70 mb-4">
                  Defina cada cor do seu design system. Deixe em branco as que não tiver definidas.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: 'cor_primaria',
                      label: 'Cor Primária (Primary)',
                      desc: 'Cor principal da marca, usada em botões e destaques',
                      default: '#8B5CF6'
                    },
                    {
                      key: 'cor_secundaria',
                      label: 'Cor Secundária (Secondary)',
                      desc: 'Cor complementar, usada em elementos secundários',
                      default: '#06B6D4'
                    },
                    {
                      key: 'cor_accent',
                      label: 'Cor de Destaque (Accent)',
                      desc: 'Para chamar atenção em CTAs e elementos importantes',
                      default: '#F59E0B'
                    },
                    {
                      key: 'cor_background',
                      label: 'Cor de Fundo (Background)',
                      desc: 'Cor de fundo principal das seções',
                      default: '#F9FAFB'
                    },
                    {
                      key: 'cor_texto',
                      label: 'Cor do Texto (Text)',
                      desc: 'Cor principal dos textos',
                      default: '#1F2937'
                    }
                  ].map((cor) => {
                    const paleta = formData.paleta_personalizada || {};
                    const corData = paleta[cor.key] || {};

                    return (
                      <div key={cor.key} className="bg-white border-2 border-medical-200 rounded-xl p-4">
                        <div className="flex items-start gap-4">
                          {/* Color Picker */}
                          <div className="flex-shrink-0">
                            <input
                              type="color"
                              value={corData.valor || cor.default}
                              onChange={(e) => {
                                const novaPaleta = {
                                  ...formData.paleta_personalizada,
                                  [cor.key]: {
                                    ...corData,
                                    valor: e.target.value,
                                    formato: corData.formato || 'hex'
                                  }
                                };
                                setFormData({...formData, paleta_personalizada: novaPaleta});
                              }}
                              className="w-20 h-20 rounded-lg border-2 border-medical-300 cursor-pointer"
                            />
                          </div>

                          {/* Informações */}
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-neutral-900 mb-1">
                              {cor.label}
                            </label>
                            <p className="text-xs text-medical-600/70 mb-3">
                              {cor.desc}
                            </p>

                            <div className="flex gap-2">
                              {/* Formato */}
                              <select
                                value={corData.formato || 'hex'}
                                onChange={(e) => {
                                  const novaPaleta = {
                                    ...formData.paleta_personalizada,
                                    [cor.key]: {
                                      ...corData,
                                      formato: e.target.value
                                    }
                                  };
                                  setFormData({...formData, paleta_personalizada: novaPaleta});
                                }}
                                className="px-3 py-1.5 text-sm border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-200"
                              >
                                <option value="hex">HEX</option>
                                <option value="rgb">RGB</option>
                                <option value="hsl">HSL</option>
                              </select>

                              {/* Valor da Cor */}
                              <input
                                type="text"
                                value={corData.valor || cor.default}
                                onChange={(e) => {
                                  const novaPaleta = {
                                    ...formData.paleta_personalizada,
                                    [cor.key]: {
                                      ...corData,
                                      valor: e.target.value
                                    }
                                  };
                                  setFormData({...formData, paleta_personalizada: novaPaleta});
                                }}
                                placeholder={cor.default}
                                className="flex-1 px-3 py-1.5 text-sm border-2 border-medical-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-200 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Dica:</strong> Se você não tiver todas as cores definidas, não tem problema!
                    Pelo menos defina a <strong>Cor Primária</strong> (a cor principal da sua marca).
                    Nosso designer pode criar as demais cores complementares baseado nela.
                  </p>
                </div>
              </div>
            </div>

            {/* Logo da Clínica */}
            <div className="border-t-4 border-medical-100 pt-8">
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
          </div>
        );

      case 7: // PÁGINA 8: Rastreamento e Integrações
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent mb-3">
                {sections[7].title}
              </h2>
              <p className="text-medical-600/70 text-lg">{sections[7].subtitle}</p>
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

      case 8: // PÁGINA 9: Revisão Final
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
