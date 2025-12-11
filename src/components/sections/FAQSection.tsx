import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "E se eu não gostar do layout?",
      answer: "Você só paga após aprovar o layout. Se não gostar, não tem custo nenhum. Fazemos até 2 rodadas de revisão incluídas antes da aprovação final. Nossa taxa de aprovação é de 98,7%, mas se você fizer parte dos 1,3% que não aprovam, simplesmente não há cobrança. Zero risco para você."
    },
    {
      question: "Posso ver exemplos de sites que vocês criaram?",
      answer: "Sim! Por questão de privacidade dos nossos clientes, não exibimos todos os sites publicamente (muitos dentistas preferem discrição). Mas temos um portfólio com 15+ exemplos anônimos que mostramos após você preencher o briefing. Dessa forma garantimos que você veja exemplos relevantes para sua especialidade específica. Se preferir, podemos enviar 3 exemplos por WhatsApp agora mesmo: (18) 3175-1052."
    },
    {
      question: "Por que tão barato? Tem pegadinha?",
      answer: "Não tem pegadinha! **Este é nosso preço de lançamento** para construir portfólio. Além disso, **trabalhamos em escala com templates otimizados** - automatizamos 70% do processo. Isso nos permite cobrar menos mantendo alta qualidade. Agências cobram R$ 3-8 mil porque fazem tudo do zero, com reuniões presenciais e equipes grandes. **Nosso modelo digital = economia que repassamos para você.**"
    },
    {
      question: "Quanto tempo leva REALMENTE?",
      answer: "De 3 a 7 dias úteis após você preencher o briefing e enviar os materiais (logo, fotos, textos). Se você já tiver tudo pronto, conseguimos entregar em 3 dias úteis. Se precisar da nossa ajuda para criar logo, selecionar imagens ou escrever textos, leva até 7 dias úteis. E temos garantia: se não entregarmos no prazo, você recebe reembolso total."
    },
    {
      question: "Vou ter que pagar mensalidade?",
      answer: "NÃO! A hospedagem é 100% GRÁTIS PARA SEMPRE! Usamos infraestrutura Cloudflare Pages de nível empresarial que nos permite oferecer hospedagem premium sem custo mensal. Você economiza mais de R$ 400/ano comparado com hospedagens tradicionais. Se quiser domínio personalizado (ex: suaclinica.com.br), você só paga o registro anual do domínio (cerca de R$ 40/ano no Registro.br). A conexão do domínio também é gratuita - diferente de outras empresas que cobram taxas extras."
    },
    {
      question: "Como garanto que vão entregar?",
      answer: "Temos três garantias sólidas: 1) Você só paga após aprovar o layout (então vê o resultado antes de pagar); 2) Garantia de prazo - se não entregarmos em 7 dias úteis, reembolso total; 3) Garantia de satisfação - 7 dias após o site no ar para pedir reembolso se não estiver satisfeito. Além disso, já entregamos 500+ sites sem nenhuma reclamação no Reclame Aqui. Todo o risco é nosso."
    },
    {
      question: "Posso fazer alterações depois?",
      answer: "Sim! Incluímos até 2 rodadas de ajustes durante o desenvolvimento (antes do site ir ao ar). Depois que o site estiver publicado, cobramos R$ 97,00 por solicitação de alterações. Importante: em uma única solicitação você pode pedir quantas mudanças quiser - trocar textos, atualizar fotos, mudar horários, adicionar serviços, etc. É uma taxa fixa que permite você fazer todas as alterações necessárias de uma vez."
    },
    {
      question: "Funciona para qualquer especialidade odontológica?",
      answer: "Sim! Somos 100% especializados em odontologia e já criamos sites para todas as especialidades: ortodontia, implantodontia, odontologia estética, endodontia, periodontia, cirurgia bucomaxilofacial, odontopediatria, prótese dentária, DTM e dor orofacial, harmonização orofacial e clínicas gerais. Cada site é personalizado para destacar os diferenciais da sua especialidade específica."
    },
    {
      question: "Quantas vagas restam da promoção?",
      answer: "Trabalhamos com vagas limitadas por mês para garantir a qualidade da entrega. No momento temos poucas vagas disponíveis neste ciclo. Assim que atingirmos o limite mensal, novos pedidos só entram para o mês seguinte. Se você está vendo este site, ainda há vagas - mas recomendamos garantir a sua o quanto antes. Esta oferta de lançamento não ficará disponível para sempre."
    }
  ];

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

        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="card-premium border-none"
            >
              <AccordionTrigger className="text-left px-6 hover:no-underline">
                <h3 className="text-lg font-semibold text-text-primary pr-4">
                  {faq.question}
                </h3>
              </AccordionTrigger>
              <AccordionContent className="px-6">
                <div className="pt-2 pb-4">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA after FAQ */}
        <div className="mt-12 text-center">
          <div className="bg-primary-ultra-light rounded-2xl p-8">
            <p className="text-xl text-text-primary font-semibold mb-6">
              Ainda tem dúvidas?
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5518317510052?text=Olá!%20Tenho%20dúvidas%20sobre%20o%20site%20odontológico"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                💬 Falar com Especialista no WhatsApp
              </a>
              <Link
                to="/briefing"
                className="btn-hero inline-flex items-center justify-center"
              >
                Ou Preencher Briefing Grátis (2 minutos)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
