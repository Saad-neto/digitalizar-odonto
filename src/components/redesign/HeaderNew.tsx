import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';

const HeaderNew: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback((scrollY: number) => {
    setIsScrolled(scrollY > 20);
  }, []);

  useOptimizedScroll(handleScroll, 100);

  // Memoize scroll function to prevent recreation on every render
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo-header.png"
              alt="clinicanaweb.com - Soluções para Clínicas e Consultórios"
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="font-heading font-bold text-neutral-900 text-base leading-tight">
                clinicanaweb.com
              </div>
              <div className="text-medical-600 text-xs font-medium leading-tight">
                Soluções para Clínicas e Consultórios
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="h-full flex items-center text-sm leading-none text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="h-full flex items-center text-sm leading-none text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('garantias')}
              className="h-full flex items-center text-sm leading-none text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Garantias
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="h-full flex items-center text-sm leading-none text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              FAQ
            </button>
            {/* Temporariamente removido
            <Link
              to="/blog"
              className="h-full flex items-center text-sm leading-none text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Blog
            </Link>
            */}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 h-full">
            <a
              href="https://wa.me/5511963256658"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm leading-none text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              <Phone size={16} className="flex-shrink-0" />
              (11) 96325-6658
            </a>

            <Link
              to="/briefing"
              className="flex items-center justify-center px-6 py-3 bg-medical-500 text-white text-sm leading-none font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
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
              {/* Temporariamente removido
              <Link
                to="/blog"
                className="text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              */}

              <a
                href="https://wa.me/5511963256658"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-body-md text-neutral-700 hover:text-medical-600 transition-colors duration-300 font-medium"
              >
                <Phone size={18} />
                (11) 96325-6658
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
