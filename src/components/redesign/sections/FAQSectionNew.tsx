import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';

const FAQSectionNew: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como funciona o processo? Quanto tempo demora?",
      answer: "É simples: (1) Você preenche o briefing online (5-10 minutos). (2) Em até 3 dias úteis criamos o layout do seu site. (3) Você revisa e aprova (ou pede ajustes). (4) Após aprovar, você efetua o pagamento. (5) Finalizamos e colocamos no ar em até 7 dias úteis. Total: cerca de 7-10 dias do início ao fim."
    },
    {
      question: "Eu realmente só pago depois de aprovar o layout?",
      answer: "SIM! Essa é nossa garantia número 1. Criamos todo o design do site, você recebe para revisar, pede ajustes se quiser, e só quando aprovar é que você paga. Não gostou do resultado? Não paga. Simples assim. Zero risco para você."
    },
    {
      question: "O que está incluso no pacote de R$ 497?",
      answer: "TUDO que você precisa: design personalizado para sua especialidade, site responsivo (mobile/tablet/desktop), otimização básica para Google (SEO), integração WhatsApp, formulários de contato, 12 meses de hospedagem profissional GRÁTIS, certificado SSL (segurança), suporte técnico por 30 dias, Google Analytics configurado, e otimização de imagens. Sem custos ocultos."
    },
    {
      question: "Vocês fazem sites genéricos ou personalizados?",
      answer: "100% personalizados. Não usamos templates prontos. Cada site é criado do zero baseado no briefing do dentista: sua especialidade, diferenciais, cores preferidas, fotos, depoimentos. O resultado é um site único que reflete sua marca e atrai o perfil de paciente que você quer."
    },
    {
      question: "O site vai aparecer no Google?",
      answer: "Sim! Fazemos a otimização básica de SEO (títulos, descrições, palavras-chave, sitemap, velocidade). Isso ajuda seu site a ser encontrado em buscas como 'dentista [sua cidade]' ou 'implante dentário [bairro]'. Para resultados ainda melhores, recomendamos complementar com Google Meu Negócio otimizado (podemos orientar)."
    },
    {
      question: "Preciso ter conhecimento técnico para gerenciar o site?",
      answer: "Não! Entregamos tudo pronto e funcionando. Se precisar fazer pequenas alterações no futuro (trocar texto, foto), podemos fazer para você ou te ensinar. Mas na prática, a maioria dos clientes não mexe em nada depois da entrega - o site fica trabalhando 24/7 sem necessidade de manutenção constante."
    },
    {
      question: "E se eu quiser fazer alterações depois?",
      answer: "Você tem 30 dias de suporte técnico gratuito para ajustes. Após isso, fazemos alterações sob demanda por valores acessíveis (ajustes simples geralmente entre R$ 50-150 dependendo da complexidade). Mas a maioria dos clientes não precisa de alterações frequentes."
    },
    {
      question: "A hospedagem é realmente grátis por 12 meses?",
      answer: "SIM! Os primeiros 12 meses de hospedagem profissional estão inclusos no pacote. Após 1 ano, a renovação custa aproximadamente R$ 15-25/mês (dependendo do provedor). Você pode renovar conosco ou migrar para onde preferir - o site é seu."
    },
    {
      question: "Posso ver exemplos de sites que vocês fizeram?",
      answer: "Claro! Temos um portfólio com mais de 500 sites entregues. Por questões de privacidade dos clientes, não expomos todos publicamente, mas podemos enviar exemplos similares à sua especialidade via WhatsApp. Só chamar: (18) 3175-1052."
    },
    {
      question: "Qual é a diferença entre vocês e outras agências?",
      answer: "3 diferenciais principais: (1) Você só paga depois de aprovar o layout (zero risco). (2) Entrega rápida (7 dias úteis vs 30-90 dias de agências). (3) Preço justo e transparente (R$ 497 vs R$ 2.000-5.000 + mensalidades). Focamos exclusivamente em dentistas há 5 anos, então entendemos exatamente o que funciona."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-section-lg bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-title-xl text-neutral-900 mb-6">
            Perguntas Frequentes:{' '}
            <span className="text-medical-600">Tire Todas as Suas Dúvidas</span>
          </h2>

          <p className="text-body-lg text-neutral-600 leading-relaxed">
            Já ajudamos mais de 500 dentistas. Estas são as perguntas mais comuns:
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
                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-neutral-100 transition-colors duration-200"
              >
                <h3 className="font-heading text-title-md text-neutral-900 pr-4">
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
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-body-md text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-gradient-to-br from-medical-50 to-mint-50 rounded-2xl p-8 border border-medical-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-medical-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} className="text-white" />
            </div>

            <h3 className="font-heading text-title-lg text-neutral-900 mb-4">
              Ainda Tem Dúvidas?
            </h3>

            <p className="text-body-md text-neutral-600 mb-6">
              Estamos aqui para ajudar! Fale conosco pelo WhatsApp e tire todas as suas dúvidas
              antes de decidir. Sem compromisso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5518317510052?text=Olá!%20Tenho%20dúvidas%20sobre%20o%20site%20odontológico"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-mint-500 text-white text-body-lg font-semibold rounded-lg hover:bg-mint-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <MessageCircle size={20} />
                Falar no WhatsApp
              </a>

              <Link
                to="/briefing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-medical-500 text-white text-body-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Preencher Briefing Agora
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSectionNew;
