import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Sparkles } from 'lucide-react';

const HeroSectionNew: React.FC = () => {
  return (
    <section className="relative bg-white py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Headline - Mobile-First, Grande, Clara */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight">
              Site Profissional para Dentistas{' '}
              <span className="text-medical-600">
                em 7 Dias Úteis
              </span>
            </h1>

            {/* Subheadline - Benefício claro */}
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-2xl">
              <strong className="text-neutral-900">Só paga depois de aprovar o layout.</strong> Zero risco.
              Design personalizado, hospedagem grátis para sempre e SEO otimizado.
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/briefing"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 bg-medical-500 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] min-h-[56px]"
              >
                Preencher Briefing Agora
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 border-2 border-neutral-300 text-neutral-700 text-base md:text-lg font-semibold rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all duration-300 min-h-[56px]"
              >
                Tirar Dúvidas
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 text-neutral-600 text-sm md:text-base">
              <Shield size={20} className="text-mint-500 flex-shrink-0" />
              <span>Garantia de 7 dias ou reembolso total</span>
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="relative">
            {/* Card de Preço Destacado */}
            <div className="relative bg-white border-2 border-medical-200 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="text-center space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-heading text-neutral-900">
                  Investimento
                </h3>

                {/* Preço destaque - GIGANTE no mobile */}
                <div>
                  <div className="text-6xl md:text-7xl lg:text-[5rem] font-bold text-medical-600 leading-none">
                    R$ 997
                  </div>
                  <p className="text-base md:text-lg text-neutral-600 mt-2">
                    ou 12x de R$ 99,70 no cartão
                  </p>
                </div>

                {/* Destaque pagamento */}
                <div className="bg-mint-50 border-2 border-mint-500 rounded-lg p-4">
                  <p className="font-semibold text-mint-900 flex items-center justify-center gap-2 text-sm md:text-base">
                    <Shield size={20} className="flex-shrink-0" />
                    Pagamento SOMENTE após você aprovar o layout
                  </p>
                  <p className="text-mint-800 text-sm mt-2 font-medium">
                    Zero risco. Não gostou? Não paga.
                  </p>
                </div>

                {/* Lista inclusos - enxuta */}
                <div className="text-left space-y-2 pt-4">
                  {[
                    'Design personalizado para sua especialidade',
                    'Responsivo (celular, tablet, desktop)',
                    'Otimização básica para Google (SEO)',
                    'Hospedagem gratuita para sempre',
                    'Botão WhatsApp integrado',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-mint-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm md:text-base text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA secundário */}
                <Link
                  to="/briefing"
                  className="block w-full px-6 py-4 bg-medical-500 text-white font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 text-center text-base md:text-lg min-h-[56px] flex items-center justify-center"
                >
                  Começar Agora
                </Link>

                <p className="text-xs md:text-sm text-neutral-500">
                  Prazo de entrega: até 7 dias após aprovação do layout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
