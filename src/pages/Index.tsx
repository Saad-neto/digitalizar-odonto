import React from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import HeroSectionV2 from '../components/redesign/sections/HeroSectionV2';
import BenefitsSection from '../components/redesign/sections/BenefitsSection';
import ProblemsSectionNew from '../components/redesign/sections/ProblemsSectionNew';
import SolutionSectionNew from '../components/redesign/sections/SolutionSectionNew';
import { PortfolioSection } from '../components/sections/PortfolioSection';
import HowItWorksSectionNew from '../components/redesign/sections/HowItWorksSectionNew';
import PricingPlansSection from '../components/redesign/sections/PricingPlansSection';
import GuaranteesSectionNew from '../components/redesign/sections/GuaranteesSectionNew';
import FAQSectionNew from '../components/redesign/sections/FAQSectionNew';
import FinalCTASectionNew from '../components/redesign/sections/FinalCTASectionNew';
import ScheduleBanner from '../components/redesign/ScheduleBanner';
import WhatsAppFloating from '../components/redesign/WhatsAppFloating';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <SEO
        title="clinicanaweb.com - 3 Planos: Site Profissional, Site + Agendamento ou Site Completo | A partir de R$ 997"
        description="Escolha seu plano: Site Profissional (R$ 997), Site + Agendamento (R$ 1.497) ou Site Completo (R$ 1.997). Design personalizado, hospedagem grátis, SEO otimizado. Só paga depois de aprovar."
        keywords="site para dentista, criação de site odontológico, marketing digital odontologia, site para clínica odontológica, site dentista preço, site responsivo dentista, sites para dentistas, agendamento online odontologia"
        canonicalUrl="https://sites-odonto.digitalizar.space"
      />

      <HeaderNew />

      <main className="pt-20">
        <HeroSectionV2 />
        <BenefitsSection />
        <ProblemsSectionNew />
        <SolutionSectionNew />

        <div id="exemplos">
          <PortfolioSection />
        </div>

        <div id="como-funciona">
          <HowItWorksSectionNew />
        </div>

        <div id="planos">
          <PricingPlansSection />
        </div>

        <div id="garantias">
          <GuaranteesSectionNew />
        </div>

        <div id="faq">
          <FAQSectionNew />
        </div>

        <FinalCTASectionNew />
      </main>

      <FooterNew />
      <ScheduleBanner />

      {/* NOVO: WhatsApp Floating Button */}
      <WhatsAppFloating />
    </div>
  );
};

export default Index;
