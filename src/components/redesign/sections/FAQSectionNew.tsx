import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';

const FAQSectionNew: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como funciona o processo? Quanto tempo demora?",
      answer: "É simples: (1) Você preenche o briefing online (10-15 minutos). (2) Em até 7 dias criamos o layout completo do seu site. (3) Você revisa e aprova (ou pede ajustes). (4) Após aprovar, você efetua o pagamento. (5) Finalizamos os detalhes e colocamos no ar. Total: cerca de 7 dias do início ao fim."
    },
    {
      question: "Eu realmente só pago depois de aprovar o layout?",
      answer: "SIM! Essa é nossa garantia número 1. Criamos todo o design do site, você recebe para revisar, pede ajustes se quiser, e só quando aprovar é que você paga. Não gostou do resultado? Não paga. Simples assim. Zero risco para você."
    },
    {
      question: "Quais são os planos disponíveis e o que está incluído?",
      answer: "Temos 3 planos: SITE PROFISSIONAL (R$ 997): design personalizado, site responsivo, SEO básico, integração WhatsApp, hospedagem gratuita para sempre, 2 rodadas de ajustes, suporte 30 dias. SITE + AGENDAMENTO (R$ 1.497): tudo do anterior + sistema de agendamento online, calendário integrado, confirmação automática via WhatsApp, SEO avançado, 4 rodadas de ajustes, suporte 90 dias. SITE COMPLETO (R$ 1.997): tudo dos planos anteriores + blog integrado com CMS, 10 posts premium otimizados para SEO, dashboard de métricas avançado, 5 rodadas de ajustes, suporte 120 dias e prioridade no atendimento."
    },
    {
      question: "Vocês fazem sites genéricos ou personalizados?",
      answer: "100% personalizados. Não usamos templates prontos de WordPress ou Wix. Cada site é criado do zero com código profissional (React + TypeScript) baseado no seu briefing: sua especialidade, diferenciais, cores preferidas, fotos, depoimentos. O resultado é um site único que reflete sua marca."
    },
    {
      question: "O site vai aparecer no Google?",
      answer: "Fazemos a otimização básica de SEO (títulos, descrições, palavras-chave, sitemap, velocidade de carregamento). Isso ajuda seu site a ser encontrado em buscas como 'dentista [sua cidade]' ou 'implante dentário [bairro]'. PORÉM: ranqueamento no Google leva tempo (30-90 dias) e depende de concorrência. Não prometemos '1ª posição em 7 dias' porque isso seria mentira. Para acelerar resultados, recomendamos complementar com Google Meu Negócio otimizado."
    },
    {
      question: "Preciso ter conhecimento técnico para gerenciar o site?",
      answer: "Não! Entregamos tudo pronto e funcionando. Se precisar fazer pequenas alterações no futuro (trocar texto, foto), podemos fazer para você ou te ensinar. Mas na prática, a maioria dos clientes não mexe em nada depois da entrega - o site fica trabalhando 24/7 sem necessidade de manutenção constante."
    },
    {
      question: "E se eu quiser fazer alterações depois da entrega?",
      answer: "Você tem 30 dias de suporte técnico gratuito para ajustes e correções. Após isso, fazemos alterações sob demanda por valores acessíveis (ajustes simples geralmente entre R$ 50-150 dependendo da complexidade). A maioria dos clientes não precisa de alterações frequentes."
    },
    {
      question: "A hospedagem é grátis mesmo? Para sempre?",
      answer: "SIM! Utilizamos Cloudflare Pages, que oferece hospedagem gratuita permanente com alta performance e segurança. Seu site fica no ar 24/7 sem nenhum custo mensal ou anual de hospedagem. Inclui certificado SSL e CDN global. O código é 100% seu - você pode migrar para outro provedor quando quiser, mas dificilmente precisará."
    },
    {
      question: "Posso ver exemplos de sites que vocês fizeram?",
      answer: "Sim! Temos exemplos reais de sites que criamos. Veja na seção 'Portfólio Real' acima. Usamos tecnologia profissional (React, Supabase, Cloudflare - stack usado por empresas grandes). Garantimos: (1) Você só paga após aprovar o layout, (2) Garantia de 7 dias ou reembolso total, (3) Design 100% personalizado para sua especialidade."
    },
    {
      question: "Qual é a diferença entre vocês e outras agências?",
      answer: "Vantagens: (1) Você só paga depois de aprovar o layout (zero risco), (2) Preço justo: a partir de R$ 997 vs R$ 2.500-8.000 de agências tradicionais, (3) Atenção personalizada (você não será 'mais um'), (4) Tecnologia moderna (React/TypeScript, não WordPress), (5) Garantia de 7 dias ou reembolso total, (6) Hospedagem gratuita para sempre. Oferecemos qualidade profissional com preço acessível e transparência total."
    },
    {
      question: "Por que o preço é mais acessível que outras agências?",
      answer: "Porque otimizamos nosso processo de criação e usamos tecnologia moderna que nos torna mais eficientes. Não temos custos com escritório físico luxuoso ou grandes equipes. Focamos em qualidade e eficiência, repassando essa economia para você. A partir de R$ 997 é um preço justo pelo valor entregue: design personalizado, hospedagem vitalícia, SEO otimizado e suporte completo."
    },
    {
      question: "Posso conversar com alguém antes de decidir?",
      answer: "Claro! Entendemos que investir no site do seu consultório é uma decisão importante. Se preferir tirar suas dúvidas em uma conversa rápida antes de começar, ficaremos felizes em agendar 15 minutos com você. É sem compromisso e sem pressão de venda. Você também pode começar direto pelo briefing online - a escolha é sua!"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6 leading-tight">
            Dúvidas Sobre Seu{' '}
            <span className="text-medical-600">Site Odontológico?</span>
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Respondemos com total transparência as principais dúvidas sobre nosso serviço.<br/>
            Não encontrou sua pergunta? Fale conosco no WhatsApp.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden hover:border-medical-300 transition-colors duration-300"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-neutral-100 transition-colors duration-200"
              >
                <h3 className="font-heading text-lg md:text-xl text-neutral-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={24}
                  className={`flex-shrink-0 text-medical-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[600px]' : 'max-h-0'
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2">
                  <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-gradient-to-br from-medical-50 to-mint-50 rounded-2xl p-6 md:p-8 border border-medical-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-medical-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} className="text-white" />
            </div>

            <h3 className="font-heading text-xl md:text-2xl text-neutral-900 mb-4">
              Ainda Tem Dúvidas?
            </h3>

            <p className="text-base md:text-lg text-neutral-600 mb-6">
              Estamos aqui para ajudar! Escolha a melhor forma de continuar:
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
              <Link
                to="/agendar"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-neutral-700 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg min-h-[56px]"
              >
                <MessageCircle size={20} />
                Agendar Conversa
              </Link>

              <Link
                to="/briefing"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-medical-500 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-md hover:shadow-lg min-h-[56px]"
              >
                Começar Agora
                <ArrowRight size={20} />
              </Link>
            </div>

            <p className="text-sm text-neutral-500 mt-4">
              Prefere conversar antes? Sem problema. Quer começar direto? Também pode!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSectionNew;
