import React from 'react';
import { Rocket, MessageCircle, X, Check, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mesmo contador da LaunchBar
const REMAINING_SPOTS = 7;

const FinalCTASection: React.FC = () => {
  return (
    <section id="cta-final" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Urgency Box */}
        <div className="bg-gradient-to-r from-orange-warning to-red-alert text-white rounded-2xl p-8 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full mb-4">
              <AlertTriangle size={24} />
              <span className="font-bold text-lg">ATENÇÃO</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ⚠️ Última Chance: Lançamento com 50% OFF
            </h2>

            <p className="text-xl text-white/90 mb-2">
              Restam apenas{' '}
              <span className="inline-flex items-center justify-center min-w-[40px] h-10 px-3 bg-white text-orange-warning font-bold text-2xl rounded mx-1">
                {REMAINING_SPOTS}
              </span>{' '}
              {REMAINING_SPOTS === 1 ? 'vaga' : 'vagas'} com desconto
            </p>
          </div>

          {/* Benefits List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-center">🔥 Restam apenas {REMAINING_SPOTS} vagas com:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-success-light flex-shrink-0" />
                <span>Desconto de 50% (R$ 997 → R$ 497)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-success-light flex-shrink-0" />
                <span>Pagamento SOMENTE após aprovar</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-success-light flex-shrink-0" />
                <span>Prioridade no desenvolvimento</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-success-light flex-shrink-0" />
                <span>Bônus: Otimização Google My Business (R$ 197 grátis)</span>
              </div>
            </div>
          </div>

          {/* After 7 Spots Comparison */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-center">🔥 Quem garante vaga HOJE leva:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check size={18} className="text-success-light flex-shrink-0" />
                <span>50% OFF (economia de R$ 500)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-success-light flex-shrink-0" />
                <span>Pagamento só após aprovar (depois volta ao modelo tradicional)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-success-light flex-shrink-0" />
                <span>Prioridade no desenvolvimento (entrega em 7 dias, depois 15 dias)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-success-light flex-shrink-0" />
                <span>Bônus: Otimização Google My Business (R$ 197 grátis)</span>
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-lg text-white/70 line-through mb-2">DE R$ 997</div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-5xl md:text-6xl font-bold text-white">R$ 497</div>
              </div>
              <div className="text-white/90 text-lg">Ou 12x de R$ 49,70 sem juros</div>
            </div>
          </div>

          {/* Main CTA */}
          <div className="text-center space-y-4">
            <Link
              to="/briefing"
              className="bg-success hover:bg-success-dark text-white text-xl md:text-2xl font-bold px-10 py-5 rounded-xl shadow-2xl hover:shadow-cta transition-all duration-300 hover:scale-105 w-full md:w-auto inline-block"
            >
              🎯 Quero Começar Meu Site Agora (Vagas Limitadas)
            </Link>

            <p className="text-white/90 text-sm">
              💬 Dúvida?{' '}
              <a
                href="https://wa.me/5518317510052?text=Olá! Tenho interesse em fazer um site odontológico."
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white font-semibold"
              >
                Chama no WhatsApp: (18) 3175-1052
              </a>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Check size={16} className="text-success-light" />
                Pagamento 100% seguro
              </span>
              <span className="flex items-center gap-1">
                <Check size={16} className="text-success-light" />
                500+ dentistas confiam em nós
              </span>
              <span className="flex items-center gap-1">
                <Check size={16} className="text-success-light" />
                Garantia de satisfação
              </span>
            </div>
          </div>
        </div>

        {/* Final Testimonial/Social Proof */}
        <div className="text-center bg-white rounded-xl p-6 shadow-md">
          <p className="text-text-secondary text-lg italic mb-4">
            "Aprovei na quarta, site no ar na sexta. Em 15 dias tinha 12 novos pacientes agendados!"
          </p>
          <p className="font-semibold text-text-primary">
            - Dra. Mariana Costa, São Paulo
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-highlight text-xl">★</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
