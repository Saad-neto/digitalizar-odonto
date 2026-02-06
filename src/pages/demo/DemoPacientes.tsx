import React, { useState } from 'react';
import { Search, X, Phone, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  lastTreatment: string;
  lastValue: number;
  status: 'ativo' | 'agendado' | 'sem_consulta';
  since: string;
  email: string;
  note: string;
}

const patients: Patient[] = [
  { id: 1, name: 'Ana Carolina Pereira', cpf: '123.456.***-**', phone: '(11) 98765-4321', lastTreatment: 'Limpeza', lastValue: 250, status: 'agendado', since: 'Mar 2023', email: 'ana.carolina@email.com', note: 'Alergia a latex' },
  { id: 2, name: 'João Paulo Mendes', cpf: '234.567.***-**', phone: '(11) 91234-5678', lastTreatment: 'Tratamento de canal', lastValue: 1800, status: 'ativo', since: 'Jun 2022', email: 'joao.mendes@email.com', note: 'Paciente antigo, sorriso bonito' },
  { id: 3, name: 'Fernanda Oliveira', cpf: '345.678.***-**', phone: '(11) 96543-2109', lastTreatment: 'Estética', lastValue: 3200, status: 'agendado', since: 'Jan 2024', email: 'fernanda.oli@email.com', note: '' },
  { id: 4, name: 'Carlos Eduardo Lima', cpf: '456.789.***-**', phone: '(11) 98123-4567', lastTreatment: 'Consulta de rotina', lastValue: 180, status: 'ativo', since: 'Ago 2023', email: 'carlos.lima@email.com', note: 'Veio por indicação da Fernanda' },
  { id: 5, name: 'Luciana Santos', cpf: '567.890.***-**', phone: '(11) 97654-3210', lastTreatment: 'Limpeza', lastValue: 250, status: 'sem_consulta', since: 'Fev 2023', email: 'luciana.s@email.com', note: 'Última consulta há 4 meses' },
  { id: 6, name: 'Marcos Souza', cpf: '678.901.***-**', phone: '(11) 91111-2222', lastTreatment: 'Consulta de rotina', lastValue: 180, status: 'agendado', since: 'Dez 2023', email: 'marcos.souza@email.com', note: 'Novo paciente' },
  { id: 7, name: 'Patricia Rodrigues', cpf: '789.012.***-**', phone: '(11) 93333-4444', lastTreatment: 'Estética', lastValue: 2800, status: 'ativo', since: 'Mar 2022', email: 'patricia.r@email.com', note: '' },
  { id: 8, name: 'Ricardo Almeida', cpf: '890.123.***-**', phone: '(11) 95555-6666', lastTreatment: 'Tratamento de canal', lastValue: 2100, status: 'sem_consulta', since: 'Jul 2023', email: 'ricardo.alm@email.com', note: 'Precisa de retorno' },
  { id: 9, name: 'Claudia Ferreira', cpf: '901.234.***-**', phone: '(11) 97777-8888', lastTreatment: 'Limpeza', lastValue: 280, status: 'ativo', since: 'Nov 2023', email: 'claudia.f@email.com', note: '' },
  { id: 10, name: 'Diego Nascimento', cpf: '012.345.***-**', phone: '(11) 92222-3333', lastTreatment: 'Consulta de rotina', lastValue: 180, status: 'agendado', since: 'Jan 2024', email: 'diego.n@email.com', note: 'Veio pelo Instagram' },
  { id: 11, name: 'Juliana Costa', cpf: '123.890.***-**', phone: '(11) 94444-5555', lastTreatment: 'Estética', lastValue: 3500, status: 'ativo', since: 'Mai 2022', email: 'juliana.c@email.com', note: 'Paciente VIP' },
  { id: 12, name: 'Eduardo Martins', cpf: '456.012.***-**', phone: '(11) 96666-7777', lastTreatment: 'Limpeza', lastValue: 250, status: 'sem_consulta', since: 'Abr 2023', email: 'edu.martins@email.com', note: 'Não atendeu ligação' },
];

const statusConfig = {
  ativo: { label: 'Ativo', bg: 'bg-mint-100', text: 'text-mint-700' },
  agendado: { label: 'Agendado', bg: 'bg-medical-100', text: 'text-medical-700' },
  sem_consulta: { label: 'Sem consulta há muito tempo', bg: 'bg-amber-50', text: 'text-amber-700' },
};

const DemoPacientes = () => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.cpf.includes(search)
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let valA: string | number = sortField === 'name' ? a.name : sortField === 'lastValue' ? a.lastValue : a.lastTreatment;
    let valB: string | number = sortField === 'name' ? b.name : sortField === 'lastValue' ? b.lastValue : b.lastTreatment;
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pacientes</h1>
          <p className="text-neutral-500 text-sm">{patients.length} pacientes cadastrados</p>
        </div>
        <button className="px-4 py-2 bg-medical-500 text-white text-sm font-semibold rounded-lg hover:bg-medical-600 transition-colors">
          + Novo Paciente
        </button>
      </div>

      {/* Search + status summary */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou CPF..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-300 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = patients.filter(p => p.status === key).length;
            return (
              <span key={key} className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                {cfg.label} ({count})
              </span>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 cursor-pointer hover:text-medical-600" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Nome <SortIcon field="name" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600">CPF</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600">Telefone</th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 cursor-pointer hover:text-medical-600" onClick={() => handleSort('lastTreatment')}>
                  <div className="flex items-center gap-1">Último Tratamento <SortIcon field="lastTreatment" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600 cursor-pointer hover:text-medical-600" onClick={() => handleSort('lastValue')}>
                  <div className="flex items-center gap-1">Valor <SortIcon field="lastValue" /></div>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-neutral-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => {
                const cfg = statusConfig[p.status];
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className="border-b border-neutral-100 hover:bg-medical-50 cursor-pointer transition-colors last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-medical-600">
                            {p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <span className="font-semibold text-neutral-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{p.cpf}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.phone}</td>
                    <td className="px-4 py-3 text-neutral-600">{p.lastTreatment}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">R$ {p.lastValue.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    Nenhum paciente encontrado para "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient detail modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-medical-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-medical-600">
                    {selectedPatient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">{selectedPatient.name}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[selectedPatient.status].bg} ${statusConfig[selectedPatient.status].text}`}>
                    {statusConfig[selectedPatient.status].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-neutral-400 hover:text-neutral-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-500 mb-0.5">CPF</p>
                  <p className="text-sm font-medium text-neutral-800">{selectedPatient.cpf}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-500 mb-0.5">Paciente desde</p>
                  <p className="text-sm font-medium text-neutral-800">{selectedPatient.since}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Phone size={16} className="text-medical-500" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Calendar size={16} className="text-medical-500" />
                  <span>Último tratamento: <strong>{selectedPatient.lastTreatment}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <DollarSign size={16} className="text-medical-500" />
                  <span>Último valor: <strong>R$ {selectedPatient.lastValue.toLocaleString('pt-BR')}</strong></span>
                </div>
              </div>

              {selectedPatient.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Nota</p>
                  <p className="text-sm text-amber-800">{selectedPatient.note}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button className="flex-1 px-4 py-2 bg-medical-500 text-white text-sm font-semibold rounded-lg hover:bg-medical-600 transition-colors">
                  Agendar Consulta
                </button>
                <button className="px-4 py-2 border border-neutral-200 text-neutral-600 text-sm font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPacientes;
