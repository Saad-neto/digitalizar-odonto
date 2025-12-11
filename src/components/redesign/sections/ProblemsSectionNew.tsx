import React from 'react';
import { AlertCircle, TrendingDown, Users, Clock } from 'lucide-react';

const ProblemsSectionNew: React.FC = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: "Perdendo Receita para Concorrentes",
      description: "Pacientes pesquisam online antes de agendar. Sem site profissional, você é invisível no Google enquanto concorrentes aparecem primeiro e capturam esses pacientes de alto valor.",
      impact: "Média de R$ 15.000/mês em consultas perdidas"
    },
    {
      icon: Users,
      title: "Dependência de Indicações",
      description: "Depender apenas de indicações limita seu crescimento. Um site profissional atrai pacientes novos continuamente, sem depender da agenda lotada de pacientes atuais.",
      impact: "70% dos novos pacientes vêm de buscas online"
    },
    {
      icon: Clock,
      title: "Tempo Perdido com Soluções Baratas",
      description: "Já tentou agências que prometem muito e entregam pouco? Sites genéricos de plataformas baratas? Meses de espera sem resultado? Tempo é dinheiro no seu consultório.",
      impact: "Meses de atraso = milhares em receita perdida"
    }
  ];

  return (
    <section className="py-section-lg bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-body-sm font-medium mb-6">
            <AlertCircle size={16} />
            Situação Crítica
          </div>

          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Enquanto Você Lê Isso, Pacientes Particulares Estão{' '}
            <span className="text-medical-600">Escolhendo Seus Concorrentes</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            A dura verdade: sem presença digital profissional, você está perdendo dinheiro todos os dias.
            Veja os 3 principais problemas que estão custando caro ao seu consultório:
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                <problem.icon size={28} className="text-red-600" />
              </div>

              {/* Title */}
              <h3 className="font-heading text-title-md text-neutral-900 mb-4">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-body-md text-neutral-600 leading-relaxed mb-6">
                {problem.description}
              </p>

              {/* Impact */}
              <div className="pt-4 border-t border-neutral-200">
                <p className="text-body-sm font-semibold text-red-700">
                  {problem.impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Emotional Hook - Storytelling */}
        <div className="bg-gradient-to-br from-medical-50 to-mint-50 rounded-2xl p-8 lg:p-12 border border-medical-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-heading text-title-lg text-neutral-900 mb-6 text-center">
              Você Investiu Anos se Especializando...
            </h3>

            <div className="space-y-4 text-body-lg text-neutral-700 leading-relaxed">
              <p>
                Investiu em cursos, pós-graduação, equipamentos de ponta. Seu consultório é impecável.
                Seus pacientes atuais te amam e indicam.
              </p>

              <p className="font-semibold text-neutral-900">
                Mas enquanto você cuida dos seus pacientes, dezenas de pessoas estão pesquisando no Google
                agora mesmo por um dentista na sua região.
              </p>

              <p>
                E o que elas encontram? Seus concorrentes com sites profissionais, bem posicionados,
                com fotos bonitas, depoimentos convincentes e agendamento online.
              </p>

              <p className="text-medical-700 font-semibold text-title-md pt-4">
                Resultado: Elas nunca souberam que você existe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSectionNew;
