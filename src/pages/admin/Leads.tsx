import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, listLeads, Lead } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Home,
  LogOut,
  Search,
  Eye,
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  Filter,
  LayoutGrid,
  List,
  Download,
  BarChart3,
} from 'lucide-react';
import KanbanBoard from '@/components/admin/KanbanBoard';
import AdminLayout from '@/components/admin/AdminLayout';
import Papa from 'papaparse';

type ViewMode = 'list' | 'kanban';
type DateFilter = 'all' | 'today' | 'week' | 'month';

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [metrics, setMetrics] = useState({
    novos: 0,
    producao: 0,
    prontos: 0,
    total: 0
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const { leads: allLeads } = await listLeads({ limit: 1000 });
      setLeads(allLeads);

      // Calcular métricas
      const novos = allLeads.filter(l => l.status === 'novo').length;
      const producao = allLeads.filter(l => ['em_producao', 'em_ajustes'].includes(l.status)).length;
      const prontos = allLeads.filter(l => ['aguardando_aprovacao', 'aprovacao_final', 'no_ar', 'concluido'].includes(l.status)).length;
      const total = allLeads.reduce((sum, l) => sum + (l.valor_total / 100), 0);

      setMetrics({ novos, producao, prontos, total });
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const exportToCSV = () => {
    const data = filteredLeads.map(lead => ({
      'ID': lead.id.substring(0, 8),
      'Data Criação': new Date(lead.created_at).toLocaleString('pt-BR'),
      'Clínica': lead.briefing_data?.nome_consultorio || '',
      'Profissional': lead.nome,
      'Email': lead.email,
      'WhatsApp': lead.whatsapp,
      'Status': lead.status,
      'Valor': (lead.valor_total / 100).toFixed(2),
      'Prazo': lead.briefing_data?.prazo_desejado || '',
      'Estilo': lead.briefing_data?.estilo_site || '',
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Notificação
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = '✅ CSV exportado com sucesso!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const getStatusBadge = (status: Lead['status']) => {
    const badges = {
      novo: { color: 'bg-green-100 text-green-800 border-green-200', icon: '🆕', label: 'Novo' },
      em_producao: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🔨', label: 'Em Produção' },
      aguardando_aprovacao: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '👀', label: 'Aguardando Aprovação' },
      aprovado_pagamento: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '💰', label: 'Aprovado e Pago' },
      em_ajustes: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🔧', label: 'Em Ajustes' },
      aprovacao_final: { color: 'bg-pink-100 text-pink-800 border-pink-200', icon: '✨', label: 'Aprovação Final' },
      no_ar: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '🚀', label: 'No Ar' },
      concluido: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '✅', label: 'Concluído' },
    };
    const badge = badges[status] || badges.novo;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${badge.color}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Há menos de 1 hora';
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Há 1 dia';
    if (diffDays < 7) return `Há ${diffDays} dias`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isWithinDateRange = (leadDate: string, filter: DateFilter): boolean => {
    if (filter === 'all') return true;

    const date = new Date(leadDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    switch (filter) {
      case 'today':
        return diffDays === 0;
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      default:
        return true;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      lead.briefing_data?.nome_consultorio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesDate = isWithinDateRange(lead.created_at, dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <AdminLayout>
      {/* Header do Leads */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Leads</h1>
        <p className="text-gray-600">Kanban de produção de sites</p>
      </div>
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.novos}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produção</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.producao}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prontos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metrics.prontos}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mês</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  R$ {metrics.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Primeira linha: Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone ou clínica..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all"
              />
            </div>

            {/* Segunda linha: Filtros e ações */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all bg-white text-sm"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="novo">Novo</option>
                    <option value="pago_50">Pago 50%</option>
                    <option value="em_producao">Em Produção</option>
                    <option value="em_aprovacao">Em Aprovação</option>
                    <option value="pago_100">Pago 100%</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all bg-white text-sm"
                  >
                    <option value="all">Todas as Datas</option>
                    <option value="today">Hoje</option>
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                  </select>
                </div>
              </div>

              {/* View Toggle e Export */}
              <div className="flex gap-2">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>

                <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    title="Visualização em Lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'kanban'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    title="Visualização Kanban"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo - Lista ou Kanban */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border-2 border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border-2 border-gray-200">
            <p className="text-gray-500">Nenhum lead encontrado</p>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            leads={filteredLeads}
            onLeadClick={(id) => navigate(`/admin/leads/${id}`)}
            onRefresh={loadLeads}
          />
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                Leads Recentes ({filteredLeads.length})
              </h2>
            </div>

            <div className="divide-y-2 divide-gray-100">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(lead.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lead.briefing_data?.nome_consultorio || 'Sem nome'}
                        </h3>
                        {lead.briefing_data?.prazo_desejado === '24h' && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                            ⚠️ URGENTE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👤 {lead.nome}</span>
                        <span>📧 {lead.email}</span>
                        <span>📱 {lead.whatsapp}</span>
                        <span className="text-gray-400">• {formatDate(lead.created_at)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default Leads;
