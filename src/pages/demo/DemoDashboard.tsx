import React from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
} from 'lucide-react';

const stats = [
  { label: 'Pacientes esta semana', value: '23', change: '+4', icon: Users, color: 'medical' },
  { label: 'Consultas hoje', value: '6', change: '+1', icon: Calendar, color: 'mint' },
  { label: 'Receita do mês', value: 'R$ 18.400', change: '+12%', icon: DollarSign, color: 'medical' },
  { label: 'Agendamentos pendentes', value: '8', change: '-2', icon: Clock, color: 'mint' },
];

const todayAppointments = [
  { time: '08:00', patient: 'Ana Carolina Pereira', type: 'Consulta de rotina', status: 'confirmed' },
  { time: '09:00', patient: 'João Paulo Mendes', type: 'Limpeza', status: 'confirmed' },
  { time: '10:30', patient: 'Fernanda Oliveira', type: 'Tratamento de canal', status: 'pending' },
  { time: '13:00', patient: 'Carlos Eduardo Lima', type: 'Estética', status: 'confirmed' },
  { time: '14:30', patient: 'Luciana Santos', type: 'Consulta de rotina', status: 'pending' },
];

const recentActivity = [
  { time: '10 min atrás', text: 'Novo agendamento — Fernanda Oliveira, 3º fev', icon: Calendar },
  { time: '25 min atrás', text: 'Pagamento recebido — R$ 320,00 — Carlos Lima', icon: DollarSign },
  { time: '1h atrás', text: 'Paciente confirmou consulta — Ana Carolina', icon: Users },
  { time: '2h atrás', text: 'Post publicado — "Dicas para cuidar dos dentes"', icon: Activity },
  { time: '3h atrás', text: 'Novo paciente cadastrado — Marcos Souza', icon: Users },
];

// Revenue data: last 7 days (relative bars)
const revenueWeek = [
  { day: 'Seg', value: 1800 },
  { day: 'Ter', value: 2400 },
  { day: 'Qua', value: 1600 },
  { day: 'Qui', value: 3200 },
  { day: 'Sex', value: 2800 },
  { day: 'Sáb', value: 1200 },
  { day: 'Dom', value: 400 },
];

const maxValue = Math.max(...revenueWeek.map(d => d.value));

const DemoDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 text-sm">Bem-vindo, Dra. Maria Silva · Segunda-feira, 2 de fevereiro</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const isPositive = s.change.startsWith('+');
          return (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  s.color === 'medical' ? 'bg-medical-100' : 'bg-mint-100'
                }`}>
                  <Icon size={20} className={s.color === 'medical' ? 'text-medical-600' : 'text-mint-600'} />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isPositive ? 'bg-mint-100 text-mint-700' : 'bg-red-50 text-red-600'
                }`}>
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Middle row: Revenue chart + Today's appointments */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Revenue chart (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-neutral-900">Receita da Semana</h2>
              <p className="text-xs text-neutral-500">Últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-1 text-mint-700 text-xs font-semibold bg-mint-50 px-2 py-1 rounded">
              <TrendingUp size={14} />
              +18% vs semana anterior
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3 h-44 px-2">
            {revenueWeek.map((d, i) => {
              const heightPercent = (d.value / maxValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-xs font-semibold text-neutral-600">
                    R$ {(d.value / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className="w-full max-w-[40px] bg-medical-500 rounded-t-md transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-neutral-900">Consultas Hoje</h2>
            <span className="text-xs text-medical-600 font-semibold">{todayAppointments.length} agendadas</span>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="text-center min-w-[44px]">
                  <p className="text-sm font-bold text-medical-600">{apt.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{apt.patient}</p>
                  <p className="text-xs text-neutral-500">{apt.type}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  apt.status === 'confirmed' ? 'bg-mint-100 text-mint-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {apt.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atividade recente */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-neutral-900">Atividade Recente</h2>
          <button className="text-xs text-medical-600 font-semibold flex items-center gap-1 hover:underline">
            Ver tudo <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-medical-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-800">{a.text}</p>
                  <p className="text-xs text-neutral-400">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
