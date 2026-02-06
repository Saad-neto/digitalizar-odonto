import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppFloating: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const whatsappNumber = '5511963256658';
  const message = encodeURIComponent(
    'Olá! Vi o site de vocês e gostaria de tirar algumas dúvidas sobre a criação de site para dentistas.'
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  useEffect(() => {
    // Mostrar botão após 2 segundos de scroll
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Mostrar tooltip automático após 5 segundos (apenas uma vez)
    const timer = setTimeout(() => {
      setIsTooltipOpen(true);
      // Fechar tooltip automático após 5 segundos
      setTimeout(() => setIsTooltipOpen(false), 5000);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip */}
        {isTooltipOpen && (
          <div className="relative bg-white shadow-xl rounded-lg p-4 max-w-xs animate-bounce-subtle border-2 border-mint-500">
            <button
              onClick={() => setIsTooltipOpen(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-200 hover:bg-neutral-300 rounded-full flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <X size={14} className="text-neutral-700" />
            </button>
            <p className="text-sm font-medium text-neutral-900 mb-1">
              💬 Tem dúvidas?
            </p>
            <p className="text-xs text-neutral-600">
              Clique aqui e fale conosco agora pelo WhatsApp!
            </p>
          </div>
        )}

        {/* Main Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-pulse-slow"
          aria-label="Falar no WhatsApp"
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
        >
          {/* Ícone do WhatsApp */}
          <MessageCircle size={32} className="text-white" />

          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-medical-500 items-center justify-center">
              <span className="text-[10px] font-bold text-white">1</span>
            </span>
          </span>

          {/* Ripple Effect */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-0 group-hover:opacity-20 group-hover:animate-ripple"></span>
        </a>

        {/* Label (Desktop only) */}
        <div className="hidden md:block absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
            Fale conosco no WhatsApp
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-neutral-900"></div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-ripple {
          animation: ripple 1s ease-out;
        }
      `}</style>
    </>
  );
};

export default WhatsAppFloating;
