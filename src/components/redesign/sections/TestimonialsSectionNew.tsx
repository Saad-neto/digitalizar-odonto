import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, TrendingUp, ArrowRight } from 'lucide-react';
import Counter from '../../ui/counter';
import professionalDentist from '../../../assets/professional-dentist.jpg';
import draFernandaCosta from '../../../assets/dra-fernanda-costa.jpg';
import drPauloSantos from '../../../assets/dr-paulo-santos.jpg';

const TestimonialsSectionNew: React.FC = () => {
  const testimonials = [
    {
      name: "Dr. Ricardo Almeida",
      specialty: "Ortodontista",
      location: "São Paulo - SP",
      photo: professionalDentist,
      testimonial: "Eu estava gastando R$ 2 mil/mês com anúncios no Facebook e vinha 1, 2 pacientes. Fiz o site em janeiro. Em fevereiro já apareci na primeira página do Google para 'ortodontista [bairro]'. Março tive 8 agendamentos orgânicos. Abril, 14. Maio, 23. Parei os anúncios. Hoje 70% dos meus pacientes novos vêm do site.",
      result: "+200% em agendamentos nos primeiros 90 dias",
      rating: 5
    },
    {
      name: "Dra. Fernanda Costa",
      specialty: "Implantodontista",
      location: "Rio de Janeiro - RJ",
      photo: draFernandaCosta,
      testimonial: "Estava pagando R$ 300/mês para uma agência que nunca entregava nada. Aqui em 1 dia estava tudo pronto e funcionando. O melhor investimento que fiz para o consultório este ano.",
      result: "Economia de R$ 3.600/ano + resultados reais",
      rating: 5
    },
    {
      name: "Dr. Paulo Santos",
      specialty: "Clínica Geral",
      location: "Belo Horizonte - MG",
      photo: drPauloSantos,
      testimonial: "O processo foi tão simples que nem acreditei. Mandei o briefing na segunda, na terça estava aprovando o layout, na quinta o site já estava no ar. Profissionalismo total.",
      result: "1º posição no Google local em 30 dias",
      rating: 5
    }
  ];

  return (
    <section className="py-section-lg bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Mais de <Counter targetNumber={500} suffix="+ Dentistas" />{' '}
            <span className="text-medical-600">Já Transformaram Suas Práticas</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Veja os resultados reais de colegas que decidiram investir em presença digital
            profissional e como isso impactou positivamente seus consultórios.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-500 fill-current" />
                ))}
              </div>

              {/* Quote Icon */}
              <div className="mb-4">
                <Quote size={32} className="text-medical-200" />
              </div>

              {/* Testimonial */}
              <blockquote className="text-body-md text-neutral-700 leading-relaxed mb-6">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Result Badge */}
              <div className="bg-mint-50 border border-mint-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 text-mint-700 font-semibold text-body-sm">
                  <TrendingUp size={16} />
                  {testimonial.result}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-neutral-900 text-body-md">
                    {testimonial.name}
                  </h4>
                  <p className="text-neutral-600 text-body-sm">
                    {testimonial.specialty}
                  </p>
                  <p className="text-neutral-500 text-body-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-title-xl font-bold text-medical-600 mb-2">
                <Counter targetNumber={500} suffix="+" duration={2000} />
              </div>
              <p className="text-body-md font-medium text-neutral-900">Sites Entregues</p>
              <p className="text-body-sm text-neutral-500">Em tempo recorde</p>
            </div>

            <div>
              <div className="text-title-xl font-bold text-medical-600 mb-2">
                98.7%
              </div>
              <p className="text-body-md font-medium text-neutral-900">Taxa de Aprovação</p>
              <p className="text-body-sm text-neutral-500">Na primeira entrega</p>
            </div>

            <div>
              <div className="text-title-xl font-bold text-medical-600 mb-2">
                <Counter targetNumber={150} suffix="%" duration={2000} />
              </div>
              <p className="text-body-md font-medium text-neutral-900">Aumento Médio</p>
              <p className="text-body-sm text-neutral-500">Em consultas nos primeiros 90 dias</p>
            </div>

            <div>
              <div className="text-title-xl font-bold text-medical-600 mb-2">
                4.9/5
              </div>
              <p className="text-body-md font-medium text-neutral-900">Avaliação Média</p>
              <p className="text-body-sm text-neutral-500">Satisfação dos clientes</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="font-heading text-title-lg text-neutral-900 mb-6">
            Pronto para ter resultados como esses?
          </h3>

          <Link
            to="/briefing"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Quero Resultados Como Esses
            <ArrowRight size={22} />
          </Link>

          <p className="text-body-sm text-neutral-500 mt-4">
            Junte-se aos <Counter targetNumber={500} suffix="+ dentistas" /> satisfeitos
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionNew;
