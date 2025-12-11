import React from 'react';
import { Calendar, Users, DollarSign } from 'lucide-react';

const ProblemsSection: React.FC = () => {
  const problems = [
    {
      icon: Calendar,
      title: "Agenda Vazia nos Horários Nobres",
      description: "Enquanto isso, clínicas com site profissional têm fila de espera..."
    },
    {
      icon: Users,
      title: "Dependência Total de Indicações",
      description: "E se seus pacientes atuais pararem de indicar? Você fica sem novos agendamentos?"
    },
    {
      icon: DollarSign,
      title: "Perdendo Pacientes Particulares",
      description: "Sem presença online, você atrai só convênio. Particulares vão para quem aparece no Google."
    }
  ];

  return (
    <section id="problemas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-text-secondary">dos pacientes escolhem dentistas online</p>
          </div>
          <div className="card-premium">
            <div className="text-4xl font-bold text-red-alert mb-2">90%</div>
            <p className="text-text-secondary">procuram no Google antes de agendar</p>
          </div>
          <div className="card-premium">
            <div className="text-4xl font-bold text-red-alert mb-2">24h</div>
            <p className="text-text-secondary">sua concorrência está captando pacientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;