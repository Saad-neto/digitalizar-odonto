import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const SolutionSectionNew: React.FC = () => {
  const benefits = [
    {
      title: "Site Profissional em Até 7 Dias Úteis",
      description: "Sem meses de espera. Sem enrolação. Briefing completo → layout aprovado → site no ar. Simples assim."
    },
    {
      title: "Design Personalizado para Sua Especialidade",
      description: "Não é template genérico. É um site único que reflete sua expertise, seus diferenciais e atrai exatamente o perfil de paciente que você quer."
    },
    {
      title: "Otimizado para Google (SEO)",
      description: "Seu site vai aparecer nas buscas locais. Quando alguém procurar 'dentista [sua cidade]' ou 'implante dentário [bairro]', você estará lá."
    },
    {
      title: "Responsivo e Moderno",
      description: "Funciona perfeitamente em celular, tablet e desktop. Seus pacientes navegam de onde estiverem, sem complicação."
    },
    {
      title: "Integração WhatsApp e Agendamento",
      description: "Facilite o contato. Botão de WhatsApp sempre visível + formulários otimizados para conversão máxima."
    },
    {
      title: "Hospedagem Profissional Incluída",
      description: "12 meses de hospedagem grátis. Site rápido, seguro e sempre no ar. Você não precisa se preocupar com nada técnico."
    }
  ];

  return (
    <section className="py-section-lg bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 text-mint-700 rounded-full text-body-sm font-medium mb-6">
            <Sparkles size={16} />
            A Solução Profissional
          </div>

          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Site Odontológico Profissional que{' '}
            <span className="text-medical-600">Atrai Pacientes Particulares Todos os Dias</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Chega de perder tempo e dinheiro com soluções amadoras. Tenha um site que trabalha para você
            24/7, atraindo pacientes de alto valor enquanto você cuida do que realmente importa: sua clínica.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative pl-8"
            >
              {/* Checkmark Icon */}
              <div className="absolute left-0 top-1">
                <CheckCircle2 size={24} className="text-mint-500" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-title-md text-neutral-900 mb-3 leading-snug">
                {benefit.title}
              </h3>

              <p className="text-body-md text-neutral-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Value Proposition Box */}
        <div className="bg-gradient-to-br from-medical-500 to-medical-700 rounded-2xl p-8 lg:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left - Value Prop */}
              <div>
                <h3 className="font-heading text-title-lg mb-4">
                  O Diferencial que Nossos Clientes Mais Valorizam:
                </h3>
                <p className="text-body-lg leading-relaxed opacity-95 mb-6">
                  <strong className="text-mint-300">Você só paga depois de aprovar o layout.</strong>
                </p>
                <p className="text-body-md leading-relaxed opacity-90">
                  Isso mesmo. Zero risco. Criamos o design do seu site, você revisa, aprova
                  (ou pede ajustes), e só depois disso você efetua o pagamento. Se não gostar,
                  não paga. Simples assim.
                </p>
              </div>

              {/* Right - CTA */}
              <div className="text-center lg:text-right">
                <div className="inline-block bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-neutral-600 text-body-sm mb-4">
                    Pronto para ter um site que converte?
                  </p>
                  <Link
                    to="/briefing"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    Começar Meu Site Agora
                    <ArrowRight size={20} />
                  </Link>
                  <p className="text-neutral-500 text-body-sm mt-4">
                    Sem compromisso. Sem cartão de crédito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="mt-12 text-center">
          <p className="text-body-md text-neutral-600 mb-4">
            Junte-se a centenas de dentistas que já transformaram suas práticas:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-mint-500" />
              <span className="text-body-sm">500+ sites entregues</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-mint-500" />
              <span className="text-body-sm">98.7% de aprovação</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-mint-500" />
              <span className="text-body-sm">Avaliação 4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSectionNew;
