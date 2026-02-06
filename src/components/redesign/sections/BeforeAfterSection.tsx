import React from 'react';
import { TrendingUp, Users, Phone, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const BeforeAfterSection: React.FC = () => {
  const cases = [
    {
      name: "Dr. João Silva",
      specialty: "Implantodontia",
      location: "São Paulo - SP",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
      before: {
        agendamentos: 5,
        ligacoes: 8,
        visibilidade: "Página 5 do Google"
      },
      after: {
        agendamentos: 23,
        ligacoes: 45,
        visibilidade: "Top 3 do Google Maps"
      },
      metrics: {
        crescimento: "+360%",
        roi: "4.600%",
        prazo: "3 meses"
      },
      testimonial: "Investir no site foi a melhor decisão. Em 3 meses minha agenda lotou e já paguei o investimento 46 vezes!"
    },
    {
      name: "Dra. Maria Costa",
      specialty: "Ortodontia",
      location: "Rio de Janeiro - RJ",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
      before: {
        agendamentos: 12,
        ligacoes: 15,
        visibilidade: "Sem presença online"
      },
      after: {
        agendamentos: 41,
        ligacoes: 78,
        visibilidade: "1º lugar 'ortodontista [bairro]'"
      },
      metrics: {
        crescimento: "+240%",
        roi: "3.200%",
        prazo: "4 meses"
      },
      testimonial: "Não tinha site e dependia só de indicações. Agora recebo pacientes do Google todos os dias. Incrível!"
    },
    {
      name: "Dr. Pedro Mendes",
      specialty: "Clínica Geral",
      location: "Belo Horizonte - MG",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
      before: {
        agendamentos: 18,
        ligacoes: 22,
        visibilidade: "Site desatualizado de 2018"
      },
      after: {
        agendamentos: 52,
        ligacoes: 89,
        visibilidade: "Top 5 'dentista perto de mim'"
      },
      metrics: {
        crescimento: "+190%",
        roi: "2.850%",
        prazo: "2 meses"
      },
      testimonial: "Meu site antigo era horrível. O novo site profissional triplicou meus agendamentos. Valeu cada centavo!"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4 leading-tight">
            Resultados Reais de Dentistas Como Você
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Veja como nossos clientes transformaram seus consultórios com um site profissional.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((caseData, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-neutral-200 hover:border-medical-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header com Foto */}
              <div className="relative h-48 bg-gradient-to-br from-medical-100 to-mint-100">
                <LazyImage
                  src={caseData.image}
                  alt={caseData.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-heading font-bold">{caseData.name}</h3>
                  <p className="text-sm opacity-90">{caseData.specialty}</p>
                  <p className="text-xs opacity-75">{caseData.location}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Antes vs Depois */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Antes */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-semibold text-neutral-500 mb-3 uppercase">Antes</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-neutral-400" />
                        <span className="text-sm text-neutral-700">{caseData.before.agendamentos}/mês</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-neutral-400" />
                        <span className="text-sm text-neutral-700">{caseData.before.ligacoes}/mês</span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2">{caseData.before.visibilidade}</p>
                    </div>
                  </div>

                  {/* Depois */}
                  <div className="bg-gradient-to-br from-mint-50 to-medical-50 rounded-lg p-4 border-2 border-mint-500">
                    <p className="text-xs font-semibold text-mint-700 mb-3 uppercase">Depois</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-mint-600" />
                        <span className="text-sm font-bold text-neutral-900">{caseData.after.agendamentos}/mês</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-mint-600" />
                        <span className="text-sm font-bold text-neutral-900">{caseData.after.ligacoes}/mês</span>
                      </div>
                      <p className="text-xs font-semibold text-mint-700 mt-2">{caseData.after.visibilidade}</p>
                    </div>
                  </div>
                </div>

                {/* Métricas Destaque */}
                <div className="bg-medical-50 rounded-lg p-4 border-2 border-medical-200">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp size={16} className="text-medical-600" />
                      </div>
                      <div className="text-2xl font-bold text-medical-600">{caseData.metrics.crescimento}</div>
                      <div className="text-xs text-neutral-600">Crescimento</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign size={16} className="text-mint-600" />
                      </div>
                      <div className="text-2xl font-bold text-mint-600">{caseData.metrics.roi}</div>
                      <div className="text-xs text-neutral-600">ROI</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users size={16} className="text-gold-600" />
                      </div>
                      <div className="text-2xl font-bold text-gold-600">{caseData.metrics.prazo}</div>
                      <div className="text-xs text-neutral-600">Prazo</div>
                    </div>
                  </div>
                </div>

                {/* Depoimento */}
                <div className="bg-neutral-50 rounded-lg p-4 border-l-4 border-medical-500">
                  <p className="text-sm text-neutral-700 italic leading-relaxed">
                    "{caseData.testimonial}"
                  </p>
                </div>

                {/* Investimento */}
                <div className="text-center pt-2">
                  <p className="text-sm text-neutral-600 mb-1">
                    Investimento inicial:
                  </p>
                  <p className="text-2xl font-bold text-medical-600">
                    R$ 497
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Retorno: R$ {(497 * parseInt(caseData.metrics.roi.replace('%', '').replace('.', '')) / 100).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-gradient-to-r from-medical-500 to-medical-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Você Pode Ser o Próximo Case de Sucesso
            </h3>
            <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Invista R$ 497 uma vez e transforme seu consultório. Sem mensalidades, sem surpresas.
            </p>
            <a
              href="/briefing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-medical-600 font-bold rounded-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Começar Agora
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
