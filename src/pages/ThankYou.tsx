import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, CreditCard, Globe, Star, Shield, Zap, Gift } from 'lucide-react';

const ThankYou = () => {
  const handleWhatsAppContact = () => {
    const phoneNumber = "5518931751052"; // Format: country code + area code + number without spaces
    const message = encodeURIComponent("Olá! Acabei de enviar meu briefing para criação do site odontológico e gostaria de tirar algumas dúvidas.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-subtle)' }}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <CardContent className="p-0">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[hsl(var(--success))] to-[hsl(var(--success-dark))] text-white text-center p-12">
              <div className="mb-6">
                <CheckCircle className="mx-auto h-20 w-20 mb-4" />
                <h1 className="text-4xl font-bold mb-4 text-white">🎉 Parabéns! Seu pedido foi recebido com sucesso!</h1>
                <p className="text-xl opacity-90">
                  <strong>Obrigado por confiar em nós para criar seu site profissional!</strong>
                </p>
              </div>
              <p className="text-lg">
                Estamos animados para transformar suas ideias em realidade e criar um site que vai impressionar seus visitantes e gerar resultados para seu negócio.
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Timeline Promise */}
              <div className="text-center p-8 rounded-lg border-l-4" style={{ 
                background: 'var(--gradient-subtle)', 
                borderColor: 'hsl(var(--primary))'
              }}>
                <Zap className="mx-auto h-12 w-12 mb-4" style={{ color: 'hsl(var(--primary))' }} />
                <h2 className="text-3xl font-bold mb-4" style={{ color: 'hsl(var(--primary))' }}>
                  ⚡ SEU SITE ESTARÁ PRONTO EM ATÉ 24 HORAS!
                </h2>
                <p className="text-lg mb-6" style={{ color: 'hsl(var(--text-primary))' }}>
                  Nosso time já começou a trabalhar no seu projeto. Você receberá:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                    <span><strong>Um site completo e profissional</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                    <span><strong>Design responsivo para todos os dispositivos</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                    <span><strong>Otimizado para conversões</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                    <span><strong>Hospedagem premium inclusa no primeiro ano</strong></span>
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'hsl(var(--primary))' }}>🔄 COMO FUNCIONA O PROCESSO:</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-white rounded-lg border-2 border-gray-100 transition-colors hover:border-[hsl(var(--primary))]" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <div className="text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ background: 'hsl(var(--primary))' }}>
                      1
                    </div>
                    <h3 className="font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>CRIAÇÃO (24h)</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>Seu site será desenvolvido e enviado para aprovação</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg border-2 border-gray-100 transition-colors hover:border-[hsl(var(--primary))]" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <div className="text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ background: 'hsl(var(--primary))' }}>
                      2
                    </div>
                    <h3 className="font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>REVISÕES (até 3 alterações)</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>Cada alteração será entregue em até 24h para sua conferência</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg border-2 border-gray-100 transition-colors hover:border-[hsl(var(--primary))]" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <div className="text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ background: 'hsl(var(--primary))' }}>
                      3
                    </div>
                    <h3 className="font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>APROVAÇÃO FINAL</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>Após sua aprovação, você terá 24h para efetuar o pagamento</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-lg border-2 border-gray-100 transition-colors hover:border-[hsl(var(--primary))]" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <div className="text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ background: 'hsl(var(--primary))' }}>
                      4
                    </div>
                    <h3 className="font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>SITE NO AR</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>Seu site ficará disponível imediatamente após o pagamento</p>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              <div className="p-8 rounded-lg border-l-4" style={{ 
                background: 'hsl(var(--success-bg))', 
                borderColor: 'hsl(var(--success))' 
              }}>
                <div className="text-center">
                  <Gift className="mx-auto h-12 w-12 mb-4" style={{ color: 'hsl(var(--success))' }} />
                  <h2 className="text-2xl font-bold mb-4" style={{ color: 'hsl(var(--success-dark))' }}>💰 OFERTA ESPECIAL - APENAS PARA HOJE:</h2>
                  
                  <div className="text-center mb-6">
                    <span className="text-2xl line-through" style={{ color: 'hsl(var(--text-light))' }}>De R$ 997</span>
                    <span className="text-4xl font-bold ml-4" style={{ color: 'hsl(var(--success))' }}>por apenas R$ 497</span>
                    <p className="text-lg mt-2" style={{ color: 'hsl(var(--text-secondary))' }}>
                      <em>Ou 12x de R$ 49,70 no cartão</em>
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <h3 className="font-bold mb-4 text-lg" style={{ color: 'hsl(var(--success-dark))' }}>🎁 BÔNUS INCLUSOS:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                        <span>Hospedagem premium <strong>GRÁTIS</strong> no primeiro ano (valor R$ 358,80)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                        <span>Certificado SSL (segurança) <strong>GRÁTIS</strong></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                        <span>Suporte técnico especializado</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                        <span>Site responsivo para mobile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hosting Options */}
              <div className="p-8 rounded-lg" style={{ background: 'hsl(var(--bg-gray-50))' }}>
                <div className="text-center mb-6">
                  <Globe className="mx-auto h-12 w-12 mb-4" style={{ color: 'hsl(var(--primary))' }} />
                  <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>🌐 HOSPEDAGEM A PARTIR DO 2º ANO:</h2>
                  <p className="mt-2" style={{ color: 'hsl(var(--text-secondary))' }}>Escolha a melhor opção para você:</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200 text-center" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <CreditCard className="mx-auto h-8 w-8 mb-3" style={{ color: 'hsl(var(--blue-trust))' }} />
                    <h3 className="font-bold mb-2" style={{ color: 'hsl(var(--blue-trust))' }}>💳 Mensal</h3>
                    <div className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>R$ 29,90/mês</div>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>(flexibilidade total)</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border-2 text-center relative" style={{ 
                    boxShadow: 'var(--shadow-md)', 
                    borderColor: 'hsl(var(--success))' 
                  }}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-white px-4 py-1 rounded-full text-sm font-bold" style={{ background: 'hsl(var(--success))' }}>
                      ECONOMIZE R$ 59,80
                    </div>
                    <Star className="mx-auto h-8 w-8 mb-3" style={{ color: 'hsl(var(--success))' }} />
                    <h3 className="font-bold mb-2" style={{ color: 'hsl(var(--success))' }}>💎 Anual</h3>
                    <div className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--text-primary))' }}>R$ 299,00/ano</div>
                    <p className="text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>*Pagamento anual = 2 meses grátis!</p>
                  </div>
                </div>
              </div>

              {/* Domain Options */}
              <div className="p-6 rounded-lg border-l-4" style={{ 
                background: 'hsl(var(--blue-light))', 
                borderColor: 'hsl(var(--blue-trust))' 
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--blue-trust))' }}>🎯 DOMÍNIO PERSONALIZADO (OPCIONAL):</h3>
                <p className="mb-4 font-semibold">Quer usar seu próprio domínio?</p>
                <div className="space-y-2" style={{ color: 'hsl(var(--text-primary))' }}>
                  <p>• Transferência de domínio existente: <strong>R$ 100,00</strong></p>
                  <p>• Registro de novo domínio: <strong>R$ 100,00</strong></p>
                </div>
                <p className="text-sm mt-3 italic" style={{ color: 'hsl(var(--text-secondary))' }}>
                  *Este serviço pode ser adicionado a qualquer momento durante o processo.
                </p>
              </div>

              {/* Next Steps */}
              <div className="p-6 rounded-lg border-l-4" style={{ 
                background: 'hsl(var(--yellow-light))', 
                borderColor: 'hsl(var(--yellow-highlight))' 
              }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--orange-warning))' }}>📧 PRÓXIMOS PASSOS:</h3>
                <div className="space-y-3" style={{ color: 'hsl(var(--text-primary))' }}>
                  <div className="flex items-start space-x-3">
                    <div className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5" style={{ background: 'hsl(var(--yellow-highlight))' }}>1</div>
                    <p><strong>Fique de olho no seu e-mail</strong> - enviaremos atualizações do progresso</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5" style={{ background: 'hsl(var(--yellow-highlight))' }}>2</div>
                    <p><strong>Responda rapidamente</strong> - para agilizar as revisões</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5" style={{ background: 'hsl(var(--yellow-highlight))' }}>3</div>
                    <p><strong>Prepare seu conteúdo</strong> - textos, imagens e informações importantes</p>
                  </div>
                </div>
              </div>

              {/* Excitement Section */}
              <div className="text-center text-white p-8 rounded-lg" style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)` }}>
                <Clock className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-2xl font-bold mb-4">🚀 ESTÁ ANSIOSO PARA VER SEU SITE?</h2>
                <p className="text-lg mb-4">
                  <strong>Nós também!</strong> Nosso time está dedicado a entregar um resultado que vai superar suas expectativas.
                </p>
                <p className="text-lg italic">
                  <em>Em menos de 24 horas, você terá um site profissional que vai destacar seu negócio da concorrência.</em>
                </p>
              </div>

              {/* Contact Section */}
              <div className="text-center bg-white p-8 rounded-lg border-2" style={{ 
                boxShadow: 'var(--shadow-md)', 
                borderColor: 'hsl(var(--primary))' 
              }}>
                <Shield className="mx-auto h-12 w-12 mb-4" style={{ color: 'hsl(var(--primary))' }} />
                <h3 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--primary))' }}>💬 Dúvidas? Estamos aqui para ajudar!</h3>
                <p className="mb-6" style={{ color: 'hsl(var(--text-secondary))' }}>
                  Entre em contato conosco pelo WhatsApp e tire todas as suas dúvidas sobre o processo.
                </p>
                
                <Button
                  onClick={handleWhatsAppContact}
                  className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success-dark))] text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  style={{ boxShadow: 'var(--shadow-cta)' }}
                >
                  💬 Conversar no WhatsApp: (18) 3175-1052
                </Button>
                
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                  <p className="font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                    <strong>Obrigado novamente pela confiança!</strong>
                  </p>
                  <p className="font-bold mt-2" style={{ color: 'hsl(var(--primary))' }}>
                    <em>Equipe Digitalizar Odonto</em>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;