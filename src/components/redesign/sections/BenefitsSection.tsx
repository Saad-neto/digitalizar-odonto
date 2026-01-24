import React from 'react';
import { Search, Star, Zap } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
            O Que Você Conquista <span className="text-medical-600">Com Um Site Profissional</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Não é só um site. É uma <strong>máquina de atração de pacientes</strong> trabalhando
            24/7 para você.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Search,
              titulo: 'Visibilidade no Google',
              desc: 'Apareça quando pacientes buscam dentista na sua região. SEO otimizado para rankear rápido.',
              cor: 'medical',
            },
            {
              icon: Star,
              titulo: 'Credibilidade Profissional',
              desc: 'Transmita confiança e seriedade. Pacientes escolhem quem tem presença digital sólida.',
              cor: 'mint',
            },
            {
              icon: Zap,
              titulo: 'Captação Automática',
              desc: 'Formulários, WhatsApp integrado, orçamentos chegando mesmo quando você não está trabalhando.',
              cor: 'medical',
            },
          ].map((resultado, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-white to-neutral-50 rounded-2xl p-8 shadow-lg border-2 border-neutral-100 hover:shadow-xl transition-all group"
            >
              <div
                className={`bg-${resultado.cor}-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <resultado.icon size={32} className={`text-${resultado.cor}-600`} />
              </div>
              <h3 className="font-semibold text-xl text-neutral-900 mb-3">
                {resultado.titulo}
              </h3>
              <p className="text-neutral-600">{resultado.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-medical-50 to-mint-50 rounded-2xl p-8 text-center max-w-4xl mx-auto border-2 border-medical-100">
          <p className="text-lg text-neutral-700">
            <strong className="text-medical-700">Investimento inteligente:</strong> Um site
            profissional se paga com{' '}
            <strong className="text-medical-700">apenas 2-3 pacientes novos</strong>. Depois
            disso, é lucro puro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
