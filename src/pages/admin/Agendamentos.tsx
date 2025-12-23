import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  listarAgendamentos,
  updateAgendamentoStatus,
  type Agendamento,
} from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from '@/components/admin/AdminLayout';

const Agendamentos = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    loadAgendamentos();
  }, [filtroStatus]);

  const loadAgendamentos = async () => {
    setLoading(true);
    try {
      const data = await listarAgendamentos({
        status: filtroStatus || undefined,
      });
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'confirmado' | 'realizado' | 'cancelado'
  ) => {
    try {
      let motivo;
      if (newStatus === 'cancelado') {
        motivo = prompt('Motivo do cancelamento:');
        if (!motivo) return;
      }

      await updateAgendamentoStatus(id, newStatus, motivo);
      loadAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do agendamento');
    }
  };

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    const searchLower = busca.toLowerCase();
    return (
      ag.nome.toLowerCase().includes(searchLower) ||
      ag.email.toLowerCase().includes(searchLower) ||
      ag.whatsapp.includes(busca) ||
      (ag.empresa && ag.empresa.toLowerCase().includes(searchLower))
    );
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      agendado: 'bg-blue-100 text-blue-800',
      confirmado: 'bg-green-100 text-green-800',
      realizado: 'bg-medical-100 text-medical-800',
      cancelado: 'bg-red-100 text-red-800',
      remarcado: 'bg-orange-100 text-orange-800',
    };

    const labels = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      realizado: 'Realizado',
      cancelado: 'Cancelado',
      remarcado: 'Remarcado',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      comercial: 'Comercial',
      alinhamento: 'Alinhamento',
      aprovacao: 'Aprovação',
      suporte: 'Suporte',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  // Estatísticas
  const stats = {
    total: agendamentos.length,
    agendados: agendamentos.filter((a) => a.status === 'agendado').length,
    confirmados: agendamentos.filter((a) => a.status === 'confirmado').length,
    realizados: agendamentos.filter((a) => a.status === 'realizado').length,
    cancelados: agendamentos.filter((a) => a.status === 'cancelado').length,
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Agendamentos de Reuniões
        </h1>
        <p className="text-gray-600">Gerencie todas as reuniões agendadas</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
            <h3 className="text-blue-600 text-sm font-semibold mb-1">Agendados</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.agendados}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
            <h3 className="text-green-600 text-sm font-semibold mb-1">Confirmados</h3>
            <p className="text-3xl font-bold text-green-600">{stats.confirmados}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-medical-400">
            <h3 className="text-medical-600 text-sm font-semibold mb-1">Realizados</h3>
            <p className="text-3xl font-bold text-medical-600">{stats.realizados}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-400">
            <h3 className="text-red-600 text-sm font-semibold mb-1">Cancelados</h3>
            <p className="text-3xl font-bold text-red-600">{stats.cancelados}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              >
                <option value="">Todos os status</option>
                <option value="agendado">Agendados</option>
                <option value="confirmado">Confirmados</option>
                <option value="realizado">Realizados</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agendamentos List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando agendamentos...</p>
          </div>
        ) : agendamentosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">
              {busca || filtroStatus
                ? 'Nenhum agendamento encontrado com esses filtros'
                : 'Nenhum agendamento ainda'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentosFiltrados.map((agendamento) => (
              <div
                key={agendamento.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {agendamento.nome}
                      </h3>
                      {getStatusBadge(agendamento.status)}
                      <span className="px-3 py-1 bg-medical-50 text-medical-700 rounded-full text-xs font-semibold">
                        {getTipoLabel(agendamento.tipo)}
                      </span>
                    </div>

                    {agendamento.empresa && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building2 size={16} />
                        <span>{agendamento.empresa}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{agendamento.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{agendamento.whatsapp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {format(new Date(agendamento.data), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                        <Clock size={16} className="ml-2" />
                        <span>{agendamento.horario.substring(0, 5)}</span>
                      </div>
                    </div>

                    {agendamento.observacoes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Observações:</strong> {agendamento.observacoes}
                        </p>
                      </div>
                    )}

                    {agendamento.motivo_cancelamento && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Motivo do cancelamento:</strong>{' '}
                          {agendamento.motivo_cancelamento}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {/* WhatsApp Button - Always visible */}
                    <Button
                      size="sm"
                      onClick={() => {
                        const phone = agendamento.whatsapp.replace(/\D/g, '');
                        const message = encodeURIComponent(
                          `Olá ${agendamento.nome}! Confirmando sua reunião ${getTipoLabel(agendamento.tipo).toLowerCase()} para ${format(new Date(agendamento.data), "dd/MM/yyyy")} às ${agendamento.horario.substring(0, 5)}.`
                        );
                        window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
                      }}
                      className="gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Phone size={16} />
                      WhatsApp
                    </Button>

                    {agendamento.status === 'agendado' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(agendamento.id, 'confirmado')}
                          className="gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle size={16} />
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                        className="gap-2"
                      >
                        <XCircle size={16} />
                        Cancelar
                      </Button>
                      </>
                    )}

                    {agendamento.status === 'confirmado' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(agendamento.id, 'realizado')}
                        className="gap-2 bg-medical-600 hover:bg-medical-700"
                      >
                        <CheckCircle size={16} />
                        Realizado
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
                  Criado em:{' '}
                  {format(new Date(agendamento.created_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
    </AdminLayout>
  );
};

export default Agendamentos;
