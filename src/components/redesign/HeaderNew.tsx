import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';

const HeaderNew: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-medical-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <div className="font-heading font-bold text-neutral-900 text-lg leading-tight">
                Sites Odonto
              </div>
              <div className="text-medical-600 text-xs font-medium">
                24 Horas
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('garantias')}
              className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
            >
              Garantias
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/5518317510052"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
            >
              <Phone size={18} />
              (18) 3175-1052
            </a>

            <Link
              to="/briefing"
              className="px-6 py-3 bg-medical-500 text-white text-body-md font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Começar Agora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-medical-600 transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-neutral-200">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('como-funciona')}
                className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium text-left"
              >
                Como Funciona
              </button>
              <button
                onClick={() => scrollToSection('depoimentos')}
                className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium text-left"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection('garantias')}
                className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium text-left"
              >
                Garantias
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium text-left"
              >
                FAQ
              </button>

              <a
                href="https://wa.me/5518317510052"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
              >
                <Phone size={18} />
                (18) 3175-1052
              </a>

              <Link
                to="/briefing"
                className="inline-flex items-center justify-center px-6 py-3 bg-medical-500 text-white text-body-md font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Começar Agora
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNew;
