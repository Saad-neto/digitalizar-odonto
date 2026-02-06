import React from 'react';
import { Check, Sparkles } from 'lucide-react';

const WhatsIncludedSection: React.FC = () => {
  const includedItems = [
    {
      item: "Design 100% personalizado",
      description: "Criado especialmente para sua especialidade e público-alvo",
      value: "R$ 1.500"
    },
    {
      item: "Hospedagem grátis para sempre",
      description: "Servidor de alta performance, sem mensalidades eternas",
      value: "R$ 2.400"
    },
    {
      item: "Domínio .com.br incluído",
      description: "Seu endereço profissional na internet por 1 ano",
      value: "R$ 40/ano"
    },
    {
      item: "SEO otimizado no Google",
      description: "Configuração completa para aparecer nas buscas",
      value: "R$ 800"
    },
    {
      item: "2 rodadas de ajustes",
      description: "Garantimos que o site fique exatamente como você quer",
      value: "R$ 400"
    },
    {
      item: "Suporte técnico 30 dias",
      description: "Ajuda completa após a entrega do site",
      value: "R$ 300"
    }
  ];

  const totalValue = 5440;
  const yourPrice = 997;
  const savings = totalValue - yourPrice;
  const discountPercent = Math.round((savings / totalValue) * 100);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medical-50 text-medical-700 rounded-full text-sm md:text-base font-medium mb-6">
            <Sparkles size={16} />
            Investimento Transparente
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6 leading-tight">
            Tudo que Você Recebe{' '}
            <span className="text-medical-600">por R$ 997</span>
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Investimento único, sem mensalidades abusivas. Veja tudo que está incluído:
          </p>
        </div>

        {/* Items Grid */}
        <div className="bg-neutral-50 rounded-2xl p-6 md:p-10 mb-8">
          <div className="space-y-6">
            {includedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-6 border-b border-neutral-200 last:border-b-0 last:pb-0"
              >
                {/* Check Icon */}
                <div className="w-6 h-6 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check size={16} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-heading text-lg md:text-xl text-neutral-900 mb-1">
                    {item.item}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-600">
                    {item.description}
                  </p>
                </div>

                {/* Value */}
                <div className="text-right">
                  <span className="text-base md:text-lg font-semibold text-neutral-700">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gradient-to-br from-medical-500 to-medical-700 rounded-2xl p-6 md:p-10 text-white shadow-xl">
          <div className="max-w-2xl mx-auto">
            {/* Total Value */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
              <span className="text-lg md:text-xl font-medium">Valor Total Real:</span>
              <span className="text-xl md:text-2xl font-bold line-through opacity-90">
                R$ {totalValue.toLocaleString('pt-BR')}
              </span>
            </div>

            {/* Your Price */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl md:text-2xl font-semibold">Você paga apenas:</span>
              <span className="text-3xl md:text-5xl font-bold">
                R$ {yourPrice}
              </span>
            </div>

            {/* Savings */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-6 text-center">
              <p className="text-sm md:text-base text-white/90 mb-2">
                Você economiza:
              </p>
              <p className="text-2xl md:text-3xl font-bold mb-2">
                R$ {savings.toLocaleString('pt-BR')}
              </p>
              <p className="text-base md:text-lg text-mint-300 font-semibold">
                ({discountPercent}% de economia)
              </p>
            </div>

            {/* Note */}
            <p className="text-center text-sm md:text-base text-white/80 mt-6 italic">
              Pagamento único. Sem mensalidades. Sem taxas escondidas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsIncludedSection;
