import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';

const Termos: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNew />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-medical-600 hover:text-medical-700 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar para Home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-medical-50 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-medical-600" />
              </div>
              <h1 className="font-heading text-4xl md:text-5xl text-neutral-900">
                Termos de Uso
              </h1>
            </div>
            <p className="text-neutral-600 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-neutral-700 leading-relaxed">
                Ao utilizar os serviços da <strong>Sites Odonto 24H</strong>, você concorda com estes
                Termos de Uso. Se não concordar, por favor, não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                A Sites Odonto 24H oferece o serviço de criação de sites profissionais para consultórios
                e clínicas odontológicas, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Design personalizado baseado em briefing fornecido pelo cliente</li>
                <li>Desenvolvimento em React + TypeScript (tecnologia profissional)</li>
                <li>Site responsivo para celular, tablet e desktop</li>
                <li>Otimização básica para motores de busca (SEO on-page)</li>
                <li>Integração com WhatsApp e formulários de contato</li>
                <li>12 meses de hospedagem profissional incluídos</li>
                <li>Certificado SSL (HTTPS) incluído</li>
                <li>30 dias de suporte técnico pós-entrega</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">3. Preço e Condições de Pagamento</h2>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">3.1. Preço de Lançamento</h3>
              <p className="text-neutral-700 leading-relaxed">
                O valor promocional de <strong>R$ 497,00</strong> (quatrocentos e noventa e sete reais) é válido
                exclusivamente para os primeiros 10 clientes (Programa Beta/Fundador). Após esse período, o valor
                normal será de <strong>R$ 997,00</strong>.
              </p>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">3.2. Formas de Pagamento</h3>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Pagamento único via cartão de crédito (até 12x de R$ 49,70)</li>
                <li>Pagamento único via PIX ou boleto (à vista)</li>
                <li>Processamento seguro através da Stripe</li>
              </ul>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">3.3. Momento do Pagamento</h3>
              <p className="text-neutral-700 leading-relaxed">
                O pagamento é realizado <strong>SOMENTE APÓS</strong> o cliente aprovar o layout do site.
                O processo é:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-neutral-700 mt-3">
                <li>Cliente preenche o briefing (sem pagamento)</li>
                <li>Criamos o layout em até 3 dias úteis</li>
                <li>Cliente recebe o layout para aprovação</li>
                <li>Cliente pode solicitar ajustes (incluído no serviço)</li>
                <li>Após aprovação final, cliente efetua o pagamento</li>
                <li>Finalizamos e colocamos o site no ar em até 7 dias úteis</li>
              </ol>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">3.4. Custos Adicionais</h3>
              <p className="text-neutral-700 leading-relaxed mb-3">
                Os 12 primeiros meses de hospedagem estão inclusos no preço. Após esse período:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Renovação de hospedagem: aproximadamente R$ 15-25/mês</li>
                <li>Registro de domínio personalizado (.com.br): R$ 40/ano (opcional)</li>
                <li>Alterações após 30 dias de entrega: R$ 50-150 (conforme complexidade)</li>
                <li>Criação de logo (se necessário): R$ 200 adicional</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">4. Prazo de Entrega</h2>
              <p className="text-neutral-700 leading-relaxed">
                Nos comprometemos a entregar o site completo em <strong>até 7 dias úteis</strong> após
                aprovação do layout pelo cliente. Este prazo não inclui o tempo de aprovação do layout
                pelo cliente.
              </p>
              <p className="text-neutral-700 leading-relaxed mt-3">
                Faremos todos os esforços para cumprir este prazo. Em caso de atraso justificado, o cliente
                será informado com antecedência.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">5. Garantias</h2>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">5.1. Garantia de Aprovação</h3>
              <p className="text-neutral-700 leading-relaxed">
                O cliente só efetua o pagamento após aprovar o layout. Se não aprovar, não há cobrança.
                Incluímos até 2 (duas) rodadas de ajustes sem custo adicional.
              </p>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">5.2. Garantia de 30 Dias</h3>
              <p className="text-neutral-700 leading-relaxed">
                Após a entrega do site, o cliente tem <strong>30 dias de garantia</strong> para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-3">
                <li>Solicitar correção de bugs ou erros técnicos</li>
                <li>Solicitar ajustes em conteúdo (textos, imagens fornecidas pelo cliente)</li>
                <li>Solicitar reembolso total se não ficar satisfeito</li>
              </ul>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">5.3. Suporte Técnico</h3>
              <p className="text-neutral-700 leading-relaxed">
                30 dias de suporte técnico gratuito estão inclusos. Após esse período, suporte disponível
                sob demanda.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">6. Política de Reembolso</h2>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">6.1. Reembolso Antes do Pagamento</h3>
              <p className="text-neutral-700 leading-relaxed">
                Se o cliente não aprovar o layout, simplesmente não há pagamento. Não há custos.
              </p>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">6.2. Reembolso Após Pagamento</h3>
              <p className="text-neutral-700 leading-relaxed">
                O cliente pode solicitar reembolso total em até 30 dias após a entrega, por qualquer motivo,
                sem necessidade de justificativa. Processamento em até 7 dias úteis.
              </p>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">6.3. Exceções</h3>
              <p className="text-neutral-700 leading-relaxed">
                Não haverá reembolso se:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-3">
                <li>Cliente forneceu informações falsas ou incompletas no briefing</li>
                <li>Cliente solicitou modificações substanciais fora do escopo original após entrega</li>
                <li>Prazo de 30 dias já expirou</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">7. Responsabilidades do Cliente</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                O cliente é responsável por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Fornecer informações verdadeiras e completas no briefing</li>
                <li>Fornecer textos, fotos e materiais necessários para criação do site</li>
                <li>Garantir que possui direitos sobre textos, imagens e conteúdos fornecidos</li>
                <li>Aprovar o layout em tempo hábil (sugerimos até 7 dias)</li>
                <li>Responder comunicações em até 48 horas úteis</li>
                <li>Renovar hospedagem após 12 meses, se desejar manter o site online</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">8. Propriedade Intelectual</h2>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">8.1. Propriedade do Site</h3>
              <p className="text-neutral-700 leading-relaxed">
                Após pagamento integral, o cliente possui total propriedade sobre:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-3">
                <li>Design do site criado especificamente para ele</li>
                <li>Código-fonte do site</li>
                <li>Todos os conteúdos fornecidos pelo próprio cliente</li>
              </ul>

              <h3 className="font-heading text-xl text-neutral-900 mt-6 mb-3">8.2. Direito de Portfólio</h3>
              <p className="text-neutral-700 leading-relaxed">
                Reservamo-nos o direito de exibir o site do cliente em nosso portfólio, salvo se o cliente
                solicitar expressamente o contrário. Podemos anonimizar informações se solicitado.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">9. Limitações de Responsabilidade</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                A Sites Odonto 24H NÃO se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Conteúdos fornecidos pelo cliente (textos, imagens, depoimentos)</li>
                <li>Violação de direitos autorais em materiais fornecidos pelo cliente</li>
                <li>Resultados de marketing ou vendas (não garantimos número específico de pacientes)</li>
                <li>Posicionamento específico no Google (fazemos SEO básico, mas ranqueamento depende de diversos fatores)</li>
                <li>Problemas decorrentes de falta de renovação de hospedagem</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">10. Rescisão</h2>
              <p className="text-neutral-700 leading-relaxed">
                Qualquer parte pode rescindir o acordo antes do pagamento sem custos. Após pagamento,
                aplicam-se as condições da Política de Reembolso (seção 6).
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">11. Alterações nos Termos</h2>
              <p className="text-neutral-700 leading-relaxed">
                Podemos atualizar estes termos periodicamente. Clientes ativos serão notificados por e-mail
                sobre alterações significativas. Novos clientes estarão sujeitos aos termos vigentes na
                data da contratação.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">12. Lei Aplicável e Foro</h2>
              <p className="text-neutral-700 leading-relaxed">
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Eventuais disputas
                serão resolvidas no foro da comarca de [Sua Cidade], com exclusão de qualquer outro por
                mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">13. Contato</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Para dúvidas sobre estes Termos de Uso:
              </p>
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 space-y-2">
                <p className="text-neutral-900 font-semibold">Sites Odonto 24H</p>
                <p className="text-neutral-700">E-mail: contato@briefingodontologico.com.br</p>
                <p className="text-neutral-700">WhatsApp: (18) 3175-1052</p>
              </div>
            </section>
          </div>

          {/* Back to Top */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-medical-600 hover:text-medical-700 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar para Home
            </Link>
          </div>
        </div>
      </main>

      <FooterNew />
    </div>
  );
};

export default Termos;
