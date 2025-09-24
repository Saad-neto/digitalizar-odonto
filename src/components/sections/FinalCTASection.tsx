import React from 'react';
import { Rocket, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Timer from '../ui/timer';
import Counter from '../ui/counter';

const FinalCTASection: React.FC = () => {
  const offerItems = [
    "Site profissional responsivo",
    "Entrega garantida em 24h",
    "Hospedagem premium 1º ano GRÁTIS", 
    "SSL + Otimização Google",
    "Suporte especializado",
    "Até 3 revisões incluídas",
    "Garantia total de 30 dias"
  ];

  return (
    <section id="cta-final" className="py-20 bg-gradient-hero text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚨</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Última Chance: Garanta Sua Vaga Agora
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Não perca mais pacientes para a concorrência. Seu site profissional 
            pode estar funcionando ainda hoje.
          </p>
        </div>

        {/* Offer Summary */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: What's Included */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Resumo da Oferta:</h3>
              <div className="space-y-3 text-left">
                {offerItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-success-light flex-shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Pricing & Timer */}
            <div className="text-center">
              <div className="mb-6">
                <div className="text-lg text-white/70 line-through mb-2">DE R$ 997</div>
                <div className="text-5xl font-bold text-success-light mb-2">R$ 497</div>
                <div className="text-white/90">Ou 12x de R$ 49,70</div>
              </div>

              <div className="bg-text-primary rounded-lg p-4 mb-6">
                <p className="font-semibold mb-2">Esta oferta expira em:</p>
                <Timer 
                  initialHours={2}
                  initialMinutes={47}
                  initialSeconds={15}
                  className="text-2xl"
                />
              </div>

              <div className="bg-orange-warning/20 border border-orange-warning rounded-lg p-3">
                <p className="text-orange-warning font-semibold text-sm">
                  Restam 2 de 5 vagas hoje
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA Buttons */}
        <div className="space-y-6 mb-12">
          <Link 
            to="/briefing"
            className="bg-success hover:bg-success-dark text-white text-2xl font-bold px-12 py-6 rounded-xl shadow-cta hover:shadow-hover transition-all duration-300 hover:scale-105 w-full md:w-auto inline-flex"
          >
            <div className="flex items-center justify-center gap-3">
              <Rocket size={28} />
              SIM! QUERO MEU SITE EM 24H
            </div>
          </Link>
          
          <p className="text-white/80">
            💻 Clique aqui para fazer seu briefing agora
          </p>
          
          <p className="text-success-light font-semibold">
            ⏰ Vaga garantida para hoje
          </p>
        </div>


        {/* Final Urgency */}
        <div className="bg-red-alert/20 border border-red-alert/40 rounded-xl p-6">
          
          <p className="text-xl text-white/90 mb-4">
            "Restam apenas <strong className="text-red-light">2 vagas</strong> para entrega hoje. 
            Amanhã você pode ter que aguardar disponibilidade."
          </p>
          
          <p className="text-white/80">
            Enquanto você pensa, seus concorrentes podem estar captando os pacientes que deveriam ser seus.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/70">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              <Counter targetNumber={500} suffix="+" />
            </div>
            <p className="text-sm">Dentistas Satisfeitos</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98.7%</div>
            <p className="text-sm">Taxa de Aprovação</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.9/5</div>
            <p className="text-sm">Avaliação Média</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-sm">Anos Especializados</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;