import React from 'react';
import { Flame } from 'lucide-react';

// Contador de vagas - ATUALIZAR MANUALMENTE quando vender
const REMAINING_SPOTS = 7;

const LaunchBar: React.FC = () => {
  const scrollToOffer = () => {
    const offerSection = document.getElementById('ofertas');
    offerSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-primary-dark to-primary text-white py-3 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
        {/* Badge Pulsante */}
        <div className="inline-flex items-center gap-2 bg-red-alert px-3 py-1 rounded-full animate-pulse">
          <Flame size={18} className="text-white" />
          <span className="font-bold text-sm uppercase">Lançamento</span>
        </div>

        {/* Texto Principal */}
        <p className="text-sm md:text-base font-semibold">
          <span className="hidden sm:inline">🔥 </span>
          10 Primeiras Vagas com <span className="font-bold text-yellow-highlight">50% OFF</span>
          <span className="mx-2">•</span>
          Restam apenas{' '}
          <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-yellow-highlight text-text-primary font-bold rounded mx-1">
            {REMAINING_SPOTS}
          </span>{' '}
          {REMAINING_SPOTS === 1 ? 'vaga' : 'vagas'}
        </p>

        {/* Link/CTA */}
        <button
          onClick={scrollToOffer}
          className="inline-flex items-center gap-1 bg-white text-primary px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors"
          aria-label="Ver oferta"
        >
          Ver Oferta →
        </button>
      </div>
    </div>
  );
};

export default LaunchBar;
