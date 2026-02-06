import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSectionV2: React.FC = () => {
  const scrollToPlans = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('planos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-neutral-50 py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Headline - Mobile-First, Grande, Clara */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight">
              Domine a Pesquisa da Sua Cidade{' '}
              <span className="text-medical-600">em 7 Dias Úteis</span>
            </h1>

            {/* Subheadline - Benefício claro */}
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-2xl">
              <strong className="text-neutral-900">Só paga depois de aprovar o layout.</strong> Zero
              risco. Construa uma presença digital sólida que atrai pacientes todos os dias.
            </p>

            {/* Key Benefits */}
            <div className="space-y-3">
              {[
                'Design 100% personalizado para sua especialidade',
                'Hospedagem grátis para sempre',
                'SEO otimizado para Google',
                'Pronto em 7 dias',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0" />
                  <span className="text-base md:text-lg text-neutral-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#planos"
                onClick={scrollToPlans}
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 bg-medical-500 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] min-h-[56px]"
              >
                Ver Planos e Preços
                <ArrowRight size={20} />
              </a>

              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 border-2 border-neutral-300 text-neutral-700 text-base md:text-lg font-semibold rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all duration-300 min-h-[56px]"
              >
                Tirar Dúvidas
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 text-neutral-600 text-sm md:text-base pt-2">
              <Shield size={20} className="text-mint-500 flex-shrink-0" />
              <span>Garantia de 7 dias ou reembolso total</span>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100">
                <div className="text-4xl md:text-5xl font-bold text-medical-600 mb-2">R$ 0</div>
                <div className="text-sm md:text-base text-neutral-600">
                  Sem entrada <br />
                  <strong className="text-neutral-900">Paga após aprovar</strong>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-mint-100">
                <div className="text-4xl md:text-5xl font-bold text-mint-600 mb-2">7</div>
                <div className="text-sm md:text-base text-neutral-600">
                  Pronto em <br />
                  <strong className="text-neutral-900">7 dias</strong>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100">
                <div className="text-4xl md:text-5xl font-bold text-medical-600 mb-2">100%</div>
                <div className="text-sm md:text-base text-neutral-600">
                  Design <br />
                  <strong className="text-neutral-900">Personalizado</strong>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-mint-100">
                <div className="text-4xl md:text-5xl font-bold text-mint-600 mb-2">∞</div>
                <div className="text-sm md:text-base text-neutral-600">
                  Hospedagem <br />
                  <strong className="text-neutral-900">Grátis Sempre</strong>
                </div>
              </div>
            </div>

            {/* Highlight Banner */}
            <div className="mt-6 bg-gradient-to-r from-medical-500 to-medical-600 rounded-2xl p-6 text-center shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield size={24} className="text-white" />
                <p className="font-bold text-base md:text-lg text-white">Pagamento Protegido</p>
              </div>
              <p className="text-sm md:text-base font-semibold text-white">
                Só paga depois de aprovar o layout. Não gostou? Não paga.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionV2;
