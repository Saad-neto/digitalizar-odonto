import React from 'react';
import { Calendar, Users, DollarSign } from 'lucide-react';

const ProblemsSection: React.FC = () => {
  const problems = [
    {
      icon: Calendar,
      title: "Agenda Vazia nos Horários Nobres",
      description: "Segunda às 9h, você atende. Terça às 14h, horário nobre vazio. Enquanto isso, clínicas com site profissional têm fila de espera e recusam pacientes. Você está literalmente perdendo R$ 2-5 mil por semana nesses horários vazios."
    },
    {
      icon: Users,
      title: "Dependência Total de Indicações",
      description: "Você depende 100% de indicações boca a boca. Mês bom = muitas indicações. Mês ruim = agenda vazia. E se seus pacientes atuais pararem de indicar? Sem controle sobre sua própria geração de pacientes, você fica refém da sorte."
    },
    {
      icon: DollarSign,
      title: "Perdendo Pacientes Particulares de Alto Valor",
      description: "Sem presença online profissional, você atrai só convênio (ticket baixo, margens apertadas). Pacientes particulares que pagam R$ 500-2.000 por tratamento buscam no Google 'dentista [sua cidade]' e vão para quem aparece primeiro - seus concorrentes."
    }
  ];

  return (
    <section id="problemas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Storytelling Introduction */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <p className="text-xl text-text-secondary leading-relaxed mb-6 italic">
            "Dr. João tinha um consultório vazio às 14h toda terça e quinta.
            Enquanto isso, uma colega que abriu há 6 meses na mesma rua
            tinha fila de espera. A diferença? Ela aparecia na primeira
            página do Google quando alguém buscava 'dentista [bairro]'."
          </p>
        </div>

        <div className="text-center mb-16">
          <h2 className="mb-6">
            Reconhece Alguma
            <span className="block text-red-alert">Dessas Situações?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {problems.map((problem, index) => (
            <div key={index} className="card-premium text-center hover:border-red-alert/20 p-8">
              <div className="w-24 h-24 bg-red-light rounded-full flex items-center justify-center mx-auto mb-6">
                <problem.icon size={48} className="text-red-alert" />
              </div>

              <h3 className="text-2xl font-bold text-text-primary mb-4">
                ❌ {problem.title}
              </h3>

              <p className="text-lg text-text-secondary leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div className="card-premium">
            <div className="text-4xl font-bold text-red-alert mb-2">73%</div>
            <p className="text-text-secondary">dos pacientes escolhem dentistas online (Pesquisa Google Health, 2024)</p>
          </div>
          <div className="card-premium">
            <div className="text-4xl font-bold text-red-alert mb-2">90%</div>
            <p className="text-text-secondary">procuram no Google antes de agendar (Estudo Local Search, 2024)</p>
          </div>
          <div className="card-premium">
            <div className="text-4xl font-bold text-red-alert mb-2">24h/dia</div>
            <p className="text-text-secondary">sua concorrência está captando pacientes enquanto você dorme</p>
          </div>
        </div>

        {/* Solution Teaser */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-success-bg border-2 border-success rounded-xl p-6">
            <p className="text-xl font-semibold text-success-dark">
              A boa notícia? Você está a 7 dias de reverter TODOS esses problemas.<br />
              E sem arriscar um centavo antes de ver o resultado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;