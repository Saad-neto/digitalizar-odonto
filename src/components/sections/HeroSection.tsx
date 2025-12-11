import React from 'react';
import { CheckCircle, ArrowDown, MessageCircle, Shield, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Counter from '../ui/counter';
import drRicardoAlmeida from '../../assets/professional-dentist.jpg';

const REMAINING_SPOTS = 7;

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="section-hero min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Emotional Headline */}
            <h1 className="mb-6 text-white leading-tight">
              Perdendo R$ 15 Mil/Mês em Pacientes Particulares Enquanto
              <span className="block text-yellow-highlight">
                Concorrentes com Site Profissional Lotam a Agenda?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Pare de perder pacientes particulares para concorrentes com presença digital. <strong className="text-success-light">Site profissional em até 7 dias úteis</strong> que atrai pacientes de alto valor
              e posiciona você como autoridade. <strong>Só paga depois de aprovar o layout - zero risco.</strong>
            </p>

            {/* Urgency Counter */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 bg-red-500/20 border-2 border-red-500 rounded-lg px-6 py-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-lg">
                  🔥 Restam <Counter targetNumber={REMAINING_SPOTS} duration={1000} /> vagas com desconto
                </span>
              </div>
            </div>

            {/* Timeline Visual - 3 Steps */}
            <div className="mb-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4 text-center lg:text-left">
                Como Funciona (Sem Riscos):
              </h3>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-success-light rounded-full flex items-center justify-center text-white font-bold text-lg">
                    📋
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Dias 1-3: Briefing + Layout Personalizado
                    </h4>
                    <p className="text-white/80 text-sm">
                      Você preenche um formulário online rápido (10 minutos): nome da clínica, especialidade, serviços, fotos e logo (se tiver). Criamos o layout inicial exclusivo para sua clínica.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-highlight rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    ✅
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Você Decide: Aprova Quando 100% Satisfeito
                    </h4>
                    <p className="text-white/80 text-sm">
                      <strong>Pagamento SOMENTE após você aprovar o layout.</strong> Não gostou?
                      Não paga. Sem letras miúdas, sem taxas escondidas.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-success-light rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      Dias 4-7: Site Completo no Ar
                    </h4>
                    <p className="text-white/80 text-sm">
                      Após aprovação e pagamento, finalizamos tudo e colocamos seu site online em até 7 dias úteis.
                      Pronto para receber pacientes!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 mb-6">
              <Link
                to="/briefing"
                className="btn-hero text-lg px-8 py-5 text-center shadow-2xl transform hover:scale-105 transition-transform"
              >
                🎯 Quero Atrair Mais Pacientes Particulares (Sem Risco)
              </Link>

              <a
                href="https://wa.me/5511999999999?text=Olá!%20Tenho%20dúvidas%20sobre%20o%20site%20odontológico"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-white border-2 border-white hover:bg-white hover:text-primary flex items-center justify-center gap-2 text-lg py-4"
              >
                <MessageCircle size={20} />
                💬 Tenho Dúvidas - Falar no WhatsApp
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3 text-white/80 text-sm">
              <Shield size={16} className="text-success-light" />
              <span>Garantia de satisfação ou reembolso total</span>
            </div>
          </div>

          {/* Right Column - Price Card + Testimonial */}
          <div className="space-y-6">
            {/* Price Card Highlight */}
            <div className="card-premium bg-white border-4 border-yellow-highlight relative overflow-hidden">
              {/* Launch Badge */}
              <div className="absolute -right-12 top-8 bg-red-500 text-white font-bold py-2 px-16 transform rotate-45 shadow-lg text-sm">
                50% OFF - LANÇAMENTO
              </div>

              <div className="text-center pt-12 pb-8 px-6">
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                  Oferta Especial de Lançamento
                </h3>

                {/* Strikethrough Price */}
                <div className="mb-3">
                  <span className="text-3xl text-text-light line-through">
                    R$ 997
                  </span>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center mb-3">
                  <ArrowDown size={40} className="text-success animate-bounce" />
                </div>

                {/* Highlighted Price */}
                <div className="mb-6">
                  <div className="text-6xl font-black text-primary mb-2">
                    R$ 497
                  </div>
                  <p className="text-text-secondary text-sm">
                    ou 12x de R$ 49,70 no cartão
                  </p>
                </div>

                {/* Payment Terms */}
                <div className="bg-success-bg border-2 border-success rounded-lg p-4 mb-4">
                  <p className="font-bold text-success-dark mb-2 flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    💳 Pagamento SOMENTE após você aprovar o layout
                  </p>
                  <p className="text-success-dark text-sm font-semibold">
                    Zero risco. Não gostou? Não paga.
                  </p>
                </div>

                {/* Included Features */}
                <div className="text-left space-y-2 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-text-secondary text-sm">
                      Design personalizado para sua especialidade
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-text-secondary text-sm">
                      Responsivo (celular, tablet, desktop)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-text-secondary text-sm">
                      Otimizado para Google (SEO básico)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-text-secondary text-sm">
                      Hospedagem GRÁTIS por 12 meses
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-success flex-shrink-0 mt-1" />
                    <span className="text-text-secondary text-sm">
                      Botão WhatsApp integrado
                    </span>
                  </div>
                </div>

                <Link
                  to="/briefing"
                  className="btn-hero w-full text-center block text-lg py-4"
                >
                  Começar Agora
                </Link>

                <p className="text-text-light text-xs mt-4">
                  <Calendar size={12} className="inline mr-1" />
                  Prazo de entrega: até 7 dias úteis após aprovação do layout
                </p>
              </div>
            </div>

            {/* Featured Testimonial */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-primary/20">
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-highlight fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-text-secondary mb-6 italic text-center">
                "Inacreditável! Em poucos dias tinha um site mais profissional que concorrentes
                com anos de mercado. Em 1 mês, já recuperei o investimento com novos pacientes
                vindos do Google."
              </blockquote>

              {/* Result Badge */}
              <div className="bg-success-bg rounded-lg p-3 mb-4 text-center">
                <div className="text-success-dark font-bold text-lg">
                  +200% em agendamentos online
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-4 justify-center">
                <img
                  src={drRicardoAlmeida}
                  alt="Dr. Ricardo Almeida"
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div className="text-left">
                  <h4 className="font-bold text-primary text-lg">
                    Dr. Ricardo Almeida
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Ortodontista
                  </p>
                  <p className="text-text-light text-xs">
                    São Paulo - SP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
