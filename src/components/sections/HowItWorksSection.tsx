import React from 'react';
import { FileText, Cog, Eye, Rocket, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      icon: FileText,
      title: "BRIEFING GRÁTIS",
      duration: "15 minutos",
      description: "Você preenche nosso formulário inteligente",
      details: [
        "Enviamos link por WhatsApp para agilizar",
        "Coletamos: especialidade, logo, fotos, textos",
        "100% online e sem compromisso"
      ],
      color: "bg-blue-trust"
    },
    {
      number: "2",
      icon: Cog,
      title: "PRODUÇÃO GRÁTIS",
      duration: "até 7 dias",
      description: "Criamos seu site profissional",
      details: [
        "Design responsivo para todos os dispositivos",
        "Otimização automática para Google",
        "Você não paga nada ainda!"
      ],
      color: "bg-orange-warning"
    },
    {
      number: "3",
      icon: Eye,
      title: "VOCÊ APROVA E PAGA",
      duration: "só paga se aprovar",
      description: "Enviamos o site pronto para sua aprovação",
      details: [
        "Gostou? Paga em até 12x no cartão",
        "Não gostou? Não paga nada!",
        "Até 2 rodadas de ajustes inclusas"
      ],
      color: "bg-primary"
    },
    {
      number: "4",
      icon: Rocket,
      title: "SITE NO AR EM 24H",
      duration: "após aprovação final",
      description: "Publicamos em servidor premium",
      details: [
        "Configuramos SSL e segurança",
        "Enviamos todos os acessos",
        "Suporte contínuo"
      ],
      color: "bg-success"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Só Paga Se Aprovar
            <span className="block text-success">Parcelamento em até 12x</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Nosso processo é transparente e sem riscos. Você vê o site pronto
            ANTES de pagar e decide se quer continuar. Justo, não é?
          </p>
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
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10`}>
                  <step.icon size={32} className="text-white" />
                </div>

                {/* Step Card */}
                <div className="card-premium text-center">
                  <div className="mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-bold text-text-primary">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {step.title}
                  </h3>

                  <div className="bg-success-bg rounded-lg px-3 py-1 inline-block mb-4">
                    <span className="text-success-dark font-semibold text-sm flex items-center gap-1">
                      <Clock size={14} />
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-text-secondary mb-4 font-medium">
                    {step.description}
                  </p>

                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
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

        {/* Guarantee Section */}
        <div className="mt-16 bg-success-bg border border-success/20 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-success-dark">
              GARANTIA DE SATISFAÇÃO 100%
            </h3>
          </div>

          <p className="text-lg text-success-dark font-semibold mb-4">
            💯 "Você só paga se gostar do resultado. Sem risco, sem taxas ocultas, sem pegadinhas."
          </p>

          <p className="text-text-secondary">
            Essa é nossa confiança na qualidade do trabalho que entregamos há mais de 5 anos.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">12x</div>
            <p className="text-text-secondary">Parcelamento</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-success mb-2">100%</div>
            <p className="text-text-secondary">Sem riscos</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-warning mb-2">2</div>
            <p className="text-text-secondary">Rodadas de ajustes</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-trust mb-2">24h</div>
            <p className="text-text-secondary">Publicação final</p>
          </div>
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