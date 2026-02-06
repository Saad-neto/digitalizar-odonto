import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Globe, Star, FileText, Zap, MessageCircle, Mail } from 'lucide-react';
import HeaderNew from '@/components/redesign/HeaderNew';
import FooterNew from '@/components/redesign/FooterNew';
import { trackPurchase } from '@/lib/analytics';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const plano = searchParams.get('plano') || 'site';
  const isSiteBlog = plano === 'site_blog';

  // Rastrear conversão de briefing completo
  useEffect(() => {
    const leadId = localStorage.getItem('currentLeadId');
    if (leadId) {
      const valorTotal = isSiteBlog ? 1497 : 997;
      trackPurchase(leadId, leadId, valorTotal);
      console.log('🎉 Conversão rastreada:', { leadId, valorTotal, plano });
    }
  }, [isSiteBlog]);

  const handleWhatsAppContact = () => {
    const phoneNumber = "5518931751052";
    const message = encodeURIComponent("Olá! Acabei de enviar meu briefing para criação do site odontológico e gostaria de tirar algumas dúvidas.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-medical-50">
      <HeaderNew />

      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card className="overflow-hidden shadow-2xl border-0">
          <CardContent className="p-0">

            {/* Hero Success Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center p-8 sm:p-12">
              <div className="mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                  Briefing Recebido com Sucesso!
                </h1>
                <p className="text-xl text-white font-medium">
                  Obrigado por completar seu briefing. Agora vamos criar seu site!
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">

              {/* Plano Contratado */}
              <div className="bg-gradient-to-r from-medical-50 to-mint-50 p-6 rounded-xl border border-medical-200">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-medical-600" size={24} />
                  <h2 className="text-xl font-bold text-medical-800">Seu Plano</h2>
                </div>
                <div className="bg-white rounded-lg p-4 border border-medical-100">
                  <p className="text-2xl font-bold text-medical-700 mb-2">
                    {isSiteBlog ? '🚀 Site Profissional + Blog SEO' : '⭐ Site Profissional'}
                  </p>
                  <p className="text-medical-600">
                    {isSiteBlog
                      ? 'Site completo com blog integrado para atrair pacientes pelo Google'
                      : 'Site profissional completo para sua clínica odontológica'}
                  </p>
                </div>
              </div>

              {/* Próximos Passos */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-medical-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Próximos Passos</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Step 1 */}
                  <div className="bg-white p-5 rounded-xl border-2 border-medical-100 hover:border-medical-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-medical-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <h3 className="font-bold text-gray-800">Contato da Equipe</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Em até <strong>24 horas</strong> um membro da nossa equipe entrará em contato para confirmar os dados do briefing.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-5 rounded-xl border-2 border-medical-100 hover:border-medical-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-medical-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <h3 className="font-bold text-gray-800">Link para Aprovação</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Em até <strong>3 dias</strong> você receberá o link do site para visualizar e aprovar.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-5 rounded-xl border-2 border-medical-100 hover:border-medical-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-medical-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <h3 className="font-bold text-gray-800">Ajustes</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Você tem direito a <strong>2 rodadas de ajustes</strong> incluídas para deixar o site perfeito.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white p-5 rounded-xl border-2 border-medical-100 hover:border-medical-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-medical-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <h3 className="font-bold text-gray-800">Publicação</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Após sua aprovação final, seu site será <strong>publicado e estará no ar</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* O que está incluído */}
              <div className="bg-gradient-to-br from-medical-500 to-medical-700 text-white p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-white" size={24} />
                  <h2 className="text-xl font-bold">Incluído no seu plano</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Site responsivo (mobile e desktop)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Otimizado para Google (SEO)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Hospedagem premium GRÁTIS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Certificado SSL (segurança)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Botão WhatsApp integrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Domínio personalizado</span>
                  </div>
                  {isSiteBlog && (
                    <>
                      <div className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                        <CheckCircle size={18} />
                        <span className="font-semibold">Blog integrado</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                        <CheckCircle size={18} />
                        <span className="font-semibold">Artigos SEO otimizados</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* O que esperar */}
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="text-amber-600" size={24} />
                  <h2 className="text-xl font-bold text-amber-800">Fique de olho no seu e-mail!</h2>
                </div>
                <ul className="space-y-2 text-amber-900">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">→</span>
                    <span>Em até <strong>24 horas</strong> você receberá o contato da nossa equipe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">→</span>
                    <span>O link de aprovação será enviado em até <strong>3 dias</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">→</span>
                    <span>Verifique também a caixa de spam</span>
                  </li>
                </ul>
              </div>

              {/* Contato WhatsApp */}
              <div className="text-center bg-white p-6 rounded-xl border-2 border-medical-200">
                <MessageCircle className="mx-auto h-10 w-10 mb-4 text-medical-600" />
                <h3 className="text-lg font-bold mb-3 text-gray-800">Dúvidas? Estamos aqui!</h3>
                <p className="mb-4 text-gray-600">
                  Entre em contato pelo WhatsApp para qualquer dúvida sobre o projeto.
                </p>

                <Button
                  onClick={handleWhatsAppContact}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  💬 Falar no WhatsApp
                </Button>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="font-medium text-gray-700">
                    Obrigado pela confiança!
                  </p>
                  <p className="font-bold text-medical-600 mt-1">
                    Equipe clinicanaweb.com
                  </p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      <FooterNew />
    </div>
  );
};

export default ThankYou;
