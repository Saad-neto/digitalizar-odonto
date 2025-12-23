import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTags, createTag, updateTag, deleteTag } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BlogTags() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: listTags,
  });

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      toast({ title: 'Tag criada com sucesso' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erro ao criar tag', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      updateTag(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      toast({ title: 'Tag atualizada' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar tag', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-tags'] });
      toast({ title: 'Tag deletada' });
    },
    onError: () => {
      toast({ title: 'Erro ao deletar tag', variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '' });
    setEditingTag(null);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, name }));
    if (!editingTag) {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deletar a tag "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tags do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie as tags dos seus posts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? 'Editar Tag' : 'Nova Tag'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="Ex: Marketing Digital"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="marketing-digital"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma tag criada</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            Criar primeira tag
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag: any) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Badge variant="secondary">{tag.name}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tag.slug}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(tag)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(tag.id, tag.name)}
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
    </div>
  );
}
