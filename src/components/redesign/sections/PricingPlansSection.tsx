import React from 'react';
import { Check, X, Sparkles, TrendingUp, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPlansSection: React.FC = () => {
  const plans = [
    {
      id: 'site-profissional',
      name: 'Site Profissional',
      price: 997,
      installments: '12x de R$ 99,70',
      description: 'Tudo que você precisa para marcar presença online',
      badge: null,
      features: [
        { name: 'Design 100% personalizado', included: true },
        { name: 'Hospedagem incluída no 1º ano', included: true },
        { name: 'Domínio .com.br incluído (1º ano)', included: true },
        { name: 'SEO básico otimizado', included: true },
        { name: 'Responsivo (mobile/tablet/desktop)', included: true },
        { name: 'Formulário de contato', included: true },
        { name: 'Integração WhatsApp', included: true },
        { name: '2 rodadas de ajustes', included: true },
        { name: 'Suporte 30 dias', included: true },
        { name: 'Blog integrado com CMS', included: false },
        { name: '5 posts premium otimizados para SEO', included: false },
        { name: 'Google Analytics + Search Console', included: false },
        { name: 'Dashboard de métricas', included: false },
        { name: '3 rodadas de ajustes', included: false },
        { name: 'Suporte 60 dias', included: false },
      ],
      ctaText: 'Começar com Site',
      ctaLink: '/briefing?plano=site-profissional',
      highlight: false,
    },
    {
      id: 'site-agendamento',
      name: 'Site + Agendamento',
      price: 1497,
      installments: '12x de R$ 149,70',
      description: 'Para clínicas que querem automatizar marcações de consultas',
      badge: 'Recomendado',
      features: [
        { name: 'Design 100% personalizado', included: true },
        { name: 'Hospedagem incluída no 1º ano', included: true },
        { name: 'Domínio .com.br incluído (1º ano)', included: true },
        { name: 'SEO avançado (pesquisa de palavras-chave)', included: true },
        { name: 'Responsivo (mobile/tablet/desktop)', included: true },
        { name: 'Formulário de contato', included: true },
        { name: 'Integração WhatsApp', included: true },
        { name: 'Sistema de agendamento online', included: true },
        { name: 'Calendário integrado', included: true },
        { name: 'Confirmação automática por WhatsApp', included: true },
        { name: 'Google Analytics + Search Console', included: true },
        { name: '4 rodadas de ajustes', included: true },
        { name: 'Suporte 90 dias', included: true },
        { name: 'Blog integrado com CMS', included: false },
        { name: 'Dashboard de métricas avançado', included: false },
      ],
      ctaText: 'Começar com Agendamento',
      ctaLink: '/briefing?plano=site-agendamento',
      highlight: true,
    },
    {
      id: 'site-completo',
      name: 'Site Completo',
      price: 1997,
      installments: '12x de R$ 199,70',
      description: 'Solução completa: site, blog e agendamento integrados',
      badge: 'Mais Completo',
      features: [
        { name: 'Design 100% personalizado', included: true },
        { name: 'Hospedagem incluída no 1º ano', included: true },
        { name: 'Domínio .com.br incluído (1º ano)', included: true },
        { name: 'SEO avançado (pesquisa de palavras-chave)', included: true },
        { name: 'Responsivo (mobile/tablet/desktop)', included: true },
        { name: 'Formulário de contato', included: true },
        { name: 'Integração WhatsApp', included: true },
        { name: 'Sistema de agendamento online', included: true },
        { name: 'Calendário integrado', included: true },
        { name: 'Confirmação automática por WhatsApp', included: true },
        { name: 'Google Analytics + Search Console', included: true },
        { name: 'Blog integrado com CMS', included: true },
        { name: 'Dashboard de métricas avançado', included: true },
        { name: '5 rodadas de ajustes', included: true },
        { name: 'Suporte 120 dias', included: true },
        { name: 'Prioridade no atendimento', included: true },
      ],
      ctaText: 'Começar com Tudo',
      ctaLink: '/briefing?plano=site-completo',
      highlight: false,
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Escolha o Plano Ideal <span className="text-medical-600">Para Você</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Todos os planos incluem design personalizado, hospedagem grátis e{' '}
            <strong className="text-medical-600">garantia de 7 dias</strong>.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto pt-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg ${
                plan.highlight ? 'ring-2 ring-medical-500 lg:scale-105 mt-4' : 'border border-neutral-200'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    {plan.id === 'site-completo' ? <Crown size={16} /> : <Sparkles size={16} />}
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8 md:p-10">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-heading text-neutral-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-neutral-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-5xl md:text-6xl font-bold text-medical-600 leading-none mb-2">
                      R$ {plan.price}
                    </div>
                    <p className="text-neutral-600">{plan.installments} no cartão</p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={plan.ctaLink}
                    className={`inline-block w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all ${
                      plan.highlight
                        ? 'bg-medical-500 hover:bg-medical-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-mint-500 hover:bg-mint-600 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">
                    O que está incluído:
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check size={20} className="text-mint-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X size={20} className="text-neutral-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm md:text-base ${
                            feature.included ? 'text-neutral-700' : 'text-neutral-400 line-through'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Badge (only for premium) */}
              {plan.highlight && (
                <div className="bg-gradient-to-r from-medical-50 to-mint-50 px-8 py-4 text-center border-t border-medical-100">
                  <div className="flex items-center justify-center gap-2 text-medical-700 font-medium">
                    <TrendingUp size={18} />
                    <span className="text-sm">Melhor custo-benefício para crescimento</span>
                  </div>
                </div>
              )}

              {/* Footer Badge (only for complete plan) */}
              {plan.id === 'site-completo' && (
                <div className="bg-gradient-to-r from-medical-50 to-mint-50 px-8 py-4 text-center border-t border-medical-100">
                  <div className="flex items-center justify-center gap-2 text-medical-700 font-medium">
                    <Crown size={18} />
                    <span className="text-sm">Solução completa para clínicas que querem crescer</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600 max-w-2xl mx-auto">
            💡 <strong>Não tem certeza qual escolher?</strong> Comece com o Site Profissional e faça
            upgrade depois. Ou{' '}
            <a
              href="https://wa.me/5583999999999?text=Olá!%20Preciso%20de%20ajuda%20para%20escolher%20o%20plano%20ideal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-medical-600 hover:text-medical-700 font-semibold underline"
            >
              fale com a gente no WhatsApp
            </a>
            .
          </p>

          {/* Nota sobre manutenção */}
          <p className="text-sm text-neutral-500 max-w-2xl mx-auto mt-6 pt-6 border-t border-neutral-200">
            * Hospedagem, domínio .com.br e suporte técnico inclusos no 1º ano.
            A partir do 2º ano: taxa de manutenção de <strong className="text-neutral-700">R$ 297/ano</strong> (à vista) ou 12x no cartão.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlansSection;
