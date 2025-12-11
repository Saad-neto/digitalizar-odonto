import React from 'react';
import { FileText, Palette, CheckCircle, Rocket, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      icon: FileText,
      emoji: "📝",
      title: "Você Responde",
      duration: "10 minutos",
      description: "Formulário simples de briefing"
    },
    {
      number: "2",
      icon: Palette,
      emoji: "🎨",
      title: "Nós Criamos",
      duration: "3-7 dias",
      description: "Layout 100% personalizado para você"
    },
    {
      number: "3",
      icon: CheckCircle,
      emoji: "✅",
      title: "Você Aprova",
      duration: "sem pressa",
      description: "Revise e aprove quando quiser",
      highlight: true
    },
    {
      number: "4",
      icon: Rocket,
      emoji: "🚀",
      title: "Site no Ar",
      duration: "48h depois",
      description: "Desenvolvemos tudo, site publicado"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Como Funciona?
            <span className="block text-primary">Simples e Transparente</span>
          </h2>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-1 bg-gray-200"></div>
          <div className="hidden lg:block absolute top-32 left-0 h-1 bg-primary" style={{ width: '75%' }}></div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Timeline Node */}
                <div className={`w-16 h-16 ${step.highlight ? 'bg-success' : 'bg-primary'} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10`}>
                  <step.icon size={32} className="text-white" />
                </div>

                {/* Step Card */}
                <div className={`card-premium text-center ${step.highlight ? 'border-2 border-success' : ''}`}>
                  <div className="mb-4">
                    <span className="text-4xl">
                      {step.emoji}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {step.title}
                  </h3>

                  <div className={`${step.highlight ? 'bg-success-bg' : 'bg-gray-100'} rounded-lg px-3 py-1 inline-block mb-4`}>
                    <span className={`${step.highlight ? 'text-success-dark' : 'text-text-secondary'} font-semibold text-sm flex items-center gap-1`}>
                      <Clock size={14} />
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-text-secondary mb-4 font-medium">
                    {step.description}
                  </p>

                  {step.highlight && (
                    <div className="bg-success text-white rounded-lg p-4 mt-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CreditCard size={20} />
                        <span className="font-bold text-lg">SÓ AQUI VOCÊ PAGA</span>
                      </div>
                      <p className="text-sm">
                        Pagamento somente após aprovação do layout
                      </p>
                    </div>
                  )}
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-6">
                    <div className="w-px h-8 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Box */}
        <div className="mt-16 bg-primary/10 border-2 border-primary/30 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">⏱️</span>
            <h3 className="text-2xl font-bold text-primary">
              Processo Completo
            </h3>
          </div>

          <p className="text-xl text-text-primary font-semibold">
            3-7 dias úteis (dependendo da sua velocidade de aprovação)
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/briefing"
            className="btn-hero text-xl px-12 py-5"
          >
            Começar Meu Briefing Grátis
          </Link>
          <p className="text-text-secondary mt-4">
            💯 Sem compromisso • Só paga se aprovar • Parcele em até 12x
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;