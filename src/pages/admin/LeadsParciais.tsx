import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, listLeads, Lead } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Search,
  Eye,
  Users,
  Clock,
  Download,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Papa from 'papaparse';

type DateFilter = 'all' | 'today' | 'week' | 'month';

const LeadsParciais = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [metrics, setMetrics] = useState({
    total: 0,
    hoje: 0,
    semana: 0,
    taxa_conversao: 0
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const { leads: allLeads } = await listLeads({ limit: 1000 });

      // Filtrar apenas leads parciais
      const leadsParciais = allLeads.filter(l => l.status === 'lead_parcial');
      setLeads(leadsParciais);

      // Calcular métricas
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const hoje = leadsParciais.filter(l => new Date(l.created_at) >= todayStart).length;
      const semana = leadsParciais.filter(l => new Date(l.created_at) >= weekStart).length;

      // Taxa de conversão: leads convertidos / total de leads parciais criados
      const convertidos = allLeads.filter((l: any) => l.origem === 'convertido_de_lead').length;
      const totalLeadsParciais = leadsParciais.length + convertidos;
      const taxa_conversao = totalLeadsParciais > 0 ? (convertidos / totalLeadsParciais) * 100 : 0;

      setMetrics({
        total: leadsParciais.length,
        hoje,
        semana,
        taxa_conversao
      });
    } catch (error) {
      console.error('Erro ao carregar leads parciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const data = filteredLeads.map(lead => ({
      'ID': lead.id.substring(0, 8),
      'Data Captura': new Date(lead.created_at).toLocaleString('pt-BR'),
      'Clínica': lead.briefing_data?.nome_consultorio || '',
      'Profissional': lead.nome,
      'Email': lead.email,
      'WhatsApp': lead.whatsapp,
      'Tempo Desde Captura': getTimeSinceCapture(lead.created_at),
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-parciais-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Notificação
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = '✅ CSV de leads exportado com sucesso!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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

  const getTimeSinceCapture = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '<1h';
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const getPriorityBadge = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">🔥 Quente</span>;
    } else if (diffHours < 24) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">⚡ Urgente</span>;
    } else if (diffHours < 72) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">⏰ Atenção</span>;
    } else {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">❄️ Frio</span>;
    }
  };

  const isWithinDateRange = (leadDate: string, filter: DateFilter): boolean => {
    if (filter === 'all') return true;

    const date = new Date(leadDate);
    const now = new Date();

    switch (filter) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      default:
        return true;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      (lead.briefing_data?.nome_consultorio || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = isWithinDateRange(lead.created_at, dateFilter);

    return matchesSearch && matchesDate;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-medical-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-medical-600" />
                Leads (Página 1 Apenas)
              </h1>
              <p className="text-gray-600 mt-1">
                Usuários que preencheram apenas a primeira página do briefing
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total de Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
                </div>
                <Users className="w-10 h-10 text-medical-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Hoje</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.hoje}</p>
                </div>
                <Clock className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Últimos 7 dias</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.semana}</p>
                </div>
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-purple-600">{metrics.taxa_conversao.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Filtros e Ações */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Busca */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, email, whatsapp ou clínica..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>

              {/* Filtros de Data */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    dateFilter === 'all'
                      ? 'bg-medical-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setDateFilter('today')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    dateFilter === 'today'
                      ? 'bg-medical-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => setDateFilter('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    dateFilter === 'week'
                      ? 'bg-medical-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  7 Dias
                </button>
                <button
                  onClick={() => setDateFilter('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    dateFilter === 'month'
                      ? 'bg-medical-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  30 Dias
                </button>
              </div>

              {/* Botão de Exportar */}
              <Button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Download className="w-5 h-5" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Lista de Leads */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-medical-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Carregando leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900">Nenhum lead encontrado</p>
                <p className="text-gray-600 mt-2">
                  {searchTerm || dateFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Quando alguém preencher a página 1 do briefing, aparecerá aqui'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Prioridade</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Tempo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Clínica</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Profissional</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Contato</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Data Captura</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          {getPriorityBadge(lead.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {getTimeSinceCapture(lead.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {lead.briefing_data?.nome_consultorio || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{lead.nome}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <div>{lead.email}</div>
                            <div className="text-gray-500">{lead.whatsapp}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{formatDate(lead.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Rodapé com Dicas */}
          <div className="bg-medical-50 border-2 border-medical-200 rounded-xl p-6">
            <h3 className="font-semibold text-medical-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Dicas de Remarketing
            </h3>
            <ul className="space-y-2 text-sm text-medical-800">
              <li className="flex items-start gap-2">
                <span className="text-medical-600">🔥</span>
                <span><strong>Leads Quentes (&lt;1h):</strong> Contate imediatamente! Alta chance de conversão.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">⚡</span>
                <span><strong>Urgentes (1-24h):</strong> Envie WhatsApp personalizado ou e-mail com oferta especial.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">⏰</span>
                <span><strong>Atenção (1-3 dias):</strong> Configure automação de e-mail marketing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600">❄️</span>
                <span><strong>Frios (&gt;3 dias):</strong> Inclua em campanhas de retargeting no Facebook/Instagram.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LeadsParciais;
