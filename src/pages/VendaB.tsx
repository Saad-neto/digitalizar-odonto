import React from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import WhatsAppFloating from '../components/redesign/WhatsAppFloating';
import { PortfolioSection } from '../components/sections/PortfolioSection';
import PricingPlansSection from '../components/redesign/sections/PricingPlansSection';
import LazyImage from '../components/LazyImage';
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
        <section className="relative bg-gradient-to-b from-white to-neutral-50 py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <LazyImage
                    src="/hero-mobile.png"
                    alt="Sistema de agendamento de consulta via WhatsApp em smartphone"
                    className="w-full h-auto lg:hidden object-cover"
                  />

                  {/* Imagem Desktop (visível apenas em telas grandes) */}
                  <LazyImage
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
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                O Que Você Conquista <span className="text-medical-600">Com Um Site Profissional</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                Não é só um site. É uma <strong>máquina de atração de pacientes</strong> trabalhando
                24/7 para você.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Card 1 - Visibilidade */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-xl hover:border-medical-200 transition-all group">
                <div className="bg-medical-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search size={28} className="text-medical-600" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">
                  Visibilidade no Google
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Apareça quando pacientes buscam dentista na sua região. SEO otimizado para rankear rápido.
                </p>
              </div>

              {/* Card 2 - Credibilidade */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-xl hover:border-mint-200 transition-all group">
                <div className="bg-mint-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Star size={28} className="text-mint-600" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">
                  Credibilidade Profissional
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Transmita confiança e seriedade. Pacientes escolhem quem tem presença digital sólida.
                </p>
              </div>

              {/* Card 3 - Captação */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-xl hover:border-medical-200 transition-all group">
                <div className="bg-medical-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={28} className="text-medical-600" />
                </div>
                <h3 className="font-bold text-xl text-neutral-900 mb-3">
                  Captação Automática
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Formulários, WhatsApp integrado, orçamentos chegando mesmo quando você não está trabalhando.
                </p>
              </div>
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

        {/* COMO FUNCIONA - SEÇÃO ÚNICA E LIMPA */}
        <section className="py-16 md:py-20 lg:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Seu Site Profissional em{' '}
                <span className="text-medical-600">3 Passos Simples</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600">
                Do briefing ao ar em até 7 dias úteis
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {[
                {
                  number: 1,
                  title: 'Você Responde',
                  duration: '10 minutos',
                  description: 'Preencha um formulário simples com as informações da sua clínica, serviços, fotos e preferências.',
                  benefits: ['100% grátis', 'Sem compromisso'],
                  color: 'medical'
                },
                {
                  number: 2,
                  title: 'Nós Criamos',
                  duration: '3-5 dias',
                  description: 'Nossa equipe desenvolve seu site personalizado, otimizado para Google e perfeito no celular.',
                  benefits: ['Acompanhe por email', 'Ajustes incluídos'],
                  color: 'mint'
                },
                {
                  number: 3,
                  title: 'Site no Ar',
                  duration: 'até 7 dias',
                  description: 'Você revisa, aprova, escolhe o domínio e publicamos. Pronto para receber pacientes!',
                  benefits: ['Hospedagem grátis 1 ano', 'Suporte por 30 dias'],
                  color: 'medical'
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl p-8 border border-neutral-100 hover:border-medical-200 hover:shadow-lg transition-all duration-300"
                >
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    step.color === 'medical' ? 'bg-medical-500' : 'bg-mint-500'
                  }`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    step.color === 'medical' ? 'bg-medical-100 text-medical-600' : 'bg-mint-100 text-mint-600'
                  }`}>
                    {step.number === 1 && <Target size={28} />}
                    {step.number === 2 && <Zap size={28} />}
                    {step.number === 3 && <TrendingUp size={28} />}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {step.title}
                  </h3>

                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    step.color === 'medical' ? 'bg-medical-100 text-medical-700' : 'bg-mint-100 text-mint-700'
                  }`}>
                    {step.duration}
                  </div>

                  <p className="text-neutral-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {step.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                        <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* Arrow connector (desktop only) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 transform -translate-y-1/2 z-10">
                      <ArrowRight size={24} className="text-neutral-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Guarantee Box */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 lg:p-10 mb-12">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <Shield size={32} className="text-amber-600" />
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-2">
                    Garantia Incondicional de 7 Dias
                  </h3>
                  <p className="text-neutral-700 lg:text-lg">
                    Você paga após o briefing, mas está <strong>100% protegido</strong>.
                    Não ficou satisfeito? Devolvemos todo o seu dinheiro. Sem perguntas, sem burocracia.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href="#precos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-medical-500 text-white text-lg font-semibold rounded-xl hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Ver Planos e Preços
                <ArrowRight size={22} />
              </a>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-500">
                <span>R$ 997 à vista ou 12x de R$ 99,70</span>
                <span className="hidden sm:block">•</span>
                <span className="flex items-center gap-1">
                  <Shield size={14} className="text-amber-500" />
                  Garantia de 7 dias
                </span>
              </div>
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

        {/* CTA FINAL */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-medical-500 to-medical-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
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
