import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-12 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Sites Odonto 24H"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h2 className="text-xl font-bold text-primary">Sites Odonto</h2>
                <p className="text-xs text-text-secondary">Profissionais em 24h</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-text-primary hover:text-primary transition-colors story-link"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="text-text-primary hover:text-primary transition-colors story-link"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('ofertas')}
              className="text-text-primary hover:text-primary transition-colors story-link"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection('garantias')}
              className="text-text-primary hover:text-primary transition-colors story-link"
            >
              Garantias
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-text-primary hover:text-primary transition-colors story-link"
            >
              FAQ
            </button>
            <Link
              to="/blog"
              className="text-text-primary hover:text-primary transition-colors story-link"
            >
              Blog
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/briefing"
              className="btn-secondary flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Quero meu site
            </Link>
            <Link 
              to="/briefing"
              className="btn-hero"
            >
              Fazer Briefing
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="py-4 space-y-2">
              <button 
                onClick={() => scrollToSection('como-funciona')}
                className="block w-full text-left px-4 py-2 text-text-primary hover:bg-gray-50 transition-colors"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('depoimentos')}
                className="block w-full text-left px-4 py-2 text-text-primary hover:bg-gray-50 transition-colors"
              >
                Depoimentos
              </button>
              <button 
                onClick={() => scrollToSection('ofertas')}
                className="block w-full text-left px-4 py-2 text-text-primary hover:bg-gray-50 transition-colors"
              >
                Preços
              </button>
              <button 
                onClick={() => scrollToSection('garantias')}
                className="block w-full text-left px-4 py-2 text-text-primary hover:bg-gray-50 transition-colors"
              >
                Garantias
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left px-4 py-2 text-text-primary hover:bg-gray-50 transition-colors"
              >
                FAQ
              </button>
              <Link
                to="/blog"
                className="block w-full text-left px-4 py-2 text-text-primary hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="px-4 py-2 space-y-2">
                <Link 
                  to="/briefing"
                  className="btn-secondary flex items-center gap-2 w-full"
                >
                  <MessageCircle size={18} />
                  Quero meu site
                </Link>
                <Link 
                  to="/briefing"
                  className="btn-hero w-full"
                >
                  Fazer Briefing
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;