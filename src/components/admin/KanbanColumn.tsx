import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  icon: string;
  count: number;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, color, icon, count, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className={`${color} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-bold">
              {count}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          ref={setNodeRef}
          className={`flex-1 p-4 overflow-y-auto transition-colors ${
            isOver ? 'bg-purple-50 border-2 border-dashed border-purple-400' : ''
          }`}
          style={{ minHeight: '500px', maxHeight: 'calc(100vh - 300px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
