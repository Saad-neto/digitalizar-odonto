import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogPostBySlug, getRelatedPosts, getMostViewedPosts } from '@/lib/supabase';
import { PostContent } from '@/components/blog/PostContent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Eye,
  ChevronRight,
  Share2,
  Facebook,
  Linkedin,
  Twitter,
  Clock,
  User,
  Mail,
  TrendingUp,
  Sparkles,
  Home,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SEO, generateBlogPostStructuredData } from '@/components/blog/SEO';

export default function BlogPost() {
  const { slug } = useParams();
  const [email, setEmail] = useState('');
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ['related-posts', post?.id],
    queryFn: () => getRelatedPosts(post!.id),
    enabled: !!post?.id,
  });

  const { data: mostViewedPosts = [] } = useQuery({
    queryKey: ['most-viewed-posts'],
    queryFn: () => getMostViewedPosts(5),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Extract headings for Table of Contents
  useEffect(() => {
    if (!post) return;

    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('.blog-post-content h1, .blog-post-content h2, .blog-post-content h3');
      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        };
      });
      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [post]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const url = window.location.href;
    const title = post?.title || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado!');
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Função de newsletter será implementada em breve!');
    setEmail('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900">Post não encontrado</h1>
          <p className="text-gray-600 mb-6">
            O post que você procura não existe ou foi removido.
          </p>
          <Button asChild size="lg" className="bg-medical-500 hover:bg-medical-600">
            <Link to="/blog">Voltar ao blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil((post.content?.content?.reduce((acc: number, node: any) => {
    if (node.type === 'paragraph' && node.content) {
      return acc + node.content.reduce((textAcc: number, textNode: any) => {
        return textAcc + (textNode.text?.split(' ').length || 0);
      }, 0);
    }
    return acc;
  }, 0) || 0) / 200);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || post.title}
        image={post.featured_image}
        url={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedTime: post.published_at || post.created_at,
          modifiedTime: post.updated_at,
          author: post.author_name,
          section: post.category?.name,
          tags: post.tags?.map((t: any) => t.tag?.name).filter(Boolean),
        }}
        structuredData={generateBlogPostStructuredData(post)}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-medical-600 transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/blog" className="text-gray-600 hover:text-medical-600 transition-colors">
              Blog
            </Link>
            {post.category && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link
                  to={`/blog?categoria=${post.category.slug}`}
                  className="text-gray-600 hover:text-medical-600 transition-colors"
                >
                  {post.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      {post.featured_image && (
        <div className="relative w-full h-[400px] bg-gradient-to-br from-medical-600 to-medical-400">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {post.category && (
            <div className="absolute top-8 left-8">
              <Link to={`/blog?categoria=${post.category.slug}`}>
                <Badge className="bg-white/95 text-medical-600 hover:bg-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                  {post.category.name}
                </Badge>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Column */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12 mb-8">
              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(post.published_at || post.created_at)}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{readingTime} min de leitura</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{post.view_count} visualizações</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-body font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl font-body text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-200">
                  {post.excerpt}
                </p>
              )}

              {/* Author Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author_name}</p>
                  <p className="text-sm text-gray-500">Especialista em Marketing Odontológico</p>
                </div>
              </div>

              {/* Article Content */}
              <div className="max-w-none">
                <PostContent content={post.content} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Tags relacionadas:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tagWrapper: any) => {
                      const tag = tagWrapper.tag;
                      return tag ? (
                        <Link key={tag.id} to={`/blog?tag=${tag.slug}`}>
                          <Badge
                            variant="outline"
                            className="hover:bg-medical-50 hover:text-medical-600 hover:border-medical-600 cursor-pointer transition-colors"
                          >
                            #{tag.name}
                          </Badge>
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
                <h3 className="text-sm font-medium mb-3">Compartilhar:</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('whatsapp')}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>

            {/* Author Box */}
            <Card className="mb-8 overflow-hidden border-2 hover:border-medical-300 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sobre {post.author_name}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Especialista em Marketing Digital para Dentistas com mais de 10 anos de experiência ajudando consultórios a crescerem online.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Box */}
            <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-br from-medical-500 to-medical-600 text-white">
              <CardContent className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Pronto para atrair mais pacientes?</h3>
                </div>
                <p className="text-white/90 mb-6 text-lg">
                  Crie seu site profissional em 24 horas e comece a captar 3x mais pacientes.
                </p>
                <Button asChild size="lg" className="bg-white text-medical-600 hover:bg-gray-100 font-semibold">
                  <Link to="/briefing">Criar meu site agora</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Você também pode gostar</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.slice(0, 4).map((related: any) => (
                    <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-medical-300">
                        {related.featured_image && (
                          <div className="aspect-video overflow-hidden bg-gray-200">
                            <img
                              src={related.featured_image}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          {related.category && (
                            <Badge className="mb-3 bg-medical-50 text-medical-600 border-0">
                              {related.category.name}
                            </Badge>
                          )}
                          <h3 className="font-bold text-lg mb-2 group-hover:text-medical-600 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          {related.excerpt && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {related.excerpt}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Share Buttons */}
            <Card className="sticky top-24 hidden lg:block">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-medical-600" />
                  Compartilhar
                </h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('whatsapp')}
                    className="justify-start hover:bg-green-50 hover:text-green-600"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="justify-start"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="justify-start"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-medical-600" />
                    Índice
                  </h3>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`block w-full text-left text-sm hover:text-medical-600 transition-colors ${
                          heading.level === 2 ? 'pl-0 font-semibold' : heading.level === 3 ? 'pl-3' : 'pl-6'
                        } text-gray-700`}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            )}

            {/* Most Viewed Posts */}
            {mostViewedPosts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-medical-600" />
                    Mais lidos
                  </h3>
                  <div className="space-y-4">
                    {mostViewedPosts.map((viewedPost: any, index: number) => (
                      <Link
                        key={viewedPost.id}
                        to={`/blog/${viewedPost.slug}`}
                        className="group flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 group-hover:text-medical-600 transition-colors line-clamp-2 mb-1">
                            {viewedPost.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {viewedPost.category && (
                              <span className="text-medical-600">{viewedPost.category.name}</span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {viewedPost.view_count}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-medical-600" />
                  <h3 className="font-semibold text-gray-900">Newsletter</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Receba dicas exclusivas de marketing odontológico.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-medical-500 hover:bg-medical-600">
                    Inscrever-se
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-medical-500 to-medical-600 text-white">
              <CardContent className="p-6">
                <Sparkles className="w-6 h-6 mb-3" />
                <h3 className="font-bold text-lg mb-2">Crie seu site!</h3>
                <p className="text-white/90 mb-4 text-sm">
                  Site profissional em 24h. Atraia mais pacientes!
                </p>
                <Button asChild className="w-full bg-white text-medical-600 hover:bg-gray-100 font-semibold">
                  <Link to="/briefing">Começar agora</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
