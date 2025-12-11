import React from 'react';
import { Shield, ThumbsUp, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuaranteesSection: React.FC = () => {
  const guarantees = [
    {
      icon: ThumbsUp,
      title: "Não Gostou? Não Paga",
      description: "Você só paga após aprovar o layout. Se não gostar, não tem custo nenhum. Simples assim.",
      badge: "Risco ZERO",
      color: "bg-success"
    },
    {
      icon: Clock,
      title: "Prazo ou Reembolso",
      description: "Se não entregarmos em 7 dias úteis após sua aprovação, devolvemos 100% do valor.",
      badge: "7 Dias Úteis",
      color: "bg-orange-warning"
    },
    {
      icon: TrendingUp,
      title: "7 Dias de Satisfação",
      description: "Mesmo após o site no ar, se não ficar satisfeito em 7 dias, devolvemos seu dinheiro.",
      badge: "7 Dias de Garantia",
      color: "bg-blue-trust"
    }
  ];

  return (
    <section id="garantias" className="py-20 section-success">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-white" />
          </div>

          <h2 className="mb-6">
            🛡️ Garantia Tripla
            <span className="block text-success">100% do Risco É Nosso</span>
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Assumimos todo o risco para você. Nossa confiança é tanta que oferecemos
            uma garantia tripla para sua total tranquilidade.
          </p>
        </div>

        {/* Guarantees Grid - Larger Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="card-premium border-success/20 relative overflow-hidden p-8">
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className="bg-success text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  {guarantee.badge}
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${guarantee.color} rounded-full flex items-center justify-center mb-6 shadow-xl`}>
                  <guarantee.icon size={40} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  {guarantee.title}
                </h3>

                <p className="text-lg text-text-secondary leading-relaxed">
                  {guarantee.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Box - Risk Reversal */}
        <div className="bg-gradient-hero text-white rounded-2xl p-10 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} className="text-white" />
            </div>

            <h3 className="text-3xl font-bold mb-6">
              Você Só Tem a Ganhar
            </h3>

            <p className="text-2xl font-semibold mb-4">
              Todo o Risco É Nosso.
            </p>

            <p className="text-xl text-white/90 leading-relaxed">
              Não existe nenhum cenário onde você sai perdendo. Se algo não sair conforme prometido,
              você tem três camadas de proteção garantindo seu investimento.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            to="/briefing"
            className="btn-hero text-xl px-12 py-5"
          >
            Investir Sem Riscos Agora!
          </Link>
          <p className="text-text-secondary mt-4">
            🛡️ 100% protegido pela nossa Garantia Tripla
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSection;
