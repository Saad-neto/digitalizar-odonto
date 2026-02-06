import React, { useState } from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import WhatsAppFloating from '../components/redesign/WhatsAppFloating';
import { PortfolioSection } from '../components/sections/PortfolioSection';
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
  MessageCircle,
  AlertCircle,
  TrendingDown,
  Users,
  LayoutDashboard,
  CalendarCheck,
  UserRound,
  DollarSign,
  FileText,
  Instagram,
  Globe,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';

const NovaVenda: React.FC = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── 3. O Que Está Incluído ────────────────────────────────────────
  const modules = [
    {
      icon: Globe,
      title: 'Site Customizado',
      description: 'Design 100% personalizado com cores, layout e identidade visual da sua clínica. Responsivo em todos os dispositivos.',
      color: 'medical',
    },
    {
      icon: LayoutDashboard,
      title: 'Dashboard / Painel Central',
      description: 'Controle total da sua presença digital em um único lugar. Visualize métricas, leads e status dos projetos.',
      color: 'mint',
    },
    {
      icon: CalendarCheck,
      title: 'Sistema de Agendamento',
      description: 'Agendamento online com calendário integrado e confirmação automática via WhatsApp. Sem ligações, sem espera.',
      color: 'medical',
    },
    {
      icon: UserRound,
      title: 'Cadastro de Pacientes',
      description: 'Base de dados organizada com histórico, informações de contato e comunicação direta com cada paciente.',
      color: 'mint',
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Acompanhe receitas, pendências e fluxo de caixa da sua clínica em tempo real com relatórios detalhados.',
      color: 'medical',
    },
    {
      icon: FileText,
      title: 'Blog / CMS',
      description: 'Publique artigos sobre saúde bucal com um editor intuitivo. Atrai tráfego orgânico e posiciona você como referência.',
      color: 'mint',
    },
    {
      icon: Instagram,
      title: 'Página Bio do Instagram',
      description: 'Página de link na bio personalizada que converte seguidores em pacientes. Atualiza sem código.',
      color: 'medical',
    },
  ];

  // ─── 4. Valor vs Mercado ────────────────────────────────────────────
  const marketItems = [
    { name: 'Site customizado', market: 'R$ 3.000+', detail: 'agências de marketing' },
    { name: 'Sistema de agendamento', market: 'R$ 300/mês', detail: 'R$ 3.600/ano' },
    { name: 'Gestão de pacientes', market: 'R$ 200/mês', detail: 'R$ 2.400/ano' },
    { name: 'Controle financeiro', market: 'R$ 150/mês', detail: 'R$ 1.800/ano' },
    { name: 'Blog / CMS', market: 'R$ 100/mês', detail: 'R$ 1.200/ano' },
  ];

  // ─── 9. FAQ ─────────────────────────────────────────────────────────
  const faqs = [
    {
      question: 'Qual é o modelo de pagamento no primeiro ano?',
      answer: 'No primeiro ano você pode pagar 12x R$ 297 no cartão ou R$ 2.970 à vista. O pagamento é processado via Asaas, com todas as opções de parcelamento disponíveis.',
    },
    {
      question: 'O que acontece depois do primeiro ano — qual é a taxa de renovação?',
      answer: 'A partir do 2º ano, a taxa de manutenção é de R$ 99/mês (ou um valor equivalente anual à vista). Isso cobre hospedagem, suporte técnico, atualização do sistema e todas as manutenções necessárias.',
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim. Não há contrato de fidelidade. Se não estiver satisfeito, basta solicitar o cancelamento e a renovação não será cobrada. Seus dados e site permanecem ativos até o fim do período pago.',
    },
    {
      question: 'Quanto tempo leva para ter o sistema funcionando?',
      answer: 'Após o briefing e pagamento, seu site e sistema estarão operacionais em até 7 dias úteis. Você recebe acesso ao dashboard imediatamente após a entrega.',
    },
    {
      question: 'O sistema de agendamento funciona pelo WhatsApp?',
      answer: 'Sim! Quando um paciente agenda online, ele recebe confirmação automática via WhatsApp. Você também recebe notificação do novo agendamento diretamente no dashboard.',
    },
    {
      question: 'Preciso de conhecimento técnico para usar o sistema?',
      answer: 'Não. O dashboard foi projetado para ser intuitivo. Você publica posts no blog, acompanha agendamentos e vê relatórios financeiros sem precisar escrever uma linha de código.',
    },
    {
      question: 'Quem faz a manutenção e suporte do sistema?',
      answer: 'Nossa equipe especializada cuidada de tudo. Suporte via WhatsApp humanizado, atualizações automáticas do sistema e ajustes de design sem cobranças adicionais durante o período de contrato.',
    },
    {
      question: 'A página bio do Instagram é atualizada automaticamente?',
      answer: 'A página bio é editável diretamente pelo dashboard. Você atualiza ofertas, links e informações da sua clínica sem precisar pedir para ninguém.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Site + Sistema Completo para Dentistas | 12x R$ 297"
        description="Sistema completo para dentistas: site customizado, agendamento online, cadastro de pacientes, controle financeiro, blog e bio Instagram. 12x R$ 297 ou R$ 2.970 à vista."
        keywords="sistema completo dentista, site dentista agendamento, dashboard odontologia, controle financeiro dentista, bio instagram dentista"
      />

      <HeaderNew />

      <main className="pt-20">

        {/* ═══════════════════════════════════════════════════════════════
            1. HERO
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative bg-gradient-to-b from-white to-neutral-50 py-16 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-mint-100 text-mint-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <Zap size={18} />
                  Sistema completo: site + dashboard + agendamento + financeiro
                </div>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight">
                  Transforme Sua Clínica Com Um{' '}
                  <span className="text-medical-600">Sistema Completo</span>
                </h1>

                <p className="text-xl text-neutral-700 leading-relaxed">
                  Pare de usar 5 ferramentas diferentes. Tudo que você precisa — site, agendamento,
                  pacientes, financeiro e mais — em <strong>um único sistema</strong>.
                </p>

                <div className="space-y-3">
                  {[
                    'Site customizado que atrai e converte pacientes',
                    'Agendamento automático com confirmação via WhatsApp',
                    'Dashboard com cadastro de pacientes e controle financeiro',
                    'Blog integrado + Página bio do Instagram',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0" />
                      <span className="text-base md:text-lg text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Preço no Hero */}
                <div className="bg-medical-50 border-2 border-medical-200 rounded-xl px-6 py-5 mt-2">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl font-bold text-medical-600">12x R$ 297</span>
                    <span className="text-neutral-500 text-lg">ou</span>
                    <span className="text-2xl font-bold text-neutral-900">R$ 2.970 à vista</span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    Primeiro ano completo · Hospedagem + domínio incluídos
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a
                    href="#o-que-esta-incluido"
                    onClick={(e) => { e.preventDefault(); scrollTo('o-que-esta-incluido'); }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-medical-500 text-white text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Ver o que está incluído
                    <ArrowRight size={20} />
                  </a>
                  <a
                    href="#exemplos"
                    onClick={(e) => { e.preventDefault(); scrollTo('exemplos'); }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 border-2 border-neutral-300 text-neutral-700 text-lg font-semibold rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all"
                  >
                    Ver Exemplos
                  </a>
                </div>

                <div className="flex items-center gap-3 bg-mint-50 border border-mint-200 rounded-lg px-4 py-3 mt-2">
                  <Shield size={24} className="text-mint-600 flex-shrink-0" />
                  <span className="text-neutral-800 font-medium">
                    Garantia de 7 dias ou <strong className="text-medical-600">reembolso de 100%</strong>
                  </span>
                </div>
              </div>

              {/* Right – Hero image + stats */}
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <LazyImage
                    src="/hero-mobile.png"
                    alt="Sistema de agendamento de consulta via WhatsApp em smartphone"
                    className="w-full h-auto lg:hidden object-cover"
                  />
                  <LazyImage
                    src="/hero-desktop.png"
                    alt="Sistema odontológico completo em múltiplos dispositivos"
                    className="hidden lg:block w-full h-auto object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100 hover:shadow-xl transition-shadow">
                    <MessageCircle size={36} className="text-medical-600 mb-2" />
                    <div className="text-sm md:text-base text-neutral-600">
                      Suporte pelo<br />
                      <strong className="text-neutral-900">WhatsApp humanizado</strong>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl p-6 shadow-lg border-2 border-medical-700 hover:shadow-2xl transition-all transform hover:scale-105">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">7</div>
                    <div className="text-sm md:text-base text-white">
                      Sistema no ar<br />
                      <strong className="text-mint-100">em 7 dias</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100 hover:shadow-xl transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-medical-600 mb-2">24/7</div>
                    <div className="text-sm md:text-base text-neutral-600">
                      Captando<br />
                      <strong className="text-neutral-900">Pacientes</strong>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-mint-100 hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold text-mint-600 mb-2">R$ 99/mês</div>
                    <div className="text-sm md:text-base text-neutral-600">
                      Renovação<br />
                      <strong className="text-neutral-900">a partir do 2º ano</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            2. PAIN POINTS (Problemas)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 lg:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-6">
                <AlertCircle size={16} />
                A realidade da maioria dos dentistas
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Problemas Que Custam Dinheiro<br />
                <span className="text-medical-600">Todo Dia</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600">
                Sem um sistema integrado, você está perdendo pacientes e gastando tempo em tarefas que poderiam ser automáticas.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: TrendingDown,
                  title: 'Pacientes Escolhem os Concorrentes',
                  desc: 'Pacientes pesquisam online antes de agendar. Sem site profissional e agendamento fácil, você é invisível enquanto concorrentes capturam esses leads.',
                  impact: 'Média de R$ 15.000/mês em consultas perdidas',
                },
                {
                  icon: Clock,
                  title: 'Tempo Perdido com Tarefas Manuais',
                  desc: 'Confirmação de consultas pelo celular, controle de pacientes em planilhas, financeiro disperso em apps diferentes. Horas do dia desperdiçadas.',
                  impact: '3+ horas/dia em tarefas que poderiam ser automáticas',
                },
                {
                  icon: Users,
                  title: 'Dependência Total de Indicações',
                  desc: 'Crescer só com indicações limita seu potencial. Um sistema completo gera captação contínua e mantém pacientes existentes engajados.',
                  impact: '70% dos novos pacientes vêm de buscas online',
                },
              ].map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-xl hover:border-red-200 transition-all">
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                    <p.icon size={28} className="text-red-600" />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 mb-3">{p.title}</h3>
                  <p className="text-neutral-600 leading-relaxed mb-4">{p.desc}</p>
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-sm font-semibold text-red-700">{p.impact}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Storytelling box */}
            <div className="mt-12 bg-gradient-to-br from-medical-50 to-mint-50 rounded-2xl p-8 lg:p-12 border border-medical-100 max-w-4xl mx-auto">
              <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-4 text-center">
                Imagina Uma Realidade Diferente...
              </h3>
              <div className="space-y-4 text-lg text-neutral-700 leading-relaxed text-center">
                <p>
                  Pacientes agendando <strong>sozinhos</strong>, confirmação automática pelo WhatsApp,
                  financeiro atualizado em tempo real e um site bonito captando leads 24/7.
                </p>
                <p className="text-medical-700 font-semibold text-xl">
                  Isso não é futuro. É o que o sistema completo entrega desde o primeiro dia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            3. O QUE ESTÁ INCLUÍDO (7 módulos)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="o-que-esta-incluido" className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-mint-100 text-mint-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <CheckCircle2 size={18} />
                Tudo incluído no preço
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Os <span className="text-medical-600">7 Módulos</span> Do Sistema
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                Não é só um site. É um ecossistema completo pensado para crescer sua clínica.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {modules.map((mod, i) => (
                <div
                  key={i}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-xl transition-all group ${
                    mod.color === 'medical' ? 'hover:border-medical-200' : 'hover:border-mint-200'
                  }`}
                >
                  {/* Number badge */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                    mod.color === 'medical' ? 'bg-medical-500' : 'bg-mint-500'
                  }`}>
                    {i + 1}
                  </div>

                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${
                    mod.color === 'medical' ? 'bg-medical-100' : 'bg-mint-100'
                  }`}>
                    <mod.icon size={28} className={mod.color === 'medical' ? 'text-medical-600' : 'text-mint-600'} />
                  </div>

                  <h3 className="font-bold text-lg text-neutral-900 mb-2">{mod.title}</h3>
                  <p className="text-neutral-600 leading-relaxed text-sm">{mod.description}</p>
                </div>
              ))}
            </div>

            {/* CTA após módulos */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#preço"
                onClick={(e) => { e.preventDefault(); scrollTo('preço'); }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-medical-500 text-white text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Ver o Preço
                <ArrowRight size={20} />
              </a>
              <a
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-medical-300 text-medical-600 text-lg font-semibold rounded-lg hover:border-medical-500 hover:bg-medical-50 transition-all duration-300"
              >
                Veja Como Funciona na Prática
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            4. VALOR VS MERCADO
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 lg:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Quanto Custa Tudo Isso <span className="text-medical-600">No Mercado?</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                Compare o valor que você recebe com o que cobrariam separadamente.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Tabela de comparação */}
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
                {/* Header da tabela */}
                <div className="grid grid-cols-3 bg-neutral-900 text-white px-6 py-4">
                  <div className="font-semibold text-sm">Serviço</div>
                  <div className="font-semibold text-sm text-center">Mercado</div>
                  <div className="font-semibold text-sm text-center">Detalhes</div>
                </div>

                {/* Rows */}
                {marketItems.map((item, i) => (
                  <div key={i} className={`grid grid-cols-3 px-6 py-4 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                    <div className="font-medium text-neutral-800">{item.name}</div>
                    <div className="text-center">
                      <span className="text-red-600 font-bold">{item.market}</span>
                    </div>
                    <div className="text-center text-neutral-500 text-sm">{item.detail}</div>
                  </div>
                ))}

                {/* Divider */}
                <div className="border-t-2 border-dashed border-neutral-200 mx-6"></div>

                {/* Total do mercado */}
                <div className="grid grid-cols-3 px-6 py-5 bg-red-50 items-center">
                  <div className="font-bold text-neutral-900 text-lg">Total separado</div>
                  <div className="text-center">
                    <span className="text-red-700 font-bold text-xl">R$ 12.000+</span>
                  </div>
                  <div className="text-center text-red-600 text-sm font-semibold">por ano</div>
                </div>

                {/* Divider forte */}
                <div className="border-t-4 border-medical-500"></div>

                {/* Precio com você */}
                <div className="grid grid-cols-3 px-6 py-6 bg-gradient-to-r from-medical-50 to-mint-50 items-center">
                  <div className="font-bold text-neutral-900 text-lg">
                    <span className="text-medical-600">Com você</span>
                  </div>
                  <div className="text-center">
                    <span className="text-medical-700 font-bold text-2xl">R$ 2.970</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-neutral-600">ou 12x R$ 297</span>
                  </div>
                </div>
              </div>

              {/* Badge de economia */}
              <div className="mt-8 flex justify-center">
                <div className="bg-neutral-900 text-white px-8 py-4 rounded-full shadow-lg">
                  <p className="text-xl font-bold text-center">
                    Economiza até <span className="text-mint-400">75%</span> comparado ao mercado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            5. COMO FUNCIONA (3 passos)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="como-funciona" className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Como Funciona Em <span className="text-medical-600">3 Passos</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600">
                Do primeiro contato até o sistema funcionando na sua clínica
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  number: 1,
                  title: 'Você Responde o Briefing',
                  duration: '~10 minutos',
                  description: 'Preencha um formulário detalhado com informações da sua clínica, serviços, fotos e preferências de design.',
                  benefits: ['100% online', 'Sem compromisso'],
                  color: 'medical',
                  icon: Target,
                },
                {
                  number: 2,
                  title: 'Nós Montamos Tudo',
                  duration: '3–5 dias úteis',
                  description: 'Nossa equipe configura o site, dashboard, agendamento e todos os módulos do sistema. Você revisa e aprova.',
                  benefits: ['Acompanhe por email', 'Ajustes incluídos'],
                  color: 'mint',
                  icon: Zap,
                },
                {
                  number: 3,
                  title: 'Sistema no Ar',
                  duration: 'até 7 dias',
                  description: 'Tudo publicado e funcionando. Você começa a receber pacientes pelo site e agendamentos pelo sistema.',
                  benefits: ['Hospedagem grátis 1º ano', 'Suporte 30 dias'],
                  color: 'medical',
                  icon: TrendingUp,
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative bg-white rounded-2xl p-8 border border-neutral-100 hover:border-medical-200 hover:shadow-lg transition-all duration-300 shadow-lg"
                >
                  <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    step.color === 'medical' ? 'bg-medical-500' : 'bg-mint-500'
                  }`}>
                    {step.number}
                  </div>

                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    step.color === 'medical' ? 'bg-medical-100 text-medical-600' : 'bg-mint-100 text-mint-600'
                  }`}>
                    <step.icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{step.title}</h3>

                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    step.color === 'medical' ? 'bg-medical-100 text-medical-700' : 'bg-mint-100 text-mint-700'
                  }`}>
                    {step.duration}
                  </div>

                  <p className="text-neutral-600 mb-5 leading-relaxed">{step.description}</p>

                  <ul className="space-y-2">
                    {step.benefits.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-neutral-700">
                        <CheckCircle2 size={16} className="text-mint-500 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 transform -translate-y-1/2 z-10">
                      <ArrowRight size={24} className="text-neutral-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            6. PORTFOLIO
            ═══════════════════════════════════════════════════════════════ */}
        <div id="exemplos" className="bg-neutral-50">
          <PortfolioSection />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            7. PREÇO (bloco único)
            ═══════════════════════════════════════════════════════════════ */}
        <section id="preço" className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Um Único Plano.<br />
                <span className="text-medical-600">Tudo Incluído.</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                Sem planos confusos, sem funcionalidades escondidas. Tudo que sua clínica precisa em um preço justo.
              </p>
            </div>

            <div className="max-w-2xl mx-auto pt-4">
              {/* Badge no topo — fora do card para não ser cortada */}
              <div className="flex justify-center -mb-4 relative z-10">
                <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Sistema Completo
                </div>
              </div>

              <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-medical-200 overflow-hidden">
                <div className="p-6 md:p-8 pt-8">
                  {/* Preço principal */}
                  <div className="text-center mb-6">
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      Primeiro Ano
                    </div>

                    <div className="flex items-end justify-center gap-1 mb-1">
                      <span className="text-sm text-neutral-500 mb-1">R$</span>
                      <span className="text-4xl md:text-5xl font-bold text-medical-600 leading-none">297</span>
                      <span className="text-base text-neutral-500 mb-1">/mês</span>
                    </div>
                    <p className="text-neutral-500 text-sm">12 parcelas no cartão</p>

                    {/* Opção à vista */}
                    <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                      <div className="bg-mint-50 border border-mint-200 rounded-lg px-4 py-2 flex items-center gap-2">
                        <span className="text-base font-bold text-neutral-900">R$ 2.970 à vista</span>
                        <span className="bg-mint-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          Economiza R$ 594
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="border-t border-neutral-200 my-5"></div>

                  {/* O que está incluído */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-4">
                      O que está incluído:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        'Site customizado com design personalizado',
                        'Dashboard / Painel central',
                        'Sistema de agendamento online',
                        'Cadastro e gestão de pacientes',
                        'Controle financeiro da clínica',
                        'Blog com CMS intuitivo',
                        'Página bio do Instagram',
                        'Hospedagem + domínio .com.br (1º ano)',
                        'SEO otimizado para Google',
                        'Integração WhatsApp automática',
                        'Confirmação automática de agendamentos',
                        'Google Analytics + Search Console',
                        '3 rodadas de ajustes',
                        'Suporte técnico por 90 dias',
                      ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check size={16} className="text-mint-500 flex-shrink-0" />
                          <span className="text-sm text-neutral-700">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Renovação nota */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 mb-6">
                    <p className="text-xs text-neutral-600 text-center">
                      <strong className="text-neutral-800">A partir do 2º ano:</strong> renovação por apenas
                      <strong className="text-medical-600"> R$ 99/mês</strong> de manutenção (hospedagem, suporte e atualizações incluídos).
                    </p>
                  </div>

                  {/* CTA principal */}
                  <a
                    href="/briefing"
                    className="block w-full text-center py-4 px-6 bg-medical-500 text-white text-lg font-bold rounded-xl hover:bg-medical-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    Começar Agora — 12x R$ 297
                  </a>

                  <p className="text-center text-xs text-neutral-500 mt-3">
                    Pagamento via Asaas · Cartão de crédito ou débito
                  </p>
                </div>

                {/* Footer do card */}
                <div className="bg-gradient-to-r from-medical-50 to-mint-50 px-8 py-5 border-t border-medical-100">
                  <div className="flex items-center justify-center gap-2 text-medical-700 font-medium">
                    <TrendingUp size={18} />
                    <span className="text-sm">Melhor investimento para crescer sua clínica de forma sustentável</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            8. GARANTIAS
            ═══════════════════════════════════════════════════════════════ */}
        <section id="garantias" className="py-16 md:py-20 lg:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Suas <span className="text-medical-600">Garantias</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                Investir sem risco. Pensamos em cada detalhe para que você se sinta seguro.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: 'Garantia de 7 Dias',
                  desc: 'Se não estiver satisfeito com o resultado, devolvemos 100% do valor pago. Sem perguntas, sem burocracia.',
                  highlight: true,
                },
                {
                  icon: Clock,
                  title: 'Entrega Garantida',
                  desc: 'Seu sistema estará no ar em até 7 dias úteis após o briefing. Se não cumprir, você não paga nada.',
                  highlight: false,
                },
                {
                  icon: Star,
                  title: 'Suporte Humanizado',
                  desc: 'Suporte real via WhatsApp com pessoas que conhecem seu negócio. Sem chatbots, sem roteiros engessados.',
                  highlight: false,
                },
              ].map((g, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl p-8 shadow-lg transition-all ${
                    g.highlight
                      ? 'border-2 border-amber-300 ring-4 ring-amber-50'
                      : 'border border-neutral-100 hover:shadow-xl'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    g.highlight ? 'bg-amber-100' : 'bg-medical-100'
                  }`}>
                    <g.icon size={28} className={g.highlight ? 'text-amber-600' : 'text-medical-600'} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 mb-3">{g.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            9. FAQ
            ═══════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Perguntas <span className="text-medical-600">Frequentes</span>
              </h2>
              <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
                Esclareça suas dúvidas sobre o sistema e o modelo de pagamento.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl border transition-all duration-300 ${
                    faqOpen === i ? 'border-medical-300 shadow-md' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-neutral-900 text-base md:text-lg">
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      faqOpen === i ? 'bg-medical-100' : 'bg-neutral-100'
                    }`}>
                      {faqOpen === i
                        ? <ChevronUp size={18} className="text-medical-600" />
                        : <ChevronDown size={18} className="text-neutral-500" />
                      }
                    </div>
                  </button>

                  {faqOpen === i && (
                    <div className="px-6 pb-5">
                      <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-neutral-600 mb-4">Ainda tem dúvidas?</p>
              <a
                href="https://wa.me/5511963256658?text=Olá!%20Tenho%20dúvidas%20sobre%20o%20sistema%20completo%20para%20dentistas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={20} />
                Fale conosco no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            10. CTA FINAL
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-medical-500 to-medical-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <h2 className="font-heading text-3xl md:text-5xl mb-4 text-center">
              Sua Clínica Merece Um Sistema Que Funciona
            </h2>
            <p className="text-xl mb-4 text-white font-medium text-center max-w-2xl">
              Site + agendamento + pacientes + financeiro + blog + bio Instagram.
              Tudo por <strong>12x R$ 297</strong>.
            </p>
            <p className="text-medical-100 text-lg mb-8 text-center">
              Sistema no ar em até 7 dias. <strong className="text-white">Zero risco</strong>, máximo resultado.
            </p>

            <a
              href="/briefing"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-medical-600 text-xl font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-2xl hover:scale-105"
            >
              Começar Agora
              <ArrowRight size={24} />
            </a>

            {/* Badges */}
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
                <span className="text-sm font-medium">Sistema em até 7 dias</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-center text-white/80">
              12x R$ 297 no cartão · ou R$ 2.970 à vista · Reembolso sem perguntas
            </p>

            <div className="mt-8 pt-8 border-t border-white/20 w-full flex justify-center">
              <p className="text-base text-white font-medium text-center">
                Dúvidas? Fale conosco no WhatsApp: (11) 96325-6658
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

export default NovaVenda;
