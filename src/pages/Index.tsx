import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/sections/HeroSection';
import ProblemsSection from '../components/sections/ProblemsSection';
import SolutionSection from '../components/sections/SolutionSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import OffersSection from '../components/sections/OffersSection';
import GuaranteesSection from '../components/sections/GuaranteesSection';
import FAQSection from '../components/sections/FAQSection';
import FinalCTASection from '../components/sections/FinalCTASection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProblemsSection />
        <SolutionSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <OffersSection />
        <GuaranteesSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
