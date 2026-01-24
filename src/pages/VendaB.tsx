import React from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import WhatsAppFloating from '../components/redesign/WhatsAppFloating';
import { PortfolioSection } from '../components/sections/PortfolioSection';
import PricingPlansSection from '../components/redesign/sections/PricingPlansSection';
import {
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  TrendingUp,
  Search,
  Star,
  Target,
  Zap,
  MessageCircle
} from 'lucide-react';

// VERSÃO B: ASPIRACIONAL - Para tráfego próprio (tráfego morno/quente)
// Foco: Resultado → Benefícios → Transformação

const VendaB: React.FC = () => {
  const scrollToPrecos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('precos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Site + Agendamento Automático para Dentistas | Sistema Completo"
        description="Site profissional com agendamento online, confirmação automática por WhatsApp, blog integrado e dashboard administrativo. Tecnologia React + TypeScript."
        keywords="site para dentista, agendamento online dentista, site odontológico, blog dentista, sistema agendamento"
      />

      <HeaderNew />

      <main className="pt-20">
        {/* HERO - ASPIRACIONAL */}
        <section className="relative bg-gradient-to-b from-white to-neutral-50 py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Aspiração */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-mint-100 text-mint-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <TrendingUp size={18} />
                  Sistema completo com agendamento automático + blog integrado
                </div>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight">
                  Site + Agendamento Automático{' '}
                  <span className="text-medical-600">Para Dentistas</span>
                </h1>

                <p className="text-xl text-neutral-700 leading-relaxed">
                  Agendamento online com <strong>confirmação automática via WhatsApp</strong>,
                  blog integrado com CMS profissional e dashboard completo. Tudo em um só lugar.
                </p>

                <div className="space-y-3">
                  {[
                    'Sistema de agendamento online com calendário integrado',
                    'Blog profissional com CMS moderno - você mesmo publica quantos artigos quiser',
                    'Dashboard administrativo com Kanban, timeline e relatórios completos',
                    'Briefing detalhado de 8 seções para captar todos os detalhes do seu consultório',
                  ].map((beneficio, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0" />
                      <span className="text-base md:text-lg text-neutral-700">{beneficio}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="#precos"
                    onClick={scrollToPrecos}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-medical-500 text-white text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Ver Planos e Preços
                    <ArrowRight size={20} />
                  </a>

                  <a
                    href="#exemplos"
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 border-2 border-neutral-300 text-neutral-700 text-lg font-semibold rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all"
                  >
                    Ver Exemplos
                  </a>
                </div>

                <div className="flex flex-col gap-2 text-sm text-neutral-600 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-mint-500" />
                    <span>Compressão automática de imagens para performance máxima</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-mint-500" />
                    <span>Tecnologia moderna: React 18 + TypeScript + Supabase</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-mint-50 border border-mint-200 rounded-lg px-4 py-3 mt-4">
                  <Shield size={24} className="text-mint-600 flex-shrink-0" />
                  <span className="text-neutral-800 font-medium">
                    🛡️ Garantia de 7 dias ou <strong className="text-medical-600">reembolso de 100% do valor</strong>
                  </span>
                </div>
              </div>

              {/* Right - Hero Image + Stats */}
              <div className="space-y-6">
                {/* Hero Image - Responsivo: Mobile em telas pequenas, Desktop em telas grandes */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  {/* Imagem Mobile (visível apenas em telas pequenas e médias) */}
                  <img
                    src="/hero-mobile.png"
                    alt="Sistema de agendamento de consulta via WhatsApp em smartphone"
                    className="w-full h-auto lg:hidden object-cover"
                  />

                  {/* Imagem Desktop (visível apenas em telas grandes) */}
                  <img
                    src="/hero-desktop.png"
                    alt="Site odontológico com agendamento online em múltiplos dispositivos - desktop, tablet e smartphone"
                    className="hidden lg:block w-full h-auto object-cover"
                  />
                </div>

                {/* Stats Cards - Grid 2x2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100 hover:shadow-xl transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-medical-600 mb-2">
                      <MessageCircle size={48} className="text-medical-600" />
                    </div>
                    <div className="text-sm md:text-base text-neutral-600">
                      Suporte pelo <br />
                      <strong className="text-neutral-900">Whatsapp humanizado</strong>
                    </div>
                  </div>

                  {/* Card "7 dias" - Destacado com escala maior */}
                  <div className="bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl p-6 shadow-lg border-2 border-medical-700 hover:shadow-2xl transition-all transform hover:scale-105">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">7</div>
                    <div className="text-sm md:text-base text-white">
                      Seu site no ar <br />
                      <strong className="text-mint-100">em 7 dias</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100 hover:shadow-xl transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-medical-600 mb-2">24/7</div>
                    <div className="text-sm md:text-base text-neutral-600">
                      Captando <br />
                      <strong className="text-neutral-900">Pacientes</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-mint-100 hover:shadow-xl transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-mint-600 mb-2">R$ 297</div>
                    <div className="text-sm md:text-base text-neutral-600">
                      Hospedagem + Domínio <br />
                      <strong className="text-neutral-900">1º ano grátis</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diferenciais Técnicos */}
            <div className="mt-16 text-center">
              <p className="text-neutral-700 font-medium max-w-3xl mx-auto">
                <strong className="text-medical-600">Tecnologia profissional</strong> desenvolvida com React 18, TypeScript e Supabase.
                Inclui dashboard administrativo completo, sistema de agendamento e blog integrado com CMS.
              </p>

              {/* Nota sobre manutenção anual */}
              <p className="text-sm text-neutral-600 max-w-2xl mx-auto mt-6 pt-6 border-t border-neutral-200">
                * Hospedagem, domínio .com.br e suporte técnico inclusos no 1º ano.
                A partir do 2º ano: taxa de manutenção de <strong>R$ 297/ano</strong> (à vista) ou 12x no cartão.
              </p>
            </div>
          </div>
        </section>

        {/* RESULTADOS - Transformação */}
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

        {/* TIMELINE DO PROCESSO */}
        <section className="py-12 bg-gradient-to-r from-medical-50 via-white to-mint-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-heading text-neutral-900 mb-2">
                Do Briefing ao Site no Ar: <span className="text-medical-600">7 Dias</span>
              </h3>
              <p className="text-neutral-600">Processo transparente e organizado</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Briefing', time: '30 min', icon: '📝', desc: 'Preencha o formulário' },
                { step: '2', title: 'Produção', time: '5 dias', icon: '🚀', desc: 'Criamos seu site' },
                { step: '3', title: 'Aprovação', time: '1 dia', icon: '✅', desc: 'Você revisa e aprova' },
                { step: '4', title: 'No Ar', time: '1 dia', icon: '🌐', desc: 'Site publicado' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-medical-100 hover:shadow-xl transition-all hover:scale-105">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-medical-500 text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <h4 className="font-heading text-lg text-neutral-900">{item.title}</h4>
                    </div>
                    <p className="text-sm text-neutral-600 mb-1">{item.desc}</p>
                    <p className="text-xs text-medical-600 font-semibold">{item.time}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight size={24} className="text-medical-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-neutral-700">
                <strong className="text-medical-600">Total: 7 dias</strong> do início ao fim
              </p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4 text-center">
                Processo Simples e Transparente
              </h2>
              <p className="text-xl text-neutral-600 text-center">
                Do briefing ao ar em <strong>apenas 7 dias</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {[
                {
                  numero: '1',
                  titulo: 'Briefing Rápido',
                  desc: '10 minutos preenchendo informações do seu consultório. Nome, serviços, fotos, suas preferências de cores.',
                  tempo: '10 min',
                },
                {
                  numero: '2',
                  titulo: 'Produção Profissional',
                  desc: 'Nossa equipe desenvolve seu site personalizado. Você acompanha o progresso e recebe prévia antes de finalizar.',
                  tempo: 'até 7 dias',
                },
                {
                  numero: '3',
                  titulo: 'Aprovação e Lançamento',
                  desc: 'Revisa, solicita ajustes se quiser, e aprova. Site vai ao ar e você começa a receber orçamentos.',
                  tempo: 'imediato',
                },
              ].map((passo, index) => (
                <div key={index} className="relative h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-medical-100 h-full flex flex-col">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {passo.numero}
                      </div>
                    </div>
                    <div className="pt-8 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-xl text-neutral-900">{passo.titulo}</h3>
                        <span className="text-xs bg-mint-100 text-mint-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                          {passo.tempo}
                        </span>
                      </div>
                      <p className="text-neutral-600 flex-grow">{passo.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO - Exemplos de Sites */}
        <div id="exemplos" className="bg-white">
          <PortfolioSection />
        </div>

        {/* PREÇOS - Usando componente centralizado */}
        <div id="precos">
          <PricingPlansSection />
        </div>

        {/* GARANTIA */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-mint-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-mint-200">
              <div className="bg-gradient-to-br from-mint-100 to-mint-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={48} className="text-mint-700" />
              </div>

              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Garantia Incondicional de 7 Dias
              </h2>

              <p className="text-xl text-neutral-700 mb-8">
                Seu investimento está <strong className="text-medical-600">100% protegido</strong>.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-50 rounded-xl p-6">
                  <Clock size={32} className="text-mint-600 mx-auto mb-3" />
                  <p className="text-neutral-700 font-semibold mb-2">Não entregamos no prazo?</p>
                  <p className="text-sm text-neutral-600">Reembolso automático</p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-6">
                  <Star size={32} className="text-mint-600 mx-auto mb-3" />
                  <p className="text-neutral-700 font-semibold mb-2">Não gostou do resultado?</p>
                  <p className="text-sm text-neutral-600">100% do valor de volta</p>
                </div>

                <div className="bg-neutral-50 rounded-xl p-6">
                  <Shield size={32} className="text-mint-600 mx-auto mb-3" />
                  <p className="text-neutral-700 font-semibold mb-2">Qualquer motivo?</p>
                  <p className="text-sm text-neutral-600">Devolvemos sem perguntas</p>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <p className="text-neutral-600 text-sm text-center">
                  Sem burocracia. Sem letras miúdas. Sem complicação.
                  <br />É simples: você só paga se estiver 100% satisfeito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-medical-500 to-medical-600 text-white">
          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
            <h2 className="font-heading text-3xl md:text-5xl mb-4 text-center">
              Comece a Crescer Sua Base de Pacientes Hoje
            </h2>
            <p className="text-xl mb-8 text-white font-medium text-center">
              Site profissional pronto em 7 dias. <strong>Zero risco</strong>, máximo resultado.
            </p>

            <a
              href="#precos"
              onClick={scrollToPrecos}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-medical-600 text-xl font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-2xl hover:scale-105"
            >
              Ver Planos
              <ArrowRight size={24} />
            </a>

            {/* Badges de segurança */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <span className="text-sm font-medium">Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                <span className="text-sm font-medium">Garantia de 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <span className="text-sm font-medium">Entrega garantida</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-center text-white/80">
              Parcele em até 12x no cartão • Reembolso sem perguntas
            </p>

            <div className="mt-8 pt-8 border-t border-white/20 w-full flex justify-center">
              <p className="text-base text-white font-medium text-center">
                Dúvidas? Fale conosco no WhatsApp: (18) 99317-5105
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />
      <WhatsAppFloating />
    </div>
  );
};

export default VendaB;
