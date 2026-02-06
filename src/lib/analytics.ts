/**
 * Analytics & Tracking Library
 *
 * Integração com Google Analytics 4 e Meta Pixel (Facebook)
 *
 * Uso:
 * - initAnalytics() - Inicializa GA4 e Meta Pixel (chamar no main.tsx)
 * - trackEvent() - Envia evento customizado
 * - trackPageView() - Rastreia visualização de página
 * - trackLead() - Rastreia lead gerado (briefing enviado)
 * - trackPurchase() - Rastreia conversão de pagamento
 */

// Tipos do Google Analytics 4
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    GA4_MEASUREMENT_ID?: string;
    META_PIXEL_ID?: string;
  }
}

// IDs de rastreamento (vem das variáveis de ambiente)
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

/**
 * Inicializa Google Analytics 4
 */
function initGA4() {
  if (!GA4_ID || GA4_ID === 'undefined') {
    console.warn('⚠️ GA4 não configurado. Defina VITE_GA4_MEASUREMENT_ID no .env');
    return;
  }

  // Adicionar script do gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Inicializar dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, {
    send_page_view: true,
  });

  console.log('✅ Google Analytics 4 inicializado:', GA4_ID);
}

/**
 * Inicializa Meta Pixel (Facebook)
 */
function initMetaPixel() {
  if (!META_PIXEL_ID || META_PIXEL_ID === 'undefined') {
    console.warn('⚠️ Meta Pixel não configurado. Defina VITE_META_PIXEL_ID no .env');
    return;
  }

  // Código padrão do Meta Pixel
  !(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq?.('init', META_PIXEL_ID);
  window.fbq?.('track', 'PageView');

  console.log('✅ Meta Pixel inicializado:', META_PIXEL_ID);
}

/**
 * Inicializa todos os sistemas de analytics
 * Chamar uma vez no carregamento da aplicação (main.tsx)
 */
export function initAnalytics() {
  initGA4();
  initMetaPixel();
}

/**
 * Rastreia visualização de página (SPA)
 * @param path - Caminho da página (ex: '/briefing')
 * @param title - Título da página (opcional)
 */
export function trackPageView(path: string, title?: string) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  console.log('📊 Page view:', path);
}

/**
 * Rastreia evento customizado
 * @param eventName - Nome do evento
 * @param params - Parâmetros adicionais
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Meta Pixel (converter nome do evento para padrão do Facebook)
  if (window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }

  console.log('📊 Event:', eventName, params);
}

/**
 * Rastreia início do formulário de briefing
 */
export function trackBriefingStart() {
  trackEvent('briefing_started', {
    event_category: 'engagement',
    event_label: 'Briefing Form Started',
  });
}

/**
 * Rastreia conclusão do briefing (lead gerado)
 * @param leadId - ID do lead criado
 * @param value - Valor do serviço (opcional)
 */
export function trackLead(leadId: string, value?: number) {
  // Google Analytics 4 - Evento de conversão
  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'conversion',
      event_label: 'Briefing Completed',
      lead_id: leadId,
      value: value || 497,
      currency: 'BRL',
    });
  }

  // Meta Pixel - Evento Lead (padrão do Facebook)
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Briefing Odontológico',
      value: value || 497,
      currency: 'BRL',
      lead_id: leadId,
    });
  }

  console.log('📊 Lead gerado:', leadId);
}

/**
 * Rastreia início do processo de pagamento
 * @param leadId - ID do lead
 * @param value - Valor da entrada
 */
export function trackBeginCheckout(leadId: string, value: number) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      event_category: 'ecommerce',
      currency: 'BRL',
      value: value,
      items: [
        {
          item_id: leadId,
          item_name: 'Site Profissional Odontológico',
          price: value,
          quantity: 1,
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: 'Site Profissional Odontológico',
      value: value,
      currency: 'BRL',
      lead_id: leadId,
    });
  }

  console.log('📊 Checkout iniciado:', leadId, value);
}

/**
 * Rastreia conversão de pagamento (purchase)
 * @param leadId - ID do lead
 * @param transactionId - ID da transação de pagamento
 * @param value - Valor pago
 */
export function trackPurchase(leadId: string, transactionId: string, value: number) {
  // Google Analytics 4 - Evento de compra
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'BRL',
      items: [
        {
          item_id: leadId,
          item_name: 'Site Profissional Odontológico',
          price: value,
          quantity: 1,
        },
      ],
    });
  }

  // Meta Pixel - Purchase
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: 'Site Profissional Odontológico',
      value: value,
      currency: 'BRL',
      transaction_id: transactionId,
      lead_id: leadId,
    });
  }

  console.log('📊 Compra realizada:', transactionId, value);
}

/**
 * Rastreia clique em CTA (Call to Action)
 * @param ctaName - Nome do botão/CTA
 * @param location - Localização do CTA na página
 */
export function trackCTAClick(ctaName: string, location: string) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    location: location,
  });
}

/**
 * Rastreia scroll profundo na página
 * @param percentage - Percentual de scroll (25, 50, 75, 100)
 */
export function trackScroll(percentage: number) {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    scroll_depth: percentage,
  });
}
