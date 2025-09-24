import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como vocês conseguem entregar em 24h?",
      answer: "Desenvolvemos templates otimizados específicos para dentistas ao longo de 5 anos. Nosso sistema automatiza 70% do processo, permitindo focar na personalização e qualidade. Nossa equipe trabalha em turnos para garantir entregas rápidas sem comprometer a excelência."
    },
    {
      question: "E se eu não tiver logo, fotos ou textos prontos?", 
      answer: "Sem problemas! Criamos logo simples gratuitamente, temos banco de imagens premium odontológicas e redatores especializados em odontologia. Você só precisa responder nosso briefing de 15 minutos com as informações básicas do seu consultório."
    },
    {
      question: "O site vai aparecer no Google?",
      answer: "Sim! Fazemos otimização básica para SEO local incluída no pacote. Seu site será encontrado quando pacientes procurarem 'dentista + sua cidade'."
    },
    {
      question: "E depois do primeiro ano de hospedagem?",
      answer: "Apenas R$ 29,90/mês ou R$ 299/ano. Bem abaixo do mercado e com suporte técnico incluído. Sem taxas ocultas, surpresas ou aumentos abusivos. Você sempre pode migrar seu site se desejar, fornecemos todos os arquivos."
    },
    {
      question: "Funciona para qualquer especialidade odontológica?",
      answer: "Sim! Já criamos sites para ortodontistas, implantodontistas, dentistas estéticos, endodontistas, cirurgiões, periodontistas, odontopediatras e clínicas gerais. Cada site é personalizado para destacar sua especialidade específica."
    },
    {
      question: "Posso fazer alterações depois?",
      answer: "Claro! Ensinamos você a fazer alterações básicas (textos, imagens, horários) através de um treinamento incluído. Para mudanças complexas de design ou estrutura, cobramos apenas R$ 97 por alteração (muito abaixo do mercado)."
    },
    {
      question: "Como é o processo de pagamento?",
      answer: "Aceitamos Pix, cartão de crédito ou débito. Pode parcelar em até 12x sem juros no cartão. O pagamento é 100% seguro através do Mercado Pago e PagSeguro. Emitimos nota fiscal para todos os pedidos."
    },
    {
      question: "Vocês atendem qualquer cidade do Brasil?",
      answer: "Sim! Atendemos dentistas de todo o Brasil. Nosso processo é 100% online, então não importa se você está em São Paulo, Interior ou qualquer estado. Já entregamos sites para mais de 200 cidades diferentes."
    },
    {
      question: "E se eu não gostar do resultado?",
      answer: "Você tem 30 dias para avaliar e solicitar o reembolso completo se não estiver satisfeito. Além disso, incluímos até 3 revisões no pacote. Nossa taxa de aprovação é de 98,7%, mas sua satisfação é garantida."
    },
    {
      question: "Qual a diferença entre vocês e outras empresas?",
      answer: "Somos 100% especializados em dentistas há 5 anos, conhecemos profundamente o setor. Entregamos em 24h (outros levam 30-60 dias), oferecemos múltiplas garantias e assumimos todo o risco. Nossos preços são justos comparado às agências tradicionais."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Perguntas Frequentes
            <span className="block text-primary">Eliminando Suas Últimas Dúvidas</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Compilamos as principais dúvidas dos mais de 500 dentistas que já atendemos 
            para que você tenha total clareza antes de decidir.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card-premium">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex items-center justify-between p-2 focus:outline-none"
              >
                <h3 className="text-lg font-semibold text-text-primary pr-4">
                  ❓ {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openFAQ === index ? (
                    <ChevronUp size={24} className="text-primary" />
                  ) : (
                    <ChevronDown size={24} className="text-text-light" />
                  )}
                </div>
              </button>
              
              {openFAQ === index && (
                <div className="mt-4 p-4 bg-primary-ultra-light rounded-lg border-l-4 border-primary">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;