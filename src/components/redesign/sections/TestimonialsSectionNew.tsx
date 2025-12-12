import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Shield, Zap, Heart, TrendingUp } from 'lucide-react';

const TestimonialsSectionNew: React.FC = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Atenção 100% Exclusiva",
      description: "Você não será 'mais um cliente'. Como estamos começando, cada site recebe nossa dedicação total. Sem produção em massa.",
      highlight: "Dedicação máxima"
    },
    {
      icon: TrendingUp,
      title: "Preço que Nunca Mais Volta",
      description: "R$ 497 é nosso preço de fundador. Após os primeiros 10 clientes, o preço sobe para R$ 997. Aproveite agora.",
      highlight: "Economia de R$ 500"
    },
    {
      icon: Shield,
      title: "Risco Zero Absoluto",
      description: "Não gostou do layout? Não paga. Simples assim. Assumimos todo o risco porque temos confiança no nosso trabalho.",
      highlight: "Garantia total"
    },
    {
      icon: Zap,
      title: "Motivação Extra",
      description: "Precisamos do seu depoimento e case de sucesso. Por isso, vamos fazer o MELHOR trabalho possível para impressionar você.",
      highlight: "Fome de resultado"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-50 text-medical-700 rounded-full text-sm md:text-base font-medium mb-6">
            <Star size={16} className="text-medical-500" />
            Por Que Nos Escolher?
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6 leading-tight">
            Por Que Contratar Uma{' '}
            <span className="text-medical-600">Empresa que Está Começando?</span>
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Somos honestos: estamos no início. Mas isso é uma <strong>vantagem para você</strong>.
            Veja por quê:
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 hover:border-medical-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 bg-medical-50 rounded-xl flex items-center justify-center mb-6">
                <benefit.icon size={32} className="text-medical-600" />
              </div>

              {/* Highlight Badge */}
              <div className="inline-block px-3 py-1 bg-mint-50 text-mint-700 rounded-full text-xs md:text-sm font-medium mb-4">
                {benefit.highlight}
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl md:text-2xl text-neutral-900 mb-4">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Honest Box - "O que esperamos de você" */}
        <div className="bg-gradient-to-br from-medical-50 to-mint-50 rounded-2xl p-6 md:p-12 border border-medical-200 mb-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-heading text-2xl md:text-3xl text-neutral-900 mb-6 text-center">
              O Que Esperamos de Você (Em Troca do Preço Especial)
            </h3>

            <div className="space-y-4 text-base md:text-lg text-neutral-700 leading-relaxed">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-medical-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p>
                  <strong>Feedback honesto:</strong> Queremos saber o que funcionou e o que pode melhorar.
                  Sua opinião é valiosa para crescermos.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-medical-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p>
                  <strong>Depoimento (se ficar satisfeito):</strong> Se o resultado for bom, gostaríamos
                  de usar seu depoimento e screenshot do site como exemplo (podemos ocultar dados se preferir).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-medical-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p>
                  <strong>Paciência com nosso processo:</strong> Estamos aprendendo e melhorando.
                  Se algo demorar um pouco mais, agradecemos sua compreensão.
                </p>
              </div>

              <p className="text-center pt-6 font-semibold text-medical-700 text-lg md:text-xl">
                Em troca: preço 50% menor + atenção exclusiva + garantia absoluta.
              </p>
            </div>
          </div>
        </div>

        {/* Future Section - "Em breve, depoimentos reais aqui" */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border-2 border-dashed border-medical-200 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-medical-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-medical-500" />
            </div>

            <h3 className="font-heading text-xl md:text-2xl text-neutral-900 mb-4">
              Seja Um dos Primeiros Clientes
            </h3>

            <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
              Ainda não temos depoimentos porque estamos começando. Mas isso significa que você
              receberá atenção que nunca mais poderemos dar quando estivermos com agenda cheia.
              <strong className="text-medical-600"> Seja nosso case de sucesso.</strong>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="font-heading text-2xl md:text-3xl text-neutral-900 mb-6">
            Pronto para aproveitar o preço de fundador?
          </h3>

          <Link
            to="/briefing"
            className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-medical-500 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] min-h-[56px]"
          >
            Garantir Minha Vaga Agora
            <ArrowRight size={22} />
          </Link>

          <p className="text-sm md:text-base text-neutral-500 mt-4">
            Primeiras 10 vagas • Preço sobe após isso
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionNew;
