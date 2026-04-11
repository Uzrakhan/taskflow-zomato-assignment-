import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2,ChevronRight, Clock, CheckCircle2, Circle, AlertCircle, Loader2, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import CreateTaskModal from '../components/CreateTaskModal';
import { useState } from 'react';

export default function ProjectDetail() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const queryClient = useQueryClient();

  const handleCreateTask = async (newTask: any) => {
  // 1. Ensure the task has a status and ID so it's not invisible
  const taskToSave = {
    ...newTask,
    id: newTask.id || crypto.randomUUID(),
    status: newTask.status || 'todo'
  };

  try {
    if (selectedTask) {
      await fetch(`http://localhost:4000/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSave)
      });
    } else {
      await fetch(`http://localhost:4000/projects/${id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSave)
      });
    }

    // 3. Small buffer to ensure LocalStorage write is committed
    await new Promise(resolve => setTimeout(resolve, 100));

    // 4. Force RE-FETCH of the project data
    // This will pull the updated 'tasks' array from MSW
    queryClient.setQueryData(['project', id], (oldData: any) => {
      const existingTasks = oldData?.tasks || [];

      const updatedTasks = existingTasks.some((t: any) => t.id === taskToSave.id)
        ? existingTasks.map((t: any) => 
            t.id === taskToSave.id ? taskToSave : t
          )
        : [...existingTasks, taskToSave]
      return {
        ...oldData,
        tasks: updatedTasks
      };
    });    
    // Close modal
    setIsModalOpen(false);
  } catch (error) {
    console.error("Error saving task:", error);
  }
  };

  const handleDeleteTask = async (taskId : string) => {
    try{
      await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "DELETE"
      })

      queryClient.setQueryData(['project', id], (oldData: any) => {
        return {
          ...oldData,
          tasks: oldData.tasks.filter((t: any) => t.id !== taskId)
        }
      })
    } catch(error) {
      console.error('Error deleting the task: ', error)
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4000/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    }
  });

  if (error) {
    return <div className="text-red-500 p-4">Something went wrong</div>;
  }

  const tasks = data?.tasks || [];
  const columns = [
    { title: 'To Do', status: 'todo', icon: <Circle size={18} className="text-slate-400" /> },
    { title: 'In Progress', status: 'in_progress', icon: <Clock size={18} className="text-amber-500" /> },
    { title: 'Done', status: 'done', icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const filteredTasks = tasks.filter((task: any) => {
    const statusMatch = statusFilter ? task.status === statusFilter : true;

    const assigneeMatch = assigneeFilter
      ? task.assignee_id?.toLowerCase().includes(assigneeFilter.toLowerCase())
      : true;

    return statusMatch && assigneeMatch;
  });


  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/projects" className="hover:text-emerald-600 transition-colors">Projects</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">{data?.name}</span>
        </nav>

        {/* Header Section  */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">{data?.name}</h1>
            <p className="text-slate-500 max-w-2xl">{data?.description}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
  
          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* ASSIGNEE FILTER */}
          <input
            type="text"
            placeholder="Filter by assignee"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="p-2 border rounded-lg"
          />

          <button
            onClick={() => {
              setStatusFilter('');
              setAssigneeFilter('');
            }}
            className="text-sm text-emerald-600"
          >
            Clear Filters
          </button>
        </div>


        {/* Kanban Board Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.status} className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-6 px-2">
                {col.icon}
                <h2 className="font-bold text-slate-700">{col.title}</h2>
                <span className="ml-auto bg-white px-2 py-0.5 rounded-md text-xs font-bold text-slate-400 border border-slate-200">
                  {filteredTasks.filter((t: any) => t.status === col.status).length}
                </span>
              </div>

              <div className="space-y-4">
                {filteredTasks
                  .filter((task: any) => task.status === col.status)
                  .map((task: any) => (
                    <div 
                      key={task.id} 
                      onClick={() => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                      }}
                      className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all group relative"
                    >
                      <h4 className="font-semibold text-slate-800 leading-tight mb-4">{task.title}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // ❗ prevents opening edit modal
                          handleDeleteTask(task.id);
                        }}
                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md flex items-center gap-1 
                          ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 
                            task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 
                            'bg-emerald-50 text-emerald-600'}`}>
                          <AlertCircle size={10} />
                          {task.priority}
                        </span>
                        
                        {task.assignee_id && (
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                              👤 {task.assignee_id}
                            </span>
                          )}
                        {task.due_date && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock size={12} />
                            {new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                {filteredTasks.filter((t: any) => t.status === col.status).length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                    <p className="text-sm text-slate-400">No tasks in {col.title}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleCreateTask}
        task={selectedTask} 
      />
    </>
  );
}