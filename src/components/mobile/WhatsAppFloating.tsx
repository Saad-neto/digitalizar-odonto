import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloating: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra após scroll de 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/5511963256658?text=Olá!%20Tenho%20interesse%20no%20site%20odontológico"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      aria-label="Falar no WhatsApp"
    >
      <div className="relative group">
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"></span>

        {/* Button */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 md:p-5 shadow-2xl transition-all duration-300 hover:scale-110">
          <MessageCircle size={28} className="md:w-8 md:h-8" />
        </div>

        {/* Tooltip (desktop only) */}
        <div className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Fale conosco no WhatsApp
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-neutral-900"></div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppFloating;
