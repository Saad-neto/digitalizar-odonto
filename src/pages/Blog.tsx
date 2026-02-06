import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { listBlogPosts, listCategories, getMostViewedPosts } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Trophy,
  Home,
  ChevronRight as BreadcrumbArrow,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { SEO, generateBlogListStructuredData } from '@/components/blog/SEO';

// Ícones para categorias
const categoryIcons: Record<string, any> = {
  'marketing-odontologico': TrendingUp,
  'marketing-para-dentistas': TrendingUp,
  'sites-para-clinicas': FileText,
  'gestao-odontologica': Users,
  'casos-de-sucesso': Trophy,
};

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const categorySlug = searchParams.get('categoria') || undefined;
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts', page, categorySlug, searchQuery],
    queryFn: () =>
      listBlogPosts({
        page,
        limit: 9,
        categorySlug,
        search: searchQuery,
      }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: listCategories,
  });

  const { data: mostViewedPosts = [] } = useQuery({
    queryKey: ['blog-most-viewed'],
    queryFn: () => getMostViewedPosts(5),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ page: '1' });
  };

  const handleCategoryClick = (slug: string) => {
    setSearchParams({ categoria: slug, page: '1' });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const changePage = (newPage: number) => {
    const params: any = { page: newPage.toString() };
    if (categorySlug) params.categoria = categorySlug;
    setSearchParams(params);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar integração com newsletter
    console.log('Newsletter:', email);
    setEmail('');
    alert('Obrigado por se inscrever! Em breve você receberá nossas dicas.');
  };

  const selectedCategory = categories.find((c: any) => c.slug === categorySlug);

  const pageTitle = selectedCategory
    ? `${selectedCategory.name} - Blog`
    : searchQuery
    ? `Busca: ${searchQuery} - Blog`
    : 'Blog';

  const pageDescription = selectedCategory
    ? selectedCategory.description ||
      `Artigos sobre ${selectedCategory.name.toLowerCase()}`
    : 'Dicas, tendências e insights sobre marketing digital, gestão de clínicas odontológicas e tecnologia';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title={pageTitle}
        description={pageDescription}
        url="/blog"
        structuredData={generateBlogListStructuredData()}
      />

      {/* Hero Section - Redesenhado */}
      <div className="relative bg-gradient-to-br from-medical-600 via-medical-500 to-medical-400 text-white overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link to="/" className="hover:text-white transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <BreadcrumbArrow className="w-4 h-4" />
            <span className="text-white font-medium">Blog</span>
          </nav>

          {/* Título */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Aprenda com os especialistas
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Blog clinicanaweb.com
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Dicas práticas para crescer seu consultório, captar mais pacientes e dominar o marketing digital odontológico
            </p>
          </div>
        </div>

        {/* Onda decorativa no final */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Filtro Rápido de Categorias */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              Filtrar por:
            </span>
            <Button
              size="sm"
              variant={!categorySlug ? 'default' : 'outline'}
              onClick={clearFilters}
              className={!categorySlug ? 'bg-medical-500 hover:bg-medical-600' : 'hover:bg-medical-50'}
            >
              Todos
            </Button>
            {categories.map((category: any) => {
              const IconComponent = categoryIcons[category.slug] || FileText;
              const isActive = categorySlug === category.slug;
              return (
                <Button
                  key={category.id}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`whitespace-nowrap ${
                    isActive
                      ? 'bg-medical-500 hover:bg-medical-600'
                      : 'hover:bg-medical-50'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 mr-1.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Redesenhada */}
          <aside className="lg:w-80 space-y-6">
            {/* Busca */}
            <Card className="border-2 hover:border-medical-200 transition-colors">
              <CardContent className="p-5">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-medical-500" />
                    <Input
                      placeholder="Buscar no blog..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 h-12 border-gray-300 focus:border-medical-500"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Categorias com ícones */}
            <Card className="border-2">
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-medical-500" />
                  Categorias
                </h3>
                <div className="space-y-2">
                  {categorySlug && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-medical-50 hover:text-medical-700"
                      onClick={clearFilters}
                    >
                      <span className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          📋
                        </div>
                        Ver todos
                      </span>
                    </Button>
                  )}
                  {categories.map((category: any) => {
                    const IconComponent = categoryIcons[category.slug] || FileText;
                    return (
                      <Button
                        key={category.id}
                        variant={categorySlug === category.slug ? 'default' : 'ghost'}
                        className={`w-full justify-start ${
                          categorySlug === category.slug
                            ? 'bg-medical-500 hover:bg-medical-600'
                            : 'hover:bg-medical-50 hover:text-medical-700'
                        }`}
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        <span className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            categorySlug === category.slug
                              ? 'bg-white/20'
                              : 'bg-medical-100'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          {category.name}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Posts Mais Lidos */}
            {mostViewedPosts.length > 0 && (
              <Card className="border-2 border-medical-200">
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-medical-500" />
                    Mais Lidos
                  </h3>
                  <div className="space-y-4">
                    {mostViewedPosts.map((post: any, index: number) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex gap-3 hover:bg-medical-50 p-2 rounded-lg transition-colors -mx-2"
                      >
                        {/* Número */}
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-medical-500 text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-medical-600 transition mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {post.category && (
                              <span className="text-medical-600 font-medium">
                                {post.category.name}
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.view_count}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter Box */}
            <Card className="border-2 border-medical-500 bg-gradient-to-br from-medical-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-medical-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Newsletter</h3>
                    <p className="text-sm text-gray-600">
                      Receba dicas semanais direto no seu e-mail
                    </p>
                  </div>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-medical-500 hover:bg-medical-600"
                  >
                    Inscrever-se
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Sem spam. Cancele quando quiser.
                </p>
              </CardContent>
            </Card>

            {/* CTA Box */}
            <Card className="border-2 border-medical-500 bg-gradient-to-br from-medical-500 to-medical-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <CardContent className="p-6 relative z-10">
                <h3 className="font-bold text-xl mb-3">
                  Precisa de um site profissional?
                </h3>
                <p className="text-white/90 mb-4 text-sm">
                  Criamos seu site odontológico em 24h. Design moderno, otimizado para Google.
                </p>
                <Link to="/briefing">
                  <Button
                    variant="secondary"
                    className="w-full bg-white text-medical-600 hover:bg-gray-100"
                  >
                    Começar Agora
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filtro ativo */}
            {(selectedCategory || searchQuery) && (
              <div className="mb-6 flex items-center gap-2 flex-wrap bg-medical-50 p-4 rounded-lg border border-medical-200">
                <span className="text-sm font-medium text-gray-700">Filtrado por:</span>
                {selectedCategory && (
                  <Badge variant="default" className="gap-1 bg-medical-500">
                    {selectedCategory.name}
                    <button
                      className="ml-1 hover:text-medical-200 transition"
                      onClick={clearFilters}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="default" className="gap-1 bg-medical-500">
                    "{searchQuery}"
                    <button
                      className="ml-1 hover:text-medical-200 transition"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams({ page: '1' });
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Loading */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block w-12 h-12 border-4 border-medical-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-gray-600 font-medium">Carregando posts...</p>
              </div>
            ) : !data?.posts || data.posts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4 text-lg">
                  Nenhum post encontrado
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <>
                {/* Grid de Posts - Redesenhado */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {data.posts.map((post: any) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-medical-300">
                        {/* Imagem */}
                        <div className="aspect-video overflow-hidden bg-gradient-to-br from-medical-100 to-medical-50 relative">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-16 h-16 text-medical-300" />
                            </div>
                          )}
                          {/* Tag de categoria sobre a imagem */}
                          {post.category && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-medical-500 hover:bg-medical-600 shadow-lg">
                                {post.category.name}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6">
                          {/* Título */}
                          <h2 className="text-xl font-bold mb-3 group-hover:text-medical-600 transition line-clamp-2 leading-tight">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Meta info */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              7 min
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {post.view_count}
                            </div>
                          </div>

                          {/* Botão Ler mais (aparece no hover) */}
                          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" className="w-full text-medical-600 hover:bg-medical-50">
                              Ler artigo completo
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Paginação */}
                {data.pages > 1 && (
                  <div className="flex justify-center gap-2 items-center">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => changePage(page - 1)}
                      className="hover:bg-medical-50 hover:border-medical-300"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(data.pages, 5) }, (_, i) => {
                        const p = i + 1;
                        return (
                          <Button
                            key={p}
                            variant={p === page ? 'default' : 'outline'}
                            onClick={() => changePage(p)}
                            size="sm"
                            className={p === page ? 'bg-medical-500 hover:bg-medical-600' : 'hover:bg-medical-50'}
                          >
                            {p}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      disabled={page === data.pages}
                      onClick={() => changePage(page + 1)}
                      className="hover:bg-medical-50 hover:border-medical-300"
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
