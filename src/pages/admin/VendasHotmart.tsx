import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  listarVendasHotmart,
  contarVendasHotmart,
  type HotmartVenda,
} from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';

const VendasHotmart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<HotmartVenda[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPlano, setFiltroPlano] = useState<string>('todos');
  const [filtroBriefing, setFiltroBriefing] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [contadores, setContadores] = useState({
    total: 0,
    aprovados: 0,
    pendentes: 0,
    cancelados: 0,
    comBriefing: 0,
    semBriefing: 0,
  });

  useEffect(() => {
    loadData();
  }, [filtroStatus, filtroPlano]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vendasData, contadoresData] = await Promise.all([
        listarVendasHotmart({
          status: filtroStatus,
          plano: filtroPlano,
        }),
        contarVendasHotmart(),
      ]);
      setVendas(vendasData);
      setContadores(contadoresData);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vendas por busca e status do briefing
  const vendasFiltradas = vendas.filter((venda) => {
    // Filtro de busca
    if (busca) {
      const termoBusca = busca.toLowerCase();
      const matchNome = venda.cliente_nome?.toLowerCase().includes(termoBusca);
      const matchEmail = venda.cliente_email?.toLowerCase().includes(termoBusca);
      const matchTransaction = venda.transaction_id?.toLowerCase().includes(termoBusca);
      if (!matchNome && !matchEmail && !matchTransaction) return false;
    }

    // Filtro de status do briefing
    if (filtroBriefing === 'com_briefing' && !venda.lead_id) return false;
    if (filtroBriefing === 'sem_briefing' && venda.lead_id) return false;

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Aprovado
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Pendente
          </span>
        );
      case 'cancelado':
      case 'reembolsado':
      case 'chargeback':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle size={12} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
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

  const getBriefingBadge = (leadId: string | null) => {
    if (leadId) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <FileText size={12} />
          Briefing completo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
        <Clock size={12} />
        Aguardando briefing
      </span>
    );
  };

  const getPlanoBadge = (plano: string) => {
    if (plano === 'site_blog') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
          Site + Blog
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-medical-100 text-medical-800">
        Site
      </span>
    );
  };

  const handleEnviarLinkBriefing = (email: string) => {
    const linkBriefing = `https://sites-odonto.digitalizarmkt.com.br/briefing?source=hotmart&email=${encodeURIComponent(email)}`;
    const mensagem = encodeURIComponent(
      `Olá! Seu pagamento foi confirmado. Complete seu briefing para iniciarmos a criação do seu site: ${linkBriefing}`
    );
    window.open(`https://wa.me/55${email}?text=${mensagem}`, '_blank');
  };

  const handleCopiarLink = (email: string) => {
    const linkBriefing = `https://sites-odonto.digitalizarmkt.com.br/briefing?source=hotmart&email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(linkBriefing);
    alert('Link copiado para a área de transferência!');
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
              <ShoppingCart className="text-medical-600" />
              Vendas Hotmart
            </h1>
            <p className="text-gray-600">
              Gerencie as vendas recebidas pelo Hotmart e acompanhe o status dos briefings
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
            <ShoppingCart size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Total</span>
          </div>
          <div className="text-2xl font-bold">{contadores.total}</div>
          <div className="text-xs opacity-90">Vendas totais</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">OK</span>
          </div>
          <div className="text-2xl font-bold">{contadores.aprovados}</div>
          <div className="text-xs opacity-90">Aprovadas</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Pend</span>
          </div>
          <div className="text-2xl font-bold">{contadores.pendentes}</div>
          <div className="text-xs opacity-90">Pendentes</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <XCircle size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Canc</span>
          </div>
          <div className="text-2xl font-bold">{contadores.cancelados}</div>
          <div className="text-xs opacity-90">Canceladas</div>
        </div>

        <div className="bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FileText size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Brief</span>
          </div>
          <div className="text-2xl font-bold">{contadores.comBriefing}</div>
          <div className="text-xs opacity-90">Com briefing</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={20} className="opacity-80" />
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">Agrd</span>
          </div>
          <div className="text-2xl font-bold">{contadores.semBriefing}</div>
          <div className="text-xs opacity-90">Aguardando briefing</div>
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
                placeholder="Buscar por nome, email ou transação..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos status</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="reembolsado">Reembolsado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroPlano} onValueChange={setFiltroPlano}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos planos</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="site_blog">Site + Blog</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroBriefing} onValueChange={setFiltroBriefing}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Briefing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="com_briefing">Com briefing</SelectItem>
              <SelectItem value="sem_briefing">Sem briefing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Briefing
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Nenhuma venda encontrada</p>
                  </td>
                </tr>
              ) : (
                vendasFiltradas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {venda.cliente_nome}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={12} />
                          {venda.cliente_email}
                        </div>
                        {venda.cliente_telefone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone size={12} />
                            {venda.cliente_telefone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getPlanoBadge(venda.plano)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        R$ {venda.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      {venda.pagamento_parcelas > 1 && (
                        <div className="text-xs text-gray-500">
                          {venda.pagamento_parcelas}x
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(venda.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getBriefingBadge(venda.lead_id)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {venda.created_at
                          ? format(parseISO(venda.created_at), "dd/MM/yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {venda.lead_id ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/lead/${venda.lead_id}`)}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Ver Lead
                          </Button>
                        ) : venda.status === 'aprovado' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopiarLink(venda.cliente_email)}
                              className="flex items-center gap-1"
                              title="Copiar link do briefing"
                            >
                              <FileText size={14} />
                              Link
                            </Button>
                          </>
                        ) : null}
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
            {getStatusBadge('aprovado')}
            <span className="text-gray-600">Pagamento confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge('pendente')}
            <span className="text-gray-600">Aguardando pagamento (boleto)</span>
          </div>
          <div className="flex items-center gap-2">
            {getBriefingBadge(null)}
            <span className="text-gray-600">Cliente precisa preencher briefing</span>
          </div>
          <div className="flex items-center gap-2">
            {getBriefingBadge('xxx')}
            <span className="text-gray-600">Briefing já preenchido</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default VendasHotmart;
