import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  task?: any;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit, task }: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setAssignee(task.assignee_id || '');
      setDueDate(task.due_date || '');
    }
  }, [task]);

  if (!isOpen) return null;

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      onSubmit({ 
        title, 
        description,
        status,
        priority, 
        assignee_id: assignee || null,
        due_date: dueDate || null,
        id: task?.id ||  crypto.randomUUID() 
      });
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setAssignee('');
      setDueDate('')
      setLoading(false);
      onClose();
    }, 500);
  };

  

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-lg max-h-[100vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <input 
              autoFocus required
              className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Design solar grid dashboard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className='flex gap-4'>
            <div className='w-1/2'>
              <label className='block text-sm font-medium mb-1'>
                Status
              </label>
              <select
                className="w-full p-3 rounded-lg border border-slate-200"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className='w-1/2'>
              <label className='block text-sm font-medium mb-1'>
                Priority
              </label>
              <select 
                className="w-full p-3 rounded-lg border border-slate-200"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className='flex gap-4'>
            <div className='w-1/2'>
              <label className='block text-sm font-medium mb-1'>
                Assignee
              </label>
              <input
                className="w-full p-3 rounded-lg border border-slate-200"
                placeholder="Optional"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-slate-200"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>


          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold p-3 rounded-lg hover:bg-emerald-700 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}