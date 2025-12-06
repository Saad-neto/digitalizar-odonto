import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, CreditCard, Shield, Loader2 } from 'lucide-react';
import { getLeadById } from '@/lib/supabase';

// Inicializar Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');

  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);
  const [loadingLead, setLoadingLead] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Valores (em centavos)
  const valorEntrada = parseInt(import.meta.env.VITE_PRICE_ENTRADA || '24850'); // R$ 248,50
  const valorTotal = parseInt(import.meta.env.VITE_PRICE_TOTAL || '49700'); // R$ 497,00

  // Converter centavos para reais formatado
  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Calcular parcelas (12x com juros aproximados de 2.5% ao mês)
  const calcularParcela = (valor: number, parcelas: number = 12) => {
    // Taxa de juros aproximada (2.5% ao mês)
    const taxa = 0.025;
    const valorComJuros = valor * Math.pow(1 + taxa, parcelas);
    return Math.ceil(valorComJuros / parcelas);
  };

  const parcelaValor = calcularParcela(valorEntrada);

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
      } catch (err) {
        console.error('Erro ao carregar lead:', err);
        setError('Erro ao carregar informações. Por favor, tente novamente.');
        setLoadingLead(false);
      }
    };

    loadLead();
  }, [leadId]);

  const handlePayment = async () => {
    if (!leadId) {
      alert('Erro: ID do lead não encontrado.');
      return;
    }

    if (!stripePromise) {
      alert('Erro: Stripe não está configurado. Verifique a chave pública VITE_STRIPE_PUBLIC_KEY.');
      return;
    }

    setLoading(true);

    try {
      // Criar sessão de checkout no Stripe via Cloudflare Worker
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          tipo: 'entrada',
          valor: valorEntrada,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar sessão de pagamento');
      }

      const { sessionId } = await response.json();

      // Redirecionar para o Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe não pôde ser carregado');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      alert(`Erro: ${err.message || 'Não foi possível processar o pagamento. Tente novamente.'}`);
      setLoading(false);
    }
  };

  // Tela de carregamento
  if (loadingLead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error || !leadData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Ocorreu um erro inesperado.'}</p>
          <Button onClick={() => navigate('/briefing')} className="w-full">
            Voltar para o Briefing
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-8 md:p-12 shadow-xl">
        {/* Header - Briefing Recebido */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Briefing Recebido!
          </h1>
          <p className="text-gray-600 text-lg">
            Obrigado pelas informações, <span className="font-semibold">{leadData.nome}</span>!
          </p>
        </div>

        {/* Descrição */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <p className="text-gray-700 text-center leading-relaxed">
            Para iniciarmos a criação do seu{' '}
            <span className="font-semibold">site profissional</span>, efetue o pagamento da entrada:
          </p>
        </div>

        {/* Card de Valor */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 mb-6 text-white text-center shadow-lg">
          <p className="text-sm uppercase tracking-wider opacity-90 mb-2">
            Valor da Entrada (50%)
          </p>
          <div className="text-5xl md:text-6xl font-bold mb-4">
            {formatCurrency(valorEntrada)}
            <span className="text-lg font-normal ml-2">à vista</span>
          </div>
          <div className="text-lg opacity-90">
            ou <span className="font-semibold">12x de {formatCurrency(parcelaValor)}</span>*
          </div>
          <p className="text-xs opacity-75 mt-2">*juros do cartão</p>
        </div>

        {/* Benefícios */}
        <div className="space-y-3 mb-8">
          {[
            { icon: '✓', text: 'Site criado em 24h' },
            { icon: '✓', text: 'Até 3 revisões incluídas' },
            { icon: '✓', text: `Saldo de ${formatCurrency(valorTotal - valorEntrada)} só após aprovação` },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center text-gray-700">
              <span className="text-green-600 font-bold text-xl mr-3">{item.icon}</span>
              <span className="text-base">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Botão de Pagamento */}
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pagar com Cartão
            </>
          )}
        </Button>

        {/* Selo de Segurança */}
        <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
          <Shield className="w-4 h-4 mr-2" />
          <span>Pagamento 100% seguro via Stripe</span>
        </div>

        {/* Nota sobre modo teste */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-xs text-center">
              <strong>Modo Desenvolvimento:</strong> Configure VITE_STRIPE_PUBLIC_KEY no arquivo .env para habilitar pagamentos.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payment;
