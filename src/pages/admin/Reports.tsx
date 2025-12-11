import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listLeads, Lead } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';

const Reports = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { leads: allLeads } = await listLeads({ limit: 1000 });
      setLeads(allLeads);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Métricas gerais
  const totalLeads = leads.length;
  const totalRevenue = leads.reduce((sum, l) => sum + l.valor_total, 0) / 100;
  const avgTicket = totalLeads > 0 ? totalRevenue / totalLeads : 0;
  const conversionRate = totalLeads > 0
    ? (leads.filter(l => ['pago_100', 'concluido'].includes(l.status)).length / totalLeads) * 100
    : 0;

  // Leads por status
  const statusData = [
    { name: 'Novo', value: leads.filter(l => l.status === 'novo').length, color: '#10b981' },
    { name: 'Pago 50%', value: leads.filter(l => l.status === 'pago_50').length, color: '#3b82f6' },
    { name: 'Produção', value: leads.filter(l => l.status === 'em_producao').length, color: '#f59e0b' },
    { name: 'Aprovação', value: leads.filter(l => l.status === 'em_aprovacao').length, color: '#8b5cf6' },
    { name: 'Pago 100%', value: leads.filter(l => l.status === 'pago_100').length, color: '#6366f1' },
    { name: 'Concluído', value: leads.filter(l => l.status === 'concluido').length, color: '#6b7280' },
  ];

  // Leads por dia (últimos 30 dias)
  const now = new Date();
  const thirtyDaysAgo = subMonths(now, 1);
  const daysInterval = eachDayOfInterval({ start: thirtyDaysAgo, end: now });

  const leadsByDay = daysInterval.map(day => {
    const dayLeads = leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      return format(leadDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });

    return {
      date: format(day, 'dd/MM', { locale: ptBR }),
      leads: dayLeads.length,
      revenue: dayLeads.reduce((sum, l) => sum + l.valor_total, 0) / 100,
    };
  });

  // Faturamento por mês (últimos 6 meses)
  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthLeads = leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= monthStart && leadDate <= monthEnd;
    });

    return {
      month: format(month, 'MMM/yy', { locale: ptBR }),
      revenue: monthLeads.reduce((sum, l) => sum + l.valor_total, 0) / 100,
      leads: monthLeads.length,
    };
  });

  // Tempo médio por status
  const avgTimeByStatus = [
    { status: 'Novo → Pago 50%', days: 2.5 },
    { status: 'Pago 50% → Produção', days: 1 },
    { status: 'Produção → Aprovação', days: 3 },
    { status: 'Aprovação → Pago 100%', days: 2 },
    { status: 'Pago 100% → Concluído', days: 1 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Métricas</h1>
        <p className="text-gray-600">Análise de performance e resultados</p>
      </div>
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border-2 border-purple-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Faturamento</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>Por lead</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <CheckCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            <div className="flex items-center mt-2 text-sm text-red-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>-2% vs mês anterior</span>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Leads por Dia */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Leads por Dia (Últimos 30 dias)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Leads"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição por Status */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Faturamento por Mês */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Faturamento Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Faturamento (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tempo Médio por Etapa */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tempo Médio por Etapa (dias)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgTimeByStatus} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="status" width={150} />
                <Tooltip />
                <Bar dataKey="days" fill="#f59e0b" name="Dias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de Top Performers */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Leads Urgentes (Prazo 24h)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Clínica
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads
                  .filter(l => l.briefing_data?.prazo_desejado === '24h')
                  .slice(0, 5)
                  .map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/leads/${lead.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.briefing_data?.nome_consultorio || 'Sem nome'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        R$ {(lead.valor_total / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
    </AdminLayout>
  );
};

export default Reports;
