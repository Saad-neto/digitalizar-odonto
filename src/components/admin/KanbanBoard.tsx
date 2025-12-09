import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, updateLeadStatus } from '@/lib/supabase';
import KanbanCard from './KanbanCard';
import KanbanColumn from './KanbanColumn';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (leadId: string) => void;
  onRefresh: () => void;
}

const columns: { id: Lead['status']; title: string; color: string; icon: string }[] = [
  { id: 'novo', title: 'Novo', color: 'bg-green-500', icon: '🆕' },
  { id: 'em_producao', title: 'Em Produção', color: 'bg-yellow-500', icon: '🔨' },
  { id: 'aguardando_aprovacao', title: 'Aguardando Aprovação', color: 'bg-purple-500', icon: '👀' },
  { id: 'aprovado_pagamento', title: 'Aprovado e Pago', color: 'bg-blue-500', icon: '💰' },
  { id: 'em_ajustes', title: 'Em Ajustes', color: 'bg-orange-500', icon: '🔧' },
  { id: 'aprovacao_final', title: 'Aprovação Final', color: 'bg-pink-500', icon: '✨' },
  { id: 'no_ar', title: 'No Ar', color: 'bg-indigo-500', icon: '🚀' },
  { id: 'concluido', title: 'Concluído', color: 'bg-gray-500', icon: '✅' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onLeadClick, onRefresh }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.filter((lead) => lead.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const leadId = active.id as string;
    const newStatus = over.id as Lead['status'];

    // Verifica se é uma coluna válida
    const isValidColumn = columns.some((col) => col.id === newStatus);
    if (!isValidColumn) {
      setActiveId(null);
      return;
    }

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) {
      setActiveId(null);
      return;
    }

    try {
      setUpdating(true);
      await updateLeadStatus(leadId, newStatus);

      // Notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `✅ Status alterado para ${columns.find(c => c.id === newStatus)?.title}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      // Atualizar lista
      onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);

      // Notificação de erro
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = '❌ Erro ao atualizar status';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setUpdating(false);
      setActiveId(null);
    }
  };

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnLeads = getLeadsByStatus(column.id);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              icon={column.icon}
              count={columnLeads.length}
            >
              <SortableContext
                items={columnLeads.map((lead) => lead.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnLeads.map((lead) => (
                    <KanbanCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => onLeadClick(lead.id)}
                    />
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      Arraste cards aqui
                    </div>
                  )}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="rotate-3 opacity-80">
            <KanbanCard lead={activeLead} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>

      {updating && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Atualizando status...</p>
          </div>
        </div>
      )}
    </DndContext>
  );
};

export default KanbanBoard;
