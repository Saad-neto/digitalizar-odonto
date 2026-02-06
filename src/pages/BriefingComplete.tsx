import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  FileText,
  Sparkles,
  Calendar,
  Zap,
  Award
} from 'lucide-react';
import { getLeadById } from '@/lib/supabase';
import HeaderNew from '@/components/redesign/HeaderNew';
import FooterNew from '@/components/redesign/FooterNew';

const BriefingComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');

  const [leadData, setLeadData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do lead
  useEffect(() => {
    const loadLead = async () => {
      if (!leadId) {
        console.error('❌ Lead ID não encontrado');
        navigate('/briefing');
        return;
      }

      try {
        const lead = await getLeadById(leadId);
        setLeadData(lead);
        setLoading(false);
      } catch (err) {
        console.error('❌ Erro ao carregar lead:', err);
        navigate('/briefing');
      }
    };

    loadLead();
  }, [leadId, navigate]);

  const handleGoToPayment = () => {
    if (leadId) {
      navigate(`/pagamento?leadId=${leadId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-medical-50 to-white">
        <HeaderNew />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-medical-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-neutral-600">Carregando...</p>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-50 to-white">
      <HeaderNew />

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header de Sucesso */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mint-500 to-mint-600 rounded-full mb-6 shadow-lg animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Parabéns, {leadData?.nome?.split(' ')[0]}! 🎉
          </h1>

          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Seu briefing está <span className="font-semibold text-medical-600">100% completo</span>!
            Agora falta apenas o pagamento para iniciarmos a criação do seu site profissional.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Card Principal */}
          <Card className="p-8 md:p-12 shadow-2xl border-2 border-medical-100 mb-8">
            {/* Resumo do Briefing */}
            <div className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 text-medical-600 mr-3" />
                Seu Briefing Completo
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '✓', label: 'Informações do consultório', value: leadData?.briefing_data?.nome_consultorio },
                  { icon: '✓', label: 'Dados de contato', value: leadData?.email },
                  { icon: '✓', label: 'Serviços selecionados', value: `${leadData?.briefing_data?.servicos?.length || 0} serviços` },
                  { icon: '✓', label: 'Informações completas', value: '100% preenchido' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-mint-50 rounded-lg border border-mint-200">
                    <span className="text-mint-600 font-bold text-xl mr-3">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">{item.label}</p>
                      <p className="text-sm text-neutral-600 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* O que acontece agora */}
            <div className="mb-10 p-6 bg-gradient-to-br from-medical-50 to-mint-50 rounded-xl border border-medical-200">
              <h3 className="font-heading text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-medical-600 mr-2" />
                O que acontece agora?
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-medical-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Efetue o pagamento</p>
                    <p className="text-sm text-neutral-600">PIX (instantâneo) ou cartão em até 12x</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-medical-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Iniciamos a criação</p>
                    <p className="text-sm text-neutral-600">Nossa equipe começa a trabalhar imediatamente</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-medical-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Receba para aprovação</p>
                    <p className="text-sm text-neutral-600">Em até 3 dias, você recebe o link do preview</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-medical-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Seu site no ar!</p>
                    <p className="text-sm text-neutral-600">Em até 7 dias, seu site estará publicado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="mb-10">
              <h3 className="font-heading text-xl font-bold text-neutral-900 mb-4">
                O que está incluído:
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: 'Entrega em até 7 dias', color: 'text-blue-600' },
                  { icon: Zap, label: '2 rodadas de ajustes', color: 'text-yellow-600' },
                  { icon: Calendar, label: 'Hospedagem grátis no 1º ano', color: 'text-green-600' },
                  { icon: Award, label: 'Suporte técnico incluso', color: 'text-purple-600' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-white rounded-lg border border-neutral-200">
                    <item.icon className={`w-5 h-5 ${item.color} mr-3 flex-shrink-0`} />
                    <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA - Botão Principal */}
            <div className="text-center">
              <Button
                onClick={handleGoToPayment}
                size="lg"
                className="w-full md:w-auto px-12 py-6 text-lg bg-gradient-to-r from-medical-500 to-medical-700 hover:from-medical-600 hover:to-medical-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Prosseguir para o Pagamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Garantia */}
              <div className="mt-6 flex items-center justify-center text-sm text-neutral-600">
                <Shield className="w-4 h-4 text-green-600 mr-2" />
                <span>
                  <strong>Garantia de 7 dias</strong> ou seu dinheiro de volta
                </span>
              </div>
            </div>
          </Card>

          {/* Valores - Preview */}
          <Card className="p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-2">Investimento</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">12x de R$ 297</p>
                  <p className="text-xs text-neutral-500">Total: R$ 3.564</p>
                </div>
                <span className="text-neutral-400">ou</span>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">R$ 2.970 à vista</p>
                  <p className="text-xs text-green-600">Economize R$ 594</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4">
                + R$ 97/mês de manutenção a partir do 2º ano
              </p>
            </div>
          </Card>

          {/* Nota sobre salvamento */}
          <div className="mt-6 text-center text-sm text-neutral-500">
            💾 Seu briefing foi salvo automaticamente. Você pode voltar depois se preferir.
          </div>
        </div>
      </div>

      <FooterNew />
    </div>
  );
};

export default BriefingComplete;
