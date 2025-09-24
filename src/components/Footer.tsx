import React from 'react';
import { MapPin, Phone, Mail, Clock, Shield, Star, Award } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-text-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">24H</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Sites Odonto 24H</h3>
                <p className="text-white/70">Especialistas em Sites Odontológicos</p>
              </div>
            </div>
            
            <p className="text-white/90 mb-6 max-w-md">
              Há 5 anos transformando a presença digital de dentistas em todo o Brasil. 
              Mais de 500 profissionais já confiam em nosso trabalho especializado.
            </p>

            {/* Credibility Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Award size={20} className="text-success-light" />
                <span className="text-white/80">Digitalizar Odonto</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-success-light" />
                <span className="text-white/80">CNPJ: 48.451.907/0001-01</span>
              </div>
              <div className="flex items-center gap-3">
                <Star size={20} className="text-success-light" />
                <span className="text-white/80">100% especializado em odontologia</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contato</h4>
            
            <div className="space-y-4">
              
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-success-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">contato@digitalizarmkt.com.br</p>
                  <p className="text-white/70 text-sm">Suporte técnico</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-success-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Todo o Brasil</p>
                  <p className="text-white/70 text-sm">Atendimento 100% online</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-success-light mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Segunda a Sexta</p>
                  <p className="text-white/70 text-sm">8h às 18h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="text-xl font-bold mb-6">Confiança</h4>
            
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-success-light mb-1">500+</div>
                <p className="text-white/80 text-sm">Sites entregues desde 2019</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-success-light mb-1">4.9/5</div>
                <p className="text-white/80 text-sm">Avaliação média (127 reviews)</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-success-light mb-1">0</div>
                <p className="text-white/80 text-sm">Reclamações no Reclame Aqui</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <h4 className="text-lg font-bold text-center mb-6">Selos de Segurança</h4>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-center">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <div className="text-success-light font-bold">🔒</div>
              <p className="text-xs text-white/70 mt-1">Site Seguro SSL</p>
            </div>
            
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <div className="text-success-light font-bold">💳</div>
              <p className="text-xs text-white/70 mt-1">PagSeguro</p>
            </div>
            
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <div className="text-success-light font-bold">🏆</div>
              <p className="text-xs text-white/70 mt-1">Reclame Aqui</p>
            </div>
            
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <div className="text-success-light font-bold">⭐</div>
              <p className="text-xs text-white/70 mt-1">Google Partner</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p className="mb-4">
            © 2024 Sites Odonto 24H - Digitalizar Odonto. Todos os direitos reservados.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="story-link text-white/70 hover:text-white">
              Política de Privacidade
            </a>
            <a href="#" className="story-link text-white/70 hover:text-white">
              Termos de Uso
            </a>
            <a href="#" className="story-link text-white/70 hover:text-white">
              Política de Reembolso
            </a>
            <a href="#" className="story-link text-white/70 hover:text-white">
              Política de Cookies
            </a>
          </div>
          
          <p className="mt-6 text-xs text-white/50">
            Sites profissionais para dentistas | Criação de sites odontológicos | Marketing digital odontológico
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;