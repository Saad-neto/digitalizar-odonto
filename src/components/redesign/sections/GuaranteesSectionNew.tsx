import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Clock, Headphones, ArrowRight } from 'lucide-react';

const GuaranteesSectionNew: React.FC = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "Pagamento SOMENTE Após Aprovação",
      description: "Você recebe o layout completo do site, revisa com calma, pede ajustes se necessário e só paga quando estiver 100% satisfeito. Não gostou? Não paga. Zero risco para você.",
      highlight: "Garantia #1 - Reversão Total de Risco"
    },
    {
      icon: CheckCircle2,
      title: "Satisfação Garantida ou Reembolso",
      description: "Se por qualquer motivo você não ficar satisfeito com o site entregue, devolvemos 100% do seu investimento. Sem burocracia, sem perguntas difíceis.",
      highlight: "Garantia #2 - Satisfação Total"
    },
    {
      icon: Clock,
      title: "Entrega em Até 7 Dias Úteis",
      description: "Comprometemo-nos a entregar seu site profissional em até 7 dias úteis após aprovação do layout. Passou disso? Você ganha desconto adicional ou recebe reembolso parcial.",
      highlight: "Garantia #3 - Prazo Cumprido"
    },
    {
      icon: Headphones,
      title: "Suporte Técnico por 30 Dias",
      description: "Após a entrega, você tem 30 dias de suporte técnico gratuito para qualquer dúvida, ajuste ou problema. Não ficamos 'invisíveis' depois da venda.",
      highlight: "Garantia #4 - Suporte Incluso"
    }
  ];

  return (
    <section className="py-section-lg bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 text-mint-700 rounded-full text-body-sm font-medium mb-6">
            <Shield size={16} />
            Garantias Sólidas
          </div>

          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Você Está 100% Protegido:{' '}
            <span className="text-medical-600">Todas as Garantias ao Seu Favor</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Sabemos que você já pode ter sido queimado por promessas não cumpridas.
            Por isso, assumimos TODO o risco. Você só tem a ganhar.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border-2 border-neutral-200 hover:border-mint-300 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-mint-50 rounded-xl flex items-center justify-center mb-6">
                <guarantee.icon size={32} className="text-mint-600" />
              </div>

              {/* Highlight Badge */}
              <div className="inline-block px-3 py-1 bg-medical-50 text-medical-700 rounded-full text-body-sm font-medium mb-4">
                {guarantee.highlight}
              </div>

              {/* Title */}
              <h3 className="font-heading text-title-md text-neutral-900 mb-4">
                {guarantee.title}
              </h3>

              {/* Description */}
              <p className="text-body-md text-neutral-600 leading-relaxed">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>

        {/* Risk Reversal Highlight Box */}
        <div className="bg-gradient-to-br from-mint-500 to-mint-700 rounded-2xl p-8 lg:p-12 text-white mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={40} className="text-white" />
            </div>

            <h3 className="font-heading text-title-lg mb-6">
              Por Que Assumimos Todo o Risco?
            </h3>

            <p className="text-body-lg leading-relaxed text-white mb-6">
              Porque temos <strong className="font-bold">absoluta confiança</strong> na qualidade do nosso trabalho.
              Mais de 500 dentistas já confiaram em nós e <strong className="font-bold">98.7% aprovaram na primeira entrega</strong>.
            </p>

            <p className="text-body-lg leading-relaxed text-white">
              Se estivéssemos entregando trabalho ruim, não poderíamos oferecer estas garantias.
              Mas como entregamos sites profissionais de altíssima qualidade, podemos assumir todo o risco
              e deixar você tranquilo.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="font-heading text-title-lg text-neutral-900 mb-6">
            Pronto para começar sem risco nenhum?
          </h3>

          <Link
            to="/briefing"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Começar Meu Site Agora (Sem Risco)
            <ArrowRight size={22} />
          </Link>

          <p className="text-body-sm text-neutral-500 mt-4">
            Você só paga depois de aprovar o layout. Promessa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSectionNew;
