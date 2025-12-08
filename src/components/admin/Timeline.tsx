import React, { useEffect, useState } from 'react';
import { getLeadStatusHistory, LeadStatusHistory } from '@/lib/supabase';
import { Clock, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineProps {
  leadId: string;
}

const statusLabels: Record<string, string> = {
  'novo': 'Novo',
  'pago_50': 'Pago 50%',
  'em_producao': 'Em Produção',
  'em_aprovacao': 'Em Aprovação',
  'pago_100': 'Pago 100%',
  'concluido': 'Concluído',
};

const statusColors: Record<string, string> = {
  'novo': 'bg-green-500',
  'pago_50': 'bg-blue-500',
  'em_producao': 'bg-yellow-500',
  'em_aprovacao': 'bg-purple-500',
  'pago_100': 'bg-pink-500',
  'concluido': 'bg-emerald-500',
};

const Timeline: React.FC<TimelineProps> = ({ leadId }) => {
  const [history, setHistory] = useState<LeadStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [leadId]);

  const loadHistory = async () => {
    try {
      const data = await getLeadStatusHistory(leadId);
      setHistory(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>Nenhuma mudança de status ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => {
        const isLast = index === history.length - 1;
        const newStatusLabel = statusLabels[item.new_status] || item.new_status;
        const oldStatusLabel = item.old_status ? statusLabels[item.old_status] || item.old_status : null;
        const color = statusColors[item.new_status] || 'bg-gray-500';

        return (
          <div key={item.id} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${color} ring-4 ring-white`} />
              {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {oldStatusLabel ? (
                        <>
                          Status alterado de <span className="text-gray-600">{oldStatusLabel}</span> para{' '}
                          <span className="text-purple-600">{newStatusLabel}</span>
                        </>
                      ) : (
                        <>
                          Lead criado com status <span className="text-purple-600">{newStatusLabel}</span>
                        </>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${color}`}>
                    {newStatusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
