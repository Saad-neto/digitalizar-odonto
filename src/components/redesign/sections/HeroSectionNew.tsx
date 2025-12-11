import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import Counter from '../../ui/counter';

const HeroSectionNew: React.FC = () => {
  return (
    <section className="relative bg-white py-section-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge de urgência discreto */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-50 text-medical-700 rounded-full text-body-sm font-medium">
              <span className="w-2 h-2 bg-medical-500 rounded-full animate-pulse"></span>
              Restam apenas <Counter targetNumber={7} duration={800} /> vagas com 50% OFF
            </div>

            {/* Headline - Serif, Grande, Dor Financeira */}
            <h1 className="font-heading text-display text-neutral-900 leading-tight">
              Perdendo R$ 15 Mil/Mês em Pacientes Particulares Enquanto{' '}
              <span className="text-medical-600">
                Concorrentes com Site Profissional Lotam a Agenda?
              </span>
            </h1>

            {/* Subheadline - Sans, Corpo */}
            <p className="text-body-lg text-neutral-700 leading-relaxed max-w-2xl">
              Pare de perder pacientes particulares para concorrentes com presença digital.{' '}
              <strong className="text-medical-600">Site profissional em até 7 dias úteis</strong>{' '}
              que atrai pacientes de alto valor e posiciona você como autoridade.{' '}
              <strong className="text-neutral-900">Só paga depois de aprovar o layout - zero risco.</strong>
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/briefing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                Quero Atrair Mais Pacientes Particulares
                <ArrowRight size={20} />
              </Link>

              <a
                href="https://wa.me/5518317510052?text=Olá!%20Tenho%20dúvidas%20sobre%20o%20site%20odontológico"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-neutral-300 text-neutral-700 text-body-lg font-semibold rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all duration-300"
              >
                Tenho Dúvidas
              </a>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 text-neutral-600 text-body-sm">
              <Shield size={20} className="text-mint-500" />
              <span>Garantia de satisfação ou reembolso total</span>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-4 border-t border-neutral-200">
              <div>
                <div className="text-title-md font-bold text-neutral-900">
                  <Counter targetNumber={500} suffix="+" duration={1000} />
                </div>
                <div className="text-body-sm text-neutral-600">Sites entregues</div>
              </div>
              <div>
                <div className="text-title-md font-bold text-neutral-900">98.7%</div>
                <div className="text-body-sm text-neutral-600">Taxa de aprovação</div>
              </div>
              <div>
                <div className="text-title-md font-bold text-neutral-900">4.9/5</div>
                <div className="text-body-sm text-neutral-600">Avaliação média</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Card de Preço Destacado */}
            <div className="relative bg-white border-2 border-medical-200 rounded-2xl p-8 shadow-lg">
              {/* Badge Desconto */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-medical-500 text-white px-6 py-2 rounded-full text-body-sm font-bold shadow-md">
                  50% OFF - LANÇAMENTO
                </div>
              </div>

              <div className="text-center space-y-6 pt-4">
                <h3 className="text-title-lg font-heading text-neutral-900">
                  Oferta Especial de Lançamento
                </h3>

                {/* Preço riscado */}
                <div className="text-neutral-400 text-title-md line-through">
                  R$ 997
                </div>

                {/* Seta */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg className="w-8 h-8 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                {/* Preço destaque */}
                <div>
                  <div className="text-[4rem] font-bold text-medical-600 leading-none">
                    R$ 497
                  </div>
                  <p className="text-body-md text-neutral-600 mt-2">
                    ou 12x de R$ 49,70 no cartão
                  </p>
                </div>

                {/* Destaque pagamento */}
                <div className="bg-mint-50 border-2 border-mint-500 rounded-lg p-4">
                  <p className="font-semibold text-mint-900 flex items-center justify-center gap-2 text-body-md">
                    <Shield size={20} />
                    Pagamento SOMENTE após você aprovar o layout
                  </p>
                  <p className="text-mint-800 text-body-sm mt-2 font-medium">
                    Zero risco. Não gostou? Não paga.
                  </p>
                </div>

                {/* Lista inclusos - enxuta */}
                <div className="text-left space-y-2 pt-4">
                  {[
                    'Design personalizado para sua especialidade',
                    'Responsivo (celular, tablet, desktop)',
                    'Otimizado para Google (SEO básico)',
                    'Hospedagem GRÁTIS por 12 meses',
                    'Botão WhatsApp integrado',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-mint-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-body-sm text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA secundário */}
                <Link
                  to="/briefing"
                  className="block w-full px-6 py-3 bg-medical-500 text-white font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 text-center"
                >
                  Começar Agora
                </Link>

                <p className="text-body-sm text-neutral-500">
                  Prazo de entrega: até 7 dias úteis após aprovação do layout
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
