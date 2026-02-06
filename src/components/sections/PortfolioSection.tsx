import { ExternalLink, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/LazyImage";

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
    id: "sorrisos-pequeninos",
    nome: "Dra. Ana Carolina Silva",
    especialidade: "Odontopediatria - Sorrisos Pequeninos",
    cidade: "São Paulo",
    estado: "SP",
    url: "https://odontopediatria.digitalizarmkt.com.br/",
    screenshot: "/portfolio/odontopediatria.png",
    estilo: "Humanizado & Acolhedor",
    tags: ["Infantil", "Atendimento Humanizado", "Família"],
    descricao: "Consultório de odontopediatria especializado em atendimento infantil humanizado para crianças.",
    destaque: true,
    corPrimaria: "from-pink-400 to-purple-500"
  },
  {
    id: "seja-mais",
    nome: "Seja Mais Odontologia",
    especialidade: "Clínica Geral & Tecnologia",
    url: "https://clinica-geral.digitalizarmkt.com.br/",
    screenshot: "/portfolio/seja-mais.png",
    estilo: "Sofisticado & Inovador",
    tags: ["Tecnologia de Ponta", "Digital", "Inovação"],
    descricao: "Clínica moderna destacando uso de tecnologia avançada e atendimento diferenciado.",
    corPrimaria: "from-emerald-500 to-teal-600"
  }
];

export function PortfolioSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-medical-100 text-medical-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Portfólio Real
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Sites Reais que Criamos
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
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
                <LazyImage
                  src={project.screenshot}
                  alt={`Screenshot do site ${project.nome}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
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
                      className="bg-white text-medical-600 hover:bg-medical-50"
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
                <p className="text-medical-600 font-semibold mb-2">
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
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-medical-100 text-medical-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="w-full border-medical-200 text-medical-600 hover:bg-medical-50 hover:border-medical-300"
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
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-medical-500 to-medical-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Quer um Site Assim para Sua Clínica?
          </h3>
          <p className="text-medical-100 text-lg mb-6 max-w-2xl text-center">
            No briefing, você escolhe cores, estilo e todos os detalhes. Criamos um site 100% personalizado para você.
          </p>
          <Button
            size="lg"
            className="bg-white text-medical-600 hover:bg-medical-50 hover:scale-105 transition-transform text-lg px-8 py-6"
            asChild
          >
            <a href="/briefing">
              Começar Meu Site Agora →
            </a>
          </Button>
          <p className="text-medical-200 text-sm mt-4 text-center">
            Seu site no ar em até 7 dias
          </p>
        </div>

      </div>
    </section>
  );
}
