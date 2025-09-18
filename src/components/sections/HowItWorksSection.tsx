import React from 'react';
import { FileText, Cog, Eye, Rocket, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      icon: FileText,
      title: "BRIEFING RÁPIDO",
      duration: "15 minutos",
      description: "Você preenche nosso formulário inteligente",
      details: [
        "Enviamos link por WhatsApp para agilizar",
        "Coletamos: especialidade, logo, fotos, textos", 
        "Processo 100% online e descomplicado"
      ],
      color: "bg-blue-trust"
    },
    {
      number: "2", 
      icon: Cog,
      title: "CRIAÇÃO PROFISSIONAL",
      duration: "12 horas",
      description: "Nossa equipe especializada desenvolve seu site",
      details: [
        "Design responsivo para todos os dispositivos",
        "Otimização automática para Google", 
        "Integração com WhatsApp e redes sociais"
      ],
      color: "bg-orange-warning"
    },
    {
      number: "3",
      icon: Eye,
      title: "REVISÕES RÁPIDAS",
      duration: "até 3 alterações",
      description: "Enviamos prévia para aprovação",
      details: [
        "Você solicita ajustes se necessário",
        "Finalizamos em poucas horas",
        "Comunicação ágil via WhatsApp"
      ],
      color: "bg-primary"
    },
    {
      number: "4",
      icon: Rocket,
      title: "SITE NO AR",
      duration: "24 horas",
      description: "Publicamos em servidor premium",
      details: [
        "Configuramos SSL e segurança",
        "Enviamos todos os acessos",
        "Site funcionando 100%"
      ],
      color: "bg-success"
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Como Seu Site Fica Pronto em
            <span className="block text-success">Apenas 24 Horas</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Nosso processo é transparente, simples e eficiente. 
            Veja como transformamos sua presença digital em tempo recorde.
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
              <Clock size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-success-dark">
              GARANTIA BLINDADA DE PRAZO
            </h3>
          </div>
          
          <p className="text-lg text-success-dark font-semibold mb-4">
            🕐 "Se não entregarmos em 24h, devolvemos 100% do seu dinheiro + R$ 200 de multa pelo transtorno."
          </p>
          
          <p className="text-text-secondary">
            Essa é nossa confiança no processo que desenvolvemos ao longo de 5 anos.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24h</div>
            <p className="text-text-secondary">Prazo máximo</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-success mb-2">98.7%</div>
            <p className="text-text-secondary">Taxa aprovação</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-warning mb-2">15min</div>
            <p className="text-text-secondary">Briefing rápido</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-trust mb-2">100%</div>
            <p className="text-text-secondary">Online</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link 
            to="/briefing"
            className="btn-hero text-xl px-12 py-5"
          >
            Começar Meu Briefing Agora
          </Link>
          <p className="text-text-secondary mt-4">
            ⏰ Processo 100% online • Entrega garantida em 24h
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;