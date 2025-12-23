import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/lib/supabase';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: object;
}

export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  article,
  structuredData,
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://digitalizarodonto.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = `${title} | Digitalizar Odonto`;
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Digitalizar Odonto" />

      {/* Article-specific OG tags */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

/**
 * Gerar Structured Data para posts do blog
 */
export function generateBlogPostStructuredData(post: BlogPost) {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://digitalizarodonto.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.meta_description || '',
    image: post.featured_image || '',
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Digitalizar Odonto',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    ...(post.category && {
      articleSection: post.category.name,
    }),
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.map((t: any) => t.tag?.name).filter(Boolean).join(', '),
    }),
  };
}

/**
 * Gerar Structured Data para listagem do blog
 */
export function generateBlogListStructuredData() {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://digitalizarodonto.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog - Digitalizar Odonto',
    description:
      'Dicas, tendências e insights sobre marketing digital, gestão de clínicas odontológicas e tecnologia',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Digitalizar Odonto',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}
