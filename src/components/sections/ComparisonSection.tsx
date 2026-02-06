import React from 'react';
import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComparisonSection: React.FC = () => {
  const options = [
    {
      title: "Agência Tradicional",
      emoji: "🐌",
      items: [
        { label: "Prazo", value: "45-90 dias", negative: true },
        { label: "Investimento", value: "R$ 3.000 - R$ 8.000", negative: true },
        { label: "Pagamento", value: "Adiantado (antes de ver resultado)", negative: true },
        { label: "Processo", value: "Reuniões intermináveis", negative: true },
        { label: "Risco", value: "ALTO (você paga e espera)", negative: true }
      ],
      cta: "Não é para mim",
      highlight: false
    },
    {
      title: "Fazer Você Mesmo",
      emoji: "😰",
      items: [
        { label: "Prazo", value: "Nunca termina", negative: true },
        { label: "Investimento", value: '"Grátis" (mas perde pacientes)', negative: true },
        { label: "Seu tempo", value: "50-100 horas perdidas", negative: true },
        { label: "Resultado", value: "Site amador", negative: true },
        { label: "Risco", value: "ALTÍSSIMO (oportunidade perdida)", negative: true }
      ],
      cta: "Não é para mim",
      highlight: false
    },
    {
      title: "clinicanaweb.com (LANÇAMENTO)",
      emoji: "⚡",
      items: [
        { label: "Prazo", value: "3-7 dias", negative: false },
        { label: "Investimento", value: "R$ 497 (50% OFF)", negative: false },
        { label: "Pagamento", value: "SÓ após aprovar", negative: false },
        { label: "Processo", value: "Simples e rápido", negative: false },
        { label: "Resultado", value: "Profissional de verdade", negative: false },
        { label: "Risco", value: "ZERO (não gosta = não paga)", negative: false }
      ],
      cta: "Essa é a escolha inteligente",
      highlight: true
    }
  ];

  return (
    <section id="comparacao" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Você Tem 3 Opções para Ter um{' '}
            <span className="block text-primary">Site Profissional</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Compare e veja por que a nossa solução é a mais inteligente
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {options.map((option, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6 transition-all duration-300 ${
                option.highlight
                  ? 'bg-gradient-to-br from-success-bg to-white border-2 border-success shadow-xl scale-105 lg:scale-110'
                  : 'bg-white border border-gray-200 hover:shadow-md'
              }`}
            >
              {/* Badge de Destaque */}
              {option.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-success text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                    ⭐ MELHOR ESCOLHA
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="text-center mb-6 mt-2">
                <div className="text-4xl mb-3">{option.emoji}</div>
                <h3 className={`text-xl font-bold ${option.highlight ? 'text-success' : 'text-text-primary'}`}>
                  {option.title}
                </h3>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {option.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {item.negative ? (
                        <X size={20} className="text-red-alert" />
                      ) : (
                        <Check size={20} className="text-success" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary">{item.label}:</p>
                      <p className={`text-sm ${item.negative ? 'text-red-alert' : 'text-success-dark'}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6">
                {option.highlight ? (
                  <Link
                    to="/briefing"
                    className="btn-hero w-full text-center block"
                  >
                    ✓ {option.cta}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                  >
                    ✗ {option.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-text-secondary mb-6 text-lg">
            A escolha é óbvia. Por que complicar?
          </p>
          <Link
            to="/briefing"
            className="btn-hero text-xl px-12 py-5 inline-block"
          >
            🚀 Quero a Melhor Opção: clinicanaweb.com
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
