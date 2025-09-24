import React from 'react';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Counter from '../ui/counter';
import mockupImage from '../../assets/dental-website-mockup.jpg';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="section-hero min-h-screen flex items-center pt-20 lg:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-white">
              Seu Site Odontológico Profissional 
              <span className="block text-success-light">Pronto em Apenas 24 Horas</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Pare de perder pacientes para a concorrência. Tenha um site que atrai, 
              converte e posiciona você como autoridade na sua especialidade.
            </p>

            {/* Credibility Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-success-light" />
                <span>Responsivo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-success-light" />
                <span>Otimizado Google</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-success-light" />
                <span>Hospedagem Incluída</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
              <div className="badge-credibility">
                <Users size={16} className="mr-1" />
                <Counter targetNumber={500} suffix="+ dentistas atendidos" />
              </div>
              <div className="badge-urgent">
                <Clock size={16} className="mr-1" />
                Entrega em 24h
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link 
                to="/briefing"
                className="btn-hero text-lg px-8 py-4"
              >
                🚀 QUERO MEU SITE EM 24H - R$ 497
              </Link>
              <button 
                onClick={() => document.getElementById('ofertas')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-white border-white hover:bg-white hover:text-primary"
              >
                Ver Parcelamento
              </button>
            </div>

            <p className="text-white/70 text-sm">
              💳 Ou 12x de R$ 49,70 sem juros
            </p>
          </div>

          {/* Mockup & Form */}
          <div className="relative">
            <div className="card-premium bg-white/10 glass border-white/20">
              <img 
                src={mockupImage}
                alt="Mockup de site odontológico responsivo"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;