import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeadById, updateLeadStatus, Lead } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Phone,
  Copy,
  Check,
  MessageCircle,
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import ReviewStep from '@/components/ReviewStep';

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'resumo' | 'briefing' | 'timeline'>('resumo');

  useEffect(() => {
    if (id) {
      loadLead();
    }
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const data = await getLeadById(id!);
      setLead(data);
    } catch (error) {
      console.error('Erro ao carregar lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Lead['status']) => {
    if (!lead) return;

    try {
      setUpdating(true);
      const updatedLead = await updateLeadStatus(lead.id, newStatus);
      setLead(updatedLead);
      alert('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getStatusBadge = (status: Lead['status']) => {
    const badges = {
      novo: { color: 'bg-green-100 text-green-800 border-green-300', icon: '🆕', label: 'Novo' },
      pago_50: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '💰', label: 'Pago 50%' },
      em_producao: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🔨', label: 'Em Produção' },
      em_aprovacao: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '👀', label: 'Em Aprovação' },
      pago_100: { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: '💯', label: 'Pago 100%' },
      concluido: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '✅', label: 'Concluído' },
    };
    const badge = badges[status] || badges.novo;
    return (
      <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${badge.color}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead não encontrado</h2>
          <Button onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {lead.briefing_data?.nome_consultorio || 'Sem nome'}
                </h1>
                <p className="text-sm text-gray-500">Lead ID: {lead.id.substring(0, 8)}...</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(lead.status)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alterar Status */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Alterar Status
          </h3>
          <div className="flex flex-wrap gap-3">
            {(['novo', 'pago_50', 'em_producao', 'em_aprovacao', 'pago_100', 'concluido'] as Lead['status'][]).map((status) => (
              <Button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating || lead.status === status}
                variant={lead.status === status ? 'default' : 'outline'}
                className={`${
                  lead.status === status
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-purple-50 hover:border-purple-400'
                }`}
              >
                {getStatusBadge(status)}
              </Button>
            ))}
          </div>
        </div>

        {/* Contato Rápido */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Contato Rápido</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="font-mono">{lead.whatsapp}</span>
              </div>
              <Button
                onClick={() => openWhatsApp(lead.whatsapp)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={() => copyToClipboard(lead.whatsapp, 'whatsapp')}
                variant="outline"
              >
                {copiedField === 'whatsapp' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{lead.email}</span>
              </div>
              <Button
                onClick={() => sendEmail(lead.email)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                onClick={() => copyToClipboard(lead.email, 'email')}
                variant="outline"
              >
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b-2 border-gray-200">
            <div className="flex">
              {(['resumo', 'briefing', 'timeline'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    selectedTab === tab
                      ? 'bg-purple-50 text-purple-700 border-b-4 border-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'resumo' && '📋 Resumo'}
                  {tab === 'briefing' && '📝 Briefing Completo'}
                  {tab === 'timeline' && '📅 Timeline'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {selectedTab === 'resumo' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome do Profissional</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{lead.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome da Clínica</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {lead.briefing_data?.nome_consultorio || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Prazo Desejado</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {lead.briefing_data?.prazo_desejado === '24h' && (
                        <span className="text-red-600">⚠️ 24 horas (Urgente)</span>
                      )}
                      {lead.briefing_data?.prazo_desejado === 'normal' && '📅 1-2 semanas'}
                      {lead.briefing_data?.prazo_desejado === 'flexivel' && '🕐 Flexível'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estilo do Site</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {lead.briefing_data?.estilo_site || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      <Clock className="w-4 h-4 inline mr-2" />
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Valor Total</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      R$ {(lead.valor_total / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {lead.briefing_data?.prazo_desejado === '24h' && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-900">⚠️ ATENÇÃO: Prazo Urgente!</h4>
                        <p className="text-red-800 text-sm mt-1">
                          Cliente escolheu prazo de 24 horas. Priorizar este lead!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'briefing' && lead.briefing_data && (
              <ReviewStep
                formData={lead.briefing_data}
                uploadedFiles={lead.briefing_data.arquivos || {}}
                onEdit={() => {}}
              />
            )}

            {selectedTab === 'timeline' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <div className="w-0.5 h-full bg-purple-200"></div>
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-gray-900">Briefing recebido</p>
                    <p className="text-sm text-gray-500">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
                {lead.updated_at !== lead.created_at && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <div className="w-0.5 h-full bg-purple-200"></div>
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold text-gray-900">Status atualizado</p>
                      <p className="text-sm text-gray-500">{formatDate(lead.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetails;
