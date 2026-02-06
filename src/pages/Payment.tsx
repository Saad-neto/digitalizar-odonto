import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, CreditCard, Shield, Loader2, Copy, Check, QrCode, Smartphone } from 'lucide-react';
import { getLeadById } from '@/lib/supabase';
import { createAsaasPaymentForLead, isAsaasConfigured, getAsaasEnvironment, type AsaasPixQrCode } from '@/lib/asaas';
import HeaderNew from '@/components/redesign/HeaderNew';
import FooterNew from '@/components/redesign/FooterNew';
import { trackPageView, trackBeginCheckout } from '@/lib/analytics';

type PaymentMethod = 'PIX' | 'CREDIT_CARD';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');

  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);
  const [loadingLead, setLoadingLead] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado do pagamento
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [pixQrCode, setPixQrCode] = useState<AsaasPixQrCode | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Valores (em reais) - NOVO MODELO
  const valorTotal = 2970; // R$ 2.970,00 à vista
  const valorParcela = 297; // R$ 297,00 x 12 meses
  const numeroParcelas = 12;

  // Converter para formatado
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Carregar dados do lead
  useEffect(() => {
    const loadLead = async () => {
      if (!leadId) {
        setError('ID do lead não encontrado. Você foi redirecionado do briefing?');
        setLoadingLead(false);
        return;
      }

      try {
        const lead = await getLeadById(leadId);
        setLeadData(lead);
        setLoadingLead(false);

        // Rastrear visualização da página de pagamento
        if (lead) {
          trackPageView('/pagamento', 'Página de Pagamento');
        }
      } catch (err) {
        console.error('Erro ao carregar lead:', err);
        setError('Erro ao carregar informações. Por favor, tente novamente.');
        setLoadingLead(false);
      }
    };

    loadLead();
  }, [leadId]);

  // Copiar código PIX
  const handleCopyPix = async () => {
    if (pixQrCode?.payload) {
      await navigator.clipboard.writeText(pixQrCode.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Criar pagamento
  const handleCreatePayment = async () => {
    if (!leadId || !leadData) {
      alert('Erro: Dados do lead não encontrados.');
      return;
    }

    if (!isAsaasConfigured()) {
      alert('Erro: Asaas não está configurado. Verifique VITE_ASAAS_API_KEY.');
      return;
    }

    // Rastrear início do checkout
    trackBeginCheckout(leadId, valorTotal);

    setLoading(true);

    try {
      console.log('🔄 Criando pagamento no Asaas...');

      const result = await createAsaasPaymentForLead({
        leadId,
        nome: leadData.nome || 'Cliente',
        email: leadData.email || '',
        whatsapp: leadData.whatsapp || '',
        valor: valorTotal,
        billingType: paymentMethod,
      });

      if (!result.success) {
        throw new Error(result.error || 'Não foi possível criar o pagamento');
      }

      console.log('✅ Pagamento criado:', result);

      // Se for PIX, mostrar QR Code
      if (paymentMethod === 'PIX' && result.pixQrCode) {
        setPixQrCode(result.pixQrCode);
        setPaymentCreated(true);
      }

      // Se for Cartão, redirecionar para URL do Asaas
      if (paymentMethod === 'CREDIT_CARD' && result.invoiceUrl) {
        setInvoiceUrl(result.invoiceUrl);
        setPaymentCreated(true);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('❌ Erro ao processar pagamento:', err);
      alert(`Erro: ${err.message || 'Não foi possível processar o pagamento. Tente novamente.'}`);
      setLoading(false);
    }
  };

  // Tela de carregamento
  if (loadingLead) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNew />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-medical-600 mx-auto mb-4" />
            <p className="text-neutral-600">Carregando informações...</p>
          </div>
        </div>
        <FooterNew />
      </div>
    );
  }

  // Tela de erro
  if (error || !leadData) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNew />
        <div className="flex items-center justify-center py-16 px-4">
          <Card className="max-w-md w-full p-8 text-center border border-neutral-200">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-4">Ops!</h2>
            <p className="text-neutral-600 mb-6">{error || 'Ocorreu um erro inesperado.'}</p>
            <Button onClick={() => navigate('/briefing')} className="w-full bg-medical-500 hover:bg-medical-600">
              Voltar para o Briefing
            </Button>
          </Card>
        </div>
        <FooterNew />
      </div>
    );
  }

  // Tela de QR Code PIX
  if (paymentCreated && paymentMethod === 'PIX' && pixQrCode) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNew />
        <div className="flex items-center justify-center py-16 px-4">
          <Card className="max-w-lg w-full p-8 md:p-10 shadow-xl border border-neutral-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <QrCode className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                Pague com PIX
              </h1>
              <p className="text-neutral-600">
                Escaneie o QR Code ou copie o código
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white border-2 border-neutral-200 rounded-xl p-6 mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src={`data:image/png;base64,${pixQrCode.encodedImage}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              </div>

              {/* Valor */}
              <div className="text-center mb-4">
                <p className="text-sm text-neutral-500 mb-1">Valor a pagar</p>
                <p className="text-3xl font-bold text-neutral-900">{formatCurrency(valorTotal)}</p>
              </div>

              {/* Código PIX */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-xs text-neutral-500 mb-2 text-center">Código PIX (copia e cola)</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixQrCode.payload}
                    className="flex-1 text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 truncate"
                  />
                  <Button
                    onClick={handleCopyPix}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 text-center mt-2">Código copiado!</p>
                )}
              </div>
            </div>

            {/* Instruções */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-neutral-600">
                <Smartphone className="w-5 h-5 text-medical-500 flex-shrink-0 mt-0.5" />
                <span>Abra o app do seu banco e escolha pagar com PIX</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-neutral-600">
                <QrCode className="w-5 h-5 text-medical-500 flex-shrink-0 mt-0.5" />
                <span>Escaneie o QR Code ou cole o código copiado</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-neutral-600">
                <CheckCircle2 className="w-5 h-5 text-medical-500 flex-shrink-0 mt-0.5" />
                <span>Confirme o pagamento - você receberá confirmação por email</span>
              </div>
            </div>

            {/* Aviso */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-sm text-amber-800">
                <strong>Importante:</strong> Após o pagamento, você receberá um email de confirmação
                e entraremos em contato em até 24h para iniciar seu site.
              </p>
            </div>

            {/* Selo de Segurança */}
            <div className="mt-6 flex items-center justify-center text-neutral-500 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              <span>Pagamento processado com segurança via Asaas</span>
            </div>
          </Card>
        </div>
        <FooterNew />
      </div>
    );
  }

  // Tela de Cartão (redireciona para checkout Asaas)
  if (paymentCreated && invoiceUrl) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNew />
        <div className="flex items-center justify-center py-16 px-4">
          <Card className="max-w-lg w-full p-8 md:p-10 shadow-xl border border-neutral-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-100 rounded-full mb-4">
              <CreditCard className="w-10 h-10 text-medical-600" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Finalize o Pagamento
            </h1>
            <p className="text-neutral-600 mb-6">
              Clique no botão abaixo para finalizar o pagamento com cartão de crédito.
              Você pode parcelar em até 12x sem juros.
            </p>

            <Button
              onClick={() => window.open(invoiceUrl, '_blank')}
              className="w-full bg-medical-500 hover:bg-medical-600 text-white py-6 text-lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar com Cartão (até 12x)
            </Button>

            <div className="mt-6 flex items-center justify-center text-neutral-500 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              <span>Pagamento processado com segurança via Asaas</span>
            </div>
          </Card>
        </div>
        <FooterNew />
      </div>
    );
  }

  // Tela principal - Escolha de método de pagamento
  return (
    <div className="min-h-screen bg-white">
      <HeaderNew />
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="max-w-xl w-full p-8 md:p-12 shadow-xl border border-neutral-200">
          {/* Header - Briefing Recebido */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-mint-600" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
              Briefing Recebido!
            </h1>
            <p className="text-neutral-600 text-lg">
              Obrigado pelas informações, <span className="font-semibold">{leadData.nome}</span>!
            </p>
          </div>

          {/* Descrição */}
          <div className="bg-medical-50 border border-medical-100 rounded-lg p-6 mb-8">
            <p className="text-neutral-700 text-center leading-relaxed">
              Para iniciarmos a criação do seu{' '}
              <span className="font-semibold">site profissional</span>, escolha a forma de pagamento:
            </p>
            <p className="text-sm text-neutral-600 text-center mt-3">
              ✨ Seu site entra no ar logo após a confirmação do pagamento!
            </p>
          </div>

          {/* Card de Valor */}
          <div className="bg-gradient-to-br from-medical-500 to-medical-700 rounded-xl p-8 mb-6 text-white text-center shadow-lg">
            <p className="text-sm uppercase tracking-wider opacity-90 mb-2">
              Investimento - Plano Único
            </p>
            {/* Destaque: Parcelado */}
            <div className="mb-4">
              <div className="text-5xl md:text-6xl font-bold mb-1">
                {numeroParcelas}x de {formatCurrency(valorParcela)}
              </div>
              <p className="text-sm opacity-90">
                Total: {formatCurrency(valorParcela * numeroParcelas)}
              </p>
            </div>
            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-medical-600 px-2 text-white/90">ou</span>
              </div>
            </div>
            {/* Alternativa: À vista */}
            <div>
              <p className="text-lg font-semibold">
                {formatCurrency(valorTotal)} à vista
              </p>
              <p className="text-xs opacity-75 mt-1">
                Economize {formatCurrency((valorParcela * numeroParcelas) - valorTotal)}
              </p>
            </div>
            {/* Info adicional */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs opacity-90">
                + R$ 97/mês de manutenção a partir do 2º ano
              </p>
              <p className="text-xs opacity-75 mt-1">
                (hospedagem + domínio + suporte)
              </p>
            </div>
          </div>

          {/* Seleção de Método de Pagamento */}
          <div className="mb-6">
            <p className="text-sm font-medium text-neutral-700 mb-3">Escolha a forma de pagamento:</p>
            <div className="grid grid-cols-2 gap-4">
              {/* PIX */}
              <button
                onClick={() => setPaymentMethod('PIX')}
                className={`p-5 rounded-xl border-2 transition-all ${
                  paymentMethod === 'PIX'
                    ? 'border-medical-500 bg-medical-50'
                    : 'border-neutral-200 hover:border-medical-300'
                }`}
              >
                <QrCode className={`w-10 h-10 mx-auto mb-2 ${paymentMethod === 'PIX' ? 'text-medical-600' : 'text-neutral-400'}`} />
                <p className={`text-base font-semibold ${paymentMethod === 'PIX' ? 'text-medical-700' : 'text-neutral-600'}`}>PIX</p>
                <p className="text-sm text-neutral-500">Aprovação instantânea</p>
              </button>

              {/* Cartão */}
              <button
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-5 rounded-xl border-2 transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-medical-500 bg-medical-50'
                    : 'border-neutral-200 hover:border-medical-300'
                }`}
              >
                <CreditCard className={`w-10 h-10 mx-auto mb-2 ${paymentMethod === 'CREDIT_CARD' ? 'text-medical-600' : 'text-neutral-400'}`} />
                <p className={`text-base font-semibold ${paymentMethod === 'CREDIT_CARD' ? 'text-medical-700' : 'text-neutral-600'}`}>Cartão</p>
                <p className="text-sm text-neutral-500">Até 12x sem juros</p>
              </button>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-3 mb-8">
            {[
              { icon: '✓', text: 'Site entregue em até 7 dias' },
              { icon: '✓', text: '2 rodadas de ajustes incluídas' },
              { icon: '✓', text: 'Hospedagem + domínio grátis no 1º ano' },
              { icon: '✓', text: 'Suporte técnico por 1 ano' },
              { icon: '✓', text: 'Garantia de 7 dias ou seu dinheiro de volta' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center text-neutral-700">
                <span className="text-mint-600 font-bold text-xl mr-3">{item.icon}</span>
                <span className="text-base">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Botão de Pagamento */}
          <Button
            onClick={handleCreatePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-medical-500 to-medical-700 hover:from-medical-600 hover:to-medical-800 text-white font-semibold text-lg py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                {paymentMethod === 'PIX' && <QrCode className="w-5 h-5 mr-2" />}
                {paymentMethod === 'CREDIT_CARD' && <CreditCard className="w-5 h-5 mr-2" />}
                {paymentMethod === 'PIX' && 'Gerar QR Code PIX'}
                {paymentMethod === 'CREDIT_CARD' && 'Pagar com Cartão (até 12x)'}
              </>
            )}
          </Button>

          {/* Selo de Segurança */}
          <div className="mt-6 flex items-center justify-center text-neutral-500 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            <span>Pagamento 100% seguro via Asaas</span>
          </div>

          {/* Nota sobre ambiente */}
          {getAsaasEnvironment() === 'sandbox' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-xs text-center">
                <strong>Modo Sandbox:</strong> Ambiente de testes. Nenhuma cobrança real será feita.
              </p>
            </div>
          )}
        </Card>
      </div>
      <FooterNew />
    </div>
  );
};

export default Payment;
