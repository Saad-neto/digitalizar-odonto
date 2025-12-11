import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  // WhatsApp number from existing data
  const whatsappNumber = '5518317510052'; // (18) 3175-1052
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Tenho interesse em fazer um site odontológico.`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Falar no WhatsApp"
    >
      {/* Botão Principal */}
      <div className="relative flex items-center gap-3 bg-success hover:bg-success-dark text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        {/* Ícone com animação pulse */}
        <div className="relative">
          <MessageCircle size={24} className="relative z-10" />
          {/* Pulse effect */}
          <span className="absolute inset-0 bg-success-light rounded-full animate-ping opacity-75"></span>
        </div>

        {/* Texto (esconde em mobile) */}
        <span className="hidden sm:block font-semibold">
          Fale Conosco
        </span>

        {/* Badge de notificação (opcional) */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-alert rounded-full border-2 border-white"></span>
      </div>

      {/* Tooltip em hover (desktop) */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-text-primary text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Tire suas dúvidas agora!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-text-primary"></div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
