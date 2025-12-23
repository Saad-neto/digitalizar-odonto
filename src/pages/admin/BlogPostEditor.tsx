import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  listCategories,
  listTags,
  createTag,
  uploadBlogImage,
} from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/blog/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Loader2,
} from 'lucide-react';

export default function BlogPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<any>(null);
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Carregar post existente
  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => getBlogPostById(id!),
    enabled: isEditing,
  });

  // Carregar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: listCategories,
  });

  // Carregar tags
  const { data: tags = [], refetch: refetchTags } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: listTags,
  });

  // Preencher formulário ao carregar post
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || '');
      setContent(post.content);
      setFeaturedImage(post.featured_image || '');
      setMetaTitle(post.meta_title || '');
      setMetaDescription(post.meta_description || '');
      setCategoryId(post.category_id || '');
      setAuthorName(post.author_name);
      setStatus(post.status);

      if (post.tags && Array.isArray(post.tags)) {
        const tagIds = post.tags.map((t: any) => t.tag?.id).filter(Boolean);
        setSelectedTags(tagIds);
      }
    }
  }, [post]);

  // Auto-gerar slug a partir do título
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing || slug === '') {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  // Upload de imagem destacada
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { url } = await uploadBlogImage(file, id);
      setFeaturedImage(url);
      toast({
        title: 'Imagem enviada',
        description: 'A imagem de capa foi carregada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar a imagem.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Criar nova tag
  const handleCreateTag = async () => {
    if (!newTagInput.trim()) return;

    const tagSlug = newTagInput
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      const newTag = await createTag({
        name: newTagInput.trim(),
        slug: tagSlug,
      });
      setSelectedTags([...selectedTags, newTag.id]);
      setNewTagInput('');
      refetchTags();
      toast({
        title: 'Tag criada',
        description: `A tag "${newTag.name}" foi adicionada.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar tag',
        description: 'Não foi possível criar a tag.',
        variant: 'destructive',
      });
    }
  };

  // Salvar post
  const saveMutation = useMutation({
    mutationFn: async (publishNow: boolean) => {
      const finalStatus = publishNow ? 'published' : status;

      const postData = {
        title,
        slug,
        excerpt: excerpt || undefined,
        content,
        featured_image: featuredImage || undefined,
        meta_title: metaTitle || undefined,
        meta_description: metaDescription || undefined,
        category_id: categoryId || undefined,
        author_name: authorName || 'Admin',
        status: finalStatus,
      };

      if (isEditing) {
        return updateBlogPost(id!, postData, selectedTags);
      } else {
        return createBlogPost(postData, selectedTags);
      }
    },
    onSuccess: (data, publishNow) => {
      toast({
        title: publishNow ? 'Post publicado' : 'Post salvo',
        description: publishNow
          ? 'O post foi publicado com sucesso.'
          : 'Suas alterações foram salvas.',
      });
      navigate('/admin/blog');
    },
    onError: () => {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o post.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => saveMutation.mutate(false);
  const handlePublish = () => saveMutation.mutate(true);

  if (loadingPost) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editar Post' : 'Novo Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Faça alterações no seu post' : 'Crie um novo artigo'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={handlePublish} disabled={saveMutation.isPending}>
            <Eye className="w-4 h-4 mr-2" />
            Publicar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Aba: Conteúdo */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Título */}
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do post"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  placeholder="titulo-do-post"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  URL: /blog/{slug || 'titulo-do-post'}
                </p>
              </div>

              {/* Resumo */}
              <div>
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Breve descrição do post (aparece na listagem)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Editor de Conteúdo */}
              <div>
                <Label>Conteúdo do Artigo *</Label>
                <div className="mt-2">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    postId={id}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imagem Destacada */}
          <Card>
            <CardHeader>
              <CardTitle>Imagem de Capa</CardTitle>
            </CardHeader>
            <CardContent>
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Imagem de capa"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFeaturedImage('')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Clique para enviar uma imagem
                      </span>
                    </>
                  )}
                </label>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: SEO */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Otimização para Mecanismos de Busca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Título</Label>
                <Input
                  id="metaTitle"
                  placeholder="Título para SEO (deixe vazio para usar o título do post)"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaTitle.length}/60 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Descrição</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Descrição para SEO"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaDescription.length}/160 caracteres
                </p>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Preview do Google:
                </p>
                <div className="text-blue-600 text-lg">
                  {metaTitle || title || 'Título do Post'}
                </div>
                <div className="text-green-700 text-sm">
                  https://digitalizarodonto.com/blog/{slug || 'slug'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {metaDescription || excerpt || 'Descrição do post...'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categorização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Categoria */}
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find((t: any) => t.id === tagId);
                    return tag ? (
                      <Badge key={tagId} variant="secondary">
                        {tag.name}
                        <button
                          className="ml-1 hover:text-destructive"
                          onClick={() =>
                            setSelectedTags(selectedTags.filter((id) => id !== tagId))
                          }
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (!selectedTags.includes(value)) {
                      setSelectedTags([...selectedTags, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar tag existente" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter((tag: any) => !selectedTags.includes(tag.id))
                      .map((tag: any) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Criar nova tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCreateTag}
                    disabled={!newTagInput.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Autor */}
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  placeholder="Nome do autor"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v: any) => setStatus(v)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
