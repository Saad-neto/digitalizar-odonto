import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { listBlogPosts, listCategories } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Search, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const categorySlug = searchParams.get('categoria') || undefined;
  const [searchQuery, setSearchQuery] = useState('');

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

  const selectedCategory = categories.find((c: any) => c.slug === categorySlug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Dicas, tendências e insights sobre marketing digital, gestão de
            clínicas odontológicas e tecnologia
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Busca */}
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Categorias</h3>
                <div className="space-y-2">
                  {categorySlug && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={clearFilters}
                    >
                      Ver todos
                    </Button>
                  )}
                  {categories.map((category: any) => (
                    <Button
                      key={category.id}
                      variant={categorySlug === category.slug ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filtro ativo */}
            {(selectedCategory || searchQuery) && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">Filtrado por:</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory.name}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={clearFilters}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    "{searchQuery}"
                    <button
                      className="ml-1 hover:text-destructive"
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
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="mt-4 text-muted-foreground">Carregando posts...</p>
              </div>
            ) : !data?.posts || data.posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhum post encontrado
                </p>
                <Button onClick={clearFilters}>Limpar filtros</Button>
              </div>
            ) : (
              <>
                {/* Grid de Posts */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {data.posts.map((post: any) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-lg transition">
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        )}
                        <CardContent className="p-5">
                          {post.category && (
                            <Badge variant="secondary" className="mb-2">
                              {post.category.name}
                            </Badge>
                          )}
                          <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition line-clamp-2">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.view_count}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Paginação */}
                {data.pages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => changePage(page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: data.pages }, (_, i) => i + 1).map(
                        (p) => (
                          <Button
                            key={p}
                            variant={p === page ? 'default' : 'outline'}
                            onClick={() => changePage(p)}
                            size="sm"
                          >
                            {p}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      disabled={page === data.pages}
                      onClick={() => changePage(page + 1)}
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
