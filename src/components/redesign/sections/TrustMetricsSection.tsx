import React from 'react';
import { Users, Star, Clock, ThumbsUp, Award, TrendingUp } from 'lucide-react';

const TrustMetricsSection: React.FC = () => {
  const metrics = [
    {
      icon: Users,
      number: "50+",
      label: "Sites Criados",
      description: "Para dentistas em todo Brasil"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Avaliação Google",
      description: "127 avaliações de clientes"
    },
    {
      icon: ThumbsUp,
      number: "95%",
      label: "Satisfação",
      description: "Clientes muito satisfeitos"
    },
    {
      icon: Clock,
      number: "7 dias",
      label: "Prazo Médio",
      description: "Da aprovação à entrega"
    },
    {
      icon: Award,
      number: "100%",
      label: "Recomendação",
      description: "Clientes recomendam"
    },
    {
      icon: TrendingUp,
      number: "+180%",
      label: "Média de Crescimento",
      description: "Em agendamentos dos clientes"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-medical-50 via-white to-mint-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4 leading-tight">
            Por Que Confiar em Nós?
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Números reais de dentistas que já transformaram sua presença online conosco.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-medical-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center group-hover:bg-medical-500 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-medical-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Number - Grande e destacado */}
                  <div className="text-4xl md:text-5xl font-bold text-medical-600 leading-none">
                    {metric.number}
                  </div>

                  {/* Label */}
                  <div>
                    <h3 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-2">
                      {metric.label}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-600">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge Final */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-mint-100 border-2 border-mint-500 rounded-full">
            <Award className="w-6 h-6 text-mint-700" />
            <p className="text-base md:text-lg font-semibold text-neutral-900">
              Empresa nova com resultados comprovados
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustMetricsSection;
