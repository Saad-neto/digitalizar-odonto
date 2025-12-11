import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import Counter from '../../ui/counter';

const FinalCTASectionNew: React.FC = () => {
  const finalReasons = [
    "Pagamento SOMENTE após você aprovar o layout (zero risco)",
    "Entrega profissional em até 7 dias úteis (não meses)",
    "Design 100% personalizado para sua especialidade (não template)",
    "98.7% de aprovação na primeira entrega (500+ dentistas satisfeitos)",
    "Investimento único de R$ 497 (sem mensalidades abusivas)",
    "Garantia de satisfação ou reembolso total"
  ];

  return (
    <section className="py-section-lg bg-gradient-to-br from-medical-500 to-medical-700 text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-title-xl mb-6">
            Você Está a Um Passo de Parar de Perder Pacientes para a Concorrência
          </h2>

          <p className="text-body-lg leading-relaxed opacity-95 max-w-3xl mx-auto">
            Enquanto você lê isso, seus concorrentes com sites profissionais estão recebendo agendamentos.
            Quanto tempo mais você vai esperar para ter sua presença digital?
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 lg:p-12 mb-12">
          <h3 className="font-heading text-title-lg text-center mb-8">
            Por que escolher Sites Odonto 24H:
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {finalReasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-mint-300 flex-shrink-0 mt-0.5" />
                <span className="text-body-md leading-relaxed opacity-95">{reason}</span>
              </div>
            ))}
          </div>

          {/* Urgency - Subtle */}
          <div className="flex items-center justify-center gap-3 text-mint-300 text-body-md font-medium">
            <Clock size={20} />
            <span>
              Restam apenas <Counter targetNumber={7} duration={800} /> vagas neste mês com 50% OFF
            </span>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-8">
          <Link
            to="/briefing"
            className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-medical-600 text-body-lg font-bold rounded-lg hover:bg-neutral-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-[1.03]"
          >
            Preencher Briefing Agora e Garantir Minha Vaga
            <ArrowRight size={24} />
          </Link>

          <p className="text-body-sm mt-4 opacity-90">
            Leva 5-10 minutos. Nenhum pagamento necessário agora.
          </p>
        </div>

        {/* Secondary CTA */}
        <div className="text-center">
          <a
            href="https://wa.me/5518317510052?text=Olá!%20Tenho%20dúvidas%20sobre%20o%20site%20odontológico"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-md underline hover:text-mint-300 transition-colors duration-300"
          >
            Ainda tem dúvidas? Fale conosco no WhatsApp
          </a>
        </div>

        {/* Final Social Proof */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-body-md opacity-90 mb-4">
            Junte-se a centenas de dentistas que já transformaram suas práticas:
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 text-body-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint-300" />
              <span>500+ sites entregues</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint-300" />
              <span>98.7% de aprovação</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint-300" />
              <span>Avaliação 4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint-300" />
              <span>Especialistas há 5 anos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASectionNew;
