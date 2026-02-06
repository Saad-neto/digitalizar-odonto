import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, BarChart2, Users } from 'lucide-react';

const summaryCards = [
  { label: 'Receita do Mês', value: 'R$ 18.400', sub: 'Fevereiro 2026', icon: DollarSign, trend: '+12%', up: true },
  { label: 'Receita Pendente', value: 'R$ 4.200', sub: '3 consultas pendentes', icon: Clock, trend: '-5%', up: false },
  { label: 'Média por Consulta', value: 'R$ 380', sub: '48 consultas este mês', icon: BarChart2, trend: '+8%', up: true },
  { label: 'Crescimento', value: '+12%', sub: 'vs janeiro 2026', icon: TrendingUp, trend: 'R$ 1.980', up: true },
];

// Monthly revenue last 6 months
const monthlyRevenue = [
  { month: 'Ago', value: 14200 },
  { month: 'Set', value: 16800 },
  { month: 'Out', value: 15400 },
  { month: 'Nov', value: 19200 },
  { month: 'Dez', value: 22100 },
  { month: 'Jan', value: 16400 },
];

const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

const transactions = [
  { id: 1, patient: 'Ana Carolina Pereira', type: 'Limpeza', value: 250, status: 'pago', date: '02/02/2026' },
  { id: 2, patient: 'João Paulo Mendes', type: 'Tratamento de canal', value: 1800, status: 'pago', date: '01/02/2026' },
  { id: 3, patient: 'Fernanda Oliveira', type: 'Estética', value: 3200, status: 'pendente', date: '31/01/2026' },
  { id: 4, patient: 'Carlos Eduardo Lima', type: 'Consulta de rotina', value: 180, status: 'pago', date: '30/01/2026' },
  { id: 5, patient: 'Luciana Santos', type: 'Limpeza', value: 280, status: 'pendente', date: '29/01/2026' },
  { id: 6, patient: 'Patricia Rodrigues', type: 'Estética', value: 2800, status: 'pago', date: '28/01/2026' },
  { id: 7, patient: 'Marcos Souza', type: 'Consulta de rotina', value: 180, status: 'pago', date: '27/01/2026' },
  { id: 8, patient: 'Ricardo Almeida', type: 'Tratamento de canal', value: 2100, status: 'pendente', date: '26/01/2026' },
  { id: 9, patient: 'Claudia Ferreira', type: 'Limpeza', value: 280, status: 'pago', date: '25/01/2026' },
  { id: 10, patient: 'Diego Nascimento', type: 'Consulta de rotina', value: 180, status: 'pago', date: '24/01/2026' },
];

const DemoFinanceiro = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Financeiro</h1>
        <p className="text-neutral-500 text-sm">Controle de receitas e transações da clínica</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
                  <Icon size={20} className="text-medical-600" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.up ? 'bg-mint-100 text-mint-700' : 'bg-red-50 text-red-600'
                }`}>
                  {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.trend}
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-neutral-900">Receita Mensal</h2>
            <p className="text-xs text-neutral-500">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-1 text-mint-700 text-xs font-semibold bg-mint-50 px-2 py-1 rounded">
            <TrendingUp size={14} />
            Média: R$ {Math.round(monthlyRevenue.reduce((s, m) => s + m.value, 0) / monthlyRevenue.length).toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="flex items-end gap-4 h-48 px-2">
          {monthlyRevenue.map((m, i) => {
            const heightPercent = (m.value / maxRevenue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-semibold text-neutral-600">
                  R$ {(m.value / 1000).toFixed(1)}k
                </span>
                <div className="w-full flex items-end justify-center h-36">
                  <div
                    className="w-full max-w-[56px] rounded-t-md transition-all"
                    style={{
                      height: `${heightPercent}%`,
                      background: i === monthlyRevenue.length - 1
                        ? 'linear-gradient(to top, #0891b2, #22d3ee)'
                        : 'linear-gradient(to top, #0d9488, #14b8a6)',
                    }}
                  />
                </div>
                <span className="text-xs text-neutral-500">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="font-bold text-neutral-900">Últimas Transações</h2>
          <div className="flex gap-2">
            <span className="text-xs bg-mint-100 text-mint-700 px-2 py-0.5 rounded-full font-medium">
              Pago: R$ {transactions.filter(t => t.status === 'pago').reduce((s, t) => s + t.value, 0).toLocaleString('pt-BR')}
            </span>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Pendente: R$ {transactions.filter(t => t.status === 'pendente').reduce((s, t) => s + t.value, 0).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-6 py-3 font-semibold text-neutral-600">Data</th>
                <th className="text-left px-6 py-3 font-semibold text-neutral-600">Paciente</th>
                <th className="text-left px-6 py-3 font-semibold text-neutral-600">Tipo</th>
                <th className="text-right px-6 py-3 font-semibold text-neutral-600">Valor</th>
                <th className="text-left px-6 py-3 font-semibold text-neutral-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-3 text-neutral-500">{t.date}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-medical-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-medical-600">
                          {t.patient.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-neutral-900">{t.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-neutral-600">{t.type}</td>
                  <td className="px-6 py-3 text-right font-bold text-neutral-900">R$ {t.value.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      t.status === 'pago' ? 'bg-mint-100 text-mint-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {t.status === 'pago' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DemoFinanceiro;
