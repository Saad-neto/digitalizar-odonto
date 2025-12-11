import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

interface Disponibilidade {
  id: string;
  dia_semana: number;
  horario_inicio: string;
  horario_fim: string;
  ativo: boolean;
  duracao_slot: number;
}

interface Bloqueio {
  id: string;
  data_inicio: string;
  data_fim: string;
  horario_inicio?: string;
  horario_fim?: string;
  motivo: string;
  ativo: boolean;
}

const diasSemana = [
  { id: 1, nome: 'Segunda-feira' },
  { id: 2, nome: 'Terça-feira' },
  { id: 3, nome: 'Quarta-feira' },
  { id: 4, nome: 'Quinta-feira' },
  { id: 5, nome: 'Sexta-feira' },
  { id: 6, nome: 'Sábado' },
  { id: 0, nome: 'Domingo' },
];

const Configuracoes = () => {
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [novoBloqueio, setNovoBloqueio] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar disponibilidades
      const { data: disp, error: dispError } = await supabase
        .from('disponibilidade')
        .select('*')
        .order('dia_semana', { ascending: true })
        .order('horario_inicio', { ascending: true });

      if (dispError) throw dispError;
      setDisponibilidades(disp || []);

      // Carregar bloqueios
      const { data: bloq, error: bloqError } = await supabase
        .from('bloqueios')
        .select('*')
        .eq('ativo', true)
        .order('data_inicio', { ascending: true });

      if (bloqError) throw bloqError;
      setBloqueios(bloq || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const toggleDisponibilidade = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('disponibilidade')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar disponibilidade');
    }
  };

  const adicionarHorario = async (diaSemana: number) => {
    const inicio = prompt('Horário de início (HH:MM):');
    const fim = prompt('Horário de fim (HH:MM):');

    if (!inicio || !fim) return;

    try {
      const { error } = await supabase
        .from('disponibilidade')
        .insert({
          dia_semana: diaSemana,
          horario_inicio: inicio,
          horario_fim: fim,
          ativo: true,
          duracao_slot: 30,
        });

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      alert('Erro ao adicionar horário');
    }
  };

  const removerHorario = async (id: string) => {
    if (!confirm('Deseja realmente remover este horário?')) return;

    try {
      const { error } = await supabase
        .from('disponibilidade')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erro ao remover:', error);
      alert('Erro ao remover horário');
    }
  };

  const adicionarBloqueio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('bloqueios')
        .insert({
          data_inicio: formData.get('data_inicio'),
          data_fim: formData.get('data_fim'),
          motivo: formData.get('motivo'),
          ativo: true,
        });

      if (error) throw error;
      setNovoBloqueio(false);
      await loadData();
    } catch (error) {
      console.error('Erro ao adicionar bloqueio:', error);
      alert('Erro ao adicionar bloqueio');
    }
  };

  const removerBloqueio = async (id: string) => {
    if (!confirm('Deseja realmente remover este bloqueio?')) return;

    try {
      const { error } = await supabase
        .from('bloqueios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Erro ao remover:', error);
      alert('Erro ao remover bloqueio');
    }
  };

  const disponibilidadesPorDia = diasSemana.map((dia) => ({
    ...dia,
    horarios: disponibilidades.filter((d) => d.dia_semana === dia.id),
  }));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configurações de Agenda
        </h1>
        <p className="text-gray-600">
          Gerencie horários disponíveis e bloqueios de agenda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disponibilidade por Dia */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="text-purple-600" size={24} />
            Disponibilidade por Dia da Semana
          </h2>

          <div className="space-y-4">
            {disponibilidadesPorDia.map((dia) => {
              const temHorarios = dia.horarios.length > 0;
              const todosAtivos = dia.horarios.every((h) => h.ativo);

              return (
                <div
                  key={dia.id}
                  className={`border-2 rounded-lg p-4 ${
                    temHorarios && todosAtivos
                      ? 'border-green-200 bg-green-50'
                      : temHorarios
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">{dia.nome}</h3>
                    {temHorarios && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          todosAtivos
                            ? 'bg-green-600 text-white'
                            : 'bg-orange-600 text-white'
                        }`}
                      >
                        {todosAtivos ? 'Ativo' : 'Parcial'}
                      </span>
                    )}
                  </div>

                  {dia.horarios.length === 0 ? (
                    <p className="text-sm text-gray-500 mb-3">
                      Nenhum horário configurado
                    </p>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {dia.horarios.map((horario) => (
                        <div
                          key={horario.id}
                          className={`flex items-center justify-between p-2 rounded ${
                            horario.ativo ? 'bg-white' : 'bg-gray-100 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-purple-600" />
                            <span className="text-sm font-medium">
                              {horario.horario_inicio} - {horario.horario_fim}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                toggleDisponibilidade(horario.id, horario.ativo)
                              }
                              className={`text-xs px-2 py-1 rounded ${
                                horario.ativo
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {horario.ativo ? 'Ativo' : 'Inativo'}
                            </button>
                            <button
                              onClick={() => removerHorario(horario.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    size="sm"
                    onClick={() => adicionarHorario(dia.id)}
                    variant="outline"
                    className="w-full text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Horário
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloqueios */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <X className="text-red-600" size={24} />
              Bloqueios de Agenda
            </h2>
            <Button
              size="sm"
              onClick={() => setNovoBloqueio(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus size={16} className="mr-2" />
              Novo Bloqueio
            </Button>
          </div>

          {/* Form Novo Bloqueio */}
          {novoBloqueio && (
            <form
              onSubmit={adicionarBloqueio}
              className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4"
            >
              <h3 className="font-bold text-gray-800 mb-3">Novo Bloqueio</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Motivo *
                  </label>
                  <input
                    type="text"
                    name="motivo"
                    required
                    placeholder="Ex: Férias, Feriado, Evento..."
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Data Início *
                    </label>
                    <input
                      type="date"
                      name="data_inicio"
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Data Fim *
                    </label>
                    <input
                      type="date"
                      name="data_fim"
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1 bg-red-600">
                    <Save size={16} className="mr-2" />
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setNovoBloqueio(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Lista de Bloqueios */}
          <div className="space-y-3">
            {bloqueios.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum bloqueio cadastrado
              </p>
            ) : (
              bloqueios.map((bloqueio) => (
                <div
                  key={bloqueio.id}
                  className="border-2 border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">
                        {bloqueio.motivo}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            {new Date(bloqueio.data_inicio).toLocaleDateString(
                              'pt-BR'
                            )}{' '}
                            até{' '}
                            {new Date(bloqueio.data_fim).toLocaleDateString(
                              'pt-BR'
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Dia inteiro</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removerBloqueio(bloqueio.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Configuracoes;
