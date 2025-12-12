import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';

const Privacidade: React.FC = () => {
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
                <Shield size={24} className="text-medical-600" />
              </div>
              <h1 className="font-heading text-4xl md:text-5xl text-neutral-900">
                Política de Privacidade
              </h1>
            </div>
            <p className="text-neutral-600 text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">1. Introdução</h2>
              <p className="text-neutral-700 leading-relaxed">
                A <strong>Sites Odonto 24H</strong> ("nós", "nosso" ou "empresa") está comprometida em proteger
                sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e
                protegemos suas informações pessoais quando você utiliza nosso site e serviços.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">2. Quais Dados Coletamos</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Coletamos as seguintes informações quando você preenche nosso briefing ou utiliza nossos serviços:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Dados Pessoais:</strong> Nome completo, CPF, telefone, WhatsApp, e-mail</li>
                <li><strong>Dados Profissionais:</strong> Nome da clínica, especialidades, CRO, endereço do consultório</li>
                <li><strong>Dados do Negócio:</strong> Informações sobre serviços, diferenciais, depoimentos de pacientes</li>
                <li><strong>Arquivos:</strong> Fotos, logos, documentos enviados para criação do site</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas (via Google Analytics)</li>
                <li><strong>Dados de Pagamento:</strong> Processados pela Stripe (não armazenamos dados de cartão)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">3. Como Usamos Seus Dados</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Criar e desenvolver seu site odontológico personalizado</li>
                <li>Processar pagamentos e emitir notas fiscais</li>
                <li>Comunicar sobre o andamento do projeto</li>
                <li>Fornecer suporte técnico</li>
                <li>Enviar atualizações sobre nossos serviços (apenas com seu consentimento)</li>
                <li>Melhorar nossos serviços através de análises agregadas e anônimas</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">4. Armazenamento e Segurança</h2>
              <p className="text-neutral-700 leading-relaxed">
                Seus dados são armazenados de forma segura através dos seguintes serviços:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-4">
                <li><strong>Supabase:</strong> Banco de dados com criptografia e backup automático</li>
                <li><strong>Netlify:</strong> Hospedagem com certificado SSL (conexão HTTPS)</li>
                <li><strong>Stripe:</strong> Processamento de pagamentos em conformidade com PCI-DSS</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
                autorizado, perda, destruição ou alteração.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">5. Compartilhamento de Dados</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                <strong>NÃO</strong> vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros
                para fins de marketing.
              </p>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Compartilhamos dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Prestadores de Serviço:</strong> Supabase, Stripe, Netlify (processamento técnico)</li>
                <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Com Seu Consentimento:</strong> Se você aprovar o uso do seu site como exemplo em nosso portfólio</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                De acordo com a LGPD, você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
                <li><strong>Anonimização ou Bloqueio:</strong> Solicitar anonimização ou bloqueio de dados desnecessários</li>
                <li><strong>Eliminação:</strong> Solicitar exclusão de dados tratados com seu consentimento</li>
                <li><strong>Portabilidade:</strong> Solicitar seus dados em formato estruturado</li>
                <li><strong>Informação sobre Compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
                <li><strong>Revogação de Consentimento:</strong> Retirar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">7. Retenção de Dados</h2>
              <p className="text-neutral-700 leading-relaxed">
                Mantemos seus dados pessoais pelo tempo necessário para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-4">
                <li>Cumprir obrigações legais e contratuais (geralmente 5 anos)</li>
                <li>Fornecer suporte técnico durante o período de garantia</li>
                <li>Resolver disputas ou processar reclamações</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                Após esse período, seus dados serão anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">8. Cookies e Tecnologias Similares</h2>
              <p className="text-neutral-700 leading-relaxed">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700 mt-4">
                <li>Analisar tráfego e comportamento de navegação (Google Analytics)</li>
                <li>Melhorar a experiência do usuário</li>
                <li>Medir eficácia de campanhas de marketing (se configurado)</li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-4">
                Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar
                algumas funcionalidades do site.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">9. Alterações nesta Política</h2>
              <p className="text-neutral-700 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre
                alterações significativas por e-mail ou através de aviso destacado em nosso site.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-neutral-900 mb-4">10. Contato</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade:
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

export default Privacidade;
