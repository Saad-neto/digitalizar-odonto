import React from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import WhatsAppFloating from '../components/redesign/WhatsAppFloating';
import { PortfolioSection } from '../components/sections/PortfolioSection';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  TrendingDown,
  Search,
  Smartphone
} from 'lucide-react';

// VERSÃO A: DOR FORTE - Para afiliados (tráfego frio)
// Foco: Problema → Agitação → Solução

const VendaA: React.FC = () => {
  // URLs dos produtos Hotmart (serão configuradas via env vars)
  const PRODUTO_997 = import.meta.env.VITE_HOTMART_PRODUTO_997 || '#';
  const PRODUTO_1497 = import.meta.env.VITE_HOTMART_PRODUTO_1497 || '#';

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
        title="Seu Consultório Invisível Online? | clinicanaweb.com"
        description="Enquanto você atende bem, concorrentes menos qualificados fecham com pacientes que deveriam ser seus. Site profissional em 7 dias ou dinheiro de volta."
        keywords="site para dentista, dentista invisível google, marketing odontológico, site odontológico"
      />

      <HeaderNew />

      <main className="pt-20">
        {/* HERO - DOR FORTE */}
        <section className="relative bg-gradient-to-b from-red-50 to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Headline com dor */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <AlertTriangle size={18} />
                  Você está perdendo pacientes agora
                </div>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight">
                  Seu Consultório{' '}
                  <span className="text-red-600">Invisível Online?</span>
                </h1>

                <p className="text-xl text-neutral-700 leading-relaxed">
                  Enquanto você atende bem, <strong>concorrentes MENOS qualificados</strong> fecham
                  com pacientes que <strong>deveriam ser seus</strong>.
                </p>

                <div className="space-y-3">
                  {[
                    '78% dos pacientes te procuram no Google PRIMEIRO',
                    'Sem site profissional, você simplesmente NÃO EXISTE',
                    'Instagram sozinho NÃO transmite credibilidade',
                  ].map((problema, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-1" />
                      <span className="text-base text-neutral-700">{problema}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="#precos"
                    onClick={scrollToPrecos}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-medical-500 text-white text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Resolver Isso Agora
                    <ArrowRight size={20} />
                  </a>

                  <a
                    href="#exemplos"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('exemplos')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 border-2 border-neutral-300 text-neutral-700 text-lg font-semibold rounded-lg hover:border-medical-500 hover:text-medical-600 transition-all"
                  >
                    Ver Exemplos
                  </a>
                </div>

                <div className="flex items-center gap-3 text-neutral-600 text-sm pt-2">
                  <Shield size={20} className="text-mint-500" />
                  <span>7 dias para aprovar ou <strong>devolve 100%</strong></span>
                </div>
              </div>

              {/* Right - Stats alarmantes */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-xl">
                      <TrendingDown size={32} className="text-red-600" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-red-600">62%</div>
                      <div className="text-neutral-700">
                        dos consultórios <strong>NÃO TÊM SITE</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-4 rounded-xl">
                      <Search size={32} className="text-red-600" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-red-600">78%</div>
                      <div className="text-neutral-700">
                        buscam no Google <strong>ANTES de agendar</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
                  <p className="text-xl font-extrabold mb-3 text-white">A Verdade Dura:</p>
                  <p className="text-base font-medium leading-relaxed text-white">
                    Você perde <strong className="font-bold">dezenas de pacientes por mês</strong> para dentistas com site
                    profissional. Não por serem melhores. Por serem <strong className="font-bold">visíveis</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGITAÇÃO - Consequências */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Quanto Você Perde <span className="text-red-600">Por Não Ter Site?</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Faça as contas: Se você perde <strong>apenas 5 pacientes/mês</strong> que escolhem
                concorrentes com site...
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center border-2 border-red-100">
                <div className="text-5xl font-bold text-red-600 mb-2">R$ 500</div>
                <div className="text-neutral-600 mb-4">Ticket médio por paciente</div>
                <div className="text-sm text-neutral-500">× 5 pacientes perdidos</div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center border-2 border-red-100">
                <div className="text-5xl font-bold text-red-600 mb-2">R$ 2.500</div>
                <div className="text-neutral-600 mb-4">Perda mensal</div>
                <div className="text-sm text-neutral-500">× 12 meses</div>
              </div>

              <div className="bg-gradient-to-b from-red-500 to-red-600 rounded-2xl p-8 shadow-xl text-center text-white">
                <div className="text-5xl font-bold mb-2">R$ 30.000</div>
                <div className="mb-4">Prejuízo anual</div>
                <div className="text-sm opacity-90">Só por NÃO ter site!</div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
                <strong className="text-red-600">E isso é sendo conservador.</strong> A maioria perde
                muito mais. Você está literalmente{' '}
                <strong>doando pacientes</strong> para a concorrência.
              </p>
            </div>
          </div>
        </section>

        {/* SOLUÇÃO - A saída */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-mint-100 text-mint-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <CheckCircle2 size={18} />
                A Solução
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4">
                Mude Isso em <span className="text-medical-600">7 Dias</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Site profissional que coloca você no Google e <strong>atrai pacientes 24/7</strong>.
                Sem complicação. Sem meses de espera. <strong>Sem risco</strong>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: Smartphone,
                  titulo: 'Design Profissional',
                  desc: '100% personalizado para seu consultório',
                },
                {
                  icon: Search,
                  titulo: 'Aparece no Google',
                  desc: 'SEO otimizado para sua cidade',
                },
                {
                  icon: Clock,
                  titulo: 'Entrega em 7 Dias',
                  desc: 'Não em 3 meses. Em 7 DIAS.',
                },
                {
                  icon: Shield,
                  titulo: 'Zero Risco',
                  desc: 'Não gostou? Devolve 100%',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-white to-neutral-50 rounded-2xl p-6 shadow-lg border border-neutral-200 text-center hover:shadow-xl transition-all"
                >
                  <div className="bg-medical-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon size={32} className="text-medical-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.titulo}</h3>
                  <p className="text-neutral-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Como Funciona
              </h2>
              <p className="text-xl text-neutral-600">Simples. Rápido. Sem burocracia.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  numero: '1',
                  titulo: 'Você Preenche o Briefing',
                  desc: '10 minutos respondendo sobre seu consultório (nome, serviços, fotos, cores)',
                },
                {
                  numero: '2',
                  titulo: 'Nós Produzimos Seu Site',
                  desc: 'Nossa equipe desenvolve site personalizado em até 7 dias. Você acompanha por e-mail.',
                },
                {
                  numero: '3',
                  titulo: 'Você Aprova e Lança',
                  desc: 'Recebe pronto, solicita ajustes se quiser, e aprova. Não gostou? Devolvemos tudo.',
                },
              ].map((passo, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-medical-100">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {passo.numero}
                      </div>
                    </div>
                    <div className="pt-8 text-center">
                      <h3 className="font-semibold text-xl text-neutral-900 mb-3">
                        {passo.titulo}
                      </h3>
                      <p className="text-neutral-600">{passo.desc}</p>
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

        {/* PREÇOS */}
        <section id="precos" className="py-16 md:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Escolha Seu Plano
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Investimento <strong>infinitamente menor</strong> que o prejuízo de continuar
                invisível
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Plano 1 */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-neutral-200 overflow-hidden">
                <div className="p-8">
                  <h3 className="text-2xl font-heading text-neutral-900 mb-2">
                    Site Profissional
                  </h3>
                  <p className="text-neutral-600 mb-6">Tudo que você precisa para estar online</p>

                  <div className="mb-6">
                    <div className="text-5xl font-bold text-medical-600">R$ 997</div>
                    <p className="text-neutral-600">12x de R$ 99,70 no cartão</p>
                  </div>

                  <a
                    href={PRODUTO_997}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-8 bg-mint-500 hover:bg-mint-600 text-white text-center font-semibold rounded-lg transition-all shadow-md hover:shadow-lg mb-6"
                  >
                    Garantir Minha Vaga
                  </a>

                  <ul className="space-y-3">
                    {[
                      'Design 100% personalizado',
                      'Hospedagem grátis PARA SEMPRE',
                      'SEO otimizado (aparecer no Google)',
                      'Integração WhatsApp',
                      'Entrega em 7 dias',
                      'Garantia total',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-mint-500 flex-shrink-0" />
                        <span className="text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plano 2 - Destaque */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-medical-500 overflow-hidden md:scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    MAIS POPULAR
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-heading text-neutral-900 mb-2">Site + Blog SEO</h3>
                  <p className="text-neutral-600 mb-6">
                    Para dominar o Google da sua cidade
                  </p>

                  <div className="mb-6">
                    <div className="text-5xl font-bold text-medical-600">R$ 1.497</div>
                    <p className="text-neutral-600">12x de R$ 149,70 no cartão</p>
                  </div>

                  <a
                    href={PRODUTO_1497}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 px-8 bg-medical-500 hover:bg-medical-600 text-white text-center font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl mb-6"
                  >
                    Quero Dominar o Google
                  </a>

                  <ul className="space-y-3">
                    {[
                      'TUDO DO PLANO ANTERIOR +',
                      'Blog integrado com CMS',
                      '5 artigos SEO otimizados',
                      'Estratégia de conteúdo',
                      'Suporte prioritário',
                      'Bônus: E-book Marketing',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2
                          size={20}
                          className={`flex-shrink-0 ${
                            i === 0 ? 'text-medical-600' : 'text-mint-500'
                          }`}
                        />
                        <span
                          className={`${i === 0 ? 'font-semibold text-medical-700' : 'text-neutral-700'}`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GARANTIA */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-mint-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-mint-100">
              <div className="bg-mint-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield size={48} className="text-mint-600" />
              </div>

              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Garantia Total de 7 Dias
              </h2>

              <p className="text-xl text-neutral-700 mb-6">
                Você <strong className="text-medical-600">NÃO CORRE RISCO NENHUM</strong>.
              </p>

              <div className="space-y-4 text-left max-w-2xl mx-auto mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0 mt-1" />
                  <p className="text-neutral-700">
                    Não entregarmos em 7 dias? <strong>Devolve 100%</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0 mt-1" />
                  <p className="text-neutral-700">
                    Não gostou do resultado? <strong>Devolve 100%</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0 mt-1" />
                  <p className="text-neutral-700">
                    Mudou de ideia? <strong>Devolve 100%</strong>
                  </p>
                </div>
              </div>

              <p className="text-neutral-600">
                Sem perguntas. Sem burocracia. Sem letras miúdas.
                <br />
                <strong>100% do seu dinheiro de volta.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-medical-600 to-medical-700 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-heading text-3xl md:text-5xl mb-6 text-white">
              Pare de Perder Pacientes Para a Concorrência
            </h2>
            <p className="text-xl md:text-2xl mb-8 font-semibold text-white">
              Apenas <strong className="font-bold">20 vagas por mês</strong> para garantir qualidade máxima na entrega.
            </p>

            <a
              href="#precos"
              onClick={scrollToPrecos}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-medical-600 text-xl font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-2xl hover:scale-105"
            >
              Garantir Minha Vaga Agora
              <ArrowRight size={24} />
            </a>

            <p className="mt-6 text-sm opacity-75">
              ✓ Entrega em 7 dias ✓ Garantia total ✓ Sem risco
            </p>
          </div>
        </section>
      </main>

      <FooterNew />
      <WhatsAppFloating />
    </div>
  );
};

export default VendaA;
