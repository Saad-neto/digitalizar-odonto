import React, { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';

type ConsultaStatus = 'confirmed' | 'pending' | 'cancelled';

interface Consulta {
  id: number;
  patient: string;
  time: string;
  day: string;
  dayIndex: number;
  type: string;
  status: ConsultaStatus;
  duration: number; // minutes
}

const initialConsultas: Consulta[] = [
  // Segunda
  { id: 1, patient: 'Ana Carolina Pereira', time: '08:00', day: 'Seg', dayIndex: 0, type: 'Consulta de rotina', status: 'confirmed', duration: 45 },
  { id: 2, patient: 'João Paulo Mendes', time: '09:00', day: 'Seg', dayIndex: 0, type: 'Limpeza', status: 'confirmed', duration: 60 },
  { id: 3, patient: 'Fernanda Oliveira', time: '10:30', day: 'Seg', dayIndex: 0, type: 'Tratamento de canal', status: 'pending', duration: 90 },
  { id: 4, patient: 'Carlos Eduardo Lima', time: '13:00', day: 'Seg', dayIndex: 0, type: 'Estética', status: 'confirmed', duration: 60 },
  // Terça
  { id: 5, patient: 'Luciana Santos', time: '08:30', day: 'Ter', dayIndex: 1, type: 'Consulta de rotina', status: 'pending', duration: 45 },
  { id: 6, patient: 'Marcos Souza', time: '10:00', day: 'Ter', dayIndex: 1, type: 'Limpeza', status: 'confirmed', duration: 60 },
  { id: 7, patient: 'Patricia Rodrigues', time: '14:00', day: 'Ter', dayIndex: 1, type: 'Estética', status: 'confirmed', duration: 75 },
  // Quarta
  { id: 8, patient: 'Ricardo Almeida', time: '09:00', day: 'Qua', dayIndex: 2, type: 'Tratamento de canal', status: 'pending', duration: 90 },
  { id: 9, patient: 'Claudia Ferreira', time: '11:00', day: 'Qua', dayIndex: 2, type: 'Limpeza', status: 'confirmed', duration: 60 },
  // Quinta
  { id: 10, patient: 'Diego Nascimento', time: '08:00', day: 'Qui', dayIndex: 3, type: 'Consulta de rotina', status: 'confirmed', duration: 45 },
  { id: 11, patient: 'Juliana Costa', time: '10:30', day: 'Qui', dayIndex: 3, type: 'Estética', status: 'pending', duration: 75 },
  { id: 12, patient: 'Eduardo Martins', time: '14:00', day: 'Qui', dayIndex: 3, type: 'Limpeza', status: 'confirmed', duration: 60 },
  // Sexta
  { id: 13, patient: 'Ana Carolina Pereira', time: '09:00', day: 'Sex', dayIndex: 4, type: 'Limpeza', status: 'confirmed', duration: 60 },
  { id: 14, patient: 'Carlos Eduardo Lima', time: '11:00', day: 'Sex', dayIndex: 4, type: 'Consulta de rotina', status: 'pending', duration: 45 },
];

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const typeColors: Record<string, string> = {
  'Consulta de rotina': 'bg-medical-100 border-medical-300 text-medical-700',
  'Limpeza': 'bg-mint-100 border-mint-300 text-mint-700',
  'Tratamento de canal': 'bg-amber-50 border-amber-300 text-amber-700',
  'Estética': 'bg-purple-50 border-purple-300 text-purple-700',
};

const DemoAgendamentos = () => {
  const [consultas, setConsultas] = useState<Consulta[]>(initialConsultas);
  const [view, setView] = useState<'semana' | 'lista'>('semana');

  const toggleStatus = (id: number, newStatus: ConsultaStatus) => {
    setConsultas(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const statusBadge = (status: ConsultaStatus) => {
    if (status === 'confirmed') return 'bg-mint-100 text-mint-700';
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-600';
  };

  const statusLabel = (status: ConsultaStatus) => {
    if (status === 'confirmed') return 'Confirmado';
    if (status === 'pending') return 'Pendente';
    return 'Cancelado';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Agendamentos</h1>
          <p className="text-neutral-500 text-sm">Semana de 2 a 6 de fevereiro de 2026</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('semana')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              view === 'semana' ? 'bg-medical-500 text-white' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setView('lista')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              view === 'lista' ? 'bg-medical-500 text-white' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Lista
          </button>
        </div>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeColors).map(([type, cls]) => (
          <span key={type} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>{type}</span>
        ))}
      </div>

      {view === 'semana' ? (
        /* ── Week grid view ── */
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="grid grid-cols-6 border-b border-neutral-200 bg-neutral-50">
                <div className="p-3 border-r border-neutral-200 text-xs font-semibold text-neutral-500 uppercase">Hora</div>
                {days.map(d => (
                  <div key={d} className="p-3 border-r border-neutral-200 text-center text-sm font-bold text-neutral-700">{d}</div>
                ))}
              </div>

              {/* Hour rows */}
              {hours.map(hour => {
                return (
                  <div key={hour} className="grid grid-cols-6 border-b border-neutral-100 min-h-[56px]">
                    <div className="p-2 border-r border-neutral-200 text-xs text-neutral-500 font-medium flex items-start pt-2">{hour}</div>
                    {days.map((d, dayIdx) => {
                      const slotConsultas = consultas.filter(c =>
                        c.dayIndex === dayIdx && c.time === hour && c.status !== 'cancelled'
                      );
                      return (
                        <div key={d} className="border-r border-neutral-100 p-1 min-h-[56px]">
                          {slotConsultas.map(c => (
                            <div key={c.id} className={`border rounded-md px-2 py-1.5 text-xs mb-1 ${typeColors[c.type]}`}>
                              <p className="font-semibold truncate">{c.patient.split(' ')[0]}</p>
                              <p className="truncate opacity-80">{c.type}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── List view ── */
        <div className="space-y-3">
          {days.map(day => {
            const dayConsultas = consultas.filter(c => c.day === day);
            if (dayConsultas.length === 0) return null;
            return (
              <div key={day} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="text-sm font-bold text-neutral-700">{day} — {dayConsultas.length} consulta{dayConsultas.length > 1 ? 's' : ''}</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {dayConsultas.map(c => (
                    <div key={c.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-[52px]">
                        <p className="text-sm font-bold text-medical-600">{c.time}</p>
                        <p className="text-xs text-neutral-400 flex items-center gap-0.5">
                          <Clock size={10} /> {c.duration}min
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900">{c.patient}</p>
                        <p className="text-xs text-neutral-500">{c.type}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(c.status)}`}>
                        {statusLabel(c.status)}
                      </span>
                      {/* Action buttons */}
                      <div className="flex gap-1">
                        {c.status !== 'confirmed' && (
                          <button
                            onClick={() => toggleStatus(c.id, 'confirmed')}
                            className="w-7 h-7 rounded-full bg-mint-100 hover:bg-mint-200 flex items-center justify-center transition-colors"
                            title="Confirmar"
                          >
                            <Check size={14} className="text-mint-700" />
                          </button>
                        )}
                        {c.status !== 'cancelled' && (
                          <button
                            onClick={() => toggleStatus(c.id, 'cancelled')}
                            className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="Cancelar"
                          >
                            <X size={14} className="text-red-600" />
                          </button>
                        )}
                        {c.status === 'cancelled' && (
                          <button
                            onClick={() => toggleStatus(c.id, 'pending')}
                            className="text-xs text-medical-600 hover:underline"
                          >
                            Restaurar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 flex gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-neutral-900">{consultas.filter(c => c.status !== 'cancelled').length}</p>
          <p className="text-xs text-neutral-500">Total ativas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-mint-600">{consultas.filter(c => c.status === 'confirmed').length}</p>
          <p className="text-xs text-neutral-500">Confirmadas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{consultas.filter(c => c.status === 'pending').length}</p>
          <p className="text-xs text-neutral-500">Pendentes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{consultas.filter(c => c.status === 'cancelled').length}</p>
          <p className="text-xs text-neutral-500">Canceladas</p>
        </div>
      </div>
    </div>
  );
};

export default DemoAgendamentos;
