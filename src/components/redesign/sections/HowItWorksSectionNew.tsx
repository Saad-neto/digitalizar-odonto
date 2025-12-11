import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Palette, CheckSquare, CreditCard, Rocket, ArrowRight } from 'lucide-react';

const HowItWorksSectionNew: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Preencha o Briefing",
      description: "Responda um formulário rápido sobre sua clínica, especialidades, diferenciais e o que você quer destacar no site.",
      duration: "5-10 minutos",
      color: "medical"
    },
    {
      number: 2,
      icon: Palette,
      title: "Receba o Layout para Aprovação",
      description: "Em até 3 dias úteis, criamos o design personalizado do seu site. Você revisa, pede ajustes se necessário, e aprova quando estiver 100% satisfeito.",
      duration: "2-3 dias úteis",
      color: "mint"
    },
    {
      number: 3,
      icon: CheckSquare,
      title: "Aprove o Layout",
      description: "Gostou do design? Perfeito! Não gostou? Fazemos ajustes até você aprovar. Sem burocracia.",
      duration: "Sua escolha",
      color: "medical"
    },
    {
      number: 4,
      icon: CreditCard,
      title: "Efetue o Pagamento",
      description: "Somente APÓS aprovar o layout, você paga os R$ 497 (ou 12x de R$ 49,70 no cartão). Zero risco. Não gostou? Não paga.",
      duration: "Instantâneo",
      color: "mint"
    },
    {
      number: 5,
      icon: Rocket,
      title: "Seu Site Entra no Ar",
      description: "Finalizamos os detalhes técnicos, configuramos hospedagem, SEO básico e colocamos seu site no ar. Pronto para receber pacientes!",
      duration: "Até 7 dias úteis",
      color: "medical"
    }
  ];

  return (
    <section className="py-section-lg bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Como Funciona:{' '}
            <span className="text-medical-600">Simples, Rápido e Sem Risco</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Do briefing ao site no ar em até 7 dias úteis. Processo transparente,
            sem surpresas, sem pegadinhas. Veja como é fácil:
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const colorClass = step.color === 'medical' ? 'medical' : 'mint';

              return (
                <div
                  key={index}
                  className={`relative grid lg:grid-cols-2 gap-8 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`${isEven ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:pl-12'}`}>
                    <div className="inline-block mb-4">
                      <div className={`inline-flex items-center gap-3 px-4 py-2 bg-${colorClass}-50 text-${colorClass}-700 rounded-full text-body-sm font-medium`}>
                        <step.icon size={20} />
                        Passo {step.number}
                      </div>
                    </div>

                    <h3 className="font-heading text-title-lg text-neutral-900 mb-4">
                      {step.title}
                    </h3>

                    <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <p className="text-body-sm font-semibold text-neutral-500">
                      ⏱️ {step.duration}
                    </p>
                  </div>

                  {/* Circle Number (Center on desktop) */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-16 h-16 rounded-full bg-${colorClass}-500 text-white flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Visual placeholder on opposite side */}
                  <div className={`hidden lg:block ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-medical-50 to-mint-50 rounded-2xl p-8 lg:p-12 border border-medical-100">
            <h3 className="font-heading text-title-lg text-neutral-900 mb-4">
              Pronto para Começar?
            </h3>
            <p className="text-body-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Preencha o briefing agora e receba seu layout em até 3 dias úteis.
              Sem compromisso até você aprovar o design.
            </p>

            <Link
              to="/briefing"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Preencher Briefing Agora
              <ArrowRight size={22} />
            </Link>

            <p className="text-body-sm text-neutral-500 mt-4">
              Leva apenas 5-10 minutos. Nenhum pagamento necessário agora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSectionNew;
