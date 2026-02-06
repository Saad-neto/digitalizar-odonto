import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Palette, Rocket, Shield, ArrowRight, Check } from 'lucide-react';

const HowItWorksSectionNew: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Você Responde",
      duration: "10 minutos",
      description: "Preencha um formulário simples com as informações da sua clínica, serviços, fotos e preferências.",
      benefits: ["100% grátis", "Sem compromisso"],
      color: "medical"
    },
    {
      number: 2,
      icon: Palette,
      title: "Nós Criamos",
      duration: "3-5 dias",
      description: "Nossa equipe desenvolve seu site personalizado, otimizado para Google e perfeito no celular.",
      benefits: ["Acompanhe por email", "Ajustes incluídos"],
      color: "mint"
    },
    {
      number: 3,
      icon: Rocket,
      title: "Site no Ar",
      duration: "até 7 dias",
      description: "Você revisa, aprova, escolhe o domínio e publicamos. Pronto para receber pacientes!",
      benefits: ["Hospedagem grátis 1 ano", "Suporte por 30 dias"],
      color: "medical"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
            Seu Site Profissional em{' '}
            <span className="text-medical-600">3 Passos Simples</span>
          </h2>
          <p className="text-lg text-neutral-600">
            Do briefing ao ar em até 7 dias úteis
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-neutral-50 rounded-2xl p-8 border border-neutral-100 hover:border-medical-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Step Number Badge */}
              <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                step.color === 'medical' ? 'bg-medical-500' : 'bg-mint-500'
              }`}>
                {step.number}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                step.color === 'medical' ? 'bg-medical-100 text-medical-600' : 'bg-mint-100 text-mint-600'
              }`}>
                <step.icon size={28} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {step.title}
              </h3>

              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                step.color === 'medical' ? 'bg-medical-100 text-medical-700' : 'bg-mint-100 text-mint-700'
              }`}>
                {step.duration}
              </div>

              <p className="text-neutral-600 mb-6 leading-relaxed">
                {step.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {step.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Arrow connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 transform -translate-y-1/2 z-10">
                  <ArrowRight size={24} className="text-neutral-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Guarantee Box */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 lg:p-10 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Shield size={32} className="text-amber-600" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-2">
                Garantia Incondicional de 7 Dias
              </h3>
              <p className="text-neutral-700 lg:text-lg">
                Você paga após o briefing, mas está <strong>100% protegido</strong>.
                Não ficou satisfeito? Devolvemos todo o seu dinheiro. Sem perguntas, sem burocracia.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/briefing"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-medical-500 text-white text-lg font-semibold rounded-xl hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Começar Meu Site Agora
            <ArrowRight size={22} />
          </Link>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-500">
            <span>R$ 997 à vista ou 12x de R$ 99,70</span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-1">
              <Shield size={14} className="text-amber-500" />
              Garantia de 7 dias
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSectionNew;
