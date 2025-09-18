import React from 'react';
import { Shield, Clock, ThumbsUp, Wrench, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuaranteesSection: React.FC = () => {
  const guarantees = [
    {
      icon: Clock,
      title: "GARANTIA DE PRAZO",
      description: "Se não entregarmos em 24h, devolvemos 100% do seu dinheiro + R$ 200 de multa pelo transtorno.",
      badge: "100% Blindada",
      color: "bg-orange-warning"
    },
    {
      icon: ThumbsUp,
      title: "GARANTIA DE SATISFAÇÃO", 
      description: "30 dias para aprovar completamente. Se não gostar, reembolsamos integralmente.",
      badge: "Risco Zero",
      color: "bg-blue-trust"
    },
    {
      icon: Wrench,
      title: "GARANTIA TÉCNICA",
      description: "Site funcionando perfeitamente ou corrigimos gratuitamente até ficar 100%.",
      badge: "Suporte Total",
      color: "bg-success"
    },
    {
      icon: TrendingUp,
      title: "GARANTIA DE RESULTADO",
      description: "Se em 90 dias você não ver melhora na captação de pacientes, fazemos um novo site GRÁTIS.",
      badge: "Resultado Assegurado",
      color: "bg-primary"
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
            🛡️ Garantia Blindada:
            <span className="block text-success">100% Sem Riscos</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Assumimos todo o risco para você. Nossa confiança é tanta que oferecemos 
            múltiplas garantias para sua total tranquilidade.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="card-premium border-success/20 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-success text-white text-xs font-bold px-3 py-1 rounded-full">
                  {guarantee.badge}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${guarantee.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <guarantee.icon size={32} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {guarantee.title}
                  </h3>
                  
                  <p className="text-text-secondary leading-relaxed">
                    {guarantee.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Testemunho de Confiança
            </h3>
            
            <blockquote className="text-xl text-text-secondary italic max-w-3xl mx-auto">
              "Já entregamos <strong className="text-success">500+ sites</strong> sem nenhuma reclamação no Reclame Aqui. 
              Nossa reputação é nossa maior garantia."
            </blockquote>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-success mb-2">500+</div>
              <p className="text-text-secondary">Sites Entregues</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-success mb-2">0</div>
              <p className="text-text-secondary">Reclamações</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-success mb-2">5</div>
              <p className="text-text-secondary">Anos no Mercado</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-success mb-2">100%</div>
              <p className="text-text-secondary">Especialização</p>
            </div>
          </div>
        </div>

        {/* Risk Reversal */}
        <div className="bg-gradient-hero text-white rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-6">
            Por Que Oferecemos Tantas Garantias?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white/10 rounded-lg">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-bold mb-2">Confiança Total</h4>
              <p className="text-white/90 text-sm">
                Sabemos que nosso método funciona e entregamos resultados
              </p>
            </div>
            
            <div className="p-6 bg-white/10 rounded-lg">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h4 className="font-bold mb-2">Parceria Real</h4>
              <p className="text-white/90 text-sm">
                Seu sucesso é o nosso sucesso. Queremos uma relação de longo prazo
              </p>
            </div>
            
            <div className="p-6 bg-white/10 rounded-lg">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-bold mb-2">Reputação Sólida</h4>
              <p className="text-white/90 text-sm">
                500+ dentistas satisfeitos são nossa maior propaganda
              </p>
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-6">
            <p className="text-xl font-semibold mb-4">
              🛡️ RESULTADO: Você investe com 100% de segurança
            </p>
            <p className="text-white/90">
              Não existe nenhum risco. Se algo não sair conforme prometido, 
              você tem múltiplas garantias para te proteger.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link 
            to="/formulario"
            className="btn-hero text-xl px-12 py-5"
          >
            Investir Sem Riscos Agora!
          </Link>
          <p className="text-text-secondary mt-4">
            🛡️ 100% protegido por nossas garantias múltiplas
          </p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteesSection;