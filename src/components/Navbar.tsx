import { useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
        <Leaf fill="currentColor" />
        <span>TaskFlow</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
          <User size={16} />
          {user.name || 'Engineer'}
        </div>
        <button 
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-600 transition-colors p-1"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}