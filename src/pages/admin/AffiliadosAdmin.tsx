import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Instagram,
  Globe,
  MessageSquare,
  MoreVertical,
  ExternalLink,
  UserCheck,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  listarAfiliadosLeads,
  contarAfiliados,
  updateAfiliadoStatus,
  updateAfiliado,
  type AfiliadoLead,
} from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';

const AffiliadosAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [afiliados, setAfiliados] = useState<AfiliadoLead[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroCollab, setFiltroCollab] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [contadores, setContadores] = useState({
    total: 0,
    novos: 0,
    ativos: 0,
    inativos: 0,
    interesseCollab: 0,
    autorizaConteudo: 0,
  });

  // Modal de detalhes/edição
  const [selectedAfiliado, setSelectedAfiliado] = useState<AfiliadoLead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editNotas, setEditNotas] = useState('');
  const [editSiteUrl, setEditSiteUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [filtroStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [afiliadosData, contadoresData] = await Promise.all([
        listarAfiliadosLeads({
          status: filtroStatus === 'todos' ? undefined : filtroStatus,
        }),
        contarAfiliados(),
      ]);
      setAfiliados(afiliadosData);
      setContadores(contadoresData);
    } catch (error) {
      console.error('Erro ao carregar afiliados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar afiliados por busca e interesse em collab
  const afiliadosFiltrados = afiliados.filter((afiliado) => {
    // Filtro de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      const matchNome = afiliado.nome?.toLowerCase().includes(termoBusca);
      const matchEmail = afiliado.email?.toLowerCase().includes(termoBusca);
      const matchInstagram = afiliado.instagram?.toLowerCase().includes(termoBusca);
      if (!matchNome && !matchEmail && !matchInstagram) return false;
    }

    // Filtro de interesse em collab
    if (filtroCollab === 'com_collab' && !afiliado.interesse_collab) return false;
    if (filtroCollab === 'sem_collab' && afiliado.interesse_collab) return false;

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <UserPlus size={12} />
            Novo
          </span>
        );
      case 'contatado':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <MessageSquare size={12} />
            Contatado
          </span>
        );
      case 'ativo':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Ativo
          </span>
        );
      case 'inativo':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            <Ban size={12} />
            Inativo
          </span>
        );
      case 'site_criado':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Globe size={12} />
            Site Criado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const handleOpenDetails = (afiliado: AfiliadoLead) => {
    setSelectedAfiliado(afiliado);
    setEditNotas(afiliado.notas || '');
    setEditSiteUrl(afiliado.site_url || '');
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateAfiliadoStatus(id, newStatus);
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleSaveDetails = async () => {
    if (!selectedAfiliado) return;

    setIsSaving(true);
    try {
      await updateAfiliado(selectedAfiliado.id, {
        notas: editNotas,
        site_url: editSiteUrl || undefined,
        site_criado: !!editSiteUrl,
      });
      await loadData();
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsApp = (whatsapp: string, nome: string) => {
    const numero = whatsapp.replace(/\D/g, '');
    const mensagem = encodeURIComponent(
      `Olá ${nome}! Vi que você se cadastrou como afiliado na clinicanaweb.com. Gostaria de conversar sobre como podemos trabalhar juntos!`
    );
    window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank');
  };

  const handleInstagram = (instagram: string) => {
    const username = instagram.replace('@', '');
    window.open(`https://instagram.com/${username}`, '_blank');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Users className="text-medical-600" />
              Afiliados
            </h1>
            <p className="text-gray-600">
              Gerencie os leads de afiliados e acompanhe interessados em parceria
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Total</span>
          </div>
          <div className="text-2xl font-bold">{contadores.total}</div>
          <div className="text-xs opacity-90">Cadastros</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <UserPlus size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Novos</span>
          </div>
          <div className="text-2xl font-bold">{contadores.novos}</div>
          <div className="text-xs opacity-90">Para contatar</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">OK</span>
          </div>
          <div className="text-2xl font-bold">{contadores.ativos}</div>
          <div className="text-xs opacity-90">Ativos</div>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Ban size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Inativo</span>
          </div>
          <div className="text-2xl font-bold">{contadores.inativos}</div>
          <div className="text-xs opacity-90">Inativos</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Instagram size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Collab</span>
          </div>
          <div className="text-2xl font-bold">{contadores.interesseCollab}</div>
          <div className="text-xs opacity-90">Querem collab</div>
        </div>

        <div className="bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <UserCheck size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Auth</span>
          </div>
          <div className="text-2xl font-bold">{contadores.autorizaConteudo}</div>
          <div className="text-xs opacity-90">Autorizam uso</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <span className="font-medium text-gray-700">Filtros:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Buscar por nome, email ou Instagram..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="contatado">Contatado</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="site_criado">Site Criado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroCollab} onValueChange={setFiltroCollab}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Interesse Collab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="com_collab">Quer fazer collab</SelectItem>
              <SelectItem value="sem_collab">Sem interesse collab</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Afiliados */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Afiliado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Permissoes
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {afiliadosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhum afiliado encontrado</p>
                  </td>
                </tr>
              ) : (
                afiliadosFiltrados.map((afiliado) => (
                  <tr key={afiliado.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {afiliado.nome}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={12} />
                          {afiliado.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={12} />
                          {afiliado.whatsapp}
                        </div>
                        {afiliado.instagram && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Instagram size={12} />
                            {afiliado.instagram}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {afiliado.autoriza_uso_conteudo && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={10} />
                            Autoriza uso
                          </span>
                        )}
                        {afiliado.interesse_collab && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Instagram size={10} />
                            Quer collab
                          </span>
                        )}
                        {afiliado.site_criado && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <Globe size={10} />
                            Site gratis
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(afiliado.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {afiliado.created_at
                          ? format(parseISO(afiliado.created_at), "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(afiliado.whatsapp, afiliado.nome)}
                          className="flex items-center gap-1"
                          title="Enviar WhatsApp"
                        >
                          <Phone size={14} />
                        </Button>

                        {afiliado.instagram && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInstagram(afiliado.instagram!)}
                            className="flex items-center gap-1"
                            title="Ver Instagram"
                          >
                            <Instagram size={14} />
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDetails(afiliado)}>
                              <ExternalLink size={14} className="mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(afiliado.id, 'contatado')}>
                              <MessageSquare size={14} className="mr-2" />
                              Marcar como contatado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(afiliado.id, 'ativo')}>
                              <CheckCircle size={14} className="mr-2" />
                              Marcar como ativo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(afiliado.id, 'inativo')}>
                              <Ban size={14} className="mr-2" />
                              Marcar como inativo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(afiliado.id, 'site_criado')}>
                              <Globe size={14} className="mr-2" />
                              Site criado
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">Legenda:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            {getStatusBadge('novo')}
            <span className="text-gray-600">Cadastro recente, ainda nao contatado</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('contatado')}
            <span className="text-gray-600">Ja foi feito contato</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('ativo')}
            <span className="text-gray-600">Afiliado ativo fazendo divulgacao</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('site_criado')}
            <span className="text-gray-600">Recebeu site gratis</span>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users size={20} className="text-medical-600" />
              Detalhes do Afiliado
            </DialogTitle>
            <DialogDescription>
              Visualize e edite informacoes do afiliado
            </DialogDescription>
          </DialogHeader>

          {selectedAfiliado && (
            <div className="space-y-4 py-4">
              {/* Dados do afiliado */}
              <div className="space-y-2">
                <div className="font-semibold text-lg">{selectedAfiliado.nome}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  {selectedAfiliado.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  {selectedAfiliado.whatsapp}
                </div>
                {selectedAfiliado.instagram && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Instagram size={14} />
                    {selectedAfiliado.instagram}
                  </div>
                )}
              </div>

              {/* Permissoes */}
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="font-medium text-sm text-gray-700">Permissoes:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedAfiliado.autoriza_uso_conteudo ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} />
                      Autoriza uso de conteudo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      <XCircle size={12} />
                      Nao autoriza uso de conteudo
                    </span>
                  )}
                  {selectedAfiliado.interesse_collab ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      <CheckCircle size={12} />
                      Interesse em collab
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      <XCircle size={12} />
                      Sem interesse em collab
                    </span>
                  )}
                </div>
              </div>

              {/* UTM */}
              {(selectedAfiliado.utm_source || selectedAfiliado.utm_medium || selectedAfiliado.utm_campaign) && (
                <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                  <div className="font-medium text-sm text-blue-700">Origem do cadastro:</div>
                  <div className="text-xs text-blue-600 space-y-0.5">
                    {selectedAfiliado.utm_source && <div>Source: {selectedAfiliado.utm_source}</div>}
                    {selectedAfiliado.utm_medium && <div>Medium: {selectedAfiliado.utm_medium}</div>}
                    {selectedAfiliado.utm_campaign && <div>Campaign: {selectedAfiliado.utm_campaign}</div>}
                  </div>
                </div>
              )}

              {/* Site URL */}
              <div className="space-y-2">
                <label className="font-medium text-sm text-gray-700">
                  URL do Site Gratis:
                </label>
                <Input
                  placeholder="https://exemplo.sites-odonto.com.br"
                  value={editSiteUrl}
                  onChange={(e) => setEditSiteUrl(e.target.value)}
                />
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="font-medium text-sm text-gray-700">
                  Notas internas:
                </label>
                <Textarea
                  placeholder="Anotacoes sobre o afiliado..."
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Data de cadastro */}
              <div className="text-xs text-gray-500">
                Cadastrado em:{' '}
                {selectedAfiliado.created_at
                  ? format(parseISO(selectedAfiliado.created_at), "dd/MM/yyyy 'as' HH:mm", {
                      locale: ptBR,
                    })
                  : '-'}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDetails} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AffiliadosAdmin;
