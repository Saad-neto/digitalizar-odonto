import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/lib/supabase';
import { Mail, Phone, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanCardProps {
  lead: Lead;
  onClick: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isUrgent = lead.briefing_data?.prazo_desejado === '24h';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white rounded-lg border-2 p-4 cursor-pointer hover:shadow-md transition-shadow ${
        isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}
    >
      {/* Urgente Badge */}
      {isUrgent && (
        <div className="flex items-center gap-1 mb-2 text-red-600 text-xs font-bold">
          <AlertCircle className="w-3 h-3" />
          URGENTE - 24H
        </div>
      )}

      {/* Clínica */}
      <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">
        {lead.briefing_data?.nome_consultorio || 'Sem nome'}
      </h4>

      {/* Profissional */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-1">
        {lead.nome}
      </p>

      {/* Contatos */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone className="w-3 h-3" />
          <span className="line-clamp-1">{lead.whatsapp}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="w-3 h-3" />
          <span className="line-clamp-1">{lead.email}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>
            {formatDistanceToNow(new Date(lead.created_at), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        <div className="text-xs font-bold text-medical-600">
          R$ {(lead.valor_total / 100).toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
