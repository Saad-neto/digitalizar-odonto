import React from 'react';
import { Zap, Target, DollarSign, Smartphone, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Counter from '../ui/counter';
import Timer from '../ui/timer';

const SolutionSection: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: "VELOCIDADE INCOMPARÁVEL",
      description: "Seu site profissional pronto em 24h (não 30-60 dias como a concorrência)",
      color: "text-yellow-highlight"
    },
    {
      icon: Target,
      title: "ESPECIALIZAÇÃO TOTAL", 
      description: "Focamos 100% em dentistas - conhecemos suas dores e necessidades",
      color: "text-primary"
    },
    {
      icon: DollarSign,
      title: "PREÇO JUSTO",
      description: "R$ 497 por algo que agências cobram R$ 3.000+",
      color: "text-success"
    },
    {
      icon: Smartphone,
      title: "TUDO INCLUÍDO",
      description: "Responsivo, SSL, hospedagem premium, otimização para Google",
      color: "text-blue-trust"
    },
    {
      icon: RefreshCw,
      title: "PROCESSO SIMPLES",
      description: "Só um briefing rápido e deixamos tudo pronto para você",
      color: "text-orange-warning"
    },
    {
      icon: Users,
      title: "EQUIPE DEDICADA EXCLUSIVA",
      description: "Nossa equipe especializada trabalha exclusivamente com dentistas há 5 anos. Conhecemos cada detalhe do seu mercado e temos disponibilidade garantida para entregar seu projeto no prazo.",
      color: "text-purple-600"
    }
  ];

  return (
    <section id="solucao" className="py-20 section-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            A Única Solução Que Entrega Seu Site Profissional
            <span className="block text-primary">em 24 Horas</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto">
            Desenvolvemos sites odontológicos há 5 anos. Criamos um sistema exclusivo que nos permite 
            entregar sites profissionais de alta conversão em tempo recorde, sem comprometer a qualidade.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="card-premium text-center">
              <div className="w-20 h-20 bg-primary-ultra-light rounded-full flex items-center justify-center mx-auto mb-6">
                <benefit.icon size={40} className={benefit.color} />
              </div>
              
              <h3 className="text-xl font-bold text-text-primary mb-4">
                ⚡ {benefit.title}
              </h3>
              
              <p className="text-text-secondary">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Proof Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-text-primary mb-6">
              Prova do Nosso Diferencial
            </h3>
            
            <div className="space-y-6">
              <div className="bg-text-primary text-white rounded-lg p-6 text-center">
                <p className="text-lg font-semibold mb-2">Próximo site será entregue em:</p>
                <Timer 
                  initialHours={18}
                  initialMinutes={45}
                  initialSeconds={22}
                  className="text-3xl"
                />
              </div>

              <div className="card-premium bg-success-bg border-success/20">
                <div className="text-center">
                  <p className="text-lg font-semibold text-success-dark mb-2">
                    Site #<Counter targetNumber={847} /> sendo finalizado agora
                  </p>
                  <p className="text-text-secondary">
                    Para Dr. Carlos - Implantodontista - Campinas/SP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    <Counter targetNumber={500} suffix="+" />
                  </div>
                  <p className="text-text-secondary">Sites Entregues</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">98.7%</div>
                  <p className="text-text-secondary">Aprovação</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium">
            <h4 className="text-2xl font-bold text-text-primary mb-6 text-center">
              Por Que Somos Diferentes?
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h5 className="font-semibold text-text-primary">5 Anos de Especialização</h5>
                  <p className="text-text-secondary text-sm">Só trabalhamos com dentistas desde 2019</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h5 className="font-semibold text-text-primary">Sistema Proprietário</h5>
                  <p className="text-text-secondary text-sm">Desenvolvemos templates otimizados exclusivos</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h5 className="font-semibold text-text-primary">Equipe Dedicada</h5>
                  <p className="text-text-secondary text-sm">Designers e desenvolvedores especialistas em odontologia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h5 className="font-semibold text-text-primary">Processo Otimizado</h5>
                  <p className="text-text-secondary text-sm">70% automatizado, 30% personalização manual</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-primary-ultra-light rounded-lg p-4 text-center">
              <p className="text-primary font-semibold">
                🎯 Resultado: Qualidade profissional em tempo recorde
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link 
            to="/briefing"
            className="btn-hero text-xl px-12 py-5"
          >
            Quero Meu Site em 24h Também!
          </Link>
          <p className="text-text-secondary mt-4">
            Junte-se aos <Counter targetNumber={500} suffix="+ dentistas" /> que já transformaram suas práticas
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;