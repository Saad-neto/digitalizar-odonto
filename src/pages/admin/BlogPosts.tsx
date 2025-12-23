import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAllBlogPosts, deleteBlogPost } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function BlogPosts() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-blog-posts', currentTab],
    queryFn: () =>
      listAllBlogPosts({
        status: currentTab === 'all' ? undefined : currentTab,
      }),
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) return;

    try {
      await deleteBlogPost(id);
      toast({
        title: 'Post deletado',
        description: 'O post foi removido com sucesso.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Erro ao deletar',
        description: 'Não foi possível remover o post.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline',
    };
    const labels: Record<string, string> = {
      published: 'Publicado',
      draft: 'Rascunho',
      archived: 'Arquivado',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Posts do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie os artigos do seu blog
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Link>
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={(v: any) => setCurrentTab(v)}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="published">Publicados</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="archived">Arquivados</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">Carregando...</div>
          ) : !data?.posts || data.posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum post encontrado</p>
              <Button asChild variant="outline">
                <Link to="/admin/blog/novo">Criar primeiro post</Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.posts.map((post: any) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          {post.excerpt && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {post.excerpt}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.category ? (
                          <Badge variant="outline">{post.category.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          {post.view_count}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.published_at
                          ? formatDate(post.published_at)
                          : formatDate(post.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/blog/editar/${post.id}`}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            {post.status === 'published' && (
                              <DropdownMenuItem asChild>
                                <Link to={`/blog/${post.slug}`} target="_blank">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizar
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(post.id, post.title)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
