import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, Sparkles, ArrowRight } from 'lucide-react';
import Counter from '../../ui/counter';

const OffersSectionNew: React.FC = () => {
  const included = [
    "Design 100% personalizado para sua especialidade",
    "Responsivo (perfeito em celular, tablet e desktop)",
    "Otimizado para Google (SEO básico configurado)",
    "Integração WhatsApp para facilitar contato",
    "Formulários de contato otimizados para conversão",
    "12 meses de hospedagem profissional GRÁTIS",
    "SSL (certificado de segurança) incluído",
    "Suporte técnico por 30 dias após entrega"
  ];

  const bonus = [
    {
      title: "Google Analytics configurado",
      description: "Acompanhe quantas pessoas visitam seu site"
    },
    {
      title: "Meta Pixel (Facebook/Instagram)",
      description: "Retargeting para futuros anúncios (opcional)"
    },
    {
      title: "Otimização de Imagens",
      description: "Site carrega rápido, melhor experiência"
    }
  ];

  return (
    <section className="py-section-lg bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-700 rounded-full text-body-sm font-medium mb-6">
            <Sparkles size={16} />
            Oferta de Lançamento
          </div>

          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Tudo que Você Precisa para{' '}
            <span className="text-medical-600">Começar a Atrair Pacientes Online</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Site profissional completo, sem mensalidades abusivas, sem surpresas.
            Pagamento único de R$ 497 (ou 12x no cartão) e pronto.
          </p>
        </div>

        {/* Main Offer Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-medical-50 to-mint-50 rounded-2xl p-8 lg:p-12 border-2 border-medical-200 shadow-xl">
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
              {/* Left - Price */}
              <div className="text-center lg:text-left">
                <p className="text-body-sm text-neutral-600 mb-2">Investimento único:</p>

                {/* Preço riscado */}
                <div className="text-neutral-400 text-title-md line-through mb-2">
                  R$ 997
                </div>

                {/* Seta para baixo */}
                <div className="flex justify-center lg:justify-start mb-4">
                  <svg className="w-8 h-8 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Preço real */}
                <div className="text-[3.5rem] font-bold text-medical-600 leading-none mb-3">
                  R$ 497
                </div>

                <p className="text-body-md text-neutral-600 mb-4">
                  ou 12x de <strong className="text-medical-600">R$ 49,70</strong> no cartão
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-500 text-white rounded-full text-body-sm font-semibold">
                  50% OFF - Lançamento
                </div>
              </div>

              {/* Right - Payment Guarantee */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-mint-500">
                <div className="flex items-start gap-3 mb-4">
                  <Shield size={28} className="text-mint-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-heading text-title-md text-neutral-900 mb-2">
                      Pagamento SOMENTE Após Aprovação
                    </h3>
                    <p className="text-body-md text-neutral-700 leading-relaxed">
                      Você recebe o layout, revisa, aprova (ou pede ajustes) e só depois paga.
                      <strong className="text-mint-700"> Zero risco. Não gostou? Não paga.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency Badge - Subtle */}
            <div className="text-center mb-8 pb-8 border-b border-neutral-200">
              <p className="text-body-md text-neutral-700">
                Restam apenas <Counter targetNumber={7} duration={800} />{' '}
                <strong className="text-medical-600">vagas neste mês</strong> com este desconto
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="font-heading text-title-lg text-neutral-900 mb-6 text-center">
                O Que Está Incluído:
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {included.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-mint-500 flex-shrink-0 mt-0.5" />
                    <span className="text-body-md text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Bonus Section */}
              <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gold-300">
                <h4 className="font-heading text-title-md text-neutral-900 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-gold-500" />
                  Bônus Inclusos (sem custo adicional):
                </h4>

                <div className="grid md:grid-cols-3 gap-4">
                  {bonus.map((item, index) => (
                    <div key={index} className="text-center">
                      <p className="font-semibold text-neutral-900 text-body-md mb-1">
                        {item.title}
                      </p>
                      <p className="text-body-sm text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Link
                to="/briefing"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Garantir Minha Vaga Agora
                <ArrowRight size={22} />
              </Link>

              <p className="text-body-sm text-neutral-500 mt-4">
                Prazo de entrega: até 7 dias úteis após aprovação do layout
              </p>
            </div>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-body-md text-neutral-600 mb-4">
            Compare: agências cobram entre R$ 2.000 - R$ 5.000 + mensalidades de R$ 200-500.
          </p>
          <p className="text-body-lg font-semibold text-medical-600">
            Aqui você paga R$ 497 uma única vez. Sem mensalidade. Sem surpresas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OffersSectionNew;
