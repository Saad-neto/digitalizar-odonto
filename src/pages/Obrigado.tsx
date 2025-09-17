import React from 'react';
import { CheckCircle, Clock, MessageCircle, Shield, ArrowRight, Star, Users, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Timeline: React.FC = () => {
  const steps = [
    { time: 'AGORA', title: 'Confirmação enviada para seu email', icon: '🕐', status: 'completed' },
    { time: '30 MIN', title: 'Contato via WhatsApp para briefing', icon: '📱', status: 'current' },
    { time: '12H', title: 'Você recebe a primeira versão do site', icon: '🤖', status: 'pending' },
    { time: '18H', title: 'Prazo para solicitar até 3 alterações', icon: '✏️', status: 'pending' },
    { time: '24H', title: 'Seu site estará online e funcionando', icon: '🚀', status: 'pending' },
    { time: 'FINAL', title: 'Link de pagamento (24h para pagar)', icon: '💳', status: 'pending' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-col space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl ${
                step.status === 'completed'
                  ? 'bg-success border-success text-white'
                  : step.status === 'current'
                  ? 'bg-primary border-primary text-white animate-pulse'
                  : 'bg-white border-gray-200 text-text-light'
              }`}
            >
              {step.status === 'completed' ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-primary mb-1">{step.time}</div>
              <div className="text-base font-medium text-text-primary">{step.title}</div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="absolute left-8 w-0.5 h-6 bg-gray-200 mt-16" style={{ top: `${index * 96 + 64}px` }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NextStepsCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  items?: string[];
}> = ({ icon, title, description, items }) => (
  <div className="card-testimonial">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-primary-ultra-light flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-text-primary mb-2">{title}</h4>
        <p className="text-sm text-text-secondary mb-3">{description}</p>
        {items && (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-text-secondary flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-success" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

const Obrigado: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Success Header */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-h1 font-extrabold text-success mb-6">
            🎉 Perfeito! Sua Solicitação Foi Recebida
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Agora é com a gente! Em instantes nossa equipe entrará em contato via WhatsApp para dar início ao seu projeto.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="badge-credibility">
              <Timer className="w-4 h-4 mr-2" />
              Site em 24 Horas
            </div>
            <div className="badge-credibility">
              <Shield className="w-4 h-4 mr-2" />
              Garantia Total
            </div>
            <div className="badge-credibility">
              <Users className="w-4 h-4 mr-2" />
              +500 Dentistas Atendidos
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              ⏱️ Seu Site Ficará Pronto Assim:
            </h2>
            <p className="text-text-secondary">
              Acompanhe cada etapa do desenvolvimento do seu site
            </p>
          </div>

          <div className="card-premium">
            <Timeline />
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              📋 O Que Acontece Agora?
            </h2>
            <p className="text-text-secondary">
              O que acontece agora? Fique tranquilo, nós cuidamos de tudo!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <NextStepsCard
              icon={<MessageCircle className="w-6 h-6 text-primary" />}
              title="1. AGUARDE NOSSO CONTATO"
              description="Nossa equipe entrará em contato pelo WhatsApp em até 30 minutos para coletar as informações necessárias"
            />
            <NextStepsCard
              icon={<Star className="w-6 h-6 text-primary" />}
              title="2. PREPARE SUAS INFORMAÇÕES"
              description="Tenha em mãos os materiais que ajudarão a personalizar seu site:"
              items={[
                "Fotos/logos da empresa",
                "Textos que gostaria no site", 
                "Referências de sites que admira",
                "Cores preferenciais da marca"
              ]}
            />
            <NextStepsCard
              icon={<CheckCircle className="w-6 h-6 text-primary" />}
              title="3. MANTENHA O WHATSAPP ATIVO"
              description="Toda comunicação será pelo WhatsApp para agilizar o processo"
            />
          </div>
        </div>
      </section>

      {/* Zero Risk Reminder */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-light to-primary-ultra-light border-l-4 border-primary p-6 rounded-lg mb-8">
            <h3 className="flex items-center gap-2 font-bold text-text-primary mb-4">
              <Shield className="w-5 h-5 text-primary" />
              ⚡ LEMBRETE IMPORTANTE - Zero Risco Para Você
            </h3>
            
            <p className="text-text-secondary text-lg leading-relaxed">
              Você tem <strong className="text-primary">ZERO risco!</strong> Só pagará após ver e aprovar 
              seu site funcionando. Garantimos 24h para colocar 
              seu negócio online com qualidade profissional.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-h3 font-bold text-text-primary mb-4">
                💬 Precisa Falar Conosco?
              </h3>
              <p className="text-text-secondary mb-4">
                Alguma dúvida? Chame a gente no WhatsApp que respondemos na hora!
              </p>
            </div>

            <Button 
              asChild
              className="btn-hero inline-flex items-center gap-2 text-xl px-8 py-4"
            >
              <a 
                href="https://wa.me/5511999999999?text=Olá! Acabei de solicitar meu site odontológico e gostaria de falar com vocês."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                📱 CHAMAR NO WHATSAPP AGORA
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            
            <p className="text-sm text-text-light mt-4">
              Nossa equipe está online para te atender!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Obrigado;