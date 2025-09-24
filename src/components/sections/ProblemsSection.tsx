import React from 'react';
import { Search, Globe, Clock, DollarSign, FileX, Users } from 'lucide-react';

const ProblemsSection: React.FC = () => {
  const problems = [
    {
      icon: Search,
      title: "Invisível no Google",
      description: "Pacientes procuram 'dentista [sua cidade]' e você não aparece nas primeiras posições",
      impact: "Perda de até 80% dos novos pacientes"
    },
    {
      icon: Globe,
      title: "Site amador ou inexistente",
      description: "Sua concorrência tem sites profissionais enquanto você depende só do Instagram",
      impact: "Credibilidade comprometida"
    },
    {
      icon: Clock,
      title: "Demora eterna para ter um site",
      description: "Orçamentos de 30-60 dias quando você precisa de resultados agora",
      impact: "Oportunidades perdidas diariamente"
    },
    {
      icon: DollarSign,
      title: "Preços astronômicos",
      description: "Agências cobrando R$ 3.000+ por algo que deveria ser simples e rápido",
      impact: "Investimento desproporcional"
    },
    {
      icon: Users,
      title: "Escassez de profissionais qualificados",
      description: "Com o boom digital pós-pandemia, encontrar desenvolvedores web especializados em odontologia virou missão impossível - a maioria está sobrecarregada ou cobra valores abusivos",
      impact: "Orçamentos inflacionados"
    },
    {
      icon: FileX,
      title: "Complicação desnecessária",
      description: "Processos burocráticos que tomam seu tempo que deveria ser focado nos pacientes",
      impact: "Stress e perda de produtividade"
    }
  ];

  return (
    <section id="problemas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Por Que Você Está Perdendo 
            <span className="block text-red-alert">Pacientes Todos os Dias?</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Identifique se algum desses problemas está afetando seu consultório 
            e diminuindo seu faturamento mensal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {problems.map((problem, index) => (
            <div key={index} className="card-premium text-center hover:border-red-alert/20">
              <div className="w-16 h-16 bg-red-light rounded-full flex items-center justify-center mx-auto mb-4">
                <problem.icon size={32} className="text-red-alert" />
              </div>
              
              <h3 className="text-xl font-bold text-text-primary mb-3">
                ❌ {problem.title}
              </h3>
              
              <p className="text-text-secondary mb-4">
                {problem.description}
              </p>
              
              <div className="bg-red-light rounded-lg p-3">
                <p className="text-sm font-semibold text-red-alert">
                  📉 {problem.impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Statement */}
        <div className="bg-red-alert/10 border border-red-alert/20 rounded-2xl p-8 text-center">
          <p className="text-xl text-text-primary font-semibold italic">
            "Enquanto você não tem um site profissional, seus concorrentes estão atraindo 
            <span className="text-red-alert font-bold"> OS SEUS pacientes </span>
            24 horas por dia."
          </p>
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