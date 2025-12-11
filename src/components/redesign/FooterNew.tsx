import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Instagram, Facebook, Linkedin } from 'lucide-react';

const FooterNew: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo-new.png"
                alt="Sites Odonto 24H"
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="font-heading font-bold text-white text-lg leading-tight">
                  Sites Odonto
                </div>
                <div className="text-medical-400 text-xs font-medium">
                  24 Horas
                </div>
              </div>
            </div>

            <p className="text-body-sm text-neutral-400 leading-relaxed mb-6">
              Sites profissionais para dentistas que querem atrair mais pacientes particulares
              e crescer de forma sustentável.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-medical-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-medical-500 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-medical-500 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-heading font-semibold text-white text-body-lg mb-4">
              Navegação
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  Como Funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('depoimentos')}
                  className="text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  Depoimentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('garantias')}
                  className="text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  Garantias
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link
                  to="/briefing"
                  className="text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  Começar Agora
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-heading font-semibold text-white text-body-lg mb-4">
              Serviços
            </h4>
            <ul className="space-y-3 text-body-sm text-neutral-400">
              <li>Design Personalizado</li>
              <li>Otimização SEO</li>
              <li>Hospedagem Incluída</li>
              <li>Suporte Técnico</li>
              <li>Integração WhatsApp</li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-heading font-semibold text-white text-body-lg mb-4">
              Contato
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/5518317510052"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  <MessageCircle size={18} className="flex-shrink-0" />
                  WhatsApp: (18) 3175-1052
                </a>
              </li>
              <li>
                <a
                  href="tel:+551831751052"
                  className="flex items-center gap-3 text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  <Phone size={18} className="flex-shrink-0" />
                  (18) 3175-1052
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@briefingodontologico.com.br"
                  className="flex items-center gap-3 text-body-sm text-neutral-400 hover:text-medical-400 transition-colors duration-300"
                >
                  <Mail size={18} className="flex-shrink-0" />
                  contato@briefingodontologico.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-sm text-neutral-500">
              © {currentYear} Sites Odonto 24H. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-6 text-body-sm text-neutral-500">
              <Link to="/privacidade" className="hover:text-medical-400 transition-colors duration-300">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:text-medical-400 transition-colors duration-300">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
