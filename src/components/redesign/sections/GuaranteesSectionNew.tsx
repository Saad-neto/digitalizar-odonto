import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Clock, Headphones, ArrowRight } from 'lucide-react';

const GuaranteesSectionNew: React.FC = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "Pagamento SOMENTE Após Aprovação",
      description: "Você recebe o layout completo do site, revisa com calma, pede ajustes se necessário e só paga quando estiver 100% satisfeito. Não gostou? Não paga. Zero risco para você.",
      highlight: "Garantia #1 - Risco Zero"
    },
    {
      icon: CheckCircle2,
      title: "30 Dias de Garantia ou Reembolso",
      description: "Após a entrega, você tem 30 dias para testar o site. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do valor. Sem burocracia, sem perguntas complicadas.",
      highlight: "Garantia #2 - Satisfação Total"
    },
    {
      icon: Clock,
      title: "Entrega em Até 7 Dias Úteis",
      description: "Comprometemo-nos a entregar seu site profissional em até 7 dias úteis após aprovação do layout. Faremos tudo ao nosso alcance para cumprir este prazo.",
      highlight: "Garantia #3 - Prazo Compromissado"
    },
    {
      icon: Headphones,
      title: "Suporte Técnico por 30 Dias",
      description: "Após a entrega, você tem 30 dias de suporte técnico gratuito para qualquer dúvida, ajuste ou problema. Estamos aqui para ajudar mesmo depois da venda.",
      highlight: "Garantia #4 - Suporte Incluso"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 text-mint-700 rounded-full text-sm md:text-base font-medium mb-6">
            <Shield size={16} />
            Garantias Sólidas
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6 leading-tight">
            Você Está 100% Protegido:{' '}
            <span className="text-medical-600">Todas as Garantias ao Seu Favor</span>
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Assumimos TODO o risco. Você só tem a ganhar. Veja nossas garantias:
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-sm border-2 border-neutral-200 hover:border-mint-300 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 bg-mint-50 rounded-xl flex items-center justify-center mb-6">
                <guarantee.icon size={32} className="text-mint-600" />
              </div>

              {/* Highlight Badge */}
              <div className="inline-block px-3 py-1 bg-medical-50 text-medical-700 rounded-full text-xs md:text-sm font-medium mb-4">
                {guarantee.highlight}
              </div>

              {/* Title */}
              <h3 className="font-heading text-xl md:text-2xl text-neutral-900 mb-4">
                {guarantee.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>

        {/* Risk Reversal Highlight Box */}
        <div className="bg-gradient-to-br from-mint-600 to-mint-800 rounded-2xl p-6 md:p-12 text-white mb-12 shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={40} className="text-white" />
            </div>

            <h3 className="font-heading text-2xl md:text-3xl mb-6 font-bold">
              Por Que Assumimos Todo o Risco?
            </h3>

            <div className="space-y-4 text-base md:text-lg leading-relaxed">
              <p className="text-white/95">
                Porque temos <strong className="font-bold text-white">absoluta confiança</strong> na qualidade
                do nosso trabalho e na tecnologia que usamos (React, TypeScript, Supabase).
              </p>

              <p className="text-white/95">
                Como estamos começando, precisamos construir reputação. A melhor forma?
                Entregar sites excelentes e assumir TODO o risco. Se o trabalho não for bom,
                você não paga.
              </p>

              <p className="font-bold text-xl text-white">
                Simples assim: você só ganha. Nós assumimos o risco.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="font-heading text-2xl md:text-3xl text-neutral-900 mb-6">
            Pronto para começar sem risco nenhum?
          </h3>

          <Link
            to="/briefing"
            className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-medical-500 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] min-h-[56px]"
          >
            Começar Meu Site Agora (Sem Risco)
            <ArrowRight size={22} />
          </Link>

          <p className="text-sm md:text-base text-neutral-500 mt-4">
            Você só paga depois de aprovar o layout. Promessa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSectionNew;
