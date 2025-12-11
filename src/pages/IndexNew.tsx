import React from 'react';
import HeaderNew from '../components/redesign/HeaderNew';
import FooterNew from '../components/redesign/FooterNew';
import HeroSectionNew from '../components/redesign/sections/HeroSectionNew';
import ProblemsSectionNew from '../components/redesign/sections/ProblemsSectionNew';
import SolutionSectionNew from '../components/redesign/sections/SolutionSectionNew';
import HowItWorksSectionNew from '../components/redesign/sections/HowItWorksSectionNew';
import TestimonialsSectionNew from '../components/redesign/sections/TestimonialsSectionNew';
import OffersSectionNew from '../components/redesign/sections/OffersSectionNew';
import GuaranteesSectionNew from '../components/redesign/sections/GuaranteesSectionNew';
import FAQSectionNew from '../components/redesign/sections/FAQSectionNew';
import FinalCTASectionNew from '../components/redesign/sections/FinalCTASectionNew';

const IndexNew: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNew />

      <main className="pt-20">
        <HeroSectionNew />
        <ProblemsSectionNew />
        <SolutionSectionNew />

        <div id="como-funciona">
          <HowItWorksSectionNew />
        </div>

        <div id="depoimentos">
          <TestimonialsSectionNew />
        </div>

        <OffersSectionNew />

        <div id="garantias">
          <GuaranteesSectionNew />
        </div>

        <div id="faq">
          <FAQSectionNew />
        </div>

        <FinalCTASectionNew />
      </main>

      <FooterNew />
    </div>
  );
};

export default IndexNew;
