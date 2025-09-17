import React, { useState } from 'react';
import { X, Check, Gift, CreditCard, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Timer from '../ui/timer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const OffersSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const installmentOptions = [
    { installments: 1, value: 497.00, total: 497.00 },
    { installments: 2, value: 260.80, total: 521.60 },
    { installments: 3, value: 175.85, total: 527.55 },
    { installments: 4, value: 133.45, total: 533.80 },
    { installments: 5, value: 108.20, total: 541.00 },
    { installments: 6, value: 91.30, total: 547.80 },
    { installments: 7, value: 79.10, total: 553.70 },
    { installments: 8, value: 70.10, total: 560.80 },
    { installments: 9, value: 63.20, total: 568.80 },
    { installments: 10, value: 57.80, total: 578.00 },
    { installments: 11, value: 53.35, total: 586.85 },
    { installments: 12, value: 47.90, total: 574.80 }
  ];

  const traditionalAgencies = [
    { item: "Valor", value: "R$ 3.000 a R$ 8.000", negative: true },
    { item: "Prazo", value: "30 a 60 dias", negative: true },
    { item: "Burocracia", value: "Reuniões intermináveis", negative: true },
    { item: "Resultado", value: "Incerto", negative: true }
  ];

  const ourMethod = [
    { item: "Valor", value: "R$ 497 (economia de R$ 500)", positive: true },
    { item: "Prazo", value: "24 horas garantidas", positive: true },
    { item: "Processo", value: "Briefing de 15 minutos", positive: true },
    { item: "Resultado", value: "Comprovado por 500+ dentistas", positive: true }
  ];

  const included = [
    { item: "Site responsivo profissional", value: "R$ 2.000" },
    { item: "Hospedagem premium 1º ano GRÁTIS", value: "R$ 360" },
    { item: "Certificado SSL de segurança GRÁTIS", value: "R$ 200" },
    { item: "Otimização básica para Google", value: "R$ 800" },
    { item: "Integração WhatsApp e redes sociais", value: "R$ 300" },
    { item: "Suporte técnico especializado", value: "R$ 600" },
    { item: "Até 3 revisões incluídas", value: "R$ 450" }
  ];

  const bonuses = [
    { icon: Gift, title: "Logo profissional (se não tiver)", value: "GRÁTIS" },
    { icon: Smartphone, title: "Banco de imagens premium", value: "GRÁTIS" },
    { icon: Check, title: "Treinamento para atualizar o site", value: "GRÁTIS" }
  ];

  const totalValue = included.reduce((sum, item) => {
    const value = parseInt(item.value.replace(/[^\d]/g, ''));
    return sum + value;
  }, 0);

  return (
    <section id="ofertas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Oferta Especial: De R$ 997 por
            <span className="block price-highlight">Apenas R$ 497</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Compare nossa solução exclusiva com o que você encontraria no mercado tradicional.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Traditional Agencies */}
          <div className="card-premium border-red-alert/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-red-alert mb-2">
                ❌ AGÊNCIAS TRADICIONAIS
              </h3>
              <p className="text-text-secondary">O que você encontra no mercado</p>
            </div>

            <div className="space-y-4">
              {traditionalAgencies.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-light/30 rounded-lg">
                  <span className="font-medium text-text-primary">{item.item}:</span>
                  <span className="font-semibold text-red-alert">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="text-3xl font-bold text-red-alert mb-2">
                R$ 3.000 - R$ 8.000+
              </div>
              <p className="text-text-secondary">Investimento médio</p>
            </div>
          </div>

          {/* Our Method */}
          <div className="card-premium border-success/20 bg-success-bg/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-success mb-2">
                ✅ NOSSO MÉTODO EXCLUSIVO
              </h3>
              <p className="text-text-secondary">Solução especializada para dentistas</p>
            </div>

            <div className="space-y-4">
              {ourMethod.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-success-bg rounded-lg">
                  <span className="font-medium text-text-primary">{item.item}:</span>
                  <span className="font-semibold text-success-dark">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">
                R$ 497
              </div>
              <p className="text-success-dark font-semibold">Economia de R$ 4.213</p>
            </div>
          </div>
        </div>

        {/* Main Offer Card */}
        <div className="card-premium bg-gradient-subtle border-primary/20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-success text-white px-4 py-2 rounded-full mb-4">
              <Gift size={20} />
              <span className="font-semibold">OFERTA LIMITADA</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="price-crossed">R$ 997</span>
              <span className="price-highlight">R$ 497</span>
            </div>

            <div className="bg-text-primary text-white rounded-lg p-4 inline-block">
              <p className="font-semibold mb-2">Esta oferta expira em:</p>
              <Timer 
                initialHours={2}
                initialMinutes={47}
                initialSeconds={15}
                className="text-2xl"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-6 bg-success-bg rounded-lg border border-success/20">
              <CreditCard size={32} className="text-success mx-auto mb-3" />
              <h4 className="font-bold text-text-primary mb-2">À Vista</h4>
              <div className="text-2xl font-bold text-success">R$ 497</div>
              <p className="text-text-secondary text-sm">Pix ou Cartão</p>
            </div>
            
            <div className="text-center p-6 bg-primary-ultra-light rounded-lg border border-primary/20">
              <CreditCard size={32} className="text-primary mx-auto mb-3" />
              <h4 className="font-bold text-text-primary mb-2">Parcelado</h4>
              <div className="text-2xl font-bold text-primary">12x R$ 47,90</div>
              <p className="text-text-secondary text-sm">Sem juros</p>
              <button 
                className="mt-3 text-primary hover:text-primary/80 font-semibold text-sm underline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                Ver Parcelamento
              </button>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-text-primary text-center mb-6">
              O QUE ESTÁ INCLUÍDO (VALOR REAL)
            </h4>
            
            <div className="space-y-3">
              {included.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Check size={20} className="text-success" />
                    <span className="text-text-primary">{item.item}</span>
                  </div>
                  <span className="font-semibold text-success">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-text-primary text-white rounded-lg text-center">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">VALOR TOTAL:</span>
                <span className="font-bold">R$ {totalValue.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between text-2xl mt-2">
                <span className="font-bold">VOCÊ PAGA:</span>
                <span className="font-bold text-success-light">R$ 497</span>
              </div>
              <div className="text-success-light font-semibold mt-2">
                *(economia de R$ {(totalValue - 497).toLocaleString('pt-BR')})*
              </div>
            </div>
          </div>

          {/* Bonuses */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-text-primary text-center mb-6">
              🎁 BÔNUS ESPECIAIS HOJE
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              {bonuses.map((bonus, index) => (
                <div key={index} className="text-center p-4 bg-yellow-light rounded-lg border border-yellow-highlight/20">
                  <bonus.icon size={32} className="text-yellow-highlight mx-auto mb-2" />
                  <h5 className="font-semibold text-text-primary mb-1">{bonus.title}</h5>
                  <span className="text-yellow-highlight font-bold">{bonus.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center space-y-4">
            <Link 
              to="/formulario"
              className="btn-hero text-xl px-12 py-5 w-full md:w-auto"
            >
              🚀 SIM! QUERO MEU SITE EM 24H
            </Link>
            
            <p className="text-text-secondary">
              💻 Clique aqui para fazer seu briefing agora
            </p>
            
            <p className="text-success font-semibold">
              ⏰ Vaga garantida para hoje
            </p>
          </div>
        </div>

        {/* Urgency Notice */}
        <div className="mt-12 text-center bg-orange-light border border-orange-warning/20 rounded-lg p-6">
          <h4 className="text-xl font-bold text-orange-warning mb-2">
            ⚠️ Restam apenas 2 vagas para entrega hoje
          </h4>
          <p className="text-text-secondary">
            Amanhã você pode ter que aguardar disponibilidade.
          </p>
        </div>
      </div>

      {/* Dialog moved outside main structure to prevent event conflicts */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              TABELA DE PARCELAMENTO
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success-bg rounded-lg border border-success/20">
              <span className="font-semibold text-success">✅ À vista:</span>
              <span className="font-bold text-success">R$ 497,00</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">Parcelado:</h4>
              {installmentOptions.map((option) => (
                <div key={option.installments} className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">
                    {option.installments}x de R$ {option.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-text-secondary">
                    = Total: R$ {option.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default OffersSection;