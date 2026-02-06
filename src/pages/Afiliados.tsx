import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import FooterNew from '../components/redesign/FooterNew';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { createAfiliadoLead } from '../lib/supabase';
import {
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
  Gift,
  Globe,
  Smartphone,
  ArrowRight,
  Loader2,
  Instagram,
  AlertCircle
} from 'lucide-react';

const Afiliados: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // UTM tracking
  const utm_source = searchParams.get('utm_source') || undefined;
  const utm_medium = searchParams.get('utm_medium') || undefined;
  const utm_campaign = searchParams.get('utm_campaign') || undefined;

  // Estado do modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    instagram: '',
    autoriza_uso_conteudo: false,
    interesse_collab: false,
    aceita_termos: false
  });

  // URL do Hotmart para afiliados
  const HOTMART_AFILIADOS_URL = 'https://affiliate.hotmart.com/affiliate-recruiting/view/2295S103872560';

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    handleInputChange('whatsapp', formatted);
  };

  const formatInstagram = (value: string) => {
    let cleaned = value.replace(/\s/g, '');
    if (cleaned.startsWith('@')) {
      cleaned = cleaned.slice(1);
    }
    if (cleaned.includes('instagram.com/')) {
      cleaned = cleaned.split('instagram.com/')[1]?.split('/')[0] || '';
    }
    return cleaned ? `@${cleaned}` : '';
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInstagram(e.target.value);
    handleInputChange('instagram', formatted);
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError('Por favor, informe seu nome');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Por favor, informe um email válido');
      return false;
    }
    if (!formData.whatsapp || formData.whatsapp.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um WhatsApp válido');
      return false;
    }
    if (!formData.aceita_termos) {
      setError('Você precisa aceitar os termos para continuar');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createAfiliadoLead({
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        whatsapp: formData.whatsapp,
        instagram: formData.instagram || undefined,
        autoriza_uso_conteudo: formData.autoriza_uso_conteudo,
        interesse_collab: formData.interesse_collab,
        aceita_termos: formData.aceita_termos,
        utm_source,
        utm_medium,
        utm_campaign
      });

      if (result) {
        // Redireciona para Hotmart
        window.location.href = HOTMART_AFILIADOS_URL;
      } else {
        setError('Erro ao salvar cadastro. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao cadastrar afiliado:', err);
      setError('Erro ao processar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setError(null);
  };

  const beneficios = [
    {
      icon: DollarSign,
      titulo: 'Comissão Atrativa',
      desc: 'Ganhe comissões competitivas a cada venda realizada'
    },
    {
      icon: Globe,
      titulo: 'Site Grátis',
      desc: 'Afiliados ativos ganham um site profissional gratuito'
    },
    {
      icon: TrendingUp,
      titulo: 'Produto Validado',
      desc: 'Taxa de conversão alta e clientes satisfeitos'
    },
    {
      icon: Users,
      titulo: 'Público Qualificado',
      desc: 'Dentistas e profissionais de saúde que precisam de presença online'
    },
    {
      icon: Gift,
      titulo: 'Materiais de Divulgação',
      desc: 'Criativos, copies e materiais prontos para usar'
    },
    {
      icon: Smartphone,
      titulo: 'Suporte Dedicado',
      desc: 'Canal direto para dúvidas e estratégias'
    }
  ];

  const comoFunciona = [
    {
      numero: '1',
      titulo: 'Cadastre-se',
      desc: 'Preencha o formulário rápido e seja aprovado como afiliado'
    },
    {
      numero: '2',
      titulo: 'Divulgue',
      desc: 'Use seu link exclusivo e materiais de divulgação'
    },
    {
      numero: '3',
      titulo: 'Ganhe Comissões',
      desc: 'Receba comissões por cada venda realizada'
    }
  ];

  const perfisIdeais = [
    'Influenciadores na área odontológica',
    'Estudantes de Odontologia',
    'Representantes comerciais do setor',
    'Profissionais de marketing digital',
    'Donos de perfis de dicas para dentistas',
    'Professores e palestrantes da área'
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Seja Afiliado | clinicanaweb.com"
        description="Ganhe comissões indicando sites profissionais para dentistas. Programa de afiliados com materiais prontos e suporte dedicado."
        keywords="afiliado odontologia, programa afiliados, ganhar dinheiro, marketing odontológico"
      />

      <main>
        {/* HERO */}
        <section className="relative bg-gradient-to-b from-medical-50 to-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-mint-100 text-mint-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <TrendingUp size={18} />
                  Programa de Afiliados
                </div>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight">
                  Ganhe Dinheiro{' '}
                  <span className="text-medical-600">Indicando Sites</span> para Dentistas
                </h1>

                <p className="text-xl text-neutral-700 leading-relaxed">
                  Junte-se ao nosso programa de afiliados e ganhe <strong>comissões atrativas</strong>{' '}
                  indicando sites profissionais para profissionais de odontologia.
                </p>

                <div className="space-y-3">
                  {[
                    'Comissões competitivas por venda',
                    'Site profissional GRÁTIS para afiliados ativos',
                    'Materiais de divulgação prontos'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-mint-500 flex-shrink-0" />
                      <span className="text-base text-neutral-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={openModal}
                    className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-medical-500 text-white text-lg font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    Quero Ser Afiliado
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-medical-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-medical-100 p-4 rounded-xl">
                      <DollarSign size={32} className="text-medical-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-medical-600">Até R$ 300</div>
                      <div className="text-neutral-700">
                        de comissão <strong>por venda</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-mint-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-mint-100 p-4 rounded-xl">
                      <Gift size={32} className="text-mint-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-mint-600">Site Grátis</div>
                      <div className="text-neutral-700">
                        para afiliados <strong>ativos</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-medical-600 to-medical-700 rounded-2xl p-6 text-white shadow-xl">
                  <p className="text-xl font-extrabold mb-2 text-white">Nicho em Crescimento</p>
                  <p className="text-base font-medium leading-relaxed text-white">
                    Mais de <strong className="font-bold">350.000 dentistas</strong> no Brasil precisam
                    de presença digital profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Para Quem é o <span className="text-medical-600">Programa?</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                O programa é ideal para quem já tem contato com dentistas ou quer começar a trabalhar com esse nicho
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {perfisIdeais.map((perfil, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-neutral-200 flex items-center gap-4"
                >
                  <CheckCircle2 size={24} className="text-mint-500 flex-shrink-0" />
                  <span className="text-neutral-700 font-medium">{perfil}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4">
                Benefícios do <span className="text-medical-600">Programa</span>
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Tudo que você precisa para ter sucesso como afiliado
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {beneficios.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-white to-neutral-50 rounded-2xl p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-all"
                >
                  <div className="bg-medical-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <item.icon size={28} className="text-medical-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">{item.titulo}</h3>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-16 md:py-24 bg-neutral-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4 text-center">
                Como Funciona
              </h2>
              <p className="text-xl text-neutral-600 text-center">Simples, rápido e sem burocracia</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {comoFunciona.map((passo, index) => (
                <div key={index} className="relative h-full">
                  <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-medical-100 h-full flex flex-col">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-medical-500 to-medical-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {passo.numero}
                      </div>
                    </div>
                    <div className="pt-8 text-center flex flex-col flex-grow">
                      <h3 className="font-semibold text-xl text-neutral-900 mb-3">
                        {passo.titulo}
                      </h3>
                      <p className="text-neutral-600 flex-grow">{passo.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl text-neutral-900 mb-4 text-center">
                Perguntas Frequentes
              </h2>
              <p className="text-xl text-neutral-600 text-center">
                Tire suas dúvidas sobre o programa de afiliados
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  pergunta: 'Quanto posso ganhar como afiliado?',
                  resposta: 'Você pode ganhar até R$ 300 de comissão por cada venda realizada. O valor exato depende do plano que o cliente escolher (Site Profissional ou Site + Blog SEO). As comissões são pagas diretamente pela Hotmart.'
                },
                {
                  pergunta: 'Preciso pagar algo para participar?',
                  resposta: 'Não! O cadastro é 100% gratuito. Você não paga nada para se tornar afiliado e começar a divulgar.'
                },
                {
                  pergunta: 'Como funciona o site grátis para afiliados?',
                  resposta: 'Afiliados ativos (que realizam vendas regularmente) ganham um site profissional gratuito. Em troca, você autoriza o uso do seu conteúdo (depoimentos, posts, stories) para divulgação da clinicanaweb.com nas redes sociais e materiais de marketing. É uma parceria: você ganha um site de qualidade e nós usamos seu conteúdo para atrair mais clientes — o que também aumenta suas comissões!'
                },
                {
                  pergunta: 'O que significa "autorizar uso de conteúdo"?',
                  resposta: 'Significa que podemos usar os conteúdos que você produzir sobre a clinicanaweb.com (como posts, stories, vídeos ou depoimentos) em nossas redes sociais e materiais de marketing. Sempre daremos os devidos créditos. Essa autorização é opcional no cadastro, mas é requisito para ganhar o site gratuito.'
                },
                {
                  pergunta: 'Preciso ter CNPJ para ser afiliado?',
                  resposta: 'Não é obrigatório. Você pode se cadastrar como pessoa física. A Hotmart cuida de toda a parte de pagamentos e impostos.'
                },
                {
                  pergunta: 'Como e quando recebo minhas comissões?',
                  resposta: 'As comissões são pagas pela Hotmart, geralmente 30 dias após a confirmação da venda (período de garantia). Você pode sacar via PIX, transferência bancária ou outros métodos disponíveis na plataforma.'
                },
                {
                  pergunta: 'Recebo materiais para divulgação?',
                  resposta: 'Sim! Você terá acesso a criativos prontos, copies para posts, imagens e estratégias de divulgação. Tudo pensado para facilitar suas vendas.'
                },
                {
                  pergunta: 'Quanto tempo demora a aprovação?',
                  resposta: 'A aprovação é rápida, geralmente em até 24 horas após o cadastro. Você receberá um email da Hotmart confirmando sua afiliação.'
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
                >
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                    {faq.pergunta}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {faq.resposta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-medical-600 to-medical-700 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-heading text-3xl md:text-5xl mb-6 text-white">
              Comece a Ganhar Comissões Hoje
            </h2>
            <p className="text-xl md:text-2xl mb-8 font-medium text-white">
              Cadastro gratuito e aprovação rápida. Comece a divulgar ainda hoje!
            </p>

            <Button
              size="lg"
              onClick={openModal}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-medical-600 text-xl font-bold rounded-lg hover:bg-neutral-100 transition-all shadow-2xl hover:scale-105"
            >
              Quero Ser Afiliado
              <ArrowRight size={24} />
            </Button>

            <div className="mt-6 w-full flex justify-center">
              <p className="text-base text-white font-medium text-center">
                Cadastro gratuito • Aprovação rápida • Materiais prontos
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterNew />

      {/* Modal de Cadastro */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-neutral-900">
              Cadastro de Afiliado
            </DialogTitle>
            <DialogDescription className="text-neutral-600">
              Preencha seus dados para se tornar um afiliado clinicanaweb.com
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-neutral-700">
                Nome completo *
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium text-neutral-700">
                WhatsApp *
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                className="h-12"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-medium text-neutral-700">
                Instagram (opcional)
              </Label>
              <div className="relative">
                <Instagram size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="instagram"
                  type="text"
                  placeholder="@seuusuario"
                  value={formData.instagram}
                  onChange={handleInstagramChange}
                  className="h-12 pl-10"
                />
              </div>
            </div>

            {/* Checkboxes - Design Profissional */}
            <div className="space-y-3 pt-2">
              {/* Autorização de conteúdo */}
              <label
                htmlFor="autoriza_uso_conteudo"
                className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.autoriza_uso_conteudo
                    ? 'bg-medical-50 border-2 border-medical-400 shadow-sm'
                    : 'bg-white border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                  formData.autoriza_uso_conteudo
                    ? 'bg-medical-500 text-white'
                    : 'bg-neutral-100 border-2 border-neutral-300 group-hover:border-neutral-400'
                }`}>
                  {formData.autoriza_uso_conteudo && <CheckCircle2 size={16} />}
                </div>
                <input
                  type="checkbox"
                  id="autoriza_uso_conteudo"
                  checked={formData.autoriza_uso_conteudo}
                  onChange={(e) => handleInputChange('autoriza_uso_conteudo', e.target.checked)}
                  className="sr-only"
                />
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold ${
                    formData.autoriza_uso_conteudo ? 'text-medical-700' : 'text-neutral-700'
                  }`}>
                    Autorizo o uso do meu conteúdo
                  </span>
                  <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                    Permito que a clinicanaweb.com utilize conteúdos que eu produzir em suas redes sociais e materiais de marketing, com os devidos créditos.
                  </span>
                </div>
              </label>

              {/* Interesse em collab */}
              <label
                htmlFor="interesse_collab"
                className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.interesse_collab
                    ? 'bg-mint-50 border-2 border-mint-400 shadow-sm'
                    : 'bg-white border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                  formData.interesse_collab
                    ? 'bg-mint-500 text-white'
                    : 'bg-neutral-100 border-2 border-neutral-300 group-hover:border-neutral-400'
                }`}>
                  {formData.interesse_collab && <CheckCircle2 size={16} />}
                </div>
                <input
                  type="checkbox"
                  id="interesse_collab"
                  checked={formData.interesse_collab}
                  onChange={(e) => handleInputChange('interesse_collab', e.target.checked)}
                  className="sr-only"
                />
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold ${
                    formData.interesse_collab ? 'text-mint-700' : 'text-neutral-700'
                  }`}>
                    Tenho interesse em fazer posts em collab/parceria
                  </span>
                  <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                    Gostaria de participar de ações de co-marketing, como posts em collab no Instagram, lives conjuntas ou outras parcerias.
                  </span>
                </div>
              </label>

              {/* Aceite de termos */}
              <label
                htmlFor="aceita_termos"
                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.aceita_termos
                    ? 'bg-neutral-100'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all ${
                  formData.aceita_termos
                    ? 'bg-medical-500 text-white'
                    : 'bg-white border-2 border-neutral-300 group-hover:border-neutral-400'
                }`}>
                  {formData.aceita_termos && <CheckCircle2 size={14} />}
                </div>
                <input
                  type="checkbox"
                  id="aceita_termos"
                  checked={formData.aceita_termos}
                  onChange={(e) => handleInputChange('aceita_termos', e.target.checked)}
                  className="sr-only"
                />
                <span className="text-sm text-neutral-600">
                  Li e aceito os{' '}
                  <a
                    href="/termos"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-medical-600 hover:underline font-medium"
                  >
                    termos de uso
                  </a>
                  {' '}e{' '}
                  <a
                    href="/privacidade"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-medical-600 hover:underline font-medium"
                  >
                    política de privacidade
                  </a>
                  {' '}<span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-medical-500 hover:bg-medical-600 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  Continuar para Hotmart
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-neutral-500 text-center">
              Após o cadastro, você será redirecionado para completar sua afiliação na Hotmart
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Afiliados;
