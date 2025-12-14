import React from 'react';
import { ExternalLink, Sparkles, Palette, Zap, Crown } from 'lucide-react';

const ExamplesSectionNew: React.FC = () => {
  const demos = [
    {
      title: "Clássico & Confiável",
      subtitle: "Dr. João Silva - Vila Mariana",
      description: "Design tradicional em tons de azul, perfeito para clínicas familiares que valorizam confiança e profissionalismo.",
      color: "#1E40AF",
      icon: Palette,
      screenshot: "/screenshots/demo-classico.png",
      url: "https://demo-classico.digitalizar.space",
      features: [
        "Identidade tradicional",
        "Foco em família",
        "15 anos de experiência"
      ]
    },
    {
      title: "Moderno & Tecnológico",
      subtitle: "Dental Tech - Pinheiros",
      description: "Visual moderno em verde/teal, ideal para clínicas que destacam tecnologia, inovação e atendimento digital.",
      color: "#14B8A6",
      icon: Zap,
      screenshot: "/screenshots/demo-moderno.png",
      url: "https://demo-moderno.digitalizar.space",
      features: [
        "Scanner 3D intraoral",
        "Alinhadores invisíveis",
        "Tecnologia de ponta"
      ]
    },
    {
      title: "Elegante & Premium",
      subtitle: "Instituto Sorrisos - Jardins",
      description: "Estilo sofisticado preto/dourado, perfeito para clínicas premium que oferecem harmonização facial e estética VIP.",
      color: "#D4AF37",
      icon: Crown,
      screenshot: "/screenshots/demo-elegante.png",
      url: "https://demo-elegante.digitalizar.space",
      features: [
        "Atendimento VIP",
        "Harmonização facial",
        "Localização premium"
      ]
    }
  ];

  return (
    <section className="py-section-lg bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-50 text-mint-700 rounded-full text-body-sm font-medium mb-6">
            <Sparkles size={16} />
            Exemplos Reais
          </div>

          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Escolha o Estilo Perfeito para{' '}
            <span className="text-medical-600">Sua Clínica</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Veja exemplos reais de sites que criamos. Cada um com identidade única,
            otimizado para converter visitantes em pacientes.
          </p>
        </div>

        {/* Demos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demos.map((demo, index) => {
            const IconComponent = demo.icon;

            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-100"
              >
                {/* Screenshot Preview */}
                <div className="h-64 relative overflow-hidden bg-gray-100">
                  <img
                    src={demo.screenshot}
                    alt={`${demo.title} - Preview`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <IconComponent size={32} className="mb-2" />
                      <p className="text-body-sm font-medium">Clique para ver ao vivo →</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-heading text-title-lg text-neutral-900 mb-3">
                    {demo.title}
                  </h3>

                  <p className="text-body-md text-neutral-600 leading-relaxed mb-4">
                    {demo.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {demo.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-body-sm text-neutral-700">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: demo.color }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-neutral-900 text-white text-body-md font-semibold rounded-lg hover:bg-neutral-800 transition-all duration-300 group/btn"
                  >
                    Ver Demo ao Vivo
                    <ExternalLink
                      size={16}
                      className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300"
                    />
                  </a>
                </div>

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-body-xs font-medium text-neutral-700 shadow-sm">
                    100% Online
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-xl p-8 shadow-lg border border-neutral-100">
            <p className="text-body-lg text-neutral-700 mb-4">
              <strong className="text-medical-600">Qual estilo combina mais com sua clínica?</strong>
            </p>
            <p className="text-body-md text-neutral-600 mb-6 max-w-2xl mx-auto">
              No briefing, você escolhe as cores, o estilo e todos os detalhes.
              Criamos um site 100% personalizado para você.
            </p>
            <a
              href="/briefing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Começar Meu Site Agora
              <ExternalLink size={20} />
            </a>
            <p className="text-body-sm text-neutral-500 mt-4">
              Pronto em até 7 dias úteis • Sem compromisso
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSectionNew;
