import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: any) => void;
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      onSubmit({ 
        id: Math.random().toString(), 
        name, 
        description, 
        created_at: new Date().toISOString() 
      });
      setLoading(false);
      onClose();
      setName('');
      setDescription('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Launch New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input 
              autoFocus required
              className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Solar Initiative 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
              placeholder="What is the goal of this project?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold p-3 rounded-lg hover:bg-emerald-700 flex justify-center transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
}