import React, { useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PersonalInfoSection } from '@/components/FormSections/PersonalInfoSection';
import { ServicesSection } from '@/components/FormSections/ServicesSection';
import { StyleSection } from '@/components/FormSections/StyleSection';
import { formSchema, FormData, ProcessedFormData } from '@/components/types/form-types';

const TOTAL_SECTIONS = 3;

const getSectionProgress = (currentSection: number, completedFields: number, totalFields: number) => {
  const baseProgress = ((currentSection - 1) / TOTAL_SECTIONS) * 100;
  const sectionProgress = (completedFields / totalFields) * (100 / TOTAL_SECTIONS);
  return Math.min(baseProgress + sectionProgress, 100);
};

const Formulario: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      especialidades: [],
      servicos: [],
      redesSociais: {},
      profissionais: [],
      aceitaTermos: false,
      aceitaPrivacidade: false,
      aceitaWhatsapp: false,
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const { handleSubmit, watch, formState: { errors } } = form;

  // Calculate progress based on filled fields
  const watchedFields = watch();
  const filledFields = Object.values(watchedFields).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return value !== undefined && value !== '';
  }).length;
  
  const totalFields = Object.keys(formSchema.shape).length;
  const progress = getSectionProgress(currentSection, filledFields, totalFields);

  const nextSection = () => {
    if (currentSection < TOTAL_SECTIONS) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        // Check file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error(`Arquivo ${file.name} é muito grande (máximo 5MB)`));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          
          // For images, try to compress them
          if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Calculate new dimensions (max 1200px width)
              const maxWidth = 1200;
              const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
              canvas.width = img.width * ratio;
              canvas.height = img.height * ratio;
              
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              
              // Compress to JPEG with 0.8 quality
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              resolve(compressedDataUrl);
            };
            img.onerror = () => resolve(result); // Fallback to original
            img.src = result;
          } else {
            resolve(result);
          }
        };
        reader.onerror = () => reject(new Error(`Erro ao ler arquivo ${file.name}`));
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  };

  const onSubmit = async (data: FormData) => {
    console.log('🚀 === INICIANDO DEBUG DO FORMULÁRIO ===');
    console.log('📝 Dados brutos do formulário:', JSON.stringify(data, null, 2));
    
    // Debug detalhado dos campos obrigatórios
    console.log('🔍 === VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS ===');
    console.log('Nome completo:', data.nomeCompleto);
    console.log('Email:', data.email);
    console.log('Telefone:', data.telefone);
    console.log('Especialidades:', data.especialidades);
    console.log('Serviços:', data.servicos);
    console.log('Aceita Termos:', data.aceitaTermos);
    console.log('Aceita Privacidade:', data.aceitaPrivacidade);
    
    setIsLoading(true);
    
    try {
      // Validação manual detalhada antes do envio
      const missingFields = [];
      
      if (!data.nomeCompleto?.trim()) missingFields.push('Nome completo');
      if (!data.email?.trim()) missingFields.push('E-mail');
      if (!data.telefone?.trim()) missingFields.push('Telefone');
      if (!data.especialidades?.length) missingFields.push('Especialidades');
      if (!data.servicos?.length) missingFields.push('Serviços');
      if (!data.aceitaTermos) missingFields.push('Aceitar termos');
      if (!data.aceitaPrivacidade) missingFields.push('Aceitar privacidade');
      
      if (missingFields.length > 0) {
        console.error('❌ Campos obrigatórios faltando:', missingFields);
        throw new Error(`Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`);
      }

      console.log('✅ Validação manual passou - todos os campos obrigatórios preenchidos');

      // Convert files to base64 for webhook transmission
      const processedData: ProcessedFormData = { ...data };
      
      if (data.logoArquivo?.length) {
        console.log('🖼️ Convertendo logo para base64...');
        try {
          processedData.logoArquivoBase64 = await convertFilesToBase64(data.logoArquivo);
          console.log('✅ Logo convertido com sucesso');
        } catch (error) {
          console.error('❌ Erro ao converter logo:', error);
          throw new Error('Erro ao processar logo');
        }
      }
      
      if (data.fotos?.length) {
        console.log('📸 Convertendo fotos para base64...');
        try {
          processedData.fotosBase64 = await convertFilesToBase64(data.fotos);
          console.log('✅ Fotos convertidas com sucesso');
        } catch (error) {
          console.error('❌ Erro ao converter fotos:', error);
          throw new Error('Erro ao processar fotos');
        }
      }
      
      if (data.documentos?.length) {
        console.log('📄 Convertendo documentos para base64...');
        try {
          processedData.documentosBase64 = await convertFilesToBase64(data.documentos);
          console.log('✅ Documentos convertidos com sucesso');
        } catch (error) {
          console.error('❌ Erro ao converter documentos:', error);
          throw new Error('Erro ao processar documentos');
        }
      }

      // Convert professional photos
      if (data.profissionais?.length) {
        console.log('👥 Convertendo fotos dos profissionais...');
        processedData.profissionaisFotosBase64 = {};
        
        for (let i = 0; i < data.profissionais.length; i++) {
          const profissional = data.profissionais[i];
          if (profissional.foto?.length) {
            try {
              processedData.profissionaisFotosBase64[i] = await convertFilesToBase64(profissional.foto);
              console.log(`✅ Foto do profissional ${i + 1} convertida`);
            } catch (error) {
              console.error(`❌ Erro ao converter foto do profissional ${i + 1}:`, error);
            }
          }
        }
      }

      // Remove File objects from data as they can't be JSON stringified
      delete processedData.logoArquivo;
      delete processedData.fotos;
      delete processedData.documentos;

      // Remove File objects from professionals
      if (processedData.profissionais) {
        processedData.profissionais = processedData.profissionais.map(prof => {
          const { foto, ...rest } = prof;
          return rest;
        });
      }

      const payloadSize = JSON.stringify(processedData).length;
      console.log(`📦 Tamanho da payload: ${(payloadSize / 1024 / 1024).toFixed(2)} MB`);

      if (payloadSize > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Dados muito grandes. Reduza o número de imagens.');
      }

      console.log('🌐 === PREPARANDO ENVIO PARA WEBHOOK ===');
      console.log('📍 URL:', 'https://n8n-webhook.isaai.online/webhook/sitesodonto');
      console.log('📦 Dados processados para envio:', JSON.stringify({
        nomeCompleto: processedData.nomeCompleto,
        email: processedData.email,
        telefone: processedData.telefone,
        especialidades: processedData.especialidades,
        servicos: processedData.servicos,
        aceitaTermos: processedData.aceitaTermos,
        aceitaPrivacidade: processedData.aceitaPrivacidade,
        // Log apenas a estrutura dos arquivos, não o conteúdo
        temLogoBase64: !!processedData.logoArquivoBase64?.length,
        temFotosBase64: !!processedData.fotosBase64?.length,
        temDocumentosBase64: !!processedData.documentosBase64?.length,
      }, null, 2));

      const response = await fetch('https://n8n-webhook.isaai.online/webhook/sitesodonto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      console.log('📡 === RESPOSTA DO WEBHOOK ===');
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta do webhook:', errorText);
        console.error('❌ Status completo:', response.status, response.statusText);
        throw new Error(`Erro do servidor: ${response.status} - ${errorText || response.statusText}`);
      }

      const responseData = await response.text();
      console.log('✅ Resposta do webhook (sucesso):', responseData);

      console.log('🎉 === FORMULÁRIO ENVIADO COM SUCESSO ===');
      
      toast({
        title: "Sucesso!",
        description: "Seu briefing foi enviado com sucesso. Redirecionando...",
        variant: "default",
      });
      
      navigate('/obrigado');
    } catch (error) {
      console.error('💥 === ERRO NO ENVIO DO FORMULÁRIO ===');
      console.error('Erro completo:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      
      let errorMessage = 'Erro inesperado ao enviar formulário';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Mensagem do erro:', errorMessage);
      } else if (typeof error === 'string') {
        errorMessage = error;
        console.error('Erro como string:', errorMessage);
      }

      // Log do estado atual do formulário para debug
      console.error('Estado atual do formulário:', {
        currentSection,
        formErrors: Object.keys(errors),
        formData: {
          nomeCompleto: data.nomeCompleto,
          email: data.email,
          telefone: data.telefone,
          especialidades: data.especialidades?.length || 0,
          servicos: data.servicos?.length || 0,
          aceitaTermos: data.aceitaTermos,
          aceitaPrivacidade: data.aceitaPrivacidade,
        }
      });

      toast({
        title: "Erro ao enviar formulário",
        description: errorMessage + ". Verifique os campos obrigatórios e tente novamente.",
        variant: "destructive",
        duration: 8000, // Maior duração para dar tempo de ler
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <PersonalInfoSection form={form} />;
      case 2:
        return <ServicesSection form={form} />;
      case 3:
        return <StyleSection form={form} />;
      default:
        return <PersonalInfoSection form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-bg text-success-dark text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Continuação do form inicial
          </div>
          
          <h1 className="text-h1 font-extrabold text-primary mb-6">
            🦷 Briefing Profissional - Site Consultório Odontológico
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-6">
            Criação de Site para Consultório Odontológico
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="badge-credibility">
              ✅ Credibilidade - Transmita autoridade profissional
            </div>
            <div className="badge-credibility">
              ✅ Presença Digital - Destaque sua experiência
            </div>
            <div className="badge-credibility">
              ✅ Profissionalismo - Design institucional
            </div>
            <div className="badge-credibility">
              ✅ Referência - Posicione-se como especialista
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                Progresso: {Math.round(progress)}% concluído
              </span>
              <span className="text-sm text-text-secondary flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Tempo estimado: 8-12 minutos
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            Suas informações estão 100% seguras e serão usadas apenas para criar seu site personalizado.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section Navigation */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {[1, 2, 3].map((section) => (
                  <div
                    key={section}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      section === currentSection
                        ? 'bg-primary text-primary-foreground'
                        : section < currentSection
                        ? 'bg-success text-success-foreground'
                        : 'bg-gray-200 text-text-light'
                    }`}
                  >
                    {section}
                  </div>
                ))}
              </div>

              {/* Current Section */}
              {renderSection()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevSection}
                  disabled={currentSection === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentSection < TOTAL_SECTIONS ? (
                  <Button
                    type="button"
                    onClick={nextSection}
                    className="flex items-center gap-2"
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-hero flex items-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    {isLoading ? 'Enviando...' : '🚀 FINALIZAR BRIEFING E COMEÇAR MEU SITE'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Show validation errors */}
              {Object.keys(errors).length > 0 && currentSection === TOTAL_SECTIONS && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold text-destructive mb-2">❌ Corrija os seguintes erros antes de enviar:</h4>
                  <ul className="text-sm text-destructive space-y-1">
                     {Object.entries(errors).map(([field, error]) => {
                       let message = `Erro no campo ${field}`;
                       if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
                         message = error.message;
                       }
                       return <li key={field}>• {message}</li>;
                     })}
                  </ul>
                  <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Dica:</strong> Volte às seções anteriores para preencher os campos obrigatórios em vermelho.
                    </p>
                  </div>
                </div>
              )}

              {/* Debug info in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🔍 Debug Info (apenas em desenvolvimento)</h4>
                  <div className="text-xs text-blue-700 font-mono">
                    <div>Campos com erro: {Object.keys(errors).join(', ') || 'Nenhum'}</div>
                    <div>Especialidades: {watchedFields.especialidades?.length || 0}</div>
                    <div>Serviços: {watchedFields.servicos?.length || 0}</div>
                    <div>Aceita Termos: {watchedFields.aceitaTermos ? 'Sim' : 'Não'}</div>
                    <div>Aceita Privacidade: {watchedFields.aceitaPrivacidade ? 'Sim' : 'Não'}</div>
                  </div>
                </div>
              )}

              {/* Final Section Message */}
              {currentSection === TOTAL_SECTIONS && (
                <div className="text-center space-y-2 bg-gradient-to-r from-success-bg to-primary-ultra-light p-6 rounded-lg">
                  <h3 className="font-bold text-text-primary">⏰ Entrega garantida em 24h</h3>
                  <p className="text-text-secondary">💰 Você só paga quando estiver aprovado</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Formulario;