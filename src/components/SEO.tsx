import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'clinicanaweb.com - Sites Profissionais para Dentistas em 7 Dias | R$ 497',
  description = 'Site profissional para dentistas em 7 dias por R$ 497. Design personalizado, hospedagem grátis para sempre, SEO otimizado. Só paga depois de aprovar. Programa Beta - 10 vagas.',
  keywords = 'site para dentista, criação de site odontológico, marketing digital odontologia, site para clínica odontológica, site dentista preço, site responsivo dentista',
  canonicalUrl = 'https://sites-odonto.digitalizar.space',
  ogImage = 'https://sites-odonto.digitalizar.space/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  author = 'clinicanaweb.com',
  publishedTime,
  modifiedTime,
  noindex = false
}) => {
  const siteTitle = title.includes('clinicanaweb.com') ? title : `${title} | clinicanaweb.com`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="clinicanaweb.com" />
      <meta property="og:locale" content="pt_BR" />

      {/* Article specific (if type is article) */}
      {ogType === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#0891B2" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="clinicanaweb.com" />

      {/* Geo Tags (Brasil) */}
      <meta name="geo.region" content="BR" />
      <meta name="geo.placename" content="Brasil" />
      <meta name="language" content="Portuguese" />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "clinicanaweb.com",
          "url": "https://sites-odonto.digitalizar.space",
          "logo": "https://sites-odonto.digitalizar.space/logo-new.png",
          "description": description,
          "telephone": "+55-11-96325-6658",
          "email": "contato@sitesodonto.com.br",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR",
            "addressLocality": "Brasil"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          },
          "sameAs": [
            "https://www.instagram.com/sitesodonto",
            "https://www.facebook.com/sitesodonto"
          ]
        })}
      </script>

      {/* Structured Data - Professional Service */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "clinicanaweb.com",
          "description": "Criação de sites profissionais para dentistas e clínicas odontológicas",
          "url": "https://sites-odonto.digitalizar.space",
          "telephone": "+55-11-96325-6658",
          "priceRange": "R$ 497",
          "areaServed": {
            "@type": "Country",
            "name": "Brasil"
          }
        })}
      </script>

      {/* Structured Data - Product/Offer */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Site Profissional para Dentistas",
          "description": "Site profissional completo para dentistas em 7 dias",
          "brand": {
            "@type": "Brand",
            "name": "clinicanaweb.com"
          },
          "offers": {
            "@type": "Offer",
            "price": "497",
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "url": "https://sites-odonto.digitalizar.space/briefing",
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "seller": {
              "@type": "Organization",
              "name": "clinicanaweb.com"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          }
        })}
      </script>

      {/* Structured Data - FAQ (if applicable) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Quanto custa um site para dentista?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O investimento para um site profissional para dentistas é de R$ 497 em pagamento único. Não há mensalidades recorrentes. Inclui design personalizado, hospedagem gratuita para sempre, SEO básico e suporte técnico."
              }
            },
            {
              "@type": "Question",
              "name": "Quanto tempo leva para criar o site?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O prazo médio é de 7 dias da aprovação do briefing até a entrega do layout para aprovação. Você recebe o layout, revisa, e só paga se aprovar."
              }
            },
            {
              "@type": "Question",
              "name": "Preciso pagar mensalidade?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Não! O investimento de R$ 497 é único. A hospedagem é GRATUITA PARA SEMPRE. Você não paga mensalidades ou taxas ocultas."
              }
            },
            {
              "@type": "Question",
              "name": "O que está incluído no site?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Está incluído: design 100% personalizado, responsivo (mobile/tablet/desktop), SEO básico, integração WhatsApp, Google Reviews, Google Maps, hospedagem gratuita, SSL, suporte por 30 dias, Google Analytics e Meta Pixel."
              }
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
