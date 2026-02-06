import React from 'react';
import SEO from '../components/SEO';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import HeroSectionNew from '../components/redesign/sections/HeroSectionNew';
import ProblemsSectionNew from '../components/redesign/sections/ProblemsSectionNew';
import SolutionSectionNew from '../components/redesign/sections/SolutionSectionNew';
import { PortfolioSection } from '../components/sections/PortfolioSection';
import HowItWorksSectionNew from '../components/redesign/sections/HowItWorksSectionNew';
import WhatsIncludedSection from '../components/redesign/sections/WhatsIncludedSection';
import GuaranteesSectionNew from '../components/redesign/sections/GuaranteesSectionNew';
import FAQSectionNew from '../components/redesign/sections/FAQSectionNew';
import FinalCTASectionNew from '../components/redesign/sections/FinalCTASectionNew';
import ScheduleBanner from '../components/redesign/ScheduleBanner';
import WhatsAppFloating from '../components/redesign/WhatsAppFloating';

const Page1: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <SEO
        title="clinicanaweb.com - Sites Profissionais para Dentistas em 7 Dias | R$ 997"
        description="Site profissional para dentistas em 7 dias por R$ 997. Design personalizado, hospedagem grátis para sempre, SEO otimizado. Só paga depois de aprovar."
        keywords="site para dentista, criação de site odontológico, marketing digital odontologia, site para clínica odontológica, site dentista preço, site responsivo dentista, sites para dentistas"
        canonicalUrl="https://sites-odonto.digitalizar.space/page1"
      />

      <HeaderNew />

      <main className="pt-20">
        <HeroSectionNew />
        <ProblemsSectionNew />
        <SolutionSectionNew />

        <div id="exemplos">
          <PortfolioSection />
        </div>

        <div id="como-funciona">
          <HowItWorksSectionNew />
        </div>

        <WhatsIncludedSection />

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

export default Page1;
