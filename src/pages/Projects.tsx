import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Folder, Loader2 } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import Navbar from '../components/Navbar';

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  if (error) {
    return <div className="text-red-500 p-4">Something went wrong</div>;
  }

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        
        {/* 🔥 HEADER */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
            <p className="text-slate-500 text-sm sm:text-base">
              Manage your climate impact goals
            </p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> New Project
          </button>
        </header>

        {/* 🔥 LOADING */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : (
          
          /* 🔥 GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {data?.projects?.map((project: any) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.id}`}
                className="p-4 sm:p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
              >
                <Folder className="text-emerald-600 mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">
                  {project.name}
                </h3>
                
                <p className="text-slate-500 text-xs sm:text-sm line-clamp-2">
                  {project.description}
                </p>
              </Link>
            ))}

            {/* 🔥 EMPTY STATE */}
            {data?.projects?.length === 0 && (
              <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400">
                  No projects yet. Create your first project 🚀
                </p>
              </div>
            )}
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