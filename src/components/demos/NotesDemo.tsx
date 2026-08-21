import React, { useState } from 'react';
import { FileText, Plus, Trash2, Tag, Sparkles, Check, Copy } from 'lucide-react';
import { NoteItem } from '../../types';
import { INITIAL_NOTES } from '../../data/templates';

export const NotesDemo: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [selectedNote, setSelectedNote] = useState<NoteItem>(notes[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [copied, setCopied] = useState(false);

  const addNote = () => {
    const freshNote: NoteItem = {
      id: Date.now().toString(),
      title: 'Catatan Baru',
      content: 'Tuliskan ide, catatan pertemuan, atau rencana baru di sini...',
      tags: ['Draf'],
      updatedAt: 'Baru saja',
    };
    setNotes([freshNote, ...notes]);
    setSelectedNote(freshNote);
  };

  const updateCurrentNote = (field: 'title' | 'content', value: string) => {
    if (!selectedNote) return;
    const updated = { ...selectedNote, [field]: value, updatedAt: 'Baru saja' };
    setSelectedNote(updated);
    setNotes(notes.map(n => n.id === selectedNote.id ? updated : n));
  };

  const deleteCurrentNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (filtered.length > 0) {
      setSelectedNote(filtered[0]);
    }
  };

  const handleCopy = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(`${selectedNote.title}\n\n${selectedNote.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Catatan Pintar & Manajemen Ide</h3>
          <p className="text-sm text-slate-500">Tulis dokumen, simpan rangkuman rapat, dan kelola ide kreatif</p>
        </div>
        <button
          onClick={addNote}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Catatan Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Note List Sidebar */}
        <div className="md:col-span-4 space-y-2 border-r border-slate-100 pr-0 md:pr-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daftar Dokumen</span>
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedNote?.id === note.id
                    ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-900 truncate">{note.title || 'Tanpa Judul'}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{note.content}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                  <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
                  <div className="flex gap-1">
                    {note.tags.map(t => (
                      <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200/60 text-slate-600 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Editor Area */}
        <div className="md:col-span-8 flex flex-col gap-3">
          {selectedNote ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateCurrentNote('title', e.target.value)}
                  className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-1 w-full"
                  placeholder="Judul catatan..."
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 text-xs flex items-center gap-1"
                    title="Salin teks"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="text-[11px]">{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                  {notes.length > 1 && (
                    <button
                      onClick={() => deleteCurrentNote(selectedNote.id)}
                      className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={selectedNote.content}
                onChange={(e) => updateCurrentNote('content', e.target.value)}
                rows={8}
                className="w-full p-3.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed resize-none"
                placeholder="Tuliskan isi catatan lengkap di sini..."
              />
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Pilih atau buat catatan baru
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
