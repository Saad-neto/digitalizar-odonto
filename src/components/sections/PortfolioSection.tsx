import { ExternalLink, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioProject {
  id: string;
  nome: string;
  especialidade: string;
  cidade?: string;
  estado?: string;
  url: string;
  screenshot: string; // Caminho local do screenshot
  estilo: string;
  tags: string[];
  descricao: string;
  destaque?: boolean;
  corPrimaria: string; // Para o gradiente do placeholder
}

const projects: PortfolioProject[] = [
  {
    id: "kalina-carvalho",
    nome: "Dra. Kalina Carvalho",
    especialidade: "Odontopediatria",
    cidade: "João Pessoa",
    estado: "PB",
    url: "https://kalinacarvalho.digitalizar.space/",
    screenshot: "/portfolio/kalina-carvalho.png",
    estilo: "Acolhedor & Profissional",
    tags: ["Infantil", "Família", "Agendamento Online"],
    descricao: "Site especializado em odontopediatria com design acolhedor e informativo para pais e crianças.",
    destaque: true,
    corPrimaria: "from-pink-400 to-purple-500"
  },
  {
    id: "mauro-lino",
    nome: "Dr. Mauro Lino",
    especialidade: "Reabilitação Orofacial",
    url: "https://sites-odonto-demo4.digitalizar.space/",
    screenshot: "/portfolio/mauro-lino.png",
    estilo: "Moderno & Técnico",
    tags: ["Reabilitação", "Prótese", "Alta Complexidade"],
    descricao: "Portal profissional focado em reabilitação orofacial e tratamentos especializados.",
    corPrimaria: "from-blue-500 to-cyan-500"
  },
  {
    id: "seja-mais",
    nome: "Seja Mais Odontologia",
    especialidade: "Clínica Geral & Tecnologia",
    url: "https://sites-odonto-demo6.digitalizar.space/",
    screenshot: "/portfolio/seja-mais.png",
    estilo: "Sofisticado & Inovador",
    tags: ["Tecnologia de Ponta", "Digital", "Inovação"],
    descricao: "Clínica moderna destacando uso de tecnologia avançada e atendimento diferenciado.",
    corPrimaria: "from-emerald-500 to-teal-600"
  }
];

export function PortfolioSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Portfólio Real
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sites Reais que Criamos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada projeto é único, desenvolvido com identidade própria e otimizado para converter visitantes em pacientes.
          </p>
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
            >
              {/* Preview do Site - Screenshot Real */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Screenshot Real do Site (Local) */}
                <img
                  src={project.screenshot}
                  alt={`Screenshot do site ${project.nome}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback: mostrar gradiente se screenshot falhar
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Gradiente de Identidade Visual (Overlay sutil) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.corPrimaria} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                {/* Badge de Destaque */}
                {project.destaque && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Destaque
                  </div>
                )}

                {/* Overlay com "Ver Site" ao Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-50"
                      asChild
                    >
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Site ao Vivo
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Nome do Site no Preview */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <h3 className="font-bold text-gray-900 text-lg">{project.nome}</h3>
                  </div>
                </div>
              </div>

              {/* Informações do Projeto */}
              <div className="p-6">
                {/* Localização */}
                {project.cidade && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    {project.cidade}, {project.estado}
                  </div>
                )}

                {/* Especialidade */}
                <p className="text-purple-600 font-semibold mb-2">
                  {project.especialidade}
                </p>

                {/* Estilo */}
                <p className="text-gray-700 text-sm font-medium mb-3">
                  {project.estilo}
                </p>

                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.descricao}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                  asChild
                >
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    Visitar Site
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Quer um Site Assim para Sua Clínica?
          </h3>
          <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto">
            No briefing, você escolhe cores, estilo e todos os detalhes. Criamos um site 100% personalizado para você.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 transition-transform text-lg px-8 py-6"
            asChild
          >
            <a href="/briefing">
              Começar Meu Site Agora →
            </a>
          </Button>
          <p className="text-purple-200 text-sm mt-4">
            Pronto em até 7 dias úteis • Sem compromisso
          </p>
        </div>

      </div>
    </section>
  );
}
