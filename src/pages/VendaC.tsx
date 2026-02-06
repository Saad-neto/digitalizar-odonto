import React from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import HeroSectionV2 from '../components/redesign/sections/HeroSectionV2';
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

// VERSÃO C: Clone da home original - Para testes A/B/C
const VendaC: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <SEO
        title="clinicanaweb.com - 2 Planos: Site Profissional ou Site + Blog SEO | A partir de R$ 997"
        description="Escolha seu plano: Site Profissional (R$ 997) ou Site + Blog SEO (R$ 1.497). Design personalizado, hospedagem grátis para sempre, SEO otimizado. Só paga depois de aprovar."
        keywords="site para dentista, criação de site odontológico, marketing digital odontologia, site para clínica odontológica, site dentista preço, site responsivo dentista, sites para dentistas, blog odontológico"
        canonicalUrl="https://odonto.digitalizarmkt.com.br/venda-c"
      />

      <HeaderNew />

      <main className="pt-20">
        <HeroSectionV2 />
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

      {/* WhatsApp Floating Button */}
      <WhatsAppFloating />
    </div>
  );
};

export default VendaC;
