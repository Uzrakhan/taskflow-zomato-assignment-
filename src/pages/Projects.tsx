import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Folder, Loader2 } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  const handleCreateProject = async (newProject: any) => {
    // Optimistic Update for Projects List
    queryClient.setQueryData(['projects'], (old: any) => ({
      ...old,
      projects: [newProject, ...(old?.projects || [])]
    }));

    await fetch('http://localhost:4000/projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
        headers: { 'Content-Type': 'application/json' }
    });

    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-slate-500">Manage your climate impact goals</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> New Project
          </button>
        </header>

        {isLoading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.projects?.map((project: any) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.id}`}
                className="p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
              >
                <Folder className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateProject}
      />
    </>
  );
}