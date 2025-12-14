import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';

const ScheduleBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem('scheduleBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show banner when user scrolls 60% of the page
      const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;

      if (scrollPercentage > 0.6 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('scheduleBannerDismissed', 'true');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-medical-200 p-5 max-w-sm">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-7 h-7 bg-neutral-700 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors duration-200 shadow-md"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-medical-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle size={24} className="text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-heading text-lg text-neutral-900 mb-2">
              Dúvidas?
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              Agende uma conversa rápida com nossa equipe
            </p>

            <div className="flex gap-2">
              <Link
                to="/agendar"
                onClick={handleDismiss}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-medical-500 text-white text-sm font-semibold rounded-lg hover:bg-medical-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Agendar
              </Link>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-neutral-600 text-sm font-medium hover:text-neutral-900 transition-colors duration-200"
              >
                Depois
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBanner;
