import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  FileText, 
  Plus, 
  Search, 
  CheckSquare, 
  Square, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  CheckCircle2, 
  X, 
  FolderLock,
  Tag,
  Clock,
  ExternalLink
} from 'lucide-react';

interface StudentNote {
  id: string;
  title: string;
  category: 'all' | 'courses' | 'todo' | 'internship' | 'personal';
  tag: string;
  tagColor: string;
  date: string;
  content: string;
  isTodo?: boolean;
  todos?: { text: string; completed: boolean }[];
}

export const DisguiseOverlay: React.FC = () => {
  const { disguiseActive, setDisguiseActive, pinCode } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);

  // New note form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Study Notes');

  // Initial realistic student notes (Clean 3 tiles for demo)
  const [notes, setNotes] = useState<StudentNote[]>([
    {
      id: 'note-1',
      title: 'DBMS & SQL Normalization Notes',
      category: 'courses',
      tag: 'CS302 • Midterm Review',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      date: 'Today, 10:45 AM',
      content: '1NF: Atomic attribute values only.\n2NF: In 1NF and no partial dependencies on composite primary keys.\n3NF: In 2NF and no transitive functional dependencies.\nBCNF: Strict 3NF where every determinant is a candidate key.\nACID properties: Atomicity, Consistency, Isolation, Durability.'
    },
    {
      id: 'note-2',
      title: 'Semester Tasks & Internship Checklist',
      category: 'todo',
      tag: 'Career & Placement Cell',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200/60',
      date: 'Today, 8:30 AM',
      content: 'Weekly student deliverables:',
      isTodo: true,
      todos: [
        { text: 'Update resume with React & FastAPI projects', completed: true },
        { text: 'Request recommendation letter from Dr. Sudha', completed: true },
        { text: 'Review Apex Global internship guidelines', completed: false },
        { text: 'Practice SQL queries and data structure problems', completed: false }
      ]
    }
  ]);

  if (!disguiseActive) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === pinCode || pinInput === '2026') {
      setDisguiseActive(false);
      setPinInput('');
      setShowPinModal(false);
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
      setPinInput('');
    }
  };

  const toggleTodo = (noteId: string, todoIndex: number) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId || !n.todos) return n;
      const updatedTodos = [...n.todos];
      updatedTodos[todoIndex] = {
        ...updatedTodos[todoIndex],
        completed: !updatedTodos[todoIndex].completed
      };
      return { ...n, todos: updatedTodos };
    }));
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newNote: StudentNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      category: 'courses',
      tag: newTag || 'Course Notes',
      tagColor: 'bg-stone-100 text-stone-800 border-stone-200',
      date: 'Just now',
      content: newContent.trim() || 'No additional content.'
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setShowNewNoteModal(false);
  };

  const filteredNotes = notes.filter(n => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#FBFBFA] flex flex-col font-sans select-none overflow-y-auto text-slate-800">
      
      {/* Top Header of Student Notes App */}
      <header className="border-b border-stone-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        
        {/* App Logo & Notes Header */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 border border-amber-200/70 flex items-center justify-center text-amber-800 shadow-xs">
            <FileText className="w-4 h-4 text-amber-700" />
          </div>
          <h1 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight">Notes</h1>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or to-dos..." 
              className="pl-8 pr-3 py-1.5 rounded-full bg-stone-100 text-xs border border-stone-200 focus:outline-none focus:bg-white focus:border-stone-400 w-36 sm:w-56 text-stone-800 transition-all"
            />
          </div>

          {/* New Note Button */}
          <button 
            onClick={() => setShowNewNoteModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          {/* Discreet Vault / Private Folder Button (The Secret Door back to Aawaz) */}
          <button 
            onClick={() => setShowPinModal(true)}
            title="Open locked folder"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline">Locked Notes</span>
          </button>

          {/* Emergency Clear & Leave to Google */}
          <button 
            onClick={() => {
              sessionStorage.clear();
              window.location.href = 'https://www.google.com';
            }}
            title="Immediately clear session and open Google"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors"
          >
            <span>Leave</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Main Student Workspace */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 space-y-6">
        
        {/* Category Filters Bar */}
        <div className="flex items-center justify-between overflow-x-auto pb-1 scrollbar-none gap-2">
          <div className="flex items-center space-x-1.5 p-1 bg-stone-100/90 rounded-xl border border-stone-200/70 shrink-0">
            {[
              { id: 'all', label: 'All Notes', count: notes.length },
              { id: 'courses', label: 'Study Notes', count: notes.filter(n => n.category === 'courses').length },
              { id: 'todo', label: 'To-Do List', count: notes.filter(n => n.category === 'todo').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === tab.id ? 'bg-stone-100 text-stone-700 font-bold' : 'text-stone-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-400 shrink-0 hidden md:block">
            {filteredNotes.length} notes found
          </span>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredNotes.map(note => (
            <div 
              key={note.id} 
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Note Meta Header */}
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${note.tagColor}`}>
                    {note.tag}
                  </span>
                  <span className="text-[11px] text-stone-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{note.date}</span>
                  </span>
                </div>

                {/* Note Title */}
                <h3 className="text-sm font-semibold text-stone-900 mb-2 leading-snug">
                  {note.title}
                </h3>

                {/* Note Body or To-Do Checklist */}
                {note.isTodo && note.todos ? (
                  <div className="space-y-2 mt-2">
                    {note.todos.map((todo, idx) => (
                      <div 
                        key={idx}
                        onClick={() => toggleTodo(note.id, idx)}
                        className="flex items-start space-x-2.5 cursor-pointer text-xs text-stone-700 hover:text-stone-950 group select-none"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-stone-300 shrink-0 mt-0.5 group-hover:border-stone-500 bg-white" />
                        )}
                        <span className={todo.completed ? 'line-through text-stone-400' : 'text-stone-700'}>
                          {todo.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line line-clamp-6 font-mono sm:font-sans">
                    {note.content}
                  </p>
                )}
              </div>

              {/* Note Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>{note.isTodo ? `${note.todos?.filter(t => t.completed).length} of ${note.todos?.length} done` : `${note.content.length} chars`}</span>
                <span className="hover:text-stone-600 cursor-pointer">Edit Note</span>
              </div>
            </div>
          ))}

          {/* Locked Confidential Notes Placeholder (Discreet backdoor) */}
          <div 
            onClick={() => setShowPinModal(true)}
            className="bg-stone-50/70 rounded-2xl p-6 border border-dashed border-stone-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-stone-100/70 hover:border-stone-400 transition-all group min-h-[220px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 mb-3 group-hover:scale-105 group-hover:border-stone-400 transition-all shadow-xs">
              <FolderLock className="w-5 h-5 text-stone-600" />
            </div>
            <h4 className="text-xs font-semibold text-stone-800 mb-1">Protected Notes Folder</h4>
            <p className="text-[11px] text-stone-500 max-w-[200px]">
              Tap to enter PIN and unlock private records
            </p>
          </div>
        </div>

      </main>

      {/* Quick Add Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-semibold text-stone-800">Add New Note</h3>
              <button onClick={() => setShowNewNoteModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-stone-600">Note Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Algorithm Analysis Lab 4"
                  className="w-full mt-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-600">Tag / Subject</label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. CS301 • Algorithms"
                  className="w-full mt-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-stone-600">Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your study notes or checklist..."
                  className="w-full mt-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-black"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secret PIN Entry Modal (To return back to Aawaz) */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 ${errorShake ? 'animate-bounce' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-stone-700" />
                <h3 className="text-sm font-semibold text-stone-800">Unlock Protected Notes</h3>
              </div>
              <button 
                onClick={() => setShowPinModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Enter security PIN to exit notes and return to Aawaz. (Default PIN: <span className="font-mono font-medium text-stone-800">2026</span>)
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.5em] py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 font-mono text-stone-800"
              />

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-black"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
