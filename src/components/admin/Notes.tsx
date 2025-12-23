import React, { useEffect, useState } from 'react';
import { getLeadNotes, addLeadNote, deleteLeadNote, LeadNote } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Send, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotesProps {
  leadId: string;
}

const Notes: React.FC<NotesProps> = ({ leadId }) => {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  const loadNotes = async () => {
    try {
      const data = await getLeadNotes(leadId);
      setNotes(data);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNote.trim()) {
      setError('Digite uma nota antes de enviar');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await addLeadNote(leadId, newNote.trim());
      setNewNote('');
      await loadNotes();
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      setError('Erro ao adicionar nota. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) {
      return;
    }

    try {
      await deleteLeadNote(noteId);
      await loadNotes();
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      alert('Erro ao deletar nota. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form para adicionar nota */}
      <form onSubmit={handleAddNote} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
          Adicionar Nova Nota
        </label>
        <textarea
          id="note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Digite sua nota aqui..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
          disabled={submitting}
        />

        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={submitting || !newNote.trim()}
            className="bg-medical-600 hover:bg-medical-700"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Adicionar Nota
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Lista de notas */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Notas ({notes.length})
        </h3>

        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>Nenhuma nota ainda</p>
            <p className="text-sm mt-1">Adicione a primeira nota acima</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 whitespace-pre-wrap">{note.note}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(note.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Excluir nota"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
