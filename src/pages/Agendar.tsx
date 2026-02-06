import HeaderNew from '@/components/redesign/HeaderNew';
import FooterNew from '@/components/redesign/FooterNew';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, Building2, FileText, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  createAgendamento,
  listarHorariosDisponiveis,
  verificarDisponibilidade,
} from '@/lib/supabase';
import { format, addDays, isBefore, startOfDay, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FormData {
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string;
  tipo: 'comercial' | 'alinhamento' | 'aprovacao' | 'suporte';
  observacoes: string;
}

const Agendar = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    whatsapp: '',
    empresa: '',
    tipo: 'comercial',
    observacoes: '',
  });

  const steps = [
    { id: 'info', title: 'Suas Informações', icon: User },
    { id: 'date', title: 'Escolha a Data', icon: Calendar },
    { id: 'time', title: 'Escolha o Horário', icon: Clock },
    { id: 'confirm', title: 'Confirmar', icon: Check },
  ];

  // Carregar horários disponíveis quando a data mudar
  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableTimes = async (date: Date) => {
    setLoadingTimes(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const times = await listarHorariosDisponiveis(dateStr);
      setAvailableTimes(times);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWhatsApp = (whatsapp: string) => {
    const numbers = whatsapp.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    switch (currentStep) {
      case 0: // Informações
        if (!formData.nome || formData.nome.length < 3) {
          newErrors.nome = 'Nome completo é obrigatório (mín. 3 caracteres)';
        }
        if (!formData.email || !validateEmail(formData.email)) {
          newErrors.email = 'E-mail inválido';
        }
        if (!formData.whatsapp || !validateWhatsApp(formData.whatsapp)) {
          newErrors.whatsapp = 'WhatsApp inválido (deve ter 11 dígitos)';
        }
        break;

      case 1: // Data
        if (!selectedDate) {
          newErrors.date = 'Selecione uma data';
        }
        break;

      case 2: // Horário
        if (!selectedTime) {
          newErrors.time = 'Selecione um horário';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      const dateStr = format(selectedDate!, 'yyyy-MM-dd');

      await createAgendamento({
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        empresa: formData.empresa || undefined,
        data: dateStr,
        horario: selectedTime,
        tipo: formData.tipo,
        observacoes: formData.observacoes || undefined,
      });

      alert(
        `✅ Reunião agendada com sucesso!\n\n` +
          `📅 Data: ${format(selectedDate!, 'dd/MM/yyyy')}\n` +
          `⏰ Horário: ${selectedTime}\n\n` +
          `Você receberá uma confirmação por e-mail.`
      );

      navigate('/');
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao agendar reunião. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Desabilitar datas passadas e domingo
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;

    const dayOfWeek = getDay(date);
    return dayOfWeek === 0; // Apenas Domingo
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Informações
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Vamos nos conhecer!
              </h2>
              <p className="text-medical-600/70">
                Preencha suas informações para agendar uma reunião
              </p>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-medical-400" size={20} />
                <input
                  type="text"
                  placeholder="Ex: Dr. João Silva"
                  value={formData.nome}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.nome ? 'border-red-400' : 'border-medical-200 focus:border-purple-400'
                  }`}
                />
              </div>
              {errors.nome && <p className="text-red-500 text-sm mt-2">{errors.nome}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-medical-400" size={20} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.email ? 'border-red-400' : 'border-medical-200 focus:border-purple-400'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-medical-400" size={20} />
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    updateFormData('whatsapp', formatWhatsApp(e.target.value))
                  }
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all ${
                    errors.whatsapp
                      ? 'border-red-400'
                      : 'border-medical-200 focus:border-purple-400'
                  }`}
                />
              </div>
              {errors.whatsapp && <p className="text-red-500 text-sm mt-2">{errors.whatsapp}</p>}
            </div>

            {/* Empresa/Consultório */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Nome do Consultório/Clínica (opcional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-3.5 text-medical-400" size={20} />
                <input
                  type="text"
                  placeholder="Ex: Clínica Odontológica Dr. Silva"
                  value={formData.empresa}
                  onChange={(e) => updateFormData('empresa', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all"
                />
              </div>
            </div>

            {/* Tipo de Reunião */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
                Tipo de Reunião
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  updateFormData('tipo', e.target.value as FormData['tipo'])
                }
                className="w-full px-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all"
              >
                <option value="comercial">Comercial - Conhecer o serviço</option>
                <option value="alinhamento">Alinhamento - Já sou cliente</option>
                <option value="aprovacao">Aprovação - Revisar site</option>
                <option value="suporte">Suporte - Ajuda técnica</option>
              </select>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Observações (opcional)
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 text-medical-400" size={20} />
                <textarea
                  placeholder="Alguma informação adicional que queira compartilhar..."
                  value={formData.observacoes}
                  onChange={(e) => updateFormData('observacoes', e.target.value)}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border-2 border-medical-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Escolher Data
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Escolha uma data
              </h2>
              <p className="text-medical-600/70">
                Selecione o dia da sua reunião
              </p>
            </div>

            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                locale={ptBR}
                className="rounded-xl border-2 border-medical-200 p-4"
              />
            </div>

            {errors.date && (
              <div className="flex items-center gap-2 text-red-500 justify-center">
                <AlertCircle size={20} />
                <p>{errors.date}</p>
              </div>
            )}

            <div className="bg-neutral-50 border-2 border-medical-200 rounded-xl p-4">
              <h4 className="font-semibold text-neutral-900 mb-2">Horário de atendimento:</h4>
              <ul className="text-sm text-medical-600 space-y-1">
                <li>• Segunda a Sábado: 9h às 20h (horário contínuo)</li>
                <li>• Domingo: Não atendemos</li>
              </ul>
            </div>
          </div>
        );

      case 2: // Escolher Horário
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Escolha um horário
              </h2>
              <p className="text-medical-600/70">
                {selectedDate && `Para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}`}
              </p>
            </div>

            {loadingTimes ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600 mx-auto"></div>
                <p className="text-medical-600 mt-4">Carregando horários disponíveis...</p>
              </div>
            ) : availableTimes.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-orange-500 mb-4" size={48} />
                <p className="text-gray-600">
                  Não há horários disponíveis para esta data.
                  <br />
                  Por favor, escolha outra data.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      selectedTime === time
                        ? 'bg-medical-600 text-white shadow-lg'
                        : 'bg-neutral-50 text-purple-700 hover:bg-medical-100 border-2 border-medical-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}

            {errors.time && (
              <div className="flex items-center gap-2 text-red-500 justify-center">
                <AlertCircle size={20} />
                <p>{errors.time}</p>
              </div>
            )}
          </div>
        );

      case 3: // Confirmar
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-medical-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Confirme seus dados
              </h2>
              <p className="text-medical-600/70">
                Revise as informações antes de finalizar
              </p>
            </div>

            <div className="bg-white border-2 border-medical-200 rounded-xl p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">Suas informações</h4>
                <p className="text-gray-700">
                  <strong>Nome:</strong> {formData.nome}
                </p>
                <p className="text-gray-700">
                  <strong>E-mail:</strong> {formData.email}
                </p>
                <p className="text-gray-700">
                  <strong>WhatsApp:</strong> {formData.whatsapp}
                </p>
                {formData.empresa && (
                  <p className="text-gray-700">
                    <strong>Consultório:</strong> {formData.empresa}
                  </p>
                )}
              </div>

              <div className="border-t-2 border-purple-100 pt-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Data e Horário</h4>
                <p className="text-gray-700">
                  <strong>Data:</strong>{' '}
                  {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-gray-700">
                  <strong>Horário:</strong> {selectedTime}
                </p>
              </div>

              <div className="border-t-2 border-purple-100 pt-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Tipo de Reunião</h4>
                <p className="text-gray-700">
                  {formData.tipo === 'comercial' && 'Comercial - Conhecer o serviço'}
                  {formData.tipo === 'alinhamento' && 'Alinhamento - Já sou cliente'}
                  {formData.tipo === 'aprovacao' && 'Aprovação - Revisar site'}
                  {formData.tipo === 'suporte' && 'Suporte - Ajuda técnica'}
                </p>
              </div>

              {formData.observacoes && (
                <div className="border-t-2 border-purple-100 pt-4">
                  <h4 className="font-semibold text-neutral-900 mb-2">Observações</h4>
                  <p className="text-gray-700">{formData.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNew />
      <div className="container mx-auto px-4 max-w-4xl py-16">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep
                        ? 'bg-medical-600 text-white shadow-lg'
                        : 'bg-medical-100 text-medical-400'
                    }`}
                  >
                    <step.icon size={24} />
                  </div>
                  <p
                    className={`text-sm mt-2 font-semibold ${
                      index <= currentStep ? 'text-medical-600' : 'text-medical-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      index < currentStep ? 'bg-medical-600' : 'bg-purple-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex-1 py-6 text-lg"
              disabled={isSubmitting}
            >
              Voltar
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1 py-6 text-lg bg-medical-600 hover:bg-medical-700"
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 py-6 text-lg bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          )}
        </div>
      </div>
      <FooterNew />
    </div>
  );
};

export default Agendar;
