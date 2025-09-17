import React from 'react';
import { Star, TrendingUp, DollarSign, Award, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Counter from '../ui/counter';
import professionalDentist from '../../assets/professional-dentist.jpg';
import draFernandaCosta from '../../assets/dra-fernanda-costa.jpg';
import drPauloSantos from '../../assets/dr-paulo-santos.jpg';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Dr. Ricardo Almeida",
      specialty: "Ortodontista",
      location: "São Paulo - SP", 
      photo: professionalDentist,
      testimonial: "Inacreditável! Em 24h tinha um site mais profissional que concorrentes com anos de mercado. Em 1 mês, já recuperei o investimento com novos pacientes vindos do Google.",
      result: "+200% em agendamentos online",
      rating: 5,
      badge: "Resultado Comprovado"
    },
    {
      name: "Dra. Fernanda Costa",
      specialty: "Implantodontista", 
      location: "Rio de Janeiro - RJ",
      photo: draFernandaCosta,
      testimonial: "Estava pagando R$ 300/mês para uma agência que nunca entregava nada. Aqui em 1 dia estava tudo pronto e funcionando. Recomendo para todos os colegas!",
      result: "Economia de R$ 3.600/ano",
      rating: 5,
      badge: "Economia Máxima"
    },
    {
      name: "Dr. Paulo Santos",
      specialty: "Clínica Geral",
      location: "Belo Horizonte - MG",
      photo: drPauloSantos,
      testimonial: "O processo foi tão simples que nem acreditei. Mandei o briefing na segunda, na terça estava no ar. Site responsivo, rápido e que realmente converte.",
      result: "1º posição no Google local",
      rating: 5,
      badge: "SEO Otimizado"
    }
  ];

  const stats = [
    {
      number: 500,
      suffix: "+",
      label: "sites entregues",
      sublabel: "em tempo recorde",
      icon: Award
    },
    {
      number: 98.7,
      suffix: "%",
      label: "de aprovação",
      sublabel: "na primeira entrega",
      icon: Star
    },
    {
      number: 150,
      suffix: "%",
      label: "aumento médio",
      sublabel: "em consultas",
      icon: TrendingUp
    },
    {
      number: 4.9,
      suffix: "/5",
      label: "estrelas",
      sublabel: "de satisfação média",
      icon: Star
    }
  ];

  return (
    <section id="depoimentos" className="py-20 section-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Mais de <Counter targetNumber={500} /> Dentistas Já
            <span className="block text-success">Transformaram Suas Práticas</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Veja os resultados reais de colegas que decidiram investir em sua presença digital 
            e como isso impactou positivamente seus consultórios.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-testimonial relative">
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="badge-credibility text-xs">
                  {testimonial.badge}
                </span>
              </div>

              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary-ultra-light rounded-full flex items-center justify-center">
                  <Quote size={24} className="text-primary" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-highlight fill-current" />
                ))}
              </div>

              {/* Testimonial */}
              <blockquote className="text-text-secondary mb-6 italic">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Result */}
              <div className="bg-success-bg rounded-lg p-3 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 text-success-dark font-semibold">
                  <TrendingUp size={16} />
                  {testimonial.result}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-primary text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {testimonial.specialty}
                  </p>
                  <p className="text-text-light text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
            Números de Impacto Comprovados
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-ultra-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={32} className="text-primary" />
                </div>
                
                <div className="text-4xl font-bold text-primary mb-2">
                  <Counter 
                    targetNumber={stat.number} 
                    suffix={stat.suffix}
                    duration={2500}
                  />
                </div>
                
                <p className="text-text-primary font-semibold">
                  {stat.label}
                </p>
                <p className="text-text-secondary text-sm">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Timeline */}
        <div className="bg-text-primary text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            📱 Atividade em Tempo Real
          </h3>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <div className="w-3 h-3 bg-success-light rounded-full animate-pulse"></div>
              <span className="text-success-light font-medium">Há 3 minutos:</span>
              <span>Site #845 aprovado - Dr. João (Campinas/SP)</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <div className="w-3 h-3 bg-orange-warning rounded-full animate-pulse"></div>
              <span className="text-orange-warning font-medium">Em desenvolvimento:</span>
              <span>Site #846 - Dra. Maria (Salvador/BA)</span>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <div className="w-3 h-3 bg-yellow-highlight rounded-full animate-pulse"></div>
              <span className="text-yellow-highlight font-medium">Aguardando briefing:</span>
              <span>Site #847 - Dr. Pedro (Fortaleza/CE)</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/80">
              🎯 Seja o próximo dentista a transformar sua prática digital
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link 
            to="/formulario"
            className="btn-hero text-xl px-12 py-5"
          >
            Quero Resultados Como Esses!
          </Link>
          <p className="text-text-secondary mt-4">
            ⭐ Junte-se aos <Counter targetNumber={500} suffix="+ dentistas" /> satisfeitos
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;