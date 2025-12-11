import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listLeads, listarAgendamentos, type Lead, type Agendamento } from '@/lib/supabase';
import { format, isToday, isThisWeek, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsData, agendamentosData] = await Promise.all([
        listLeads({ limit: 1000 }),
        listarAgendamentos({}),
      ]);
      setLeads(leadsData.leads);
      setAgendamentos(agendamentosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Métricas de Leads
  const leadsNovos = leads.filter((l) => l.status === 'novo').length;
  const leadsProducao = leads.filter((l) =>
    ['em_producao', 'em_ajustes'].includes(l.status)
  ).length;
  const leadsAguardando = leads.filter((l) =>
    ['aguardando_aprovacao', 'aprovacao_final'].includes(l.status)
  ).length;
  const valorTotal = leads.reduce((sum, l) => sum + l.valor_total / 100, 0);

  // Métricas de Agendamentos
  const agendamentosHoje = agendamentos.filter((a) =>
    isToday(parseISO(a.data))
  );
  const agendamentosSemana = agendamentos.filter((a) =>
    isThisWeek(parseISO(a.data), { locale: ptBR })
  );
  const agendamentosPendentes = agendamentos.filter(
    (a) => a.status === 'agendado'
  ).length;
  const agendamentosConfirmados = agendamentos.filter(
    (a) => a.status === 'confirmado'
  ).length;

  // Próximas reuniões (hoje + próximos 3 dias)
  const proximasReunioes = agendamentos
    .filter((a) => ['agendado', 'confirmado'].includes(a.status))
    .sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.horario}`);
      const dateB = new Date(`${b.data}T${b.horario}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo ao Painel Administrativo
        </h1>
        <p className="text-gray-600">
          Visão geral de leads e agendamentos
        </p>
      </div>

      {/* Stats Cards - Leads */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">📊 Leads em Produção</h2>
          <Button
            onClick={() => navigate('/admin/leads')}
            variant="outline"
            className="text-purple-600 hover:text-purple-700"
          >
            Ver todos os leads
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users size={24} className="opacity-80" />
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
                Novos
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{leadsNovos}</div>
            <div className="text-sm opacity-90">Leads novos</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock size={24} className="opacity-80" />
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
                Produção
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{leadsProducao}</div>
            <div className="text-sm opacity-90">Em produção/ajustes</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle size={24} className="opacity-80" />
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
                Aguardando
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{leadsAguardando}</div>
            <div className="text-sm opacity-90">Aguardando aprovação</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign size={24} className="opacity-80" />
              <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
                Total
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-sm opacity-90">Valor total</div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Agendamentos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">📅 Agendamentos</h2>
          <Button
            onClick={() => navigate('/admin/agendamentos')}
            variant="outline"
            className="text-purple-600 hover:text-purple-700"
          >
            Ver todos os agendamentos
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-gray-600">Hoje</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {agendamentosHoje.length}
            </div>
            <div className="text-sm text-gray-500">Reuniões hoje</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 rounded-lg p-2">
                <Calendar size={24} className="text-green-600" />
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Esta Semana
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {agendamentosSemana.length}
            </div>
            <div className="text-sm text-gray-500">Reuniões esta semana</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 rounded-lg p-2">
                <Clock size={24} className="text-orange-600" />
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Pendentes
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {agendamentosPendentes}
            </div>
            <div className="text-sm text-gray-500">A confirmar</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 rounded-lg p-2">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Confirmados
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {agendamentosConfirmados}
            </div>
            <div className="text-sm text-gray-500">Confirmados</div>
          </div>
        </div>
      </div>

      {/* Próximas Reuniões */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="text-purple-600" size={24} />
          Próximas Reuniões
        </h2>

        {proximasReunioes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma reunião agendada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proximasReunioes.map((agendamento) => {
              const dataFormatada = format(
                parseISO(agendamento.data),
                "dd 'de' MMMM",
                { locale: ptBR }
              );
              const hoje = isToday(parseISO(agendamento.data));

              return (
                <div
                  key={agendamento.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    hoje
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                        hoje
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-semibold opacity-80">
                        {format(parseISO(agendamento.data), 'MMM', {
                          locale: ptBR,
                        }).toUpperCase()}
                      </div>
                      <div className="text-2xl font-bold">
                        {format(parseISO(agendamento.data), 'dd')}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
                          {agendamento.nome}
                        </h3>
                        {hoje && (
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            Hoje
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {agendamento.horario.substring(0, 5)}
                        </span>
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {agendamento.tipo}
                        </span>
                        {agendamento.empresa && (
                          <span className="text-gray-500">
                            {agendamento.empresa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        agendamento.status === 'confirmado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {agendamento.status === 'confirmado'
                        ? 'Confirmado'
                        : 'Agendado'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('/admin/agendamentos')}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardOverview;
